const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 600 },
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // 1. Check Root Horizontal Overflow
    const overflowInfo = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const bodyW = document.body.scrollWidth;

      // Find overflowing elements
      const overflowingElements = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'HEAD') continue;
        const rect = el.getBoundingClientRect();
        // check if visible and outside viewport bounds
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
        if (rect.width > 0 && rect.height > 0) {
          if (rect.right > winW + 1.5 && !['DIALOG', 'BODY', 'HTML'].includes(el.tagName)) {
            // Check if parent has overflow-x auto or hidden
            let parent = el.parentElement;
            let clipped = false;
            while (parent && parent !== document.body) {
              const pStyle = window.getComputedStyle(parent);
              if (['hidden', 'auto', 'scroll'].includes(pStyle.overflowX)) {
                clipped = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!clipped) {
              overflowingElements.push({
                tag: el.tagName,
                id: el.id || '',
                className: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              });
            }
          }
        }
      }
      return {
        hasOverflow: docW > winW || bodyW > winW,
        scrollWidth: docW,
        windowWidth: winW,
        overflowingCount: overflowingElements.length,
        overflowingSample: overflowingElements.slice(0, 5),
      };
    });

    // 2. Check Touch Targets for mobile/tablet (<= 768px)
    let touchTargetIssues = [];
    if (vp.width <= 768) {
      touchTargetIssues = await page.evaluate(() => {
        const issues = [];
        const interactives = document.querySelectorAll('button, a, input, select, [role="button"], [role="tab"]');
        for (const el of interactives) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
          if (el.closest('dialog:not([open])')) continue; // Skip closed modals
          // Skip links within text paragraphs or breadcrumbs
          if (el.tagName === 'A' && el.closest('p, .hero-ticker-pill, .footer-links-list')) continue;

          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Flag if both dimensions are significantly below 44px without padding
            if (rect.width < 32 || rect.height < 32) {
              issues.push({
                tag: el.tagName,
                id: el.id,
                className: typeof el.className === 'string' ? el.className.slice(0, 30) : '',
                text: el.innerText ? el.innerText.trim().slice(0, 20) : '',
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              });
            }
          }
        }
        return issues.slice(0, 8);
      });
    }

    // 3. Test Modal Adaptation
    let modalTest = null;
    try {
      await page.evaluate(() => {
        if (typeof openProductDetails === 'function') {
          openProductDetails('google-ai-pro-gemini-18m');
        }
      });
      await page.waitForTimeout(450);
      modalTest = await page.evaluate(() => {
        const modal = document.getElementById('productModal');
        if (!modal || !modal.open) return { open: false };
        const rect = modal.getBoundingClientRect();
        return {
          open: true,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          fitsWidth: rect.right <= window.innerWidth + 1,
          fitsHeight: rect.bottom <= window.innerHeight + 1,
        };
      });
      // Screenshot modal on 390px and 768px
      if (vp.name === 'mobile-390' || vp.name === 'tablet-768' || vp.name === 'mobile-320') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-modal.png`) });
      }
      await page.evaluate(() => {
        if (typeof closeProductDetails === 'function') closeProductDetails();
      });
      await page.waitForTimeout(450);
    } catch (e) {
      modalTest = { error: e.message };
    }

    // 4. Test Cart Drawer Adaptation
    let cartTest = null;
    try {
      // Add 1 item to cart first
      await page.evaluate(() => {
        if (typeof addToCart === 'function') addToCart('google-ai-pro-gemini-18m', 1);
        if (typeof openCartDrawer === 'function') openCartDrawer();
      });
      await page.waitForTimeout(450);
      cartTest = await page.evaluate(() => {
        const drawer = document.getElementById('cartDrawer');
        if (!drawer || !drawer.open) return { open: false };
        const rect = drawer.getBoundingClientRect();
        return {
          open: true,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          fitsWidth: rect.right <= window.innerWidth + 1,
          fitsHeight: rect.bottom <= window.innerHeight + 1,
        };
      });
      if (vp.name === 'mobile-390' || vp.name === 'tablet-768' || vp.name === 'mobile-320') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-cart.png`) });
      }
      await page.evaluate(() => {
        if (typeof closeCartDrawer === 'function') closeCartDrawer();
      });
      await page.waitForTimeout(450);
    } catch (e) {
      cartTest = { error: e.message };
    }

    // 5. Test Physical Modal Adaptation
    let physModalTest = null;
    try {
      await page.evaluate(() => {
        if (typeof openPhysicalCatalogModal === 'function') openPhysicalCatalogModal();
      });
      await page.waitForTimeout(300);
      physModalTest = await page.evaluate(() => {
        const modal = document.getElementById('physicalCatalogModal');
        if (!modal || !modal.open) return { open: false };
        const rect = modal.getBoundingClientRect();
        return {
          open: true,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          fitsWidth: rect.right <= window.innerWidth + 1,
          fitsHeight: rect.bottom <= window.innerHeight + 1,
        };
      });
      if (vp.name === 'mobile-390' || vp.name === 'mobile-320') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-phys-modal.png`) });
      }
      await page.evaluate(() => {
        if (typeof closePhysicalCatalogModal === 'function') closePhysicalCatalogModal();
      });
      await page.waitForTimeout(300);
    } catch (e) {
      physModalTest = { error: e.message };
    }

    // Capture Full Page Screenshot
    if (['mobile-320', 'mobile-390', 'tablet-768', 'desktop-1440'].includes(vp.name)) {
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${vp.name}-full.png`), fullPage: false });
    }

    results.push({
      viewport: vp.name,
      width: vp.width,
      overflow: overflowInfo,
      touchIssuesCount: touchTargetIssues.length,
      touchIssuesSample: touchTargetIssues,
      modalTest,
      cartTest,
      physModalTest,
    });

    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});

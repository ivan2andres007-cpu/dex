const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { name: 'iphone-375x812', width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: 'android-360x800', width: 360, height: 800, isMobile: true, hasTouch: true }
];

async function runMobileAudit() {
  const browser = await chromium.launch({ headless: true });
  const reportData = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    const vpResults = {
      overflowIssues: [],
      tapTargetIssues: [],
      states: {}
    };

    // 1. Initial Home Screen
    const homeShot = path.join(__dirname, 'screenshots', `${vp.name}-1-home.png`);
    await page.screenshot({ path: homeShot });
    vpResults.states.home = { screenshot: homeShot };

    // Check horizontal scroll / overflow
    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const elementsWithOverflow = [];
      document.querySelectorAll('*').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1 || rect.left < -1) {
          // Ignore dialogs and drawers that are hidden or offscreen
          const style = window.getComputedStyle(el);
          if (style.display !== 'none' && style.visibility !== 'hidden' && !el.closest('dialog:not([open])')) {
            elementsWithOverflow.push({
              tag: el.tagName,
              id: el.id,
              class: el.className,
              rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              docWidth
            });
          }
        }
      });
      return elementsWithOverflow;
    });
    vpResults.overflowIssues = overflowCheck;

    // 2. Open Mobile Menu
    console.log('Testing Mobile Navigation Menu...');
    await page.evaluate(() => {
      const btn = document.getElementById('mobileMenuBtn');
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    const menuShot = path.join(__dirname, 'screenshots', `${vp.name}-2-menu.png`);
    await page.screenshot({ path: menuShot });
    vpResults.states.menu = {
      screenshot: menuShot,
      isOpen: await page.evaluate(() => {
        const panel = document.getElementById('mobileNavPanel');
        return panel ? panel.classList.contains('open') : false;
      })
    };
    // Close menu
    await page.evaluate(() => {
      const closeBtn = document.getElementById('closeMobileMenuBtn') || document.getElementById('mobileMenuBtn');
      if (closeBtn) closeBtn.click();
    });
    await page.waitForTimeout(300);

    // 3. Category Tabs
    console.log('Testing Category Tabs...');
    // Click 'Hardware' tab
    await page.evaluate(() => {
      const hwTab = document.querySelector('[data-category="hardware"]') || document.querySelector('[data-agency-tab="ecommerce"]');
      if (hwTab) hwTab.click();
    });
    await page.waitForTimeout(400);
    const tabsShot = path.join(__dirname, 'screenshots', `${vp.name}-3-tabs.png`);
    await page.screenshot({ path: tabsShot });
    vpResults.states.tabs = { screenshot: tabsShot };

    // 4. Search Filter
    console.log('Testing Search Bar...');
    await page.evaluate(() => {
      const input = document.getElementById('searchInput');
      if (input) {
        input.value = 'Gemini';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.waitForTimeout(400);
    const searchShot = path.join(__dirname, 'screenshots', `${vp.name}-4-search.png`);
    await page.screenshot({ path: searchShot });
    vpResults.states.search = {
      screenshot: searchShot,
      resultCount: await page.evaluate(() => {
        return document.querySelectorAll('#productGrid .product-card:not([style*="display: none"])').length;
      })
    };
    // Clear search
    await page.evaluate(() => {
      const input = document.getElementById('searchInput');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.waitForTimeout(300);

    // 5. Product Gallery Modal (e.g. Gamepad)
    console.log('Testing Product Gallery Modal...');
    await page.evaluate(() => openProductDetails('gamepad-bluetooth-multiplataforma'));
    await page.waitForTimeout(400);
    const modalShot = path.join(__dirname, 'screenshots', `${vp.name}-5-product-modal.png`);
    await page.screenshot({ path: modalShot });
    vpResults.states.productModal = {
      screenshot: modalShot,
      metrics: await page.evaluate(() => {
        const modal = document.getElementById('productModal');
        const promo = modal ? modal.querySelector('.modal-promo-price-card') : null;
        const footer = modal ? modal.querySelector('.modal-footer') : null;
        return {
          isOpen: modal ? modal.open : false,
          modalHeight: modal ? Math.round(modal.getBoundingClientRect().height) : 0,
          promoBottom: promo ? Math.round(promo.getBoundingClientRect().bottom) : 0,
          footerTop: footer ? Math.round(footer.getBoundingClientRect().top) : 0,
          isPromoVisibleAboveFooter: promo && footer ? promo.getBoundingClientRect().bottom <= footer.getBoundingClientRect().top : false
        };
      })
    };
    // Close product modal
    await page.evaluate(() => closeProductDetails());
    await page.waitForTimeout(350);

    // 6. Cart Slide-Over Drawer
    console.log('Testing Cart Drawer...');
    // Add 1 item first so cart is not empty
    await page.evaluate(() => addToCart('gamepad-bluetooth-multiplataforma', 1));
    await page.waitForTimeout(200);
    await page.evaluate(() => openCartDrawer());
    await page.waitForTimeout(400);
    const cartShot = path.join(__dirname, 'screenshots', `${vp.name}-6-cart.png`);
    await page.screenshot({ path: cartShot });
    vpResults.states.cart = {
      screenshot: cartShot,
      metrics: await page.evaluate(() => {
        const drawer = document.getElementById('cartDrawer');
        const footer = document.querySelector('.cart-footer');
        const items = document.querySelectorAll('.cart-item');
        return {
          isOpen: drawer ? drawer.open : false,
          itemsCount: items.length,
          footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : 0,
          hasCheckoutBtn: !!document.querySelector('.btn-checkout')
        };
      })
    };
    // Close cart drawer
    await page.evaluate(() => closeCartDrawer());
    await page.waitForTimeout(300);

    // 6b. Test History Back API (Native Back Gesture dismiss)
    console.log('Testing Back Gesture on Modals...');
    await page.evaluate(() => openProductDetails('gamepad-bluetooth-multiplataforma'));
    await page.waitForTimeout(300);
    const modalOpened = await page.evaluate(() => document.getElementById('productModal').open);
    await page.goBack();
    await page.waitForTimeout(400);
    const modalClosedByBack = await page.evaluate(() => !document.getElementById('productModal').open);
    vpResults.historyBackWorks = modalOpened && modalClosedByBack;
    console.log(`History Back gesture modal dismiss working: ${vpResults.historyBackWorks}`);

    // 7. Touch targets < 44px on interactive elements
    const touchTargetIssues = await page.evaluate(() => {
      const issues = [];
      const interactives = document.querySelectorAll('button, a, input, [role="button"]');
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
          if (rect.width < 40 || rect.height < 40) {
            // filter out inline text links inside paragraphs
            if (el.tagName === 'A' && el.closest('p')) return;
            // filter carousel indicators
            if (el.classList.contains('modal-carousel-dot')) return;
            issues.push({
              tag: el.tagName,
              id: el.id,
              class: el.className,
              text: el.textContent.trim().slice(0, 30),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            });
          }
        }
      });
      return issues;
    });
    vpResults.tapTargetIssues = touchTargetIssues;

    reportData[vp.name] = vpResults;
    await context.close();
  }

  fs.writeFileSync(path.join(__dirname, 'mobile_audit_results.json'), JSON.stringify(reportData, null, 2));
  console.log('Mobile Audit Completed successfully!');
  await browser.close();
}

runMobileAudit().catch(console.error);

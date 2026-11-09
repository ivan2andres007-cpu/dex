const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  const indexPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(indexPath);
  await page.waitForLoadState('networkidle');

  // 1. Check product card clamp & height alignment
  const titles = await page.$$eval('.product-name', els => els.map(e => ({
    text: e.textContent.trim().slice(0, 30),
    height: Math.round(e.getBoundingClientRect().height)
  })));
  console.log('Product names sampled (heights):', titles.slice(0, 4));

  // 2. Check Cart Drawer overscroll-behavior
  const cartDrawerOverscroll = await page.$eval('dialog#cartDrawer', e => window.getComputedStyle(e).overscrollBehavior);
  console.log('Cart drawer overscroll-behavior:', cartDrawerOverscroll);

  // 3. Check Studio card box-shadow
  const studioCardShadow = await page.$eval('.studio-subdomain-card', e => window.getComputedStyle(e).boxShadow);
  console.log('Studio card box-shadow contains inset:', studioCardShadow.includes('inset'));

  // 4. Check focus-visible rule
  const focusRing = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes(':focus-visible')) return rule.cssText;
        }
      } catch (e) {}
    }
    return null;
  });
  console.log('Focus-visible rule active:', Boolean(focusRing));

  // 5. Open Cart drawer to verify open and close
  await page.click('#openCartBtn');
  const cartOpen = await page.$eval('dialog#cartDrawer', e => e.open);
  console.log('Cart drawer opens cleanly:', cartOpen);
  await page.click('#closeCartBtn');
  await page.waitForTimeout(350);
  const cartClosed = await page.$eval('dialog#cartDrawer', e => !e.open);
  console.log('Cart drawer closes cleanly:', cartClosed);

  // 6. Check console errors
  console.log('Total console errors:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);

  await browser.close();
})();


const { chromium } = require('playwright');
const path = require('path');

async function testCart() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Add 3 items to cart to test multi-item visibility
  await page.evaluate(() => {
    addToCart('google-ai-pro-gemini-18m', 2);
    addToCart('assetto-corsa-pc-steam', 1);
    addToCart('gamepad-bluetooth-multiplataforma', 1);
    openCartDrawer();
  });
  await page.waitForTimeout(500);

  const screenshotPath = path.join(__dirname, 'screenshots', 'mobile-390-cart-test.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  // Measure heights of drawer elements
  const metrics = await page.evaluate(() => {
    const drawer = document.getElementById('cartDrawer');
    const header = drawer.querySelector('.drawer-header');
    const reward = drawer.querySelector('.cart-reward-container');
    const content = drawer.querySelector('.drawer-content');
    const footer = drawer.querySelector('.drawer-footer');
    return {
      windowHeight: window.innerHeight,
      drawerHeight: Math.round(drawer.getBoundingClientRect().height),
      headerHeight: Math.round(header ? header.getBoundingClientRect().height : 0),
      rewardHeight: Math.round(reward ? reward.getBoundingClientRect().height : 0),
      contentHeight: Math.round(content ? content.getBoundingClientRect().height : 0),
      footerHeight: Math.round(footer ? footer.getBoundingClientRect().height : 0),
    };
  });
  console.log('Metrics before/current:', JSON.stringify(metrics, null, 2));

  await browser.close();
}

testCart().catch(err => {
  console.error(err);
  process.exit(1);
});

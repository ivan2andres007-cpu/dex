const { chromium } = require('playwright');
const path = require('path');

async function testDesktopCart() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    addToCart('google-ai-pro-gemini-18m', 2);
    addToCart('assetto-corsa-pc-steam', 1);
    openCartDrawer();
  });
  await page.waitForTimeout(500);

  const screenshotPath = path.join(__dirname, 'screenshots', 'desktop-1440-cart-verify.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved desktop verification screenshot to:', screenshotPath);

  await browser.close();
}

testDesktopCart().catch(err => {
  console.error(err);
  process.exit(1);
});

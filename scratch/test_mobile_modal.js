const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  const card = page.locator('.product-card[data-id="assetto-corsa-pc-steam"]');
  await card.locator('.card-media-preview').click();
  await page.waitForSelector('#productModal:visible');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/mobile_modal_verified.png' });
  await browser.close();
  console.log('Mobile verified');
})();


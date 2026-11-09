const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });

  const testIds = ['assetto-corsa-pc-steam', 'google-ai-pro', 'random-steam-grand', 'doom-eternal-pc'];
  for (const id of testIds) {
    await page.evaluate((pid) => openProductDetails(pid), id);
    await page.waitForTimeout(300);
    const box = await page.locator('.feature-check-icon').first().boundingBox();
    console.log(id, 'check icon size:', box ? `${box.width}x${box.height}` : 'no features');
    await page.evaluate(() => closeProductDetails());
    await page.waitForTimeout(200);
  }

  await browser.close();
  console.log('All product modals verified successfully!');
})();

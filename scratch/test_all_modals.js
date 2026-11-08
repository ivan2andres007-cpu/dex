const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 650 } });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  const productIds = [
    'assetto-corsa-pc-steam',
    'doom-eternal-pc-microsoft',
    'capcut-pro-1m',
    'amazon-prime-video-1m',
    'roblox-200-robux',
    'random-steam-gold'
  ];

  for (const id of productIds) {
    const card = page.locator(`.product-card[data-id="${id}"]`);
    if (await card.count() > 0) {
      await card.locator('.card-media-preview').click();
      await page.waitForSelector('#productModal:visible');
      await page.waitForTimeout(300);
      await page.screenshot({ path: `scratch/modal_test_${id}.png` });
      await page.locator('#modalCloseBtn').click();
      await page.waitForTimeout(300);
    }
  }

  await browser.close();
  console.log('Tested all modals via click');
})();

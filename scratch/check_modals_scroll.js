const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 650 } });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(600);

  const testIds = [
    'assetto-corsa-pc-steam',
    'doom-eternal-pc-microsoft',
    'capcut-pro-1-month',
    'amazon-prime-video-1m-perfil',
    'roblox-200-robux-global'
  ];

  for (const id of testIds) {
    const card = page.locator(`.product-card[data-id="${id}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.locator('.card-media-preview').click();
    await page.waitForSelector('#productModal:visible');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `scratch/modal_checked_${id}.png` });
    await page.locator('#modalCloseBtn').click();
    await page.waitForTimeout(400);
  }

  await browser.close();
  console.log('Checked all requested modals cleanly');
})();

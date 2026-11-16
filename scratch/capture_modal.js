const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Open modal
  const card = await page.locator('.product-card[data-id="google-ai-subscription-12m"]');
  await card.locator('.card-media-preview').click();
  await page.waitForTimeout(500);

  const modal = await page.locator('#productModal');
  await modal.screenshot({ path: 'scratch/google_ai_modal_hq.png' });
  console.log('Saved modal screenshot to scratch/google_ai_modal_hq.png');

  await browser.close();
})();

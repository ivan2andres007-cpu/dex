const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  const searchInput = await page.locator('#searchInput');
  await searchInput.fill('Gemini');
  await page.waitForTimeout(300);

  const card = await page.locator('.product-card[data-id="google-ai-pro-gemini-18m"]');
  if (await card.count() > 0) {
    await card.screenshot({ path: 'scratch/gemini_card_grid_view.png' });
    console.log('Saved Gemini card preview');
  }
  await browser.close();
})();

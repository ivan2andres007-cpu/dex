const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Scroll to catalog grid to capture both rows
  const card = page.locator('.product-card[data-id="roblox-200-robux-global"]');
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/desktop_roblox_card_view.png' });

  await browser.close();
  console.log('Saved desktop_roblox_card_view.png');
})();

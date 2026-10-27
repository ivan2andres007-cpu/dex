const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const row = page.locator('.filter-pills-row-wrapper');
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'pills_scroll_view.png') });
  await browser.close();
  console.log('Pills screenshot saved');
})();

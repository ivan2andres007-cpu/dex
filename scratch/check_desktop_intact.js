const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'desktop-check-after-all.png') });
  await browser.close();
  console.log('Desktop check screenshot saved');
})();

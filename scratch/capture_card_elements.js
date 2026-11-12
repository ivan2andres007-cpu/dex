const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const indexPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(indexPath);
  await page.waitForLoadState('networkidle');

  const digitalCard = page.locator('.digital-request-card');
  await digitalCard.screenshot({ path: 'scratch/card_digital_element.png' });

  const physCard = page.locator('.physical-request-card');
  await physCard.screenshot({ path: 'scratch/card_physical_element.png' });

  console.log('Element screenshots captured successfully');
  await browser.close();
})();


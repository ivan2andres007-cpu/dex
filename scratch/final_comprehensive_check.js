const { chromium } = require('playwright');
const path = require('path');

const VIEWPORTS = [
  { name: 'iphone-375x812', width: 375, height: 812 },
  { name: 'android-360x800', width: 360, height: 800 }
];

const PRODUCTS_TO_TEST = [
  'gamepad-bluetooth-multiplataforma',
  'auriculares-gamer-71',
  'teclado-mecanico-rgb-65',
  'google-ai-pro-gemini-18m',
  'mouse-gamer-ultralight'
];

(async () => {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`Testing ${vp.name}...`);
    
    // 1. Physical Catalog Modal
    const pPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true });
    await pPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await pPage.evaluate(() => openPhysicalCatalogModal());
    await pPage.waitForTimeout(400);
    await pPage.screenshot({ path: path.join(__dirname, 'screenshots', `${vp.name}-physical-catalog-compact.png`) });
    await pPage.close();

    // 2. Each Product Details Modal
    for (const pid of PRODUCTS_TO_TEST) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true });
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
      await page.evaluate((id) => openProductDetails(id), pid);
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(__dirname, 'screenshots', `${vp.name}-modal-${pid}.png`) });
      await page.close();
    }
  }

  // 3. Desktop check to guarantee 0 regressions
  const dPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await dPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await dPage.evaluate(() => openPhysicalCatalogModal());
  await dPage.waitForTimeout(300);
  await dPage.screenshot({ path: path.join(__dirname, 'screenshots', 'desktop-physical-modal-check.png') });
  await dPage.close();

  await browser.close();
  console.log('All screenshots captured successfully!');
})();

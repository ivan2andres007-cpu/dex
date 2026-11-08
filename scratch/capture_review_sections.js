const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Desktop Hero
  await page.screenshot({ path: path.resolve(__dirname, 'review_hero_desktop.png'), clip: { x: 0, y: 0, width: 1440, height: 850 } });

  // 2. Desktop Catalog
  const catalogEl = await page.$('#catalogo');
  if (catalogEl) {
    await catalogEl.screenshot({ path: path.resolve(__dirname, 'review_catalog_desktop.png') });
  }

  // 3. Desktop Physical
  const physEl = await page.$('#articulos-fisicos');
  if (physEl) {
    await physEl.screenshot({ path: path.resolve(__dirname, 'review_physical_desktop.png') });
  }

  // 4. Desktop Agency
  const agencyEl = await page.$('#agencia');
  if (agencyEl) {
    await agencyEl.screenshot({ path: path.resolve(__dirname, 'review_agency_desktop.png') });
  }

  // 5. Desktop Guarantees + Coming soon
  const guaranteesEl = await page.$('#garantias');
  if (guaranteesEl) {
    await guaranteesEl.screenshot({ path: path.resolve(__dirname, 'review_guarantees_desktop.png') });
  }

  // 6. Modal test - open Google AI Pro or Steam Gold
  await page.evaluate(() => {
    if (typeof openProductDetails === 'function') {
      openProductDetails('google-ai-pro-gemini-18m');
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, 'review_modal_gemini.png') });

  // Close modal
  await page.evaluate(() => {
    const m = document.getElementById('productModal');
    if (m && m.close) m.close();
  });
  await page.waitForTimeout(300);

  // Open Physical Catalog Modal
  await page.evaluate(() => {
    if (typeof openPhysicalCatalogModal === 'function') {
      openPhysicalCatalogModal();
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, 'review_modal_physical_catalog.png') });

  // Mobile viewport
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(filePath, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);

  await mobilePage.screenshot({ path: path.resolve(__dirname, 'review_mobile_hero.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
  
  // scroll mobile to catalog
  await mobilePage.evaluate(() => {
    document.getElementById('catalogo').scrollIntoView();
  });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.resolve(__dirname, 'review_mobile_catalog.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });

  await browser.close();
  console.log('Screenshots captured successfully!');
})();

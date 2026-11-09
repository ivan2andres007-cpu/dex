const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('ERR_FILE_NOT_FOUND')) {
      errors.push(msg.text());
    }
  });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // Open Assetto Corsa modal
  await page.evaluate(() => {
    openProductDetails('assetto-corsa-pc-steam');
  });
  await page.waitForTimeout(500);

  const modal = page.locator('#productModal');
  const isVisible = await modal.isVisible();
  console.log('Modal visible:', isVisible);

  // Check feature-check-icon size
  const icon = page.locator('.feature-check-icon').first();
  const iconBox = await icon.boundingBox();
  console.log('Feature check icon bounding box:', iconBox);

  // Take screenshot of product modal on Desktop
  await modal.screenshot({ path: path.resolve('scratch/assetto-corsa-fixed.png') });
  console.log('Desktop screenshot saved');

  // Also check mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400);
  await modal.screenshot({ path: path.resolve('scratch/assetto-corsa-mobile.png') });
  console.log('Mobile screenshot saved');

  await browser.close();

  if (errors.length > 0) {
    console.error('Errors found:', errors);
    process.exit(1);
  }
  console.log('All modal checks passed with 0 errors!');
})();

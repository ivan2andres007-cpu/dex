const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  const indexPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(indexPath);
  await page.waitForLoadState('networkidle');

  // Verify digital request card
  const digitalCard = await page.$('.digital-request-card');
  console.log('Digital card exists:', Boolean(digitalCard));
  const digitalHref = await page.$eval('.digital-request-card a', a => a.href);
  console.log('Digital card WhatsApp URL:', digitalHref.slice(0, 60) + '...');

  // Verify physical request card
  const physicalCard = await page.$('.physical-request-card');
  console.log('Physical card exists:', Boolean(physicalCard));
  const physicalHref = await page.$eval('.physical-request-card a', a => a.href);
  console.log('Physical card WhatsApp URL:', physicalHref.slice(0, 60) + '...');

  // Take desktop screenshot of digital catalog with banner
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'scratch/screenshot_catalog_digital.png' });

  // Take desktop screenshot of physical section with banner
  await page.locator('#articulos-fisicos').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'scratch/screenshot_catalog_physical.png' });

  // Mobile screenshots
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.digital-request-card').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'scratch/screenshot_mobile_digital_banner.png' });

  await page.locator('.physical-request-card').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'scratch/screenshot_mobile_physical_banner.png' });

  console.log('Total console errors:', errors.length);
  if (errors.length > 0) console.log('Errors:', errors);

  await browser.close();
})();


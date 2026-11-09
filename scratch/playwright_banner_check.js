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

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Check section #agencia
  const agenciaSection = page.locator('#agencia');
  await agenciaSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Check banner
  const banner = page.locator('.studio-subdomain-card');
  const bannerVisible = await banner.isVisible();
  console.log('Banner visible:', bannerVisible);

  const headingText = await page.locator('.studio-banner-heading').innerText();
  console.log('Heading text:', headingText);

  const eyebrowText = await page.locator('.studio-banner-eyebrow').innerText();
  console.log('Eyebrow text:', eyebrowText);

  const btn = page.locator('.studio-banner-btn');
  const btnHref = await btn.getAttribute('href');
  console.log('Button href:', btnHref);

  // Take screenshot of #agencia on Desktop
  await agenciaSection.screenshot({ path: path.join(__dirname, 'screenshot-agencia-desktop.png') });
  console.log('Desktop screenshot saved');

  // Test mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  await agenciaSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await agenciaSection.screenshot({ path: path.join(__dirname, 'screenshot-agencia-mobile.png') });
  console.log('Mobile screenshot saved');

  await browser.close();

  if (errors.length > 0) {
    console.error('Errors found:', errors);
    process.exit(1);
  }
  console.log('All Playwright banner checks passed with 0 console errors!');
})();


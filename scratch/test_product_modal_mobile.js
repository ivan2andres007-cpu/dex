const { chromium } = require('playwright');
const path = require('path');

async function testModal() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Open the exact product from user screenshot: Gamepad
  await page.evaluate(() => {
    openProductDetails('gamepad-bluetooth-multiplataforma');
  });
  await page.waitForTimeout(500);

  const screenshotPath = path.join(__dirname, 'screenshots', 'mobile-390-modal-gamepad.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  const metrics = await page.evaluate(() => {
    const modal = document.getElementById('productModal');
    const rect = modal.getBoundingClientRect();
    const header = modal.querySelector('.modal-header');
    const body = modal.querySelector('.modal-body');
    const footer = modal.querySelector('.modal-footer');
    const media = modal.querySelector('.modal-media-frame');
    return {
      windowHeight: window.innerHeight,
      modalTop: Math.round(rect.top),
      modalHeight: Math.round(rect.height),
      modalMaxHeightPct: Math.round((rect.height / window.innerHeight) * 100),
      headerHeight: Math.round(header ? header.getBoundingClientRect().height : 0),
      mediaHeight: Math.round(media ? media.getBoundingClientRect().height : 0),
      footerHeight: Math.round(footer ? footer.getBoundingClientRect().height : 0),
    };
  });
  console.log('Metrics current:', JSON.stringify(metrics, null, 2));

  await browser.close();
}

testModal().catch(err => {
  console.error(err);
  process.exit(1);
});

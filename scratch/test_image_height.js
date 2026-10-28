const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Add the test CSS
  await page.addStyleTag({
    content: `
      @media (max-width: 768px) {
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-container {
          height: 275px !important;
          max-height: 275px !important;
        }
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-slide img,
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-img {
          max-height: 265px !important;
        }
      }
    `
  });

  const products = [
    'gamepad-bluetooth-multiplataforma',
    'auriculares-gamer-71',
    'teclado-mecanico-rgb-65',
    'google-ai-pro-gemini-18m'
  ];

  for (const id of products) {
    await page.evaluate((pid) => openProductDetails(pid), id);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `scratch/screenshots/test-fix-${id}.png` });
    await page.evaluate(() => closeProductDetails(false));
    await page.waitForTimeout(300);
  }

  await browser.close();
  console.log('Screenshots taken');
})();

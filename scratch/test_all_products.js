const { chromium } = require('playwright');
const path = require('path');

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const productIds = [
    'google-ai-pro-gemini-18m',
    'assetto-corsa-pc-steam',
    'random-steam-grand',
    'gamepad-bluetooth-multiplataforma',
    'auriculares-gamer-71',
    'teclado-mecanico-rgb-65',
    'mouse-gamer-ultralight'
  ];

  const results = {};
  for (const id of productIds) {
    await page.evaluate((pid) => openProductDetails(pid), id);
    await page.waitForTimeout(400);
    const shotPath = path.join(__dirname, 'screenshots', `product-${id}.png`);
    await page.screenshot({ path: shotPath });
    const data = await page.evaluate(() => {
      const modal = document.getElementById('productModal');
      const carousel = document.querySelector('.modal-carousel-container');
      const img = document.querySelector('.modal-carousel-img') || document.querySelector('.modal-media-art');
      const promo = document.querySelector('.modal-promo-price-card');
      const footer = document.querySelector('.modal-footer');
      const title = document.querySelector('.modal-pro-title');
      return {
        carouselHeight: carousel ? Math.round(carousel.getBoundingClientRect().height) : null,
        imgHeight: img ? Math.round(img.getBoundingClientRect().height) : null,
        imgWidth: img ? Math.round(img.getBoundingClientRect().width) : null,
        titleHeight: title ? Math.round(title.getBoundingClientRect().height) : null,
        promoTop: promo ? Math.round(promo.getBoundingClientRect().top) : null,
        promoHeight: promo ? Math.round(promo.getBoundingClientRect().height) : null,
        promoBottom: promo ? Math.round(promo.getBoundingClientRect().bottom) : null,
        footerTop: footer ? Math.round(footer.getBoundingClientRect().top) : null,
        footerHeight: footer ? Math.round(footer.getBoundingClientRect().height) : null,
        isPromoVisibleAboveFooter: promo && footer ? promo.getBoundingClientRect().bottom <= footer.getBoundingClientRect().top : false
      };
    });
    results[id] = data;
    await page.evaluate(() => closeProductDetails());
    await page.waitForTimeout(300);
  }
  console.log('RESULTS:', JSON.stringify(results, null, 2));
  await browser.close();
}

testAll().catch(console.error);

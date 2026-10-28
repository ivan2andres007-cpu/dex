const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const products = [
    'gamepad-bluetooth-multiplataforma',
    'auriculares-gamer-71',
    'teclado-mecanico-rgb-65',
    'google-ai-pro-gemini-18m'
  ];

  for (const id of products) {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.evaluate((pid) => openProductDetails(pid), id);
    await page.waitForTimeout(400);

    const m = await page.evaluate(() => {
      const modal = document.getElementById('productModal');
      const carousel = modal.querySelector('.modal-carousel-container');
      const thumbs = modal.querySelector('.modal-thumbs-vertical');
      const title = modal.querySelector('.modal-pro-title');
      const promo = modal.querySelector('.modal-promo-price-card');
      const qty = modal.querySelector('.modal-qty-control');
      const summary = modal.querySelector('.modal-ai-summary-card');
      const footer = modal.querySelector('.modal-footer');
      const fTop = footer ? footer.getBoundingClientRect().top : 0;
      return {
        carouselH: carousel ? Math.round(carousel.getBoundingClientRect().height) : 0,
        carouselImgH: carousel.querySelector('img') ? Math.round(carousel.querySelector('img').getBoundingClientRect().height) : 0,
        hasThumbs: !!thumbs,
        thumbsH: thumbs ? Math.round(thumbs.getBoundingClientRect().height) : 0,
        titleH: title ? Math.round(title.getBoundingClientRect().height) : 0,
        promoH: promo ? Math.round(promo.getBoundingClientRect().height) : 0,
        qtyH: qty ? Math.round(qty.getBoundingClientRect().height) : 0,
        summaryTop: summary ? Math.round(summary.getBoundingClientRect().top) : 0,
        footerTop: Math.round(fTop),
        isSummaryVisible: summary ? summary.getBoundingClientRect().top < fTop : false,
        summaryVisiblePx: summary ? Math.max(0, Math.round(fTop - summary.getBoundingClientRect().top)) : 0
      };
    });
    console.log(id, m);
    await page.screenshot({ path: `scratch/screenshots/modal-${id}.png` });
    await page.close();
  }

  await browser.close();
})();

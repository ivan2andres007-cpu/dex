const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Test standard page at 320px (iPhone SE smallest width)
  const pageSmall = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await pageSmall.goto('http://localhost:3000');
  await pageSmall.waitForSelector('.product-card');

  // Check card heights and layout overflow
  const smallOverflow = await pageSmall.evaluate(() => {
    return {
      docScrollWidth: document.documentElement.scrollWidth,
      windowInnerWidth: window.innerWidth,
      hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('320px viewport horizontal overflow:', smallOverflow);

  // 2. Inject worst case product directly into window.PRODUCTS and re-render
  console.log('\nInjecting worst-case dataset...');
  const breaks = await pageSmall.evaluate(() => {
    const worstProduct = {
      id: 'worst-case-test',
      title: 'Google Workspace Enterprise Cloud Architecture Plus Ultra Multi-Tenant Subscription License Key Trial Edition (Global Unlimited)',
      name: 'Google Workspace Enterprise Cloud Architecture Plus Ultra Multi-Tenant Subscription License Key Trial Edition (Global Unlimited)',
      category: 'suscripcion',
      isAI: true,
      price: 12850000,
      originalPrice: 25500000,
      discountPercentage: '-50%',
      rating: '5.0',
      soldCount: '+10.450 vendidos',
      stockLeft: 0,
      image: 'imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg',
      badge: 'Garantía Extendida 24 Meses',
      badgeType: 'badge-purple',
      extraBadge: 'Soporte VIP 24/7 Internacional',
      extraBadgeType: 'badge-green',
      shortDesc: 'Descripción ultra larga con identificador_inquebrantable_sin_espacios_ABC1234567890XYZ_para_probar_overflow.',
      description: 'Descripción completa de prueba de estrés.',
      features: ['Característica 1 extremadamente detallada con terminología técnica avanzada', 'Característica 2'],
      notice: {
        title: 'Aviso con texto muy largo y requerimientos estrictos',
        type: 'notice-blue',
        items: ['Item 1', 'Item 2']
      }
    };

    const oneProduct = {
      id: 'one-stock-test',
      title: 'AI Tool',
      name: 'AI Tool',
      category: 'gaming',
      price: 5000,
      originalPrice: 5000,
      discountPercentage: null,
      rating: '4.9',
      soldCount: '1 vendido',
      stockLeft: 1,
      image: 'imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg',
      badge: 'Single',
      badgeType: 'badge-steam',
      extraBadge: null,
      shortDesc: 'Short.',
      description: 'Short.',
      features: ['Only one feature'],
      notice: null
    };

    // Prepend to PRODUCTS
    window.PRODUCTS.unshift(worstProduct, oneProduct);
    renderProducts();

    const cards = document.querySelectorAll('.product-card');
    const firstCard = cards[0];
    const firstRect = firstCard.getBoundingClientRect();
    const nameEl = firstCard.querySelector('.product-name');
    const priceEl = firstCard.querySelector('.product-price-val');
    const stockEl = firstCard.querySelector('.stock-indicator');
    const badgesEl = firstCard.querySelector('.card-floating-badges');

    return {
      cardWidth: firstRect.width,
      cardHeight: firstRect.height,
      nameHeight: nameEl ? nameEl.getBoundingClientRect().height : 0,
      nameScrollHeight: nameEl ? nameEl.scrollHeight : 0,
      priceWidth: priceEl ? priceEl.getBoundingClientRect().width : 0,
      badgesCount: badgesEl ? badgesEl.children.length : 0,
      badgesVisible: badgesEl ? window.getComputedStyle(badgesEl).display : 'none',
      hasDocOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  console.log('Worst-case render at 320px:', breaks);

  // Take screenshot of worst case
  await pageSmall.screenshot({ path: 'scratch/worst_case_320.png', fullPage: false });
  console.log('Saved scratch/worst_case_320.png');

  // Open modal for worst case
  await pageSmall.evaluate(() => {
    openProductDetails('worst-case-test');
  });
  await pageSmall.waitForTimeout(400);

  const modalBreaks = await pageSmall.evaluate(() => {
    const modal = document.getElementById('productModal');
    const title = modal.querySelector('.modal-pro-title');
    const price = modal.querySelector('.modal-sale-price');
    const originalPrice = modal.querySelector('.modal-original-price');
    return {
      modalOpen: modal.open,
      titleText: title ? title.textContent.substring(0, 40) + '...' : null,
      titleHeight: title ? title.getBoundingClientRect().height : 0,
      priceText: price ? price.textContent : null,
      priceWidth: price ? price.getBoundingClientRect().width : 0,
      originalPriceText: originalPrice ? originalPrice.textContent : null,
      modalScrollWidth: modal.scrollWidth,
      modalClientWidth: modal.clientWidth,
      overflowing: modal.scrollWidth > modal.clientWidth
    };
  });
  console.log('Modal worst-case inspection:', modalBreaks);
  await pageSmall.screenshot({ path: 'scratch/modal_worst_case_320.png', fullPage: false });

  await browser.close();
})();

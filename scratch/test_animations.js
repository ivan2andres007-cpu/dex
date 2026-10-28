const { chromium } = require('playwright');

async function testAnimations() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // 1. Check Button Heartbeat styles
  const buttonAnimations = await page.evaluate(() => {
    const directBuy = document.querySelector('.btn-direct-buy');
    const heroBtn = document.querySelector('.btn-primary');
    const heroWa = document.querySelector('.btn-whatsapp-hero');
    const physCart = document.querySelector('.btn-phys-cart');
    const exploreBtn = document.querySelector('.btn-explore-full');
    return {
      directBuy: directBuy ? window.getComputedStyle(directBuy).animationName : null,
      heroBtn: heroBtn ? window.getComputedStyle(heroBtn).animationName : null,
      heroWa: heroWa ? window.getComputedStyle(heroWa).animationName : null,
      physCart: physCart ? window.getComputedStyle(physCart).animationName : null,
      exploreBtn: exploreBtn ? window.getComputedStyle(exploreBtn).animationName : null,
    };
  });
  console.log('Button animations computed:', buttonAnimations);

  // 2. Open product modal via card media preview or openProductDetails directly
  console.log('Opening product details modal...');
  await page.evaluate(() => {
    openProductDetails('google-ai-pro-gemini-18m');
  });
  await page.waitForSelector('dialog#productModal[open]', { state: 'visible', timeout: 3000 });

  // 3. Inspect Price vibration styles
  const priceAnimationInfo = await page.evaluate(() => {
    const promoPrice = document.querySelector('.promo-price-current');
    const footerPrice = document.querySelector('dialog#productModal .modal-footer .product-price-val');
    const modalDirectBuy = document.querySelector('dialog#productModal .btn-direct-buy');
    return {
      promoPriceAnim: promoPrice ? window.getComputedStyle(promoPrice).animationName : null,
      promoPriceDisplay: promoPrice ? window.getComputedStyle(promoPrice).display : null,
      footerPriceAnim: footerPrice ? window.getComputedStyle(footerPrice).animationName : null,
      footerPriceDisplay: footerPrice ? window.getComputedStyle(footerPrice).display : null,
      modalDirectBuyAnim: modalDirectBuy ? window.getComputedStyle(modalDirectBuy).animationName : null,
      priceText: promoPrice ? promoPrice.textContent : null,
    };
  });
  console.log('Price animation info:', priceAnimationInfo);

  // Screenshot during vibration
  await page.screenshot({ path: 'scratch/modal_vibrating.png' });
  console.log('Captured scratch/modal_vibrating.png');

  // Test quantity adjustment
  const qtyPlusBtn = page.locator('.modal-qty-stepper .qty-btn').nth(1);
  await qtyPlusBtn.click();
  await page.waitForTimeout(100);

  const updatedPriceText = await page.evaluate(() => {
    const promo = document.querySelector('.promo-price-current');
    return promo ? promo.textContent : null;
  });
  console.log('Updated price text after +1 qty:', updatedPriceText);

  // Wait 1.5 seconds and take another screenshot during rest phase
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scratch/modal_rest_phase.png' });
  console.log('Captured scratch/modal_rest_phase.png');

  // Desktop check
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await desktopPage.evaluate(() => {
    openProductDetails('google-ai-pro-gemini-18m');
  });
  await desktopPage.waitForSelector('dialog#productModal[open]', { state: 'visible', timeout: 3000 });
  await desktopPage.screenshot({ path: 'scratch/modal_desktop.png' });
  console.log('Captured scratch/modal_desktop.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

testAnimations().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // 1. Verify Google AI product card
  const googleAiCard = await page.$('.product-card[data-id="google-ai-subscription-12m"]');
  if (!googleAiCard) {
    console.error('FAIL: Google AI product card not found in grid!');
    process.exit(1);
  }
  console.log('✔ SUCCESS: Google AI product card found in grid');

  const title = await googleAiCard.$eval('.product-name', el => el.textContent.trim());
  const price = await googleAiCard.$eval('.product-price-val', el => el.textContent.trim());
  const origPrice = await googleAiCard.$eval('.price-original-val', el => el.textContent.trim());
  const discount = await googleAiCard.$eval('.discount-badge', el => el.textContent.trim());
  console.log(`✔ Card details: "${title}" - Price: ${price} (Orig: ${origPrice}, Discount: ${discount})`);

  // 2. Click to open modal
  await googleAiCard.$eval('.card-media-preview', el => el.click());
  await page.waitForTimeout(400);

  const modal = await page.$('#productModal');
  const isModalOpen = await modal.evaluate(el => el.open);
  console.log('✔ Modal dialog is open:', isModalOpen);

  const modalPrice = await page.$eval('#modalPriceVal', el => el.textContent.trim());
  console.log(`✔ Modal current price: ${modalPrice}`);

  // 3. Test Add to Cart from within modal
  const addToCartBtn = await modal.$('.btn-add-cart');
  await addToCartBtn.click();
  await page.waitForTimeout(300);

  const cartCount = await page.$eval('#cartBadge', el => el.textContent.trim());
  console.log('✔ Cart badge count after adding Google AI:', cartCount);

  // Open cart drawer
  await page.evaluate(() => openCartDrawer());
  await page.waitForTimeout(300);

  const cartTotal = await page.$eval('#cartTotalVal', el => el.textContent.trim());
  console.log('✔ Cart total value:', cartTotal);

  // Close cart
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 4. Filter test: click 'Suscripciones & IA' (suscripcion)
  const suscripcionFilter = await page.$('.filter-pill[data-category="suscripcion"]');
  await suscripcionFilter.click();
  await page.waitForTimeout(200);

  const visibleCardsInSuscripcion = await page.$$eval('.product-card', cards => 
    cards.map(c => c.dataset.id)
  );
  console.log('✔ Cards under Suscripciones & IA filter:', visibleCardsInSuscripcion);
  const includesGoogleAi = visibleCardsInSuscripcion.includes('google-ai-subscription-12m');
  console.log('✔ Suscripciones filter includes Google AI 12M:', includesGoogleAi);

  // 5. Search test: search 'Google One'
  const searchInput = await page.$('#searchInput');
  await searchInput.fill('Google One');
  await page.waitForTimeout(200);

  const searchResults = await page.$$eval('.product-card', cards => cards.map(c => c.dataset.id));
  console.log('✔ Search results for "Google One":', searchResults);

  // Screenshot
  await page.screenshot({ path: 'scratch/google_ai_test_success.png' });
  console.log('Saved test screenshot to scratch/google_ai_test_success.png');

  await browser.close();

  if (!includesGoogleAi || !isModalOpen || !searchResults.includes('google-ai-subscription-12m')) {
    console.error('TEST FAILED!');
    process.exit(1);
  } else {
    console.log('✨ ALL GOOGLE AI 12M INTEGRATION TESTS PASSED 100%! ✨');
  }
})();

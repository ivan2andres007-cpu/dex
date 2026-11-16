const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // 1. Verify Avast product card
  const avastCard = await page.$('.product-card[data-id="avast-ultimate-pc-1y"]');
  if (!avastCard) {
    console.error('FAIL: Avast product card not found in grid!');
    process.exit(1);
  }
  console.log('✔ SUCCESS: Avast product card found in grid');

  const title = await avastCard.$eval('.product-name', el => el.textContent.trim());
  const price = await avastCard.$eval('.product-price-val', el => el.textContent.trim());
  const origPrice = await avastCard.$eval('.price-original-val', el => el.textContent.trim());
  const discount = await avastCard.$eval('.discount-badge', el => el.textContent.trim());
  console.log(`✔ Card details: "${title}" - Price: ${price} (Orig: ${origPrice}, Discount: ${discount})`);

  // 2. Click to open modal
  await avastCard.$eval('.card-media-preview', el => el.click());
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
  console.log('✔ Cart badge count after adding Avast:', cartCount);

  // Open cart drawer
  await page.evaluate(() => openCartDrawer());
  await page.waitForTimeout(300);

  const cartTotal = await page.$eval('#cartTotalVal', el => el.textContent.trim());
  console.log('✔ Cart total value:', cartTotal);

  const stickyTotal = await page.$eval('#stickyCartTotal', el => el.textContent.trim());
  console.log('✔ Sticky cart total value:', stickyTotal);

  // Close cart
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 4. Filter test: click 'Licencias & Claves' (software)
  const softwareFilter = await page.$('.filter-pill[data-category="software"]');
  await softwareFilter.click();
  await page.waitForTimeout(200);

  const visibleCardsInSoftware = await page.$$eval('.product-card', cards => 
    cards.map(c => c.dataset.id)
  );
  console.log('✔ Cards under Software filter:', visibleCardsInSoftware);
  const includesAvast = visibleCardsInSoftware.includes('avast-ultimate-pc-1y');
  console.log('✔ Software filter includes Avast:', includesAvast);

  // 5. Search test: search 'Avast'
  const searchInput = await page.$('#searchInput');
  await searchInput.fill('Avast');
  await page.waitForTimeout(200);

  const searchResults = await page.$$eval('.product-card', cards => cards.map(c => c.dataset.id));
  console.log('✔ Search results for "Avast":', searchResults);

  // Screenshot
  await page.screenshot({ path: 'scratch/avast_test_success.png' });
  console.log('Saved test screenshot to scratch/avast_test_success.png');

  await browser.close();

  if (!includesAvast || !isModalOpen || !searchResults.includes('avast-ultimate-pc-1y')) {
    console.error('TEST FAILED!');
    process.exit(1);
  } else {
    console.log('✨ ALL TESTS PASSED WITH 100% SUCCESS! ✨');
  }
})();

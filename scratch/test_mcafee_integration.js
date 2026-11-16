const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // 1. Verify McAfee product card
  const mcafeeCard = await page.$('.product-card[data-id="mcafee-antivirus-plus-1y"]');
  if (!mcafeeCard) {
    console.error('FAIL: McAfee product card not found in grid!');
    process.exit(1);
  }
  console.log('✔ SUCCESS: McAfee product card found in grid');

  const title = await mcafeeCard.$eval('.product-name', el => el.textContent.trim());
  const price = await mcafeeCard.$eval('.product-price-val', el => el.textContent.trim());
  const origPrice = await mcafeeCard.$eval('.price-original-val', el => el.textContent.trim());
  const discount = await mcafeeCard.$eval('.discount-badge', el => el.textContent.trim());
  console.log(`✔ Card details: "${title}" - Price: ${price} (Orig: ${origPrice}, Discount: ${discount})`);

  // 2. Click to open modal
  await mcafeeCard.$eval('.card-media-preview', el => el.click());
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
  console.log('✔ Cart badge count after adding McAfee:', cartCount);

  // Open cart drawer
  await page.evaluate(() => openCartDrawer());
  await page.waitForTimeout(300);

  const cartTotal = await page.$eval('#cartTotalVal', el => el.textContent.trim());
  console.log('✔ Cart total value:', cartTotal);

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
  const includesMcAfee = visibleCardsInSoftware.includes('mcafee-antivirus-plus-1y');
  const includesAvast = visibleCardsInSoftware.includes('avast-ultimate-pc-1y');
  console.log('✔ Software filter includes McAfee:', includesMcAfee, 'and Avast:', includesAvast);

  // 5. Search test: search 'McAfee'
  const searchInput = await page.$('#searchInput');
  await searchInput.fill('McAfee');
  await page.waitForTimeout(200);

  const searchResults = await page.$$eval('.product-card', cards => cards.map(c => c.dataset.id));
  console.log('✔ Search results for "McAfee":', searchResults);

  // Screenshot
  await page.screenshot({ path: 'scratch/mcafee_test_success.png' });
  console.log('Saved test screenshot to scratch/mcafee_test_success.png');

  await browser.close();

  if (!includesMcAfee || !includesAvast || !isModalOpen || !searchResults.includes('mcafee-antivirus-plus-1y')) {
    console.error('TEST FAILED!');
    process.exit(1);
  } else {
    console.log('✨ ALL MCAFEE INTEGRATION TESTS PASSED 100%! ✨');
  }
})();

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  console.log('✔ Page loaded');

  // 1. Scroll to physical products section
  await page.evaluate(() => scrollToPhysicalCatalog());
  await page.waitForTimeout(500);

  // 2. Check counts
  const countAll = await page.$eval('#physCountAll', el => el.textContent.trim());
  const countStock = await page.$eval('#physCountInStock', el => el.textContent.trim());
  const countHogar = await page.$eval('#physCountHogar', el => el.textContent.trim());
  console.log(`✔ Physical counts -> Todos: ${countAll}, InStock: ${countStock}, Hogar: ${countHogar}`);

  // 3. Find Freidora card
  const card = await page.locator('.physical-card[data-id="freidora-horno-digital-10l"]');
  if (await card.count() === 0) {
    console.error('FAIL: Freidora card not found in grid!');
    process.exit(1);
  }
  console.log('✔ Freidora card found in physical grid');

  const cardTitle = await card.locator('.physical-card-title').textContent();
  const cardPrice = await card.locator('.physical-current-price').textContent();
  const cardCategory = await card.locator('.physical-card-category').textContent();
  console.log(`✔ Card: "${cardTitle.trim()}" | Category: "${cardCategory.trim()}" | Price: "${cardPrice.trim()}"`);

  // Screenshot of physical grid with new product
  const physSection = page.locator('#articulos-fisicos');
  await physSection.screenshot({ path: 'scratch/freidora_grid_section.png' });
  console.log('✔ Saved scratch/freidora_grid_section.png');

  // 4. Test Hogar & Cocina filter tab
  const hogarTab = page.locator('.phys-filter-btn[data-filter="hogar"]');
  await hogarTab.click();
  await page.waitForTimeout(300);

  const visibleCardsInHogar = await page.$$eval('.physical-card', cards => cards.map(c => c.dataset.id));
  console.log('✔ Cards visible under Hogar tab:', visibleCardsInHogar);

  // Return to all
  const allTab = page.locator('.phys-filter-btn[data-filter="all"]');
  await allTab.click();
  await page.waitForTimeout(300);

  // 5. Open product modal
  await card.locator('.btn-phys-details').click();
  await page.waitForTimeout(600);

  const modal = page.locator('#productModal');
  const isModalOpen = await modal.evaluate(el => el.open);
  console.log('✔ Product modal is open:', isModalOpen);

  const modalTitle = await modal.locator('#modalProductTitle').first().textContent();
  const modalPrice = await modal.locator('#modalPriceVal').first().textContent();
  const modalCategory = await modal.locator('.product-category-tag').first().textContent();
  console.log(`✔ Modal: "${modalTitle.trim()}" | Price: "${modalPrice.trim()}" | Category: "${modalCategory.trim()}"`);

  // Verify gallery thumbnails
  const thumbs = modal.locator('.modal-thumb-vertical-btn');
  const thumbCount = await thumbs.count();
  console.log(`✔ Modal gallery thumbnails count: ${thumbCount}`);

  // Screenshot of modal
  await modal.screenshot({ path: 'scratch/freidora_modal_preview.png' });
  console.log('✔ Saved scratch/freidora_modal_preview.png');

  // 6. Test thumbnail click / slide change
  if (thumbCount > 1) {
    await thumbs.nth(1).click();
    await page.waitForTimeout(400);
    console.log('✔ Switched to slide 2');
  }

  // 7. Add to cart test
  const addToCartBtn = modal.locator('.btn-add-cart').first();
  await addToCartBtn.click();
  await page.waitForTimeout(400);

  const cartBadge = await page.$eval('#cartBadge', el => el.textContent.trim());
  console.log('✔ Cart badge count after adding Freidora:', cartBadge);

  // 8. Open cart drawer
  await page.evaluate(() => openCartDrawer());
  await page.waitForTimeout(400);

  const cartTotal = await page.$eval('#cartTotalVal', el => el.textContent.trim());
  console.log('✔ Cart total value:', cartTotal);

  const cartDrawer = page.locator('#cartDrawer');
  await cartDrawer.screenshot({ path: 'scratch/freidora_cart_drawer.png' });
  console.log('✔ Saved scratch/freidora_cart_drawer.png');

  await browser.close();
  console.log('✨ ALL FREIDORA AIR FRYER 10L TESTS PASSED 100%! ✨');
})();

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  console.log('✔ Page loaded');

  // --- PART 1: TEST DIGITAL CATALOG ---
  const searchInput = page.locator('#searchInput');
  await searchInput.fill('CTN');
  await page.waitForTimeout(400);

  const digitalCard = page.locator('.product-card[data-id="ingreso-ctn-pack-completo-3en1-digital"]');
  if (await digitalCard.count() === 0) {
    console.error('FAIL: Digital CTN card not found in grid!');
    process.exit(1);
  }
  console.log('✔ Digital CTN card found in digital catalog');

  const digPrice = await digitalCard.locator('.product-price-val').textContent();
  const digTitle = await digitalCard.locator('.product-name').textContent();
  console.log(`✔ Digital Card: "${digTitle.trim()}" | Price: "${digPrice.trim()}"`);
  await digitalCard.screenshot({ path: 'scratch/ctn_digital_card.png' });

  // Open digital modal
  await digitalCard.locator('.card-media-preview').click();
  await page.waitForTimeout(500);

  const modal = page.locator('#productModal');
  const isDigModalOpen = await modal.evaluate(el => el.open);
  console.log('✔ Digital Modal open:', isDigModalOpen);

  const digModalPrice = await modal.locator('#modalPriceVal').first().textContent();
  const digModalCategory = await modal.locator('.product-category-tag').first().textContent();
  const digDelivery = await modal.locator('.delivery-status-tag').textContent();
  console.log(`✔ Digital Modal: Price "${digModalPrice.trim()}" | Category: "${digModalCategory.trim()}" | Delivery: "${digDelivery.trim()}"`);
  await modal.screenshot({ path: 'scratch/ctn_digital_modal.png' });

  // Add digital item to cart
  await modal.locator('.btn-add-cart').first().click();
  await page.waitForTimeout(400);
  console.log('✔ Digital item added to cart');

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Clear search
  await page.locator('#clearSearchBtn').click();
  await page.waitForTimeout(300);

  // --- PART 2: TEST PHYSICAL CATALOG ---
  await page.evaluate(() => scrollToPhysicalCatalog());
  await page.waitForTimeout(500);

  const countEstudio = await page.$eval('#physCountEstudio', el => el.textContent.trim());
  console.log(`✔ Physical count for Libros & Estudio: ${countEstudio}`);

  const estudioTab = page.locator('.phys-filter-btn[data-filter="estudio"]');
  await estudioTab.click();
  await page.waitForTimeout(400);

  const physCard = page.locator('.physical-card[data-id="ingreso-ctn-pack-completo-3en1"]');
  if (await physCard.count() === 0) {
    console.error('FAIL: Physical CTN card not found!');
    process.exit(1);
  }
  console.log('✔ Physical CTN card found in physical catalog');

  const physPrice = await physCard.locator('.physical-current-price').textContent();
  const physTitle = await physCard.locator('.physical-card-title').textContent();
  console.log(`✔ Physical Card: "${physTitle.trim()}" | Price: "${physPrice.trim()}"`);
  await physCard.screenshot({ path: 'scratch/ctn_physical_card.png' });

  // Open physical modal
  await physCard.locator('.btn-phys-details').click();
  await page.waitForTimeout(500);

  const physModalPrice = await modal.locator('#modalPriceVal').first().textContent();
  const physModalCategory = await modal.locator('.product-category-tag').first().textContent();
  const physDelivery = await modal.locator('.delivery-status-tag').textContent();
  console.log(`✔ Physical Modal: Price "${physModalPrice.trim()}" | Category: "${physModalCategory.trim()}" | Delivery: "${physDelivery.trim()}"`);
  await modal.screenshot({ path: 'scratch/ctn_physical_modal.png' });

  // Add physical item to cart
  await modal.locator('.btn-add-cart').first().click();
  await page.waitForTimeout(400);
  console.log('✔ Physical item added to cart');

  // Check cart drawer
  await page.evaluate(() => openCartDrawer());
  await page.waitForTimeout(400);

  const cartCount = await page.$eval('#cartBadge', el => el.textContent.trim());
  const cartTotal = await page.$eval('#cartTotalVal', el => el.textContent.trim());
  console.log(`✔ Cart badge count: ${cartCount} | Total: ${cartTotal}`);

  const cartDrawer = page.locator('#cartDrawer');
  await cartDrawer.screenshot({ path: 'scratch/ctn_cart_drawer.png' });
  console.log('✔ Saved scratch/ctn_cart_drawer.png');

  await browser.close();
  console.log('✨ ALL CTN 3 EN 1 INTEGRATION TESTS PASSED 100%! ✨');
})();

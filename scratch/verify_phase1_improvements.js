const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Launching Chromium test for Phase 1 improvements...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('❌ Page Error:', err.message);
  });

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Hero
  console.log('--- 1. Testing Hero Section ---');
  const heroButtons = await page.$$('.hero-cta-group a');
  console.log(`Hero CTA count: ${heroButtons.length} (expected: 2)`);
  if (heroButtons.length !== 2) throw new Error(`Expected 2 hero buttons, found ${heroButtons.length}`);

  const heroMainText = await page.$eval('.hero-btn-main', el => el.innerText.trim());
  const heroWaText = await page.$eval('.btn-whatsapp-hero', el => el.innerText.trim());
  console.log(`Hero Main Button: "${heroMainText}"`);
  console.log(`Hero WA Button: "${heroWaText}"`);

  // 2. Verify Physical Catalog Modal is deleted
  console.log('--- 2. Verifying #physicalCatalogModal is completely removed ---');
  const modalExists = await page.$('#physicalCatalogModal');
  console.log(`Modal #physicalCatalogModal in DOM: ${modalExists !== null} (expected: false)`);
  if (modalExists !== null) throw new Error('#physicalCatalogModal still exists in DOM!');

  // 3. Verify Physical Section Filter Bar
  console.log('--- 3. Testing Physical Section & Filter Tabs ---');
  const filterPills = await page.$$('.phys-filter-btn');
  console.log(`Filter pills count: ${filterPills.length} (expected: 5)`);
  if (filterPills.length !== 5) throw new Error(`Expected 5 filter pills, found ${filterPills.length}`);

  const countAll = await page.$eval('#physCountAll', el => el.textContent);
  const countStock = await page.$eval('#physCountInStock', el => el.textContent);
  console.log(`Counts: All=${countAll}, InStock=${countStock}`);

  let renderedCards = await page.$$('.physical-card');
  console.log(`Initial rendered physical cards: ${renderedCards.length} (expected: 6)`);
  if (renderedCards.length !== 6) throw new Error(`Expected 6 physical cards, found ${renderedCards.length}`);

  // Test filter 'in-stock'
  console.log('Clicking "Disponibles ahora" filter...');
  await page.click('.phys-filter-btn[data-filter="in-stock"]');
  await page.waitForTimeout(100);
  renderedCards = await page.$$('.physical-card');
  console.log(`In-stock cards visible: ${renderedCards.length} (expected: 3)`);
  if (renderedCards.length !== 3) throw new Error(`Expected 3 in-stock cards, found ${renderedCards.length}`);

  // Test filter 'gaming'
  console.log('Clicking "Gaming & Mandos" filter...');
  await page.click('.phys-filter-btn[data-filter="gaming"]');
  await page.waitForTimeout(100);
  renderedCards = await page.$$('.physical-card');
  console.log(`Gaming cards visible: ${renderedCards.length} (expected: 1)`);
  if (renderedCards.length !== 1) throw new Error(`Expected 1 gaming card, found ${renderedCards.length}`);

  // Return to 'all'
  console.log('Clicking "Todos" filter...');
  await page.click('.phys-filter-btn[data-filter="all"]');
  await page.waitForTimeout(100);
  renderedCards = await page.$$('.physical-card');
  console.log(`All cards visible: ${renderedCards.length} (expected: 6)`);
  if (renderedCards.length !== 6) throw new Error(`Expected 6 cards after returning to all, found ${renderedCards.length}`);

  // 4. Verify Shipping Trust Strip
  console.log('--- 4. Testing High-Trust Shipping Strip ---');
  const shippingStrip = await page.$('.physical-shipping-trust-strip');
  if (!shippingStrip) throw new Error('.physical-shipping-trust-strip not found!');
  const shippingTitle = await page.$eval('.shipping-trust-title', el => el.innerText.trim());
  console.log(`Shipping Trust Title: "${shippingTitle}"`);

  // 5. Verify Clicking Physical Card opens #productModal
  console.log('--- 5. Testing Physical Card Detail Modal & Add to Cart ---');
  const firstCard = await page.$('.physical-card[data-id="gamepad-bluetooth-multiplataforma"] .physical-img-wrap');
  await firstCard.click();
  await page.waitForTimeout(300);

  const productModalOpen = await page.$eval('#productModal', el => el.hasAttribute('open'));
  console.log(`Product modal open: ${productModalOpen}`);
  if (!productModalOpen) throw new Error('#productModal did not open on physical card click');

  const modalTitle = await page.$eval('#modalProductTitle', el => el.innerText.trim());
  console.log(`Modal Title: "${modalTitle}"`);

  // Add to cart from modal (click .btn-add-cart inside modal)
  const addBtn = await page.$('#productModal .btn-add-cart:not(.btn-disabled)');
  await addBtn.click();
  await page.waitForTimeout(400);

  // Verify Cart Badge
  const badgeCount = await page.$eval('#cartBadge', el => el.textContent);
  console.log(`Cart badge count: ${badgeCount} (expected: 1)`);
  if (badgeCount !== '1') throw new Error(`Expected cart badge 1, got ${badgeCount}`);

  // Open Cart Drawer to verify item is present
  console.log('Opening Cart Drawer...');
  await page.click('#openCartBtn');
  await page.waitForTimeout(300);
  const cartItemTitle = await page.$eval('.cart-item-name', el => el.innerText.trim());
  console.log(`Item inside Cart Drawer: "${cartItemTitle}"`);

  // Close Cart Drawer
  await page.click('#cartDrawer .drawer-close-btn');
  await page.waitForTimeout(300);

  // 6. Verify Digital Products & Steam Keys Integrity
  console.log('--- 6. Verifying Digital Products Integrity ---');
  const steamGrand = await page.$('.product-card[data-id="random-steam-grand"]');
  const steamBronze = await page.$('.product-card[data-id="random-steam-bronze"]');
  const steamSilver = await page.$('.product-card[data-id="random-steam-silver"]');
  const steamGold = await page.$('.product-card[data-id="random-steam-gold"]');
  const doomEternal = await page.$('.product-card[data-id="doom-eternal-pc-microsoft"]');
  console.log(`Steam Keys in grid: Grand=${!!steamGrand}, Bronze=${!!steamBronze}, Silver=${!!steamSilver}, Gold=${!!steamGold}`);
  console.log(`DOOM Eternal in grid: ${!!doomEternal}`);
  if (!steamGrand || !steamBronze || !steamSilver || !steamGold || !doomEternal) {
    throw new Error('Digital products or Steam keys are missing from the catalog grid!');
  }

  // 7. Verify Search Zero-State Chip Smooth Scroll
  console.log('--- 7. Testing Search Zero State Chip ---');
  await page.fill('#searchInput', 'producto_inexistente_xyz');
  await page.waitForTimeout(200);
  const zeroChip = await page.$('.zero-chip-btn:has-text("Ver artículos físicos")');
  if (!zeroChip) throw new Error('Zero state chip "Ver artículos físicos" not found');
  await zeroChip.click();
  await page.waitForTimeout(400);
  console.log('Zero state chip clicked smoothly without error!');

  // Clear search
  await page.fill('#searchInput', '');
  await page.waitForTimeout(200);

  // 8. Capture Screenshots
  console.log('--- 8. Capturing Desktop & Mobile Screenshots ---');
  await page.screenshot({ path: path.resolve(__dirname, 'desktop_phase1_verified.png'), fullPage: false });

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.resolve(__dirname, 'mobile_phase1_verified.png'), fullPage: false });

  // Scroll to physical on mobile
  const physSection = await page.$('#articulos-fisicos');
  await physSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.resolve(__dirname, 'mobile_physical_phase1.png'), fullPage: false });

  console.log(`\n Total Page Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
    throw new Error(`Encountered ${errors.length} errors during verification`);
  }

  console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
})();

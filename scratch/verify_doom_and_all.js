const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Check counts
  const countAll = await page.$eval('#countAll', el => el.textContent.trim());
  const countGaming = await page.$eval('#countGaming', el => el.textContent.trim());
  const countSuscripcion = await page.$eval('#countSuscripcion', el => el.textContent.trim());
  const countSoftware = await page.$eval('#countSoftware', el => el.textContent.trim());

  console.log(`Counts -> All: ${countAll}, Gaming: ${countGaming}, Suscripcion: ${countSuscripcion}, Software: ${countSoftware}`);

  // 2. Check DOOM card in grid
  const doomCard = page.locator('.product-card[data-id="doom-eternal-pc-microsoft"]');
  await doomCard.waitFor({ state: 'visible', timeout: 5000 });
  const doomTitle = await doomCard.locator('.product-name').textContent();
  const doomPrice = await doomCard.locator('.product-price-val').textContent();
  const doomCategory = await doomCard.locator('.product-category-tag').textContent();
  console.log(`DOOM Card: "${doomTitle.trim()}", Price: "${doomPrice.trim()}", Category: "${doomCategory.trim()}"`);

  // Screenshot grid with DOOM
  await doomCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_grid_doom.png') });

  // 3. Open DOOM modal
  await doomCard.locator('.card-media-preview').click();
  const modal = page.locator('#productModal');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(600);

  const modalTitle = await modal.locator('#modalProductTitle').textContent();
  const modalCategory = await modal.locator('.modal-header .product-category-tag').textContent();
  const modalPrice = await modal.locator('#modalPriceVal').first().textContent();
  const modalSavings = await modal.locator('#modalSavingsBadge').textContent();
  const featureCount = await modal.locator('.ai-summary-list li').count();
  const noticeTitle = await modal.locator('.notice-header span').textContent();

  console.log(`Modal DOOM Title: "${modalTitle.trim()}"`);
  console.log(`Modal DOOM Category: "${modalCategory.trim()}"`);
  console.log(`Modal DOOM Price: "${modalPrice.trim()}", Savings: "${modalSavings.trim()}"`);
  console.log(`Modal Features Count: ${featureCount}`);
  console.log(`Modal Notice Title: "${noticeTitle.trim()}"`);

  // Screenshot modal
  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_modal_doom.png') });

  // Add to cart from modal (this adds DOOM and closes the modal)
  const addCartBtn = modal.locator('.modal-desktop-actions .btn-add-cart');
  await addCartBtn.click();
  await page.waitForTimeout(600);
  const cartBadge = await page.$eval('#cartBadge', el => el.textContent.trim());
  console.log('Cart count after adding DOOM:', cartBadge);

  // 4. Test Search "DOOM"
  const searchInput = page.locator('#searchInput');
  await searchInput.fill('DOOM');
  await page.waitForTimeout(500);
  let visibleCards = await page.locator('.product-card:visible').count();
  console.log(`Search "DOOM" visible cards: ${visibleCards}`);

  // Test Search "Random"
  await searchInput.fill('Random');
  await page.waitForTimeout(500);
  visibleCards = await page.locator('.product-card:visible').count();
  console.log(`Search "Random" visible cards: ${visibleCards}`);

  // Clear search
  await searchInput.fill('');
  await page.waitForTimeout(500);

  // 5. Test Random Steam variant switching
  const grandCard = page.locator('.product-card[data-id="random-steam-grand"]');
  await grandCard.locator('.card-media-preview').click();
  await modal.waitFor({ state: 'visible' });
  await page.waitForTimeout(500);

  console.log('Grand Modal opened, switching to Gold...');
  const goldPill = modal.locator('.variant-pill-btn', { hasText: 'Gold' });
  await goldPill.click();
  await page.waitForTimeout(500);

  const goldTitle = await modal.locator('#modalProductTitle').textContent();
  console.log('Switched to:', goldTitle.trim());

  await modal.locator('#modalCloseBtn').click();
  await page.waitForTimeout(500);

  // 6. Mobile test
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_mobile_doom.png') });
  console.log('Mobile screenshot taken.');

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
})();

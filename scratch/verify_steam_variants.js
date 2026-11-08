const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);

  const errors = [];
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
    errors.push(err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('insights')) {
      console.error('CONSOLE ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 1. Verify counters
  const counters = await page.evaluate(() => {
    return {
      all: document.getElementById('countAll')?.textContent,
      suscripcion: document.getElementById('countSuscripcion')?.textContent,
      gaming: document.getElementById('countGaming')?.textContent,
      software: document.getElementById('countSoftware')?.textContent,
    };
  });
  console.log('Pill counters:', counters);

  // 2. Check all 4 steam variants exist in DOM
  const steamTiers = ['grand', 'bronze', 'silver', 'gold'];
  for (const tier of steamTiers) {
    const cardId = `random-steam-${tier}`;
    const card = page.locator(`[data-id="${cardId}"]`);
    const count = await card.count();
    console.log(`Card ${cardId} exists:`, count > 0);

    const cardInfo = await card.evaluate(el => ({
      category: el.querySelector('.product-category-tag')?.textContent,
      name: el.querySelector('.product-name')?.textContent,
      price: el.querySelector('.product-price-val')?.textContent,
      originalPrice: el.querySelector('.price-original-val')?.textContent,
      discount: el.querySelector('.discount-badge')?.textContent,
      badge: el.querySelector('.card-badge')?.textContent,
      imgSrc: el.querySelector('img')?.getAttribute('src'),
      imgComplete: el.querySelector('img')?.complete,
      naturalWidth: el.querySelector('img')?.naturalWidth
    }));
    console.log(`Card info for ${tier}:`, cardInfo);
  }

  // 3. Take catalog screenshot with the new Steam cards
  await page.evaluate(() => {
    const el = document.querySelector('[data-id="random-steam-bronze"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/screenshots/catalog_with_steam_variants.png' });
  console.log('Saved scratch/screenshots/catalog_with_steam_variants.png');

  // 4. Test Modal & Variant Switcher
  // Open Grand
  await page.locator('[data-id="random-steam-grand"] .card-media-preview').click();
  await page.waitForTimeout(500);

  const modal = page.locator('#productModal');
  await modal.waitFor({ state: 'visible' });

  const grandTitle = await modal.locator('#modalProductTitle').textContent();
  const grandPrice = await modal.locator('#modalPriceVal').first().textContent();
  console.log('Initial modal (Grand):', { title: grandTitle, price: grandPrice });

  // Click Bronze in modal variant selector
  const bronzeBtn = modal.locator('.variant-pill-btn', { hasText: 'Bronze' }).first();
  await bronzeBtn.click();
  await page.waitForTimeout(500);

  const bronzeTitle = await modal.locator('#modalProductTitle').textContent();
  const bronzePrice = await modal.locator('#modalPriceVal').first().textContent();
  console.log('After clicking Bronze in modal:', { title: bronzeTitle, price: bronzePrice });

  // Click Silver in modal variant selector
  const silverBtn = modal.locator('.variant-pill-btn', { hasText: 'Silver' }).first();
  await silverBtn.click();
  await page.waitForTimeout(500);

  const silverTitle = await modal.locator('#modalProductTitle').textContent();
  const silverPrice = await modal.locator('#modalPriceVal').first().textContent();
  console.log('After clicking Silver in modal:', { title: silverTitle, price: silverPrice });

  // Click Gold in modal variant selector
  const goldBtn = modal.locator('.variant-pill-btn', { hasText: 'Gold' }).first();
  await goldBtn.click();
  await page.waitForTimeout(500);

  const goldTitle = await modal.locator('#modalProductTitle').textContent();
  const goldPrice = await modal.locator('#modalPriceVal').first().textContent();
  console.log('After clicking Gold in modal:', { title: goldTitle, price: goldPrice });

  // Take screenshot of modal with Gold active
  await page.screenshot({ path: 'scratch/screenshots/steam_gold_modal.png' });
  console.log('Saved scratch/screenshots/steam_gold_modal.png');

  // Close modal
  await page.locator('#modalCloseBtn').click();
  await page.waitForTimeout(400);

  // 5. Test Search for "Random"
  await page.fill('#searchInput', 'Random');
  await page.waitForTimeout(300);
  const searchRandomCount = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#productsGrid .product-card'));
    return cards.filter(c => c.style.display !== 'none').length;
  });
  console.log('Search "Random" count:', searchRandomCount);

  // Clear search
  await page.click('#clearSearchBtn');
  await page.waitForTimeout(300);

  // 6. Test Mobile Viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    const el = document.querySelector('[data-id="random-steam-gold"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'scratch/screenshots/mobile_steam_variants.png' });
  console.log('Saved scratch/screenshots/mobile_steam_variants.png');

  console.log('\nAll tests executed successfully. Total errors:', errors.length);
  await browser.close();
})();

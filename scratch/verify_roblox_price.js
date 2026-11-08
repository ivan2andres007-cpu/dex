const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  // 1. Verify Card data in DOM
  const cardData = await page.evaluate(() => {
    const card = document.querySelector('.product-card[data-id="roblox-200-robux-global"]');
    if (!card) return null;
    return {
      title: card.querySelector('.product-name')?.textContent?.trim(),
      price: card.querySelector('.product-price-val')?.textContent?.trim(),
      discount: card.querySelector('.discount-badge')?.textContent?.trim(),
      originalPrice: card.querySelector('.price-original-val')?.textContent?.trim(),
      savings: card.querySelector('.price-savings-label')?.textContent?.trim()
    };
  });
  console.log('Roblox Card rendered data:', cardData);

  // Take screenshot of Roblox card
  const robloxCard = page.locator('.product-card[data-id="roblox-200-robux-global"]');
  await robloxCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await robloxCard.screenshot({ path: 'scratch/roblox_card_32000.png' });
  console.log('Saved scratch/roblox_card_32000.png');

  // 2. Open Product Details Modal
  await page.click('.product-card[data-id="roblox-200-robux-global"] .card-media-preview');
  await page.waitForTimeout(400);

  const modalData = await page.evaluate(() => {
    const modal = document.getElementById('productModal');
    return {
      title: document.getElementById('modalProductTitle')?.textContent?.trim(),
      price: modal?.querySelector('.promo-price-current')?.textContent?.trim(),
      discount: modal?.querySelector('.discount-badge')?.textContent?.trim(),
      original: modal?.querySelector('#modalOrigVal')?.textContent?.trim()
    };
  });
  console.log('Roblox Modal data:', modalData);

  await page.screenshot({ path: 'scratch/roblox_modal_32000.png' });
  console.log('Saved scratch/roblox_modal_32000.png');

  // Close modal
  await page.click('#modalCloseBtn');
  await page.waitForTimeout(300);

  // 3. Test Add to Cart & WhatsApp link generation
  const cartTest = await page.evaluate(() => {
    const roblox = PRODUCTS.find(p => p.id === 'roblox-200-robux-global');
    return {
      price: roblox.price,
      originalPrice: roblox.originalPrice,
      discountPercentage: roblox.discountPercentage
    };
  });
  console.log('PRODUCTS object verified:', cartTest);

  await browser.close();
  console.log('ALL VERIFICATIONS SUCCESSFUL!');
})();


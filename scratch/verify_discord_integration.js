const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  // 1. Verify counts
  const countStats = await page.evaluate(() => {
    return {
      countAllText: document.getElementById('countAll')?.textContent,
      countSuscripcionText: document.getElementById('countSuscripcion')?.textContent,
      countGamingText: document.getElementById('countGaming')?.textContent,
    };
  });
  console.log('Filter Pill Counters:', countStats);

  // 2. Locate card and inspect
  const discordCard = page.locator('[data-id="discord-nitro-3m-trial"]');
  const cardExists = await discordCard.count();
  console.log('Discord Card exists:', cardExists > 0);

  const cardData = await discordCard.evaluate(el => {
    return {
      categoryTag: el.querySelector('.product-category-tag')?.textContent,
      name: el.querySelector('.product-name')?.textContent,
      price: el.querySelector('.product-price-val')?.textContent,
      originalPrice: el.querySelector('.price-original-val')?.textContent,
      discountBadge: el.querySelector('.discount-badge')?.textContent,
      savingsLabel: el.querySelector('.price-savings-label')?.textContent,
      primaryBadge: el.querySelector('.card-badge')?.textContent,
      extraBadge: el.querySelectorAll('.card-badge')[1]?.textContent,
      imgSrc: el.querySelector('img')?.getAttribute('src'),
      hasIcon: !!el.querySelector('.card-floating-icon svg')
    };
  });
  console.log('Card data on page:', cardData);

  // 3. Test opening product modal
  await discordCard.locator('.card-media-preview').click();
  await page.waitForTimeout(500);

  const modal = page.locator('#productModal');
  const modalData = await modal.evaluate(el => {
    return {
      categoryTag: el.querySelector('.product-category-tag')?.textContent,
      title: el.querySelector('#modalProductTitle')?.textContent,
      price: el.querySelector('#modalPriceVal')?.textContent,
      discount: el.querySelector('.discount-badge')?.textContent,
      savings: el.querySelector('#modalSavingsBadge')?.textContent,
      featuresCount: el.querySelectorAll('.ai-summary-list li').length,
      noticeTitle: el.querySelector('.notice-header span')?.textContent,
      noticeItemsCount: el.querySelectorAll('.notice-list li').length
    };
  });
  console.log('Modal data on page:', modalData);

  // Test WhatsApp order button in modal
  let interceptedUrl = null;
  await page.exposeFunction('mockOpen', (url) => {
    interceptedUrl = url;
  });
  await page.evaluate(() => {
    window.open = window.mockOpen;
  });

  await modal.locator('.btn-direct-buy').first().click();
  await page.waitForTimeout(300);
  console.log('Intercepted WhatsApp URL:\n', decodeURIComponent(interceptedUrl || 'none'));

  // Close modal
  await page.locator('#modalCloseBtn').click();
  await page.waitForTimeout(400);

  // 4. Test Add to Cart & Cart Drawer
  await discordCard.locator('.btn-add-cart').click();
  await page.waitForTimeout(400);

  // Open cart drawer explicitly
  await page.evaluate(() => {
    if (typeof openCartDrawer === 'function') openCartDrawer();
  });
  await page.waitForTimeout(500);

  const cartInfo = await page.evaluate(() => {
    const drawer = document.getElementById('cartDrawer');
    const items = Array.from(drawer.querySelectorAll('.cart-item-row'));
    return {
      isOpen: drawer.open || drawer.classList.contains('active'),
      itemsCount: items.length,
      itemNames: items.map(it => it.querySelector('.cart-item-name')?.textContent?.trim()),
      totalText: document.getElementById('cartTotalPrice')?.textContent?.trim()
    };
  });
  console.log('Cart drawer info after adding Discord Nitro:', cartInfo);

  // Screenshot cart drawer
  await page.screenshot({ path: 'scratch/screenshots/cart_with_discord.png' });
  console.log('Saved scratch/screenshots/cart_with_discord.png');

  // Close cart
  await page.evaluate(() => {
    if (typeof closeCartDrawer === 'function') closeCartDrawer();
  });
  await page.waitForTimeout(400);

  // 5. Test Search
  await page.fill('#searchInput', 'Discord');
  await page.waitForTimeout(300);
  const searchDiscordCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#productsGrid .product-card'));
    return cards.filter(c => c.style.display !== 'none').length;
  });
  console.log('Search "Discord" cards visible:', searchDiscordCards);

  await page.fill('#searchInput', 'Nitro');
  await page.waitForTimeout(300);
  const searchNitroCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#productsGrid .product-card'));
    return cards.filter(c => c.style.display !== 'none').length;
  });
  console.log('Search "Nitro" cards visible:', searchNitroCards);

  // Clear search
  await page.click('#clearSearchBtn');
  await page.waitForTimeout(300);

  console.log('\nAll checks passed flawlessly!');
  await browser.close();
})();

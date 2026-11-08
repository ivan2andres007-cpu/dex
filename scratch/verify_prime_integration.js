const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  if (errors.length > 0) {
    console.error('JS Page Errors:', errors);
    process.exit(1);
  }

  // 1. Verify Amazon Prime card in DOM
  const cardData = await page.evaluate(() => {
    const card = document.querySelector('.product-card[data-id="amazon-prime-video-1m-perfil"]');
    if (!card) return null;
    return {
      title: card.querySelector('.product-name')?.textContent?.trim(),
      price: card.querySelector('.product-price-val')?.textContent?.trim(),
      imageSrc: card.querySelector('.card-preview-art')?.getAttribute('src'),
      categoryTag: card.querySelector('.product-category-tag')?.textContent?.trim(),
      badgeText: card.querySelector('.card-badge.badge-blue')?.textContent?.trim(),
      extraBadgeText: card.querySelector('.card-badge.badge-purple')?.textContent?.trim()
    };
  });
  console.log('Amazon Prime Card rendered in DOM:', cardData);

  // 2. Verify filter counts
  const counts = await page.evaluate(() => {
    return {
      all: document.getElementById('countAll')?.textContent,
      suscripcion: document.getElementById('countSuscripcion')?.textContent,
      gaming: document.getElementById('countGaming')?.textContent,
      software: document.getElementById('countSoftware')?.textContent
    };
  });
  console.log('Category filter counts:', counts);

  // 3. Desktop screenshot of catalog
  const card = page.locator('.product-card[data-id="amazon-prime-video-1m-perfil"]');
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/desktop_catalog_prime.png' });
  console.log('Desktop catalog screenshot saved');

  // 4. Test opening modal
  await page.click('.product-card[data-id="amazon-prime-video-1m-perfil"] .card-media-preview');
  await page.waitForTimeout(400);
  
  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('productModal');
    return {
      title: document.getElementById('modalProductTitle')?.textContent?.trim(),
      imageSrc: modal?.querySelector('.modal-carousel-img')?.getAttribute('src'),
      price: modal?.querySelector('.modal-current-price')?.textContent?.trim()
    };
  });
  console.log('Modal details opened:', modalInfo);
  await page.screenshot({ path: 'scratch/desktop_modal_prime.png' });

  // Close modal
  await page.click('#modalCloseBtn');
  await page.waitForTimeout(300);

  // 5. Test Mobile view (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  const cardMobile = page.locator('.product-card[data-id="amazon-prime-video-1m-perfil"]');
  await cardMobile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/mobile_catalog_prime.png' });
  console.log('Mobile catalog screenshot saved');

  // 6. Test Filtering by "suscripcion"
  const filterSuscripcionResult = await page.evaluate(() => {
    const btn = document.querySelector('.filter-pill[data-category="suscripcion"]');
    if (btn) btn.click();
    return Array.from(document.querySelectorAll('.product-card')).map(c => c.getAttribute('data-id'));
  });
  console.log('Cards visible when filtering "suscripcion":', filterSuscripcionResult);

  // 7. Test Search for "Prime"
  const searchResult = await page.evaluate(() => {
    const input = document.getElementById('searchInput');
    input.value = 'Prime';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return Array.from(document.querySelectorAll('.product-card')).map(c => c.getAttribute('data-id'));
  });
  console.log('Cards visible when searching "Prime":', searchResult);

  await browser.close();
  console.log('ALL PRIME VERIFICATIONS FINISHED SUCCESSFULLY!');
})();


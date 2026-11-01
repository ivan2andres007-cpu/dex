const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  page.on('requestfailed', req => {
    console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Verify CapCut is in PRODUCTS array and rendered in DOM
  const cardData = await page.evaluate(() => {
    const card = document.querySelector('.product-card[data-id="capcut-pro-1-month"]');
    if (!card) return null;
    return {
      title: card.querySelector('.product-name')?.textContent?.trim(),
      price: card.querySelector('.product-price-val')?.textContent?.trim(),
      imageSrc: card.querySelector('.card-preview-art')?.getAttribute('src'),
      categoryTag: card.querySelector('.product-category-tag')?.textContent?.trim(),
      badgeText: card.querySelector('.card-badge.badge-purple')?.textContent?.trim()
    };
  });
  console.log('CapCut Card rendered in DOM:', cardData);

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

  // 3. Take screenshot of desktop catalog section
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/desktop_catalog_capcut.png' });
  console.log('Desktop catalog screenshot saved');

  // 4. Test opening CapCut Product Details Modal
  await page.click('.product-card[data-id="capcut-pro-1-month"] .card-media-preview');
  await page.waitForTimeout(400);
  
  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    return {
      isOpen: overlay?.classList.contains('active'),
      title: document.getElementById('modalProductTitle')?.textContent?.trim(),
      imageCount: modal?.querySelectorAll('.modal-carousel-img')?.length,
      imageSrc: modal?.querySelector('.modal-carousel-img')?.getAttribute('src'),
      price: modal?.querySelector('.modal-current-price')?.textContent?.trim()
    };
  });
  console.log('Modal details opened:', modalInfo);
  await page.screenshot({ path: 'scratch/desktop_modal_capcut.png' });

  // Close modal
  await page.click('#modalCloseBtn');
  await page.waitForTimeout(300);

  // 5. Test Mobile View (375x812 iPhone)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/mobile_catalog_capcut.png' });
  console.log('Mobile catalog screenshot saved');

  // 6. Test Filtering by "suscripcion"
  const filterSuscripcionResult = await page.evaluate(() => {
    const btn = document.querySelector('.filter-pill[data-category="suscripcion"]');
    if (btn) btn.click();
    const visibleCards = Array.from(document.querySelectorAll('.product-card')).map(c => c.getAttribute('data-id'));
    return visibleCards;
  });
  console.log('Cards visible when filtering "suscripcion":', filterSuscripcionResult);

  // 7. Test Search for "CapCut"
  const searchResult = await page.evaluate(() => {
    const input = document.getElementById('searchInput');
    input.value = 'CapCut';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const visibleCards = Array.from(document.querySelectorAll('.product-card')).map(c => c.getAttribute('data-id'));
    return visibleCards;
  });
  console.log('Cards visible when searching "CapCut":', searchResult);

  await browser.close();
  console.log('ALL VERIFICATIONS FINISHED!');
})();

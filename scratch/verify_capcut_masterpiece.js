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

  // 1. Scroll to catalog
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 2. Desktop catalog overview screenshot
  await page.screenshot({ path: 'scratch/desktop_catalog_masterpiece.png' });
  console.log('Saved scratch/desktop_catalog_masterpiece.png');

  // 3. Card close-up of CapCut
  const capcutCard = page.locator('.product-card[data-id="capcut-pro-1-month"]');
  await capcutCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await capcutCard.screenshot({ path: 'scratch/capcut_card_masterpiece.png' });
  console.log('Saved scratch/capcut_card_masterpiece.png');

  // Check overlap programmatically between badges and card text/logos
  const overlapCheck = await page.evaluate(() => {
    const card = document.querySelector('.product-card[data-id="capcut-pro-1-month"]');
    const preview = card.querySelector('.card-media-preview');
    const badges = card.querySelector('.card-floating-badges');
    const icon = card.querySelector('.card-floating-icon');
    
    const pRect = preview.getBoundingClientRect();
    const bRect = badges.getBoundingClientRect();
    const iRect = icon.getBoundingClientRect();

    return {
      preview: { width: pRect.width, height: pRect.height },
      badges: { top: bRect.top - pRect.top, bottom: bRect.bottom - pRect.top, left: bRect.left - pRect.left, right: bRect.right - pRect.left },
      icon: { top: iRect.top - pRect.top, bottom: iRect.bottom - pRect.top, left: iRect.left - pRect.left, right: iRect.right - pRect.left }
    };
  });
  console.log('Card geometry:', overlapCheck);

  // 4. Open Modal
  await page.click('.product-card[data-id="capcut-pro-1-month"] .card-media-preview');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/desktop_modal_masterpiece.png' });
  console.log('Saved scratch/desktop_modal_masterpiece.png');

  // Close modal
  await page.click('#modalCloseBtn');
  await page.waitForTimeout(300);

  // 5. Mobile view (375x812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator('#catalogo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/mobile_catalog_masterpiece.png' });
  console.log('Saved scratch/mobile_catalog_masterpiece.png');

  // Mobile card screenshot
  const mobileCard = page.locator('.product-card[data-id="capcut-pro-1-month"]');
  await mobileCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await mobileCard.screenshot({ path: 'scratch/mobile_capcut_card.png' });
  console.log('Saved scratch/mobile_capcut_card.png');

  await browser.close();
  console.log('Masterpiece verification complete!');
})();


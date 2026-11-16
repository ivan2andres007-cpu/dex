const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const indexPath = path.resolve(__dirname, '../index.html');
  await page.goto('file:///' + indexPath.replace(/\\/g, '/'));
  await page.waitForTimeout(1000);

  // Filter or search for Google AI
  const searchInput = page.locator('#searchInput');
  if (await searchInput.count() > 0) {
    await searchInput.fill('Google AI Subscription');
    await page.waitForTimeout(600);
  }

  // Find the card
  const card = page.locator('[data-product-id="google-ai-subscription-12m"]');
  if (await card.count() > 0) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await card.screenshot({ path: path.resolve(__dirname, 'google_ai_card_preview.png') });
    console.log('Saved card preview to scratch/google_ai_card_preview.png');

    // Click card to open modal
    await card.click();
    await page.waitForTimeout(600);

    const modal = page.locator('#productModal, .modal-content, [role="dialog"]').first();
    if (await modal.count() > 0) {
      await modal.screenshot({ path: path.resolve(__dirname, 'google_ai_modal_preview.png') });
      console.log('Saved modal preview to scratch/google_ai_modal_preview.png');
    }
  } else {
    console.log('Card not found by data-product-id, capturing full page');
    await page.screenshot({ path: path.resolve(__dirname, 'google_ai_fallback_preview.png') });
  }

  await browser.close();
})();

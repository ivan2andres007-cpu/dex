const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Add the CSS changes
  await page.addStyleTag({
    content: `
      @media (max-width: 768px) {
        /* Single-image gallery height parity with multi-image gallery */
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-container {
          height: 275px !important;
          max-height: 275px !important;
        }
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-slide img,
        .modal-gallery-layout:not(:has(.modal-thumbs-vertical)) .modal-carousel-img {
          max-height: 265px !important;
        }

        /* Physical Modal Header & Subtitle compact */
        .physical-modal-header {
          padding: 8px 14px !important;
          padding-top: calc(8px + var(--sat)) !important;
          gap: 10px !important;
          align-items: center !important;
        }
        .physical-modal-badge {
          font-size: 0.62rem !important;
          letter-spacing: 0.04em !important;
          margin-bottom: 2px !important;
          gap: 4px !important;
        }
        .physical-modal-badge .status-dot {
          width: 5px !important;
          height: 5px !important;
        }
        .physical-modal-title {
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          margin: 0 !important;
          letter-spacing: -0.01em !important;
        }
        .physical-modal-subtitle {
          font-size: 0.70rem !important;
          line-height: 1.25 !important;
          margin-top: 2px !important;
          color: var(--text-tertiary) !important;
        }
        .physical-modal-header .drawer-close-btn {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          flex-shrink: 0 !important;
        }

        /* Physical Toolbar Compact */
        .physical-modal-toolbar {
          padding: 6px 12px !important;
          gap: 6px !important;
        }
        .physical-search-box {
          height: 34px !important;
          min-height: 34px !important;
        }
        .physical-search-box .search-icon {
          width: 14px !important;
          height: 14px !important;
          left: 10px !important;
        }
        .physical-search-input {
          height: 34px !important;
          min-height: 34px !important;
          padding: 0 10px 0 32px !important;
          font-size: 0.82rem !important;
          border-radius: var(--radius-sm) !important;
        }
        .physical-filters-bar {
          gap: 6px !important;
          padding-bottom: 2px !important;
        }
        .phys-filter-pill {
          height: 28px !important;
          min-height: 28px !important;
          padding: 0 10px !important;
          font-size: 0.72rem !important;
          white-space: nowrap !important;
        }

        /* Physical Grid & Cards */
        .physical-modal-body {
          padding: 8px 10px !important;
        }
        .physical-modal-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
        }
        .physical-card {
          padding: 8px !important;
          border-radius: var(--radius-sm) !important;
        }
        .physical-img-wrap {
          aspect-ratio: 1 / 1 !important;
          border-radius: var(--radius-xs) !important;
          margin-bottom: 6px !important;
        }
        .physical-card-category {
          font-size: 0.64rem !important;
          margin-bottom: 2px !important;
        }
        .physical-card-title {
          font-size: 0.76rem !important;
          line-height: 1.25 !important;
          min-height: 2.5em !important;
          margin-bottom: 4px !important;
        }
        .physical-meta-row {
          font-size: 0.66rem !important;
          gap: 3px !important;
          margin-bottom: 4px !important;
        }
        .physical-price-row {
          margin-bottom: 6px !important;
        }
        .physical-current-price {
          font-size: 0.92rem !important;
          font-weight: 700 !important;
        }
        .physical-orig-price {
          font-size: 0.68rem !important;
        }
        .physical-actions-row {
          gap: 4px !important;
        }
        .btn-phys-details {
          height: 32px !important;
          min-height: 32px !important;
          font-size: 0.72rem !important;
          padding: 0 8px !important;
          border-radius: var(--radius-sm) !important;
        }
        .btn-phys-cart {
          height: 32px !important;
          width: 32px !important;
          min-height: 32px !important;
          min-width: 32px !important;
          border-radius: var(--radius-sm) !important;
        }
        .btn-phys-cart svg {
          width: 13px !important;
          height: 13px !important;
        }

        /* Physical Footer compact */
        .physical-modal-footer {
          padding: 6px 12px calc(8px + var(--sab)) !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 6px !important;
          background: var(--bg-surface) !important;
          border-top: 1px solid var(--border-subtle) !important;
        }
        .physical-footer-info {
          width: 100% !important;
          text-align: center !important;
        }
        .physical-footer-note {
          font-size: 0.68rem !important;
          line-height: 1.25 !important;
          color: var(--text-tertiary) !important;
          margin: 0 !important;
          text-align: center !important;
        }
        .btn-phys-close-footer {
          width: auto !important;
          min-width: 160px !important;
          height: 32px !important;
          min-height: 32px !important;
          padding: 0 16px !important;
          font-size: 0.78rem !important;
          font-weight: 600 !important;
          border-radius: var(--radius-pill) !important;
          background: var(--bg-surface-hover) !important;
          border: 1px solid var(--border-subtle) !important;
          color: var(--text-secondary) !important;
        }
      }
    `
  });

  const allProductIds = [
    'google-ai-pro-gemini-18m',
    'assetto-corsa-pc-steam',
    'random-steam-grand',
    'gamepad-bluetooth-multiplataforma',
    'auriculares-gamer-71',
    'teclado-mecanico-rgb-65',
    'mouse-gamer-ultralight'
  ];

  for (const id of allProductIds) {
    await page.evaluate((pid) => openProductDetails(pid), id);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', `final-check-${id}.png`) });
    await page.evaluate(() => closeProductDetails(false));
    await page.waitForTimeout(250);
  }

  await browser.close();
  console.log('All 7 products verified and screenshots saved.');
})();

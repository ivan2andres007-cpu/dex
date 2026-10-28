const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  console.log('--- TEST 1: MOBILE 320px (iPhone SE smallest viewport) ---');
  const page320 = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page320.goto('http://localhost:3000');
  await page320.waitForSelector('.product-card');

  // Verify no horizontal overflow
  const overflow320 = await page320.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log('320px overflow status:', overflow320);

  // Switch to Worst-Case via Dev Toggle
  console.log('\n--- TEST 2: SWITCH TO WORST CASE DATASET ---');
  await page320.click('button[data-dataset="worst"]');
  await page320.waitForTimeout(300);

  const worstMetrics = await page320.evaluate(() => {
    const cards = document.querySelectorAll('.product-card');
    const first = cards[0];
    const second = cards[1];
    const third = cards[2];

    const firstStockDot = first.querySelector('.stock-status-dot');
    const firstStockLabel = first.querySelector('.stock-live-badge span:nth-child(2)')?.textContent;
    const firstBuyBtn = first.querySelector('.btn-add-cart')?.textContent.trim();
    const firstDirectBtn = first.querySelector('.btn-direct-buy')?.textContent.trim();
    const firstPrice = first.querySelector('.product-price-val')?.textContent.trim();
    const firstDiscount = first.querySelector('.discount-badge')?.textContent.trim();

    const secondStockText = second.querySelector('.stock-count-text')?.textContent.trim();
    const secondDiscount = second.querySelector('.discount-badge'); // should be null

    return {
      totalCards: cards.length,
      firstCard: {
        isOutOfStock: first.classList.contains('is-out-of-stock'),
        dotHasRed: firstStockDot.classList.contains('is-sold-out'),
        stockLabel: firstStockLabel,
        buyBtnText: firstBuyBtn,
        directBtnText: firstDirectBtn,
        priceText: firstPrice,
        discountText: firstDiscount
      },
      secondCard: {
        stockText: secondStockText,
        hasDiscountBadge: secondDiscount !== null
      },
      overflowCheck: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  console.log('Worst-case evaluation results:', JSON.stringify(worstMetrics, null, 2));
  await page320.screenshot({ path: 'scratch/worst_case_grid_320.png' });

  // Open detail modal of first worst case card (GCP Enterprise with 120-char title)
  console.log('\n--- TEST 3: WORST CASE MODAL AT 320px ---');
  await page320.evaluate(() => {
    openProductDetails('worst-case-enterprise-gcp');
  });
  await page320.waitForTimeout(400);

  const modalMetrics = await page320.evaluate(() => {
    const modal = document.getElementById('productModal');
    const title = modal.querySelector('.modal-pro-title')?.textContent;
    const price = modal.querySelector('.modal-sale-price')?.textContent;
    return {
      open: modal.open,
      titleLength: title?.length,
      price: price,
      modalOverflow: modal.scrollWidth > modal.clientWidth
    };
  });
  console.log('Worst-case modal metrics:', modalMetrics);
  await page320.screenshot({ path: 'scratch/worst_case_modal_320.png' });

  // Close modal
  await page320.evaluate(() => {
    closeProductDetails();
  });
  await page320.waitForTimeout(300);

  // Switch to Empty state
  console.log('\n--- TEST 4: EMPTY STATE TESTING ---');
  await page320.click('button[data-dataset="empty"]');
  await page320.waitForTimeout(300);

  const emptyMetrics = await page320.evaluate(() => {
    const zeroState = document.querySelector('.catalog-zero-state');
    const chips = zeroState ? zeroState.querySelectorAll('.zero-chip-btn').length : 0;
    const resultCount = document.getElementById('catalogResultCount')?.textContent;
    return {
      zeroStatePresent: zeroState !== null,
      suggestedChipsCount: chips,
      resultCountText: resultCount
    };
  });
  console.log('Empty state metrics:', emptyMetrics);
  await page320.screenshot({ path: 'scratch/empty_state_320.png' });

  // Switch back to Demo
  console.log('\n--- TEST 5: RESTORE DEMO DATASET ---');
  await page320.click('button[data-dataset="demo"]');
  await page320.waitForTimeout(300);
  const demoCount = await page320.evaluate(() => document.querySelectorAll('.product-card').length);
  console.log('Demo products restored count:', demoCount);

  // Test Toast notifications
  console.log('\n--- TEST 6: TOAST NOTIFICATION TRANSITION ---');
  await page320.evaluate(() => {
    showToast('Prueba de Notificación Emil Kowalski');
  });
  await page320.waitForTimeout(100);

  const toastState = await page320.evaluate(() => {
    const toast = document.querySelector('.toast-item');
    return {
      exists: toast !== null,
      datasetState: toast?.dataset?.state,
      text: toast?.textContent?.trim()
    };
  });
  console.log('Toast state:', toastState);
  await page320.screenshot({ path: 'scratch/toast_active_320.png' });

  // Test Desktop 1280px
  console.log('\n--- TEST 7: DESKTOP 1280px HOTKEYS & LAYOUT ---');
  const pageDesk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await pageDesk.goto('http://localhost:3000');
  await pageDesk.waitForSelector('.product-card');

  // Press '/' hotkey
  await pageDesk.keyboard.press('/');
  const isSearchFocused = await pageDesk.evaluate(() => document.activeElement === document.getElementById('searchInput'));
  console.log('Hotkey / focused search input:', isSearchFocused);

  // Press Escape to blur
  await pageDesk.keyboard.press('Escape');
  const isSearchBlurred = await pageDesk.evaluate(() => document.activeElement !== document.getElementById('searchInput'));
  console.log('Escape blurred search input:', isSearchBlurred);

  // Press 'c' to open cart
  await pageDesk.keyboard.press('c');
  await pageDesk.waitForTimeout(400);
  const isCartOpen = await pageDesk.evaluate(() => document.getElementById('cartDrawer').open);
  console.log('Hotkey C opened cart drawer:', isCartOpen);

  // Press 'c' to close cart
  await pageDesk.keyboard.press('c');
  await pageDesk.waitForTimeout(400);
  const isCartClosed = await pageDesk.evaluate(() => !document.getElementById('cartDrawer').open);
  console.log('Second C closed cart drawer:', isCartClosed);

  await pageDesk.screenshot({ path: 'scratch/desktop_clean.png' });

  await browser.close();
  console.log('\nALL EMIL KOWALSKI CRAFT AND BREAK-UI TESTS PASSED!');
})();

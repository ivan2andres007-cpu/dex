const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('--- Starting Playwright CTN Digital Consistency Test ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const fileUrl = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

  // 1. Check Product Data using findProduct
  const dataCheck = await page.evaluate(() => {
    const digital = findProduct('ingreso-ctn-pack-completo-3en1-digital');
    const physical = findProduct('ingreso-ctn-pack-completo-3en1');
    return {
      digital: {
        id: digital?.id,
        name: digital?.name,
        isPhysical: digital?.isPhysical,
        price: digital?.price,
        badge: digital?.badge,
        extraBadge: digital?.extraBadge,
        noticeTitle: digital?.notice?.title
      },
      physical: {
        id: physical?.id,
        name: physical?.name,
        isPhysical: physical?.isPhysical,
        price: physical?.price,
        badge: physical?.badge,
        extraBadge: physical?.extraBadge,
        noticeTitle: physical?.notice?.title,
        subCategory: physical?.subCategory
      }
    };
  });

  console.log('Data Check Results:', JSON.stringify(dataCheck, null, 2));

  if (dataCheck.physical.isPhysical !== false) {
    throw new Error('Physical catalog item must have isPhysical: false to represent digital product');
  }
  if (dataCheck.physical.extraBadge !== 'Digital PDF') {
    throw new Error('Physical catalog item extraBadge must be Digital PDF');
  }
  if (!dataCheck.physical.name.includes('(Digital)')) {
    throw new Error('Physical catalog item name must include (Digital)');
  }
  if (!dataCheck.physical.noticeTitle.includes('Digital')) {
    throw new Error('Physical catalog item notice title must be digital delivery');
  }

  // 2. Test Digital Catalog Card & Modal
  console.log('Testing Digital Catalog Modal...');
  await page.evaluate(() => {
    openProductDetails('ingreso-ctn-pack-completo-3en1-digital');
  });
  await page.waitForTimeout(300);

  const modalCategory = await page.locator('#productModal .product-category-tag').textContent();
  const modalDeliveryTag = await page.locator('#productModal .delivery-status-tag').textContent();
  const modalNoticeHeader = await page.locator('#productModal .product-notice-box .notice-header').textContent();

  console.log('Digital Modal Category:', modalCategory.trim());
  console.log('Digital Modal Delivery Tag:', modalDeliveryTag.trim());
  console.log('Digital Modal Notice Header:', modalNoticeHeader.trim());

  if (!modalDeliveryTag.includes('5-15 min')) {
    throw new Error('Expected delivery tag to say 5-15 min in digital modal');
  }

  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_digital_ctn_modal.png') });

  // Close modal
  await page.evaluate(() => closeProductDetails());
  await page.waitForTimeout(200);

  // 3. Test Physical Catalog Section Card & Modal
  console.log('Testing Physical Catalog Section Card & Modal...');
  const physCardTitle = await page.locator('.physical-card[data-id="ingreso-ctn-pack-completo-3en1"] .physical-card-title').textContent();
  const physCardCategory = await page.locator('.physical-card[data-id="ingreso-ctn-pack-completo-3en1"] .physical-card-category').textContent();
  const physCardBadges = await page.locator('.physical-card[data-id="ingreso-ctn-pack-completo-3en1"] .physical-card-badge').textContent();

  console.log('Physical Card Title:', physCardTitle.trim());
  console.log('Physical Card Category:', physCardCategory.trim());
  console.log('Physical Card Badges:', physCardBadges.trim().replace(/\s+/g, ' '));

  if (!physCardBadges.includes('Digital PDF')) {
    throw new Error('Expected physical card to show Digital PDF badge');
  }

  // Open modal from physical catalog
  await page.evaluate(() => {
    openProductDetails('ingreso-ctn-pack-completo-3en1');
  });
  await page.waitForTimeout(300);

  const physModalCategory = await page.locator('#productModal .product-category-tag').textContent();
  const physModalDeliveryTag = await page.locator('#productModal .delivery-status-tag').textContent();
  const physModalNoticeHeader = await page.locator('#productModal .product-notice-box .notice-header').textContent();

  console.log('Phys Modal Category:', physModalCategory.trim());
  console.log('Phys Modal Delivery Tag:', physModalDeliveryTag.trim());
  console.log('Phys Modal Notice Header:', physModalNoticeHeader.trim());

  if (!physModalDeliveryTag.includes('5-15 min')) {
    throw new Error('Expected delivery tag to say 5-15 min in physical section modal');
  }

  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_physical_ctn_modal.png') });

  // Close modal
  await page.evaluate(() => closeProductDetails());
  await page.waitForTimeout(200);

  // 4. Test Add to Cart from Physical Section and Cart Drawer verification
  console.log('Testing Add to Cart and Cart Drawer...');
  await page.evaluate(() => {
    addToCart('ingreso-ctn-pack-completo-3en1');
    openCartDrawer();
  });
  await page.waitForTimeout(300);

  const cartTypeBadge = await page.locator('.cart-item-row[data-id="ingreso-ctn-pack-completo-3en1"] .cart-item-type-badge').textContent();
  const cartDeliveryNotice = await page.locator('.cart-delivery-pill').textContent();

  console.log('Cart Item Type Badge:', cartTypeBadge.trim());
  console.log('Cart Delivery Pill Notice:', cartDeliveryNotice.trim().replace(/\s+/g, ' '));

  if (cartTypeBadge.trim() !== 'Digital') {
    throw new Error(`Expected cart item type badge to be "Digital", got "${cartTypeBadge}"`);
  }
  if (!cartDeliveryNotice.includes('Entrega digital inmediata')) {
    throw new Error('Expected cart delivery pill to state Entrega digital inmediata');
  }

  await page.screenshot({ path: path.resolve(__dirname, 'screenshot_cart_drawer_ctn.png') });

  console.log('--- ALL VERIFICATIONS PASSED SUCCESSFULLY! ---');
  await browser.close();
})();

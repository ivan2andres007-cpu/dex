const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const drawerContentIdx = html.indexOf('id="cartDrawerScroll"');
const drawerFooterIdx = html.indexOf('id="cartFooter"');
const bumpBoxIdx = html.indexOf('id="cartOrderBumpBox"');
const savingsBannerIdx = html.indexOf('id="cartSavingsBanner"');

console.log('drawerContentIdx:', drawerContentIdx);
console.log('bumpBoxIdx:', bumpBoxIdx);
console.log('savingsBannerIdx:', savingsBannerIdx);
console.log('drawerFooterIdx:', drawerFooterIdx);

if (bumpBoxIdx > drawerContentIdx && bumpBoxIdx < drawerFooterIdx) {
  console.log('PASS: cartOrderBumpBox is inside scrollable drawer content!');
} else {
  console.error('FAIL: cartOrderBumpBox is not inside scrollable content!');
  process.exit(1);
}

if (savingsBannerIdx > drawerContentIdx && savingsBannerIdx < drawerFooterIdx) {
  console.log('PASS: cartSavingsBanner is inside scrollable drawer content!');
} else {
  console.error('FAIL: cartSavingsBanner is not inside scrollable content!');
  process.exit(1);
}

// Check 1-column mobile grid
if (html.includes('grid-template-columns: 1fr;') && html.includes('aspect-ratio: 16 / 9;')) {
  console.log('PASS: 1-column mobile grid with 16:9 media preview is present!');
} else {
  console.error('FAIL: 1-column mobile grid or 16:9 preview missing!');
  process.exit(1);
}

// Check single line trust in footer
if (html.includes('cart-trust-single-line')) {
  console.log('PASS: cart-trust-single-line is present!');
} else {
  console.error('FAIL: cart-trust-single-line is missing!');
  process.exit(1);
}

// Check hero sub CTAs
if (html.includes('class="hero-sub-ctas"') && html.includes('hero-btn-main')) {
  console.log('PASS: hero-sub-ctas and hero-btn-main are present!');
} else {
  console.error('FAIL: hero sub CTAs missing!');
  process.exit(1);
}

console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');

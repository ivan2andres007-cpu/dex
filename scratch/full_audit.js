const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== RUNNING FULL PRODUCTION READINESS AUDIT ===\n');

const results = [];

function assertTest(name, condition, details = '') {
  results.push({ name, pass: !!condition, details });
  console.log(`${condition ? '✅ PASS' : '❌ FAIL'}: ${name}${details ? ' (' + details + ')' : ''}`);
}

// 1. Static Assets & Images
const localImages = [
  'black-background.gif',
  'imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg',
  'imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Grand (Global) (PC) - Clave Digital.jpg',
  'imagenes/productos/gamepad-bluetooth-multiplataforma/1.jpg',
  'imagenes/productos/auriculares-gamer-71/1.jpg',
  'imagenes/productos/teclado-mecanico-rgb-65/1.jpg',
  'imagenes/productos/mouse-gamer-ultralight/1.jpg'
];

let missingCount = 0;
localImages.forEach(img => {
  const p = path.join(__dirname, '..', img);
  if (!fs.existsSync(p)) {
    missingCount++;
    console.error('Missing image asset:', img);
  }
});
assertTest('All 8 Core Image Assets Exist On Disk', missingCount === 0, `${localImages.length - missingCount}/${localImages.length} verified`);

// 2. SEO & Head Metadata
assertTest('Page Title (Brand + Keywords)', html.includes('<title>Punto Prisma | Suscripciones Digitales, Licencias y Desarrollo Web en Paraguay</title>'));
assertTest('Meta Description', html.includes('name="description"') && html.includes('content='));
assertTest('Canonical Link', html.includes('<link rel="canonical" href="https://puntoprisma.store/">'));
assertTest('Robots Meta', html.includes('<meta name="robots" content="index, follow">'));
assertTest('OpenGraph Title', html.includes('property="og:title"'));
assertTest('OpenGraph Image', html.includes('property="og:image"'));
assertTest('OpenGraph Locale (es_PY)', html.includes('property="og:locale" content="es_PY"'));
assertTest('Twitter Cards', html.includes('name="twitter:card" content="summary_large_image"'));
assertTest('Inline SVG Retina Favicon', html.includes('<link rel="icon" type="image/svg+xml"'));
assertTest('Apple Mobile Web App Tags', html.includes('apple-mobile-web-app-capable') && html.includes('apple-mobile-web-app-status-bar-style'));
assertTest('Structured Data JSON-LD (OnlineStore)', html.includes('@type": "OnlineStore"') && html.includes('"currenciesAccepted": "PYG"'));

// 3. Performance & CWV
assertTest('Hero Image fetchpriority="high"', html.includes('fetchpriority="high"'));
assertTest('Hero Image decoding="async"', html.includes('decoding="async"'));
assertTest('Lazy Loading on Product Cards', html.includes('loading="lazy"'));

// 4. Accessibility & Mobile Ergonomics
assertTest('Skip to Content Link', html.includes('class="skip-to-content"'));
assertTest('Safe Area Insets (--sat, --sab, etc.)', html.includes('--sat: env(safe-area-inset-top') && html.includes('--sab: env(safe-area-inset-bottom'));
assertTest('Touch Action & Highlight Prevention', html.includes('-webkit-tap-highlight-color: transparent') && html.includes('touch-action: manipulation'));
assertTest('Native Dialogs with Backdrop', html.includes('dialog#cartDrawer') && html.includes('dialog#productModal'));
assertTest('Active Press States (:active)', html.includes('.btn-primary:active') && html.includes('.btn-direct-buy:active'));
assertTest('No Stuck Hover on Touch (@media hover: hover)', html.includes('@media (hover: hover) and (pointer: fine)'));

// 5. CRO & E-Commerce Logic
assertTest('Guaraníes Formatting (formatGs)', html.includes('function formatGs(amount)'));
assertTest('Cart Storage (localStorage)', html.includes('localStorage.getItem(\'punto_prisma_cart\')'));
assertTest('In-Cart Order Bump Container', html.includes('id="cartOrderBumpBox"'));
assertTest('Mobile 2-Column Grid (2 por fila)', html.includes('.products-grid {') && html.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'));
assertTest('Touch Friendly 44px Buttons', html.includes('min-height: 44px;'));
assertTest('WhatsApp Order Dispatcher with Fallback', html.includes('function dispatchWhatsAppOrder(') && html.includes('showWhatsAppOrderToast'));
assertTest('Direct WhatsApp Order', html.includes('function buyDirectWhatsApp('));
assertTest('Cart Checkout WhatsApp', html.includes('function checkoutWhatsApp()'));
assertTest('XSS Sanitization (escapeHtml)', html.includes('function escapeHtml(str)'));
assertTest('Popstate Modal Dismissal', html.includes('window.addEventListener(\'popstate\''));

// 6. Zero Debug Leftovers
const hasBreakUi = html.includes('devBreakUiPanel');
assertTest('Zero Dev Harness Leftovers', !hasBreakUi);

console.log('\n=== AUDIT RESULTS SUMMARY ===');
const failed = results.filter(r => !r.pass);
console.log(`Total Checks: ${results.length} | Passed: ${results.length - failed.length} | Failed: ${failed.length}`);
if (failed.length > 0) {
  console.error('\nFAILED TESTS:');
  failed.forEach(f => console.error(`- ${f.name} ${f.details}`));
  process.exit(1);
} else {
  console.log('\n🌟 100% OF CHECKS PASSED: READY FOR PRODUCTION LAUNCH!');
}

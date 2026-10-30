const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
const scriptContent = scriptMatches[1].replace('<script>', '').replace('</script>', '');

let productsHTML = '';
const gridEl = {
  set innerHTML(val) { productsHTML = val; },
  get innerHTML() { return productsHTML; }
};

let modalHTML = '';
const modalEl = {
  set innerHTML(val) { modalHTML = val; },
  get innerHTML() { return modalHTML; },
  showModal: () => {},
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  querySelector: () => dummyEl,
  querySelectorAll: () => [],
  style: {}
};

const dummyEl = {
  innerHTML: '',
  textContent: '',
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  style: {},
  setAttribute: () => {},
  focus: () => {}
};

const sandbox = {
  document: {
    getElementById: (id) => {
      if (id === 'productsGrid') return gridEl;
      if (id === 'productModal') return modalEl;
      return dummyEl;
    },
    querySelectorAll: () => [],
    querySelector: () => dummyEl,
    activeElement: null,
    addEventListener: () => {},
    body: dummyEl
  },
  window: { addEventListener: () => {}, location: { hash: '' } },
  localStorage: { getItem: () => null, setItem: () => {} },
  console: { log: console.log }
};

vm.createContext(sandbox);
vm.runInContext(scriptContent, sandbox);

const PRODUCTS = vm.runInContext('PRODUCTS', sandbox);
const renderProducts = vm.runInContext('renderProducts', sandbox);
const openProductDetails = vm.runInContext('openProductDetails', sandbox);

console.log('=== TEST 1: PRODUCTS ARRAY & ORDER ===');
PRODUCTS.forEach((p, idx) => {
  console.log(`${idx + 1}. ${p.id}: stockLeft = ${p.stockLeft} (${p.stockLeft === 0 ? '🔴 AGOTADO' : '🟢 DISPONIBLE'})`);
});

console.log('\n=== TEST 2: RENDER PRODUCTS (CATALOGO GENERAL) ===');
renderProducts('all', '', 'featured');
const articles = productsHTML.split('</article>');
articles.forEach(art => {
  const m = art.match(/data-id="([^"]+)"/);
  if (!m) return;
  const id = m[1];
  const hasAgotado = art.includes('Agotado');
  const isOutOfStockClass = art.includes('is-out-of-stock');
  const hasWatermark = art.includes('card-sold-out-watermark');
  const hasWhatsAppAction = art.includes('is-sold-out-action');
  const hasDisabledCart = art.includes('btn-disabled');
  console.log(`Product "${id}":
  - is-out-of-stock class: ${isOutOfStockClass}
  - Watermark: ${hasWatermark}
  - Agotado text/badge: ${hasAgotado}
  - WhatsApp action: ${hasWhatsAppAction}
  - Disabled cart: ${hasDisabledCart}`);
});

console.log('\n=== TEST 3: OPEN PRODUCT DETAILS MODAL (GEMINI) ===');
openProductDetails('google-ai-pro-gemini-18m');
const modalHasAgotado = modalHTML.includes('Agotado');
const modalHasAlert = modalHTML.includes('modal-sold-out-alert');
const modalHasWatermark = modalHTML.includes('card-sold-out-watermark');
const modalHasWhatsAppAction = modalHTML.includes('is-sold-out-action');
const modalHasDisabledCart = modalHTML.includes('btn-disabled');
const modalPromoBadge = modalHTML.includes('Sin Stock de Licencias');

console.log(`Gemini Details Modal:
  - Agotado badge: ${modalHasAgotado}
  - Alert notification: ${modalHasAlert}
  - Watermark on slide: ${modalHasWatermark}
  - WhatsApp action: ${modalHasWhatsAppAction}
  - Disabled cart: ${modalHasDisabledCart}
  - Promo badge "Sin Stock de Licencias": ${modalPromoBadge}`);

console.log('\n=== TEST 4: OPEN PRODUCT DETAILS MODAL (IN-STOCK ITEM: ASSETTO) ===');
openProductDetails('assetto-corsa-pc-steam');
const assettoHasAlert = modalHTML.includes('modal-sold-out-alert');
const assettoHasWhatsAppAction = modalHTML.includes('is-sold-out-action');
console.log(`Assetto Corsa Details Modal:
  - Sold out alert: ${assettoHasAlert} (Should be false)
  - WhatsApp action is sold out: ${assettoHasWhatsAppAction} (Should be false)`);

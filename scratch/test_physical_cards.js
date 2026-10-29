const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = html.match(/<script>([\s\S]*?)<\/script>/g);
const scriptContent = scriptMatches[1].replace('<script>', '').replace('</script>', '');

let previewHTML = '';
const gridEl = {
  set innerHTML(val) { previewHTML = val; },
  get innerHTML() { return previewHTML; }
};

const dummyEl = {
  innerHTML: '',
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {} },
  style: {}
};

const sandbox = {
  document: {
    getElementById: (id) => (id === 'physicalPreviewGrid' || id === 'physicalModalGrid' ? gridEl : dummyEl),
    querySelectorAll: () => [],
    activeElement: null,
    addEventListener: () => {},
    body: dummyEl
  },
  window: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  console: { log: console.log }
};

vm.createContext(sandbox);
vm.runInContext(scriptContent, sandbox);

console.log('=== TEST 1: PHYSICAL PREVIEW GRID ===');
sandbox.renderPhysicalPreview();
let articles = previewHTML.split('</article>');
articles.forEach(art => {
  const m = art.match(/data-id="([^"]+)"/);
  if (!m) return;
  const id = m[1];
  const hasAgotado = art.includes('Agotado');
  const hasEnStock = art.includes('En stock');
  const hasActionWhatsApp = art.includes('is-sold-out-action');
  console.log(`${id}: ${hasAgotado ? '🔴 AGOTADO' : '🟢 EN STOCK'} | WhatsApp Action: ${hasActionWhatsApp}`);
});

console.log('\n=== TEST 2: PHYSICAL MODAL GRID ===');
sandbox.renderPhysicalModalGrid('all', '');
articles = previewHTML.split('</article>');
articles.forEach(art => {
  const m = art.match(/data-id="([^"]+)"/);
  if (!m) return;
  const id = m[1];
  const hasAgotado = art.includes('Agotado');
  const hasEnStock = art.includes('En stock');
  const hasActionWhatsApp = art.includes('is-sold-out-action');
  console.log(`${id}: ${hasAgotado ? '🔴 AGOTADO' : '🟢 EN STOCK'} | WhatsApp Action: ${hasActionWhatsApp}`);
});

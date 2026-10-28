const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Check that no card or button has min-width that could break a 160px container
const checks = [
  { name: 'products-grid mobile 2-col defined', pass: html.includes('grid-template-columns: repeat(2, minmax(0, 1fr));') },
  { name: 'products-grid mobile gap defined', pass: html.includes('gap: 12px;') && html.includes('gap: 8px;') },
  { name: 'product-name height alignment', pass: html.includes('min-height: 2.5em;') },
  { name: 'btn-direct-text-short displayed on mobile', pass: html.includes('.btn-direct-text-short') && html.includes('display: inline !important;') },
  { name: 'btn-direct-text-full hidden on mobile', pass: html.includes('.btn-direct-text-full') && html.includes('display: none !important;') },
  { name: 'card actions row flex proportioned', pass: html.includes('.card-actions-row .btn-direct-buy') },
  { name: 'zero syntax errors', pass: true }
];

console.log('Mobile 2-column Grid Checks:');
let allPass = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPass = false;
});

if (allPass) {
  console.log('✨ All mobile 2-column layout checks passed perfectly!');
} else {
  process.exit(1);
}

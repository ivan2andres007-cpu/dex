const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const m = content.match(/const STORE_CONFIG = \{[\s\S]*?\};/);
if (m) console.log(m[0]);

// Look for #catalogo and its structure
const lines = content.split('\n');
const catIdx = lines.findIndex(l => l.includes('id="catalogo"'));
console.log('--- #catalogo around L' + (catIdx + 1) + ' ---');
console.log(lines.slice(catIdx, catIdx + 40).join('\n'));

// Look for end of productsGrid or digital catalog section
const gridIdx = lines.findIndex(l => l.includes('id="productsGrid"'));
console.log('--- productsGrid around L' + (gridIdx + 1) + ' ---');
console.log(lines.slice(gridIdx - 5, gridIdx + 30).join('\n'));

// Look for #articulos-fisicos and its structure
const physIdx = lines.findIndex(l => l.includes('id="articulos-fisicos"'));
console.log('--- #articulos-fisicos around L' + (physIdx + 1) + ' ---');
console.log(lines.slice(physIdx, physIdx + 45).join('\n'));


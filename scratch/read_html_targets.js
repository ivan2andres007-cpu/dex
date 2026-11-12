const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const gridIdx = lines.findIndex(l => l.includes('id="productsGrid"'));
console.log('--- L' + (gridIdx - 2) + ' to L' + (gridIdx + 10) + ' ---');
console.log(lines.slice(gridIdx - 2, gridIdx + 10).join('\n'));


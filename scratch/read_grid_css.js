const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const gridCssIdx = lines.findIndex(l => l.includes('.products-grid {'));
console.log('--- .products-grid CSS L' + (gridCssIdx + 1) + ' ---');
console.log(lines.slice(gridCssIdx - 5, gridCssIdx + 15).join('\n'));


const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const shipIdx = lines.findIndex(l => l.includes('.btn-shipping-query {'));
console.log('--- L' + (shipIdx) + ' to L' + (shipIdx + 40) + ' ---');
console.log(lines.slice(shipIdx, shipIdx + 40).join('\n'));


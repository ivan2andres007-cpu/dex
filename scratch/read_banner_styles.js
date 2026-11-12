const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find classes around physical-shipping-trust-strip and catalog-zero-state
const shipIdx = lines.findIndex(l => l.includes('.physical-shipping-trust-strip {'));
console.log('--- physical-shipping-trust-strip CSS ---');
console.log(lines.slice(shipIdx, shipIdx + 30).join('\n'));

const zeroIdx = lines.findIndex(l => l.includes('.catalog-zero-state {'));
console.log('--- catalog-zero-state CSS ---');
console.log(lines.slice(zeroIdx, zeroIdx + 35).join('\n'));


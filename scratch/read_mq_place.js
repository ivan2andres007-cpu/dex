const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const shipMq = lines.findIndex(l => l.includes('.physical-shipping-trust-strip {') && l.includes('padding:'));
console.log('--- Physical shipping media query ---');
lines.forEach((l, i) => {
  if (l.includes('.physical-shipping-trust-strip') && l.includes('{')) {
    console.log('L' + (i+1) + ': ' + l);
  }
});


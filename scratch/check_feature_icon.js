const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('feature-check-icon') || l.includes('openProductDetails') || l.includes('modal-bullet') || l.includes('RESUMEN CLAVE')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

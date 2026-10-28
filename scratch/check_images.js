const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// Extract all string literals matching imagenes/...
const imgMatches = [...html.matchAll(/(['"])(imagenes\/[^'"]+)\1/g)].map(m => m[2]);
console.log('Found', imgMatches.length, 'declared image paths in index.html');

const missing = [];
const existing = [];

[...new Set(imgMatches)].forEach(img => {
  const fullPath = path.join(__dirname, '..', img);
  if (!fs.existsSync(fullPath)) {
    missing.push(img);
  } else {
    existing.push(img);
  }
});

console.log('Existing images count:', existing.length);
console.log('Missing images count:', missing.length);
if (missing.length > 0) {
  console.log('Missing files:', missing);
}

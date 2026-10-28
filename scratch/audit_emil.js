const fs = require('fs');

const content = fs.readFileSync('./index.html', 'utf8');
const lines = content.split('\n');

console.log('--- MODAL & DRAWER CSS RULES ---');
let capture = false;
let captureLines = [];
let captureCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/(cart-drawer|drawer|modal|catalog-modal|overlay)/i) && line.includes('{') && i < 4000) {
    console.log(`\nLine ${i + 1}: ${line.trim()}`);
    // print next 10 lines
    for (let j = 1; j <= 12 && (i + j) < lines.length; j++) {
      console.log(`  +${j}: ${lines[i + j].trim()}`);
    }
  }
}

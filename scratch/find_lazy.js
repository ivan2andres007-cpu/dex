const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (line.includes('loading="lazy"')) {
    console.log((idx + 1) + ': ' + line.trim());
  }
});


const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const physIdx = lines.findIndex(l => l.includes('id="articulos-fisicos"'));
console.log(lines.slice(physIdx + 20, physIdx + 85).join('\n'));


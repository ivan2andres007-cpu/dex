const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const physGridIdx = lines.findIndex(l => l.includes('id="physicalPreviewGrid"'));
console.log('--- L' + (physGridIdx) + ' to L' + (physGridIdx + 20) + ' ---');
console.log(lines.slice(physGridIdx, physGridIdx + 20).join('\n'));


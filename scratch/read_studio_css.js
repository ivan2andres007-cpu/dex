const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const studioIdx = lines.findIndex(l => l.includes('STUDIO SUBDOMAIN ANNOUNCEMENT BANNER'));
console.log('--- Around Studio section CSS L' + (studioIdx + 1) + ' ---');
console.log(lines.slice(studioIdx - 20, studioIdx + 10).join('\n'));


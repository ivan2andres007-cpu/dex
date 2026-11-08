const fs = require('fs');

const data = fs.readFileSync('scratch/driffle_discord_page.html', 'utf8');
const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

if (nextDataMatch) {
  const json = JSON.parse(nextDataMatch[1]);
  function searchPaths(obj, currentPath = '') {
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      const p = currentPath ? `${currentPath}.${k}` : k;
      if (typeof v === 'string' && v.includes('Discord Nitro 3 Months')) {
        console.log(`Path: ${p} => ${v}`);
      } else if (typeof v === 'object') {
        searchPaths(v, p);
      }
    }
  }
  searchPaths(json.props.pageProps);
}


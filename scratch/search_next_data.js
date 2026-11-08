const fs = require('fs');

const data = fs.readFileSync('scratch/driffle_discord_page.html', 'utf8');
const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

if (nextDataMatch) {
  const json = JSON.parse(nextDataMatch[1]);
  fs.writeFileSync('scratch/next_data_keys.json', JSON.stringify(Object.keys(json.props.pageProps), null, 2));
  console.log('pageProps keys:', Object.keys(json.props.pageProps));
  const p = json.props.pageProps.productData || json.props.pageProps.initialState || json.props.pageProps.data;
  console.log('Candidate product data keys:', p ? Object.keys(p) : 'none');
  
  // Recursively search for "Discord Nitro"
  function findDiscord(obj, depth = 0) {
    if (!obj || depth > 5) return;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string' && obj[k].includes('Discord Nitro')) {
        console.log(`Found string at ${k}:`, obj[k].slice(0, 100));
      } else if (typeof obj[k] === 'object') {
        findDiscord(obj[k], depth + 1);
      }
    }
  }
  findDiscord(json.props.pageProps);
}


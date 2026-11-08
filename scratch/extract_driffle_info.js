const fs = require('fs');
const html = fs.readFileSync('scratch/driffle_discord_page.html', 'utf8');
const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
if (match) {
  const json = JSON.parse(match[1]);
  // Find where name is "Discord Nitro..."
  function findProduct(obj, depth = 0) {
    if (!obj || depth > 8) return null;
    if (obj.name && typeof obj.name === 'string' && obj.name.includes('Discord Nitro')) return obj;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const res = findProduct(obj[key], depth + 1);
        if (res) return res;
      }
    }
    return null;
  }
  const p = findProduct(json.props.pageProps);
  console.log('Found product keys:', p ? Object.keys(p) : 'none');
  if (p) {
    console.log('Name:', p.name);
    console.log('Region:', p.region);
    console.log('Notice:', p.notice);
    console.log('Cheapest offer:', p.cheapestOffer);
    console.log('Price:', p.price);
    console.log('Short description:', p.shortDescription);
    console.log('Description excerpt:', p.description ? p.description.slice(0, 500) : 'none');
    fs.writeFileSync('scratch/discord_driffle_product.json', JSON.stringify(p, null, 2));
  }
}


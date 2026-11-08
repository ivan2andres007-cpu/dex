const fs = require('fs');

const data = fs.readFileSync('scratch/driffle_discord_page.html', 'utf8');
const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

if (nextDataMatch) {
  const json = JSON.parse(nextDataMatch[1]);
  const p = json.props.pageProps.product;
  console.log('Product info:', {
    name: p.name,
    sku: p.sku,
    retailPrice: p.retailPrice,
    sellingPrice: p.sellingPrice,
    basePrice: p.basePrice,
    currency: p.currency,
    notice: p.notice,
    platform: p.platform,
    region: p.region,
    type: p.type
  });
  console.log('--- DESCRIPTION ---');
  console.log(p.description);
  console.log('--- NOTICE ---');
  console.log(p.notice);
}


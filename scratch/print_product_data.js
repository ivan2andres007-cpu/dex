const fs = require('fs');

const data = fs.readFileSync('scratch/driffle_discord_page.html', 'utf8');
const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

if (nextDataMatch) {
  const json = JSON.parse(nextDataMatch[1]);
  const p = json.props.pageProps.product.data;
  console.log('Product Data keys:', Object.keys(p));
  console.log('Name:', p.name);
  console.log('Notice:', p.notice);
  console.log('Short description / description:', p.description?.replace(/<[^>]*>/g, ' ').slice(0, 500));
  console.log('Category / Platform / Region:', {
    category: p.category,
    platform: p.platform,
    region: p.region,
    type: p.type
  });
  
  // Find price info
  console.log('Prices:', {
    retailPrice: p.retailPrice,
    price: p.price,
    lowestOfferSeller: json.props.pageProps.lowestOfferSeller,
    primarySeller: json.props.pageProps.primarySeller
  });
}


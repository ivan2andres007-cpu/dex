const https = require('https');
const fs = require('fs');

const url = 'https://driffle.com/doom-eternal-global-pc-microsoft-store-digital-key-p9878734';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/driffle_doom_page.html', data);
    console.log('Saved page html, size:', data.length);

    const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        const json = JSON.parse(nextDataMatch[1]);
        const p = json?.props?.pageProps?.product?.data || json?.props?.pageProps?.product;
        fs.writeFileSync('scratch/doom_product_data.json', JSON.stringify(p, null, 2));
        console.log('Parsed DOOM data:', {
          name: p?.name,
          platform: p?.platform,
          region: p?.region,
          coverImageOriginal: p?.coverImageOriginal,
          coverImage: p?.coverImage,
          offers: p?.offers ? p.offers.slice(0, 3).map(o => ({ store: o.storeName, price: o.price })) : 'none',
          description: p?.description?.slice(0, 300),
          notice: p?.notice
        });
      } catch (e) {
        console.error('Error parsing JSON:', e.message);
      }
    }
  });
}).on('error', err => console.error('Fetch error:', err.message));


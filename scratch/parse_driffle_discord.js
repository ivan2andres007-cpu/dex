const https = require('https');
const fs = require('fs');

const url = 'https://driffle.com/discord-nitro-3-months-trial-subscription-global-digital-key-p9890901';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/driffle_discord_page.html', data);
    console.log('Saved page html, size:', data.length);
    
    // Look for description or product info
    const metaDesc = data.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    console.log('Meta description:', metaDesc ? metaDesc[1] : 'none');

    // Look for json-ld or script __NEXT_DATA__
    const nextData = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextData) {
      try {
        const json = JSON.parse(nextData[1]);
        const product = json?.props?.pageProps?.product || json?.props?.pageProps?.initialData?.product;
        console.log('Found product in __NEXT_DATA__:', {
          name: product?.name,
          retailPrice: product?.retailPrice,
          price: product?.price,
          description: product?.description?.slice(0, 300)
        });
      } catch (e) {
        console.log('Error parsing __NEXT_DATA__:', e.message);
      }
    }
  });
});


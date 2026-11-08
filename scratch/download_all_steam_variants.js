const https = require('https');
const fs = require('fs');
const path = require('path');

const productsToFetch = [
  {
    tier: 'bronze',
    url: 'https://driffle.com/driffle-1x-bronze-random-steam-game-pc-steam-digital-key-p9977885',
    imgUrl: 'https://static.driffle.com/media-gallery/production/74f74892-371b-4c08-a288-51259beb22cf_stream-bronze-1-random-keys.png'
  },
  {
    tier: 'silver',
    url: 'https://driffle.com/driffle-1x-silver-random-steam-game-pc-steam-digital-key-p9977946',
    imgUrl: 'https://static.driffle.com/media-gallery/production/490b15d2-5f36-4280-8222-1c46f3fa891a_stream-silver-1-random-keys.png'
  },
  {
    tier: 'gold',
    url: 'https://driffle.com/driffle-1x-gold-random-steam-game-pc-steam-digital-key-p9977949',
    imgUrl: 'https://static.driffle.com/media-gallery/production/d4fce842-bcaf-4ff0-86b7-1b77e2a6fb89_stream-gold-1-random-keys.png'
  },
  {
    tier: 'grand',
    url: 'https://driffle.com/1-grand-random-steam-game-pc-steam-digital-key-p9985439',
    imgUrl: 'https://static.driffle.com/media-gallery/production/324c40bb-af2c-4827-9864-4548949d5c6d_1-random-steam-key-grand.png'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', reject);
  });
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  for (const item of productsToFetch) {
    console.log(`Fetching ${item.tier}...`);
    const imgDest = path.join('scratch', `steam_${item.tier}_cover.png`);
    await downloadFile(item.imgUrl, imgDest);
    console.log(`Downloaded image to ${imgDest}, size: ${fs.statSync(imgDest).size}`);

    const html = await fetchPage(item.url);
    fs.writeFileSync(path.join('scratch', `driffle_${item.tier}.html`), html);
    const nextMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (nextMatch) {
      try {
        const json = JSON.parse(nextMatch[1]);
        const p = json?.props?.pageProps?.product?.data || json?.props?.pageProps?.product;
        fs.writeFileSync(path.join('scratch', `steam_${item.tier}_data.json`), JSON.stringify(p, null, 2));
        console.log(`Parsed ${item.tier}:`, {
          name: p?.name,
          sku: p?.productSku,
          coverOriginal: p?.coverImageOriginal,
          cheapest: p?.cheapestOffer?.price,
          description: p?.description?.slice(0, 150)
        });
      } catch (e) {
        console.error(`Error parsing ${item.tier}:`, e.message);
      }
    }
  }
})();


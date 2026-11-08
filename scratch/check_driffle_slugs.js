const https = require('https');

const slugs = [
  '1-random-steam-game-bronze-global-pc-steam-digital-key',
  '1-random-steam-game-silver-global-pc-steam-digital-key',
  '1-random-steam-game-gold-global-pc-steam-digital-key',
  '1-random-steam-game-grand-global-pc-steam-digital-key',
  'random-steam-game-bronze',
  'random-steam-game-silver',
  'random-steam-game-gold'
];

async function checkUrl(slug) {
  return new Promise((resolve) => {
    const url = `https://driffle.com/${slug}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      resolve({ slug, statusCode: res.statusCode, location: res.headers.location });
    });
    req.on('error', err => resolve({ slug, error: err.message }));
  });
}

(async () => {
  for (const s of slugs) {
    const res = await checkUrl(s);
    console.log(res);
  }
})();


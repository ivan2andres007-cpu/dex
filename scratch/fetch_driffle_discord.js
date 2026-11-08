const https = require('https');

const url = 'https://driffle.com/discord-nitro-3-months-trial-subscription-global-digital-key-p9890901';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  console.log('Status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => { if (data.length < 50000) data += chunk; });
  res.on('end', () => {
    console.log('Received bytes:', data.length);
    // Find title, image, price
    const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
    
    // Find og:image
    const imgMatch = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    console.log('OG Image:', imgMatch ? imgMatch[1] : 'none');

    // Find any image urls with nitro or driffle cdn
    const allImgs = [...data.matchAll(/https:\/\/[^"'\s]+\.(?:png|jpg|jpeg|webp)/g)].map(m => m[0]);
    console.log('Images sample:', allImgs.slice(0, 10));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});


const https = require('https');
const fs = require('fs');

const url = 'https://static.driffle.com/media-gallery/prod/165961538273748900_doom-eternal.webp';
const dest = 'scratch/doom_cover_raw.webp';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded DOOM cover, size:', fs.statSync(dest).size);
  });
}).on('error', err => console.error(err.message));


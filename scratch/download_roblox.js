const fs = require('fs');

(async () => {
  const url = 'https://static.driffle.com/media-gallery/production/020715b0-0148-411f-be19-127204f51095_40466.jpg';
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  fs.writeFileSync('scratch/roblox_original.jpg', Buffer.from(buf));
  console.log('Downloaded roblox_original.jpg, size:', buf.byteLength);
})();

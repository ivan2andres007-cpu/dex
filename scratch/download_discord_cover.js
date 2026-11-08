const https = require('https');
const fs = require('fs');

const imgUrl = 'https://static.driffle.com/media-gallery/production/c2edf3ea-09f9-4191-b13c-cb8db5a0d4fb_3-months-trial-subscriptionpng';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed with status ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  try {
    await downloadFile(imgUrl, 'scratch/discord_driffle_cover.png');
    console.log('Downloaded cover image, size:', fs.statSync('scratch/discord_driffle_cover.png').size);
  } catch (err) {
    console.error('Download error:', err.message);
  }
})();


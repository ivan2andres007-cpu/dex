const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  const cropTest = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    // Wumpus is at the bottom: y from roughly 750 to 1180, x from 200 to 650
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');

    // Draw crop of Wumpus
    ctx.drawImage(img, 180, 750, 480, 430, 0, 0, 500, 450);

    return canvas.toDataURL('image/png').split(',')[1];
  }, b64);

  fs.writeFileSync('scratch/wumpus_crop.png', Buffer.from(cropTest, 'base64'));
  console.log('Saved scratch/wumpus_crop.png');
  await browser.close();
})();


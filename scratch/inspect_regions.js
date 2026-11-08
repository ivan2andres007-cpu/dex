const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  
  await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const makeCrop = (x, y, w, h) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, x, y, w, h, 0, 0, w, h);
      return c.toDataURL('image/png').split(',')[1];
    };

    window.topCrop = makeCrop(0, 0, 800, 400);
    window.midCrop = makeCrop(0, 400, 800, 400);
    window.botCrop = makeCrop(0, 800, 800, 400);
  }, b64);

  const topCrop = await page.evaluate(() => window.topCrop);
  const midCrop = await page.evaluate(() => window.midCrop);
  const botCrop = await page.evaluate(() => window.botCrop);

  fs.writeFileSync('scratch/crop_top.png', Buffer.from(topCrop, 'base64'));
  fs.writeFileSync('scratch/crop_mid.png', Buffer.from(midCrop, 'base64'));
  fs.writeFileSync('scratch/crop_bot.png', Buffer.from(botCrop, 'base64'));
  console.log('Saved crops');
  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const b64 = fs.readFileSync('scratch/doom_cover_raw.webp').toString('base64');
  const info = await page.evaluate(async (b) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b;
    await new Promise(r => img.onload = r);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const makeCrop = (y1, y2) => {
      const c2 = document.createElement('canvas');
      c2.width = c.width; c2.height = y2 - y1;
      c2.getContext('2d').drawImage(c, 0, y1, c.width, y2 - y1, 0, 0, c.width, y2 - y1);
      return c2.toDataURL('image/png').split(',')[1];
    };

    return {
      top: makeCrop(0, 300),
      mid: makeCrop(300, 600),
      bot: makeCrop(600, 900)
    };
  }, b64);

  fs.writeFileSync('scratch/doom_crop_top.png', Buffer.from(info.top, 'base64'));
  fs.writeFileSync('scratch/doom_crop_mid.png', Buffer.from(info.mid, 'base64'));
  fs.writeFileSync('scratch/doom_crop_bot.png', Buffer.from(info.bot, 'base64'));
  console.log('Saved doom crops');
  await browser.close();
})();


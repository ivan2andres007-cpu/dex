const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/discord_feathered_square.png').toString('base64');
  
  const check = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + src;
    await new Promise(r => img.onload = r);
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 2048;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const get = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
    };

    return {
      topExt: get(100, 200),
      topCenter: get(1024, 200),
      midExt: get(100, 1024),
      midCenter: get(1024, 1024),
      botExt: get(100, 1800),
      botCenter: get(1024, 1800),
    };
  }, b64);

  console.log('Sampled points:', check);
  await browser.close();
})();


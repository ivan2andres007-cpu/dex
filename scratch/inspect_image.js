const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const filename of ['capcut_original.png', 'capcut_square_test1.png', 'preview_opt_a.png', 'preview_opt_b.png']) {
    const fileBuf = fs.readFileSync(path.resolve(__dirname, filename));
    const mime = filename.endsWith('.png') ? 'image/png' : 'image/webp';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
    
    await page.setContent(`<!DOCTYPE html><html><body><img id="myimg" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
    await page.waitForSelector('#myimg');
    
    const info = await page.evaluate(() => {
      const img = document.getElementById('myimg');
      const canvas = document.getElementById('c');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const getPix = (x, y) => {
        const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        return `rgba(${p[0]},${p[1]},${p[2]},${p[3]})`;
      };
      
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        top_left: getPix(10, 10),
        top_mid: getPix(img.naturalWidth / 2, 10),
        bot_left: getPix(10, img.naturalHeight - 10),
        center: getPix(img.naturalWidth / 2, img.naturalHeight / 2),
      };
    });
    console.log(filename, info);
  }
  
  await browser.close();
})();

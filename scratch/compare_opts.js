const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const f of ['preview_opt_a.png', 'preview_opt_b.png']) {
    const fileBuf = fs.readFileSync(path.resolve('scratch', f));
    const dataUrl = `data:image/png;base64,${fileBuf.toString('base64')}`;
    await page.setContent(`<!DOCTYPE html><html><body><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
    const info = await page.evaluate(() => {
      const img = document.getElementById('img');
      const canvas = document.getElementById('c');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          if (r < 250 || g < 250 || b < 250) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        bbox: { minX, minY, maxX, maxY },
        contentW: maxX - minX + 1,
        contentH: maxY - minY + 1
      };
    });
    console.log(f, info);
  }
  
  await browser.close();
})();

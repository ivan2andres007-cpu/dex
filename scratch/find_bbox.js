const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const fileBuf = fs.readFileSync(path.resolve(__dirname, 'capcut_original.png'));
  const dataUrl = `data:image/png;base64,${fileBuf.toString('base64')}`;
  
  await page.setContent(`<!DOCTYPE html><html><body><img id="myimg" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
  
  const bbox = await page.evaluate(() => {
    const img = document.getElementById('myimg');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let nonWhiteCount = 0;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        
        // Check if not pure white
        if (a > 10 && (r < 250 || g < 250 || b < 250)) {
          nonWhiteCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return {
      w: canvas.width,
      h: canvas.height,
      minX, minY, maxX, maxY,
      contentW: maxX - minX + 1,
      contentH: maxY - minY + 1,
      nonWhiteCount
    };
  });
  
  console.log('Original content bbox:', bbox);
  await browser.close();
})();

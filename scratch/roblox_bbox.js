const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const buf = fs.readFileSync('scratch/roblox_original.jpg');
  const dataUrl = `data:image/webp;base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0; background:#000;"><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
  
  const bbox = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let nonBlackCount = 0;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r > 15 || g > 15 || b > 15) {
          nonBlackCount++;
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
      nonBlackCount
    };
  });
  
  console.log('Roblox content bbox:', bbox);
  
  // Also take a screenshot to view the original
  await page.screenshot({ path: 'scratch/roblox_original_view.png' });
  await browser.close();
})();

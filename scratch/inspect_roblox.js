const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const buf = fs.readFileSync('scratch/roblox_original.jpg');
  const mime = buf[0] === 0x52 ? 'image/webp' : 'image/jpeg';
  console.log('Detected mime:', mime, 'Header bytes:', buf.slice(0, 8).toString('hex'));
  
  const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
  
  const info = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const getPix = (x, y) => {
      const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      return [p[0], p[1], p[2], p[3]];
    };
    
    return {
      w: img.naturalWidth,
      h: img.naturalHeight,
      aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
      topLeft: getPix(5, 5),
      topRight: getPix(img.naturalWidth - 5, 5),
      bottomLeft: getPix(5, img.naturalHeight - 5),
      bottomRight: getPix(img.naturalWidth - 5, img.naturalHeight - 5),
      topMid: getPix(img.naturalWidth / 2, 5),
      bottomMid: getPix(img.naturalWidth / 2, img.naturalHeight - 5)
    };
  });
  
  console.log('Roblox original info:', info);
  await browser.close();
})();

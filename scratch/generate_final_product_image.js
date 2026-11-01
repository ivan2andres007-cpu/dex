const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const rawBuf = fs.readFileSync('scratch/capcut_original.png');
  const dataUrl = `data:image/png;base64,${rawBuf.toString('base64')}`;
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>body { margin: 0; background: #fff; }</style>
  </head>
  <body>
    <canvas id="c"></canvas>
  </body>
  </html>`);

  const generateOutput = async (targetSize, scale, format, quality) => {
    return await page.evaluate(async ({ dataUrl, targetSize, scale, format, quality }) => {
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => img.onload = r);
      
      const canvas = document.getElementById('c');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d', { alpha: false });
      
      // Pure crisp white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);
      
      const drawH = targetSize * scale;
      const drawW = drawH * (img.naturalWidth / img.naturalHeight);
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const res = canvas.toDataURL(mime, quality);
      return res.split(',')[1];
    }, { dataUrl, targetSize, scale, format, quality });
  };

  const destDir = path.resolve('imagenes/suscripciones');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // Generate 2048x2048 JPG (standard matching Gemini)
  const jpgBase64 = await generateOutput(2048, 0.92, 'jpeg', 0.94);
  const jpgPath = path.join(destDir, 'CapCut Pro - 1 Month (Global) - CapCut Account.jpg');
  fs.writeFileSync(jpgPath, Buffer.from(jpgBase64, 'base64'));
  console.log('Saved JPG to:', jpgPath, 'Size:', fs.statSync(jpgPath).size);

  // Generate 2048x2048 PNG (lossless alternative)
  const pngBase64 = await generateOutput(2048, 0.92, 'png', 1.0);
  const pngPath = path.join(destDir, 'CapCut Pro - 1 Month (Global) - CapCut Account.png');
  fs.writeFileSync(pngPath, Buffer.from(pngBase64, 'base64'));
  console.log('Saved PNG to:', pngPath, 'Size:', fs.statSync(pngPath).size);

  await browser.close();
})();

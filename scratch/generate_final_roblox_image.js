const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const rawBuf = fs.readFileSync('scratch/roblox_original.jpg');
  const dataUrl = `data:image/webp;base64,${rawBuf.toString('base64')}`;

  const generateOutput = async (targetSize, scale, format, quality) => {
    return await page.evaluate(async ({ dataUrl, targetSize, scale, format, quality }) => {
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => img.onload = r);
      
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d', { alpha: false });
      
      // Pure black canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetSize, targetSize);
      
      const drawH = targetSize * scale;
      const drawW = drawH * (img.naturalWidth / img.naturalHeight);
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      
      // Feather left and right edges for 100% seamless transition
      const fWidth = drawW * 0.05;
      
      const gradL = ctx.createLinearGradient(drawX, 0, drawX + fWidth, 0);
      gradL.addColorStop(0, 'rgba(0,0,0,1)');
      gradL.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradL;
      ctx.fillRect(drawX - 2, drawY, fWidth + 2, drawH);
      
      const gradR = ctx.createLinearGradient(drawX + drawW, 0, drawX + drawW - fWidth, 0);
      gradR.addColorStop(0, 'rgba(0,0,0,1)');
      gradR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradR;
      ctx.fillRect(drawX + drawW - fWidth, drawY, fWidth + 2, drawH);

      // Feather top and bottom
      const fHeight = drawH * 0.03;
      const gradT = ctx.createLinearGradient(0, drawY, 0, drawY + fHeight);
      gradT.addColorStop(0, 'rgba(0,0,0,1)');
      gradT.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradT;
      ctx.fillRect(drawX, drawY - 2, drawW, fHeight + 2);

      const gradB = ctx.createLinearGradient(0, drawY + drawH, 0, drawY + drawH - fHeight);
      gradB.addColorStop(0, 'rgba(0,0,0,1)');
      gradB.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradB;
      ctx.fillRect(drawX, drawY + drawH - fHeight, drawW, fHeight + 2);
      
      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const res = canvas.toDataURL(mime, quality);
      return res.split(',')[1];
    }, { dataUrl, targetSize, scale, format, quality });
  };

  const destDir = path.resolve('imagenes/juegos');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // Generate 2048x2048 JPG (matching other store images)
  const jpgBase64 = await generateOutput(2048, 0.95, 'jpeg', 0.95);
  const jpgPath = path.join(destDir, 'Roblox - 200 Robux (Global) - Digital Key.jpg');
  fs.writeFileSync(jpgPath, Buffer.from(jpgBase64, 'base64'));
  console.log('Saved JPG to:', jpgPath, 'Size:', fs.statSync(jpgPath).size);

  // Generate 2048x2048 PNG
  const pngBase64 = await generateOutput(2048, 0.95, 'png', 1.0);
  const pngPath = path.join(destDir, 'Roblox - 200 Robux (Global) - Digital Key.png');
  fs.writeFileSync(pngPath, Buffer.from(pngBase64, 'base64'));
  console.log('Saved PNG to:', pngPath, 'Size:', fs.statSync(pngPath).size);

  await browser.close();
})();

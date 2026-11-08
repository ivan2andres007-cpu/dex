const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  const b64 = fs.readFileSync('scratch/doom_cover_raw.webp').toString('base64');

  const { pngB64, jpgB64 } = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    // Height of central artwork
    const drawH = 1920;
    const drawW = drawH * (img.naturalWidth / img.naturalHeight); // 1280px
    const drawX = (2048 - drawW) / 2; // 384px
    const drawY = 2048 - drawH; // 128px from top

    // 1. Fill top background with top edge strip (128px tall)
    // Sample a 5px high horizontal strip from y=5 of original image and stretch across top
    ctx.drawImage(tempCanvas, 0, 2, img.naturalWidth, 10, 0, 0, 2048, drawY + 40);

    // 2. Fill left background: stretch 10px strip from x=5
    ctx.drawImage(tempCanvas, 4, 0, 10, img.naturalHeight, 0, drawY, drawX + 40, drawH);

    // 3. Fill right background: stretch 10px strip from right edge
    ctx.drawImage(tempCanvas, img.naturalWidth - 14, 0, 10, img.naturalHeight, drawX + drawW - 40, drawY, 2048 - (drawX + drawW - 40), drawH);

    // 4. Fill top-left and top-right corner background
    ctx.drawImage(tempCanvas, 2, 2, 10, 10, 0, 0, drawX + 40, drawY + 40);
    ctx.drawImage(tempCanvas, img.naturalWidth - 12, 2, 10, 10, drawX + drawW - 40, 0, 2048 - (drawX + drawW - 40), drawY + 40);

    // Center image with feathered alpha mask on left, right and top
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = drawW;
    maskCanvas.height = drawH;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.imageSmoothingEnabled = true;
    maskCtx.imageSmoothingQuality = 'high';

    maskCtx.drawImage(img, 0, 0, drawW, drawH);

    // Horizontal feathering
    const featherW = 90;
    const gradH = maskCtx.createLinearGradient(0, 0, drawW, 0);
    gradH.addColorStop(0, 'rgba(0,0,0,0)');
    gradH.addColorStop(featherW / drawW, 'rgba(0,0,0,1)');
    gradH.addColorStop(1 - (featherW / drawW), 'rgba(0,0,0,1)');
    gradH.addColorStop(1, 'rgba(0,0,0,0)');

    maskCtx.globalCompositeOperation = 'destination-in';
    maskCtx.fillStyle = gradH;
    maskCtx.fillRect(0, 0, drawW, drawH);

    // Top vertical feathering
    const featherT = 70;
    const gradV = maskCtx.createLinearGradient(0, 0, 0, drawH);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(featherT / drawH, 'rgba(0,0,0,1)');
    gradV.addColorStop(1, 'rgba(0,0,0,1)');

    maskCtx.fillStyle = gradV;
    maskCtx.fillRect(0, 0, drawW, drawH);

    // Draw feathered image on top of seamless background
    ctx.drawImage(maskCanvas, drawX, drawY);

    return {
      pngB64: canvas.toDataURL('image/png').split(',')[1],
      jpgB64: canvas.toDataURL('image/jpeg', 0.95).split(',')[1]
    };
  }, b64);

  const targetDir = path.resolve('imagenes/juegos');
  const baseName = 'DOOM Eternal (Global) (PC) - Microsoft Store - Digital Key';

  const outJpg = path.join(targetDir, `${baseName}.jpg`);
  const outPng = path.join(targetDir, `${baseName}.png`);

  fs.writeFileSync(outJpg, Buffer.from(jpgB64, 'base64'));
  fs.writeFileSync(outPng, Buffer.from(pngB64, 'base64'));

  console.log(`Saved DOOM Eternal images:`);
  console.log(`JPG: ${outJpg} (${fs.statSync(outJpg).size} bytes)`);
  console.log(`PNG: ${outPng} (${fs.statSync(outPng).size} bytes)`);

  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');

  const { pngB64, jpgB64 } = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Temp canvas for original image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    // Left edge strip (x=5, width=10) stretched horizontally
    ctx.drawImage(tempCanvas, 5, 0, 10, img.naturalHeight, 0, 0, 2048, 2048);

    // Centered image
    const drawH = 2048;
    const drawW = 2048 * (img.naturalWidth / img.naturalHeight);
    const drawX = (2048 - drawW) / 2;

    // Mask for center image with soft feathering on edges
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = drawW;
    maskCanvas.height = drawH;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.imageSmoothingEnabled = true;
    maskCtx.imageSmoothingQuality = 'high';

    maskCtx.drawImage(img, 0, 0, drawW, drawH);

    const featherW = 120;
    const grad = maskCtx.createLinearGradient(0, 0, drawW, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(featherW / drawW, 'rgba(0,0,0,1)');
    grad.addColorStop(1 - (featherW / drawW), 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    maskCtx.globalCompositeOperation = 'destination-in';
    maskCtx.fillStyle = grad;
    maskCtx.fillRect(0, 0, drawW, drawH);

    ctx.drawImage(maskCanvas, drawX, 0);

    return {
      pngB64: canvas.toDataURL('image/png').split(',')[1],
      jpgB64: canvas.toDataURL('image/jpeg', 0.95).split(',')[1]
    };
  }, b64);

  const targetDir = path.join(__dirname, '../imagenes/suscripciones');
  const baseName = 'Discord Nitro - 3 Months Trial Subscription (Global) - Digital Key';

  const pngPath = path.join(targetDir, `${baseName}.png`);
  const jpgPath = path.join(targetDir, `${baseName}.jpg`);

  fs.writeFileSync(pngPath, Buffer.from(pngB64, 'base64'));
  fs.writeFileSync(jpgPath, Buffer.from(jpgB64, 'base64'));

  console.log('Saved PNG:', pngPath, 'Size:', fs.statSync(pngPath).size);
  console.log('Saved JPG:', jpgPath, 'Size:', fs.statSync(jpgPath).size);

  await browser.close();
})();


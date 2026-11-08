const { chromium } = require('playwright');
const fs = require('fs');

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

    const drawH = 2048;
    const drawW = 2048 * (img.naturalWidth / img.naturalHeight); // 1365.33
    const drawX = (2048 - drawW) / 2; // 341.33

    // Left background: stretch 10px strip from x=5
    ctx.drawImage(tempCanvas, 5, 0, 10, img.naturalHeight, 0, 0, drawX + 40, 2048);

    // Right background: stretch 10px strip from x=img.naturalWidth - 15
    ctx.drawImage(tempCanvas, img.naturalWidth - 15, 0, 10, img.naturalHeight, drawX + drawW - 40, 0, 2048 - (drawX + drawW - 40), 2048);

    // Center image with feathered alpha mask on both sides
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = drawW;
    maskCanvas.height = drawH;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.imageSmoothingEnabled = true;
    maskCtx.imageSmoothingQuality = 'high';

    maskCtx.drawImage(img, 0, 0, drawW, drawH);

    const featherW = 100;
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

  fs.writeFileSync('scratch/doom_square_test.png', Buffer.from(pngB64, 'base64'));
  fs.writeFileSync('scratch/doom_square_test.jpg', Buffer.from(jpgB64, 'base64'));
  console.log('Saved scratch/doom_square_test.png and .jpg');

  await browser.close();
})();


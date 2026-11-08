const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const tiers = ['bronze', 'silver', 'gold'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  for (const tier of tiers) {
    const rawPath = path.join('scratch', `steam_${tier}_cover.png`);
    const b64 = fs.readFileSync(rawPath).toString('base64');

    const { pngB64, jpgB64 } = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await new Promise(r => img.onload = r);

      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 2048, 2048);

      // Centered dimensions
      const drawH = 2048;
      const drawW = 2048 * (img.naturalWidth / img.naturalHeight);
      const drawX = (2048 - drawW) / 2;

      // Soft feathering at the vertical edges to guarantee zero visible boundary line
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = drawW;
      maskCanvas.height = drawH;
      const maskCtx = maskCanvas.getContext('2d');
      maskCtx.imageSmoothingEnabled = true;
      maskCtx.imageSmoothingQuality = 'high';

      maskCtx.drawImage(img, 0, 0, drawW, drawH);

      const featherW = 60;
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

    const outPng = path.join('scratch', `steam_${tier}_2048.png`);
    const outJpg = path.join('scratch', `steam_${tier}_2048.jpg`);

    fs.writeFileSync(outPng, Buffer.from(pngB64, 'base64'));
    fs.writeFileSync(outJpg, Buffer.from(jpgB64, 'base64'));
    console.log(`Rendered 2048x2048 for ${tier}: PNG ${fs.statSync(outPng).size} bytes, JPG ${fs.statSync(outJpg).size} bytes`);
  }

  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  const b64 = fs.readFileSync('scratch/doom_cover_raw.webp').toString('base64');

  const results = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    function createAmbientSquare(blurAmount, brightnessAmount, scaleCenter) {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Dark base fill
      ctx.fillStyle = '#0c0706';
      ctx.fillRect(0, 0, 2048, 2048);

      // 2. Scaled & blurred ambient background covering entire 2048x2048
      ctx.save();
      ctx.filter = `blur(${blurAmount}px) brightness(${brightnessAmount})`;
      // Cover the canvas with the image
      const bgScale = Math.max(2048 / img.naturalWidth, 2048 / img.naturalHeight);
      const bgW = img.naturalWidth * bgScale;
      const bgH = img.naturalHeight * bgScale;
      const bgX = (2048 - bgW) / 2;
      const bgY = (2048 - bgH) / 2;
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
      ctx.restore();

      // 3. Ambient vignette over background
      const vignette = ctx.createRadialGradient(1024, 1024, 400, 1024, 1024, 1200);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.7, 'rgba(10,5,4,0.3)');
      vignette.addColorStop(1, 'rgba(5,2,2,0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 2048, 2048);

      // 4. Central sharp artwork
      // Scaled so it fits nicely
      const centerH = 2048 * scaleCenter;
      const centerW = centerH * (img.naturalWidth / img.naturalHeight);
      const centerX = (2048 - centerW) / 2;
      const centerY = (2048 - centerH) / 2;

      // Soft drop shadow behind artwork
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      ctx.drawImage(img, centerX, centerY, centerW, centerH);
      ctx.restore();

      // Draw crisp image on top
      ctx.drawImage(img, centerX, centerY, centerW, centerH);

      return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
    }

    // Try a few variations:
    // optA: Full height (scale 1.0 = 2048px tall, width 1365px, subtle ambient glow on sides)
    const optA = createAmbientSquare(50, 0.45, 1.0);

    // optB: Slightly inset (scale 0.95 = 1945px tall, width 1297px)
    const optB = createAmbientSquare(60, 0.5, 0.95);

    // optC: Full bleed with feathered blend on sides
    function createFeatheredBleed() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = '#0a0504';
      ctx.fillRect(0, 0, 2048, 2048);

      // Blurred ambient
      ctx.save();
      ctx.filter = 'blur(45px) brightness(0.55)';
      ctx.drawImage(img, -100, -100, 2248, 2248);
      ctx.restore();

      // Sharp central artwork (full height 2048, centered horizontally)
      const drawH = 2048;
      const drawW = drawH * (img.naturalWidth / img.naturalHeight); // 1365px
      const drawX = (2048 - drawW) / 2; // 341.5px

      // Mask with soft feathered edge on left and right
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = drawW;
      maskCanvas.height = drawH;
      const mCtx = maskCanvas.getContext('2d');
      mCtx.drawImage(img, 0, 0, drawW, drawH);

      const feather = 40;
      const grad = mCtx.createLinearGradient(0, 0, drawW, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(feather / drawW, 'rgba(0,0,0,1)');
      grad.addColorStop(1 - (feather / drawW), 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      mCtx.globalCompositeOperation = 'destination-in';
      mCtx.fillStyle = grad;
      mCtx.fillRect(0, 0, drawW, drawH);

      ctx.drawImage(maskCanvas, drawX, 0);

      return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
    }

    const optC = createFeatheredBleed();

    return { optA, optB, optC };
  }, b64);

  fs.writeFileSync('scratch/doom_opt_a.jpg', Buffer.from(results.optA, 'base64'));
  fs.writeFileSync('scratch/doom_opt_b.jpg', Buffer.from(results.optB, 'base64'));
  fs.writeFileSync('scratch/doom_opt_c.jpg', Buffer.from(results.optC, 'base64'));

  await browser.close();
  console.log('Generated options A, B, C');
})();


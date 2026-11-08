const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');

  const renderedB64 = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Sample the vertical color strip from the original image at x = 10 (near left edge)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.naturalWidth;
    tempCanvas.height = img.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    // Create background by stretching 1-pixel wide vertical strip across the entire width
    // This guarantees 100% mathematical color match from y=0 to y=2048!
    // Left edge strip (x=10):
    ctx.drawImage(tempCanvas, 5, 0, 10, img.naturalHeight, 0, 0, 2048, 2048);

    // Now draw the original image centered
    const drawH = 2048;
    const drawW = 2048 * (img.naturalWidth / img.naturalHeight);
    const drawX = (2048 - drawW) / 2;

    // Create a feathered mask for the center image so its edges dissolve into the background
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = drawW;
    maskCanvas.height = drawH;
    const maskCtx = maskCanvas.getContext('2d');

    maskCtx.drawImage(img, 0, 0, drawW, drawH);

    // Use destination-in with horizontal gradient mask to feather the outer 80px on both sides
    const featherW = 100;
    const grad = maskCtx.createLinearGradient(0, 0, drawW, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(featherW / drawW, 'rgba(0,0,0,1)');
    grad.addColorStop(1 - (featherW / drawW), 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    maskCtx.globalCompositeOperation = 'destination-in';
    maskCtx.fillStyle = grad;
    maskCtx.fillRect(0, 0, drawW, drawH);

    // Draw the feathered image on top of the matched background
    ctx.drawImage(maskCanvas, drawX, 0);

    return canvas.toDataURL('image/png').split(',')[1];
  }, b64);

  fs.writeFileSync('scratch/discord_feathered_square.png', Buffer.from(renderedB64, 'base64'));
  console.log('Saved scratch/discord_feathered_square.png');

  await browser.close();
})();


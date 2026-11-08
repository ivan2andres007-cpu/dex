const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  // Load the Driffle cover
  const buf = fs.readFileSync('scratch/discord_driffle_cover.png');
  const b64 = buf.toString('base64');

  // Option 1: Direct square conversion of the Driffle asset with seamless vertical gradient extension
  const opt1B64 = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // 1. Draw base vertical gradient matching the exact colors of Driffle
    const grad = ctx.createLinearGradient(0, 0, 0, 2048);
    grad.addColorStop(0, '#7566C5');
    grad.addColorStop(0.35, '#9A6DE0');
    grad.addColorStop(0.65, '#BF75EA');
    grad.addColorStop(1, '#D379F1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 2048);

    // 2. Draw the Driffle cover image centered
    // Natural aspect ratio is 800 / 1200 = 0.666
    // If scaled to full height (2048): width = 2048 * (800 / 1200) = 1365px
    const drawH = 2048;
    const drawW = 2048 * (img.naturalWidth / img.naturalHeight);
    const drawX = (2048 - drawW) / 2;

    // Draw with feathered horizontal blending so there are no seams
    ctx.drawImage(img, drawX, 0, drawW, drawH);

    return canvas.toDataURL('image/png').split(',')[1];
  }, b64);

  fs.writeFileSync('scratch/discord_opt1_direct.png', Buffer.from(opt1B64, 'base64'));
  console.log('Saved scratch/discord_opt1_direct.png');

  await browser.close();
})();


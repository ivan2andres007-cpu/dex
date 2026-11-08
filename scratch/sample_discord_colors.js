const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  const palette = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Sample corner colors
    const getPixel = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
    };

    return {
      topLeft: getPixel(10, 10),
      topRight: getPixel(img.naturalWidth - 10, 10),
      bottomLeft: getPixel(10, img.naturalHeight - 10),
      bottomRight: getPixel(img.naturalWidth - 10, img.naturalHeight - 10),
      centerLeft: getPixel(10, img.naturalHeight / 2),
      centerRight: getPixel(img.naturalWidth - 10, img.naturalHeight / 2),
    };
  }, b64);

  console.log('Sampled colors:', palette);
  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const b64 = fs.readFileSync('scratch/doom_cover_raw.webp').toString('base64');
  const info = await page.evaluate(async (b) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b;
    await new Promise(r => img.onload = r);
    return { width: img.naturalWidth, height: img.naturalHeight };
  }, b64);

  console.log('DOOM cover dimensions:', info);

  // Check edge colors
  const edgeColors = await page.evaluate(async (b) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b;
    await new Promise(r => img.onload = r);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const get = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return [p[0], p[1], p[2]];
    };

    return {
      topLeft: get(5, 5),
      topRight: get(c.width - 5, 5),
      midLeft: get(5, c.height / 2),
      midRight: get(c.width - 5, c.height / 2),
      botLeft: get(5, c.height - 5),
      botRight: get(c.width - 5, c.height - 5)
    };
  }, b64);

  console.log('DOOM edge colors:', edgeColors);

  // Save a render of raw cover to view
  await page.setContent(`<body style="margin:0"><img src="data:image/webp;base64,${b64}" style="width: ${info.width}px; height: ${info.height}px;" /></body>`);
  await page.screenshot({ path: 'scratch/doom_raw_view.png' });
  console.log('Saved scratch/doom_raw_view.png');

  await browser.close();
})();


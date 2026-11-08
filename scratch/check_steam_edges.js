const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const tier of ['bronze', 'silver', 'gold']) {
    const b64 = fs.readFileSync(`scratch/steam_${tier}_cover.png`).toString('base64');
    const colors = await page.evaluate(async (b) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b;
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
        topRight: get(img.naturalWidth - 5, 5),
        midLeft: get(5, img.naturalHeight / 2),
        midRight: get(img.naturalWidth - 5, img.naturalHeight / 2),
        botLeft: get(5, img.naturalHeight - 5),
        botRight: get(img.naturalWidth - 5, img.naturalHeight - 5),
      };
    }, b64);

    console.log(`\nEdge colors for ${tier.toUpperCase()}:`, colors);
  }

  await browser.close();
})();


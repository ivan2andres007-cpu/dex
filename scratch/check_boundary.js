const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/discord_feathered_square.png').toString('base64');
  
  const check = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + src;
    await new Promise(r => img.onload = r);
    const c = document.createElement('canvas');
    c.width = 2048; c.height = 2048;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Check transition at the boundary between background and feathered image (x = 341 and x = 1707)
    // Sample along y = 500 across x from 300 to 400 (left boundary)
    const getP = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return [p[0], p[1], p[2]];
    };

    const leftBoundaryY500 = [];
    for (let x = 320; x <= 360; x += 5) {
      leftBoundaryY500.push({ x, rgb: getP(x, 500) });
    }

    const rightBoundaryY500 = [];
    for (let x = 1680; x <= 1720; x += 5) {
      rightBoundaryY500.push({ x, rgb: getP(x, 500) });
    }

    return { leftBoundaryY500, rightBoundaryY500 };
  }, b64);

  console.log('Left boundary samples:', check.leftBoundaryY500);
  console.log('Right boundary samples:', check.rightBoundaryY500);
  await browser.close();
})();


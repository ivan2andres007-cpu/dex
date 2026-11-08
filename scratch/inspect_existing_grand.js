const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });

  const b64 = fs.readFileSync('imagenes/juegos/1 Juego Aleatorio de Steam - Grand (Global) (PC) - Clave Digital.jpg').toString('base64');

  await page.setContent(`
    <body style="margin:0; background: #000; display: flex; justify-content: center; align-items: center;">
      <img src="data:image/jpeg;base64,${b64}" style="width: 600px; height: 600px; object-fit: contain;" />
    </body>
  `);

  await page.screenshot({ path: 'scratch/grand_existing_view.png' });
  console.log('Saved scratch/grand_existing_view.png');

  // Let's sample colors of the existing Grand image across x=10, x=1024, x=2038
  const analysis = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + src;
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
      w: img.naturalWidth,
      h: img.naturalHeight,
      leftEdgeTop: get(10, 100),
      leftEdgeMid: get(10, 1024),
      leftEdgeBot: get(10, 1900),
      rightEdgeMid: get(img.naturalWidth - 10, 1024),
      centerMid: get(1024, 1024)
    };
  }, b64);

  console.log('Existing Grand image analysis:', analysis);
  await browser.close();
})();


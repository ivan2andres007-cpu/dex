const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const files = [
    'imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg',
    'imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg',
    'imagenes/juegos/1 Juego Aleatorio de Steam - Grand (Global) (PC) - Clave Digital.jpg'
  ];
  
  for (const f of files) {
    const fileBuf = fs.readFileSync(path.resolve(f));
    const dataUrl = `data:image/jpeg;base64,${fileBuf.toString('base64')}`;
    await page.setContent(`<!DOCTYPE html><html><body><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
    const info = await page.evaluate(() => {
      const img = document.getElementById('img');
      const canvas = document.getElementById('c');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          // Check corner color vs background
          if (r < 240 || g < 240 || b < 240) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(3),
        bbox: { minX, minY, maxX, maxY }
      };
    });
    console.log(f, info);
  }
  
  await browser.close();
})();

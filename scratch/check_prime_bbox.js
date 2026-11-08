const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const buf = fs.readFileSync('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
  
  const bbox = await page.evaluate(() => {
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
        if (r < 245 || g < 245 || b < 245) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return { w: canvas.width, h: canvas.height, minX, minY, maxX, maxY };
  });
  console.log('BBox in Amazon Prime jpg:', bbox);
  await browser.close();
})();


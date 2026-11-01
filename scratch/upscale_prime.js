const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const srcPath = path.resolve('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const buf = fs.readFileSync(srcPath);
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;

  const pngBase64 = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);
    
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, 2048, 2048);
    
    return canvas.toDataURL('image/png').split(',')[1];
  }, dataUrl);

  const pngPath = path.resolve('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).png');
  fs.writeFileSync(pngPath, Buffer.from(pngBase64, 'base64'));
  console.log('Saved 2048x2048 PNG, size:', fs.statSync(pngPath).size);

  await browser.close();
})();

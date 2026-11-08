const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const buf = fs.readFileSync('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body><img id="i" src="${dataUrl}"></body></html>`);
  const dims = await page.evaluate(() => {
    const i = document.getElementById('i');
    return { w: i.naturalWidth, h: i.naturalHeight, ratio: i.naturalWidth / i.naturalHeight };
  });
  console.log('Dims:', dims);
  await browser.close();
})();


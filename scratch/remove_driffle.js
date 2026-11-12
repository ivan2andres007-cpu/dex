const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const filesToClean = [
  'imagenes/juegos/1 Juego Aleatorio de Steam - Bronze (Global) (PC) - Clave Digital.jpg',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Bronze (Global) (PC) - Clave Digital.png',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Silver (Global) (PC) - Clave Digital.jpg',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Silver (Global) (PC) - Clave Digital.png',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Gold (Global) (PC) - Clave Digital.jpg',
  'imagenes/juegos/1 Juego Aleatorio de Steam - Gold (Global) (PC) - Clave Digital.png',
  'imagenes/juegos/1 Random Steam Game - Bronze (Global) (PC) - Steam - Digital Key.jpg',
  'imagenes/juegos/1 Random Steam Game - Bronze (Global) (PC) - Steam - Digital Key.png',
  'imagenes/juegos/1 Random Steam Game - Silver (Global) (PC) - Steam - Digital Key.jpg',
  'imagenes/juegos/1 Random Steam Game - Silver (Global) (PC) - Steam - Digital Key.png',
  'imagenes/juegos/1 Random Steam Game - Gold (Global) (PC) - Steam - Digital Key.jpg',
  'imagenes/juegos/1 Random Steam Game - Gold (Global) (PC) - Steam - Digital Key.png'
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const relPath of filesToClean) {
    const fullPath = path.resolve(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) {
      console.log('Skipping missing:', relPath);
      continue;
    }

    const isPng = relPath.toLowerCase().endsWith('.png');
    const mime = isPng ? 'image/png' : 'image/jpeg';
    const b64 = `data:${mime};base64,` + fs.readFileSync(fullPath).toString('base64');

    const cleanedBase64 = await page.evaluate(async ({ dataUrl, isPng }) => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          
          // Draw original image
          ctx.drawImage(img, 0, 0);

          // The background above '1 RANDOM KEY' (which begins at y=239) is pure solid black #000000.
          // The driffle logo is in the region y: 60 to 165, x: 800 to 1250.
          // We cleanly fill y: 0 to 210 with pure solid black #000000.
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, 210);

          // Export with maximum quality
          if (isPng) {
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(canvas.toDataURL('image/jpeg', 0.98));
          }
        };
        img.src = dataUrl;
      });
    }, { dataUrl: b64, isPng });

    // Write back cleaned image
    const dataOnly = cleanedBase64.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(fullPath, Buffer.from(dataOnly, 'base64'));
    console.log(`✔ Cleaned Driffle logo from: ${relPath}`);
  }

  await browser.close();
  console.log('All random game images processed successfully!');
})();


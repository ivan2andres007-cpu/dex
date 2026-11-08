const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  const info = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);
    return { width: img.naturalWidth, height: img.naturalHeight };
  }, b64);

  console.log('Cover image natural dimensions:', info);
  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const b64 = fs.readFileSync('scratch/capcut_original.png').toString('base64');
  const dims = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await new Promise(r => img.onload = r);
    return { width: img.naturalWidth, height: img.naturalHeight };
  }, b64);
  
  console.log('Original dimensions:', dims);
  await browser.close();
})();


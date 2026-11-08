const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a/.user_uploaded/media_1794172472185_5f1cdb9d.jpg').toString('base64');
  
  const analysis = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + b64;
    await new Promise(r => img.onload = r);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  }, b64);
  
  console.log('User screenshot dimensions:', analysis);
  await browser.close();
})();


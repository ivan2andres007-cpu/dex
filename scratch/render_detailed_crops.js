const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  
  await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);

    const makeCrop = (y1, y2) => {
      const c = document.createElement('canvas');
      c.width = 800; c.height = y2 - y1 + 20;
      c.getContext('2d').drawImage(img, 0, y1 - 10, 800, y2 - y1 + 20, 0, 0, 800, y2 - y1 + 20);
      return c.toDataURL('image/png').split(',')[1];
    };

    window.crop1 = makeCrop(160, 280);
    window.crop2 = makeCrop(350, 530);
    window.crop3 = makeCrop(560, 700);
    window.crop4 = makeCrop(750, 1150);
  }, b64);

  const c1 = await page.evaluate(() => window.crop1);
  const c2 = await page.evaluate(() => window.crop2);
  const c3 = await page.evaluate(() => window.crop3);
  const c4 = await page.evaluate(() => window.crop4);

  fs.writeFileSync('scratch/c1_logo.png', Buffer.from(c1, 'base64'));
  fs.writeFileSync('scratch/c2_text.png', Buffer.from(c2, 'base64'));
  fs.writeFileSync('scratch/c3_badge.png', Buffer.from(c3, 'base64'));
  fs.writeFileSync('scratch/c4_wumpus.png', Buffer.from(c4, 'base64'));
  console.log('Saved detailed crops');
  await browser.close();
})();


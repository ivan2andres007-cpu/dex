const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/test_doom_card_preview.png').toString('base64');
  
  await page.setContent('<body style="margin:0"><img id="preview" src="data:image/png;base64,' + b64 + '" /></body>');
  
  const crop = await page.evaluate(async () => {
    const img = document.getElementById('preview');
    const c = document.createElement('canvas');
    c.width = 400; c.height = 300;
    const ctx = c.getContext('2d');
    // DeviceScaleFactor was 2, viewport 1000x1000
    // Card was 380px wide (760px at 2x), centered at (2000 - 760)/2 = 620px
    // Top right of card is at x: 620 + 760 - 350 = 1030, y: 80
    ctx.drawImage(img, 950, 80, 400, 300, 0, 0, 400, 300);
    return c.toDataURL('image/png').split(',')[1];
  });

  fs.writeFileSync('scratch/doom_badge_crop.png', Buffer.from(crop, 'base64'));
  console.log('Saved scratch/doom_badge_crop.png');
  await browser.close();
})();


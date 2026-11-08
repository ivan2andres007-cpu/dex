const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 600 } });

  const bTop = fs.readFileSync('scratch/doom_crop_top.png').toString('base64');
  const bMid = fs.readFileSync('scratch/doom_crop_mid.png').toString('base64');
  const bBot = fs.readFileSync('scratch/doom_crop_bot.png').toString('base64');

  await page.setContent(`
    <body style="background: #111; padding: 20px; display: flex; gap: 20px; margin: 0;">
      <div><h4 style="color:#fff;margin:0 0 10px;">TOP (0-300)</h4><img src="data:image/png;base64,${bTop}" style="width:300px;" /></div>
      <div><h4 style="color:#fff;margin:0 0 10px;">MID (300-600)</h4><img src="data:image/png;base64,${bMid}" style="width:300px;" /></div>
      <div><h4 style="color:#fff;margin:0 0 10px;">BOT (600-900)</h4><img src="data:image/png;base64,${bBot}" style="width:300px;" /></div>
    </body>
  `);

  await page.screenshot({ path: 'scratch/doom_crops_collage.png' });
  console.log('Saved scratch/doom_crops_collage.png');
  await browser.close();
})();


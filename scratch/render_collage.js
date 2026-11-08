const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 600 } });
  
  const bTop = fs.readFileSync('scratch/crop_top.png').toString('base64');
  const bMid = fs.readFileSync('scratch/crop_mid.png').toString('base64');
  const bBot = fs.readFileSync('scratch/crop_bot.png').toString('base64');

  await page.setContent(`
    <body style="margin:0; background: #222; display: flex; gap: 20px; padding: 20px;">
      <img src="data:image/png;base64,${bTop}" style="width: 350px; height: 175px; border: 2px solid white;" />
      <img src="data:image/png;base64,${bMid}" style="width: 350px; height: 175px; border: 2px solid white;" />
      <img src="data:image/png;base64,${bBot}" style="width: 350px; height: 175px; border: 2px solid white;" />
    </body>
  `);

  await page.screenshot({ path: 'scratch/crops_collage.png' });
  console.log('Collage saved');
  await browser.close();
})();


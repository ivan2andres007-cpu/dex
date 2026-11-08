const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  const b1 = fs.readFileSync('scratch/c1_logo.png').toString('base64');
  const b2 = fs.readFileSync('scratch/c2_text.png').toString('base64');
  const b3 = fs.readFileSync('scratch/c3_badge.png').toString('base64');

  await page.setContent(`
    <body style="background:#000; margin:20px;">
      <img src="data:image/png;base64,${b1}" style="display:block; margin-bottom:10px; width: 600px;" />
      <img src="data:image/png;base64,${b2}" style="display:block; margin-bottom:10px; width: 600px;" />
      <img src="data:image/png;base64,${b3}" style="display:block; margin-bottom:10px; width: 600px;" />
    </body>
  `);
  await page.screenshot({ path: 'scratch/crops_visible.png' });
  console.log('Saved crops_visible.png');
  await browser.close();
})();


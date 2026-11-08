const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  
  const c1 = fs.readFileSync('scratch/c1_logo.png').toString('base64');
  const c2 = fs.readFileSync('scratch/c2_text.png').toString('base64');
  const c3 = fs.readFileSync('scratch/c3_badge.png').toString('base64');
  const c4 = fs.readFileSync('scratch/c4_wumpus.png').toString('base64');

  await page.setContent(`
    <body style="margin:20px; background: #111; color: white; font-family: sans-serif;">
      <h2>Crop 1 (Logo)</h2>
      <img src="data:image/png;base64,${c1}" style="max-width: 600px; border: 1px solid #444;" />
      <h2>Crop 2 (Main Text)</h2>
      <img src="data:image/png;base64,${c2}" style="max-width: 600px; border: 1px solid #444;" />
      <h2>Crop 3 (Pill / Mid)</h2>
      <img src="data:image/png;base64,${c3}" style="max-width: 600px; border: 1px solid #444;" />
      <h2>Crop 4 (Wumpus)</h2>
      <img src="data:image/png;base64,${c4}" style="max-width: 600px; border: 1px solid #444;" />
    </body>
  `);

  await page.screenshot({ path: 'scratch/crops_overview.png', fullPage: true });
  console.log('Saved crops overview');
  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 1200 } });
  
  const buf = fs.readFileSync('scratch/roblox_original.jpg');
  const dataUrl = `data:image/webp;base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0; padding:0; background:#000;"><img id="img" src="${dataUrl}" style="display:block; width:800px; height:1200px;"></body></html>`);
  
  await page.screenshot({ path: 'scratch/roblox_full_view.png' });
  await browser.close();
})();

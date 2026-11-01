const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <body style="background: #111; padding: 20px;">
    <svg id="s" width="38" height="38" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#111216"/>
      <g transform="translate(4, 4) scale(0.67)">
        <path d="M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453z" fill="#FFFFFF"/>
      </g>
    </svg>
  </body>
  </html>`);
  
  await page.screenshot({ path: 'scratch/roblox_icon_test.png' });
  await browser.close();
  console.log('Roblox icon screenshot saved');
})();

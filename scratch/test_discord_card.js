const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 1000, deviceScaleFactor: 2 }
  });

  const b64 = fs.readFileSync('scratch/discord_feathered_square.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="file:///${__dirname}/../css/index.css" />
      <style>
        body { background: #0c0d14; padding: 40px; display: flex; gap: 40px; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .card-wrap { width: 380px; }
      </style>
    </head>
    <body>
      <div class="card-wrap">
        <div class="product-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden;">
          <div class="card-media-preview" style="position: relative; aspect-ratio: 1/1; overflow: hidden; background: #13141f;">
            <img src="data:image/png;base64,${b64}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div class="card-floating-badges" style="position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10;">
              <span class="card-badge badge-purple" style="background: rgba(147, 51, 234, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">3 Meses Nitro</span>
              <span class="card-badge badge-blue" style="background: rgba(59, 130, 246, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Clave Global</span>
            </div>
          </div>
          <div style="padding: 18px;">
            <div style="color: #9333ea; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Suscripción Digital • Discord Nitro</div>
            <h3 style="color: #fff; font-size: 16px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.3;">Discord Nitro - 3 Months Trial Subscription (Global) - Digital Key</h3>
            <div style="display: flex; align-items: baseline; gap: 8px;">
              <span style="color: #22c55e; font-size: 20px; font-weight: 800;">Gs. 18.000</span>
              <span style="color: rgba(255,255,255,0.4); text-decoration: line-through; font-size: 13px;">Gs. 75.000</span>
              <span style="background: rgba(34, 197, 94, 0.15); color: #4ade80; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">-76%</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/test_feathered_card.png' });
  console.log('Saved scratch/test_feathered_card.png');
  await browser.close();
})();


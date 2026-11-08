const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900, deviceScaleFactor: 2 } });
  
  const bFeathered = fs.readFileSync('scratch/discord_feathered_square.png').toString('base64');
  const bRaw = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0c0d14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; margin: 0; }
        .row { display: flex; gap: 40px; justify-content: center; align-items: flex-start; }
        .card { width: 360px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
        .media { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #13141f; }
        .media img { width: 100%; height: 100%; object-fit: cover; }
        .badges { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10; }
        .badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; }
        .badge-purple { background: rgba(147, 51, 234, 0.85); backdrop-filter: blur(8px); }
        .badge-blue { background: rgba(59, 130, 246, 0.85); backdrop-filter: blur(8px); }
        .content { padding: 18px; }
        .meta { color: #9333ea; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 16px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.3; }
        .price-row { display: flex; align-items: baseline; gap: 8px; }
        .price { color: #22c55e; font-size: 20px; font-weight: 800; }
        .old-price { color: rgba(255,255,255,0.4); text-decoration: line-through; font-size: 13px; }
        .tag { background: rgba(34, 197, 94, 0.15); color: #4ade80; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        h2 { text-align: center; margin-bottom: 20px; font-weight: 600; font-size: 18px; color: #a1a1aa; }
      </style>
    </head>
    <body>
      <div class="row">
        <div>
          <h2>Feathered Square (Exact Driffle Cover)</h2>
          <div class="card">
            <div class="media">
              <img src="data:image/png;base64,${bFeathered}" />
              <div class="badges">
                <span class="badge badge-purple">3 Meses Nitro</span>
                <span class="badge badge-blue">Clave Global</span>
              </div>
            </div>
            <div class="content">
              <div class="meta">Suscripción Digital • Discord Nitro</div>
              <div class="title">Discord Nitro - 3 Months Trial Subscription (Global) - Digital Key</div>
              <div class="price-row">
                <span class="price">Gs. 18.000</span>
                <span class="old-price">Gs. 75.000</span>
                <span class="tag">-76%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/preview_feathered_side.png' });
  console.log('Saved scratch/preview_feathered_side.png');
  await browser.close();
})();


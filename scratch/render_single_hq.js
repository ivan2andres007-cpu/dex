const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000, deviceScaleFactor: 2 } });
  
  const bFeathered = fs.readFileSync('scratch/discord_feathered_square.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0c0d14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; margin: 0; display: flex; justify-content: center; }
        .card { width: 380px; background: #13141f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .media { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #13141f; }
        .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .badges { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10; }
        .badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 5px 12px; border-radius: 9999px; letter-spacing: 0.5px; }
        .badge-purple { background: rgba(147, 51, 234, 0.9); backdrop-filter: blur(8px); box-shadow: 0 2px 10px rgba(147,51,234,0.3); }
        .badge-blue { background: rgba(59, 130, 246, 0.9); backdrop-filter: blur(8px); box-shadow: 0 2px 10px rgba(59,130,246,0.3); }
        .content { padding: 20px; }
        .meta { color: #a855f7; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
        .title { font-size: 16px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.35; color: #f4f4f5; }
        .price-row { display: flex; align-items: baseline; gap: 8px; }
        .price { color: #22c55e; font-size: 22px; font-weight: 800; font-feature-settings: "tnum"; }
        .old-price { color: rgba(255,255,255,0.4); text-decoration: line-through; font-size: 14px; font-feature-settings: "tnum"; }
        .tag { background: rgba(34, 197, 94, 0.15); color: #4ade80; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
      </style>
    </head>
    <body>
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
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/single_card_hq.png' });
  console.log('Saved scratch/single_card_hq.png');
  await browser.close();
})();


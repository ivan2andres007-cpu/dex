const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000, deviceScaleFactor: 2 } });

  const bJpg = fs.readFileSync('imagenes/juegos/DOOM Eternal (Global) (PC) - Microsoft Store - Digital Key.jpg').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0c0d14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; margin: 0; display: flex; justify-content: center; }
        .card { width: 380px; background: #13141f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .media { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #08090c; }
        .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .badges { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10; }
        .badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 5px 12px; border-radius: 9999px; letter-spacing: 0.5px; }
        .badge-red { background: rgba(220, 38, 38, 0.9); backdrop-filter: blur(8px); box-shadow: 0 2px 10px rgba(220,38,38,0.3); color: #fff; }
        .badge-xbox { background: rgba(16, 124, 65, 0.9); backdrop-filter: blur(8px); box-shadow: 0 2px 10px rgba(16,124,65,0.3); color: #fff; }
        .floating-icon { position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; background: rgba(15,23,42,0.85); backdrop-filter: blur(8px); border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; border: 1px solid rgba(255,255,255,0.1); }
        .content { padding: 20px; }
        .meta { color: #f87171; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
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
          <div class="floating-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#107C41"/><path d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5 0 2.22.97 4.22 2.52 5.58 1.1-1.37 3.01-3.66 4.98-3.66 1.97 0 3.88 2.29 4.98 3.66 1.55-1.36 2.52-3.36 2.52-5.58 0-4.14-3.36-7.5-7.5-7.5zm0 1.2c1.78 0 3.39.63 4.67 1.69-1.22 1.48-3.04 3.49-4.67 3.49-1.63 0-3.45-2.01-4.67-3.49A7.26 7.26 0 0 1 12 5.7zm-6.14 8.78c-.28-.78-.44-1.61-.44-2.48 0-1.78.63-3.4 1.7-4.68 1.29 1.7 2.97 3.96 4.34 4.88-2.02.4-4.22 1.41-5.6 2.28zm12.28 0c-1.38-.87-3.58-1.88-5.6-2.28 1.37-.92 3.05-3.18 4.34-4.88 1.07 1.28 1.7 2.9 1.7 4.68 0 .87-.16 1.7-.44 2.48z" fill="#FFFFFF"/></svg>
          </div>
          <img src="data:image/jpeg;base64,${bJpg}" />
          <div class="badges">
            <span class="badge badge-red">DOOM Eternal</span>
            <span class="badge badge-xbox">Microsoft PC</span>
          </div>
        </div>
        <div class="content">
          <div class="meta">Juego PC • Microsoft Store / Xbox</div>
          <div class="title">DOOM Eternal (Global) (PC) - Microsoft Store - Digital Key</div>
          <div class="price-row">
            <span class="price">Gs. 29.000</span>
            <span class="old-price">Gs. 120.000</span>
            <span class="tag">-76%</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/test_doom_card_final.png' });
  console.log('Saved scratch/test_doom_card_final.png');
  await browser.close();
})();

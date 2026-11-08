const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900, deviceScaleFactor: 2 }
  });

  const bGrand = fs.readFileSync('imagenes/juegos/1 Juego Aleatorio de Steam - Grand (Global) (PC) - Clave Digital.jpg').toString('base64');
  const bBronze = fs.readFileSync('scratch/steam_bronze_2048.jpg').toString('base64');
  const bSilver = fs.readFileSync('scratch/steam_silver_2048.jpg').toString('base64');
  const bGold = fs.readFileSync('scratch/steam_gold_2048.jpg').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #0c0d14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; margin: 0; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .card { background: #13141f; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
        .media { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #000; }
        .media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .badges { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 6px; z-index: 10; }
        .badge { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.5px; }
        .badge-steam { background: linear-gradient(135deg, #171a21, #1b2838); border: 1px solid rgba(102, 192, 244, 0.4); color: #66c0f4; }
        .badge-purple { background: rgba(147, 51, 234, 0.85); color: #fff; }
        .badge-blue { background: rgba(59, 130, 246, 0.85); color: #fff; }
        .badge-green { background: rgba(34, 197, 94, 0.85); color: #fff; }
        .badge-amber { background: rgba(245, 158, 11, 0.85); color: #fff; }
        .content { padding: 18px; }
        .meta { color: #60a5fa; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 15px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.35; color: #f4f4f5; height: 42px; overflow: hidden; }
        .price-row { display: flex; align-items: baseline; gap: 8px; }
        .price { color: #22c55e; font-size: 20px; font-weight: 800; font-feature-settings: "tnum"; }
        .old-price { color: rgba(255,255,255,0.4); text-decoration: line-through; font-size: 13px; font-feature-settings: "tnum"; }
        .tag { background: rgba(34, 197, 94, 0.15); color: #4ade80; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .steam-icon { position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; background: rgba(15,23,42,0.8); backdrop-filter: blur(8px); border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 10; border: 1px solid rgba(255,255,255,0.1); }
      </style>
    </head>
    <body>
      <h1 style="text-align: center; margin-bottom: 30px; font-size: 24px;">Comparación 4 Variantes Steam Random Key</h1>
      <div class="grid">
        <!-- Grand -->
        <div class="card">
          <div class="media">
            <div class="steam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="5" fill="#171A21"/><path d="M12 5.5a6.5 6.5 0 00-6.4 5.38l3.4 1.4a2.4 2.4 0 013.3 1.37l3.6 1.48A6.5 6.5 0 0012 5.5zm4.8 6.5a1.8 1.8 0 11-3.6 0 1.8 1.8 0 013.6 0z" fill="#66C0F4"/><circle cx="15.5" cy="12" r="1.5" fill="#FFFFFF"/><circle cx="9.2" cy="15.5" r="1.1" fill="#66C0F4"/></svg>
            </div>
            <img src="data:image/jpeg;base64,${bGrand}" />
            <div class="badges">
              <span class="badge badge-steam">Steam Grand</span>
              <span class="badge badge-purple">Sorpresa PC</span>
            </div>
          </div>
          <div class="content">
            <div class="meta">Juego Steam PC • Categoría Grand</div>
            <div class="title">1 Juego Steam Aleatorio - Grand (Global) (PC) - Clave Digital</div>
            <div class="price-row">
              <span class="price">Gs. 19.000</span>
              <span class="old-price">Gs. 55.000</span>
              <span class="tag">-65%</span>
            </div>
          </div>
        </div>

        <!-- Bronze -->
        <div class="card">
          <div class="media">
            <div class="steam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="5" fill="#171A21"/><path d="M12 5.5a6.5 6.5 0 00-6.4 5.38l3.4 1.4a2.4 2.4 0 013.3 1.37l3.6 1.48A6.5 6.5 0 0012 5.5zm4.8 6.5a1.8 1.8 0 11-3.6 0 1.8 1.8 0 013.6 0z" fill="#66C0F4"/><circle cx="15.5" cy="12" r="1.5" fill="#FFFFFF"/><circle cx="9.2" cy="15.5" r="1.1" fill="#66C0F4"/></svg>
            </div>
            <img src="data:image/jpeg;base64,${bBronze}" />
            <div class="badges">
              <span class="badge badge-steam">Steam Bronze</span>
              <span class="badge badge-amber">Gemas Ocultas</span>
            </div>
          </div>
          <div class="content">
            <div class="meta">Juego Steam PC • Categoría Bronze</div>
            <div class="title">1 Juego Steam Aleatorio - Bronze (Global) (PC) - Clave Digital</div>
            <div class="price-row">
              <span class="price">Gs. 22.000</span>
              <span class="old-price">Gs. 65.000</span>
              <span class="tag">-66%</span>
            </div>
          </div>
        </div>

        <!-- Silver -->
        <div class="card">
          <div class="media">
            <div class="steam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="5" fill="#171A21"/><path d="M12 5.5a6.5 6.5 0 00-6.4 5.38l3.4 1.4a2.4 2.4 0 013.3 1.37l3.6 1.48A6.5 6.5 0 0012 5.5zm4.8 6.5a1.8 1.8 0 11-3.6 0 1.8 1.8 0 013.6 0z" fill="#66C0F4"/><circle cx="15.5" cy="12" r="1.5" fill="#FFFFFF"/><circle cx="9.2" cy="15.5" r="1.1" fill="#66C0F4"/></svg>
            </div>
            <img src="data:image/jpeg;base64,${bSilver}" />
            <div class="badges">
              <span class="badge badge-steam">Steam Silver</span>
              <span class="badge badge-blue">Valor €30</span>
            </div>
          </div>
          <div class="content">
            <div class="meta">Juego Steam PC • Categoría Silver</div>
            <div class="title">1 Juego Steam Aleatorio - Silver (Global) (PC) - Clave Digital</div>
            <div class="price-row">
              <span class="price">Gs. 26.000</span>
              <span class="old-price">Gs. 75.000</span>
              <span class="tag">-65%</span>
            </div>
          </div>
        </div>

        <!-- Gold -->
        <div class="card">
          <div class="media">
            <div class="steam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="5" fill="#171A21"/><path d="M12 5.5a6.5 6.5 0 00-6.4 5.38l3.4 1.4a2.4 2.4 0 013.3 1.37l3.6 1.48A6.5 6.5 0 0012 5.5zm4.8 6.5a1.8 1.8 0 11-3.6 0 1.8 1.8 0 013.6 0z" fill="#66C0F4"/><circle cx="15.5" cy="12" r="1.5" fill="#FFFFFF"/><circle cx="9.2" cy="15.5" r="1.1" fill="#66C0F4"/></svg>
            </div>
            <img src="data:image/jpeg;base64,${bGold}" />
            <div class="badges">
              <span class="badge badge-steam">Steam Gold</span>
              <span class="badge badge-green">Valor €40</span>
            </div>
          </div>
          <div class="content">
            <div class="meta">Juego Steam PC • Categoría Gold</div>
            <div class="title">1 Juego Steam Aleatorio - Gold (Global) (PC) - Clave Digital</div>
            <div class="price-row">
              <span class="price">Gs. 29.000</span>
              <span class="old-price">Gs. 85.000</span>
              <span class="tag">-66%</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/all_steam_cards_preview.png' });
  console.log('Saved scratch/all_steam_cards_preview.png');

  await browser.close();
})();


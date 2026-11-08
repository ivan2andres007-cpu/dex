const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  
  // Test with a cover where prime video is centered and slightly lower, and only 1 badge vs 2 badges
  const buf = fs.readFileSync('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;
  
  // Let's create an optimized version of the cover:
  // In the current cover, the elements are:
  // - prime video logo at y ≈ 220
  // - "1 MES" at y ≈ 560
  // - "PERFIL PRIVADO" pill at y ≈ 700
  // - TV mockup at y ≈ 1000 to 1800
  
  // Let's test if drawY is shifted down slightly or if we redraw prime video cleanly with comfortable spacing
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #090a0d; color: #fff; font-family: -apple-system, sans-serif; padding: 40px; display: flex; gap: 30px; }
      .product-card {
        width: 320px;
        background: #12141a;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 18px;
        overflow: hidden;
      }
      .card-media-preview {
        width: 100%;
        aspect-ratio: 1/1;
        position: relative;
        background: #08090c;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .card-preview-art {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-floating-icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: rgba(9, 10, 13, 0.78);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.08);
      }
      .card-floating-badges {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
      }
      .card-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 6px;
      }
      .badge-blue { background: rgba(0, 168, 225, 0.2); color: #38bdf8; border: 1px solid rgba(0, 168, 225, 0.4); }
      .badge-purple { background: rgba(189, 52, 254, 0.2); color: #e09aff; border: 1px solid rgba(189, 52, 254, 0.4); }
      .card-body { padding: 16px; }
      .tag { font-size: 11px; color: #8e95a5; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
      .title { font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 8px; }
      .price { font-size: 17px; font-weight: 700; color: #fff; }
    </style>
  </head>
  <body>
    <!-- Card A: Current with 1 single badge -->
    <div>
      <h4 style="margin:0 0 10px; color:#aaa;">Opción A: 1 Badge ("1 Mes Streaming")</h4>
      <div class="product-card">
        <div class="card-media-preview">
          <img class="card-preview-art" src="${dataUrl}">
          <div class="card-floating-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#0c1117"/><path d="M4 14c4 2 8 2 12 0" stroke="#00A8E1" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <div class="card-floating-badges">
            <span class="card-badge badge-blue">1 Mes Streaming</span>
          </div>
        </div>
        <div class="card-body">
          <div class="tag">Streaming & Películas</div>
          <div class="title">Amazon Prime Video - 1 Mes (Perfil Privado)</div>
          <div class="price">Gs. 15.000</div>
        </div>
      </div>
    </div>

    <!-- Card B: Current with 2 badges -->
    <div>
      <h4 style="margin:0 0 10px; color:#aaa;">Opción B: 2 Badges</h4>
      <div class="product-card">
        <div class="card-media-preview">
          <img class="card-preview-art" src="${dataUrl}">
          <div class="card-floating-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#0c1117"/><path d="M4 14c4 2 8 2 12 0" stroke="#00A8E1" stroke-width="2" stroke-linecap="round"/></svg>
          </div>
          <div class="card-floating-badges">
            <span class="card-badge badge-blue">1 Mes Streaming</span>
            <span class="card-badge badge-purple">Perfil Privado</span>
          </div>
        </div>
        <div class="card-body">
          <div class="tag">Streaming & Películas</div>
          <div class="title">Amazon Prime Video - 1 Mes (Perfil Privado)</div>
          <div class="price">Gs. 15.000</div>
        </div>
      </div>
    </div>
  </body>
  </html>`);

  await page.screenshot({ path: 'scratch/test_badge_options.png' });
  await browser.close();
  console.log('Saved test_badge_options.png');
})();


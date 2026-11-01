const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
  
  const b1 = fs.readFileSync('scratch/capcut_opt1_direct.png').toString('base64');
  const b2 = fs.readFileSync('scratch/capcut_opt2_balanced.png').toString('base64');
  const b3 = fs.readFileSync('scratch/capcut_opt3_relaxed.png').toString('base64');
  const bgemini = fs.readFileSync('imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg').toString('base64');
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      :root {
        --border-subtle: rgba(255, 255, 255, 0.08);
        --border-medium: rgba(255, 255, 255, 0.15);
        --radius-lg: 18px;
        --radius-md: 12px;
      }
      body {
        background: #090a0d;
        color: #f5f6f8;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
        padding: 40px;
        margin: 0;
      }
      h1 { font-size: 24px; margin-bottom: 24px; color: #fff; }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .product-card {
        background: #12141a;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .card-media-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        background: #08090c;
        border-bottom: 1px solid var(--border-subtle);
      }
      .card-preview-art {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .card-floating-badges {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        gap: 6px;
      }
      .card-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 6px;
      }
      .badge-purple { background: rgba(189, 52, 254, 0.2); color: #e09aff; border: 1px solid rgba(189, 52, 254, 0.4); }
      .badge-blue { background: rgba(0, 168, 225, 0.2); color: #38bdf8; border: 1px solid rgba(0, 168, 225, 0.4); }
      .badge-green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
      .card-floating-icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 38px;
        height: 38px;
        border-radius: var(--radius-md);
        background: rgba(9, 10, 13, 0.78);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid var(--border-subtle);
      }
      .card-body {
        padding: 16px;
      }
      .tag { font-size: 11px; color: #8e95a5; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 6px; }
      .title { font-size: 14px; font-weight: 600; margin: 0 0 10px 0; line-height: 1.35; color: #fff; }
      .price { font-size: 17px; font-weight: 700; color: #fff; }
      .old-price { font-size: 12px; color: #6b7280; text-decoration: line-through; margin-left: 6px; }
      .opt-label { text-align: center; font-size: 13px; color: #a1a7b5; margin-bottom: 8px; font-weight: 600; }
    </style>
  </head>
  <body>
    <h1>Comparación en Card de Catálogo Punto Prisma</h1>
    <div class="grid">
      <div>
        <div class="opt-label">Referencia: Gemini (Actual)</div>
        <div class="product-card">
          <div class="card-media-preview">
            <img class="card-preview-art" src="data:image/jpeg;base64,${bgemini}">
            <div class="card-floating-badges"><span class="card-badge badge-purple">18 Meses Trial</span><span class="card-badge badge-green">5 TB</span></div>
          </div>
          <div class="card-body">
            <div class="tag">Suscripción Digital</div>
            <div class="title">Google AI Pro - Gemini 18 Months Trial (Global)</div>
            <div><span class="price">Gs. 99.000</span><span class="old-price">Gs. 490.000</span></div>
          </div>
        </div>
      </div>
      <div>
        <div class="opt-label">Opción 1: Direct Center (100%)</div>
        <div class="product-card">
          <div class="card-media-preview">
            <img class="card-preview-art" src="data:image/png;base64,${b1}">
            <div class="card-floating-badges"><span class="card-badge badge-purple">1 Mes Pro</span><span class="card-badge badge-blue">Global</span></div>
          </div>
          <div class="card-body">
            <div class="tag">Suscripción Digital</div>
            <div class="title">CapCut Pro - 1 Month (Global) - CapCut Account</div>
            <div><span class="price">Gs. 29.000</span><span class="old-price">Gs. 85.000</span></div>
          </div>
        </div>
      </div>
      <div>
        <div class="opt-label">Opción 2: Balanced (92% - Recomendada)</div>
        <div class="product-card">
          <div class="card-media-preview">
            <img class="card-preview-art" src="data:image/png;base64,${b2}">
            <div class="card-floating-badges"><span class="card-badge badge-purple">1 Mes Pro</span><span class="card-badge badge-blue">Global</span></div>
          </div>
          <div class="card-body">
            <div class="tag">Suscripción Digital</div>
            <div class="title">CapCut Pro - 1 Month (Global) - CapCut Account</div>
            <div><span class="price">Gs. 29.000</span><span class="old-price">Gs. 85.000</span></div>
          </div>
        </div>
      </div>
      <div>
        <div class="opt-label">Opción 3: Relaxed (85%)</div>
        <div class="product-card">
          <div class="card-media-preview">
            <img class="card-preview-art" src="data:image/png;base64,${b3}">
            <div class="card-floating-badges"><span class="card-badge badge-purple">1 Mes Pro</span><span class="card-badge badge-blue">Global</span></div>
          </div>
          <div class="card-body">
            <div class="tag">Suscripción Digital</div>
            <div class="title">CapCut Pro - 1 Month (Global) - CapCut Account</div>
            <div><span class="price">Gs. 29.000</span><span class="old-price">Gs. 85.000</span></div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>`);
  
  await page.screenshot({ path: 'scratch/cards_comparison.png' });
  await browser.close();
  console.log('Saved cards_comparison.png');
})();

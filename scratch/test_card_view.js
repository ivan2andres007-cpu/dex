const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const b64 = fs.readFileSync('scratch/capcut_v2_preview.png').toString('base64');

  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        background: #090A0E;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 40px;
        display: flex;
        gap: 40px;
        align-items: flex-start;
      }

      .product-card {
        width: 320px;
        background: #111318;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      }

      .card-media-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        background: #08090C;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }

      .card-preview-art {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .card-floating-icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: rgba(9, 10, 13, 0.82);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 2;
      }

      .card-floating-badges {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        z-index: 2;
      }

      .card-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        backdrop-filter: blur(8px);
      }

      .badge-purple {
        background: rgba(189, 52, 254, 0.2);
        color: #e09aff;
        border: 1px solid rgba(189, 52, 254, 0.4);
      }

      .badge-blue {
        background: rgba(0, 168, 225, 0.2);
        color: #38bdf8;
        border: 1px solid rgba(0, 168, 225, 0.4);
      }

      .card-content {
        padding: 18px;
      }

      .tag {
        font-size: 11px;
        font-weight: 700;
        color: #8E95A5;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
      }

      .title {
        font-size: 15px;
        font-weight: 700;
        color: #FFFFFF;
        line-height: 1.3;
        margin-bottom: 12px;
      }

      .price-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
      }

      .price {
        font-size: 20px;
        font-weight: 800;
        color: #FFFFFF;
      }

      .discount {
        background: #EF4444;
        color: #FFFFFF;
        font-size: 11px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <!-- Real Card Simulation -->
    <div class="product-card">
      <div class="card-media-preview">
        <img class="card-preview-art" src="data:image/png;base64,${b64}">
        <div class="card-floating-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#121316"/>
            <g transform="translate(4.5, 4.5) scale(0.62)">
              <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#00F0FF"/>
            </g>
          </svg>
        </div>
        <div class="card-floating-badges">
          <span class="card-badge badge-purple">1 Mes Pro</span>
          <span class="card-badge badge-blue">Cuenta Global</span>
        </div>
      </div>
      <div class="card-content">
        <div class="tag">Suscripción Digital</div>
        <div class="title">CapCut Pro - 1 Month (Global) - CapCut Account</div>
        <div class="price-row">
          <div class="price">Gs. 29.000</div>
          <div class="discount">-66%</div>
        </div>
      </div>
    </div>
  </body>
  </html>`);

  await page.screenshot({ path: 'scratch/card_v2_test.png' });
  console.log('Saved card test in scratch/card_v2_test.png');
  await browser.close();
})();


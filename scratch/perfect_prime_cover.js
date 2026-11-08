const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Load the existing 1024x1024 jpg
  const buf = fs.readFileSync('imagenes/suscripciones/Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;

  const renderedBase64 = await page.evaluate(async (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => img.onload = r);

    const targetSize = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Pure white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetSize, targetSize);

    // Scale to 0.88 to give Apple-style breathing room and prevent badge overlap
    const scale = 0.88;
    const drawSize = targetSize * scale;
    const drawX = (targetSize - drawSize) / 2;
    // Shift slightly down (drawY around 140px in 2048px)
    const drawY = ((targetSize - drawSize) / 2) + 20;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawSize, drawSize);

    return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
  }, dataUrl);

  const destDir = path.resolve('imagenes/suscripciones');
  const jpgPath = path.join(destDir, 'Amazon Prime Video - 1 Mes (Perfil Privado).jpg');
  const pngPath = path.join(destDir, 'Amazon Prime Video - 1 Mes (Perfil Privado).png');

  fs.writeFileSync(jpgPath, Buffer.from(renderedBase64, 'base64'));
  fs.writeFileSync(pngPath, Buffer.from(renderedBase64, 'base64'));
  console.log('Saved 2048x2048 Prime cover. Size:', fs.statSync(jpgPath).size);

  // Now test in card preview with actual floating badges and floating icon
  const pageTest = await browser.newPage({ viewport: { width: 400, height: 500 } });
  const b64 = fs.readFileSync(jpgPath).toString('base64');
  
  await pageTest.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #090a0d; margin: 20px; font-family: -apple-system, sans-serif; }
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
    <div class="product-card">
      <div class="card-media-preview">
        <img class="card-preview-art" src="data:image/jpeg;base64,${b64}">
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
  </body>
  </html>`);

  await pageTest.screenshot({ path: 'scratch/perfect_prime_preview.png' });
  console.log('Saved scratch/perfect_prime_preview.png');
  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
  
  const rawBuf = fs.readFileSync('scratch/roblox_original.jpg');
  const dataUrl = `data:image/webp;base64,${rawBuf.toString('base64')}`;

  const generateSquare = async (scale, featherEdge = true) => {
    return await page.evaluate(async ({ dataUrl, scale, featherEdge }) => {
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => img.onload = r);
      
      const targetSize = 2048;
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      
      // Pure deep black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetSize, targetSize);
      
      const drawH = targetSize * scale;
      const drawW = drawH * (img.naturalWidth / img.naturalHeight);
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      
      if (featherEdge) {
        // Soft vignette feather on the left and right borders of the drawn image
        // to guarantee 100% seamless blending into the black background
        const fWidth = drawW * 0.04;
        
        // Left edge feather
        const gradL = ctx.createLinearGradient(drawX, 0, drawX + fWidth, 0);
        gradL.addColorStop(0, 'rgba(0,0,0,1)');
        gradL.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradL;
        ctx.fillRect(drawX - 2, drawY, fWidth + 2, drawH);
        
        // Right edge feather
        const gradR = ctx.createLinearGradient(drawX + drawW, 0, drawX + drawW - fWidth, 0);
        gradR.addColorStop(0, 'rgba(0,0,0,1)');
        gradR.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradR;
        ctx.fillRect(drawX + drawW - fWidth, drawY, fWidth + 2, drawH);

        // Top edge feather
        const fHeight = drawH * 0.03;
        const gradT = ctx.createLinearGradient(0, drawY, 0, drawY + fHeight);
        gradT.addColorStop(0, 'rgba(0,0,0,1)');
        gradT.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradT;
        ctx.fillRect(drawX, drawY - 2, drawW, fHeight + 2);

        // Bottom edge feather
        const gradB = ctx.createLinearGradient(0, drawY + drawH, 0, drawY + drawH - fHeight);
        gradB.addColorStop(0, 'rgba(0,0,0,1)');
        gradB.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradB;
        ctx.fillRect(drawX, drawY + drawH - fHeight, drawW, fHeight + 2);
      }
      
      return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
    }, { dataUrl, scale, featherEdge });
  };

  const opt1 = await generateSquare(1.0, true);
  const opt2 = await generateSquare(0.92, true);
  const opt3 = await generateSquare(0.86, true);

  fs.writeFileSync('scratch/roblox_opt1.jpg', Buffer.from(opt1, 'base64'));
  fs.writeFileSync('scratch/roblox_opt2.jpg', Buffer.from(opt2, 'base64'));
  fs.writeFileSync('scratch/roblox_opt3.jpg', Buffer.from(opt3, 'base64'));

  // Compare in Punto Prisma card mockup
  const bAssetto = fs.readFileSync('imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg').toString('base64');
  const bCapcut = fs.readFileSync('imagenes/suscripciones/CapCut Pro - 1 Month (Global) - CapCut Account.jpg').toString('base64');
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        background: #090a0d;
        color: #f5f6f8;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 30px;
        margin: 0;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      .card {
        background: #12141a;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        overflow: hidden;
      }
      .media {
        width: 100%;
        aspect-ratio: 1/1;
        background: #000;
        position: relative;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 168, 225, 0.2);
        color: #38bdf8;
        border: 1px solid rgba(0, 168, 225, 0.4);
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
      }
      .info { padding: 14px; }
      .tag { font-size: 10px; color: #8e95a5; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
      .title { font-size: 13px; font-weight: 600; margin-bottom: 8px; line-height: 1.3; }
      .price { font-size: 16px; font-weight: 700; color: #fff; }
      .lbl { text-align: center; font-size: 12px; color: #aaa; margin-bottom: 6px; font-weight: 600; }
    </style>
  </head>
  <body>
    <h2>Comparación de Opciones Cuadradas para Roblox 200 Robux</h2>
    <div class="grid">
      <div>
        <div class="lbl">Assetto Corsa (Referencia Gaming)</div>
        <div class="card">
          <div class="media"><img src="data:image/jpeg;base64,${bAssetto}"><span class="badge">Steam Key</span></div>
          <div class="info"><div class="tag">Juego Steam PC</div><div class="title">Assetto Corsa (Global) (PC)</div><div class="price">Gs. 38.000</div></div>
        </div>
      </div>
      <div>
        <div class="lbl">Opción 1: Direct Center (100%)</div>
        <div class="card">
          <div class="media"><img src="data:image/jpeg;base64,${opt1}"><span class="badge">Roblox Code</span></div>
          <div class="info"><div class="tag">Gaming & Claves</div><div class="title">Roblox - 200 Robux (Global)</div><div class="price">Gs. 25.000</div></div>
        </div>
      </div>
      <div>
        <div class="lbl">Opción 2: Balanced (92% - Recomendada)</div>
        <div class="card">
          <div class="media"><img src="data:image/jpeg;base64,${opt2}"><span class="badge">Roblox Code</span></div>
          <div class="info"><div class="tag">Gaming & Claves</div><div class="title">Roblox - 200 Robux (Global)</div><div class="price">Gs. 25.000</div></div>
        </div>
      </div>
      <div>
        <div class="lbl">CapCut Pro (Suscripción Cuadrada)</div>
        <div class="card">
          <div class="media"><img src="data:image/jpeg;base64,${bCapcut}"><span class="badge">1 Mes Pro</span></div>
          <div class="info"><div class="tag">Suscripción Digital</div><div class="title">CapCut Pro - 1 Month (Global)</div><div class="price">Gs. 29.000</div></div>
        </div>
      </div>
    </div>
  </body>
  </html>`);

  await page.screenshot({ path: 'scratch/roblox_comparison.png' });
  await browser.close();
  console.log('Saved roblox_comparison.png');
})();

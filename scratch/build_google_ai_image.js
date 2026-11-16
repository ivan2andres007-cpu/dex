const { chromium } = require('playwright');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 2048px;
      height: 2048px;
      background-color: #08090d;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "SF Pro Display", sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 110px 90px 120px;
    }

    /* Ambient background glows */
    .bg-glow-top {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 1700px;
      height: 950px;
      background: radial-gradient(ellipse at 50% 35%, rgba(78, 135, 248, 0.28) 0%, rgba(189, 52, 254, 0.22) 35%, rgba(250, 112, 154, 0.12) 60%, transparent 75%);
      filter: blur(95px);
      pointer-events: none;
    }

    .bg-glow-bottom {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 1500px;
      height: 700px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 75%);
      filter: blur(100px);
      pointer-events: none;
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 64px 64px;
      pointer-events: none;
    }

    /* Top Brand Section */
    .header-box {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 22px;
      margin-bottom: 24px;
    }

    .gemini-spark-icon {
      width: 88px;
      height: 88px;
      filter: drop-shadow(0 0 35px rgba(189, 52, 254, 0.6));
    }

    .brand-name {
      font-size: 80px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-pill {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, rgba(78, 135, 248, 0.2), rgba(189, 52, 254, 0.2));
      border: 2px solid rgba(189, 52, 254, 0.5);
      color: #e9d5ff;
      padding: 6px 22px;
      border-radius: 9999px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .main-title {
      font-size: 136px;
      font-weight: 950;
      line-height: 0.95;
      letter-spacing: -0.05em;
      color: #ffffff;
      margin-bottom: 24px;
      text-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
    }

    .main-title span {
      background: linear-gradient(135deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle-badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      background: #000000;
      border: 2px solid rgba(255, 255, 255, 0.22);
      padding: 16px 48px;
      border-radius: 9999px;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
    }

    .badge-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 15px #a855f7;
    }

    /* Center Visual Area */
    .center-visual {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 1400px;
      margin: 10px 0;
    }

    .hero-card-box {
      width: 100%;
      background: rgba(18, 21, 30, 0.88);
      border: 2px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(25px);
      border-radius: 40px;
      padding: 56px 64px;
      box-shadow: 
        0 40px 100px -15px rgba(0, 0, 0, 0.9),
        0 0 60px rgba(189, 52, 254, 0.25);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      position: relative;
    }

    .feature-tile {
      display: flex;
      align-items: flex-start;
      gap: 22px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      padding: 30px 32px;
    }

    .tile-icon-box {
      width: 76px;
      height: 76px;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .tile-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tile-title {
      font-size: 34px;
      font-weight: 850;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .tile-desc {
      font-size: 24px;
      color: #a1a1aa;
      line-height: 1.4;
      font-weight: 500;
    }

    /* Floating Feature Badges */
    .highlight-banner {
      margin-top: 32px;
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(90deg, rgba(78, 135, 248, 0.15), rgba(189, 52, 254, 0.15));
      border: 1.5px solid rgba(189, 52, 254, 0.4);
      padding: 18px 40px;
      border-radius: 9999px;
      font-size: 28px;
      font-weight: 800;
      color: #f3e8ff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    /* Bottom Features Row */
    .bottom-box {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      width: 100%;
    }

    .suite-pill-row {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .suite-item {
      font-size: 24px;
      font-weight: 750;
      padding: 14px 30px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 9999px;
      color: #e4e4e7;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .suite-highlight {
      border-color: rgba(189, 52, 254, 0.45);
      background: rgba(189, 52, 254, 0.16);
      color: #e9d5ff;
    }

    .bottom-footnote {
      font-size: 24px;
      color: #a1a1aa;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .bottom-footnote strong {
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="bg-glow-top"></div>
  <div class="bg-glow-bottom"></div>
  <div class="bg-grid"></div>

  <div class="header-box">
    <div class="brand-row">
      <svg class="gemini-spark-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" fill="url(#sparkGrad)"/>
        <defs>
          <linearGradient id="sparkGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4E87F8"/>
            <stop offset="0.5" stop-color="#BD34FE"/>
            <stop offset="1" stop-color="#FA709A"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="brand-name">Google One <span class="brand-pill">AI Premium</span></span>
    </div>

    <h1 class="main-title">12 MESES <span>PLUS</span></h1>

    <div class="subtitle-badge">
      <div class="badge-dot"></div>
      <span>ENLACE DE ACTIVACIÓN GLOBAL</span>
    </div>
  </div>

  <div class="center-visual">
    <div class="hero-card-box">
      <div class="feature-tile">
        <div class="tile-icon-box">✦</div>
        <div class="tile-info">
          <div class="tile-title">Gemini Advanced</div>
          <div class="tile-desc">Acceso prioritario a los modelos de IA más potentes de Google para análisis y código</div>
        </div>
      </div>

      <div class="feature-tile">
        <div class="tile-icon-box">☁️</div>
        <div class="tile-info">
          <div class="tile-title">2 TB de Almacenamiento</div>
          <div class="tile-desc">2.000 GB para Google Drive, Fotos en calidad original y Gmail sin límites</div>
        </div>
      </div>

      <div class="feature-tile">
        <div class="tile-icon-box">✍️</div>
        <div class="tile-info">
          <div class="tile-title">IA en Google Workspace</div>
          <div class="tile-desc">Redacción y análisis con Gemini integrado en Gmail, Docs, Sheets y Slides</div>
        </div>
      </div>

      <div class="feature-tile">
        <div class="tile-icon-box">🔗</div>
        <div class="tile-info">
          <div class="tile-title">Activación Directa 1-Click</div>
          <div class="tile-desc">Enlace oficial para activar directamente en tu cuenta de Google personal</div>
        </div>
      </div>
    </div>

    <div class="highlight-banner">
      <span>🚀 Suscripción Anual Completa (365 Días) • Entrega Digital Inmediata</span>
    </div>
  </div>

  <div class="bottom-box">
    <div class="suite-pill-row">
      <span class="suite-item suite-highlight">✦ Gemini Pro & Ultra IA</span>
      <span class="suite-item">☁️ 2 TB Cloud Storage</span>
      <span class="suite-item">📱 Compatible Móvil & PC</span>
      <span class="suite-item">⚡ Entrega 5-15 min WhatsApp</span>
    </div>

    <div class="bottom-footnote">
      Activación oficial para <strong>cuentas de Google</strong> • Sin bloqueos regionales • Garantía Punto Prisma
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2048, height: 2048 } });
  await page.setContent(htmlContent);
  await page.waitForTimeout(500);

  const outJpg = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Subscription Plus - 12 Months (Global) - Activation Link.jpg');
  const outPng = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Subscription Plus - 12 Months (Global) - Activation Link.png');

  await page.screenshot({ path: outJpg, type: 'jpeg', quality: 95 });
  await page.screenshot({ path: outPng, type: 'png' });

  console.log('Saved Google AI JPG:', outJpg);
  console.log('Saved Google AI PNG:', outPng);
  await browser.close();
})();

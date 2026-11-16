const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const cardPngPath = path.resolve(__dirname, '../imagenes/suscripciones/Avast Ultimate (Global) (PC) 1 Device 1 Year - Digital Key.png');
const cardB64 = 'data:image/webp;base64,' + fs.readFileSync(cardPngPath).toString('base64');

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
      padding: 100px 90px 110px;
    }

    /* Ambient background glows */
    .bg-glow-top {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 1600px;
      height: 900px;
      background: radial-gradient(ellipse at 50% 30%, rgba(255, 120, 0, 0.28) 0%, rgba(255, 80, 0, 0.12) 45%, transparent 75%);
      filter: blur(90px);
      pointer-events: none;
    }

    .bg-glow-bottom {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 1400px;
      height: 700px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 75%);
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

    /* Top Header Section */
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
      gap: 24px;
      margin-bottom: 24px;
    }

    .brand-logo-icon {
      width: 80px;
      height: 80px;
      background: #ff7800;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 35px rgba(255, 120, 0, 0.5);
    }

    .brand-name {
      font-size: 78px;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-pill {
      font-size: 28px;
      font-weight: 800;
      background: rgba(255, 120, 0, 0.16);
      border: 2px solid rgba(255, 120, 0, 0.5);
      color: #ff9d42;
      padding: 6px 20px;
      border-radius: 9999px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .main-title {
      font-size: 108px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 18px;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    .subtitle-badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      background: #000000;
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 14px 44px;
      border-radius: 9999px;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
    }

    .badge-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ff7800;
      box-shadow: 0 0 15px #ff7800;
    }

    /* Center Visual Area */
    .center-visual {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
    }

    .card-wrap {
      position: relative;
      border-radius: 36px;
      padding: 10px;
      background: linear-gradient(145deg, rgba(255, 120, 0, 0.4), rgba(255, 255, 255, 0.1) 40%, rgba(0, 0, 0, 0.6));
      box-shadow: 
        0 40px 100px -15px rgba(0, 0, 0, 0.9),
        0 0 70px rgba(255, 120, 0, 0.35);
    }

    .card-img {
      width: 620px;
      height: auto;
      border-radius: 28px;
      display: block;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    /* Floating Feature Badges around card */
    .feat-tag {
      position: absolute;
      background: rgba(18, 20, 26, 0.92);
      border: 1.5px solid rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(20px);
      padding: 16px 28px;
      border-radius: 20px;
      font-size: 26px;
      font-weight: 800;
      color: #f4f4f5;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
      white-space: nowrap;
    }

    .tag-left-1 { top: 12%; left: -260px; }
    .tag-left-2 { bottom: 18%; left: -280px; }
    .tag-right-1 { top: 14%; right: -280px; }
    .tag-right-2 { bottom: 16%; right: -260px; }

    .tag-icon {
      font-size: 32px;
    }

    /* Bottom Features Row */
    .bottom-box {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
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
      font-weight: 700;
      padding: 12px 28px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      color: #e4e4e7;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .suite-highlight {
      border-color: rgba(255, 120, 0, 0.4);
      background: rgba(255, 120, 0, 0.12);
      color: #ff9d42;
    }

    .bottom-footnote {
      font-size: 23px;
      color: #a1a1aa;
      font-weight: 600;
      letter-spacing: 0.04em;
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
      <div class="brand-logo-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 5.5v6.2c0 5.4 3.4 10.4 8 11.8 4.6-1.4 8-6.4 8-11.8V5.5L12 2z" fill="#ffffff"/>
          <path d="M10.5 15.5l-3.5-3.5 1.4-1.4 2.1 2.1 5.6-5.6 1.4 1.4-7 7z" fill="#ff7800"/>
        </svg>
      </div>
      <span class="brand-name">Avast <span class="brand-pill">Ultimate</span></span>
    </div>

    <h1 class="main-title">1 AÑO • 1 PC</h1>

    <div class="subtitle-badge">
      <div class="badge-dot"></div>
      <span>CLAVE DIGITAL GLOBAL</span>
    </div>
  </div>

  <div class="center-visual">
    <div class="card-wrap">
      <img src="${cardB64}" class="card-img" alt="Avast Ultimate Card">
    </div>

    <div class="feat-tag tag-left-1">
      <span class="tag-icon">🛡️</span>
      <span>Antivirus Premium</span>
    </div>

    <div class="feat-tag tag-left-2">
      <span class="tag-icon">⚡</span>
      <span>Cleanup Acelerador</span>
    </div>

    <div class="feat-tag tag-right-1">
      <span class="tag-icon">🔒</span>
      <span>SecureLine VPN</span>
    </div>

    <div class="feat-tag tag-right-2">
      <span class="tag-icon">👁️</span>
      <span>AntiTrack Privacidad</span>
    </div>
  </div>

  <div class="bottom-box">
    <div class="suite-pill-row">
      <span class="suite-item suite-highlight">🛡️ Protección Total en Tiempo Real</span>
      <span class="suite-item">🌐 VPN Ilimitada de Alta Velocidad</span>
      <span class="suite-item">💻 Optimización para Windows 10/11</span>
      <span class="suite-item">⚡ Entrega Inmediata WhatsApp</span>
    </div>

    <div class="bottom-footnote">
      Compatible con <strong>Windows 10 y Windows 11</strong> • Activación oficial directa en Avast
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

  const outJpg = path.resolve(__dirname, '../imagenes/suscripciones/Avast Ultimate (Global) (PC) 1 Device 1 Year - Digital Key.jpg');
  const outPng = path.resolve(__dirname, '../imagenes/suscripciones/Avast Ultimate (Global) (PC) 1 Device 1 Year - Digital Key.png');

  await page.screenshot({ path: outJpg, type: 'jpeg', quality: 95 });
  await page.screenshot({ path: outPng, type: 'png' });

  console.log('Saved Avast JPG:', outJpg);
  console.log('Saved Avast PNG:', outPng);
  await browser.close();
})();

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

const htmlTemplate = (domainText, extraStyle = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1920px;
      background-color: #0a0a0a;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 180px 80px 180px;
    }

    /* Ambient top gradient glow identical to the uploaded image */
    .top-ambient-glow {
      position: absolute;
      top: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 1000px;
      height: 520px;
      background: radial-gradient(ellipse 70% 60% at 50% 30%, rgba(168, 85, 247, 0.32), rgba(59, 130, 246, 0.18), transparent 70%);
      pointer-events: none;
      filter: blur(75px);
      border-radius: 9999px;
    }

    /* Subtle fine noise / grid pattern */
    .ambient-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .main-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 960px;
      margin: auto 0;
    }

    /* Antetítulo: exact style */
    .eyebrow {
      display: inline-block;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 34px;
    }

    /* Main headline: exact style */
    .headline {
      font-size: 86px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 32px;
      text-wrap: balance;
    }

    /* Subtitle paragraph: exact style */
    .subtext {
      color: #a1a1aa;
      font-size: 28px;
      line-height: 1.62;
      max-width: 860px;
      margin-bottom: 60px;
      text-wrap: pretty;
      font-weight: 400;
    }

    /* White pill button: exact style */
    .button-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background-color: #ffffff;
      color: #09090b;
      font-weight: 700;
      font-size: 30px;
      padding: 24px 62px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 40px -4px rgba(255, 255, 255, 0.22), 0 10px 18px -5px rgba(0, 0, 0, 0.6);
      margin-bottom: 50px;
    }

    .button-arrow {
      width: 28px;
      height: 28px;
      stroke-width: 2.4;
    }

    /* 3 Pills Row: exact style */
    .pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 60px;
    }

    .pill-item {
      font-size: 20px;
      font-weight: 600;
      color: #d4d4d8;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 12px 26px;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* Destination Guide to puntoprisma.store -> Studio */
    .destination-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      padding-top: 36px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      width: 100%;
      max-width: 760px;
    }

    .destination-label {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #10b981;
    }

    .destination-path {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 14px 34px;
      border-radius: 9999px;
    }

    .dest-arrow {
      color: #10b981;
      font-size: 22px;
    }

    .destination-sub {
      font-size: 19px;
      color: #71717a;
      font-weight: 500;
    }

    ${extraStyle}
  </style>
</head>
<body>
  <div class="top-ambient-glow"></div>
  <div class="ambient-grid"></div>

  <div class="main-content">
    <span class="eyebrow">— PUNTO PRISMA STUDIO</span>

    <h1 class="headline">Elevá tu presencia digital.</h1>

    <p class="subtext">
      Descubrí nuestro espacio dedicado exclusivamente al desarrollo de ecosistemas web: landing pages, catálogos móviles y sistemas a medida de alto rendimiento.
    </p>

    <div class="button-pill">
      <span>Explorar el Studio</span>
      <svg class="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>

    <div class="pills-row">
      <span class="pill-item">✦ Estilo Apple</span>
      <span class="pill-item">⚡ Carga Instantánea</span>
      <span class="pill-item">📱 100% Adaptable Móvil</span>
    </div>

    <!-- Direction / Destination -->
    <div class="destination-footer">
      <span class="destination-label">DISPONIBLE EN NUESTRA WEB</span>
      <div class="destination-path">
        <span>puntoprisma.store</span>
        <span class="dest-arrow">➔</span>
        <span style="color: #ffffff;">Apartado Studio</span>
      </div>
      <span class="destination-sub">Tocá el enlace de la historia para ingresar</span>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  // 1. Render main 1080x1920 Instagram Story Flyer
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });

  await page.setContent(htmlTemplate());
  await page.waitForTimeout(100);

  const filename = 'flyer-story-studio-completo.png';
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, omitBackground: false });
  fs.copyFileSync(target, path.join(artifactDir, filename));
  console.log('Saved:', filename);

  // 2. Render 2x Ultra-HD 2160x3840 version
  const page2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });

  await page2x.setContent(htmlTemplate());
  await page2x.waitForTimeout(100);

  const filename2x = 'flyer-story-studio-completo-2x.png';
  const target2x = path.join(outDir, filename2x);
  await page2x.screenshot({ path: target2x, omitBackground: false });
  fs.copyFileSync(target2x, path.join(artifactDir, filename2x));
  console.log('Saved 2x:', filename2x);

  await browser.close();
  console.log('All done!');
})();


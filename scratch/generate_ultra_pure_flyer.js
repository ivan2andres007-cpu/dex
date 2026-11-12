const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

const htmlUltraPure = `
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
      padding: 0 80px;
    }

    /* Top atmospheric ambient glow */
    .top-ambient-glow {
      position: absolute;
      top: -140px;
      left: 50%;
      transform: translateX(-50%);
      width: 1100px;
      height: 650px;
      background: radial-gradient(ellipse 70% 60% at 50% 25%, rgba(168, 85, 247, 0.35) 0%, rgba(59, 130, 246, 0.18) 45%, transparent 75%);
      pointer-events: none;
      filter: blur(85px);
      border-radius: 9999px;
    }

    .content-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 920px;
    }

    .eyebrow {
      display: inline-block;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 38px;
    }

    .headline {
      font-size: 96px;
      font-weight: 850;
      line-height: 1.03;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 36px;
      text-wrap: balance;
    }

    .subtext {
      color: #a1a1aa;
      font-size: 30px;
      line-height: 1.62;
      max-width: 860px;
      margin-bottom: 64px;
      text-wrap: pretty;
      font-weight: 400;
    }

    .button-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background-color: #ffffff;
      color: #09090b;
      font-weight: 700;
      font-size: 34px;
      padding: 26px 72px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 45px -4px rgba(255, 255, 255, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      margin-bottom: 52px;
    }

    .button-arrow {
      width: 32px;
      height: 32px;
      stroke-width: 2.5;
    }

    .pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      flex-wrap: wrap;
      margin-bottom: 70px;
    }

    .pill-item {
      font-size: 22px;
      font-weight: 600;
      color: #d4d4d8;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 14px 28px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    .web-cta-line {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .web-cta-line strong {
      color: #10b981;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="top-ambient-glow"></div>

  <div class="content-container">
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

    <div class="web-cta-line">
      <span>Entrá a <strong>puntoprisma.store</strong> ➔ Sección Studio</span>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page.setContent(htmlUltraPure);
  await page.waitForTimeout(100);

  const filename = 'flyer-story-studio-100-puro.png';
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, omitBackground: false });
  fs.copyFileSync(target, path.join(artifactDir, filename));
  console.log('Saved 100% pure:', filename);

  const page2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });
  await page2x.setContent(htmlUltraPure);
  await page2x.waitForTimeout(100);

  const filename2x = 'flyer-story-studio-100-puro-2x.png';
  const target2x = path.join(outDir, filename2x);
  await page2x.screenshot({ path: target2x, omitBackground: false });
  fs.copyFileSync(target2x, path.join(artifactDir, filename2x));
  console.log('Saved 100% pure 2x:', filename2x);

  await browser.close();
})();


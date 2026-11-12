const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

const htmlStoryPure = `
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
      padding: 0 90px;
    }

    /* Ambient atmospheric glow identical to the user's uploaded screenshot */
    .top-ambient-glow {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 1100px;
      height: 600px;
      background: radial-gradient(ellipse 70% 60% at 50% 25%, rgba(168, 85, 247, 0.32) 0%, rgba(59, 130, 246, 0.16) 45%, transparent 75%);
      pointer-events: none;
      filter: blur(80px);
      border-radius: 9999px;
    }

    /* Subtle bottom ambient reflection */
    .bottom-ambient-glow {
      position: absolute;
      bottom: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.06) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(90px);
    }

    /* Content Container */
    .content-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 920px;
    }

    /* Antetítulo: exact uppercase spaced style */
    .eyebrow {
      display: inline-block;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 36px;
    }

    /* Main headline: exact bold typography */
    .headline {
      font-size: 92px;
      font-weight: 850;
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 34px;
      text-wrap: balance;
    }

    /* Subtitle paragraph */
    .subtext {
      color: #a1a1aa;
      font-size: 28px;
      line-height: 1.62;
      max-width: 860px;
      margin-bottom: 56px;
      text-wrap: pretty;
      font-weight: 400;
    }

    /* White pill button */
    .button-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background-color: #ffffff;
      color: #09090b;
      font-weight: 700;
      font-size: 32px;
      padding: 24px 66px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 42px -4px rgba(255, 255, 255, 0.22), 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      margin-bottom: 46px;
    }

    .button-arrow {
      width: 30px;
      height: 30px;
      stroke-width: 2.5;
    }

    /* 3 Pills Row from the image */
    .pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 74px;
    }

    .pill-item {
      font-size: 20px;
      font-weight: 600;
      color: #d4d4d8;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 12px 26px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    /* Clean, seamless guidance to puntoprisma.store -> Studio */
    .guide-callout {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .guide-label {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #10b981;
    }

    .guide-domain-pill {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 9999px;
      padding: 18px 42px;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .guide-arrow {
      color: #10b981;
      font-size: 24px;
    }

    .guide-hint {
      font-size: 20px;
      color: #71717a;
      font-weight: 500;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="top-ambient-glow"></div>
  <div class="bottom-ambient-glow"></div>

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

    <!-- Seamless guidance to puntoprisma.store -->
    <div class="guide-callout">
      <span class="guide-label">DISPONIBLE EN NUESTRA WEB</span>
      <div class="guide-domain-pill">
        <span>puntoprisma.store</span>
        <span class="guide-arrow">➔</span>
        <span style="color: #ffffff;">Apartado Studio</span>
      </div>
      <span class="guide-hint">Tocá el enlace de la historia para ingresar</span>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  // 1080x1920
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page.setContent(htmlStoryPure);
  await page.waitForTimeout(100);

  const filename = 'flyer-story-studio-puro.png';
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, omitBackground: false });
  fs.copyFileSync(target, path.join(artifactDir, filename));
  console.log('Saved:', filename);

  // 2160x3840 (Ultra-HD 2x)
  const page2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });
  await page2x.setContent(htmlStoryPure);
  await page2x.waitForTimeout(100);

  const filename2x = 'flyer-story-studio-puro-2x.png';
  const target2x = path.join(outDir, filename2x);
  await page2x.screenshot({ path: target2x, omitBackground: false });
  fs.copyFileSync(target2x, path.join(artifactDir, filename2x));
  console.log('Saved 2x:', filename2x);

  await browser.close();
  console.log('Pure flyer generated successfully!');
})();


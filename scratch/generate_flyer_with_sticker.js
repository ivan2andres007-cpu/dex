const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

// Version 1: With the authentic Instagram Link Sticker rendered prominently and styled
const htmlWithSticker = `
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

    /* Ambient atmospheric glow identical to the user's screenshot */
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

    /* Subtle bottom ambient reflection */
    .bottom-ambient-glow {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(90px);
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
      margin-bottom: 36px;
    }

    .headline {
      font-size: 92px;
      font-weight: 850;
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 34px;
      text-wrap: balance;
    }

    .subtext {
      color: #a1a1aa;
      font-size: 28px;
      line-height: 1.62;
      max-width: 860px;
      margin-bottom: 54px;
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
      font-size: 32px;
      padding: 24px 66px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 42px -4px rgba(255, 255, 255, 0.22), 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      margin-bottom: 44px;
    }

    .button-arrow {
      width: 30px;
      height: 30px;
      stroke-width: 2.5;
    }

    .pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 64px;
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

    /* INSTAGRAM LINK STICKER CONTAINER */
    .sticker-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 10px;
    }

    .sticker-instruction {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Authentic Instagram Link Sticker */
    .ig-link-sticker {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: #ffffff;
      color: #0c0d12;
      padding: 20px 42px;
      border-radius: 9999px;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.01em;
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.8),
        0 0 35px rgba(255, 255, 255, 0.25);
      position: relative;
    }

    .ig-chain-icon {
      width: 32px;
      height: 32px;
      color: #0c0d12;
      stroke-width: 2.4;
      flex-shrink: 0;
    }

    .ig-sticker-url {
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .ig-sticker-badge {
      font-size: 18px;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.08);
      padding: 4px 12px;
      border-radius: 9999px;
      color: #27272a;
    }

    .ig-arrow-ext {
      width: 24px;
      height: 24px;
      stroke-width: 2.6;
      color: #52525b;
    }

    .sticker-hint-text {
      font-size: 20px;
      color: #a1a1aa;
      font-weight: 500;
    }
    .sticker-hint-text strong {
      color: #ffffff;
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

    <!-- Official Instagram Link Sticker Element -->
    <div class="sticker-container">
      <div class="sticker-instruction">
        <span>TOCÁ EL STICKER DE ENLACE</span>
      </div>

      <!-- The Link Sticker -->
      <div class="ig-link-sticker">
        <svg class="ig-chain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span class="ig-sticker-url">puntoprisma.store</span>
        <span class="ig-sticker-badge">Studio</span>
        <svg class="ig-arrow-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>

      <div class="sticker-hint-text">
        Ingresá y visitá la sección <strong>Desarrollo Web</strong>
      </div>
    </div>
  </div>
</body>
</html>
`;


// Version 2: Instagram Sticker Target Area (Dashed Dropzone for placing the native Instagram Link sticker directly on top)
const htmlWithDropzone = `
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

    .bottom-ambient-glow {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(90px);
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
      margin-bottom: 36px;
    }

    .headline {
      font-size: 92px;
      font-weight: 850;
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 34px;
      text-wrap: balance;
    }

    .subtext {
      color: #a1a1aa;
      font-size: 28px;
      line-height: 1.62;
      max-width: 860px;
      margin-bottom: 54px;
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
      font-size: 32px;
      padding: 24px 66px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 42px -4px rgba(255, 255, 255, 0.22), 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      margin-bottom: 44px;
    }

    .button-arrow {
      width: 30px;
      height: 30px;
      stroke-width: 2.5;
    }

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
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    /* Dashed Sticker Target Dropzone */
    .sticker-dropzone-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .dropzone-pill {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      border: 2px dashed rgba(16, 185, 129, 0.6);
      background: rgba(16, 185, 129, 0.08);
      color: #10b981;
      padding: 20px 48px;
      border-radius: 9999px;
      font-size: 28px;
      font-weight: 800;
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
    }

    .dropzone-chain {
      width: 30px;
      height: 30px;
      stroke-width: 2.4;
    }

    .dropzone-sub {
      font-size: 20px;
      color: #a1a1aa;
      font-weight: 500;
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

    <!-- Dropzone Area specifically indicating where to paste the Instagram Link Sticker -->
    <div class="sticker-dropzone-box">
      <div class="dropzone-pill">
        <svg class="dropzone-chain" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span>[ Pegá tu sticker de enlace aquí ]</span>
      </div>
      <div class="dropzone-sub">
        Enlace: <strong>puntoprisma.store</strong> ➔ Apartado Studio
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  // Render Version 1 (Sticker integrado oficial)
  const page1 = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page1.setContent(htmlWithSticker);
  await page1.waitForTimeout(100);
  const target1 = path.join(outDir, 'flyer-story-studio-sticker-link.png');
  await page1.screenshot({ path: target1, omitBackground: false });
  fs.copyFileSync(target1, path.join(artifactDir, 'flyer-story-studio-sticker-link.png'));
  console.log('Saved: flyer-story-studio-sticker-link.png');

  // Render Version 1 2x (4K)
  const page1_2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });
  await page1_2x.setContent(htmlWithSticker);
  await page1_2x.waitForTimeout(100);
  const target1_2x = path.join(outDir, 'flyer-story-studio-sticker-link-2x.png');
  await page1_2x.screenshot({ path: target1_2x, omitBackground: false });
  fs.copyFileSync(target1_2x, path.join(artifactDir, 'flyer-story-studio-sticker-link-2x.png'));
  console.log('Saved: flyer-story-studio-sticker-link-2x.png');

  // Render Version 2 (Dropzone para sticker nativo de Instagram)
  const page2 = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page2.setContent(htmlWithDropzone);
  await page2.waitForTimeout(100);
  const target2 = path.join(outDir, 'flyer-story-studio-sticker-dropzone.png');
  await page2.screenshot({ path: target2, omitBackground: false });
  fs.copyFileSync(target2, path.join(artifactDir, 'flyer-story-studio-sticker-dropzone.png'));
  console.log('Saved: flyer-story-studio-sticker-dropzone.png');

  await browser.close();
  console.log('All sticker flyers generated successfully!');
})();


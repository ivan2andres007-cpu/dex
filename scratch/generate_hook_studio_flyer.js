const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

const htmlHookStory = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1920px;
      background-color: #07080a;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 75px;
    }

    /* Ambient top glow matching the exact aesthetic */
    .top-ambient-glow {
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 1100px;
      height: 650px;
      background: radial-gradient(ellipse 70% 60% at 50% 25%, rgba(168, 85, 247, 0.38) 0%, rgba(59, 130, 246, 0.20) 45%, transparent 75%);
      pointer-events: none;
      filter: blur(85px);
      border-radius: 9999px;
    }

    /* Bottom ambient green/cyan glow */
    .bottom-ambient-glow {
      position: absolute;
      bottom: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 850px;
      height: 500px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(95px);
    }

    .ambient-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .content-container {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 930px;
    }

    /* HOOK 1: Scroll-stopper Attention Badge */
    .hook-badge-wrap {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(168, 85, 247, 0.14);
      border: 1px solid rgba(168, 85, 247, 0.4);
      padding: 10px 24px;
      border-radius: 9999px;
      margin-bottom: 24px;
      box-shadow: 0 0 25px rgba(168, 85, 247, 0.2);
    }

    .hook-badge-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #c084fc;
      box-shadow: 0 0 10px #c084fc;
    }

    .hook-badge-text {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #e9d5ff;
    }

    /* Eyebrow: Studio Identity */
    .eyebrow {
      display: inline-block;
      font-size: 21px;
      font-weight: 700;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 28px;
    }

    /* HOOK 2: Main Headline with punch */
    .headline {
      font-size: 92px;
      font-weight: 850;
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 28px;
      text-wrap: balance;
    }

    /* HOOK 3: Benefit & Pain-Relief Subtext */
    .subtext {
      color: #d4d4d8;
      font-size: 27px;
      line-height: 1.6;
      max-width: 860px;
      margin-bottom: 46px;
      text-wrap: pretty;
      font-weight: 400;
    }
    .subtext strong {
      color: #ffffff;
      font-weight: 700;
    }

    /* CTA Button with Glow */
    .button-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background-color: #ffffff;
      color: #09090b;
      font-weight: 800;
      font-size: 32px;
      padding: 24px 64px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 42px -4px rgba(255, 255, 255, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.7);
      margin-bottom: 42px;
    }

    .button-arrow {
      width: 28px;
      height: 28px;
      stroke-width: 2.6;
    }

    /* HOOK 4: Value-Packed Feature Pills (NO "Estilo Apple") */
    .pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 48px;
      max-width: 900px;
    }

    .pill-item {
      font-size: 19px;
      font-weight: 700;
      color: #f4f4f5;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      padding: 12px 22px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .pill-highlight {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
    }

    /* HOOK 5: Social Proof / FOMO Metric Row */
    .fomo-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      margin-bottom: 46px;
      font-size: 20px;
      color: #a1a1aa;
      font-weight: 600;
    }
    .fomo-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .fomo-dot {
      color: #10b981;
      font-size: 22px;
    }

    /* INSTAGRAM LINK STICKER ZONE */
    .sticker-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
    }

    .sticker-instruction {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ig-link-sticker {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: #ffffff;
      color: #0c0d12;
      padding: 20px 44px;
      border-radius: 9999px;
      font-size: 29px;
      font-weight: 900;
      letter-spacing: -0.01em;
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.8),
        0 0 35px rgba(255, 255, 255, 0.28);
    }

    .ig-chain-icon {
      width: 30px;
      height: 30px;
      color: #0c0d12;
      stroke-width: 2.5;
      flex-shrink: 0;
    }

    .ig-sticker-badge {
      font-size: 17px;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.08);
      padding: 4px 14px;
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
  <div class="ambient-grid"></div>

  <div class="content-container">
    <!-- Attention Hook Badge -->
    <div class="hook-badge-wrap">
      <div class="hook-badge-dot"></div>
      <span class="hook-badge-text">¿QUERÉS VENDER EN AUTOMÁTICO?</span>
    </div>

    <!-- Subtitle ID -->
    <span class="eyebrow">— PUNTO PRISMA STUDIO —</span>

    <!-- Main Headline -->
    <h1 class="headline">Elevá tu presencia digital.</h1>

    <!-- Subtext Hook (Pain point & Solution) -->
    <p class="subtext">
      Dejá de perder clientes mandando PDFs o fotos sueltas. Diseñamos <strong>tu catálogo móvil o web a medida</strong>: ultra rápida, moderna y conectada directo a tu WhatsApp para vender 24/7.
    </p>

    <!-- White CTA Button -->
    <div class="button-pill">
      <span>Explorar el Studio</span>
      <svg class="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>

    <!-- 4 High-Conversion Feature Hooks (NO "Estilo Apple") -->
    <div class="pills-row">
      <span class="pill-item pill-highlight">💬 Pedidos 1-Click WhatsApp</span>
      <span class="pill-item">⚡ Carga en &lt; 1 Segundo</span>
      <span class="pill-item">💸 0% Comisiones por Venta</span>
      <span class="pill-item">📱 100% Optimizado Móvil</span>
    </div>

    <!-- FOMO / Trust Row -->
    <div class="fomo-row">
      <div class="fomo-item">
        <span class="fomo-dot">✓</span>
        <span>Sin mensualidades ocultas</span>
      </div>
      <div class="fomo-item">
        <span class="fomo-dot">✓</span>
        <span>Tu marca lista para despegar</span>
      </div>
    </div>

    <!-- Instagram Link Sticker -->
    <div class="sticker-container">
      <div class="sticker-instruction">
        <span>TOCÁ EL ENLACE PARA VER DEMOS EN VIVO</span>
      </div>

      <div class="ig-link-sticker">
        <svg class="ig-chain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span>puntoprisma.store</span>
        <span class="ig-sticker-badge">Studio</span>
        <svg class="ig-arrow-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>

      <div class="sticker-hint-text">
        Entrá a la tienda y visitá la sección <strong>Desarrollo Web</strong>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  // 1. Render standard 1080x1920 Instagram Story Flyer
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page.setContent(htmlHookStory);
  await page.waitForTimeout(100);

  const filename = 'flyer-story-studio-hook.png';
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, omitBackground: false });
  fs.copyFileSync(target, path.join(artifactDir, filename));
  console.log('Saved:', filename);

  // 2. Render Ultra-HD 4K 2160x3840 version
  const page2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });
  await page2x.setContent(htmlHookStory);
  await page2x.waitForTimeout(100);

  const filename2x = 'flyer-story-studio-hook-2x.png';
  const target2x = path.join(outDir, filename2x);
  await page2x.screenshot({ path: target2x, omitBackground: false });
  fs.copyFileSync(target2x, path.join(artifactDir, filename2x));
  console.log('Saved 2x:', filename2x);

  await browser.close();
  console.log('Hook flyer generated successfully!');
})();


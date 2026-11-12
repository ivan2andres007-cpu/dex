const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..');
const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

const animatedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Punto Prisma Studio - Animated Story</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
    }

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

    /* Ambient atmospheric glow with living breath animation */
    .top-ambient-glow {
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 1100px;
      height: 650px;
      background: radial-gradient(ellipse 70% 60% at 50% 25%, rgba(168, 85, 247, 0.42) 0%, rgba(59, 130, 246, 0.22) 45%, transparent 75%);
      pointer-events: none;
      filter: blur(85px);
      border-radius: 9999px;
      animation: ambientBreathe 5s ease-in-out infinite alternate;
    }

    @keyframes ambientBreathe {
      0% {
        transform: translateX(-50%) scale(1);
        opacity: 0.85;
      }
      100% {
        transform: translateX(-50%) scale(1.1);
        opacity: 1;
      }
    }

    /* Bottom ambient green/cyan glow */
    .bottom-ambient-glow {
      position: absolute;
      bottom: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 850px;
      height: 500px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      pointer-events: none;
      filter: blur(95px);
      animation: bottomBreathe 6s ease-in-out infinite alternate;
    }

    @keyframes bottomBreathe {
      0% { opacity: 0.7; transform: translateX(-50%) scale(0.95); }
      100% { opacity: 1; transform: translateX(-50%) scale(1.08); }
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

    /* Staggered entrance keyframe helper */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
      animation: fadeInUp 0.7s var(--ease-out) 0.1s backwards;
    }

    .hook-badge-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #c084fc;
      box-shadow: 0 0 12px #c084fc;
      position: relative;
    }

    /* Radar beacon pulse on dot */
    .hook-badge-dot::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid #c084fc;
      animation: radarPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes radarPing {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
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
      animation: fadeInUp 0.7s var(--ease-out) 0.25s backwards;
    }

    /* HOOK 2: Main Headline */
    .headline {
      font-size: 92px;
      font-weight: 850;
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #ffffff;
      margin-bottom: 28px;
      text-wrap: balance;
      animation: fadeInUp 0.8s var(--ease-out) 0.4s backwards;
    }

    /* HOOK 3: Subtext */
    .subtext {
      color: #d4d4d8;
      font-size: 27px;
      line-height: 1.6;
      max-width: 860px;
      margin-bottom: 46px;
      text-wrap: pretty;
      font-weight: 400;
      animation: fadeInUp 0.8s var(--ease-out) 0.55s backwards;
    }
    .subtext strong {
      color: #ffffff;
      font-weight: 700;
    }

    /* White Button with Shimmer Sweep */
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
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.8s var(--ease-out) 0.7s backwards;
    }

    /* Shimmer sweep effect across button */
    .button-pill::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -80%;
      width: 50%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      transform: skewX(-20deg);
      animation: shimmerLoop 3.6s ease-in-out infinite;
    }

    @keyframes shimmerLoop {
      0%, 40% { left: -80%; opacity: 0; }
      50% { opacity: 1; }
      70%, 100% { left: 140%; opacity: 0; }
    }

    .button-arrow {
      width: 28px;
      height: 28px;
      stroke-width: 2.6;
      animation: arrowBob 1.8s var(--ease-in-out) infinite alternate;
    }

    @keyframes arrowBob {
      0% { transform: translateX(0); }
      100% { transform: translateX(6px); }
    }

    /* 4 High-Conversion Feature Hooks */
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
      animation: fadeInUp 0.7s var(--ease-out) backwards;
    }
    .pill-item:nth-child(1) { animation-delay: 0.85s; }
    .pill-item:nth-child(2) { animation-delay: 0.95s; }
    .pill-item:nth-child(3) { animation-delay: 1.05s; }
    .pill-item:nth-child(4) { animation-delay: 1.15s; }

    .pill-highlight {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
    }

    /* Social Proof / FOMO Row */
    .fomo-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
      margin-bottom: 46px;
      font-size: 20px;
      color: #a1a1aa;
      font-weight: 600;
      animation: fadeInUp 0.7s var(--ease-out) 1.25s backwards;
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
      animation: fadeInUp 0.8s var(--ease-out) 1.4s backwards;
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
      animation: stickerFloat 3s ease-in-out infinite alternate;
    }

    @keyframes stickerFloat {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-4px) scale(1.02); }
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
      animation: extArrowBob 1.8s var(--ease-in-out) infinite alternate;
    }

    @keyframes extArrowBob {
      0% { transform: translate(0, 0); }
      100% { transform: translate(3px, -3px); }
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
    <div class="hook-badge-wrap">
      <div class="hook-badge-dot"></div>
      <span class="hook-badge-text">¿QUERÉS VENDER EN AUTOMÁTICO?</span>
    </div>

    <span class="eyebrow">— PUNTO PRISMA STUDIO —</span>

    <h1 class="headline">Elevá tu presencia digital.</h1>

    <p class="subtext">
      Dejá de perder clientes mandando PDFs o fotos sueltas. Diseñamos <strong>tu catálogo móvil o web a medida</strong>: ultra rápida, moderna y conectada directo a tu WhatsApp para vender 24/7.
    </p>

    <div class="button-pill">
      <span>Explorar el Studio</span>
      <svg class="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>

    <div class="pills-row">
      <span class="pill-item pill-highlight">💬 Pedidos 1-Click WhatsApp</span>
      <span class="pill-item">⚡ Carga en &lt; 1 Segundo</span>
      <span class="pill-item">💸 0% Comisiones por Venta</span>
      <span class="pill-item">📱 100% Optimizado Móvil</span>
    </div>

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

// Save the animated HTML file
const htmlOutPath = path.join(outDir, 'flyer-story-studio-animated.html');
fs.writeFileSync(htmlOutPath, animatedHtml, 'utf8');
fs.copyFileSync(htmlOutPath, path.join(artifactDir, 'flyer-story-studio-animated.html'));
console.log('Saved animated HTML file');

(async () => {
  const videoDir = path.resolve(__dirname, 'video_output');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1080, height: 1920 }
    },
    viewport: { width: 1080, height: 1920 }
  });

  const page = await context.newPage();
  await page.setContent(animatedHtml);

  // Wait 7.5 seconds to capture a complete cinematic cycle of the animation
  await page.waitForTimeout(7500);

  await page.close();
  await context.close();
  await browser.close();

  // Find the video file created by playwright
  const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const rawVideo = path.join(videoDir, videoFiles[videoFiles.length - 1]);
    const finalVideoName = 'flyer-story-studio-animated.webm';
    const targetVideo = path.join(outDir, finalVideoName);
    fs.copyFileSync(rawVideo, targetVideo);
    fs.copyFileSync(rawVideo, path.join(artifactDir, finalVideoName));
    console.log('Saved WebM video:', finalVideoName);
  }

  console.log('Animation build complete!');
})();


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function toBase64(relPath) {
  const full = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(full)) return '';
  const ext = path.extname(full).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
  return `data:${mime};base64,` + fs.readFileSync(full).toString('base64');
}

const logoB64 = toBase64('punto-prisma-pfp.png');

const htmlStory = `
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
      color: #f5f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 160px 60px 140px;
    }

    /* Ambient top glow matching the exact image uploaded */
    .ambient-glow {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 950px;
      height: 650px;
      border-radius: 50%;
      background: radial-gradient(ellipse 70% 55% at 50% 30%, rgba(168, 85, 247, 0.32) 0%, rgba(59, 130, 246, 0.18) 50%, transparent 75%);
      filter: blur(85px);
      pointer-events: none;
      z-index: 1;
    }

    /* Subtle secondary bottom ambient glow */
    .ambient-bottom-glow {
      position: absolute;
      bottom: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 750px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 1;
    }

    .ambient-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 2;
    }

    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Top Brand Bar */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo-img {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.25);
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    .badge-tag {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #d8b4fe;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.35);
      padding: 8px 20px;
      border-radius: 9999px;
    }

    /* Main Center Card (Exact Style of User's Image) */
    .studio-card {
      background: #0a0a0a;
      border: 1px solid #27272a;
      border-radius: 40px;
      padding: 70px 48px;
      text-align: center;
      box-shadow: 
        0 40px 90px -20px rgba(0, 0, 0, 0.9),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.12),
        inset 0 0 1px 1px rgba(255, 255, 255, 0.04);
      position: relative;
      overflow: hidden;
      margin: auto 0;
    }

    /* Inner card gradient glow */
    .card-inner-glow {
      position: absolute;
      top: -160px;
      left: 50%;
      transform: translateX(-50%);
      width: 720px;
      height: 340px;
      background: radial-gradient(ellipse 70% 60% at 50% 30%, rgba(168, 85, 247, 0.26), rgba(59, 130, 246, 0.15), transparent 70%);
      pointer-events: none;
      filter: blur(60px);
      border-radius: 9999px;
    }

    .studio-eyebrow {
      display: inline-block;
      font-size: 19px;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 24px;
      position: relative;
      z-index: 2;
    }

    .studio-heading {
      font-size: 68px;
      font-weight: 800;
      line-height: 1.06;
      letter-spacing: -0.035em;
      color: #ffffff;
      margin-bottom: 24px;
      text-wrap: balance;
      position: relative;
      z-index: 2;
    }

    .studio-subtext {
      color: #a1a1aa;
      font-size: 24px;
      line-height: 1.6;
      max-width: 820px;
      margin: 0 auto 46px;
      text-wrap: pretty;
      position: relative;
      z-index: 2;
    }

    /* The exact white button from the uploaded image */
    .studio-button-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background-color: #ffffff;
      color: #09090b;
      font-weight: 700;
      font-size: 26px;
      padding: 22px 54px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 16px 36px -5px rgba(255, 255, 255, 0.2), 0 10px 16px -6px rgba(0, 0, 0, 0.6);
      position: relative;
      z-index: 2;
    }

    .studio-arrow {
      width: 26px;
      height: 26px;
      stroke-width: 2.4;
    }

    /* Features 3-Pills inside the card */
    .features-pills-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 42px;
      position: relative;
      z-index: 2;
      flex-wrap: wrap;
    }
    .feature-tag {
      font-size: 16px;
      font-weight: 600;
      color: #d4d4d8;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 18px;
      border-radius: 9999px;
    }

    /* Bottom Guide / Call To Action Zone */
    .bottom-guide-box {
      background: linear-gradient(180deg, rgba(20, 24, 33, 0.8) 0%, rgba(10, 12, 17, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 32px;
      padding: 30px 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      position: relative;
    }

    .guide-header-label {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #10b981;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .guide-step-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .step-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 21px;
      font-weight: 700;
      color: #ffffff;
    }
    .step-arrow {
      color: #71717a;
      font-size: 20px;
    }

    /* Instagram Link Sticker Placeholder Target */
    .link-sticker-box {
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #021e13;
      border-radius: 9999px;
      padding: 20px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35);
    }
    .link-sticker-text {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.01em;
    }
    .link-sticker-hint {
      margin-top: 12px;
      font-size: 17px;
      color: #a1a1aa;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="ambient-bottom-glow"></div>
  <div class="ambient-grid"></div>

  <div class="content-wrap">
    <!-- Top Header -->
    <div class="top-bar">
      <div class="brand-group">
        <img src="${logoB64}" class="brand-logo-img" alt="Punto Prisma">
        <span class="brand-title">Punto Prisma</span>
      </div>
      <div class="badge-tag">Desarrollo Web</div>
    </div>

    <!-- Center Card: The exact style and copy from the user's image -->
    <div class="studio-card">
      <div class="card-inner-glow"></div>

      <span class="studio-eyebrow">— PUNTO PRISMA STUDIO</span>

      <h1 class="studio-heading">Elevá tu presencia digital.</h1>

      <p class="studio-subtext">
        Descubrí nuestro espacio dedicado exclusivamente al desarrollo de ecosistemas web: landing pages, catálogos móviles y sistemas a medida de alto rendimiento.
      </p>

      <div class="studio-button-pill">
        <span>Explorar el Studio</span>
        <svg class="studio-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <div class="features-pills-row">
        <span class="feature-tag">✦ Estilo Apple</span>
        <span class="feature-tag">⚡ Carga Instantánea</span>
        <span class="feature-tag">📱 100% Adaptable Móvil</span>
      </div>
    </div>

    <!-- Bottom Guide to puntoprisma.store -> Studio -->
    <div class="bottom-guide-box">
      <div class="guide-header-label">
        <span>CÓMO INGRESAR DESDE NUESTRA TIENDA</span>
      </div>

      <div class="guide-step-row">
        <div class="step-badge">
          <span>1. Entrá a <strong>puntoprisma.store</strong></span>
        </div>
        <span class="step-arrow">➔</span>
        <div class="step-badge">
          <span>2. Tocá <strong>"Desarrollo Web"</strong></span>
        </div>
      </div>

      <!-- Instagram Link Sticker zone -->
      <div class="link-sticker-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        <span class="link-sticker-text">puntoprisma.store</span>
      </div>
      <div class="link-sticker-hint">Tocá el enlace de la historia para conocer nuestro estudio</div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  const outDir = path.resolve(__dirname, '..');
  const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

  // 1. Render standard 1080x1920 Instagram Story Flyer
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  await page.setContent(htmlStory);
  await page.waitForTimeout(100);

  const filename = 'flyer-story-studio-puntoprisma.png';
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, omitBackground: false });
  fs.copyFileSync(target, path.join(artifactDir, filename));
  console.log('Saved:', filename);

  // 2. Also render a 2x Ultra-HD 2160x3840 version for maximum crispness
  const page2x = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2
  });
  await page2x.setContent(htmlStory);
  await page2x.waitForTimeout(100);

  const filename2x = 'flyer-story-studio-puntoprisma-2x.png';
  const target2x = path.join(outDir, filename2x);
  await page2x.screenshot({ path: target2x, omitBackground: false });
  fs.copyFileSync(target2x, path.join(artifactDir, filename2x));
  console.log('Saved 2x:', filename2x);

  await browser.close();
  console.log('Story flyer rendered successfully!');
})();


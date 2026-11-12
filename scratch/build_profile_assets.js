const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();

  const outDir = path.resolve(__dirname, '..');
  const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

  async function render(html, filename, scale = 2, omitBg = false) {
    const page = await browser.newPage({
      viewport: { width: 1024, height: 1024 },
      deviceScaleFactor: scale
    });
    await page.setContent(html);
    await page.waitForTimeout(80);
    const targetPath = path.join(outDir, filename);
    await page.screenshot({ path: targetPath, omitBackground: omitBg });
    fs.copyFileSync(targetPath, path.join(artifactDir, filename));
    await page.close();
    console.log('Rendered:', filename);
  }

  // 1. Classic Dark Brand (Default Profile Avatar)
  const htmlClassic = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1024px;
        height: 1024px;
        background-color: #090a0d;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-box {
        width: 620px;
        height: 620px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-8px);
      }
      svg { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div class="icon-box">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,3 29,26 3,26" stroke="#ffffff" stroke-width="2.35" stroke-linejoin="round" />
        <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3" />
        <circle cx="16" cy="18" r="2.6" fill="#10b981" />
      </svg>
    </div>
  </body>
  </html>
  `;

  // 2. Premium Ambient Glow
  const htmlGlow = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1024px;
        height: 1024px;
        background: radial-gradient(circle at 50% 50%, #11151f 0%, #090a0d 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .ambient {
        position: absolute;
        width: 640px;
        height: 640px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0, 242, 254, 0.1) 40%, transparent 70%);
        filter: blur(52px);
      }
      .icon-box {
        width: 620px;
        height: 620px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-8px);
        position: relative;
        z-index: 2;
      }
      svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 28px rgba(16, 185, 129, 0.35));
      }
    </style>
  </head>
  <body>
    <div class="ambient"></div>
    <div class="icon-box">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,3 29,26 3,26" stroke="#ffffff" stroke-width="2.35" stroke-linejoin="round" />
        <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3" />
        <circle cx="16" cy="18" r="2.6" fill="#10b981" />
      </svg>
    </div>
  </body>
  </html>
  `;

  // 3. Transparent PNG
  const htmlTransparent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1024px;
        height: 1024px;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .icon-box {
        width: 620px;
        height: 620px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-8px);
      }
      svg { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div class="icon-box">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,3 29,26 3,26" stroke="#ffffff" stroke-width="2.35" stroke-linejoin="round" />
        <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3" />
        <circle cx="16" cy="18" r="2.6" fill="#10b981" />
      </svg>
    </div>
  </body>
  </html>
  `;

  // 4. Circle Preview (what it looks like on WhatsApp / Instagram)
  const htmlCirclePreview = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1024px;
        height: 1024px;
        background: #111216;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .avatar-ring {
        width: 680px;
        height: 680px;
        border-radius: 50%;
        background-color: #090a0d;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid rgba(16, 185, 129, 0.4);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.2);
        overflow: hidden;
      }
      .icon-box {
        width: 410px;
        height: 410px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(-5px);
      }
      svg { width: 100%; height: 100%; }
      .label {
        margin-top: 40px;
        color: #a1a1aa;
        font-size: 24px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="avatar-ring">
      <div class="icon-box">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="16,3 29,26 3,26" stroke="#ffffff" stroke-width="2.35" stroke-linejoin="round" />
          <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3" />
          <circle cx="16" cy="18" r="2.6" fill="#10b981" />
        </svg>
      </div>
    </div>
    <div class="label">Vista previa en perfil circular (WhatsApp / Instagram)</div>
  </body>
  </html>
  `;

  // Render high quality outputs
  await render(htmlClassic, 'punto-prisma-pfp.png', 2); // 2048x2048 Ultra-HD
  await render(htmlClassic, 'punto-prisma-pfp-1024.png', 1); // 1024x1024 Standard
  await render(htmlGlow, 'punto-prisma-pfp-glow.png', 2); // 2048x2048 Glow
  await render(htmlTransparent, 'punto-prisma-pfp-transparent.png', 2, true); // Transparent
  await render(htmlCirclePreview, 'punto-prisma-preview-circle.png', 1); // Mockup preview

  // Master SVG
  const masterSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="#090a0d"/>
  <g transform="translate(512, 504) scale(19.3) translate(-16, -16)">
    <polygon points="16,3 29,26 3,26" fill="none" stroke="#ffffff" stroke-width="2.35" stroke-linejoin="round"/>
    <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3"/>
    <circle cx="16" cy="18" r="2.6" fill="#10b981"/>
  </g>
</svg>`;
  fs.writeFileSync(path.join(outDir, 'punto-prisma-logo.svg'), masterSvg, 'utf8');
  fs.writeFileSync(path.join(artifactDir, 'punto-prisma-logo.svg'), masterSvg, 'utf8');

  await browser.close();
  console.log('All formats generated and copied to artifact directory!');
})();

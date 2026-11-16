const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const originalFile = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg');
const originalB64 = 'data:image/jpeg;base64,' + fs.readFileSync(originalFile).toString('base64');

// Google official SVG paths
const googleSvg = `
<svg viewBox="0 0 272 92" height="106" width="313" xmlns="http://www.w3.org/2000/svg">
  <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
  <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
  <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 8.16 11.18 8.16 7.31 0 11.84-4.53 11.84-13.07v-3.23h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.82h9.44zm-8.74 20.92c0-7.89-5.21-13.52-11.84-13.52-6.72 0-12.35 5.63-12.35 13.52 0 7.81 5.63 13.36 12.35 13.36 6.63 0 11.84-5.55 11.84-13.36z"/>
  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
  <path fill="#4285F4" d="M35.29 41.41V32H67.5c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.53 9.66C16.05 69.35 0 53.8 0 34.68S16.05 0 35.29 0c10.58 0 18.23 4.12 23.85 9.49l-6.68 6.68c-4.08-3.83-9.57-6.85-17.17-6.85-13.88 0-24.77 11.19-24.77 25.36 0 14.17 10.89 25.36 24.77 25.36 8.99 0 14.11-3.61 17.39-6.89 1.8-1.8 3-4.32 3.5-7.74H35.29z"/>
</svg>
`;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=Inter:wght@500;600;700;800;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: 2048px;
      height: 2048px;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Base original image: Wave and GLOBAL pill */
    #base-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 2048px;
      height: 2048px;
      z-index: 1;
    }

    /* Clean white patch covering top logo and 18 MESES (down to Y: 1010) */
    #white-patch {
      position: absolute;
      top: 0;
      left: 0;
      width: 2048px;
      height: 1010px;
      background: #ffffff;
      z-index: 2;
    }

    /* Top Logo Area: slightly lowered to 200px so store badge pills have generous breathing room */
    .top-logo-area {
      position: absolute;
      top: 205px;
      left: 0;
      width: 2048px;
      height: 310px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .brand-top-row {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .neural-svg {
      width: 158px;
      height: 158px;
      filter: drop-shadow(0 6px 18px rgba(66, 133, 244, 0.2));
    }

    .brand-text-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .google-ai-line {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .google-svg-box {
      display: flex;
      align-items: center;
    }

    .ai-wordmark {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 98px;
      font-weight: 500;
      color: #3C4043;
      letter-spacing: -0.02em;
    }

    .plus-subtag {
      font-family: 'Plus Jakarta Sans', 'Montserrat', -apple-system, sans-serif;
      font-size: 44px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-top: -6px;
      margin-right: 4px;
    }

    .suscripcion-label {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 35px;
      font-weight: 800;
      color: #000000;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      text-align: center;
      margin-top: 8px;
    }

    /* Main Title Area: perfectly centered between Logo and GLOBAL pill */
    .title-area {
      position: absolute;
      top: 685px;
      left: 0;
      width: 2048px;
      height: 200px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-text {
      font-family: 'Montserrat', 'Plus Jakarta Sans', -apple-system, sans-serif;
      font-size: 260px;
      font-weight: 900;
      line-height: 1;
      color: #000000;
      letter-spacing: -0.04em;
      text-align: center;
    }
  </style>
</head>
<body>
  <img id="base-bg" src="${originalB64}" alt="Base Image">
  <div id="white-patch"></div>

  <!-- Top Logo Area -->
  <div class="top-logo-area">
    <div class="brand-top-row">
      <!-- Neural Network 19-dot Hexagon in official Google colors -->
      <svg class="neural-svg" viewBox="0 0 110 110" fill="none">
        <!-- Col 1 (Red): 3 dots -->
        <circle cx="22" cy="35" r="8.5" fill="#EA4335" />
        <circle cx="22" cy="55" r="8.5" fill="#EA4335" />
        <circle cx="22" cy="75" r="8.5" fill="#EA4335" />

        <!-- Col 2 (Amber/Orange): 4 dots -->
        <circle cx="38" cy="25" r="8.5" fill="#FBBC05" />
        <circle cx="38" cy="45" r="8.5" fill="#F29900" />
        <circle cx="38" cy="65" r="8.5" fill="#F29900" />
        <circle cx="38" cy="85" r="8.5" fill="#FBBC05" />

        <!-- Col 3 (Green): 5 dots -->
        <circle cx="55" cy="15" r="8.5" fill="#34A853" />
        <circle cx="55" cy="35" r="8.5" fill="#34A853" />
        <circle cx="55" cy="55" r="8.5" fill="#34A853" />
        <circle cx="55" cy="75" r="8.5" fill="#34A853" />
        <circle cx="55" cy="95" r="8.5" fill="#34A853" />

        <!-- Col 4 (Google Blue): 4 dots -->
        <circle cx="72" cy="25" r="8.5" fill="#4285F4" />
        <circle cx="72" cy="45" r="8.5" fill="#4285F4" />
        <circle cx="72" cy="65" r="8.5" fill="#4285F4" />
        <circle cx="72" cy="85" r="8.5" fill="#4285F4" />

        <!-- Col 5 (Deep Blue): 3 dots -->
        <circle cx="88" cy="35" r="8.5" fill="#1A73E8" />
        <circle cx="88" cy="55" r="8.5" fill="#1A73E8" />
        <circle cx="88" cy="75" r="8.5" fill="#1A73E8" />
      </svg>

      <div class="brand-text-block">
        <div class="google-ai-line">
          <div class="google-svg-box">
            ${googleSvg}
          </div>
          <span class="ai-wordmark">AI</span>
        </div>
        <div class="plus-subtag">PLUS</div>
      </div>
    </div>

    <div class="suscripcion-label">SUSCRIPCIÓN</div>
  </div>

  <!-- Main Title Area -->
  <div class="title-area">
    <div class="title-text">12 MESES</div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2048, height: 2048 } });
  await page.setContent(html);
  await page.waitForTimeout(600);

  const outputPath = path.resolve(__dirname, 'google_ai_plus_perfect.jpg');
  await page.screenshot({ path: outputPath, type: 'jpeg', quality: 96 });
  console.log('Saved perfected card to:', outputPath);

  // Also update store assets directly
  const destJpg = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Subscription Plus - 12 Months (Global) - Activation Link.jpg');
  const destPng = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Subscription Plus - 12 Months (Global) - Activation Link.png');
  fs.copyFileSync(outputPath, destJpg);
  fs.copyFileSync(outputPath, destPng);
  console.log('Updated store JPG and PNG assets');

  await browser.close();
})();

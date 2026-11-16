const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const originalFile = path.resolve(__dirname, '../imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg');
const originalB64 = 'data:image/jpeg;base64,' + fs.readFileSync(originalFile).toString('base64');

// We use Playwright to compose the image at exact 2048 x 2048 resolution
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: 2048px;
      height: 2048px;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Google Sans", "Plus Jakarta Sans", sans-serif;
    }

    /* Base original image showing the pristine Google bottom wave and GLOBAL pill */
    #base-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 2048px;
      height: 2048px;
      z-index: 1;
    }

    /* Clean white patch covering the top logo and "18 MESES" while keeping GLOBAL and the bottom wave */
    #white-patch {
      position: absolute;
      top: 0;
      left: 0;
      width: 2048px;
      height: 1010px;
      background: #ffffff;
      z-index: 2;
    }

    /* Content container over white patch */
    .content-layer {
      position: relative;
      z-index: 10;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 150px;
    }

    /* Top Brand Row */
    .brand-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 90px;
    }

    .brand-main-row {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .neural-cluster-svg {
      width: 130px;
      height: 130px;
      filter: drop-shadow(0 4px 12px rgba(66, 133, 244, 0.2));
    }

    .google-ai-title-wrap {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .google-letters {
      font-family: "Google Sans", "Product Sans", -apple-system, sans-serif;
      font-size: 106px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1;
      display: flex;
      align-items: center;
    }

    .g-blue { color: #4285F4; }
    .g-red { color: #EA4335; }
    .g-yellow { color: #FBBC05; }
    .g-green { color: #34A853; }

    .ai-text {
      color: #3C4043;
      margin-left: 20px;
      font-weight: 500;
    }

    .plus-badge {
      font-family: -apple-system, BlinkMacSystemFont, "Google Sans", sans-serif;
      font-size: 42px;
      font-weight: 800;
      background: linear-gradient(135deg, #1A73E8 0%, #8B5CF6 100%);
      color: #ffffff;
      padding: 10px 28px;
      border-radius: 9999px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35);
      margin-left: 10px;
    }

    .sub-brand-text {
      font-size: 38px;
      font-weight: 800;
      color: #000000;
      letter-spacing: 0.24em;
      text-transform: uppercase;
    }

    /* Main Big Hero Title "12 MESES" */
    .hero-title {
      font-family: "Montserrat", "Plus Jakarta Sans", -apple-system, sans-serif;
      font-size: 260px;
      font-weight: 900;
      line-height: 1;
      color: #000000;
      letter-spacing: -0.04em;
      text-align: center;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <!-- Underlying base image provides the pristine Google Wave and the GLOBAL pill -->
  <img id="base-bg" src="${originalB64}" alt="Base Image">

  <!-- Clean pure white mask over 18 MESES and Gemini logo -->
  <div id="white-patch"></div>

  <!-- New Google AI Plus content -->
  <div class="content-layer">
    <div class="brand-container">
      <div class="brand-main-row">
        <!-- SVG Vector of Google AI 19-dot Neural Network Hexagon -->
        <svg class="neural-cluster-svg" viewBox="0 0 110 110" fill="none">
          <!-- Col 1 (Red/Orange): 3 dots -->
          <circle cx="22" cy="35" r="8" fill="#EA4335" />
          <circle cx="22" cy="55" r="8" fill="#EA4335" />
          <circle cx="22" cy="75" r="8" fill="#EA4335" />

          <!-- Col 2 (Yellow/Amber): 4 dots -->
          <circle cx="38" cy="25" r="8" fill="#FBBC05" />
          <circle cx="38" cy="45" r="8" fill="#F29900" />
          <circle cx="38" cy="65" r="8" fill="#FBBC05" />
          <circle cx="38" cy="85" r="8" fill="#FBBC05" />

          <!-- Col 3 (Green): 5 dots -->
          <circle cx="55" cy="15" r="8" fill="#34A853" />
          <circle cx="55" cy="35" r="8" fill="#34A853" />
          <circle cx="55" cy="55" r="8" fill="#34A853" />
          <circle cx="55" cy="75" r="8" fill="#34A853" />
          <circle cx="55" cy="95" r="8" fill="#34A853" />

          <!-- Col 4 (Light Blue): 4 dots -->
          <circle cx="72" cy="25" r="8" fill="#4285F4" />
          <circle cx="72" cy="45" r="8" fill="#4285F4" />
          <circle cx="72" cy="65" r="8" fill="#4285F4" />
          <circle cx="72" cy="85" r="8" fill="#4285F4" />

          <!-- Col 5 (Royal Blue): 3 dots -->
          <circle cx="88" cy="35" r="8" fill="#1A73E8" />
          <circle cx="88" cy="55" r="8" fill="#1A73E8" />
          <circle cx="88" cy="75" r="8" fill="#1A73E8" />
        </svg>

        <div class="google-ai-title-wrap">
          <div class="google-letters">
            <span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>
            <span class="ai-text">AI</span>
          </div>
          <span class="plus-badge">PLUS</span>
        </div>
      </div>

      <div class="sub-brand-text">SUSCRIPCIÓN</div>
    </div>

    <h1 class="hero-title">12 MESES</h1>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2048, height: 2048 } });
  await page.setContent(html);
  await page.waitForTimeout(600);

  const testOutput = path.resolve(__dirname, 'google_ai_plus_candidate.jpg');
  await page.screenshot({ path: testOutput, type: 'jpeg', quality: 96 });
  console.log('Saved candidate to:', testOutput);
  await browser.close();
})();

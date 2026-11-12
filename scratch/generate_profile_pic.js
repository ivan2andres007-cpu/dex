const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });

  // 1. Exact SVG as used in the website header
  const htmlExact = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1024px;
        height: 1024px;
        background: #090a0d;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .logo-svg {
        width: 620px;
        height: 620px;
        color: #f5f6f8;
      }
    </style>
  </head>
  <body>
    <svg class="logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,3 29,26 3,26" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
      <line x1="16" y1="3" x2="16" y2="26" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 3" />
      <circle cx="16" cy="18" r="2.5" fill="#10b981" />
    </svg>
  </body>
  </html>
  `;

  await page.setContent(htmlExact);
  await page.screenshot({ path: path.join(__dirname, 'test_svg_exact.png') });
  console.log('Saved test_svg_exact.png');

  await browser.close();
})();


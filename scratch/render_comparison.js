const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  const b64orig = fs.readFileSync('scratch/capcut_original.png').toString('base64');
  const b64a = fs.readFileSync('scratch/preview_opt_a.png').toString('base64');
  const b64b = fs.readFileSync('scratch/preview_opt_b.png').toString('base64');
  const b64gemini = fs.readFileSync('imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg').toString('base64');
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #121318; color: #fff; font-family: sans-serif; padding: 30px; display: flex; gap: 20px; }
      .card { background: #1c1d24; border: 1px solid #2e303d; border-radius: 16px; padding: 16px; text-align: center; }
      img { width: 280px; height: 280px; object-fit: contain; border-radius: 12px; background: #fff; }
      .orig { width: 186px; height: 280px; }
      h3 { margin: 10px 0 5px 0; font-size: 14px; }
      p { margin: 0; font-size: 12px; color: #888; }
    </style>
  </head>
  <body>
    <div class="card">
      <img class="orig" src="data:image/png;base64,${b64orig}">
      <h3>Driffle Original (800x1200)</h3>
      <p>Original 2:3 Cover</p>
    </div>
    <div class="card">
      <img src="data:image/png;base64,${b64a}">
      <h3>Option A (1200x1200)</h3>
      <p>Direct Center on White</p>
    </div>
    <div class="card">
      <img src="data:image/png;base64,${b64b}">
      <h3>Option B (1200x1200)</h3>
      <p>Proportional Padded</p>
    </div>
    <div class="card">
      <img src="data:image/jpeg;base64,${b64gemini}">
      <h3>Reference: Gemini (2048x2048)</h3>
      <p>Existing Subscription</p>
    </div>
  </body>
  </html>`);
  
  await page.screenshot({ path: 'scratch/comparison.png' });
  await browser.close();
  console.log('Comparison screenshot saved');
})();

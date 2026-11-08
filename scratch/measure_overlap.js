const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 500, height: 600 } });
  
  const b64 = fs.readFileSync('scratch/capcut_v4_2048.png').toString('base64');
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      .product-card { width: 320px; position: relative; }
      .card-media-preview { width: 100%; aspect-ratio: 1/1; position: relative; }
      .card-preview-art { width: 100%; height: 100%; object-fit: cover; }
      .card-floating-badges {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        z-index: 2;
      }
      .card-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body style="margin:0; padding:20px;">
    <div class="product-card">
      <div class="card-media-preview">
        <img class="card-preview-art" id="art" src="data:image/png;base64,${b64}">
        <div class="card-floating-badges" id="badges">
          <span class="card-badge" id="b1">1 Mes Pro</span>
          <span class="card-badge" id="b2">Cuenta Global</span>
        </div>
      </div>
    </div>
  </body>
  </html>`);

  const bbox = await page.evaluate(() => {
    const art = document.getElementById('art').getBoundingClientRect();
    const badges = document.getElementById('badges').getBoundingClientRect();
    const b1 = document.getElementById('b1').getBoundingClientRect();
    const b2 = document.getElementById('b2').getBoundingClientRect();
    return {
      art: { width: art.width, height: art.height },
      badges: { top: badges.top - art.top, bottom: badges.bottom - art.top, left: badges.left - art.left, right: badges.right - art.left, width: badges.width, height: badges.height },
      b2: { top: b2.top - art.top, bottom: b2.bottom - art.top, left: b2.left - art.left, width: b2.width, height: b2.height }
    };
  });

  console.log('Badge measurements in 320px card:', bbox);
  console.log('In 2048px canvas equivalent:');
  const scale = 2048 / bbox.art.width;
  console.log('Badge Bottom in 2048 canvas:', bbox.badges.bottom * scale);
  console.log('Badge Left in 2048 canvas:', bbox.b2.left * scale);

  await browser.close();
})();


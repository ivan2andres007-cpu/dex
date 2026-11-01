const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <body style="background: #111; padding: 20px;">
    <svg id="s" width="38" height="38" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#121316"/>
      <g transform="translate(4.5, 4.5) scale(0.62)">
        <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#00F0FF"/>
      </g>
    </svg>
  </body>
  </html>`);
  
  const metrics = await page.evaluate(() => {
    const s = document.getElementById('s');
    const path = s.querySelector('path');
    const rect = s.querySelector('rect');
    const pr = path.getBoundingClientRect();
    const rr = rect.getBoundingClientRect();
    return { path: pr, rect: rr };
  });
  console.log('SVG metrics:', metrics);
  await page.screenshot({ path: 'scratch/icon_test.png' });
  await browser.close();
})();

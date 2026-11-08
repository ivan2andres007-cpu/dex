const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 500, height: 500 } });
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:#fff; display:flex; align-items:center; justify-content:center; height:100vh;">
      <svg width="200" height="200" viewBox="0 0 25 24" fill="none">
        <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#000000"/>
      </svg>
    </body>
    </html>
  `);
  
  await page.screenshot({ path: 'scratch/test_capcut_svg.png' });
  await browser.close();
  console.log('Rendered test_capcut_svg.png');
})();


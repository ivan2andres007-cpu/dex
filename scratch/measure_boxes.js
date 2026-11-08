const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 2048, height: 2048 } });

  // Load the v4 html
  const fs = require('fs');
  const code = fs.readFileSync('scratch/render_capcut_v4.js', 'utf8');
  const htmlMatch = code.match(/const html = `([\s\S]*?)`;/);
  await page.setContent(htmlMatch[1]);

  const boxes = await page.evaluate(() => {
    const branding = document.querySelector('.header-branding').getBoundingClientRect();
    const title = document.querySelector('.hero-title').getBoundingClientRect();
    const pill = document.querySelector('.spec-pill').getBoundingClientRect();
    const laptop = document.querySelector('.showcase-stage').getBoundingClientRect();
    return { branding, title, pill, laptop };
  });

  console.log('Element bounding boxes in 2048 canvas:', boxes);
  await browser.close();
})();


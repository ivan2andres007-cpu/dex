const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const b64 = fs.readFileSync('scratch/capcut_original.png').toString('base64');
  const sections = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await new Promise(r => img.onload = r);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Scan horizontal lines to find bands of content
    const rowCounts = [];
    for (let y = 0; y < canvas.height; y++) {
      let nonWhite = 0;
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
        // check if not pure white
        if (a > 10 && (r < 250 || g < 250 || b < 250)) {
          nonWhite++;
        }
      }
      rowCounts.push(nonWhite);
    }
    
    // Group into clusters
    const clusters = [];
    let current = null;
    for (let y = 0; y < rowCounts.length; y++) {
      if (rowCounts[y] > 5) {
        if (!current) current = { start: y, end: y, maxNonWhite: rowCounts[y] };
        else {
          current.end = y;
          current.maxNonWhite = Math.max(current.maxNonWhite, rowCounts[y]);
        }
      } else {
        if (current) {
          clusters.push(current);
          current = null;
        }
      }
    }
    if (current) clusters.push(current);
    
    return clusters;
  }, b64);
  
  console.log('Sections found:', sections);
  await browser.close();
})();


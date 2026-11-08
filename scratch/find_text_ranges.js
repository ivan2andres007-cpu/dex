const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  
  const textInfo = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Find pure white / bright pixels (text usually has high luminance > 240)
    const data = ctx.getImageData(0, 0, 800, 1200).data;
    const whiteRows = [];
    for (let y = 0; y < 1200; y++) {
      let whiteCount = 0;
      for (let x = 0; x < 800; x++) {
        const idx = (y * 800 + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r > 240 && g > 240 && b > 240) whiteCount++;
      }
      if (whiteCount > 30) whiteRows.push(y);
    }
    return whiteRows;
  }, b64);

  // Group continuous white row ranges
  const ranges = [];
  let start = null, prev = null;
  for (const y of textInfo) {
    if (start === null) { start = y; prev = y; }
    else if (y === prev + 1) { prev = y; }
    else {
      if (prev - start > 5) ranges.push([start, prev]);
      start = y; prev = y;
    }
  }
  if (start !== null && prev - start > 5) ranges.push([start, prev]);
  console.log('White pixel clusters (Y ranges):', ranges);
  await browser.close();
})();


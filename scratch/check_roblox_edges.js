const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const buf = fs.readFileSync('scratch/roblox_original.jpg');
  const dataUrl = `data:image/webp;base64,${buf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body><img id="img" src="${dataUrl}"><canvas id="c"></canvas></body></html>`);
  
  const edgeAnalysis = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Check left edge (x=0) and right edge (x=w-1) from y=0 to y=h
    const leftEdge = [];
    const rightEdge = [];
    for (let y = 0; y < canvas.height; y += 40) {
      const pL = ctx.getImageData(0, y, 1, 1).data;
      const pR = ctx.getImageData(canvas.width - 1, y, 1, 1).data;
      leftEdge.push({ y, l: [pL[0], pL[1], pL[2]] });
      rightEdge.push({ y, r: [pR[0], pR[1], pR[2]] });
    }
    return { leftEdge, rightEdge };
  });
  
  console.log('Edge sample left:', edgeAnalysis.leftEdge);
  console.log('Edge sample right:', edgeAnalysis.rightEdge);
  await browser.close();
})();

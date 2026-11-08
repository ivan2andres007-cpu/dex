const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 1200 } });
  const b64 = fs.readFileSync('scratch/discord_driffle_cover.png').toString('base64');
  await page.setContent(`<body style="margin:0"><img src="data:image/webp;base64,${b64}" style="width:800px;height:1200px;display:block;" /></body>`);
  await page.screenshot({ path: 'scratch/driffle_cover_view.png' });
  
  // Also let's inspect where characters/text are by analyzing brightness/variation
  const analysis = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/webp;base64,' + b64;
    await new Promise(r => img.onload = r);
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Scan vertical slices: top (0-300), mid-top (300-600), mid-bot (600-900), bot (900-1200)
    // Find average colors
    const getAvg = (y1, y2) => {
      const data = ctx.getImageData(0, y1, 800, y2 - y1).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i+1]; b += data[i+2];
      }
      const count = data.length / 4;
      return { r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) };
    };

    return {
      top: getAvg(0, 300),
      midTop: getAvg(300, 600),
      midBot: getAvg(600, 900),
      bot: getAvg(900, 1200)
    };
  }, b64);

  console.log('Vertical slices analysis:', analysis);
  await browser.close();
})();


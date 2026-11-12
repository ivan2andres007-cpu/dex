const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const userImgB64 = fs.readFileSync('C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a/.user_uploaded/media_1794443309783_5b7c91e7.png').toString('base64');

  const analysis = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Sample vertical center line
        const cx = Math.round(img.width / 2);
        const centerPixels = [];
        for (let y = 0; y < img.height; y++) {
          const pixel = ctx.getImageData(cx, y, 1, 1).data;
          centerPixels.push({ y, r: pixel[0], g: pixel[1], b: pixel[2] });
        }

        // Find segments along center line
        const segments = [];
        let currentType = 'dark';
        let startY = 0;

        for (let y = 0; y < img.height; y++) {
          const p = centerPixels[y];
          let type = 'dark';
          if (p.g > 120 && p.r < 100) type = 'green';
          else if (p.r > 120 && p.g > 120 && p.b > 120) type = 'white';

          if (type !== currentType) {
            segments.push({ type: currentType, startY, endY: y - 1, count: y - startY });
            currentType = type;
            startY = y;
          }
        }
        segments.push({ type: currentType, startY, endY: img.height - 1, count: img.height - startY });

        resolve({
          width: img.width,
          height: img.height,
          segments: segments.filter(s => s.type !== 'dark' || s.count > 3)
        });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, userImgB64);

  console.log('User image analysis:', JSON.stringify(analysis, null, 2));
  await browser.close();
})();


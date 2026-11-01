const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  // Create square images in high resolution
  // Let's create:
  // Option 1: 1200x1200 direct center (top margin 64px, bottom 73px)
  // Option 2: 1200x1200 with 8% padding (scaled 0.88, perfectly balanced like Gemini)
  // Option 3: 2048x2048 (ultra crisp retina matching Gemini resolution)
  
  await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; background: #000; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <canvas id="c"></canvas>
  </body>
  </html>`);

  const generateSquare = async (scale, targetSize, filename) => {
    const rawBuf = fs.readFileSync('scratch/capcut_original.png');
    const dataUrl = `data:image/png;base64,${rawBuf.toString('base64')}`;
    
    const base64Out = await page.evaluate(async ({ dataUrl, scale, targetSize }) => {
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => img.onload = r);
      
      const canvas = document.getElementById('c');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      
      // Fill pure white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);
      
      // Calculate scaled dimensions
      const drawW = (img.naturalWidth * (targetSize / 1200)) * scale;
      const drawH = (img.naturalHeight * (targetSize / 1200)) * scale;
      const drawX = (targetSize - drawW) / 2;
      const drawY = (targetSize - drawH) / 2;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      
      return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    }, { dataUrl, scale, targetSize });
    
    fs.writeFileSync(filename, Buffer.from(base64Out, 'base64'));
    console.log('Saved', filename);
  };

  await generateSquare(1.0, 1200, 'scratch/capcut_opt1_direct.png');
  await generateSquare(0.92, 1200, 'scratch/capcut_opt2_balanced.png');
  await generateSquare(0.85, 1200, 'scratch/capcut_opt3_relaxed.png');
  await generateSquare(0.92, 2048, 'scratch/capcut_2048_retina.png');

  await browser.close();
  console.log('Generated all options');
})();

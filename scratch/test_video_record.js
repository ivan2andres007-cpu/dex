const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const videoDir = path.resolve(__dirname, 'videos');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1080, height: 1920 }
    },
    viewport: { width: 1080, height: 1920 }
  });

  const page = await context.newPage();

  // Test simple page to check if recordVideo works
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { width: 1080px; height: 1920px; background: #0a0a0a; color: white; display: flex; align-items: center; justify-content: center; font-size: 60px; font-family: sans-serif; }
        .box { width: 200px; height: 200px; background: #10b981; border-radius: 50%; animation: pulse 1s infinite alternate; }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.5); } }
      </style>
    </head>
    <body>
      <div class="box"></div>
    </body>
    </html>
  `);

  await page.waitForTimeout(3000);
  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir);
  console.log('Video files recorded:', files);
})();


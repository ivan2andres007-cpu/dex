const { chromium } = require('playwright');
const fs = require('fs');

const images = [
  'media_1794875221653_f09f6325.jpg',
  'media_1794875229450_2f86f0b5.jpg',
  'media_1794875241942_74ba4085.jpg',
  'media_1794875252943_9f471747.jpg',
  'media_1794875282518_ad52cb16.jpg',
  'media_1794875290533_94d4af49.jpg'
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a/.user_uploaded/';

  for (const imgName of images) {
    const fullPath = baseDir + imgName;
    const stats = fs.statSync(fullPath);
    await page.goto('file:///' + fullPath);
    const dims = await page.evaluate(() => {
      const img = document.querySelector('img');
      return { w: img.naturalWidth, h: img.naturalHeight };
    });
    console.log(`${imgName}: ${dims.w}x${dims.h}, size: ${stats.size} bytes`);
  }

  await browser.close();
})();

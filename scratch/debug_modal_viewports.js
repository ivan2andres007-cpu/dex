const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  
  const viewports = [
    { w: 1366, h: 768, name: '768p' },
    { w: 1280, h: 650, name: '650p' },
    { w: 1024, h: 600, name: '600p' },
    { w: 1440, h: 900, name: '900p' }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'));
    await page.waitForTimeout(500);

    // Open Assetto Corsa modal
    await page.locator('.product-card[data-id="assetto-corsa-pc-steam"]').locator('.card-media-preview').click();
    await page.waitForSelector('#productModal:visible');
    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const modal = document.getElementById('productModal');
      const container = document.querySelector('.modal-carousel-container');
      const track = document.querySelector('.modal-carousel-track');
      const slide = document.querySelector('.modal-carousel-slide');
      const img = document.querySelector('.modal-carousel-img');

      function getInfo(el) {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          rect: { w: rect.width, h: rect.height, top: rect.top, bottom: rect.bottom },
          aspectRatio: cs.aspectRatio,
          maxHeight: cs.maxHeight,
          height: cs.height,
          width: cs.width,
          objectFit: cs.objectFit,
          padding: cs.padding
        };
      }

      return {
        viewportH: window.innerHeight,
        container: getInfo(container),
        track: getInfo(track),
        slide: getInfo(slide),
        img: getInfo(img)
      };
    });

    console.log(`=== Viewport ${vp.name} (${vp.w}x${vp.h}) ===`);
    console.log(JSON.stringify(data, null, 2));

    await page.screenshot({ path: `scratch/assetto_modal_${vp.name}.png` });
    await page.close();
  }

  await browser.close();
})();


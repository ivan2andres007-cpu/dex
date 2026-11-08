const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file://' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.waitForTimeout(1000);
  
  // Click on Assetto Corsa
  await page.locator('.product-card[data-id="assetto-corsa-pc-steam"]').locator('.card-media-preview').click();
  await page.waitForSelector('#productModal:visible');
  await page.waitForTimeout(600);
  
  const box = await page.locator('.modal-gallery-layout').boundingBox();
  const containerBox = await page.locator('.modal-carousel-container').boundingBox();
  const slideBox = await page.locator('.modal-carousel-slide').boundingBox();
  const imgBox = await page.locator('.modal-carousel-img').boundingBox();
  
  console.log('galleryLayout box:', box);
  console.log('container box:', containerBox);
  console.log('slide box:', slideBox);
  console.log('img box:', imgBox);
  
  await page.screenshot({ path: 'scratch/assetto_modal_inspect.png' });
  await browser.close();
})();


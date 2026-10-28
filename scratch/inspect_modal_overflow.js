const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await page.goto('http://localhost:3000');
  
  // Switch to worst case
  await page.click('button[data-dataset="worst"]');
  await page.waitForTimeout(200);

  // Open modal
  await page.evaluate(() => {
    openProductDetails('worst-case-enterprise-gcp');
  });
  await page.waitForTimeout(400);

  const overflowElements = await page.evaluate(() => {
    const modal = document.getElementById('productModal');
    const modalWidth = modal.clientWidth;
    const overflowing = [];

    const allEls = modal.querySelectorAll('*');
    allEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (rect.width > modalWidth || el.scrollWidth > modalWidth) {
        overflowing.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
          rectWidth: rect.width,
          modalWidth: modalWidth,
          text: (el.textContent || '').trim().substring(0, 50)
        });
      }
    });

    return overflowing;
  });

  console.log('Overflowing elements inside modal at 320px:', overflowElements);
  await browser.close();
})();

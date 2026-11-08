const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const tier of ['bronze', 'silver', 'gold', 'grand']) {
    const b64 = fs.readFileSync(`scratch/steam_${tier}_cover.png`).toString('base64');
    const dims = await page.evaluate(async (b) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b;
      await new Promise(r => img.onload = r);
      return { width: img.naturalWidth, height: img.naturalHeight };
    }, b64);

    const data = JSON.parse(fs.readFileSync(`scratch/steam_${tier}_data.json`, 'utf8'));
    console.log(`\n=== TIER: ${tier.toUpperCase()} ===`);
    console.log('Image dimensions:', dims);
    console.log('Product Name:', data.name);
    console.log('Price Offers:', data.offers ? data.offers.slice(0, 3).map(o => ({ seller: o.storeName, price: o.price })) : 'none');
    console.log('Notice:', data.notice);
    console.log('Description:\n', data.description ? data.description.replace(/<[^>]+>/g, ' ').slice(0, 300) : 'none');
  }

  await browser.close();
})();


const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  console.log('Navigating to store search...');
  await page.goto('https://driffle.com/store?q=Random%20Steam%20Game', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const cards = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('a[href*="-p"]'));
    return list.map(a => ({
      title: a.querySelector('h2, h3, span, div')?.textContent?.trim() || a.textContent.trim().slice(0, 80),
      href: a.href,
      img: a.querySelector('img')?.src
    }));
  });

  console.log('Found cards count:', cards.length);
  cards.forEach(c => console.log(c.title, c.href, c.img));
  fs.writeFileSync('scratch/random_steam_cards.json', JSON.stringify(cards, null, 2));

  await browser.close();
})();


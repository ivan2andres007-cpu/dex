const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  console.log('Navigating to driffle...');
  await page.goto('https://driffle.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Type in search bar
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
  if (await searchInput.count()) {
    await searchInput.first().fill('1 Random Steam Game');
    await page.waitForTimeout(2000);
    await searchInput.first().press('Enter');
    await page.waitForTimeout(4000);
    console.log('Current URL after search:', page.url());

    // Extract links
    const results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="-p"]'));
      return links.map(a => ({
        text: a.textContent.trim().replace(/\s+/g, ' '),
        href: a.href
      }));
    });
    console.log('Found product links:', results.slice(0, 15));
    fs.writeFileSync('scratch/driffle_search_links.json', JSON.stringify(results, null, 2));
  } else {
    console.log('No search input found');
  }

  await browser.close();
})();


const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop screenshot & audit
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();
  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  
  console.log('Navigating to', filePath);
  await desktopPage.goto(filePath, { waitUntil: 'networkidle' });
  
  // Take full desktop screenshot
  await desktopPage.screenshot({
    path: path.resolve(__dirname, 'screenshots/audit_desktop_1440.png'),
    fullPage: true
  });
  console.log('Desktop screenshot saved');

  // Audit DOM in Desktop
  const desktopFindings = await desktopPage.evaluate(() => {
    const results = {
      glows: [],
      allCaps: [],
      tinyText: [],
      undersizedUi: [],
      clippedContainers: [],
      hero: {},
      catalog: {},
      physical: {},
      plans: {}
    };

    // Check all elements for box-shadow / text-shadow glows
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const cs = window.getComputedStyle(el);
      const bs = cs.boxShadow;
      const ts = cs.textShadow;
      
      // Look for colored glows (#10b981 / rgb(16, 185, 129), #66c0f4 / rgb(102, 192, 244))
      if (bs && bs !== 'none') {
        if (bs.includes('16, 185, 129') || bs.includes('102, 192, 244') || bs.includes('rgba(16, 185, 129') || bs.includes('rgba(102, 192, 244')) {
          results.glows.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            boxShadow: bs,
            outerHTML: el.outerHTML.slice(0, 150)
          });
        }
      }
      if (ts && ts !== 'none') {
        if (ts.includes('16, 185, 129') || ts.includes('102, 192, 244')) {
          results.glows.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            textShadow: ts,
            outerHTML: el.outerHTML.slice(0, 150)
          });
        }
      }

      // Check for all-caps body text
      if (cs.textTransform === 'uppercase') {
        const text = el.innerText ? el.innerText.trim() : '';
        if (text.length >= 25) {
          results.allCaps.push({
            tag: el.tagName,
            className: el.className,
            textLength: text.length,
            text: text.slice(0, 80),
            fontSize: cs.fontSize
          });
        }
      }

      // Check font-size below 12px
      const fsPx = parseFloat(cs.fontSize);
      if (fsPx > 0 && fsPx < 12 && el.children.length === 0 && el.innerText && el.innerText.trim().length > 0) {
        results.tinyText.push({
          tag: el.tagName,
          className: el.className,
          fontSizePx: fsPx,
          fontSize: cs.fontSize,
          text: el.innerText.trim().slice(0, 60),
          parentClass: el.parentElement ? el.parentElement.className : ''
        });
      }
    });

    // Check clipped overflow containers
    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden') {
        const posChildren = el.querySelectorAll(':scope > [style*="position: absolute"], :scope > [style*="position: fixed"], :scope > .absolute, :scope > [class*="badge"]');
        if (posChildren.length > 0) {
          results.clippedContainers.push({
            tag: el.tagName,
            className: el.className,
            overflow: cs.overflow,
            childCount: posChildren.length
          });
        }
      }
    });

    // Hero section details
    const hero = document.querySelector('.hero, #hero, header, section[class*="hero"]');
    if (hero) {
      results.hero = {
        exists: true,
        tag: hero.tagName,
        className: hero.className,
        title: hero.querySelector('h1')?.innerText?.trim(),
        sub: hero.querySelector('p')?.innerText?.trim(),
        buttons: Array.from(hero.querySelectorAll('a, button')).map(b => ({
          text: b.innerText.trim(),
          class: b.className,
          href: b.getAttribute('href')
        }))
      };
    }

    // Catalog grid cards
    const cards = document.querySelectorAll('.product-card, .catalog-card, [data-category]');
    results.catalog = {
      cardCount: cards.length,
      sampleCards: Array.from(cards).slice(0, 5).map(c => ({
        id: c.getAttribute('data-product-id') || c.id,
        title: c.querySelector('.card-title, h3, h4')?.innerText?.trim(),
        price: c.querySelector('.card-price, .price, .badge-price')?.innerText?.trim(),
        badges: Array.from(c.querySelectorAll('.card-badge, .badge')).map(b => b.innerText.trim()),
        hasFloatingElements: c.querySelectorAll('.card-floating-badges, .card-image-wrap .badge').length > 0
      }))
    };

    // Physical articles banner & modal
    const physBanner = document.querySelector('.physical-banner, .physical-card, #physicalBanner, [onclick*="physical"], [data-target*="physical"]');
    const physModal = document.querySelector('#physicalModal, .physical-modal, [id*="physical"]');
    results.physical = {
      bannerFound: !!physBanner,
      bannerClass: physBanner?.className,
      bannerText: physBanner?.innerText?.slice(0, 100),
      modalFound: !!physModal,
      modalClass: physModal?.className
    };

    // Web dev plans
    const devPlans = document.querySelectorAll('.plan-card, .agency-card, .service-card, .pricing-card');
    results.plans = {
      count: devPlans.length,
      plans: Array.from(devPlans).map(p => ({
        name: p.querySelector('h3, h4, .plan-title')?.innerText?.trim(),
        price: p.querySelector('.plan-price, .price')?.innerText?.trim(),
        features: Array.from(p.querySelectorAll('li, .feature')).map(f => f.innerText.trim())
      }))
    };

    return results;
  });

  fs.writeFileSync(path.resolve(__dirname, 'desktop_evidence.json'), JSON.stringify(desktopFindings, null, 2));
  console.log('Desktop evidence saved');

  // 2. Mobile screenshot & audit
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(filePath, { waitUntil: 'networkidle' });
  
  await mobilePage.screenshot({
    path: path.resolve(__dirname, 'screenshots/audit_mobile_375.png'),
    fullPage: true
  });
  console.log('Mobile screenshot saved');

  const mobileFindings = await mobilePage.evaluate(() => {
    const results = {
      tinyTextMobile: [],
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth
    };

    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const cs = window.getComputedStyle(el);
      const fsPx = parseFloat(cs.fontSize);
      if (fsPx > 0 && fsPx < 12 && el.children.length === 0 && el.innerText && el.innerText.trim().length > 0) {
        results.tinyTextMobile.push({
          tag: el.tagName,
          className: el.className,
          fontSizePx: fsPx,
          fontSize: cs.fontSize,
          text: el.innerText.trim().slice(0, 60),
          parentClass: el.parentElement ? el.parentElement.className : ''
        });
      }
    });

    return results;
  });

  fs.writeFileSync(path.resolve(__dirname, 'mobile_evidence.json'), JSON.stringify(mobileFindings, null, 2));
  console.log('Mobile evidence saved');

  await browser.close();
})();

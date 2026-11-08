const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Function to compute relative luminance and contrast ratio
  const getContrastRatio = (fgRgb, bgRgb) => {
    const parse = (c) => {
      const match = c.match(/\d+(\.\d+)?/g);
      if (!match) return [0, 0, 0];
      return match.slice(0, 3).map(v => {
        let val = parseFloat(v) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
    };
    const [r1, g1, b1] = parse(fgRgb);
    const [r2, g2, b2] = parse(bgRgb);
    const l1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
    const l2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  };

  const detailedAudit = await page.evaluate(() => {
    const data = {
      hero: {},
      catalog: {},
      physical: {},
      agency: {},
      modals: [],
      zIndexes: []
    };

    // 1. HERO SECTION
    const heroSection = document.querySelector('.hero-section, section.hero, .hero') || document.querySelector('main > section:first-of-type');
    if (heroSection) {
      const cs = window.getComputedStyle(heroSection);
      const title = heroSection.querySelector('h1');
      const subtitle = heroSection.querySelector('p');
      const ctas = Array.from(heroSection.querySelectorAll('a, button')).map(b => ({
        tag: b.tagName,
        text: b.innerText.trim().replace(/\s+/g, ' '),
        className: b.className,
        color: window.getComputedStyle(b).color,
        bg: window.getComputedStyle(b).backgroundColor,
        fontSize: window.getComputedStyle(b).fontSize
      }));
      const badges = Array.from(heroSection.querySelectorAll('.badge, .pill, [class*="badge"], [class*="pill"], .trust-badge, .hero-tag')).map(b => ({
        text: b.innerText.trim(),
        className: b.className,
        fontSize: window.getComputedStyle(b).fontSize,
        color: window.getComputedStyle(b).color,
        bg: window.getComputedStyle(b).backgroundColor
      }));

      data.hero = {
        found: true,
        tag: heroSection.tagName,
        className: heroSection.className,
        title: title ? {
          text: title.innerText.trim(),
          fontSize: window.getComputedStyle(title).fontSize,
          fontWeight: window.getComputedStyle(title).fontWeight,
          lineHeight: window.getComputedStyle(title).lineHeight,
          color: window.getComputedStyle(title).color
        } : null,
        subtitle: subtitle ? {
          text: subtitle.innerText.trim(),
          fontSize: window.getComputedStyle(subtitle).fontSize,
          color: window.getComputedStyle(subtitle).color
        } : null,
        ctas,
        badges,
        padding: cs.padding,
        bg: cs.backgroundColor
      };
    }

    // 2. DIGITAL CATALOG GRID
    const catalogSection = document.querySelector('#catalogo, .catalog-section, [id*="catalog"]');
    const cards = document.querySelectorAll('.product-card');
    const filterTabs = document.querySelectorAll('.category-tab, .tab-btn, .filter-chip, [role="tab"]');

    data.catalog = {
      sectionFound: !!catalogSection,
      totalCardsRendered: cards.length,
      filterTabs: Array.from(filterTabs).map(t => ({
        text: t.innerText.trim(),
        active: t.classList.contains('active') || t.getAttribute('aria-selected') === 'true',
        className: t.className
      })),
      cardDetails: Array.from(cards).map((c, i) => {
        const titleEl = c.querySelector('.card-title, h3, h4');
        const priceEl = c.querySelector('.price-main-val, .card-price, .price');
        const originalPriceEl = c.querySelector('.price-original-val, .original-price');
        const discountEl = c.querySelector('.discount-badge');
        const floatingBadges = Array.from(c.querySelectorAll('.card-floating-badges .card-badge, .card-badge')).map(b => ({
          text: b.innerText.trim(),
          className: b.className,
          fontSize: window.getComputedStyle(b).fontSize,
          color: window.getComputedStyle(b).color,
          bg: window.getComputedStyle(b).backgroundColor
        }));
        const buttons = Array.from(c.querySelectorAll('button, a.btn')).map(b => ({
          text: b.innerText.trim().replace(/\s+/g, ' '),
          className: b.className,
          fontSize: window.getComputedStyle(b).fontSize,
          boxShadow: window.getComputedStyle(b).boxShadow
        }));
        const stockEl = c.querySelector('.stock-indicator, .stock-count-text, .sold-out-chip');

        return {
          index: i,
          title: titleEl ? titleEl.innerText.trim() : 'N/A',
          price: priceEl ? priceEl.innerText.trim() : 'N/A',
          originalPrice: originalPriceEl ? originalPriceEl.innerText.trim() : null,
          discount: discountEl ? discountEl.innerText.trim() : null,
          stockText: stockEl ? stockEl.innerText.trim() : null,
          floatingBadges,
          buttons,
          isOutOfStock: c.classList.contains('is-out-of-stock')
        };
      })
    };

    // 3. PHYSICAL ARTICLES BANNER & MODAL
    const physSection = document.querySelector('#articulos-fisicos, .physical-section, [data-section="physical"]');
    const physCards = document.querySelectorAll('.physical-card, .physical-item');
    const physModal = document.querySelector('#physicalCatalogModal, #physicalModal, .physical-modal');

    data.physical = {
      sectionFound: !!physSection,
      sectionTitle: physSection?.querySelector('h2, .section-title')?.innerText?.trim(),
      cardCount: physCards.length,
      cards: Array.from(physCards).map(pc => ({
        title: pc.querySelector('.physical-card-title, h3')?.innerText?.trim(),
        price: pc.querySelector('.physical-card-price, .price')?.innerText?.trim(),
        badges: Array.from(pc.querySelectorAll('.card-badge, .badge, .physical-card-badge')).map(b => b.innerText.trim()),
        stock: pc.querySelector('.physical-card-stock')?.innerText?.trim(),
        button: pc.querySelector('button, a')?.innerText?.trim()
      })),
      modalFound: !!physModal,
      modalId: physModal?.id,
      modalClass: physModal?.className,
      modalRole: physModal?.getAttribute('role'),
      modalAriaHidden: physModal?.getAttribute('aria-hidden')
    };

    // 4. WEB DEVELOPMENT PLANS (AGENCIA)
    const agencySection = document.querySelector('#agencia, .agency-section, #servicios');
    const agencyCards = document.querySelectorAll('.agency-card, .plan-card');
    const agencyTabs = document.querySelectorAll('.agency-tab-btn, .plan-tab');

    data.agency = {
      sectionFound: !!agencySection,
      sectionTitle: agencySection?.querySelector('h2, .section-title')?.innerText?.trim(),
      tabs: Array.from(agencyTabs).map(t => ({
        text: t.innerText.trim(),
        active: t.classList.contains('active'),
        controls: t.getAttribute('aria-controls')
      })),
      plans: Array.from(agencyCards).map(p => {
        const title = p.querySelector('.agency-pkg-name, h3');
        const badge = p.querySelector('.card-badge, .badge');
        const price = p.querySelector('.agency-price-value, .price');
        const features = Array.from(p.querySelectorAll('li, .agency-feature-item')).map(f => f.innerText.trim().replace(/\s+/g, ' '));
        const cta = p.querySelector('a, button');

        return {
          id: p.id,
          name: title?.innerText?.trim(),
          badge: badge ? {
            text: badge.innerText.trim(),
            className: badge.className,
            fontSize: window.getComputedStyle(badge).fontSize
          } : null,
          price: price?.innerText?.trim(),
          featuresCount: features.length,
          features: features,
          ctaText: cta?.innerText?.trim(),
          ctaClass: cta?.className,
          isFeatured: p.classList.contains('featured-package') || p.classList.contains('featured')
        };
      })
    };

    // Check all modals in DOM
    const allModals = document.querySelectorAll('.modal, .modal-backdrop, [role="dialog"], [id*="modal"], [id*="Modal"]');
    data.modals = Array.from(allModals).map(m => ({
      id: m.id,
      className: m.className,
      role: m.getAttribute('role'),
      ariaModal: m.getAttribute('aria-modal'),
      zIndex: window.getComputedStyle(m).zIndex,
      display: window.getComputedStyle(m).display,
      visibility: window.getComputedStyle(m).visibility
    }));

    // Find highest z-indices
    const elementsWithZ = [];
    document.querySelectorAll('*').forEach(el => {
      const z = window.getComputedStyle(el).zIndex;
      if (z && z !== 'auto') {
        const val = parseInt(z);
        if (!isNaN(val) && val >= 50) {
          elementsWithZ.push({
            tag: el.tagName,
            id: el.id,
            className: el.className,
            zIndex: val
          });
        }
      }
    });
    data.zIndexes = elementsWithZ.sort((a, b) => b.zIndex - a.zIndex).slice(0, 15);

    return data;
  });

  fs.writeFileSync(path.resolve(__dirname, 'detailed_dom_evidence.json'), JSON.stringify(detailedAudit, null, 2));
  console.log('Detailed DOM evidence saved successfully.');

  await browser.close();
})();

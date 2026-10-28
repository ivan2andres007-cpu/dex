const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace using specific contextual regexes or normalized lines
const rules = [
  {
    regex: /(\.cart-trigger-btn\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.mobile-nav-link\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.btn-primary\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.btn-secondary\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.btn-whatsapp-hero\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.catalog-search-input\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: border-color var(--transition-snappy), background-color var(--transition-snappy), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.search-clear-btn\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.filter-pill\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.catalog-sort-select\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy);'
  },
  {
    regex: /(\.media-tap-hint\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: opacity var(--transition-snappy), transform var(--transition-snappy);'
  },
  {
    regex: /(\.btn-add-cart\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.btn-direct-buy\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.btn-open-catalog-header\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.btn-phys-details\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.btn-phys-cart\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.btn-explore-full\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.phys-filter-pill\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.agency-card\s*\{[^}]*?)transition:\s*all\s*var\(--transition-smooth\);/s,
    replace: '$1transition: border-color var(--transition-smooth), transform var(--transition-smooth), box-shadow var(--transition-smooth);'
  },
  {
    regex: /(\.btn-agency-quote\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.btn-coming-soon-suggest\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.drawer-close-btn\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.reward-icon-wrap\s*\{[^}]*?)transition:\s*all\s*var\(--transition-smooth\);/s,
    replace: '$1transition: background-color var(--transition-smooth), border-color var(--transition-smooth), color var(--transition-smooth), transform var(--transition-smooth);'
  },
  {
    regex: /(\.btn-checkout-whatsapp\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out), box-shadow var(--transition-snappy);'
  },
  {
    regex: /(\.carousel-nav-btn\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.modal-carousel-dot\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: width var(--transition-snappy), background-color var(--transition-snappy);'
  },
  {
    regex: /(\.btn-phys-modal-buy\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.zero-chip-btn\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 120ms var(--ease-out);'
  },
  {
    regex: /(\.btn-whatsapp-query\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), border-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  },
  {
    regex: /(\.phys-card-btn-buy\s*\{[^}]*?)transition:\s*all\s*var\(--transition-snappy\);/s,
    replace: '$1transition: background-color var(--transition-snappy), color var(--transition-snappy), transform 140ms var(--ease-out);'
  }
];

let applied = 0;
rules.forEach((r, i) => {
  if (r.regex.test(html)) {
    html = html.replace(r.regex, r.replace);
    applied++;
  } else {
    console.log(`Rule ${i + 1} did not match.`);
  }
});

console.log(`Applied ${applied} of ${rules.length} regex transition replacements.`);

// Check how many transition: all remain
const remaining = (html.match(/transition:\s*all/g) || []).length;
console.log(`Remaining transition: all in file: ${remaining}`);

fs.writeFileSync('index.html', html, 'utf8');

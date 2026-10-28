const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Meta theme-color per color scheme
html = html.replace(
  '<meta name="theme-color" content="#090a0d">',
  '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#090a0d">\n  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#090a0d">'
);

// 2. Emil Kowalski Easing tokens in :root
const oldTransitionTokens = `      /* Snappy Apple Springs & Transitions */
      --transition-snappy: 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      --transition-smooth: 0.32s cubic-bezier(0.16, 1, 0.3, 1);`;

const newTransitionTokens = `      /* Emil Kowalski Craft Easing Curves (animations.dev / STANDARDS.md) */
      --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
      --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
      --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --duration-press: 140ms;
      --duration-ui: 200ms;
      --duration-drawer: 320ms;

      /* Snappy Apple Springs & Transitions (Powered by --ease-out & --ease-spring) */
      --transition-snappy: 0.18s cubic-bezier(0.23, 1, 0.32, 1);
      --transition-smooth: 0.32s cubic-bezier(0.23, 1, 0.32, 1);`;

html = html.replace(oldTransitionTokens, newTransitionTokens);

// 3. Overscroll behavior none on html & body
html = html.replace(
  '    html {\n      scroll-behavior: smooth;\n      color-scheme: dark;\n      font-size: 100%;\n      -webkit-tap-highlight-color: transparent;\n      -webkit-text-size-adjust: 100%;\n    }',
  '    html {\n      scroll-behavior: smooth;\n      color-scheme: dark;\n      font-size: 100%;\n      -webkit-tap-highlight-color: transparent;\n      -webkit-text-size-adjust: 100%;\n      overscroll-behavior: none;\n    }'
);

html = html.replace(
  '      overflow-x: hidden;\n      min-height: 100vh;\n      min-height: 100dvh;',
  '      overflow-x: hidden;\n      overscroll-behavior: none;\n      min-height: 100vh;\n      min-height: 100dvh;'
);

// 4. Physical search input mobile font size (fix 0.82rem zoom defect)
html = html.replace(
  '        font-size: 0.82rem !important;',
  '        font-size: var(--text-title-sm) !important; /* 16.8px to prevent iOS Safari auto-zoom */'
);

// Save updated index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully applied foundational meta and token updates to index.html');

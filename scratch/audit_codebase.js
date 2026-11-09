const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Check hover queries vs mobile sticky hover
const hoverMatches = html.match(/:hover\b/g) || [];
const mediaHover = html.match(/@media[^{]+hover:\s*hover/g) || [];
console.log('Total :hover mentions:', hoverMatches.length);
console.log('Total @media (hover: hover) blocks:', mediaHover.length);

// 2. Check :active feedback states
const activeStates = html.match(/:active\b/g) || [];
console.log('Total :active press feedback rules:', activeStates.length);

// 3. Check transition: all
const transitionAll = [];
html.split('\n').forEach((line, idx) => {
  if (/transition:\s*all\b/i.test(line)) {
    transitionAll.push({ line: idx + 1, content: line.trim() });
  }
});
console.log('transition: all instances:', transitionAll);

// 4. Check images attributes
const imgRegex = /<img\s+([^>]+)>/g;
let match;
let totalImgs = 0, lazyImgs = 0, asyncImgs = 0, withoutAlt = 0;
while ((match = imgRegex.exec(html)) !== null) {
  totalImgs++;
  const attrs = match[1];
  if (attrs.includes('loading="lazy"')) lazyImgs++;
  if (attrs.includes('decoding="async"')) asyncImgs++;
  if (!attrs.includes('alt="') && !attrs.includes("alt='")) withoutAlt++;
}
console.log({ totalImgs, lazyImgs, asyncImgs, withoutAlt });

// 5. Check user-select on buttons and chips
const buttons = html.match(/class=["'][^"']*(btn|pill|chip|stepper)[^"']*["']/g) || [];
console.log('Total interactive elements classes sampled:', buttons.length);

// 6. Check dialog / modal accessibility
const dialogs = html.match(/<dialog[^>]*>/g) || [];
console.log('Dialog elements:', dialogs);

// 7. Check safe-area-inset usage
const safeAreas = html.match(/env\(safe-area-inset-[^)]+\)/g) || [];
console.log('Safe area insets count:', safeAreas.length, safeAreas);


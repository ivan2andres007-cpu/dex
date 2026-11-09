const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find all classes on <svg> tags
const svgClasses = new Set();
const regex = /<svg[^>]*class=["']([^"']+)["']/g;
let match;
while ((match = regex.exec(html)) !== null) {
  match[1].split(/\s+/).forEach(c => svgClasses.add(c));
}
console.log('SVG Classes found:', Array.from(svgClasses));

// Check which of these are defined in <style>
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

Array.from(svgClasses).forEach(cls => {
  const isDefined = css.includes('.' + cls);
  console.log(cls + ' -> ' + (isDefined ? 'DEFINED in CSS' : 'MISSING in CSS'));
});


const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  ['No pkg-landing', !html.includes('id="pkg-landing"')],
  ['No pkg-ecommerce', !html.includes('id="pkg-ecommerce"')],
  ['No pkg-software', !html.includes('id="pkg-software"')],
  ['No Landing Page Pro card', !html.includes('Cotizar Landing Page')],
  ['Has studio.puntoprisma.store', html.includes('https://studio.puntoprisma.store')],
  ['Has Elevá tu presencia digital.', html.includes('Elevá tu presencia digital.')],
  ['Has — PUNTO PRISMA STUDIO', html.includes('— PUNTO PRISMA STUDIO')],
  ['Has Descubrí nuestro espacio...', html.includes('Descubrí nuestro espacio dedicado exclusivamente al desarrollo de ecosistemas web: landing pages, catálogos móviles y sistemas a medida de alto rendimiento.')],
  ['Has Explorar el Studio', html.includes('Explorar el Studio')],
  ['Has max-w-5xl', html.includes('max-w-5xl')],
  ['Has bg-[#0a0a0a]', html.includes('bg-[#0a0a0a]')],
  ['Has border-zinc-800', html.includes('border-zinc-800')],
  ['Has rounded-3xl', html.includes('rounded-3xl')],
  ['Has p-10 md:p-16', html.includes('p-10 md:p-16')],
  ['Has text-center', html.includes('text-center')]
];

let allPassed = true;
checks.forEach(([desc, passed]) => {
  console.log((passed ? '✅ PASS: ' : '❌ FAIL: ') + desc);
  if (!passed) allPassed = false;
});
if (!allPassed) process.exit(1);
console.log('All static checks passed!');


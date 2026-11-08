const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('imagenes/juegos');

const tiers = [
  { tier: 'bronze', es: 'Bronze', en: 'Bronze' },
  { tier: 'silver', es: 'Silver', en: 'Silver' },
  { tier: 'gold', es: 'Gold', en: 'Gold' }
];

for (const t of tiers) {
  const srcJpg = path.join('scratch', `steam_${t.tier}_2048.jpg`);
  const srcPng = path.join('scratch', `steam_${t.tier}_2048.png`);

  const destEsJpg = path.join(targetDir, `1 Juego Aleatorio de Steam - ${t.es} (Global) (PC) - Clave Digital.jpg`);
  const destEsPng = path.join(targetDir, `1 Juego Aleatorio de Steam - ${t.es} (Global) (PC) - Clave Digital.png`);
  const destEnJpg = path.join(targetDir, `1 Random Steam Game - ${t.en} (Global) (PC) - Steam - Digital Key.jpg`);
  const destEnPng = path.join(targetDir, `1 Random Steam Game - ${t.en} (Global) (PC) - Steam - Digital Key.png`);

  fs.copyFileSync(srcJpg, destEsJpg);
  fs.copyFileSync(srcPng, destEsPng);
  fs.copyFileSync(srcJpg, destEnJpg);
  fs.copyFileSync(srcPng, destEnPng);

  console.log(`Saved images for ${t.es}:`, {
    esJpgSize: fs.statSync(destEsJpg).size,
    esPngSize: fs.statSync(destEsPng).size
  });
}


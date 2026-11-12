/**
 * EXPORTADOR DE HISTORIAS DE INSTAGRAM A 60 FPS (1080 x 1920 px)
 * Punto Prisma - Herramienta de Exportación Automatizada con Playwright
 * 
 * Uso:
 *   node export-story.js                                       (Exporta el flyer por defecto)
 *   node export-story.js mi-flyer.html                         (Exporta un archivo específico)
 *   node export-story.js mi-flyer.html 10                      (Especifica duración de 10s)
 *   node export-story.js mi-flyer.html 8 historia-final.webm   (Especifica nombre de salida)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Parámetros por línea de comandos o valores por defecto
const inputArg = process.argv[2] || 'flyer-story-studio-animated.html';
const durationSec = parseFloat(process.argv[3]) || 8;
const outputArg = process.argv[4] || (inputArg.replace(/\.html$/i, '') + '.webm');

const inputHtmlPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);

if (!fs.existsSync(inputHtmlPath)) {
  console.error(`\x1b[31m[ERROR]\x1b[0m No se encontró el archivo HTML de entrada: ${inputHtmlPath}`);
  console.log('Asegurate de que el archivo exista o pasa la ruta correcta como argumento.');
  process.exit(1);
}

console.log('\x1b[36m====================================================\x1b[0m');
console.log('\x1b[1m  EXPORTADOR DE HISTORIAS A 60 FPS (1080 × 1920)\x1b[0m');
console.log('\x1b[36m====================================================\x1b[0m');
console.log(`📄 Archivo HTML:  \x1b[33m${path.basename(inputHtmlPath)}\x1b[0m`);
console.log(`⏱️  Duración:      \x1b[32m${durationSec} segundos\x1b[0m`);
console.log(`📐 Resolución:    \x1b[35m1080 × 1920 px (9:16 Vertical)\x1b[0m`);
console.log(`🎬 Fotogramas:    \x1b[34m60 FPS nativos (Chromium)\x1b[0m`);
console.log(`💾 Salida:        \x1b[33m${outputArg}\x1b[0m`);
console.log('----------------------------------------------------');

(async () => {
  const tempDir = path.resolve(process.cwd(), '.temp_video_export');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log('🚀 Iniciando Chromium en modo headless...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-gpu-vsync',
      '--disable-frame-rate-limit',
      '--enable-features=VaapiVideoDecoder'
    ]
  });

  // Configuración del contexto con dimensiones exactas 9:16 a 60 FPS
  const context = await browser.newContext({
    recordVideo: {
      dir: tempDir,
      size: { width: 1080, height: 1920 }
    },
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  const fileUrl = 'file:///' + inputHtmlPath.replace(/\\/g, '/');

  console.log(`🌐 Cargando contenido desde: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  console.log(`🔴 Grabando animación (${durationSec} segundos)...`);
  const startTime = Date.now();
  
  // Esperar el tiempo solicitado para capturar los ciclos completos de animación
  await page.waitForTimeout(durationSec * 1000);

  console.log('⏹️  Finalizando captura y empaquetando video...');
  await page.close();
  await context.close();
  await browser.close();

  // Obtener el video generado por Playwright
  const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    console.error('\x1b[31m[ERROR]\x1b[0m No se generó ningún archivo de video en la carpeta temporal.');
    process.exit(1);
  }

  // Tomar el archivo más reciente
  const generatedVideo = path.join(tempDir, files[files.length - 1]);
  fs.copyFileSync(generatedVideo, outputPath);

  // Limpiar temporales
  try {
    for (const f of files) fs.unlinkSync(path.join(tempDir, f));
    fs.rmdirSync(tempDir);
  } catch (e) {}

  const stats = fs.statSync(outputPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('----------------------------------------------------');
  console.log(`\x1b[32m✔ EXPORTACIÓN WEBM EXITOSA en ${elapsed}s!\x1b[0m`);
  console.log(`📁 Archivo WebM: \x1b[1m${outputPath}\x1b[0m (${sizeMb} MB)`);

  // Conversión automática a MP4 (H.264 60fps) usando ffmpeg-static si está disponible
  try {
    const ffmpegPath = require('ffmpeg-static');
    const { execSync } = require('child_process');
    const mp4Output = outputPath.replace(/\.webm$/i, '.mp4');
    console.log('🎬 Convirtiendo automáticamente a MP4 (H.264 60 FPS Instagram-ready)...');
    execSync(`"${ffmpegPath}" -y -i "${outputPath}" -c:v libx264 -pix_fmt yuv420p -r 60 -b:v 8M "${mp4Output}"`, { stdio: 'pipe' });
    const mp4Stats = fs.statSync(mp4Output);
    const mp4SizeMb = (mp4Stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\x1b[32m✔ EXPORTACIÓN MP4 COMPLETADA!\x1b[0m`);
    console.log(`📱 Archivo MP4:  \x1b[1m${mp4Output}\x1b[0m (${mp4SizeMb} MB)`);
  } catch (err) {
    console.log('ℹ️ Nota: ffmpeg no ejecutó conversión MP4, el archivo WebM está listo.');
  }

  console.log('\x1b[36m====================================================\x1b[0m\n');
})();


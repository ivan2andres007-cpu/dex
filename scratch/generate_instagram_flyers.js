const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Helper to convert local image to base64 data URI so browser loads it instantly
function toBase64(relPath) {
  const full = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(full)) return '';
  const ext = path.extname(full).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/jpeg';
  return `data:${mime};base64,` + fs.readFileSync(full).toString('base64');
}

const logoB64 = toBase64('punto-prisma-pfp.png');
const geminiB64 = toBase64('imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg');
const assettoB64 = toBase64('imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg');
const gamepadB64 = toBase64('imagenes/productos/gamepad-bluetooth-multiplataforma/1.jpg');
const headsetB64 = toBase64('imagenes/productos/auriculares-gamer-71/1.jpg');
const heroGifB64 = toBase64('black-background.gif');

// =========================================================================
// FLYER 1: DIA 1 — "ECOSISTEMA COMPLETO" (All-In-One Hub)
// =========================================================================
const htmlFlyer1 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1920px;
      background: #090a0d;
      color: #f5f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 140px 70px 140px;
    }

    /* Ambient background lighting */
    .ambient-bg {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.16) 0%, transparent 45%),
        radial-gradient(circle at 90% 65%, rgba(59, 130, 246, 0.14) 0%, transparent 50%),
        radial-gradient(circle at 50% 90%, rgba(168, 85, 247, 0.12) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    .ambient-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: 2;
    }

    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Top Brand Header */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .brand-logo-img {
      width: 74px;
      height: 74px;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .brand-text-wrap {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1.1;
    }
    .brand-tagline {
      font-size: 19px;
      color: #10b981;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-paraguay {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 20px;
      font-weight: 600;
      color: #e4e4e7;
    }

    /* Hero Headline */
    .hero-box {
      margin-top: 30px;
      margin-bottom: 25px;
    }
    .hero-eyebrow {
      display: inline-block;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #10b981;
      margin-bottom: 16px;
      background: rgba(16, 185, 129, 0.12);
      padding: 6px 18px;
      border-radius: 9999px;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .hero-headline {
      font-size: 64px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 18px;
    }
    .hero-headline span {
      background: linear-gradient(135deg, #10b981 0%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 26px;
      line-height: 1.45;
      color: #a1a1aa;
      max-width: 900px;
    }

    /* 3 Pillars Grid */
    .pillars-container {
      display: flex;
      flex-direction: column;
      gap: 22px;
      margin-bottom: 30px;
    }
    .pillar-card {
      background: rgba(18, 21, 28, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      padding: 26px 32px;
      display: flex;
      align-items: center;
      gap: 26px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
    }
    .pillar-icon-box {
      width: 80px;
      height: 80px;
      border-radius: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 36px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .p1-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3); }
    .p2-icon { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
    .p3-icon { background: rgba(168, 85, 247, 0.15); color: #c084fc; border-color: rgba(168, 85, 247, 0.3); }

    .pillar-content {
      flex: 1;
      min-width: 0;
    }
    .pillar-tag {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .p1-tag { color: #10b981; }
    .p2-tag { color: #60a5fa; }
    .p3-tag { color: #c084fc; }

    .pillar-title {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }
    .pillar-desc {
      font-size: 20px;
      color: #a1a1aa;
      line-height: 1.35;
    }
    .pillar-pill {
      font-size: 16px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      color: #f4f4f5;
      white-space: nowrap;
    }

    /* Bottom Trust & CTA Zone */
    .bottom-cta-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%), #12141a;
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 36px;
      padding: 34px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.2);
    }
    .cta-domain-pill {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: #ffffff;
      color: #090a0d;
      font-size: 32px;
      font-weight: 800;
      padding: 18px 46px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 12px 30px rgba(255, 255, 255, 0.25);
      margin-bottom: 20px;
    }
    .cta-features-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      font-size: 20px;
      color: #d4d4d8;
      font-weight: 600;
    }
    .cta-feature-dot {
      color: #10b981;
    }
  </style>
</head>
<body>
  <div class="ambient-bg"></div>
  <div class="ambient-grid"></div>

  <div class="content-wrap">
    <!-- Top Header -->
    <div class="top-header">
      <div class="brand-group">
        <img src="${logoB64}" class="brand-logo-img" alt="Punto Prisma Logo">
        <div class="brand-text-wrap">
          <div class="brand-title">Punto Prisma</div>
          <div class="brand-tagline">Tienda Digital & Studio</div>
        </div>
      </div>
      <div class="badge-paraguay">
        <span>🇵🇾</span>
        <span>Paraguay</span>
      </div>
    </div>

    <!-- Main Headline -->
    <div class="hero-box">
      <div class="hero-eyebrow">ECOSISTEMA DIGITAL Y HARDWARE</div>
      <h1 class="hero-headline">Todo lo que necesitás, <span>en un solo lugar.</span></h1>
      <p class="hero-subtitle">
        Marketplace verificado en Guaraníes (Gs.) con entrega express y un estudio dedicado a crear ecosistemas web de alto impacto.
      </p>
    </div>

    <!-- 3 Pillars -->
    <div class="pillars-container">
      <!-- Pillar 1 -->
      <div class="pillar-card">
        <div class="pillar-icon-box p1-icon">⚡</div>
        <div class="pillar-content">
          <div class="pillar-tag p1-tag">Suscripciones & Licencias</div>
          <div class="pillar-title">Google AI Pro, Steam & IA</div>
          <div class="pillar-desc">Ahorro de hasta 80% con entrega directa en 5 a 15 min vía WhatsApp.</div>
        </div>
        <div class="pillar-pill">Digital</div>
      </div>

      <!-- Pillar 2 -->
      <div class="pillar-card">
        <div class="pillar-icon-box p2-icon">🎮</div>
        <div class="pillar-content">
          <div class="pillar-tag p2-tag">Artículos Físicos en Stock</div>
          <div class="pillar-title">Hardware, Mandos & Audio</div>
          <div class="pillar-desc">Equipamiento original con garantía escrita. Envíos a todo el país.</div>
        </div>
        <div class="pillar-pill">Físico</div>
      </div>

      <!-- Pillar 3 -->
      <div class="pillar-card">
        <div class="pillar-icon-box p3-icon">✦</div>
        <div class="pillar-content">
          <div class="pillar-tag p3-tag">Punto Prisma Studio</div>
          <div class="pillar-title">Ingeniería Web Estilo Apple</div>
          <div class="pillar-desc">Landing pages, catálogos móviles y sistemas a medida de alto rendimiento.</div>
        </div>
        <div class="pillar-pill">Studio</div>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="bottom-cta-box">
      <div class="cta-domain-pill">
        <span>puntoprisma.store</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
      <div class="cta-features-row">
        <span>⚡ Entrega Inmediata</span>
        <span class="cta-feature-dot">•</span>
        <span>💳 SIPAP 0% Comisión</span>
        <span class="cta-feature-dot">•</span>
        <span>🛡️ Garantía Escrita</span>
      </div>
    </div>
  </div>
</body>
</html>
`;


// =========================================================================
// FLYER 2: DIA 2 — "DIGITAL DROPS & STOCK EN PARAGUAY" (Comercial / Vitrina)
// =========================================================================
const htmlFlyer2 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1920px;
      background: #08090c;
      color: #f5f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 140px 70px 140px;
    }

    .ambient-glow {
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0, 242, 254, 0.1) 45%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
    }

    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Header */
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-badge {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 10px 22px;
      border-radius: 9999px;
    }
    .brand-logo-mini {
      width: 38px;
      height: 38px;
      border-radius: 10px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    .flash-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(239, 68, 68, 0.16);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #f87171;
      padding: 10px 22px;
      border-radius: 9999px;
      font-size: 20px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* Headline */
    .headline-wrap {
      margin-top: 25px;
      margin-bottom: 25px;
    }
    .headline-main {
      font-size: 66px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }
    .headline-main span {
      color: #10b981;
    }
    .headline-desc {
      font-size: 26px;
      color: #a1a1aa;
      line-height: 1.4;
    }

    /* Product Showcase Showcase Grid (2x2 Cards) */
    .showcase-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      margin-bottom: 25px;
    }
    .card-item {
      background: #12151d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      position: relative;
    }
    .card-thumb-wrap {
      width: 100%;
      height: 230px;
      border-radius: 20px;
      overflow: hidden;
      background: #090a0d;
      margin-bottom: 18px;
      position: relative;
    }
    .card-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-badge-top {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      background: #10b981;
      color: #032115;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .card-category {
      font-size: 16px;
      font-weight: 700;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }
    .card-name {
      font-size: 23px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 58px;
    }
    .card-price-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-top: auto;
    }
    .card-price-current {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
    }
    .card-price-orig {
      font-size: 18px;
      color: #71717a;
      text-decoration: line-through;
    }

    /* Delivery / Custom Request Strip */
    .custom-query-strip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 20px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 25px;
    }
    .custom-query-text {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 21px;
      color: #e4e4e7;
      font-weight: 600;
    }
    .custom-query-badge {
      font-size: 17px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
      white-space: nowrap;
    }

    /* Bottom CTA */
    .cta-banner {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 34px;
      padding: 32px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 25px 60px rgba(16, 185, 129, 0.35);
    }
    .cta-text-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cta-subtext {
      font-size: 20px;
      font-weight: 800;
      color: #032e1d;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .cta-url {
      font-size: 40px;
      font-weight: 900;
      color: #021e13;
      letter-spacing: -0.02em;
    }
    .cta-btn-white {
      background: #ffffff;
      color: #021e13;
      font-size: 24px;
      font-weight: 800;
      padding: 18px 36px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <div class="content-wrap">
    <!-- Header -->
    <div class="header-bar">
      <div class="brand-badge">
        <img src="${logoB64}" class="brand-logo-mini" alt="Logo">
        <span class="brand-name">Punto Prisma</span>
      </div>
      <div class="flash-badge">
        <span>⚡</span>
        <span>Entrega en 5-15 min</span>
      </div>
    </div>

    <!-- Headline -->
    <div class="headline-wrap">
      <h1 class="headline-main">Gaming, Cuentas & Hardware <span>al mejor precio.</span></h1>
      <p class="headline-desc">
        Ahorrá hasta un 80% en Paraguay. Sin comisiones extra, pagá con SIPAP en Guaraníes.
      </p>
    </div>

    <!-- Product Showcase (2x2) -->
    <div class="showcase-grid">
      <!-- Item 1: Google AI Pro -->
      <div class="card-item">
        <div class="card-thumb-wrap">
          <img src="${geminiB64}" class="card-thumb-img" alt="Google AI Pro">
          <div class="card-badge-top">-80% OFF</div>
        </div>
        <div class="card-category">Inteligencia Artificial</div>
        <div class="card-name">Google AI Pro (Gemini 18M)</div>
        <div class="card-price-row">
          <span class="card-price-current">Gs. 49.000</span>
          <span class="card-price-orig">Gs. 1.800.000</span>
        </div>
      </div>

      <!-- Item 2: Assetto Corsa -->
      <div class="card-item">
        <div class="card-thumb-wrap">
          <img src="${assettoB64}" class="card-thumb-img" alt="Assetto Corsa">
          <div class="card-badge-top">Clave PC</div>
        </div>
        <div class="card-category">Juego Steam PC</div>
        <div class="card-name">Assetto Corsa Ultimate</div>
        <div class="card-price-row">
          <span class="card-price-current">Gs. 39.000</span>
          <span class="card-price-orig">Gs. 140.000</span>
        </div>
      </div>

      <!-- Item 3: Gamepad Bluetooth -->
      <div class="card-item">
        <div class="card-thumb-wrap">
          <img src="${gamepadB64}" class="card-thumb-img" alt="Gamepad">
          <div class="card-badge-top">En Stock</div>
        </div>
        <div class="card-category">Artículo Físico</div>
        <div class="card-name">Gamepad Bluetooth Multiplataforma</div>
        <div class="card-price-row">
          <span class="card-price-current">Gs. 120.000</span>
          <span class="card-price-orig">Gs. 160.000</span>
        </div>
      </div>

      <!-- Item 4: Auriculares 7.1 -->
      <div class="card-item">
        <div class="card-thumb-wrap">
          <img src="${headsetB64}" class="card-thumb-img" alt="Auriculares">
          <div class="card-badge-top">En Stock</div>
        </div>
        <div class="card-category">Audio & Periféricos</div>
        <div class="card-name">Auriculares Gamer 7.1 Surround</div>
        <div class="card-price-row">
          <span class="card-price-current">Gs. 165.000</span>
          <span class="card-price-orig">Gs. 220.000</span>
        </div>
      </div>
    </div>

    <!-- Custom Request Strip -->
    <div class="custom-query-strip">
      <div class="custom-query-text">
        <span style="font-size: 28px;">🔍</span>
        <span>¿Buscás otro juego o periférico? <strong>¡Te lo conseguimos bajo pedido!</strong></span>
      </div>
      <div class="custom-query-badge">WhatsApp 1-Click</div>
    </div>

    <!-- Bottom CTA Banner -->
    <div class="cta-banner">
      <div class="cta-text-left">
        <span class="cta-subtext">Comprá directo en la web</span>
        <span class="cta-url">puntoprisma.store</span>
      </div>
      <div class="cta-btn-white">
        <span>Ver Catálogo</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  </div>
</body>
</html>
`;


// =========================================================================
// FLYER 3: DIA 3 — "PUNTO PRISMA STUDIO & WEB CRAFT" (Agencia + Tienda)
// =========================================================================
const htmlFlyer3 = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1920px;
      background: #060709;
      color: #f5f6f8;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 140px 70px 140px;
    }

    .ambient-studio {
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 850px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(168, 85, 247, 0.22) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 75%);
      filter: blur(85px);
      pointer-events: none;
    }

    .content-wrap {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    /* Top Brand */
    .top-studio-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .studio-brand-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .studio-logo-box {
      width: 68px;
      height: 68px;
      border-radius: 18px;
      background: #0f1118;
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .studio-brand-name {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .studio-brand-sub {
      font-size: 17px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #a855f7;
      font-weight: 700;
    }
    .studio-badge-edition {
      font-size: 18px;
      font-weight: 700;
      padding: 10px 22px;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.35);
      color: #d8b4fe;
    }

    /* Headline Section */
    .studio-hero {
      margin-top: 30px;
      margin-bottom: 25px;
    }
    .studio-eyebrow {
      font-size: 19px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #a1a1aa;
      font-weight: 700;
      margin-bottom: 18px;
    }
    .studio-title {
      font-size: 72px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.035em;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .studio-title span {
      background: linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .studio-subtext {
      font-size: 26px;
      line-height: 1.45;
      color: #a1a1aa;
      max-width: 920px;
    }

    /* Central Luxury Card / Showcase */
    .studio-card-showcase {
      background: #0d0f15;
      border: 1px solid #27272a;
      border-radius: 36px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 28px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      position: relative;
      margin-bottom: 30px;
    }
    .showcase-features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .feature-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 22px;
      padding: 24px;
      display: flex;
      align-items: flex-start;
      gap: 18px;
    }
    .feature-icon {
      font-size: 32px;
      flex-shrink: 0;
    }
    .feature-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .feature-desc {
      font-size: 17px;
      color: #a1a1aa;
      line-height: 1.35;
    }

    .metrics-bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 20px;
      padding: 18px 24px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .metric-col {
      text-align: center;
    }
    .metric-num {
      font-size: 32px;
      font-weight: 900;
      color: #10b981;
      font-variant-numeric: tabular-nums;
    }
    .metric-label {
      font-size: 16px;
      color: #71717a;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.08em;
    }

    /* Dual Hub Gateway */
    .dual-hub-wrap {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .hub-btn-primary {
      background: #ffffff;
      color: #090a0d;
      border-radius: 9999px;
      padding: 24px 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-decoration: none;
      box-shadow: 0 16px 40px rgba(255, 255, 255, 0.2);
    }
    .hub-primary-text {
      display: flex;
      flex-direction: column;
    }
    .hub-primary-title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.01em;
    }
    .hub-primary-url {
      font-size: 19px;
      color: #52525b;
      font-weight: 700;
    }
    .hub-btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      padding: 20px 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #e4e4e7;
    }
    .hub-secondary-title {
      font-size: 22px;
      font-weight: 700;
    }
    .hub-secondary-url {
      font-size: 18px;
      color: #10b981;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="ambient-studio"></div>

  <div class="content-wrap">
    <!-- Header -->
    <div class="top-studio-header">
      <div class="studio-brand-left">
        <div class="studio-logo-box">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="16,3 29,26 3,26" stroke="#ffffff" stroke-width="2.3" stroke-linejoin="round" />
            <line x1="16" y1="3" x2="16" y2="26" stroke="#ffffff" stroke-width="1.85" stroke-dasharray="2 3" />
            <circle cx="16" cy="18" r="2.6" fill="#10b981" />
          </svg>
        </div>
        <div>
          <div class="studio-brand-name">Punto Prisma</div>
          <div class="studio-brand-sub">Studio & Marketplace</div>
        </div>
      </div>
      <div class="studio-badge-edition">Ecosistemas Web</div>
    </div>

    <!-- Main Headline -->
    <div class="studio-hero">
      <div class="studio-eyebrow">— INGENIERÍA DIGITAL DE ALTA FIDELIDAD</div>
      <h1 class="studio-title">Tu presencia digital, <span>elevada al máximo.</span></h1>
      <p class="studio-subtext">
        Desarrollamos ecosistemas web modernos, landing pages de alto impacto y catálogos móviles interactivos con el estándar estético de Apple.
      </p>
    </div>

    <!-- Studio Card Showcase -->
    <div class="studio-card-showcase">
      <div class="showcase-features-grid">
        <div class="feature-item">
          <div class="feature-icon">🚀</div>
          <div>
            <div class="feature-title">Landing Pages Pro</div>
            <div class="feature-desc">Diseñadas para convertir visitantes en clientes reales.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <div>
            <div class="feature-title">Catálogos Móviles</div>
            <div class="feature-desc">Filtros instantáneos y pedidos 1-click vía WhatsApp.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <div>
            <div class="feature-title">Carga Ultrarrápida</div>
            <div class="feature-desc">Optimización Core Web Vitals y cero latencia.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💎</div>
          <div>
            <div class="feature-title">Experiencia Apple</div>
            <div class="feature-desc">Animaciones fluidas y micro-interacciones a 60fps.</div>
          </div>
        </div>
      </div>

      <div class="metrics-bar">
        <div class="metric-col">
          <div class="metric-num">100%</div>
          <div class="metric-label">Rendimiento Web</div>
        </div>
        <div class="metric-col">
          <div class="metric-num">&lt; 0.8s</div>
          <div class="metric-label">Tiempo de Carga</div>
        </div>
        <div class="metric-col">
          <div class="metric-num">0%</div>
          <div class="metric-label">Fricción de Compra</div>
        </div>
      </div>
    </div>

    <!-- Dual Hub Gateways -->
    <div class="dual-hub-wrap">
      <!-- Studio Link -->
      <div class="hub-btn-primary">
        <div class="hub-primary-text">
          <span class="hub-primary-title">Cotizá tu proyecto web</span>
          <span class="hub-primary-url">studio.puntoprisma.store</span>
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>

      <!-- Store Link -->
      <div class="hub-btn-secondary">
        <span class="hub-secondary-title">¿Buscás suscripciones o gaming?</span>
        <span class="hub-secondary-url">puntoprisma.store →</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();

  const outDir = path.resolve(__dirname, '..');
  const artifactDir = 'C:/Users/Portfolio/.gemini/antigravity/brain/7c05cca5-5910-4b9c-8b0f-8f4c578a984a';

  async function renderFlyer(html, filename) {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1
    });
    await page.setContent(html);
    await page.waitForTimeout(100);
    const target = path.join(outDir, filename);
    await page.screenshot({ path: target, omitBackground: false });
    fs.copyFileSync(target, path.join(artifactDir, filename));
    await page.close();
    console.log('Flyer saved:', filename);
  }

  await renderFlyer(htmlFlyer1, 'flyer-story-dia1-ecosistema.png');
  await renderFlyer(htmlFlyer2, 'flyer-story-dia2-drops.png');
  await renderFlyer(htmlFlyer3, 'flyer-story-dia3-studio.png');

  await browser.close();
  console.log('All 3 Instagram Story flyers generated successfully!');
})();


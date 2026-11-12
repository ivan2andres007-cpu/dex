const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Prototype HTML to test visual hierarchy
  const testHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      :root {
        --bg-base: #090a0d;
        --bg-surface: #101217;
        --bg-surface-elevated: #151821;
        --border-subtle: rgba(255, 255, 255, 0.08);
        --border-medium: rgba(255, 255, 255, 0.16);
        --text-primary: #f5f6f8;
        --text-secondary: #9da4b0;
        --text-tertiary: #6b7280;
        --accent-emerald: #10b981;
        --accent-emerald-hover: #14cd92;
        --radius-md: 10px;
        --radius-lg: 14px;
        --radius-xl: 20px;
        --radius-pill: 9999px;
        --text-body-sm: 0.90rem;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        background: var(--bg-base);
        color: var(--text-primary);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 40px 24px;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      /* CUSTOM REQUEST CARD (Apple / Impeccable Design) */
      .custom-request-card {
        background: linear-gradient(135deg, rgba(21, 24, 33, 0.95) 0%, rgba(13, 15, 20, 0.98) 100%);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-xl);
        padding: 28px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 16px 36px -12px rgba(0, 0, 0, 0.5);
        margin-bottom: 40px;
      }

      .custom-request-ambient {
        position: absolute;
        right: -60px;
        top: -60px;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(60px);
        opacity: 0.15;
        background: radial-gradient(circle, #10b981 0%, #00f2fe 50%, transparent 70%);
      }

      .custom-request-ambient.physical-ambient {
        background: radial-gradient(circle, #3b82f6 0%, #10b981 50%, transparent 70%);
        opacity: 0.14;
      }

      .custom-request-main {
        display: flex;
        align-items: center;
        gap: 20px;
        position: relative;
        z-index: 2;
        min-width: 0;
      }

      .custom-request-icon-box {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.28);
        color: var(--accent-emerald);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .custom-request-icon-box.physical-icon-box {
        background: rgba(59, 130, 246, 0.12);
        border-color: rgba(59, 130, 246, 0.28);
        color: #60a5fa;
      }

      .custom-request-text {
        min-width: 0;
      }

      .custom-request-eyebrow {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--text-tertiary);
        margin-bottom: 6px;
      }

      .custom-request-title {
        font-size: 1.22rem;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.015em;
        line-height: 1.25;
        margin-bottom: 6px;
        text-wrap: balance;
      }

      .custom-request-desc {
        font-size: var(--text-body-sm);
        color: var(--text-secondary);
        line-height: 1.5;
        text-wrap: pretty;
        max-width: 680px;
      }

      .btn-custom-request {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 13px 24px;
        background: var(--accent-emerald);
        color: #032115;
        font-size: var(--text-body-sm);
        font-weight: 700;
        border-radius: var(--radius-pill);
        text-decoration: none;
        white-space: nowrap;
        flex-shrink: 0;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
        position: relative;
        z-index: 2;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                    background-color 0.2s ease,
                    box-shadow 0.2s ease;
      }

      @media (hover: hover) and (pointer: fine) {
        .btn-custom-request:hover {
          background: var(--accent-emerald-hover);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 22px rgba(16, 185, 129, 0.45);
        }
        .btn-custom-request:hover .request-btn-arrow {
          transform: translateX(4px);
        }
      }

      .btn-custom-request:active {
        transform: scale(0.97);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
      }

      .request-btn-arrow {
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @media (max-width: 768px) {
        .custom-request-card {
          flex-direction: column;
          align-items: stretch;
          padding: 22px 20px;
          gap: 18px;
        }
        .custom-request-main {
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .custom-request-title {
          font-size: 1.15rem;
        }
        .custom-request-desc {
          font-size: 0.88rem;
        }
        .btn-custom-request {
          width: 100%;
          padding: 14px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 style="margin-bottom: 20px; color: #fff;">1. Demo: Catálogo Digital</h2>
      <!-- Digital request card -->
      <div class="custom-request-card digital-request-card" role="region" aria-label="Consulta de productos digitales no listados">
        <div class="custom-request-ambient" aria-hidden="true"></div>
        <div class="custom-request-main">
          <div class="custom-request-icon-box" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <div class="custom-request-text">
            <span class="custom-request-eyebrow">— PEDIDOS PERSONALIZADOS & CATÁLOGO EXTENDIDO</span>
            <h3 class="custom-request-title">¿Buscás un juego, suscripción o licencia que no encontrás aquí?</h3>
            <p class="custom-request-desc">
              Conseguimos prácticamente cualquier clave digital de Steam, PlayStation, Xbox, suscripciones de IA o software bajo pedido con entrega garantizada en minutos.
            </p>
          </div>
        </div>
        <a href="https://wa.me/595986125649?text=Hola%20Punto%20Prisma,%20busco%20un%20producto%20digital%20(juego,%20suscripci%C3%B3n%20o%20licencia)%20que%20no%20figura%20en%20el%20cat%C3%A1logo%20web.%20%C2%BFTienen%20disponibilidad?" target="_blank" rel="noopener noreferrer" class="btn-custom-request" aria-label="Consultar por producto digital no listado en WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>Consultar por WhatsApp</span>
          <svg class="request-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>

      <h2 style="margin-bottom: 20px; color: #fff;">2. Demo: Artículos Físicos</h2>
      <!-- Physical request card -->
      <div class="custom-request-card physical-request-card" role="region" aria-label="Consulta de artículos físicos y hardware a pedido">
        <div class="custom-request-ambient physical-ambient" aria-hidden="true"></div>
        <div class="custom-request-main">
          <div class="custom-request-icon-box physical-icon-box" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div class="custom-request-text">
            <span class="custom-request-eyebrow">— ENCARGOS DE HARDWARE & ACCESORIOS</span>
            <h3 class="custom-request-title">¿Buscás algún accesorio, periférico o equipo específico?</h3>
            <p class="custom-request-desc">
              Si necesitás mandos especiales, auriculares, componentes, adaptadores o periféricos gamer que no veas en stock, podemos cotizártelos y gestionarlos con nuestros importadores oficiales.
            </p>
          </div>
        </div>
        <a href="https://wa.me/595986125649?text=Hola%20Punto%20Prisma,%20busco%20un%20art%C3%ADculo%20f%C3%ADsico,%20perif%C3%A9rico%20o%20accesorio%20que%20no%20figura%20en%20la%20tienda%20web.%20%C2%BFPueden%20conseguirlo?" target="_blank" rel="noopener noreferrer" class="btn-custom-request" aria-label="Consultar por artículo físico o hardware no listado en WhatsApp">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span>Consultar por WhatsApp</span>
          <svg class="request-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(testHtml);
  await page.screenshot({ path: 'scratch/demo_desktop_cards.png' });

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'scratch/demo_mobile_cards.png' });

  console.log('Screenshots taken successfully');
  await browser.close();
})();


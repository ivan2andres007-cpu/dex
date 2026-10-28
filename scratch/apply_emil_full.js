const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. TOAST NOTIFICATIONS REFACTOR:
// Replace keyframes with interruptible CSS transitions and spatial consistency (enter & exit bottom edge)
const oldToastCss = `    .toast-item {
      background: var(--text-primary);
      color: var(--bg-base);
      padding: 12px 22px;
      border-radius: var(--radius-pill);
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: var(--shadow-md);
      animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1), toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) 2.4s forwards;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-12px) scale(0.96); }
    }`;

const newToastCss = `    .toast-item {
      background: var(--text-primary);
      color: var(--bg-base);
      padding: 12px 22px;
      border-radius: var(--radius-pill);
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: var(--shadow-md);
      opacity: 1;
      transform: translateY(0) scale(1);
      transition: opacity 220ms var(--ease-out), transform 220ms var(--ease-out);
      will-change: transform, opacity;
      pointer-events: auto;
    }

    .toast-item[data-state="entering"] {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }

    .toast-item[data-state="exiting"] {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }`;

if (html.includes(oldToastCss)) {
  html = html.replace(oldToastCss, newToastCss);
  console.log('Updated toast CSS to interruptible transitions.');
} else {
  console.warn('Could not find oldToastCss directly, trying normalized match');
}

// 2. SHOWTOAST FUNCTION REFACTOR:
const oldShowToast = `    function showToast(text) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.innerHTML = \`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--accent-emerald);">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>\${text}</span>
      \`;
      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 2700);
    }`;

const newShowToast = `    function showToast(text) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.dataset.state = 'entering';
      toast.innerHTML = \`
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--accent-emerald);">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>\${text}</span>
      \`;
      container.appendChild(toast);

      // Trigger enter transition on next frame
      requestAnimationFrame(() => {
        toast.dataset.state = 'visible';
      });

      // Dismiss after 2.6s with smooth symmetric exit
      setTimeout(() => {
        toast.dataset.state = 'exiting';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 220);
      }, 2600);
    }`;

if (html.includes(oldShowToast)) {
  html = html.replace(oldShowToast, newShowToast);
  console.log('Updated showToast to symmetric exit transition.');
}

// 3. BOTTOM SHEET SWIPE GESTURE REFACTOR (Emil Kowalski Momentum & Velocity Dismissal)
const oldSwipeGesture = `    // Native Apple Bottom Sheet swipe-down-to-dismiss gesture on mobile
    function setupSheetSwipeGesture(modal) {
      if (!modal) return;
      let startY = 0;
      let currentY = 0;
      let isDragging = false;
      const grabBar = modal.querySelector('.sheet-grab-bar');
      const header = modal.querySelector('.modal-header');

      function onTouchStart(e) {
        if (window.innerWidth > 640) return;
        const touch = e.touches[0];
        startY = touch.clientY;
        currentY = startY;
        isDragging = true;
        modal.style.transition = 'none';
      }

      function onTouchMove(e) {
        if (!isDragging || window.innerWidth > 640) return;
        const touch = e.touches[0];
        currentY = touch.clientY;
        const deltaY = currentY - startY;
        if (deltaY > 0) {
          modal.style.transform = \`translateY(\${deltaY}px)\`;
        }
      }

      function onTouchEnd() {
        if (!isDragging || window.innerWidth > 640) return;
        isDragging = false;
        const deltaY = currentY - startY;
        if (deltaY > 60) {
          modal.style.transition = 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
          modal.style.transform = 'translateY(100%)';
          setTimeout(() => {
            modal.style.transform = '';
            modal.style.transition = '';
            closeProductDetails();
          }, 200);
        } else {
          modal.style.transition = 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
          modal.style.transform = 'translateY(0)';
          setTimeout(() => {
            modal.style.transform = '';
            modal.style.transition = '';
          }, 200);
        }
      }`;

const newSwipeGesture = `    // Native Apple Bottom Sheet swipe-down-to-dismiss gesture on mobile (Emil Kowalski Momentum & Damping)
    function setupSheetSwipeGesture(modal) {
      if (!modal) return;
      let startY = 0;
      let currentY = 0;
      let startTime = 0;
      let isDragging = false;
      const grabBar = modal.querySelector('.sheet-grab-bar');
      const header = modal.querySelector('.modal-header');

      function onTouchStart(e) {
        if (window.innerWidth > 768) return;
        if (e.touches.length > 1) return; // Multi-touch protection
        const touch = e.touches[0];
        startY = touch.clientY;
        currentY = startY;
        startTime = Date.now();
        isDragging = true;
        modal.style.transition = 'none';
      }

      function onTouchMove(e) {
        if (!isDragging || window.innerWidth > 768) return;
        const touch = e.touches[0];
        currentY = touch.clientY;
        const deltaY = currentY - startY;
        if (deltaY < 0) {
          // Boundary damping: physical friction when pulling up past top edge
          modal.style.transform = \`translateY(\${deltaY * 0.25}px)\`;
        } else {
          modal.style.transform = \`translateY(\${deltaY}px)\`;
        }
      }

      function onTouchEnd() {
        if (!isDragging || window.innerWidth > 768) return;
        isDragging = false;
        const deltaY = currentY - startY;
        const elapsed = Math.max(1, Date.now() - startTime);
        const velocity = Math.abs(deltaY) / elapsed; // px per ms

        // Momentum flick dismissal (Emil Kowalski rule: velocity > 0.11 or distance > 80px)
        const shouldDismiss = (deltaY > 80) || (deltaY > 30 && velocity > 0.11);

        if (shouldDismiss) {
          modal.style.transition = 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)';
          modal.style.transform = 'translateY(100%)';
          setTimeout(() => {
            modal.style.transform = '';
            modal.style.transition = '';
            closeProductDetails();
          }, 220);
        } else {
          // Snap back with iOS drawer spring
          modal.style.transition = 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)';
          modal.style.transform = 'translateY(0)';
          setTimeout(() => {
            modal.style.transform = '';
            modal.style.transition = '';
          }, 200);
        }
      }`;

if (html.includes(oldSwipeGesture)) {
  html = html.replace(oldSwipeGesture, newSwipeGesture);
  console.log('Updated setupSheetSwipeGesture with momentum and boundary damping.');
}

// 4. BREAK-UI FIXTURES & DATASET SWITCHER
const dataToggleHtml = `
  <!-- =============================================================
       BREAK-UI HARNESS: SEGMENTED DATASET TOGGLE (Dev-Only Testing)
       ============================================================= -->
  <aside class="dev-break-ui-panel" id="devBreakUiPanel" aria-label="Control de pruebas de datos extremos">
    <div class="dev-break-ui-track" role="group" aria-label="Cambiar datos de prueba">
      <button type="button" class="dev-break-ui-btn active" data-dataset="demo" onclick="switchDataset('demo')">
        Demo (7)
      </button>
      <button type="button" class="dev-break-ui-btn" data-dataset="worst" onclick="switchDataset('worst')">
        Worst Case
      </button>
      <button type="button" class="dev-break-ui-btn" data-dataset="empty" onclick="switchDataset('empty')">
        Vacío (0)
      </button>
    </div>
  </aside>
`;

if (!html.includes('dev-break-ui-panel')) {
  html = html.replace('  <!-- TOAST CONTAINER -->', `${dataToggleHtml}\n  <!-- TOAST CONTAINER -->`);
  console.log('Inserted Break-UI segmented toggle into HTML.');
}

// Add Break-UI CSS
const breakUiCss = `
    /* Dev Break-UI Segmented Control (Fixed, non-intrusive bottom pill) */
    .dev-break-ui-panel {
      position: fixed;
      bottom: calc(8px + var(--sab));
      left: 50%;
      transform: translateX(-50%);
      z-index: 1500;
      pointer-events: auto;
    }
    .dev-break-ui-track {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 3px;
      background: rgba(18, 20, 26, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-pill);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }
    .dev-break-ui-btn {
      padding: 5px 12px;
      border-radius: var(--radius-pill);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-stack);
      transition: background-color 140ms var(--ease-out), color 140ms var(--ease-out);
      white-space: nowrap;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    }
    .dev-break-ui-btn.active {
      background: var(--text-primary);
      color: var(--bg-base);
    }
`;

if (!html.includes('dev-break-ui-panel')) {
  html = html.replace('    /* -------------------------------------------------------------\n       ACCESSIBILITY: PREFERS REDUCED MOTION', `${breakUiCss}\n    /* -------------------------------------------------------------\n       ACCESSIBILITY: PREFERS REDUCED MOTION`);
}

// 5. BREAK-UI RESILIENCE IN RENDERPRODUCTS:
// Singular vs plural stock, zero stock styling, discount badge guard, and original price guard
const oldRenderCard = `        const stockPercent = Math.min(100, Math.max(20, Math.round((item.stockLeft / 10) * 100)));

        return \`
        <article class="product-card" data-id="\${item.id}">`;

const newRenderCard = `        const isOutOfStock = item.stockLeft === 0;
        const stockPercent = isOutOfStock ? 0 : Math.min(100, Math.max(20, Math.round((item.stockLeft / 10) * 100)));
        const stockText = isOutOfStock 
          ? 'Agotado temporalmente' 
          : (item.stockLeft === 1 ? 'Última 1 unidad disponible' : \`Últimas \${item.stockLeft} licencias\`);

        return \`
        <article class="product-card \${isOutOfStock ? 'is-out-of-stock' : ''}" data-id="\${item.id}">`;

if (html.includes(oldRenderCard)) {
  html = html.replace(oldRenderCard, newRenderCard);
  console.log('Updated stock calculation in renderProducts.');
}

// Replace stock display and discount guards
const oldStockDisplay = `              <div class="stock-live-badge">
                <span class="stock-status-dot"></span>
                <span class="stock-status-label">Stock disponible</span>
                <span class="stock-count-text num-tabular">Últimas \${item.stockLeft} licencias</span>
              </div>
              <div class="stock-progress-track" role="progressbar" aria-valuenow="\${item.stockLeft}" aria-valuemin="0" aria-valuemax="10" aria-label="Nivel de stock disponible">
                <div class="stock-progress-fill" style="transform: scaleX(\${stockPercent / 100});"></div>
              </div>

              <div class="price-box">
                <div class="price-main-row">
                  <span class="product-price-val num-tabular">\${formatGs(item.price)}</span>
                  <span class="discount-badge">\${item.discountPercentage}</span>
                </div>
                <div class="price-original-row">
                  <span class="price-original-val num-tabular">\${formatGs(item.originalPrice)}</span>
                  <span class="price-savings-label">Ahorras \${formatGs(item.originalPrice - item.price)}</span>
                </div>
              </div>`;

const newStockDisplay = `              <div class="stock-live-badge">
                <span class="stock-status-dot \${isOutOfStock ? 'is-sold-out' : ''}"></span>
                <span class="stock-status-label">\${isOutOfStock ? 'Sin stock' : 'Stock disponible'}</span>
                <span class="stock-count-text num-tabular">\${stockText}</span>
              </div>
              <div class="stock-progress-track" role="progressbar" aria-valuenow="\${item.stockLeft}" aria-valuemin="0" aria-valuemax="10" aria-label="Nivel de stock disponible">
                <div class="stock-progress-fill \${isOutOfStock ? 'is-sold-out' : ''}" style="transform: scaleX(\${stockPercent / 100});"></div>
              </div>

              <div class="price-box">
                <div class="price-main-row">
                  <span class="product-price-val num-tabular">\${formatGs(item.price)}</span>
                  \${item.discountPercentage ? \`<span class="discount-badge">\${item.discountPercentage}</span>\` : ''}
                </div>
                \${(item.originalPrice && item.originalPrice > item.price) ? \`
                <div class="price-original-row">
                  <span class="price-original-val num-tabular">\${formatGs(item.originalPrice)}</span>
                  <span class="price-savings-label">Ahorras \${formatGs(item.originalPrice - item.price)}</span>
                </div>\` : ''}
              </div>`;

if (html.includes(oldStockDisplay)) {
  html = html.replace(oldStockDisplay, newStockDisplay);
  console.log('Updated stock display & discount guards in renderProducts.');
}

// 6. JAVASCRIPT BREAK-UI FIXTURES & SWITCHDATASET
const datasetJs = `
    // -------------------------------------------------------------
    // BREAK-UI: FIXTURES & ADVERSARIAL TESTING DATASETS
    // -------------------------------------------------------------
    const DEMO_PRODUCTS = JSON.parse(JSON.stringify(PRODUCTS));

    const WORST_CASE_PRODUCTS = [
      {
        id: 'worst-case-enterprise-gcp',
        title: 'Google Cloud Platform Enterprise Architecture Plus Ultra Multi-Tenant 36-Month Trial Digital Key (Global Unlimited Multi-User License)',
        name: 'Google Cloud Platform Enterprise Architecture Plus Ultra Multi-Tenant 36-Month Trial Digital Key (Global Unlimited Multi-User License)',
        category: 'suscripcion',
        isAI: true,
        price: 12850000,
        originalPrice: 25700000,
        discountPercentage: '-50%',
        rating: '5.0',
        soldCount: '+12.450 vendidos',
        stockLeft: 0,
        image: 'imagenes/suscripciones/Google AI Pro - Gemini 18 Months Trial (Global) - Digital Key.jpg',
        badge: 'Garantía Extendida 36 Meses Corporativa',
        badgeType: 'badge-purple',
        extraBadge: 'Soporte VIP 24/7 Global Dedicado',
        extraBadgeType: 'badge-green',
        shortDesc: 'Licencia corporativa con token_inquebrantable_sin_espacios_ABCD1234EFGH5678IJKL9012MNOP3456_verificado para prueba de contención.',
        description: 'Licencia empresarial con infraestructura de alta concurrencia, 10 TB de almacenamiento y acceso sin restricciones a todos los clusters de cómputo.',
        features: [
          'Capacidad ultra elástica con 10 TB de cuota cloud escalable',
          'SLA 99.99% garantizado contractualmente con respuesta en 15 minutos',
          'Auditoría SOC2 Tipo II e ISO 27001 con cifrado AES-256 de extremo a extremo'
        ],
        notice: {
          title: 'Requisitos de Despliegue Empresarial',
          type: 'notice-blue',
          items: [
            'Requiere validación de dominio corporativo antes de la asignación.',
            'Activación inmediata disponible las 24 horas del día.'
          ]
        }
      },
      {
        id: 'worst-case-single-stock',
        title: 'AI Tool',
        name: 'AI Tool',
        category: 'gaming',
        price: 15000,
        originalPrice: 15000,
        discountPercentage: null,
        rating: '4.9',
        soldCount: '1 vendido',
        stockLeft: 1,
        image: 'imagenes/juegos/Assetto Corsa (Global) (PC) - Steam - Digital Key.jpg',
        badge: 'Single Unit',
        badgeType: 'badge-steam',
        extraBadge: null,
        shortDesc: 'Prueba de stock unitario singular (1 licencia vs plural) y precio regular sin descuento.',
        description: 'Herramienta compacta para verificación de casos de borde en stock.',
        features: ['Una sola característica de prueba'],
        notice: null
      },
      {
        id: 'worst-case-unicode-diacritics',
        title: 'Česká Lípa Špecifikácia Žltý Kôň (Global Steam PC Key) 🚀🎮',
        name: 'Česká Lípa Špecifikácia Žltý Kôň (Global Steam PC Key) 🚀🎮',
        category: 'gaming',
        price: 990000,
        originalPrice: 1200000,
        discountPercentage: '-18%',
        rating: '4.7',
        soldCount: '+340 vendidos',
        stockLeft: 5,
        image: 'imagenes/juegos/1 Juego Aleatorio de Steam - Grand (Global) (PC) - Clave Digital.jpg',
        badge: 'Steam Unicode',
        badgeType: 'badge-steam',
        extraBadge: 'UTF-8 Test',
        extraBadgeType: 'badge-purple',
        shortDesc: 'Test con caracteres diacríticos extendidos, acentos complejos, emojis y tall glyphs.',
        description: 'Verificación de renderizado con diacríticos y emojis en títulos y descripciones.',
        features: ['Compatibilidad Unicode completa', 'Prueba tipográfica'],
        notice: null
      }
    ];

    function switchDataset(type) {
      if (type === 'worst') {
        PRODUCTS.length = 0;
        PRODUCTS.push(...WORST_CASE_PRODUCTS);
      } else if (type === 'empty') {
        PRODUCTS.length = 0;
      } else {
        PRODUCTS.length = 0;
        PRODUCTS.push(...DEMO_PRODUCTS);
      }
      document.querySelectorAll('.dev-break-ui-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.dataset === type);
      });
      const url = new URL(window.location);
      if (type === 'demo') {
        url.searchParams.delete('data');
      } else {
        url.searchParams.set('data', type);
      }
      window.history.replaceState({}, '', url);
      renderProducts();
    }
`;

if (!html.includes('WORST_CASE_PRODUCTS')) {
  html = html.replace('    // State Variables\n    let cart = [];', `${datasetJs}\n    // State Variables\n    let cart = [];`);
  console.log('Inserted dataset fixtures & switchDataset function.');
}

// Add URL initial data check
const initDataCheck = `
      // Check for ?data= in URL on load
      const urlParams = new URLSearchParams(window.location.search);
      const initialData = urlParams.get('data');
      if (initialData === 'worst' || initialData === 'empty') {
        switchDataset(initialData);
      }
`;
if (!html.includes('initialData === \'worst\'')) {
  html = html.replace('      renderProducts();\n      renderPhysicalPreview();', `      renderProducts();\n      renderPhysicalPreview();\n${initDataCheck}`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished applying full Emil Kowalski polish and break-ui harness.');

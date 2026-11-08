const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2048, deviceScaleFactor: 1 }
  });

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 2048px;
      height: 2048px;
      background: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient glow behind device */
    .ambient-glow {
      position: absolute;
      width: 1700px;
      height: 1100px;
      top: 850px;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(ellipse at 50% 45%, 
        rgba(0, 240, 255, 0.22) 0%, 
        rgba(189, 52, 254, 0.18) 35%, 
        rgba(0, 168, 225, 0.08) 60%, 
        transparent 75%);
      filter: blur(80px);
      z-index: 1;
      pointer-events: none;
    }

    /* Header Section: Logo + Pro badge */
    .header-branding {
      position: absolute;
      top: 260px;
      display: flex;
      align-items: center;
      gap: 28px;
      z-index: 10;
    }

    .capcut-logo-svg {
      width: 104px;
      height: 104px;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .brand-title {
      font-size: 76px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0B0F19;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .pro-pill {
      font-size: 34px;
      font-weight: 800;
      padding: 6px 20px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #00F0FF 0%, #7928CA 60%, #BD34FE 100%);
      color: #FFFFFF;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 16px rgba(189, 52, 254, 0.35);
      text-transform: uppercase;
    }

    /* Hero Headline */
    .headline-wrap {
      position: absolute;
      top: 410px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      z-index: 10;
    }

    .hero-title {
      font-size: 156px;
      font-weight: 900;
      letter-spacing: -0.045em;
      line-height: 0.95;
      color: #090D16;
      text-transform: uppercase;
      text-align: center;
    }

    .spec-pill {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: #0B0E14;
      color: #FFFFFF;
      padding: 14px 38px;
      border-radius: 9999px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .spec-pill .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00F0FF;
      box-shadow: 0 0 10px #00F0FF;
    }

    /* Showcase Laptop Container */
    .showcase-stage {
      position: absolute;
      top: 790px;
      width: 1540px;
      height: 1040px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 5;
    }

    /* MacBook Screen Display */
    .laptop-lid {
      width: 1420px;
      height: 890px;
      background: #111317;
      border-radius: 36px 36px 0 0;
      border: 8px solid #20232A;
      border-bottom: none;
      box-shadow: 
        0 -2px 0 1px #333844,
        0 40px 100px -20px rgba(15, 23, 42, 0.4),
        0 20px 50px -10px rgba(0, 240, 255, 0.15);
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Glass reflection */
    .laptop-lid::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, transparent 60%);
      pointer-events: none;
      z-index: 20;
    }

    /* Screen Bezel Notch */
    .lid-notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 180px;
      height: 24px;
      background: #20232A;
      border-radius: 0 0 14px 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 25;
    }

    .lid-camera {
      width: 7px;
      height: 7px;
      background: #080A0E;
      border-radius: 50%;
      border: 1px solid #1E232F;
    }

    .lid-cam-indicator {
      width: 4px;
      height: 4px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 6px #10B981;
    }

    /* CapCut Pro UI inside Screen */
    .editor-ui {
      width: 100%;
      height: 100%;
      background: #0E1015;
      display: flex;
      flex-direction: column;
      position: relative;
      color: #E2E8F0;
    }

    /* App Top Bar */
    .editor-topbar {
      height: 52px;
      background: #161820;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 10;
    }

    .window-dots {
      display: flex;
      gap: 10px;
    }
    .w-dot { width: 14px; height: 14px; border-radius: 50%; }
    .w-red { background: #FF5F56; }
    .w-yellow { background: #FFBD2E; }
    .w-green { background: #27C93F; }

    .topbar-center {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 17px;
      font-weight: 600;
      color: #94A3B8;
    }

    .project-name {
      color: #F8FAFC;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .export-btn {
      background: linear-gradient(135deg, #00F0FF, #BD34FE);
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 700;
      padding: 7px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 10px rgba(0, 240, 255, 0.3);
    }

    /* Editor Main Split */
    .editor-middle {
      flex: 1;
      display: flex;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Left Sidebar: Tools */
    .editor-sidebar {
      width: 320px;
      background: #13151B;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .tool-tabs {
      display: flex;
      gap: 8px;
      background: #1A1D24;
      padding: 4px;
      border-radius: 10px;
    }

    .tool-tab {
      flex: 1;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 0;
      border-radius: 7px;
      color: #64748B;
    }

    .tool-tab.active {
      background: #232732;
      color: #00F0FF;
    }

    .effects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      flex: 1;
    }

    .effect-card {
      background: #1A1D26;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .effect-card.active-fx {
      border-color: #BD34FE;
      background: linear-gradient(180deg, #1A1D26, #241A33);
    }

    .fx-icon {
      font-size: 26px;
    }

    .fx-name {
      font-size: 12px;
      font-weight: 600;
      color: #CBD5E1;
      text-align: center;
    }

    .fx-pro-tag {
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      background: linear-gradient(135deg, #00F0FF, #BD34FE);
      color: #FFFFFF;
    }

    /* Video Player Monitor */
    .editor-monitor {
      flex: 1;
      background: #0A0B0E;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .player-canvas-frame {
      width: 100%;
      height: 100%;
      border-radius: 14px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      background: #000;
    }

    /* Simulated Cinematic scene inside player */
    .cinematic-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #4338ca 100%);
    }

    .cinematic-art {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        radial-gradient(circle at 75% 35%, rgba(0, 240, 255, 0.45), transparent 45%),
        radial-gradient(circle at 25% 65%, rgba(236, 72, 153, 0.4), transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.35), transparent 50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .cinematic-visual-center {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cinematic-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 5;
    }

    .cinematic-badge-right {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.15);
      z-index: 5;
    }

    .cutout-subject-glow {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.4), rgba(189, 52, 254, 0.2), transparent 70%);
      filter: blur(30px);
    }

    .center-subject-icon {
      width: 140px;
      height: 140px;
      filter: drop-shadow(0 15px 35px rgba(0, 240, 255, 0.6));
      z-index: 2;
    }

    /* Subtitle on video player */
    .player-subtitle-box {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 22px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 700;
      color: #FACC15;
      letter-spacing: 0.02em;
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 5;
    }

    /* Timeline Section */
    .editor-timeline {
      height: 280px;
      background: #111319;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .timeline-ruler {
      height: 30px;
      background: #171A22;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      font-size: 11px;
      font-family: monospace;
      color: #64748B;
    }

    .timeline-tracks {
      flex: 1;
      padding: 10px 18px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      position: relative;
    }

    /* Red playhead */
    .playhead-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 48%;
      width: 2px;
      background: #EF4444;
      box-shadow: 0 0 10px #EF4444;
      z-index: 10;
    }
    .playhead-handle {
      position: absolute;
      top: -6px;
      left: -6px;
      width: 14px;
      height: 14px;
      background: #EF4444;
      border-radius: 2px;
      transform: rotate(45deg);
    }

    .t-track {
      height: 48px;
      background: #161922;
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      gap: 6px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .clip-block {
      height: 38px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      font-size: 13px;
      font-weight: 700;
      gap: 8px;
    }

    .clip-text {
      background: linear-gradient(90deg, #F59E0B, #D97706);
      color: #0F172A;
      width: 44%;
    }

    .clip-fx {
      background: linear-gradient(90deg, #8B5CF6, #EC4899);
      color: #FFFFFF;
      width: 32%;
    }

    .clip-video-1 {
      background: linear-gradient(90deg, #2563EB, #06B6D4);
      color: #FFFFFF;
      width: 46%;
    }

    .clip-video-2 {
      background: linear-gradient(90deg, #0EA5E9, #3B82F6);
      color: #FFFFFF;
      width: 50%;
    }

    .clip-audio {
      background: #064E3B;
      border: 1px solid #10B981;
      color: #34D399;
      width: 98%;
      position: relative;
    }

    .audio-wave {
      position: absolute;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 3px;
      height: 24px;
    }
    .a-bar {
      width: 3px;
      background: #34D399;
      border-radius: 2px;
    }

    /* Laptop Base / Keyboard Deck */
    .laptop-base {
      width: 1540px;
      height: 28px;
      background: linear-gradient(180deg, #2A2E38 0%, #1A1D24 60%, #13151A 100%);
      border-radius: 0 0 28px 28px;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    .laptop-indent {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 8px;
      background: #121418;
      border-radius: 0 0 8px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .base-shadow {
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%);
      width: 1480px;
      height: 35px;
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 0, 0, 0.35) 0%, transparent 70%);
      filter: blur(12px);
    }

    /* Floating Feature Pills (Apple Keynote Style) */
    .feature-pill-1 {
      position: absolute;
      top: 860px;
      left: 70px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(0, 240, 255, 0.4);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 16px 26px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 240, 255, 0.2);
      z-index: 30;
    }

    .feature-pill-2 {
      position: absolute;
      top: 860px;
      right: 70px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid rgba(189, 52, 254, 0.4);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 16px 26px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(189, 52, 254, 0.2);
      z-index: 30;
    }

    .feature-pill-3 {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(16px);
      border-radius: 9999px;
      padding: 14px 34px;
      display: flex;
      align-items: center;
      gap: 18px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      z-index: 30;
    }

    .pill-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .pill-icon-box.cyan {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid rgba(0, 240, 255, 0.3);
      color: #00F0FF;
    }
    .pill-icon-box.purple {
      background: rgba(189, 52, 254, 0.15);
      border: 1px solid rgba(189, 52, 254, 0.3);
      color: #BD34FE;
    }

    .pill-text {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .pill-title {
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
    }
    .pill-subtitle {
      font-size: 14px;
      font-weight: 600;
      color: #94A3B8;
    }

    .pill-tag-inline {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pill-tag-inline span {
      color: #38BDF8;
    }
  </style>
</head>
<body>

  <!-- Ambient background glow behind laptop -->
  <div class="ambient-glow"></div>

  <!-- Header Branding: Official CapCut Logo + Pro -->
  <div class="header-branding">
    <svg class="capcut-logo-svg" viewBox="0 0 25 24" fill="none">
      <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#0B0F19"/>
    </svg>
    <div class="brand-title">
      CapCut
      <span class="pro-pill">PRO</span>
    </div>
  </div>

  <!-- Hero Headline -->
  <div class="headline-wrap">
    <div class="hero-title">1 MES</div>
    <div class="spec-pill">
      <span class="dot"></span>
      CUENTA PRIVADA • ACCESO GLOBAL
    </div>
  </div>

  <!-- Floating Feature Badges (Keynote style) -->
  <div class="feature-pill-1">
    <div class="pill-icon-box cyan">✨</div>
    <div class="pill-text">
      <div class="pill-title">Subtítulos & IA</div>
      <div class="pill-subtitle">Generación Automática</div>
    </div>
  </div>

  <div class="feature-pill-2">
    <div class="pill-icon-box purple">⚡</div>
    <div class="pill-text">
      <div class="pill-title">4K 60FPS HDR</div>
      <div class="pill-subtitle">Sin Marca de Agua</div>
    </div>
  </div>

  <!-- Showcase Laptop Section -->
  <div class="showcase-stage">
    <div class="laptop-lid">
      <div class="lid-notch">
        <div class="lid-camera"></div>
        <div class="lid-cam-indicator"></div>
      </div>

      <!-- Editor Interface -->
      <div class="editor-ui">
        <!-- Top bar -->
        <div class="editor-topbar">
          <div class="window-dots">
            <div class="w-dot w-red"></div>
            <div class="w-dot w-yellow"></div>
            <div class="w-dot w-green"></div>
          </div>
          <div class="topbar-center">
            <span class="project-name">
              🎬 Proyecto_Viral_Reel_Pro.mp4
            </span>
          </div>
          <div class="topbar-right">
            <div class="export-btn">
              <span>Exportar 4K</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Middle: Sidebar + Monitor -->
        <div class="editor-middle">
          <!-- Left Sidebar -->
          <div class="editor-sidebar">
            <div class="tool-tabs">
              <div class="tool-tab active">Efectos</div>
              <div class="tool-tab">Texto IA</div>
              <div class="tool-tab">Filtros</div>
            </div>
            <div class="effects-grid">
              <div class="effect-card active-fx">
                <span class="fx-pro-tag">PRO</span>
                <span class="fx-icon">🔮</span>
                <span class="fx-name">Glow Neón</span>
              </div>
              <div class="effect-card active-fx">
                <span class="fx-pro-tag">PRO</span>
                <span class="fx-icon">⚡</span>
                <span class="fx-name">Flash Zoom</span>
              </div>
              <div class="effect-card active-fx">
                <span class="fx-pro-tag">PRO</span>
                <span class="fx-icon">🪄</span>
                <span class="fx-name">Cutout IA</span>
              </div>
              <div class="effect-card active-fx">
                <span class="fx-pro-tag">PRO</span>
                <span class="fx-icon">🎞️</span>
                <span class="fx-name">Cinematic Pro</span>
              </div>
            </div>
          </div>

          <!-- Video Monitor -->
          <div class="editor-monitor">
            <div class="player-canvas-frame">
              <div class="cinematic-bg"></div>
              <div class="cinematic-art">
                <div class="cinematic-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#38BDF8"><circle cx="12" cy="12" r="10"/></svg>
                  4K 60FPS • HDR
                </div>
                <div class="cinematic-badge-right">
                  IA Cutout Activo
                </div>

                <div class="cinematic-visual-center">
                  <div class="cutout-subject-glow"></div>
                  <!-- Glowing CapCut Ribbon in center of video frame -->
                  <svg class="center-subject-icon" viewBox="0 0 25 24" fill="none">
                    <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="url(#centerGrad)"/>
                    <defs>
                      <linearGradient id="centerGrad" x1="0" y1="0" x2="25" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00F0FF" />
                        <stop offset="0.5" stop-color="#BD34FE" />
                        <stop offset="1" stop-color="#FF007F" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div class="player-subtitle-box">
                  <span>💬</span> "Edición profesional al instante con CapCut Pro"
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Timeline -->
        <div class="editor-timeline">
          <div class="timeline-ruler">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:45</span>
            <span>01:00</span>
            <span>01:15</span>
            <span>01:30</span>
          </div>

          <div class="timeline-tracks">
            <!-- Playhead -->
            <div class="playhead-line">
              <div class="playhead-handle"></div>
            </div>

            <!-- Subtitles Track -->
            <div class="t-track">
              <div class="clip-block clip-text">
                <span>💬</span> Auto-Subtítulos Dinámicos [IA]
              </div>
              <div class="clip-block clip-text" style="width: 50%;">
                <span>💬</span> Animación de Texto Viral
              </div>
            </div>

            <!-- FX Track -->
            <div class="t-track">
              <div class="clip-block clip-fx">
                <span>✨</span> Glow Neón Pro
              </div>
              <div class="clip-block clip-fx" style="width: 25%; background: linear-gradient(90deg, #BD34FE, #00F0FF);">
                <span>⚡</span> Transición 3D
              </div>
              <div class="clip-block clip-fx" style="width: 38%;">
                <span>🪄</span> Eliminación de Fondo
              </div>
            </div>

            <!-- Video Track -->
            <div class="t-track">
              <div class="clip-block clip-video-1">
                <span>🎬</span> Clip_01_Cinematic_4K.mov
              </div>
              <div class="clip-block clip-video-2">
                <span>🎬</span> Clip_02_B-Roll_60fps.mov
              </div>
            </div>

            <!-- Audio Track -->
            <div class="t-track">
              <div class="clip-block clip-audio">
                <span>🎵</span> Audio_Mastering_Dolby.wav
                <div class="audio-wave">
                  <div class="a-bar" style="height: 10px;"></div>
                  <div class="a-bar" style="height: 18px;"></div>
                  <div class="a-bar" style="height: 24px;"></div>
                  <div class="a-bar" style="height: 14px;"></div>
                  <div class="a-bar" style="height: 22px;"></div>
                  <div class="a-bar" style="height: 8px;"></div>
                  <div class="a-bar" style="height: 20px;"></div>
                  <div class="a-bar" style="height: 16px;"></div>
                  <div class="a-bar" style="height: 24px;"></div>
                  <div class="a-bar" style="height: 12px;"></div>
                  <div class="a-bar" style="height: 18px;"></div>
                  <div class="a-bar" style="height: 6px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Laptop Chassis Base -->
    <div class="laptop-base">
      <div class="laptop-indent"></div>
      <div class="base-shadow"></div>
    </div>
  </div>

  <!-- Bottom Floating Feature Pill -->
  <div class="feature-pill-3">
    <div class="pill-tag-inline">
      <span>✦</span> EFECTOS VIP DESBLOQUEADOS
      <span style="opacity: 0.4">•</span>
      <span>✦</span> EXPORTACIÓN ULTRA HD
      <span style="opacity: 0.4">•</span>
      <span>✦</span> MULTIPLATAFORMA
    </div>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(500);

  const previewPath = 'scratch/capcut_v2_preview.png';
  await page.screenshot({ path: previewPath });
  console.log('Saved preview at', previewPath);
  await browser.close();
})();


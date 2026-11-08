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
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient background backlight behind laptop */
    .ambient-glow {
      position: absolute;
      width: 1850px;
      height: 950px;
      top: 1240px;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(ellipse at 50% 50%, 
        rgba(0, 240, 255, 0.42) 0%, 
        rgba(168, 85, 247, 0.34) 35%, 
        rgba(0, 168, 225, 0.16) 60%, 
        transparent 75%);
      filter: blur(110px);
      z-index: 1;
      pointer-events: none;
    }

    /* Soft top lighting */
    .studio-light {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1600px;
      height: 500px;
      background: radial-gradient(ellipse at 50% 0%, rgba(248, 250, 252, 0.95) 0%, transparent 70%);
      pointer-events: none;
      z-index: 2;
    }

    /* 1. Header Section: BIG, BOLD, UNMISTAKABLE CapCut Logo */
    .header-lockup {
      position: absolute;
      top: 110px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      z-index: 10;
    }

    .capcut-logo-svg {
      width: 160px;
      height: 160px;
      filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.14));
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .brand-title {
      font-size: 92px;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #090D16;
      line-height: 1;
    }

    .pro-pill {
      font-size: 38px;
      font-weight: 900;
      padding: 8px 26px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #00F0FF 0%, #7928CA 55%, #BD34FE 100%);
      color: #FFFFFF;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 22px rgba(189, 52, 254, 0.48);
      text-transform: uppercase;
    }

    .account-subtag {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #64748B;
    }

    /* 2. Hero Headline: MASSIVE '1 MES' */
    .month-section {
      position: absolute;
      top: 460px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
    }

    .hero-month {
      font-size: 280px;
      font-weight: 900;
      letter-spacing: -0.055em;
      line-height: 0.88;
      color: #090D16;
      text-transform: uppercase;
      text-align: center;
      filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08));
    }

    /* 3. Los Demás Datos: High-Contrast BIG GLOBAL Box */
    .data-section {
      position: absolute;
      top: 730px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      z-index: 10;
    }

    .global-badge-box {
      display: inline-flex;
      align-items: center;
      gap: 18px;
      background: #090D16;
      color: #FFFFFF;
      padding: 18px 68px;
      border-radius: 24px;
      font-size: 46px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .global-badge-box .dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #00F0FF;
      box-shadow: 0 0 16px #00F0FF;
    }

    .sub-feature-text {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sub-feature-text span.dot-sep {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94A3B8;
    }

    /* 4. Showcase Laptop Section (Bottom 42%) */
    .showcase-stage {
      position: absolute;
      top: 920px;
      width: 1560px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 5;
    }

    /* MacBook Screen Display */
    .laptop-lid {
      width: 1500px;
      height: 900px;
      background: #111317;
      border-radius: 34px 34px 0 0;
      border: 8px solid #20232A;
      border-bottom: none;
      box-shadow: 
        0 -2px 0 1px #333844,
        0 45px 110px -15px rgba(15, 23, 42, 0.45),
        0 25px 70px -10px rgba(0, 240, 255, 0.3);
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
      gap: 10px;
      z-index: 25;
    }

    .lid-camera {
      width: 8px;
      height: 8px;
      background: #080A0E;
      border-radius: 50%;
      border: 1px solid #1E232F;
    }

    .lid-cam-indicator {
      width: 5px;
      height: 5px;
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
      height: 54px;
      background: #15171E;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 10;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .window-dots {
      display: flex;
      gap: 9px;
    }
    .w-dot { width: 14px; height: 14px; border-radius: 50%; }
    .w-red { background: #FF5F56; }
    .w-yellow { background: #FFBD2E; }
    .w-green { background: #27C93F; }

    .project-name-left {
      font-size: 15px;
      font-weight: 700;
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

    .topbar-badge-res {
      font-size: 12px;
      font-weight: 800;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      padding: 4px 10px;
      border-radius: 6px;
    }

    .export-btn {
      background: linear-gradient(135deg, #00F0FF, #BD34FE);
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 800;
      padding: 7px 18px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      gap: 7px;
      box-shadow: 0 2px 12px rgba(0, 240, 255, 0.35);
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
      background: #13151C;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tool-tabs {
      display: flex;
      gap: 6px;
      background: #1A1D26;
      padding: 4px;
      border-radius: 9px;
    }

    .tool-tab {
      flex: 1;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 0;
      border-radius: 6px;
      color: #64748B;
    }

    .tool-tab.active {
      background: #232734;
      color: #00F0FF;
    }

    .effects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      flex: 1;
    }

    .effect-card {
      background: #191C25;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 14px 10px;
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
      background: linear-gradient(180deg, #1C1E2B, #271A3B);
    }

    .fx-icon {
      font-size: 28px;
    }

    .fx-name {
      font-size: 12px;
      font-weight: 700;
      color: #E2E8F0;
      text-align: center;
    }

    .fx-pro-tag {
      position: absolute;
      top: 5px;
      right: 5px;
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
      padding: 22px;
    }

    .player-canvas-frame {
      width: 100%;
      height: 100%;
      border-radius: 14px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
      background: #050608;
    }

    /* Cinematic scene: High Production Studio Scene with Neon Glow */
    .cinematic-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #060911 0%, #13122c 35%, #241142 70%, #441784 100%);
    }

    .cinematic-art {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        radial-gradient(circle at 82% 28%, rgba(0, 240, 255, 0.55), transparent 48%),
        radial-gradient(circle at 18% 72%, rgba(236, 72, 153, 0.5), transparent 42%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.45), transparent 55%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }

    .cinematic-stars {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        radial-gradient(2px 2px at 20% 30%, #fff, transparent),
        radial-gradient(2px 2px at 40% 70%, #00F0FF, transparent),
        radial-gradient(3px 3px at 70% 25%, #BD34FE, transparent),
        radial-gradient(2px 2px at 85% 65%, #fff, transparent),
        radial-gradient(3px 3px at 30% 80%, #00F0FF, transparent);
      opacity: 0.7;
      pointer-events: none;
    }

    .cinematic-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(11, 15, 25, 0.88);
      backdrop-filter: blur(10px);
      padding: 7px 15px;
      border-radius: 7px;
      font-size: 13px;
      font-weight: 800;
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      display: flex;
      align-items: center;
      gap: 7px;
      z-index: 5;
    }

    .cinematic-badge-right {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(11, 15, 25, 0.88);
      backdrop-filter: blur(10px);
      padding: 7px 15px;
      border-radius: 7px;
      font-size: 13px;
      font-weight: 800;
      color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      gap: 7px;
      z-index: 5;
    }

    .cinematic-badge-right .green-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
    }

    /* Editing Transform Box */
    .transform-box {
      position: relative;
      width: 420px;
      height: 280px;
      border: 2px dashed rgba(0, 240, 255, 0.9);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.32);
    }

    .t-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      border: 2px solid #00F0FF;
      border-radius: 3px;
    }
    .t-tl { top: -6px; left: -6px; }
    .t-tr { top: -6px; right: -6px; }
    .t-bl { bottom: -6px; left: -6px; }
    .t-br { bottom: -6px; right: -6px; }

    .cutout-subject-glow {
      position: absolute;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.55), rgba(189, 52, 254, 0.32), transparent 70%);
      filter: blur(35px);
    }

    .center-subject-icon {
      width: 165px;
      height: 165px;
      filter: drop-shadow(0 15px 40px rgba(0, 240, 255, 0.8));
      z-index: 2;
    }

    /* Subtitle on video player */
    .player-subtitle-box {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.86);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(14px);
      padding: 10px 28px;
      border-radius: 40px;
      font-size: 17px;
      font-weight: 800;
      color: #FDE047;
      letter-spacing: 0.02em;
      text-shadow: 0 2px 6px rgba(0,0,0,0.9);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 10px;
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
      background: #171A24;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 22px;
      font-size: 11px;
      font-family: monospace;
      color: #64748B;
    }

    .timeline-tracks {
      flex: 1;
      padding: 10px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
    }

    /* Red playhead */
    .playhead-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 45%;
      width: 2px;
      background: #EF4444;
      box-shadow: 0 0 12px #EF4444;
      z-index: 10;
    }
    .playhead-handle {
      position: absolute;
      top: -7px;
      left: -7px;
      width: 16px;
      height: 16px;
      background: #EF4444;
      border-radius: 3px;
      transform: rotate(45deg);
    }

    .t-track {
      height: 48px;
      background: #161924;
      border-radius: 9px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .clip-block {
      height: 38px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 13px;
      font-weight: 700;
      gap: 9px;
    }

    .clip-text {
      background: linear-gradient(90deg, #F59E0B, #D97706);
      color: #0F172A;
      width: 44%;
    }

    .clip-fx {
      background: linear-gradient(90deg, #8B5CF6, #EC4899);
      color: #FFFFFF;
      width: 34%;
    }

    .clip-video-1 {
      background: linear-gradient(90deg, #2563EB, #06B6D4);
      color: #FFFFFF;
      width: 44%;
    }

    .clip-video-2 {
      background: linear-gradient(90deg, #0EA5E9, #3B82F6);
      color: #FFFFFF;
      width: 52%;
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
      right: 18px;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 24px;
    }
    .a-bar {
      width: 3.5px;
      background: #34D399;
      border-radius: 2px;
    }

    /* Laptop Base / Keyboard Deck */
    .laptop-base {
      width: 1560px;
      height: 32px;
      background: linear-gradient(180deg, #2D313C 0%, #1C1E26 60%, #13151B 100%);
      border-radius: 0 0 30px 30px;
      position: relative;
      box-shadow: 0 22px 45px rgba(0, 0, 0, 0.42);
    }

    .laptop-indent {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 9px;
      background: #111317;
      border-radius: 0 0 9px 9px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .base-shadow {
      position: absolute;
      bottom: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 1500px;
      height: 40px;
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 0, 0, 0.38) 0%, transparent 70%);
      filter: blur(14px);
    }
  </style>
</head>
<body>

  <!-- Studio Lighting -->
  <div class="studio-light"></div>

  <!-- Ambient background glow behind laptop -->
  <div class="ambient-glow"></div>

  <!-- 1. Header Lockup: BIG, BOLD CapCut Logo Lockup -->
  <div class="header-lockup">
    <svg class="capcut-logo-svg" viewBox="0 0 25 24" fill="none">
      <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#090D16"/>
    </svg>
    <div class="brand-row">
      <span class="brand-title">CapCut</span>
      <span class="pro-pill">PRO</span>
    </div>
    <div class="account-subtag">CUENTA EXCLUSIVA</div>
  </div>

  <!-- 2. Hero Headline: MASSIVE '1 MES' -->
  <div class="month-section">
    <div class="hero-month">1 MES</div>
  </div>

  <!-- 3. Los Demás Datos: High-Contrast Big GLOBAL Box -->
  <div class="data-section">
    <div class="global-badge-box">
      <span class="dot"></span>
      GLOBAL
    </div>
    <div class="sub-feature-text">
      <span>Subtítulos IA</span>
      <span class="dot-sep"></span>
      <span>4K 60FPS</span>
      <span class="dot-sep"></span>
      <span>Sin Marca</span>
    </div>
  </div>

  <!-- 4. Showcase Laptop Section (Bottom 42%) -->
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
          <div class="topbar-left">
            <div class="window-dots">
              <div class="w-dot w-red"></div>
              <div class="w-dot w-yellow"></div>
              <div class="w-dot w-green"></div>
            </div>
            <div class="project-name-left">
              <span>CapCut Pro</span>
              <span style="color: #64748B">•</span>
              <span style="color: #94A3B8">Reel_Viral_4K.mp4</span>
            </div>
          </div>
          <div class="topbar-right">
            <div class="topbar-badge-res">4K 60FPS • HDR</div>
            <div class="export-btn">
              <span>Exportar</span>
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
                <span class="fx-name">Cinematic</span>
              </div>
            </div>
          </div>

          <!-- Video Monitor -->
          <div class="editor-monitor">
            <div class="player-canvas-frame">
              <div class="cinematic-bg"></div>
              <div class="cinematic-art">
                <div class="cinematic-stars"></div>
                
                <div class="cinematic-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#38BDF8"><circle cx="12" cy="12" r="10"/></svg>
                  Render en Tiempo Real
                </div>
                <div class="cinematic-badge-right">
                  <span class="green-dot"></span>
                  IA Cutout Activo
                </div>

                <!-- Bounding transform box -->
                <div class="transform-box">
                  <div class="t-handle t-tl"></div>
                  <div class="t-handle t-tr"></div>
                  <div class="t-handle t-bl"></div>
                  <div class="t-handle t-br"></div>

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
                  <span>💬</span> "Subtítulos automáticos por Inteligencia Artificial"
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
            <span>01:45</span>
            <span>02:00</span>
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
                <span>💬</span> Animación Viral Pro
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
                  <div class="a-bar" style="height: 15px;"></div>
                  <div class="a-bar" style="height: 24px;"></div>
                  <div class="a-bar" style="height: 11px;"></div>
                  <div class="a-bar" style="height: 18px;"></div>
                  <div class="a-bar" style="height: 7px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Laptop Base / Keyboard Deck -->
    <div class="laptop-base">
      <div class="laptop-indent"></div>
      <div class="base-shadow"></div>
    </div>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(600);

  // Overwrite production assets
  const destDir = path.resolve('imagenes/suscripciones');
  const jpgPath = path.join(destDir, 'CapCut Pro - 1 Month (Global) - CapCut Account.jpg');
  const pngPath = path.join(destDir, 'CapCut Pro - 1 Month (Global) - CapCut Account.png');

  await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 95 });
  await page.screenshot({ path: pngPath, type: 'png' });
  console.log('Saved pure bold production assets:', {
    jpg: fs.statSync(jpgPath).size,
    png: fs.statSync(pngPath).size
  });

  await browser.close();
})();


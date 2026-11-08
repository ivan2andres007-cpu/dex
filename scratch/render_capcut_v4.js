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

    /* Ambient background glow behind laptop */
    .ambient-glow {
      position: absolute;
      width: 1900px;
      height: 1300px;
      top: 750px;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(ellipse at 50% 50%, 
        rgba(0, 240, 255, 0.28) 0%, 
        rgba(189, 52, 254, 0.24) 30%, 
        rgba(0, 168, 225, 0.12) 58%, 
        transparent 75%);
      filter: blur(95px);
      z-index: 1;
      pointer-events: none;
    }

    /* Subtle top studio illumination */
    .studio-light {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1500px;
      height: 480px;
      background: radial-gradient(ellipse at 50% 0%, rgba(248, 250, 252, 0.95) 0%, transparent 70%);
      pointer-events: none;
      z-index: 2;
    }

    /* Header Section: Logo + Pro badge (Centered, safely between left icon & right badges) */
    .header-branding {
      position: absolute;
      top: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      z-index: 10;
      /* Max width tightly bounded so it stays inside x=800..1248 */
    }

    .capcut-logo-svg {
      width: 78px;
      height: 78px;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.08));
    }

    .brand-title {
      font-size: 60px;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0B0F19;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .pro-pill {
      font-size: 24px;
      font-weight: 800;
      padding: 5px 15px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #00F0FF 0%, #7928CA 60%, #BD34FE 100%);
      color: #FFFFFF;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 14px rgba(189, 52, 254, 0.35);
      text-transform: uppercase;
    }

    /* Hero Headline: positioned at y=390px, completely BELOW the badge zone! */
    .headline-wrap {
      position: absolute;
      top: 390px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      z-index: 10;
    }

    .hero-title {
      font-size: 156px;
      font-weight: 900;
      letter-spacing: -0.045em;
      line-height: 0.92;
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
      padding: 12px 36px;
      border-radius: 9999px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
      top: 670px;
      width: 1720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 5;
    }

    /* MacBook Screen Display */
    .laptop-lid {
      width: 1640px;
      height: 1020px;
      background: #111317;
      border-radius: 36px 36px 0 0;
      border: 8px solid #20232A;
      border-bottom: none;
      box-shadow: 
        0 -2px 0 1px #333844,
        0 45px 110px -15px rgba(15, 23, 42, 0.42),
        0 25px 65px -10px rgba(0, 240, 255, 0.22);
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
      width: 190px;
      height: 26px;
      background: #20232A;
      border-radius: 0 0 14px 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
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
      height: 56px;
      background: #15171E;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      z-index: 10;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .window-dots {
      display: flex;
      gap: 10px;
    }
    .w-dot { width: 15px; height: 15px; border-radius: 50%; }
    .w-red { background: #FF5F56; }
    .w-yellow { background: #FFBD2E; }
    .w-green { background: #27C93F; }

    .project-name-left {
      font-size: 16px;
      font-weight: 700;
      color: #F8FAFC;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .topbar-badge-res {
      font-size: 13px;
      font-weight: 700;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 5px 12px;
      border-radius: 6px;
    }

    .export-btn {
      background: linear-gradient(135deg, #00F0FF, #BD34FE);
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 800;
      padding: 8px 22px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 14px rgba(0, 240, 255, 0.35);
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
      width: 360px;
      background: #13151C;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .tool-tabs {
      display: flex;
      gap: 8px;
      background: #1A1D26;
      padding: 5px;
      border-radius: 10px;
    }

    .tool-tab {
      flex: 1;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      padding: 9px 0;
      border-radius: 7px;
      color: #64748B;
    }

    .tool-tab.active {
      background: #232734;
      color: #00F0FF;
    }

    .effects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      flex: 1;
    }

    .effect-card {
      background: #191C25;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .effect-card.active-fx {
      border-color: #BD34FE;
      background: linear-gradient(180deg, #1C1E2B, #271A3B);
    }

    .fx-icon {
      font-size: 32px;
    }

    .fx-name {
      font-size: 13px;
      font-weight: 700;
      color: #E2E8F0;
      text-align: center;
    }

    .fx-pro-tag {
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 6px;
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
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.65);
      background: #050608;
    }

    /* Cinematic scene with Neon Lights & Motion Crop */
    .cinematic-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #080c14 0%, #161536 35%, #28144b 70%, #4a1c92 100%);
    }

    .cinematic-art {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: 
        radial-gradient(circle at 80% 30%, rgba(0, 240, 255, 0.52), transparent 45%),
        radial-gradient(circle at 20% 70%, rgba(236, 72, 153, 0.46), transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.42), transparent 55%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .cinematic-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      background: rgba(11, 15, 25, 0.88);
      backdrop-filter: blur(10px);
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 800;
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.35);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 5;
    }

    .cinematic-badge-right {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(11, 15, 25, 0.88);
      backdrop-filter: blur(10px);
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 800;
      color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 5;
    }

    .cinematic-badge-right .green-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
    }

    /* Editing Transform Box */
    .transform-box {
      position: relative;
      width: 440px;
      height: 310px;
      border: 2px dashed rgba(0, 240, 255, 0.85);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.3);
    }

    .t-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      border: 2px solid #00F0FF;
      border-radius: 2px;
    }
    .t-tl { top: -6px; left: -6px; }
    .t-tr { top: -6px; right: -6px; }
    .t-bl { bottom: -6px; left: -6px; }
    .t-br { bottom: -6px; right: -6px; }

    .cutout-subject-glow {
      position: absolute;
      width: 270px;
      height: 270px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 240, 255, 0.5), rgba(189, 52, 254, 0.28), transparent 70%);
      filter: blur(35px);
    }

    .center-subject-icon {
      width: 175px;
      height: 175px;
      filter: drop-shadow(0 15px 40px rgba(0, 240, 255, 0.75));
      z-index: 2;
    }

    /* Subtitle on video player */
    .player-subtitle-box {
      position: absolute;
      bottom: 22px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.84);
      border: 1px solid rgba(255, 255, 255, 0.24);
      backdrop-filter: blur(12px);
      padding: 10px 28px;
      border-radius: 40px;
      font-size: 18px;
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
      height: 300px;
      background: #111319;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .timeline-ruler {
      height: 32px;
      background: #171A24;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      font-size: 12px;
      font-family: monospace;
      color: #64748B;
    }

    .timeline-tracks {
      flex: 1;
      padding: 10px 20px;
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
      height: 50px;
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
      height: 40px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 700;
      gap: 10px;
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
      height: 26px;
    }
    .a-bar {
      width: 4px;
      background: #34D399;
      border-radius: 2px;
    }

    /* Laptop Base / Keyboard Deck */
    .laptop-base {
      width: 1720px;
      height: 32px;
      background: linear-gradient(180deg, #2D313C 0%, #1C1E26 60%, #13151B 100%);
      border-radius: 0 0 32px 32px;
      position: relative;
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
    }

    .laptop-indent {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      height: 10px;
      background: #111317;
      border-radius: 0 0 10px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .base-shadow {
      position: absolute;
      bottom: -45px;
      left: 50%;
      transform: translateX(-50%);
      width: 1650px;
      height: 45px;
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 0, 0, 0.38) 0%, transparent 70%);
      filter: blur(15px);
    }

    /* Key Apple-Style Pro Value Tags below the laptop */
    .value-footer {
      position: absolute;
      bottom: 50px;
      display: flex;
      align-items: center;
      gap: 36px;
      z-index: 10;
    }

    .value-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 24px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.01em;
    }

    .value-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .value-icon.cyan {
      background: rgba(0, 240, 255, 0.12);
      border: 1px solid rgba(0, 240, 255, 0.3);
      color: #0284C7;
    }
    .value-icon.purple {
      background: rgba(189, 52, 254, 0.12);
      border: 1px solid rgba(189, 52, 254, 0.3);
      color: #7C3AED;
    }
    .value-icon.amber {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #D97706;
    }

    .value-divider {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #CBD5E1;
    }
  </style>
</head>
<body>

  <!-- Studio Lighting -->
  <div class="studio-light"></div>

  <!-- Ambient background glow behind laptop -->
  <div class="ambient-glow"></div>

  <!-- Header Branding: Official CapCut Logo + Pro (Centered safely in x=850..1200) -->
  <div class="header-branding">
    <svg class="capcut-logo-svg" viewBox="0 0 25 24" fill="none">
      <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#0B0F19"/>
    </svg>
    <div class="brand-title">
      CapCut
      <span class="pro-pill">PRO</span>
    </div>
  </div>

  <!-- Hero Headline (Starts at y=390px, completely beneath top-right floating badges) -->
  <div class="headline-wrap">
    <div class="hero-title">1 MES</div>
    <div class="spec-pill">
      <span class="dot"></span>
      CUENTA EXCLUSIVA • ACCESO GLOBAL
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
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
                  <div class="a-bar" style="height: 26px;"></div>
                  <div class="a-bar" style="height: 14px;"></div>
                  <div class="a-bar" style="height: 24px;"></div>
                  <div class="a-bar" style="height: 8px;"></div>
                  <div class="a-bar" style="height: 22px;"></div>
                  <div class="a-bar" style="height: 16px;"></div>
                  <div class="a-bar" style="height: 26px;"></div>
                  <div class="a-bar" style="height: 12px;"></div>
                  <div class="a-bar" style="height: 20px;"></div>
                  <div class="a-bar" style="height: 8px;"></div>
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

  <!-- Bottom Value Indicators -->
  <div class="value-footer">
    <div class="value-item">
      <div class="value-icon cyan">✨</div>
      <span>Subtítulos IA</span>
    </div>
    <div class="value-divider"></div>
    <div class="value-item">
      <div class="value-icon purple">⚡</div>
      <span>4K 60FPS Pro</span>
    </div>
    <div class="value-divider"></div>
    <div class="value-item">
      <div class="value-icon amber">🔓</div>
      <span>Sin Marca de Agua</span>
    </div>
  </div>

</body>
</html>`;

  await page.setContent(html);
  await page.waitForTimeout(600);

  const preview2048 = 'scratch/capcut_v4_2048.png';
  await page.screenshot({ path: preview2048 });
  console.log('Saved 2048 canvas at', preview2048);

  // Now render card view preview
  const b64 = fs.readFileSync(preview2048).toString('base64');
  const pageCard = await browser.newPage({ viewport: { width: 500, height: 600 } });
  await pageCard.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        background: #090A0E;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 40px;
        display: flex;
        justify-content: center;
      }
      .product-card {
        width: 320px;
        background: #111318;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      }
      .card-media-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        background: #08090C;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .card-preview-art {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .card-floating-icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: rgba(9, 10, 13, 0.82);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 2;
      }
      .card-floating-badges {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
        z-index: 2;
      }
      .card-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        backdrop-filter: blur(8px);
      }
      .badge-purple {
        background: rgba(189, 52, 254, 0.2);
        color: #e09aff;
        border: 1px solid rgba(189, 52, 254, 0.4);
      }
      .badge-blue {
        background: rgba(0, 168, 225, 0.2);
        color: #38bdf8;
        border: 1px solid rgba(0, 168, 225, 0.4);
      }
      .card-content { padding: 18px; }
      .tag { font-size: 11px; font-weight: 700; color: #8E95A5; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
      .title { font-size: 15px; font-weight: 700; color: #FFFFFF; line-height: 1.3; margin-bottom: 12px; }
      .price-row { display: flex; align-items: baseline; gap: 8px; }
      .price { font-size: 20px; font-weight: 800; color: #FFFFFF; }
      .discount { background: #EF4444; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="product-card">
      <div class="card-media-preview">
        <img class="card-preview-art" src="data:image/png;base64,${b64}">
        <div class="card-floating-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#121316"/>
            <g transform="translate(4.5, 4.5) scale(0.62)">
              <path d="M24.189 6.442V2.671l-4.535 2.383V4.91c.002-1.505-1.078-2.411-2.638-2.411H2.64C.993 2.5 0 3.407 0 4.91V8.72L6.354 12 0 15.316v3.8C0 20.595 1 21.5 2.64 21.5h14.373c1.56 0 2.639-.907 2.639-2.382v-.197l4.536 2.409v-3.828L13.64 12 24.19 6.443zM9.982 13.873l7.797 4.083H2.157l7.825-4.083zm7.741-7.828l-7.742 4.057-7.825-4.057h15.567z" fill="#00F0FF"/>
            </g>
          </svg>
        </div>
        <div class="card-floating-badges">
          <span class="card-badge badge-purple">1 Mes Pro</span>
          <span class="card-badge badge-blue">Cuenta Global</span>
        </div>
      </div>
      <div class="card-content">
        <div class="tag">Suscripción Digital</div>
        <div class="title">CapCut Pro - 1 Month (Global) - CapCut Account</div>
        <div class="price-row">
          <div class="price">Gs. 29.000</div>
          <div class="discount">-66%</div>
        </div>
      </div>
    </div>
  </body>
  </html>`);

  await pageCard.screenshot({ path: 'scratch/capcut_v4_card_preview.png' });
  console.log('Saved card preview at scratch/capcut_v4_card_preview.png');
  await browser.close();
})();


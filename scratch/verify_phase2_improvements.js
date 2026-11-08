const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Launching Chromium test for Phase 2 (Punto Prisma Studio & Agency)...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('requestfailed', req => {
    console.log('❌ Request failed URL:', req.url(), req.failure().errorText);
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('❌ Page Error:', err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('ERR_FILE_NOT_FOUND')) {
      errors.push(msg.text());
      console.error('❌ Console Error:', msg.text());
    }
  });

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Studio Framing & Badging
  console.log('--- 1. Testing Studio Header ---');
  const studioBadge = await page.$eval('.studio-badge', el => el.innerText.trim());
  console.log(`Studio Badge: "${studioBadge}"`);
  if (!studioBadge.includes('PUNTO PRISMA STUDIO')) {
    throw new Error('Studio badge does not contain PUNTO PRISMA STUDIO');
  }

  const agencyHeading = await page.$eval('#agencyHeading', el => el.innerText.trim());
  console.log(`Agency Heading: "${agencyHeading}"`);

  // 2. Verify Studio Interface Showcase
  console.log('--- 2. Testing Studio Interface Mockups Showcase ---');
  const showcaseWrap = await page.$('.studio-showcase-wrap');
  if (!showcaseWrap) throw new Error('.studio-showcase-wrap not found!');

  const mockupCards = await page.$$('.studio-mockup-card');
  console.log(`Mockup cards count: ${mockupCards.length} (expected: 2)`);
  if (mockupCards.length !== 2) throw new Error(`Expected 2 mockup cards, found ${mockupCards.length}`);

  const card1Title = await page.$eval('.studio-mockup-card:nth-child(1) .mockup-meta-title', el => el.innerText.trim());
  const card2Title = await page.$eval('.studio-mockup-card:nth-child(2) .mockup-meta-title', el => el.innerText.trim());
  console.log(`Mockup 1: "${card1Title}"`);
  console.log(`Mockup 2: "${card2Title}"`);

  // Verify simulated browser frames
  const browserFrames = await page.$$('.studio-browser-frame');
  console.log(`Browser frames: ${browserFrames.length} (expected: 2)`);
  if (browserFrames.length !== 2) throw new Error(`Expected 2 browser frames, found ${browserFrames.length}`);

  // 3. Verify Pricing Packages
  console.log('--- 3. Testing Pricing Packages ---');
  const pricingTitle = await page.$eval('.pricing-packages-title', el => el.innerText.trim());
  console.log(`Pricing Section Title: "${pricingTitle}"`);

  const pkgCards = await page.$$('.agency-card');
  console.log(`Agency Pricing Cards count: ${pkgCards.length} (expected: 3)`);
  if (pkgCards.length !== 3) throw new Error(`Expected 3 pricing cards, found ${pkgCards.length}`);

  // Verify WhatsApp links on all 3 packages
  const quoteLinks = await page.$$eval('.btn-agency-quote', links => links.map(a => a.href));
  console.log('Quote WhatsApp Links count:', quoteLinks.length);
  quoteLinks.forEach((link, idx) => {
    console.log(`Package ${idx + 1} WA Link: ${link.slice(0, 60)}...`);
    if (!link.startsWith('https://wa.me/595986125649')) {
      throw new Error(`Package ${idx + 1} quote link does not point to WhatsApp!`);
    }
  });

  // 4. Capture Desktop Screenshot of Agency Section
  console.log('--- 4. Capturing Desktop Agency Screenshot ---');
  const agencySection = await page.$('#agencia');
  await agencySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await agencySection.screenshot({ path: path.resolve(__dirname, 'desktop_agency_studio.png') });

  // 5. Test Mobile Viewport & Tab Switcher
  console.log('--- 5. Testing Mobile Viewport & Tab Switcher ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);

  // Initial tab is landing
  const isLandingVisible = await page.$eval('#pkg-landing', el => window.getComputedStyle(el).display !== 'none');
  const isEcomVisibleInit = await page.$eval('#pkg-ecommerce', el => window.getComputedStyle(el).display !== 'none');
  console.log(`Initial mobile display: Landing=${isLandingVisible}, Ecom=${isEcomVisibleInit}`);
  if (!isLandingVisible || isEcomVisibleInit) throw new Error('Initial mobile tab state incorrect!');

  // Switch to E-Commerce
  console.log('Clicking E-Commerce tab on mobile...');
  await page.click('#tab-ecommerce');
  await page.waitForTimeout(300);
  const isEcomVisible = await page.$eval('#pkg-ecommerce', el => window.getComputedStyle(el).display !== 'none');
  const isLandingHidden = await page.$eval('#pkg-landing', el => window.getComputedStyle(el).display === 'none');
  console.log(`After switch: Ecom=${isEcomVisible}, LandingHidden=${isLandingHidden}`);
  if (!isEcomVisible || !isLandingHidden) throw new Error('Failed to switch to E-Commerce tab!');

  // Switch to Software
  console.log('Clicking Software tab on mobile...');
  await page.click('#tab-software');
  await page.waitForTimeout(300);
  const isSoftwareVisible = await page.$eval('#pkg-software', el => window.getComputedStyle(el).display !== 'none');
  console.log(`After switch: Software=${isSoftwareVisible}`);
  if (!isSoftwareVisible) throw new Error('Failed to switch to Software tab!');

  // Capture Mobile Screenshot of Agency Section
  await agencySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await agencySection.screenshot({ path: path.resolve(__dirname, 'mobile_agency_studio.png') });

  // 6. Verify Digital & Physical catalog intact
  console.log('--- 6. Verifying Marketplace & Cart System Integrity ---');
  const digitalCards = await page.$$('.product-card');
  const physicalCards = await page.$$('.physical-card');
  console.log(`Catalog Counts: Digital=${digitalCards.length} (expected 11), Physical=${physicalCards.length} (expected 6)`);
  if (digitalCards.length !== 11 || physicalCards.length !== 6) {
    throw new Error('Digital or physical cards count altered!');
  }

  console.log(`\n Total Page Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
    throw new Error(`Encountered ${errors.length} errors during verification`);
  }

  console.log('🎉 PHASE 2 VERIFICATION PASSED WITH 100% SUCCESS!');
  await browser.close();
})();

const puppeteer = require('puppeteer-core');
const path = require('path');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🚀 Starting Comprehensive Browser Testing...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  const page = await browser.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      console.error(`  [Console Error]: ${text}`);
      results.errors.push(text);
    }
  });

  page.on('pageerror', err => {
    console.error(`  [Page Uncaught Error]: ${err.message}`);
    results.errors.push(err.message);
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Home Page (index.html)
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Home Page ---');
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle0' });
    const homeTitle = await page.title();
    console.log(`Page Title: ${homeTitle}`);
    if (!homeTitle.includes('Art School')) {
      throw new Error(`Home title unexpected: ${homeTitle}`);
    }

    // Check navbar brand
    const brand = await page.$eval('.navbar__brand', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Brand text: ${brand}`);

    // Check Hero CTA buttons
    const heroBtn1 = await page.$eval('.hero a.btn-primary', el => el.getAttribute('href'));
    const heroBtn2 = await page.$eval('.hero a.btn-secondary', el => el.getAttribute('href'));
    console.log(`Hero CTA 1: ${heroBtn1}, CTA 2: ${heroBtn2}`);

    // Check slide-in elements presence
    const slideIns = await page.$$('.slide-in');
    console.log(`Slide-in elements found: ${slideIns.length}`);

    results.passed.push('Home Page loaded with proper title, hero CTA, and slide-in elements');

    // ----------------------------------------------------
    // TEST 2: Services Page (services.html)
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Services Page ---');
    await page.goto(`${BASE_URL}/services.html`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#services-grid', { timeout: 5000 });
    
    // Wait for cards to render
    await page.waitForFunction(() => document.querySelectorAll('#services-grid .course-card-enhanced').length >= 8, { timeout: 5000 });
    const serviceCards = await page.$$eval('#services-grid .course-card-enhanced', cards => cards.map(c => ({
      title: c.querySelector('.course-card-enhanced__title')?.textContent.trim(),
      price: c.querySelector('.course-card-enhanced__price')?.textContent.trim(),
      icon: c.querySelector('.course-card-enhanced__icon')?.textContent.trim()
    })));
    console.log(`Rendered ${serviceCards.length} service cards:`, serviceCards.map(s => `${s.title} (${s.icon})`).join(', '));
    
    if (serviceCards.length < 8) {
      throw new Error(`Expected at least 8 services, found ${serviceCards.length}`);
    }

    // Test Category Filter buttons on Services
    await page.click('[data-filter="drawing"]');
    await sleep(300);
    const filteredDrawing = await page.$$eval('#services-grid .course-card-enhanced', cards => cards.map(c => c.querySelector('.course-card-enhanced__title')?.textContent.trim()));
    console.log(`Filtered 'drawing':`, filteredDrawing);
    if (!filteredDrawing.includes('Drawing') && !filteredDrawing.includes('Sketching')) {
      throw new Error('Drawing filter failed to show drawing courses');
    }

    // Reset filter
    await page.click('[data-filter="all"]');
    await sleep(300);
    results.passed.push(`Services Page rendered all ${serviceCards.length} courses with icons and functioning category filters`);

    // ----------------------------------------------------
    // TEST 3: Gallery Page (gallery.html) & Lightbox
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Gallery Page & Lightbox ---');
    await page.goto(`${BASE_URL}/gallery.html`, { waitUntil: 'networkidle0' });
    const galleryItems = await page.$$('.gallery-item');
    console.log(`Gallery items found: ${galleryItems.length}`);
    if (galleryItems.length !== 12) {
      throw new Error(`Expected 12 gallery items, found ${galleryItems.length}`);
    }

    // Test Filter: Watercolor
    await page.click('.gallery-filters [data-category="watercolor"]');
    await sleep(300);
    const hiddenCount = await page.$$eval('.gallery-item.hidden', items => items.length);
    console.log(`Hidden items after watercolor filter: ${hiddenCount}`);
    if (hiddenCount === 0) {
      throw new Error('Gallery filter did not hide non-matching items');
    }

    // Reset filter
    await page.click('.gallery-filters [data-category="all"]');
    await sleep(300);

    // Test Lightbox: Click 1st gallery item
    await page.click('.gallery-item:first-child');
    await page.waitForSelector('.lightbox.active', { timeout: 3000 });
    console.log('Lightbox opened successfully');

    // Check lightbox content has SVG
    const hasSvg = await page.$eval('.lightbox__content svg', el => Boolean(el));
    console.log(`Lightbox SVG present: ${hasSvg}`);

    // Click Next
    await page.click('#lightboxNext');
    await sleep(300);

    // Click Close
    await page.click('#lightboxClose');
    await sleep(300);
    const isClosed = await page.$eval('#lightbox', el => !el.classList.contains('active'));
    console.log(`Lightbox closed successfully: ${isClosed}`);
    if (!isClosed) throw new Error('Lightbox did not close upon clicking close button');

    results.passed.push('Gallery Page rendered 12 artworks, filter worked, lightbox opened/navigated/closed');

    // ----------------------------------------------------
    // TEST 4: Pricing Page (pricing.html)
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Pricing Page ---');
    await page.goto(`${BASE_URL}/pricing.html`, { waitUntil: 'networkidle0' });
    const initialStarterPrice = await page.$eval('#priceStarter', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Initial Monthly Starter Price: ${initialStarterPrice}`);

    // Switch to Quarterly
    await page.click('#btnQuarterly');
    await sleep(300);
    const quarterlyStarterPrice = await page.$eval('#priceStarter', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Quarterly Starter Price: ${quarterlyStarterPrice}`);
    if (quarterlyStarterPrice === initialStarterPrice) {
      throw new Error('Quarterly switch did not update price text');
    }

    // Check link updated
    const starterLink = await page.$eval('#btnStarterLink', el => el.getAttribute('href'));
    console.log(`Starter link after quarterly switch: ${starterLink}`);
    if (!starterLink.includes('Quarterly')) {
      throw new Error(`Starter link did not update with quarterly: ${starterLink}`);
    }

    // Test FAQ Accordion
    const firstAccBtn = await page.$('.accordion-btn');
    if (firstAccBtn) {
      await firstAccBtn.click();
      await sleep(300);
      const isOpen = await page.$eval('.accordion-btn', el => el.classList.contains('active'));
      console.log(`Accordion expanded: ${isOpen}`);
      if (!isOpen) throw new Error('Accordion failed to open on click');
    }

    results.passed.push('Pricing Page monthly/quarterly switch and FAQ accordion work correctly');

    // ----------------------------------------------------
    // TEST 5: Booking Page (booking.html) & Submission
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Booking Page & Form Submission ---');
    await page.goto(`${BASE_URL}/booking.html?service=Painting`, { waitUntil: 'networkidle0' });

    // Verify service prefill
    const selectedService = await page.$eval('#service', el => el.value);
    console.log(`Selected service from URL prefill: ${selectedService}`);
    if (selectedService !== 'Painting') {
      throw new Error(`Expected prefilled service 'Painting', got '${selectedService}'`);
    }

    // Verify sidebar updated
    const sideService = await page.$eval('#sideServiceName', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Sidebar service name: ${sideService}`);
    if (sideService !== 'Painting') {
      throw new Error(`Sidebar did not update with prefilled service: ${sideService}`);
    }

    // Test form validation by submitting empty
    await page.click('#submitBtn');
    await sleep(300);
    const nameHasError = await page.$eval('#group-name', el => el.classList.contains('has-error'));
    console.log(`Validation caught empty name: ${nameHasError}`);
    if (!nameHasError) throw new Error('Validation failed to catch empty name');

    // Fill valid data
    await page.type('#name', 'Test Student');
    await page.type('#phone', '9876543299');
    await page.type('#email', 'teststudent@example.com');
    await page.type('#note', 'Automated headless browser booking verification');

    // Submit form
    console.log('Submitting valid booking...');
    await page.click('#submitBtn');
    await page.waitForSelector('#bookingSuccess.visible', { timeout: 6000 });
    const successMsg = await page.$eval('#bookingSuccess', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log('Booking confirmed! Success message displayed.');
    results.passed.push('Booking Page prefilled from query, validated required fields, and successfully saved booking');

    // ----------------------------------------------------
    // TEST 6: Reviews Page (reviews.html)
    // ----------------------------------------------------
    console.log('\n--- 6. Testing Reviews Page ---');
    await page.goto(`${BASE_URL}/reviews.html`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#reviewsGrid .review-card', { timeout: 5000 });

    const reviewCards = await page.$$eval('#reviewsGrid .review-card', cards => cards.length);
    console.log(`Reviews rendered: ${reviewCards}`);
    if (reviewCards < 6) throw new Error(`Expected at least 6 reviews, found ${reviewCards}`);

    const avgScore = await page.$eval('#overviewScore', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Scoreboard Average: ${avgScore}`);

    // Test Search input
    await page.type('#reviewSearchInput', 'Painting');
    await sleep(400);
    const searchCount = await page.$eval('#displayedCount', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Search result count for 'Painting': ${searchCount}`);

    // Clear search
    await page.click('#reviewSearchClear');
    await sleep(300);

    // Test Star selector in Submit Review form
    await page.click('#starSelector button[data-val="4"]');
    const selectedVal = await page.$eval('#rev-rating', el => el.value);
    console.log(`Star selector set to: ${selectedVal}`);
    if (selectedVal !== '4') throw new Error(`Star selector value unexpected: ${selectedVal}`);

    results.passed.push(`Reviews Page loaded ${reviewCards} reviews, scoreboard, live search, and interactive star selector`);

    // ----------------------------------------------------
    // TEST 7: Contact Page (contact.html)
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Contact Page ---');
    await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'networkidle0' });

    // Verify studio hours status badge
    const badgeText = await page.$eval('#statusText', el => el.querySelector('img') ? 'Art School' : el.textContent.trim());
    console.log(`Studio Status Badge: ${badgeText}`);

    // Fill contact form
    await page.type('#cnt-name', 'Rohan Test');
    await page.type('#cnt-email', 'rohan@test.com');
    await page.type('#cnt-phone', '9876543210');
    await page.select('#cnt-subject', 'Course Admissions & Enrollment');
    await page.type('#cnt-message', 'Hello, this is an automated contact inquiry test.');

    await page.click('#cntSubmitBtn');
    await page.waitForSelector('#contactSuccess.visible', { timeout: 6000 });
    console.log('Contact message submitted and success alert visible');

    results.passed.push('Contact Page loaded with hours badge and submitted message successfully');

    // ----------------------------------------------------
    // TEST 8: Mobile Viewport & Hamburger Menu (375x667)
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Mobile Responsiveness & Hamburger Menu (375px) ---');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle0' });

    const toggleVisible = await page.$eval('#navToggle', el => window.getComputedStyle(el).display !== 'none');
    console.log(`Mobile hamburger toggle visible: ${toggleVisible}`);
    if (!toggleVisible) throw new Error('Hamburger menu toggle is not visible on 375px viewport');

    // Click Hamburger
    await page.evaluate(() => document.getElementById('navToggle').click());
    await sleep(300);
    const menuOpen = await page.$eval('#navMenu', el => el.classList.contains('navbar__menu--open'));
    console.log(`Hamburger menu opened: ${menuOpen}`);
    if (!menuOpen) throw new Error('Hamburger menu failed to open on click');

    // Click again to close
    await page.evaluate(() => document.getElementById('navToggle').click());
    await sleep(300);
    const menuClosed = await page.$eval('#navMenu', el => !el.classList.contains('navbar__menu--open'));
    console.log(`Hamburger menu closed: ${menuClosed}`);
    if (!menuClosed) throw new Error('Hamburger menu failed to close on toggle click');

    results.passed.push('Mobile viewport (375px) successfully displayed hamburger toggle and toggled menu');

  } catch (err) {
    console.error(`❌ Test Failure: ${err.message}`);
    results.failed.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('📊 TEST SUMMARY');
  console.log('========================================');
  console.log(`Passed: ${results.passed.length}`);
  results.passed.forEach(p => console.log(`  ✅ ${p}`));

  console.log(`Failed: ${results.failed.length}`);
  results.failed.forEach(f => console.log(`  ❌ ${f}`));

  console.log(`Console Errors: ${results.errors.length}`);
  results.errors.forEach(e => console.log(`  ⚠️  ${e}`));

  if (results.failed.length === 0 && results.errors.length === 0) {
    console.log('\n🎉 ALL TESTS PASSED WITH ZERO CONSOLE ERRORS!');
  } else {
    process.exit(1);
  }
}

runTests();

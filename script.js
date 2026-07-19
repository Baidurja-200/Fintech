/* =====================================================
   RAZORPAY PROFILE – INTERACTIVE JAVASCRIPT
   Scroll effects, counters, interactive consoles, charts
   ===================================================== */

function initializeProfilePage() {
  'use strict';

  // ─── ELEMENTS ───
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.getElementById('navLinks');
  const navToggle   = document.getElementById('navToggle');
  const backToTop   = document.getElementById('backToTop');
  const sections    = document.querySelectorAll('section[id]');
  const reveals     = document.querySelectorAll('.reveal');
  const heroStats   = document.querySelectorAll('.hero-stat-value[data-count]');

  // ─── NAVBAR – Sticky + Scroll Shadow ───
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScrollY = scrollY;
  }

  // ─── ACTIVE NAV LINK HIGHLIGHTING ───
  function highlightActiveLink() {
    const scrollY = window.scrollY + 120;
    let currentSection = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ─── MOBILE NAV TOGGLE ───
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ─── BACK TO TOP BUTTON ───
  function handleBackToTop() {
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── SCROLL REVEAL (Intersection Observer) ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  reveals.forEach(el => revealObserver.observe(el));

  // ─── ANIMATED COUNTERS ───
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    heroStats.forEach(stat => {
      const target     = parseFloat(stat.dataset.count);
      const prefix     = stat.dataset.prefix || '';
      const suffix     = stat.dataset.suffix || '';
      const decimals   = parseInt(stat.dataset.decimals) || 0;
      const noComma    = stat.dataset.noComma === 'true';
      const duration   = 2000;
      const startTime  = performance.now();

      function updateCounter(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;

        if (decimals > 0) {
          stat.textContent = prefix + current.toFixed(decimals) + suffix;
        } else {
          const val = Math.floor(current);
          stat.textContent = prefix + (noComma ? val : val.toLocaleString()) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (decimals > 0) {
            stat.textContent = prefix + target.toFixed(decimals) + suffix;
          } else {
            stat.textContent = prefix + (noComma ? target : target.toLocaleString()) + suffix;
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });

    countersAnimated = true;
  }

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  // ─── KPI CARD HOVER TILT EFFECT ───
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `translateY(-5px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ─── TIMELINE DOT GLOW ON SCROLL ───
  const timelineDots = document.querySelectorAll('.timeline-dot');
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.boxShadow = '0 0 10px rgba(11, 114, 231, 0.6)';
          entry.target.style.transform = 'scale(1.25)';
          entry.target.style.transition = 'all 0.4s ease';
        }
      });
    },
    { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
  );

  timelineDots.forEach(dot => timelineObserver.observe(dot));

  // ─── INTERACTIVE GEOGRAPHY CONSOLE CONTROLLER ───
  const geoTabBtns = document.querySelectorAll('.geo-tab-btn');
  const mapNodes   = document.querySelectorAll('.map-node');
  const detailsPanes = document.querySelectorAll('.hub-details-pane');

  function switchActiveHub(hubId) {
    // 1. Update Tabs
    geoTabBtns.forEach(btn => {
      const btnHub = btn.dataset.hub;
      btn.classList.toggle('active', btnHub === hubId);
    });

    // 2. Update Map Nodes
    mapNodes.forEach(node => {
      const nodeHub = node.dataset.node;
      node.classList.toggle('active', nodeHub === hubId);
    });

    // 3. Update Details Panes
    detailsPanes.forEach(pane => {
      const paneId = pane.getAttribute('id');
      pane.classList.toggle('active', paneId === `hub-content-${hubId}`);
    });

    // 4. Update SVG Flight connection paths
    const pathKl = document.getElementById('path-kl');
    const pathSg = document.getElementById('path-sg');
    const pathDe = document.getElementById('path-de');

    if (pathKl && pathSg && pathDe) {
      // Reset path colors and thickness
      pathKl.style.stroke = 'rgba(11, 114, 231, 0.15)';
      pathKl.style.strokeWidth = '2';
      pathSg.style.stroke = 'rgba(11, 114, 231, 0.15)';
      pathSg.style.strokeWidth = '2';
      pathDe.style.stroke = 'rgba(11, 114, 231, 0.15)';
      pathDe.style.strokeWidth = '2';

      // Highlight active connection line
      if (hubId === 'kuala-lumpur') {
        pathKl.style.stroke = '#3B93FC';
        pathKl.style.strokeWidth = '3.5';
      } else if (hubId === 'singapore') {
        pathSg.style.stroke = '#3B93FC';
        pathSg.style.strokeWidth = '3.5';
      } else if (hubId === 'delaware') {
        pathDe.style.stroke = '#3B93FC';
        pathDe.style.strokeWidth = '3.5';
      }
    }
  }

  // Bind clicks to Hub Buttons
  geoTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hubId = btn.dataset.hub;
      switchActiveHub(hubId);
    });
  });

  // Bind clicks to Map Nodes
  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      const hubId = node.dataset.node;
      switchActiveHub(hubId);
    });
  });

  // Initialize active geography selection
  switchActiveHub('bengaluru');

  // ─── INTERACTIVE FUNDING CHART ROADMAP ───
  const chartBars = document.querySelectorAll('.chart-bar');
  const detailsDefault = document.querySelector('.funding-details-pane-default');
  const detailsActive = document.querySelector('.funding-details-pane-active');

  const detailsRoundTitle = document.querySelector('.details-round-title');
  const detailsYear = document.querySelector('.details-year');
  const detailsAmount = document.querySelector('.details-amount');
  const detailsInvestors = document.querySelector('.details-investors');

  chartBars.forEach(bar => {
    bar.addEventListener('mouseenter', () => {
      const round = bar.dataset.round;
      const amount = bar.dataset.amount;
      const year = bar.dataset.year;
      const investors = bar.dataset.investors;

      if (detailsRoundTitle) detailsRoundTitle.textContent = `${round} Round`;
      if (detailsYear) detailsYear.textContent = year;
      if (detailsAmount) detailsAmount.textContent = amount;
      if (detailsInvestors) detailsInvestors.textContent = investors;

      if (detailsDefault) detailsDefault.style.display = 'none';
      if (detailsActive) detailsActive.style.display = 'block';
    });

    bar.addEventListener('mouseleave', () => {
      if (detailsDefault) detailsDefault.style.display = 'block';
      if (detailsActive) detailsActive.style.display = 'none';
    });
  });

  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const offsetTop = targetEl.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── THROTTLED SCROLL HANDLER ───
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        highlightActiveLink();
        handleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── INITIAL CALLS ───
  handleNavbarScroll();
  highlightActiveLink();
  handleBackToTop();

  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // ─── INTERACTIVE SIMULATION LOGIC ───
  const tabBtns = document.querySelectorAll('.checkout-tab-btn');
  const panels = document.querySelectorAll('.checkout-panel');
  const bankBtns = document.querySelectorAll('.nb-bank-btn');
  const logContainer = document.getElementById('flowLogs');
  const otpModal = document.getElementById('otpModal');
  const successOverlay = document.getElementById('successOverlay');
  const btnVerifyOtp = document.getElementById('btn-verify-otp');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const otpInput = document.getElementById('otp-input');

  // Dump early load errors to logs panel
  if (logContainer && window.jsErrors && window.jsErrors.length > 0) {
    window.jsErrors.forEach(err => {
      const entry = document.createElement('div');
      entry.style.color = '#ff4a4a';
      entry.style.fontWeight = 'bold';
      entry.className = 'log-entry';
      entry.textContent = err;
      logContainer.appendChild(entry);
    });
  }
  
  // Tab changing
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-method');
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`panel-${method}`).classList.add('active');
      writeLog(`[SYSTEM] Switched payment method to ${method.toUpperCase()}.`, 'info');
    });
  });

  // Netbanking bank selection
  bankBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bankBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Log function
  function writeLog(text, type = 'info') {
    if (!logContainer) return;
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  // Visual state management
  const nodes = {
    customer: document.getElementById('node-customer'),
    rzp: document.getElementById('node-rzp'),
    gw: document.getElementById('node-gw'),
    bank: document.getElementById('node-bank'),
    merchant: document.getElementById('node-merchant')
  };

  const lines = {
    custRzp: document.getElementById('line-customer-rzp'),
    rzpGw: document.getElementById('line-rzp-gw'),
    gwBank: document.getElementById('line-gw-bank'),
    bankMerch: document.getElementById('line-bank-merchant')
  };

  function resetVisuals() {
    Object.values(nodes).forEach(n => {
      if (n) n.setAttribute('class', 'flow-node');
    });
    Object.values(lines).forEach(l => {
      if (l) l.setAttribute('class', 'flow-line');
    });
    if (otpModal) otpModal.style.display = 'none';
    if (successOverlay) successOverlay.style.display = 'none';
    if (logContainer) logContainer.innerHTML = '';
  }

  function setNodeState(nodeKey, state) {
    const el = nodes[nodeKey];
    if (el) {
      el.classList.add(state);
    }
  }

  function setLineState(lineKey, state) {
    const el = lines[lineKey];
    if (el) {
      el.classList.add(state);
    }
  }

  let activeTimeoutIds = [];
  function runWithDelay(fn, delay) {
    const t = setTimeout(fn, delay);
    activeTimeoutIds.push(t);
  }

  function clearSimulationTimeouts() {
    activeTimeoutIds.forEach(clearTimeout);
    activeTimeoutIds = [];
  }

  // CARD PAYMENT DEMO
  const btnPayCard = document.getElementById('btn-pay-card');
  if (btnPayCard) {
    btnPayCard.addEventListener('click', () => {
      clearSimulationTimeouts();
      resetVisuals();
      writeLog('[CARD] Initializing secure checkout payload...', 'info');
      setNodeState('customer', 'active');
      
      runWithDelay(() => {
        writeLog('[CARD] Initiating API handshake with Razorpay servers...', 'info');
        setLineState('custRzp', 'active');
        setNodeState('rzp', 'active');
      }, 800);

      runWithDelay(() => {
        writeLog('[CARD] Encrypting card details and tokenizing card data...', 'info');
      }, 1600);

      runWithDelay(() => {
        writeLog('[CARD] Dynamic routing check: Sending request to Visa/Mastercard network...', 'info');
        setLineState('rzpGw', 'active');
        setNodeState('gw', 'active');
      }, 2400);

      runWithDelay(() => {
        writeLog('[CARD] 3D-Secure 2.0 verification requested. Waiting for user authorization...', 'warn');
        if (otpModal) otpModal.style.display = 'flex';
      }, 3400);
    });
  }

  // OTP Verification
  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener('click', () => {
      const code = otpInput ? otpInput.value : '482934';
      writeLog(`[CARD] OTP code (${code}) submitted. Verifying auth token...`, 'info');
      
      if (otpModal) otpModal.style.display = 'none';

      runWithDelay(() => {
        writeLog('[CARD] OTP authorized! Sending request to Issuer bank for balance checks...', 'success');
        setLineState('gwBank', 'active');
        setNodeState('bank', 'active');
      }, 800);

      runWithDelay(() => {
        writeLog('[CARD] Settlement: Transferring funds to Merchant holding ledger...', 'info');
        setLineState('bankMerch', 'active');
        setNodeState('merchant', 'active');
      }, 1800);

      runWithDelay(() => {
        writeLog('[SUCCESS] Payment completed! Merchant dashboard updated.', 'success');
        Object.keys(nodes).forEach(k => setNodeState(k, 'success'));
        Object.keys(lines).forEach(k => setLineState(k, 'success'));
        if (successOverlay) successOverlay.style.display = 'flex';
      }, 2800);
    });
  }

  // UPI DEMO
  const btnPayUpi = document.getElementById('btn-pay-upi');
  if (btnPayUpi) {
    btnPayUpi.addEventListener('click', () => {
      clearSimulationTimeouts();
      resetVisuals();
      const vpa = document.getElementById('upi-vpa') ? document.getElementById('upi-vpa').value : 'user@upi';
      writeLog(`[UPI] Request sent to VPA address: ${vpa}`, 'info');
      setNodeState('customer', 'active');
      
      runWithDelay(() => {
        writeLog('[UPI] Resolving UPI address against NPCI lookup ledger...', 'info');
        setLineState('custRzp', 'active');
        setNodeState('rzp', 'active');
      }, 800);

      runWithDelay(() => {
        writeLog('[UPI] Routing request directly to BHIM/UPI processing switch...', 'info');
        setLineState('rzpGw', 'active');
        setNodeState('gw', 'active');
      }, 1600);

      runWithDelay(() => {
        writeLog('[UPI] NPCI: Pushing collect notification message to customer UPI app...', 'warn');
      }, 2400);

      runWithDelay(() => {
        writeLog('[UPI] Customer authorized transaction in UPI App using PIN.', 'success');
        setLineState('gwBank', 'active');
        setNodeState('bank', 'active');
      }, 3600);

      runWithDelay(() => {
        writeLog('[UPI] Settlement: Crediting merchant balance via Instant Settlements...', 'info');
        setLineState('bankMerch', 'active');
        setNodeState('merchant', 'active');
      }, 4400);

      runWithDelay(() => {
        writeLog('[SUCCESS] UPI Payment completed! Merchant wallet loaded.', 'success');
        Object.keys(nodes).forEach(k => setNodeState(k, 'success'));
        Object.keys(lines).forEach(k => setLineState(k, 'success'));
        if (successOverlay) successOverlay.style.display = 'flex';
      }, 5400);
    });
  }

  // NETBANKING DEMO
  const btnPayNb = document.getElementById('btn-pay-nb');
  if (btnPayNb) {
    btnPayNb.addEventListener('click', () => {
      clearSimulationTimeouts();
      resetVisuals();
      const activeNB = document.querySelector('.nb-bank-btn.active');
      const bankName = activeNB ? activeNB.textContent : 'HDFC Bank';
      
      writeLog(`[NETBANKING] Redirecting to ${bankName} portal integration...`, 'info');
      setNodeState('customer', 'active');
      
      runWithDelay(() => {
        writeLog('[NETBANKING] Establishing tunnel with partner bank Netbanking API...', 'info');
        setLineState('custRzp', 'active');
        setNodeState('rzp', 'active');
      }, 800);

      runWithDelay(() => {
        writeLog('[NETBANKING] Sending request payload to Acquiring bank console...', 'info');
        setLineState('rzpGw', 'active');
        setNodeState('gw', 'active');
      }, 1600);

      runWithDelay(() => {
        writeLog(`[NETBANKING] Bank portal authorized. Debiting ${bankName} core savings ledger...`, 'success');
        setLineState('gwBank', 'active');
        setNodeState('bank', 'active');
      }, 2600);

      runWithDelay(() => {
        writeLog('[NETBANKING] Reconciliation: Smart Collect verified bank reference number...', 'info');
        setLineState('bankMerch', 'active');
        setNodeState('merchant', 'active');
      }, 3400);

      runWithDelay(() => {
        writeLog('[SUCCESS] Netbanking payment verified! Settlement processed.', 'success');
        Object.keys(nodes).forEach(k => setNodeState(k, 'success'));
        Object.keys(lines).forEach(k => setLineState(k, 'success'));
        if (successOverlay) successOverlay.style.display = 'flex';
      }, 4200);
    });
  }

  // Reset
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      clearSimulationTimeouts();
      resetVisuals();
      writeLog('[SYSTEM] Simulation terminal reset. Waiting for input...', 'info');
    });
  }

    // =====================================================
  // INTERACTIVE TIME MACHINE SLIDER
  // =====================================================
  const timelineData = [
    {
      year: "2014",
      title: "Founded in Jaipur",
      description: "Harshil Mathur & Shashank Kumar pivot from a crowdfunding idea after experiencing India's payment infrastructure nightmare firsthand. Bootstrapped from a tin-roofed room.",
      tags: ["Founding"],
      stats: { valuation: 0, merchants: 10, tps: 1 }
    },
    {
      year: "2015",
      title: "Y Combinator W15 & Public Launch",
      description: "Accepted into YC's Winter 2015 batch — only the second India-focused startup selected. Launched at Demo Day. Series A ($9M) led by Tiger Global.",
      tags: ["YC W15", "Series A"],
      stats: { valuation: 9000000, merchants: 1000, tps: 15 }
    },
    {
      year: "2017",
      title: "Razorpay 2.0 — Multi-Product Suite",
      description: "Launched Subscriptions, Invoices, and Route. Became India's first UPI-led payment gateway, riding the wave of UPI adoption.",
      tags: ["Product Expansion", "UPI"],
      stats: { valuation: 100000000, merchants: 20000, tps: 150 }
    },
    {
      year: "2018",
      title: "RazorpayX & Capital Launch",
      description: "Launched RazorpayX (neo-banking) and Razorpay Capital (lending) at FTX event, marking the expansion beyond payments. Series B ($20M).",
      tags: ["Banking", "Lending", "Series B"],
      stats: { valuation: 200000000, merchants: 100000, tps: 400 }
    },
    {
      year: "2019",
      title: "Series C & First Acquisitions",
      description: "Raised $75M (Series C). Acquired Thirdwatch (fraud detection) and Opfin (payroll), which became RazorpayX Payroll.",
      tags: ["Series C", "M&A"],
      stats: { valuation: 450000000, merchants: 350000, tps: 800 }
    },
    {
      year: "2020",
      title: "Unicorn Status 🦄",
      description: "Raised $100M (Series D) at $1B valuation — officially a unicorn. Launched RazorpayX Corporate Cards.",
      tags: ["Unicorn", "Series D"],
      stats: { valuation: 1000000000, merchants: 1000000, tps: 1500 }
    },
    {
      year: "2021",
      title: "Peak Valuation 🚀 $7.5 Billion",
      description: "Raised $535M across Series E and F rounds. Peak valuation of $7.5B. Acquired TERA Finlabs (AI risk).",
      tags: ["$7.5B Valuation", "Series E & F"],
      stats: { valuation: 7500000000, merchants: 5000000, tps: 3500 }
    },
    {
      year: "2022",
      title: "Acquisition Spree & International Expansion",
      description: "Acquired Curlec (Malaysia), Ezetap (POS), PoshVine (loyalty), and IZealiant Technologies (bank tech). Launched Magic Checkout.",
      tags: ["4 Acquisitions", "Malaysia"],
      stats: { valuation: 7500000000, merchants: 8000000, tps: 5000 }
    },
    {
      year: "2023",
      title: "RBI PA License & Profitability Focus",
      description: "Received final RBI Payment Aggregator (Online) license. Shifted focus to profitability. Acquired Billme (digital invoicing). Launched Optimizer.",
      tags: ["RBI License", "Profitability"],
      stats: { valuation: 7500000000, merchants: 10000000, tps: 7000 }
    },
    {
      year: "2024",
      title: "$150B+ TPV & AI Integration",
      description: "Surpassed $150B annualized TPV. Core online payments business achieves EBITDA-positive status. Launched Razorpay Ray (AI assistant).",
      tags: ["EBITDA Positive", "AI"],
      stats: { valuation: 7200000000, merchants: 11000000, tps: 9000 }
    },
    {
      year: "2025",
      title: "Reverse Flip & Singapore Expansion",
      description: "Completed reverse flip to India (May 2025). Expanded to Singapore. Received PA-CB license (Dec). Revenue hit ₹3,783 crore in FY25 (65% YoY growth).",
      tags: ["Reverse Flip", "Singapore", "PA-CB"],
      stats: { valuation: 6000000000, merchants: 12000000, tps: 11000 }
    },
    {
      year: "2026",
      title: "IPO Filing & PA-P License",
      description: "Received PA-P license (Jan). Filed confidential DRHP with SEBI (June 12, 2026). Targeting IPO by end of 2026 at $5–6B valuation. Bankers: Axis Capital, Kotak, J.P. Morgan, Citi.",
      tags: ["IPO Filing", "DRHP", "PA-P License"],
      stats: { valuation: 5600000000, merchants: 12500000, tps: 12000 }
    }
  ];

  const yCoords = [100, 98, 92, 88, 83, 75, 20, 20, 20, 22, 29, 32];
  const stepX = (480 - 20) / 11; // 41.81

  const tmSlider = document.getElementById('tmSlider');
  const tmSliderTicks = document.querySelectorAll('#tmSliderTicks .tm-tick');
  const tmValuation = document.getElementById('tmValuation');
  const tmMerchants = document.getElementById('tmMerchants');
  const tmSpeed = document.getElementById('tmSpeed');
  const tmDisplayCard = document.getElementById('tmDisplayCard');
  const tmDisplayYear = document.getElementById('tmDisplayYear');
  const tmDisplayTitle = document.getElementById('tmDisplayTitle');
  const tmDisplayDesc = document.getElementById('tmDisplayDesc');
  const tmDisplayTags = document.getElementById('tmDisplayTags');
  const tmActivePath = document.getElementById('tmActivePath');
  const tmCursor = document.getElementById('tmCursor');

  let prevStats = { valuation: 5600000000, merchants: 12500000, tps: 12000 };
  let currentAnimationFrames = { valuation: null, merchants: null, tps: null };

  function animateOdometer(element, key, startVal, endVal, isValuation, isMerchants) {
    if (currentAnimationFrames[key]) {
      cancelAnimationFrame(currentAnimationFrames[key]);
    }

    const duration = 500; // ms
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // Ease out quad

      const currentVal = Math.round(startVal + (endVal - startVal) * ease);

      let displayText = "";
      if (isValuation) {
        if (currentVal === 0) displayText = "$0";
        else if (currentVal >= 1000000000) {
          displayText = "$" + (currentVal / 1000000000).toFixed(1) + "B";
        } else {
          displayText = "$" + (currentVal / 1000000).toFixed(0) + "M";
        }
      } else if (isMerchants) {
        if (currentVal >= 1000000) {
          displayText = (currentVal / 1000000).toFixed(currentVal >= 10000000 ? 0 : 1) + "M+";
        } else if (currentVal >= 1000) {
          displayText = (currentVal / 1000).toFixed(0) + "K";
        } else {
          displayText = currentVal.toString();
        }
      } else {
        displayText = currentVal.toLocaleString('en-US') + " TPS";
      }

      element.textContent = displayText;

      if (progress < 1) {
        currentAnimationFrames[key] = requestAnimationFrame(step);
      } else {
        currentAnimationFrames[key] = null;
      }
    }

    currentAnimationFrames[key] = requestAnimationFrame(step);
  }

  function updateTimeMachine(index, animate = true) {
    const data = timelineData[index];
    if (!data) return;

    if (tmSlider && parseInt(tmSlider.value) !== index) {
      tmSlider.value = index;
    }

    tmSliderTicks.forEach((tick, i) => {
      tick.classList.toggle('active', i === index);
    });

    if (tmDisplayCard) {
      tmDisplayCard.classList.add('morph-out');
      
      setTimeout(() => {
        if (tmDisplayYear) tmDisplayYear.textContent = data.year;
        if (tmDisplayTitle) tmDisplayTitle.textContent = data.title;
        if (tmDisplayDesc) tmDisplayDesc.textContent = data.description;
        
        if (tmDisplayTags) {
          tmDisplayTags.innerHTML = '';
          data.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'timeline-tag';
            tagSpan.textContent = tag;
            tmDisplayTags.appendChild(tagSpan);
          });
        }
        
        tmDisplayCard.classList.remove('morph-out');
      }, 200);
    }

    if (animate) {
      if (tmValuation) animateOdometer(tmValuation, 'valuation', prevStats.valuation, data.stats.valuation, true, false);
      if (tmMerchants) animateOdometer(tmMerchants, 'merchants', prevStats.merchants, data.stats.merchants, false, true);
      if (tmSpeed) animateOdometer(tmSpeed, 'tps', prevStats.tps, data.stats.tps, false, false);
    } else {
      if (tmValuation) {
        tmValuation.textContent = data.stats.valuation === 0 ? "$0" : 
          (data.stats.valuation >= 1000000000 ? "$" + (data.stats.valuation/1000000000).toFixed(1) + "B" : "$" + (data.stats.valuation/1000000).toFixed(0) + "M");
      }
      if (tmMerchants) {
        tmMerchants.textContent = data.stats.merchants >= 1000000 ? (data.stats.merchants/1000000).toFixed(data.stats.merchants >= 10000000 ? 0 : 1) + "M+" : data.stats.merchants;
      }
      if (tmSpeed) {
        tmSpeed.textContent = data.stats.tps.toLocaleString() + " TPS";
      }
    }

    prevStats = { ...data.stats };

    if (tmActivePath) {
      let pathD = "M 20 100";
      for (let i = 1; i <= index; i++) {
        const x = 20 + i * stepX;
        const y = yCoords[i];
        pathD += ` L ${x} ${y}`;
      }
      tmActivePath.setAttribute('d', pathD);
    }

    if (tmCursor) {
      const activeX = 20 + index * stepX;
      const activeY = yCoords[index];
      tmCursor.setAttribute('cx', activeX);
      tmCursor.setAttribute('cy', activeY);
    }
  }

  updateTimeMachine(11, false);

  if (tmSlider) {
    tmSlider.addEventListener('input', (e) => {
      updateTimeMachine(parseInt(e.target.value), true);
    });
  }

  tmSliderTicks.forEach(tick => {
    tick.addEventListener('click', () => {
      const index = parseInt(tick.getAttribute('data-index'));
      updateTimeMachine(index, true);
    });
  });

  // ─── DYNAMIC WORLD MAP SVG LOADER ───
  const mapHolder = document.getElementById('geoMapSvgHolder');
  if (mapHolder) {
    fetch('world-map.svg')
      .then(response => {
        if (!response.ok) throw new Error('Network error loading map');
        return response.text();
      })
      .then(data => {
        mapHolder.innerHTML = data;
        const svgElement = mapHolder.querySelector('svg');
        if (svgElement) {
          svgElement.removeAttribute('style');
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
        }
      })
      .catch(err => {
        console.error('Error loading world map:', err);
      });
  }

  // Center geography map scroll container on India initially for mobile users
  const schematicWrapper = document.querySelector('.geo-schematic-wrapper');
  if (schematicWrapper) {
    setTimeout(() => {
      const scrollWidth = schematicWrapper.scrollWidth;
      const clientWidth = schematicWrapper.clientWidth;
      if (scrollWidth > clientWidth) {
        schematicWrapper.scrollLeft = (scrollWidth - clientWidth) * 0.65;
      }
    }, 1000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProfilePage);
} else {
  initializeProfilePage();
}

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
        updateFlowLines();
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
      setTimeout(updateFlowLines, 50);
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
      if (n) n.className = 'flow-node';
    });
    Object.values(lines).forEach(l => {
      if (l) l.className = 'flow-line';
    });
    if (otpModal) otpModal.style.display = 'none';
    if (successOverlay) successOverlay.style.display = 'none';
    if (logContainer) logContainer.innerHTML = '';
    updateFlowLines();
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

  // Dynamic SVG path calculator
  function updateFlowLines() {
    const customer = document.querySelector('#node-customer .node-icon-box');
    const rzp = document.querySelector('#node-rzp .node-icon-box');
    const gw = document.querySelector('#node-gw .node-icon-box');
    const bank = document.querySelector('#node-bank .node-icon-box');
    const merchant = document.querySelector('#node-merchant .node-icon-box');
    
    const svg = document.querySelector('.flow-connections-svg');
    if (!svg || !customer || !rzp || !gw || !bank || !merchant) return;
    const svgRect = svg.getBoundingClientRect();
    
    function getCenter(el) {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - svgRect.left + r.width / 2,
        y: r.top - svgRect.top + r.height / 2
      };
    }
    
    const p1 = getCenter(customer);
    const p2 = getCenter(rzp);
    const p3 = getCenter(gw);
    const p4 = getCenter(bank);
    const p5 = getCenter(merchant);
    
    lines.custRzp.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
    lines.rzpGw.setAttribute('d', `M ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`);
    lines.gwBank.setAttribute('d', `M ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`);
    lines.bankMerch.setAttribute('d', `M ${p4.x} ${p4.y} L ${p5.x} ${p5.y}`);
  }

  window.addEventListener('resize', updateFlowLines);
  setTimeout(updateFlowLines, 800); // Wait for animations to settle

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProfilePage);
} else {
  initializeProfilePage();
}

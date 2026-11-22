/**
 * Twinstella Research - Academic & Scientific Publishing Services
 * Core Interactive Scripts (Unslop Design Standard)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initFeeCalculator();
  initServiceTabs();
  initFaqAccordion();
  initSubmissionModal();
  initMetricsAnimation();
  initContactForm();
});

/* 1. Header Elevation on Scroll */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Mobile Navigation Drawer */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('mobile-open') && !navMenu.contains(e.target) && !toggle.contains(e.target)) {
      navMenu.classList.remove('mobile-open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* 3. Transparent Fee & Turnaround Estimator (International Launch Rates) */
function initFeeCalculator() {
  const serviceEl = document.getElementById('calc-service');
  const sliderEl = document.getElementById('calc-words-range');
  const wordDisplay = document.getElementById('calc-words-val');
  const speedInputs = document.querySelectorAll('input[name="calc-speed"]');
  const priceDisplay = document.getElementById('calc-price-val');
  const timeDisplay = document.getElementById('calc-time-val');
  const submitCta = document.getElementById('calc-quote-btn');

  if (!sliderEl || !wordDisplay || !priceDisplay) return;

  const rates = {
    'manuscript': { baseUSD: 399, perWord: 0, isPerWord: false, days: '5-7 Days', name: 'AI/ML Manuscript Readiness' },
    'experiments': { baseUSD: 499, perWord: 0, isPerWord: false, days: '7-10 Days', name: 'ML Experiment Support' },
    'foundation': { baseUSD: 199, perWord: 0, isPerWord: false, days: '4-6 Days', name: 'AI Research Foundation' },
    'collaboration': { baseUSD: 1000, perWord: 0, isPerWord: false, days: '14-21 Days', name: 'AI Research Collaboration' },
    'language-editing': { baseUSD: 0, perWord: 0.08, isPerWord: true, days: '3-5 Days', name: 'Technical Academic Editing ($0.08/word)' },
    'model-impl': { baseUSD: 350, perWord: 0, isPerWord: false, days: '5-8 Days', name: 'ML / Deep Learning Implementation' },
    'venue-format': { baseUSD: 75, perWord: 0, isPerWord: false, days: '2-3 Days', name: 'IEEE / Springer / Elsevier Formatting' },
    'data-prep': { baseUSD: 150, perWord: 0, isPerWord: false, days: '3-5 Days', name: 'Dataset Exploration & Preprocessing' },
    'reviewer-response': { baseUSD: 120, perWord: 0, isPerWord: false, days: '3-4 Days', name: 'Reviewer Response Consultation' }
  };

  const speedMultipliers = {
    'standard': { mult: 1.0, text: '5-7 Business Days' },
    'express': { mult: 1.35, text: '3-4 Business Days' },
    'priority': { mult: 1.75, text: '24-48 Hours (Priority Track)' }
  };

  function update() {
    const sKey = serviceEl ? serviceEl.value : 'manuscript';
    const cfg = rates[sKey] || rates['manuscript'];
    const words = parseInt(sliderEl.value, 10);

    wordDisplay.textContent = `${words.toLocaleString()} words`;

    let selectedSpeed = 'standard';
    speedInputs.forEach(radio => {
      if (radio.checked) selectedSpeed = radio.value;
    });

    const spData = speedMultipliers[selectedSpeed] || speedMultipliers['standard'];
    let totalUSD = 0;

    if (cfg.isPerWord) {
      totalUSD = Math.round(words * cfg.perWord * spData.mult);
    } else {
      // Scale moderately with word count beyond 4000 words
      const scaleFactor = words > 4000 ? 1 + ((words - 4000) / 8000) * 0.4 : 1.0;
      totalUSD = Math.round(cfg.baseUSD * scaleFactor * spData.mult);
    }

    const approxBDT = Math.round(totalUSD * 122);
    priceDisplay.textContent = `$${totalUSD.toLocaleString()} USD`;
    const subPrice = document.querySelector('.summary-price-sub');
    if (subPrice) subPrice.textContent = `≈ ৳ ${approxBDT.toLocaleString()} BDT (starting price)`;
    if (timeDisplay) timeDisplay.textContent = spData.text;
  }

  sliderEl.addEventListener('input', update);
  if (serviceEl) serviceEl.addEventListener('change', update);
  speedInputs.forEach(r => r.addEventListener('change', update));

  update();

  if (submitCta) {
    submitCta.addEventListener('click', () => {
      const sVal = serviceEl ? serviceEl.value : 'manuscript';
      const wVal = sliderEl.value;
      if (window.openSubmitModal) window.openSubmitModal(sVal, wVal);
    });
  }
}

/* 4. Categorized Services Tabs */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.s-tab-btn');
  const cards = document.querySelectorAll('.academic-service-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 5. Minimal Accordion for FAQs */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.faq-row-item');
      const wasOpen = row.classList.contains('open');

      document.querySelectorAll('.faq-row-item').forEach(r => r.classList.remove('open'));

      if (!wasOpen) {
        row.classList.add('open');
      }
    });
  });
}

/* 6. Submission Modal & Drag/Drop */
function initSubmissionModal() {
  const modal = document.getElementById('submit-modal');
  const closeBtn = document.querySelector('.modal-dismiss');
  const triggers = document.querySelectorAll('.open-modal-trigger');
  const modalService = document.getElementById('modal-service');
  const modalWords = document.getElementById('modal-words');
  const dropzone = document.getElementById('modal-dropzone');
  const fileInput = document.getElementById('modal-file-input');
  const fileLabel = document.getElementById('modal-filename');
  const form = document.getElementById('modal-project-form');

  if (!modal) return;

  window.openSubmitModal = function(serviceKey, words) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (modalService && serviceKey) modalService.value = serviceKey;
    if (modalWords && words) modalWords.value = words;
  };

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const s = btn.getAttribute('data-service') || 'editing';
      window.openSubmitModal(s, 3500);
    });
  });

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--brand-blue)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-medium)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-medium)';
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        showFile(fileInput.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) showFile(fileInput.files[0]);
    });
  }

  function showFile(file) {
    if (!fileLabel) return;
    fileLabel.textContent = `Attached: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    fileLabel.style.color = 'var(--brand-blue)';
    fileLabel.style.fontWeight = '600';
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modal-name')?.value || 'Researcher';
      const email = document.getElementById('modal-email')?.value || '';
      const phone = document.getElementById('modal-phone')?.value || '';
      const service = modalService ? modalService.options[modalService.selectedIndex]?.text : 'Academic Service';
      const wordCount = modalWords?.value || 'N/A';
      const notes = document.getElementById('modal-notes')?.value || '';

      const waMsg = encodeURIComponent(
        `*Twinstella Research - Project Assessment*\n\n` +
        `• *Client:* ${name}\n` +
        `• *Email:* ${email}\n` +
        `• *WhatsApp:* ${phone}\n` +
        `• *Service:* ${service}\n` +
        `• *Scope:* ${wordCount} words\n` +
        `• *Notes:* ${notes}\n\n` +
        `Requesting formal assessment and quotation.`
      );

      closeModal();
      showToastBar(`Thank you, ${name}. Connecting to Twinstella Academic Advisor...`);

      setTimeout(() => {
        window.open(`https://wa.me/8801877601112?text=${waMsg}`, '_blank');
      }, 1000);
    });
  }
}

/* 7. Animated Metrics Figures */
function initMetricsAnimation() {
  const figures = document.querySelectorAll('[data-target]');
  if (!figures.length) return;

  let executed = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !executed) {
        executed = true;
        figures.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const isFloat = target % 1 !== 0;
          let current = 0;
          const step = target / (1500 / 25);

          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toString();
          }, 25);
        });
      }
    });
  }, { threshold: 0.25 });

  const section = document.querySelector('.metrics-strip');
  if (section) observer.observe(section);
}

/* 8. Contact Form Direct Routing */
function initContactForm() {
  const form = document.getElementById('direct-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name')?.value || 'Client';
    const email = document.getElementById('cf-email')?.value || '';
    const phone = document.getElementById('cf-phone')?.value || '';
    const service = document.getElementById('cf-subject')?.value || 'General Inquiry';
    const msg = document.getElementById('cf-message')?.value || '';

    const waMsg = encodeURIComponent(
      `*Twinstella Research - Direct Message*\n\n` +
      `• *From:* ${name}\n` +
      `• *Email:* ${email}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Service:* ${service}\n` +
      `• *Message:* ${msg}`
    );

    showToastBar(`Message received! Opening WhatsApp advisor...`);
    form.reset();

    setTimeout(() => {
      window.open(`https://wa.me/8801877601112?text=${waMsg}`, '_blank');
    }, 1000);
  });
}

/* 9. Minimal Notification Bar */
function showToastBar(message) {
  let toast = document.querySelector('.toast-bar');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-bar';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

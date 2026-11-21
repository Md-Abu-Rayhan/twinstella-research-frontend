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

/* 3. Transparent Fee & Turnaround Estimator (Editage Model) */
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
    'editing': { base: 1400, unit: 1000, days: '5-7 Days' },
    'thesis': { base: 1800, unit: 1000, days: '7-10 Days' },
    'stats': { base: 3500, unit: 2000, days: '4-6 Days' },
    'literature': { base: 1900, unit: 1000, days: '6-8 Days' },
    'proposal': { base: 2200, unit: 1000, days: '4-5 Days' },
    'methodology': { base: 2500, unit: 1500, days: '4-6 Days' },
    'journal-format': { base: 1200, unit: 1000, days: '3-4 Days' },
    'plagiarism': { base: 900, unit: 1000, days: '2-3 Days' },
    'publication-package': { base: 4800, unit: 1000, days: '10-14 Days' }
  };

  const speedMultipliers = {
    'standard': { mult: 1.0, text: '5-7 Business Days' },
    'express': { mult: 1.35, text: '3-4 Business Days' },
    'priority': { mult: 1.75, text: '24-48 Hours (Express)' }
  };

  function update() {
    const sKey = serviceEl ? serviceEl.value : 'editing';
    const cfg = rates[sKey] || rates['editing'];
    const words = parseInt(sliderEl.value, 10);

    wordDisplay.textContent = `${words.toLocaleString()} words`;

    let selectedSpeed = 'standard';
    speedInputs.forEach(radio => {
      if (radio.checked) selectedSpeed = radio.value;
    });

    const spData = speedMultipliers[selectedSpeed] || speedMultipliers['standard'];
    const units = Math.max(1, words / cfg.unit);
    let total = Math.round(cfg.base * units * spData.mult);

    if (total < cfg.base) total = cfg.base;

    const approxUSD = Math.round(total / 122);
    priceDisplay.textContent = `৳ ${total.toLocaleString()}`;
    if (timeDisplay) timeDisplay.textContent = spData.text;
  }

  sliderEl.addEventListener('input', update);
  if (serviceEl) serviceEl.addEventListener('change', update);
  speedInputs.forEach(r => r.addEventListener('change', update));

  update();

  if (submitCta) {
    submitCta.addEventListener('click', () => {
      const sVal = serviceEl ? serviceEl.value : 'editing';
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
  const figures = document.querySelectorAll('.metric-figure[data-target]');
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

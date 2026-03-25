const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-nav');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
  });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href === '#') return;
  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navList && navList.classList.contains('show')) {
      navList.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const plan = document.getElementById('plan');
    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errPlan = document.getElementById('err-plan');
    const success = document.getElementById('form-success');

    let ok = true;
    if (!name.value.trim()) { errName.textContent = 'Lütfen ad soyad girin.'; ok = false; } else { errName.textContent = ''; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) { errEmail.textContent = 'Geçerli bir e-posta girin.'; ok = false; } else { errEmail.textContent = ''; }
    if (!plan.value) { errPlan.textContent = 'Bir plan seçin.'; ok = false; } else { errPlan.textContent = ''; }
    if (!ok) return;
    setTimeout(() => { success.hidden = false; form.reset(); }, 300);
  });
}

// Basic event tracking helper
function trackEvent(name, detail) {
  try {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...detail });
    }
  } catch (_) {}
  // Always log for debugging
  console.log('[track]', name, detail || {});
}

// Attach click tracking to any element with data-track
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-track]');
  if (!t) return;
  const name = t.getAttribute('data-track');
  const href = t.getAttribute('href') || '';
  trackEvent(name, { href });
});

// Lightbox functionality
(function() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  if (galleryItems.length === 0) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Kapat">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Önceki">‹</button>
      <img src="" alt="">
      <button class="lightbox-nav lightbox-next" aria-label="Sonraki">›</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    const imgSrc = item.getAttribute('href');
    lightboxImg.src = imgSrc;
    lightboxImg.alt = item.querySelector('img')?.alt || 'Galeri';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavButtons();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateNavButtons() {
    lightboxPrev.style.display = items.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = items.length > 1 ? 'flex' : 'none';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

// Instagram embed fallback
(function() {
  const instagramWidget = document.querySelector('.instagram-widget');
  const instagramFallback = document.querySelector('.instagram-fallback');
  const instagramIframe = instagramWidget?.querySelector('iframe');
  
  if (!instagramWidget || !instagramFallback || !instagramIframe) return;

  // iframe yüklenme kontrolü
  let loadTimeout;
  let hasLoaded = false;
  let iframeLoadEventFired = false;

  function checkIframeLoad() {
    if (hasLoaded) return;
    
    // iframe içeriği yüklenmiş mi kontrol et
    try {
      const iframeDoc = instagramIframe.contentDocument || instagramIframe.contentWindow?.document;
      if (iframeDoc && iframeDoc.body && iframeDoc.body.children.length > 0) {
        hasLoaded = true;
        clearTimeout(loadTimeout);
        return;
      }
    } catch (e) {
      // Cross-origin ise contentDocument'e erişemeyiz.
      // Yine de iframe'de load event'i tetlendiyse, yüklenmiş kabul ediyoruz.
      if (iframeLoadEventFired) {
        hasLoaded = true;
        clearTimeout(loadTimeout);
      }
      return;
    }
  }

  // iframe load event
  instagramIframe.addEventListener('load', () => {
    iframeLoadEventFired = true;
    checkIframeLoad();
  });

  // 5 saniye sonra hala yüklenmemişse fallback göster
  loadTimeout = setTimeout(() => {
    if (!hasLoaded) {
      instagramWidget.style.display = 'none';
      instagramFallback.classList.add('show');
    }
  }, 5000);

  // Sayfa yüklendikten sonra kontrol et
  window.addEventListener('load', () => {
    setTimeout(() => {
      checkIframeLoad();
      if (!hasLoaded) {
        setTimeout(() => {
          if (!hasLoaded) {
            instagramWidget.style.display = 'none';
            instagramFallback.classList.add('show');
          }
        }, 3000);
      }
    }, 2000);
  });
})();

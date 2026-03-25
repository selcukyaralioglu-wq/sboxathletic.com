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
    const validation = typeof window.getCurrentValidationMessages === 'function'
      ? window.getCurrentValidationMessages()
      : ['Lütfen ad soyad girin.', 'Geçerli bir e-posta girin.', 'Bir plan seçin.'];
    if (!name.value.trim()) { errName.textContent = validation[0]; ok = false; } else { errName.textContent = ''; }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) { errEmail.textContent = validation[1]; ok = false; } else { errEmail.textContent = ''; }
    if (!plan.value) { errPlan.textContent = validation[2]; ok = false; } else { errPlan.textContent = ''; }
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

// Full TR/EN language mode
(function() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;

  const i18n = {
    tr: {
      nav: ['Hizmetler', 'Ekibimiz', 'Galeri', 'İletişim'],
      heroTitle: 'Gücünü Keşfet, <br><span>Sınırlarını Aş</span>',
      heroP1: 'Modern ekipman, uzman antrenörler ve titiz hijyen standartları. SBOX ile hedeflerine ulaş.',
      heroP2: 'Sınırlı kontenjan, birebir ilgi ve sakin atmosferle butik bir spor salonu deneyimi.',
      heroMaps: "Google Maps'te Bize Ulaş",
      heroStats: ['Ders', 'Memnuniyet', 'Spor Deneyimi'],
      servicesHead: ['Hizmetler', 'Hedeflerine göre uzmanlaşmış dokuz hizmet alanı.'],
      serviceBadges: ['Dövüş Sporları', 'Fonksiyonel Alan', 'Kişiye Özel', 'Stüdyo Dersleri', 'Sağlık & Recovery', 'Performans', 'Beslenme', 'Ek İmkan', 'Sosyal Alan'],
      serviceTitles: ['Kickboks, Boks & Muaythai', 'GYM', 'Personal Trainer', 'Pilates & Reformer Pilates', 'Fizyoterapi & Sporcu Recovery', 'Atletik Performans', 'Diyetisyen', 'Açık Yüzme Havuzu', 'Cafe & Rest'],
      serviceTexts: [
        'Bilimsel temelli ve branşa özel metotlarla yüksek seviyede sporcu gelişimi sağlıyoruz. Performans analizi ve teknik odaklı yaklaşımımızla ulusal ve uluslararası standartlara hazırlıyoruz. Üyeliğe GYM dahildir.',
        'Esnek üyelik seçenekleri, kaliteli ekipman ve temiz-hijyenik antrenman ortamı.',
        'Kişiye özel antrenman planı, beslenme yönlendirmesi ve sürdürülebilir motivasyon desteği.',
        'Bireysel ve küçük grup dersleriyle güç, denge, postür ve derin kas aktivasyonu.',
        'Manuel terapi, egzersiz tedavisi, recovery seansları ve sakatlık önleme programları.',
        'Hız, çeviklik, kuvvet ve branşa özel performans gelişimi odaklı çalışmalar.',
        'Vücut analizi, danışmanlık ve aylık planlarla sürdürülebilir beslenme yönetimi.',
        'Açık havada ferah havuz deneyimi ve antrenman sonrası aktif toparlanma imkanı.',
        'Antrenman öncesi/sonrası dinlenebileceğiniz, sağlıklı seçenekler sunan konforlu cafe alanı.'
      ],
      teamHead: ['Ekibimiz', 'Alanında uzman, sertifikalı ve motive edici ekip.'],
      trainerBadges: ['Kurucu - Direktör', 'Fizyoterapi', 'Performans', 'Kişiye Özel', 'Beslenme', 'Operasyon', 'Operasyon', 'Stüdyo Dersleri'],
      trainerTitles: [
        'Baş Antrenör • Kuvvet & Kondisyon • Atletik Performans • Kickboks & Boks & Muaythai',
        'Müdür • Uzman Fizyoterapist',
        'Tenis Antrenörü • Performans Antrenörü',
        'Personal Trainer',
        'Uzman Diyetisyen',
        'Sorumlu',
        'Görevli Sorumlu',
        'Reformer Pilates Eğitmeni'
      ],
      reviewHead: ['Üye Yorumları', 'Topluluğumuzdan gerçek başarı hikayeleri.'],
      reviewBadges: ['Gerçek Deneyim', 'Kulüp Atmosferi', 'Butik Deneyim'],
      reviewTexts: [
        'Programlar gerçekten kişiye göre. Kısa sürede sonuç aldım.',
        'Ekip motive edici, ortam çok temiz ve profesyonel.',
        'Kalabalık olmayan, sakin ve odaklı atmosferiyle her antrenman çok verimli geçiyor.'
      ],
      reviewCites: ['— Elif • Pro Üye', '— Baran • Başlangıç', '— Duygu • Elit'],
      galleryHead: ['Galeri', 'Instagram\'dan son paylaşımlarımız. Daha fazlası için <a href="https://www.instagram.com/sboxathletic/" target="_blank" rel="noopener">@sboxathletic</a>.'],
      instaFallback: 'Instagram içeriği yüklenemedi. <a href="https://www.instagram.com/sboxathletic/" target="_blank" rel="noopener">Instagram sayfamızı ziyaret edin</a>.',
      faqHead: ['SSS', 'Merak edilen konular.'],
      faqItems: [
        ['Üyeliğimi dondurabilir miyim?', 'Plan türüne göre dönemsel dondurma hakkı tanımlanır.'],
        ['İlk kez geliyorum, hangi plan uygun?', 'GYM 1 Ay veya Kickboks 4 Ders ile başlayın; danışman görüşmesi ücretsiz.'],
        ['PT dersleri nasıl planlanır?', 'Koçunuzla uygun saatler haftalık olarak planlanır, telafi hakları sunulur.']
      ],
      contactHead: ['İletişim ve Üyelik', 'Formu doldurun ya da aşağıdaki kanallardan bize ulaşın.'],
      form: {
        name: ['Ad Soyad', 'Adınız Soyadınız'],
        email: ['E-posta', 'ornek@mail.com'],
        plan: ['Plan', 'Plan seçin', ['Başlangıç', 'Pro', 'Elit']],
        message: ['Mesaj', 'Hedefleriniz veya sorularınız'],
        submit: 'Gönder',
        success: 'Teşekkürler! En kısa sürede dönüş yapacağız.',
        errors: ['Lütfen ad soyad girin.', 'Geçerli bir e-posta girin.', 'Bir plan seçin.']
      },
      contactCard: ['İletişim', 'Telefon:', 'Adres:', "Google Maps'te konum", 'Çalışma Saatleri', 'Pzt-Cum: 08:00-22:00', 'Cmt: 09:00-19:00'],
      footer: ['Hizmetler', 'Üyelik'],
      mobile: ['Katıl', 'Ara', 'Hızlı eylemler'],
      sticky: "WhatsApp'ta Mesaj Gönder",
      lightbox: ['Kapat', 'Önceki', 'Sonraki', 'Galeri']
    },
    en: {
      nav: ['Services', 'Team', 'Gallery', 'Contact'],
      heroTitle: 'Discover Your Power, <br><span>Push Your Limits</span>',
      heroP1: 'Modern equipment, expert coaches, and strict hygiene standards. Reach your goals with SBOX.',
      heroP2: 'A boutique training experience with limited capacity, personal attention, and a calm atmosphere.',
      heroMaps: 'Find Us on Google Maps',
      heroStats: ['Classes', 'Satisfaction', 'Training Experience'],
      servicesHead: ['Services', 'Nine specialized service areas tailored to your goals.'],
      serviceBadges: ['Combat Sports', 'Functional Area', 'Personalized', 'Studio Classes', 'Health & Recovery', 'Performance', 'Nutrition', 'Extra Facility', 'Social Area'],
      serviceTitles: ['Kickboxing, Boxing & Muay Thai', 'Gym', 'Personal Training', 'Pilates & Reformer Pilates', 'Physiotherapy & Athlete Recovery', 'Athletic Performance', 'Dietitian', 'Outdoor Swimming Pool', 'Cafe & Rest'],
      serviceTexts: [
        'Science-based, sport-specific methods for high-level athlete development. We prepare members for national and international standards with performance analysis and technique-focused coaching. Gym access is included.',
        'Flexible memberships, premium equipment, and a clean, hygienic workout environment.',
        'Personalized training plans, nutrition guidance, and consistent motivation support.',
        'Private and small-group sessions to improve strength, balance, posture, and deep muscle activation.',
        'Manual therapy, exercise-based treatment, recovery sessions, and injury-prevention programs.',
        'Sport-specific sessions focused on speed, agility, strength, and performance development.',
        'Body analysis, coaching, and monthly plans for sustainable nutrition.',
        'A bright open-air pool experience and active post-workout recovery for members.',
        'A comfortable cafe lounge with healthy options for pre- and post-workout rest.'
      ],
      teamHead: ['Our Team', 'Certified professionals focused on expertise, motivation, and results.'],
      trainerBadges: ['Founder - Director', 'Physiotherapy', 'Performance', 'Personalized', 'Nutrition', 'Operations', 'Operations', 'Studio Classes'],
      trainerTitles: [
        'Head Coach • Strength & Conditioning • Athletic Performance • Kickboxing, Boxing & Muay Thai',
        'Manager • Senior Physiotherapist',
        'Tennis Coach • Performance Coach',
        'Personal Trainer',
        'Senior Dietitian',
        'Supervisor',
        'Operations Responsible',
        'Reformer Pilates Instructor'
      ],
      reviewHead: ['Member Reviews', 'Real success stories from our community.'],
      reviewBadges: ['Real Experience', 'Club Atmosphere', 'Boutique Experience'],
      reviewTexts: [
        'Programs are truly personalized. I saw results in a short time.',
        'The team is motivating, and the environment is very clean and professional.',
        'With its calm and focused atmosphere, every session is highly efficient.'
      ],
      reviewCites: ['— Elif • Pro Member', '— Baran • Beginner', '— Duygu • Elite'],
      galleryHead: ['Gallery', 'Our latest Instagram posts. For more, visit <a href="https://www.instagram.com/sboxathletic/" target="_blank" rel="noopener">@sboxathletic</a>.'],
      instaFallback: 'Instagram content could not be loaded. <a href="https://www.instagram.com/sboxathletic/" target="_blank" rel="noopener">Visit our Instagram page</a>.',
      faqHead: ['FAQ', 'Frequently asked questions.'],
      faqItems: [
        ['Can I freeze my membership?', 'Membership freeze options are available depending on your plan type.'],
        ['I am new. Which plan should I choose?', 'Start with 1-Month Gym or 4 Kickboxing sessions; the first consultation is free.'],
        ['How are PT sessions scheduled?', 'Weekly sessions are planned with your coach, and make-up options are provided.']
      ],
      contactHead: ['Contact & Membership', 'Fill in the form or reach us through the channels below.'],
      form: {
        name: ['Full Name', 'Your full name'],
        email: ['Email', 'example@mail.com'],
        plan: ['Plan', 'Select a plan', ['Beginner', 'Pro', 'Elite']],
        message: ['Message', 'Your goals or questions'],
        submit: 'Send',
        success: 'Thank you! We will get back to you shortly.',
        errors: ['Please enter your full name.', 'Please enter a valid email.', 'Please select a plan.']
      },
      contactCard: ['Contact', 'Phone:', 'Address:', 'View on Google Maps', 'Working Hours', 'Mon-Fri: 08:00-22:00', 'Sat: 09:00-19:00'],
      footer: ['Services', 'Membership'],
      mobile: ['Join', 'Call', 'Quick actions'],
      sticky: 'Send WhatsApp Message',
      lightbox: ['Close', 'Previous', 'Next', 'Gallery']
    }
  };

  function applyLanguage(lang) {
    const t = i18n[lang];
    if (!t) return;
    document.documentElement.lang = lang;
    localStorage.setItem('site_lang', lang);
    langToggle.textContent = lang === 'tr' ? 'EN' : 'TR';
    langToggle.setAttribute('aria-label', lang === 'tr' ? 'Switch language to English' : 'Dili Turkceye cevir');

    const navLinks = document.querySelectorAll('#primary-nav li a');
    if (navLinks.length >= 4) {
      navLinks[0].textContent = t.nav[0];
      navLinks[1].textContent = t.nav[1];
      navLinks[2].textContent = t.nav[2];
      navLinks[3].textContent = t.nav[3];
    }

    const heroTitle = document.querySelector('.hero-copy h1');
    const heroPs = document.querySelectorAll('.hero-copy p');
    const mapsBtn = document.querySelector('.hero-cta .btn--primary');
    const heroStats = document.querySelectorAll('.hero-stats li span');
    if (heroTitle) heroTitle.innerHTML = t.heroTitle;
    if (heroPs.length >= 2) {
      heroPs[0].textContent = t.heroP1;
      heroPs[1].textContent = t.heroP2;
    }
    if (mapsBtn) mapsBtn.textContent = t.heroMaps;
    if (heroStats.length >= 3) {
      heroStats[0].textContent = t.heroStats[0];
      heroStats[1].textContent = t.heroStats[1];
      heroStats[2].textContent = t.heroStats[2];
    }

    const servicesHead = document.querySelector('#hizmetler .section-head');
    const serviceCards = document.querySelectorAll('#hizmetler .service');
    if (servicesHead) {
      servicesHead.querySelector('h2').textContent = t.servicesHead[0];
      servicesHead.querySelector('p').textContent = t.servicesHead[1];
    }
    serviceCards.forEach((card, i) => {
      const badge = card.querySelector('.service-badge');
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (badge) badge.textContent = t.serviceBadges[i] || '';
      if (h3) h3.textContent = t.serviceTitles[i] || '';
      if (p) p.textContent = t.serviceTexts[i] || '';
    });

    const teamHead = document.querySelector('#antrenorler .section-head');
    const trainerCards = document.querySelectorAll('#antrenorler .trainer');
    if (teamHead) {
      teamHead.querySelector('h2').textContent = t.teamHead[0];
      teamHead.querySelector('p').textContent = t.teamHead[1];
    }
    trainerCards.forEach((card, i) => {
      const badge = card.querySelector('.trainer-badge');
      const p = card.querySelector('p');
      if (badge) badge.textContent = t.trainerBadges[i] || badge.textContent;
      if (p) p.textContent = t.trainerTitles[i] || p.textContent;
    });

    const reviewHead = document.querySelector('#yorumlar .section-head');
    const reviews = document.querySelectorAll('#yorumlar .quote');
    if (reviewHead) {
      reviewHead.querySelector('h2').textContent = t.reviewHead[0];
      reviewHead.querySelector('p').textContent = t.reviewHead[1];
    }
    reviews.forEach((r, i) => {
      const badge = r.querySelector('.quote-badge');
      const p = r.querySelector('p');
      const cite = r.querySelector('cite');
      if (badge) badge.textContent = t.reviewBadges[i] || badge.textContent;
      if (p) p.textContent = `“${t.reviewTexts[i] || ''}”`;
      if (cite) cite.textContent = t.reviewCites[i] || cite.textContent;
    });

    const galleryHead = document.querySelector('#galeri .section-head');
    if (galleryHead) {
      galleryHead.querySelector('h2').textContent = t.galleryHead[0];
      galleryHead.querySelector('p').innerHTML = t.galleryHead[1];
    }
    const instaFallback = document.querySelector('.instagram-fallback p');
    if (instaFallback) instaFallback.innerHTML = t.instaFallback;

    const faqHead = document.querySelector('.faq .section-head');
    const faqDetails = document.querySelectorAll('.faq details');
    if (faqHead) {
      faqHead.querySelector('h2').textContent = t.faqHead[0];
      faqHead.querySelector('p').textContent = t.faqHead[1];
    }
    faqDetails.forEach((d, i) => {
      const s = d.querySelector('summary');
      const p = d.querySelector('p');
      if (s) s.textContent = (t.faqItems[i] || [])[0] || s.textContent;
      if (p) p.textContent = (t.faqItems[i] || [])[1] || p.textContent;
    });

    const contactHead = document.querySelector('#iletisim .section-head');
    if (contactHead) {
      contactHead.querySelector('h2').textContent = t.contactHead[0];
      contactHead.querySelector('p').textContent = t.contactHead[1];
    }

    const nameLabel = document.querySelector('label[for="name"]');
    const emailLabel = document.querySelector('label[for="email"]');
    const planLabel = document.querySelector('label[for="plan"]');
    const messageLabel = document.querySelector('label[for="message"]');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const planSelect = document.getElementById('plan');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const success = document.getElementById('form-success');
    if (nameLabel) nameLabel.textContent = t.form.name[0];
    if (emailLabel) emailLabel.textContent = t.form.email[0];
    if (planLabel) planLabel.textContent = t.form.plan[0];
    if (messageLabel) messageLabel.textContent = t.form.message[0];
    if (nameInput) nameInput.placeholder = t.form.name[1];
    if (emailInput) emailInput.placeholder = t.form.email[1];
    if (messageInput) messageInput.placeholder = t.form.message[1];
    if (submitBtn) submitBtn.textContent = t.form.submit;
    if (success) success.textContent = t.form.success;
    if (planSelect) {
      planSelect.innerHTML = '';
      const first = document.createElement('option');
      first.value = '';
      first.selected = true;
      first.textContent = t.form.plan[1];
      planSelect.appendChild(first);
      t.form.plan[2].forEach((opt) => {
        const o = document.createElement('option');
        o.textContent = opt;
        planSelect.appendChild(o);
      });
    }

    const contactCard = document.querySelector('#iletisim .grid .card:not(.form)');
    if (contactCard) {
      const h3 = contactCard.querySelector('h3');
      const ps = contactCard.querySelectorAll('p');
      if (h3) h3.textContent = t.contactCard[0];
      if (ps[0]) ps[0].querySelector('strong').textContent = t.contactCard[1];
      if (ps[2]) {
        ps[2].querySelector('strong').textContent = t.contactCard[2];
        ps[2].querySelector('a').textContent = t.contactCard[3];
      }
      const hours = contactCard.querySelector('.hours');
      if (hours) {
        const hp = hours.querySelectorAll('p');
        if (hp[0]) hp[0].querySelector('strong').textContent = t.contactCard[4];
        if (hp[1]) hp[1].textContent = t.contactCard[5];
        if (hp[2]) hp[2].textContent = t.contactCard[6];
      }
    }

    const footerLinks = document.querySelectorAll('.footer-links li a');
    if (footerLinks.length >= 2) {
      footerLinks[0].textContent = t.footer[0];
      footerLinks[1].textContent = t.footer[1];
    }

    const mobileCta = document.querySelector('.mobile-cta');
    const mobileJoin = document.querySelector('.mobile-cta .cta-item[data-track="cta_mobile_join"]');
    const mobileCall = document.querySelector('.mobile-cta .cta-item[href^="tel:"]');
    if (mobileCta) mobileCta.setAttribute('aria-label', t.mobile[2]);
    if (mobileJoin) mobileJoin.textContent = t.mobile[0];
    if (mobileCall) mobileCall.textContent = t.mobile[1];

    const sticky = document.querySelector('.sticky-cta');
    if (sticky) {
      sticky.textContent = t.sticky;
      sticky.setAttribute('aria-label', t.sticky);
    }

    // Lightbox labels (if rendered)
    const lbClose = document.querySelector('.lightbox-close');
    const lbPrev = document.querySelector('.lightbox-prev');
    const lbNext = document.querySelector('.lightbox-next');
    if (lbClose) lbClose.setAttribute('aria-label', t.lightbox[0]);
    if (lbPrev) lbPrev.setAttribute('aria-label', t.lightbox[1]);
    if (lbNext) lbNext.setAttribute('aria-label', t.lightbox[2]);
  }

  const saved = localStorage.getItem('site_lang');
  applyLanguage(saved === 'en' ? 'en' : 'tr');
  langToggle.addEventListener('click', () => {
    applyLanguage(document.documentElement.lang === 'tr' ? 'en' : 'tr');
  });

  // Expose current validation strings
  window.getCurrentValidationMessages = () => {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'tr';
    return i18n[lang].form.errors;
  };
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

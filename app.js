/* ============================================================
   MOHAMMAD SOLTANI — interactions
   theme / menu / custom cursor / 3D tilt / magnetic buttons /
   spotlight cards / reveal-on-scroll / counters / nav state
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- fixed dark theme ---------------- */
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('theme');

  /* ---------------- English / Persian ---------------- */
  const langToggle = document.getElementById('langToggle');
  const language = {
    en: {
      navAbout: 'About', navWork: 'Work', navAwards: 'Awards', navContact: 'Contact', navCta: "Let's talk",
      heroKicker: 'Crafting digital goods since — Y:2017',
      heroSub: 'I’m Mohammad Mohammad Soltani — a full-stack developer<br>turning ideas into fast, thoughtful digital experiences.<br>I build modern web products while exploring networks,<br>machine learning, and AI.',
      aboutTitle: 'About <em>me</em>',
      aboutIntro: "I'm <strong>Mohammad Mohammad Soltani</strong> — a <strong>full-stack web developer</strong> currently learning <strong>networking</strong> and <strong>machine learning</strong>.",
      aboutStack: 'I build modern web products with <strong>PHP, Laravel, HTML, JavaScript, CSS, Tailwind, React, Next.js, Bootstrap</strong> and <strong>Livewire</strong>. I also work with <strong>Docker</strong>, <strong>Linux</strong> and <strong>Python</strong>, backed by PostgreSQL, SQL, Redis, MySQL and MongoDB.',
      aboutAi: 'My AI toolkit includes <strong>OpenCV</strong>, <strong>PyTorch</strong> and anything that helps turn an idea into a useful AI-powered experience. Programming contests have sharpened my <span class="hl">problem-solving mindset</span> and fast-learning habits.',
      workTitle: 'Selected <em>work</em>',
      projectNaghshmanTitle: 'Naghshman',
      projectNaghshmanDesc: 'A nationwide social action network for documenting and sharing people-led movements, local campaigns, media stories, and live activity across Iran.',
      projectNabzTitle: 'Nabz Jahan',
      projectNabzDesc: 'A Persian news platform bringing together updates and analysis about Iran, the region, and the world from multiple newsrooms.',
      projectClaudeTitle: 'Claude Addon Tools',
      projectClaudeDesc: 'A GNOME Shell companion for Claude Code with real-time session status, top-bar permission controls, Persian translation, and IP-based safety management.',
      moreTitle: 'More projects on GitHub', moreDesc: 'Explore the rest of my experiments, applications, and code.',
      awardsTitle: 'Contest <em>honors</em>', contactTitle: 'Get in <em>touch</em>', statRank: 'National rank', statAwards: 'Contest awards', statCommitment: 'Commitment',
      contactHeadline: "Let's build something <span class=\"hl\">great</span>.",
      contactSub: "Got a project in mind? I'm ready to design and ship a website that is technically solid and genuinely enjoyable to use. Pick a channel:",
      footerBuilt: 'Designed & built by me', scrollLabel: 'Scroll',
      tagSocial: 'Social action', tagCampaigns: 'Campaigns', tagLiveMap: 'Live map', tagNews: 'News aggregation', tagSearch: 'Search', tagMedia: 'Media',
      awardWinner: 'Winner', awardSadat: 'Sadat ACM Programming Contest', awardSadatOrg: 'Sadat ACM — 1st place', awardKharazmi: 'Kharazmi Youth Festival', awardProvincial: 'Provincial — 3rd place', awardDistrictFirst: 'District — 1st place', awardDistrictThird: 'District — 3rd place',
      contactGithub: 'GitHub', contactTelegram: 'Telegram', contactEmail: 'Email', contactPhone: 'Phone / SMS',
      pageTitle: 'Mohammad Mohammad Soltani | Full-Stack Web Developer',
      pageDescription: 'Mohammad Mohammad Soltani is a full-stack web developer building modern, fast websites while learning networking, machine learning and AI.'
    },
    fa: {
      navAbout: 'درباره من', navWork: 'پروژه‌ها', navAwards: 'افتخارات', navContact: 'ارتباط', navCta: 'گفت‌وگو کنیم',
      heroKicker: 'ساخت محصولات دیجیتال از — ۲۰۱۷',
      heroSub: 'من محمد محمد سلطانی هستم؛ توسعه‌دهنده‌ی فول‌استک وب،<br>با علاقه به ساخت تجربه‌های سریع و فکرشده‌ی دیجیتال.<br>محصولات مدرن وب می‌سازم و در مسیر یادگیری شبکه،<br>ماشین لرنینگ و هوش مصنوعی هستم.',
      aboutTitle: 'درباره <em>من</em>',
      aboutIntro: 'من <strong>محمد محمد سلطانی</strong> هستم؛ یک <strong>توسعه‌دهنده‌ی فول‌استک وب</strong> که در حال یادگیری <strong>شبکه</strong> و <strong>ماشین لرنینگ</strong> است.',
      aboutStack: 'با <strong>PHP، Laravel، HTML، JavaScript، CSS، Tailwind، React، Next.js، Bootstrap</strong> و <strong>Livewire</strong> محصولات مدرن وب می‌سازم. با <strong>Docker</strong>، <strong>Linux</strong> و <strong>Python</strong> هم کار می‌کنم و با PostgreSQL، SQL، Redis، MySQL و MongoDB آشنا هستم.',
      aboutAi: 'ابزارهای هوش مصنوعی من شامل <strong>OpenCV</strong> و <strong>PyTorch</strong> است و هر چیزی را که به تبدیل یک ایده به تجربه‌ای کاربردی مبتنی بر AI کمک کند دنبال می‌کنم. مسابقات برنامه‌نویسی ذهن <span class="hl">حل مسئله</span> و یادگیری سریع من را تقویت کرده‌اند.',
      workTitle: 'پروژه‌های <em>منتخب</em>',
      projectNaghshmanTitle: 'نقش من',
      projectNaghshmanDesc: 'شبکه‌ای سراسری برای ثبت و روایت کنش‌های مردمی، پویش‌های محلی، پوشش رسانه‌ای و فعالیت‌های اجتماعی در سراسر ایران.',
      projectNabzTitle: 'نبض جهان',
      projectNabzDesc: 'پلتفرم خبری فارسی‌زبان برای گردآوری خبر و تحلیل درباره ایران، منطقه و جهان از چندین رسانه.',
      projectClaudeTitle: 'ابزارهای Claude Addon',
      projectClaudeDesc: 'همراهی برای Claude Code در GNOME Shell با نمایش وضعیت نشست‌ها، کنترل مجوزها از نوار بالایی، ترجمه‌ی فارسی و مدیریت ایمنی مبتنی بر IP.',
      moreTitle: 'پروژه‌های بیشتر در گیت‌هاب', moreDesc: 'باقی آزمایش‌ها، اپلیکیشن‌ها و کدهای من را در گیت‌هاب ببینید.',
      awardsTitle: 'افتخارات <em>مسابقات</em>', contactTitle: 'ارتباط با <em>من</em>', statRank: 'رتبه کشوری', statAwards: 'افتخارات مسابقات', statCommitment: 'تعهد',
      contactHeadline: 'بیایید چیزی <span class="hl">عالی</span> بسازیم.',
      contactSub: 'پروژه‌ای در ذهن دارید؟ آماده‌ام وب‌سایتی فنی، سریع و لذت‌بخش برای استفاده طراحی و منتشر کنم. یک راه ارتباطی را انتخاب کنید:',
      footerBuilt: 'طراحی و توسعه با من', scrollLabel: 'پیمایش',
      tagSocial: 'کنشگری اجتماعی', tagCampaigns: 'پویش‌ها', tagLiveMap: 'نقشه زنده', tagNews: 'تجمیع خبر', tagSearch: 'جست‌وجو', tagMedia: 'رسانه',
      awardWinner: 'برنده', awardSadat: 'مسابقه برنامه‌نویسی صادات ACM', awardSadatOrg: 'Sadat ACM — رتبه اول', awardKharazmi: 'جشنواره جوان خوارزمی', awardProvincial: 'استانی — رتبه سوم', awardDistrictFirst: 'منطقه‌ای — رتبه اول', awardDistrictThird: 'منطقه‌ای — رتبه سوم',
      contactGithub: 'گیت‌هاب', contactTelegram: 'تلگرام', contactEmail: 'ایمیل', contactPhone: 'تلفن / پیامک',
      pageTitle: 'محمد محمد سلطانی | توسعه‌دهنده فول‌استک وب',
      pageDescription: 'محمد محمد سلطانی، توسعه‌دهنده فول‌استک وب است که محصولات مدرن و سریع وب می‌سازد و در حال یادگیری شبکه، ماشین لرنینگ و هوش مصنوعی است.'
    }
  };

  const marqueeTrack = document.getElementById('marqueeTrack');
  const marqueeGroup = marqueeTrack?.querySelector('.marquee-group');
  const syncMarquee = () => {
    if (!marqueeTrack || !marqueeGroup) return;
    const width = marqueeGroup.getBoundingClientRect().width;
    marqueeTrack.style.setProperty('--marquee-shift', `${width}px`);
    marqueeTrack.style.setProperty('--marquee-duration', `${Math.max(9, width / 100)}s`);
  };
  window.addEventListener('resize', syncMarquee, { passive: true });
  document.fonts?.ready.then(syncMarquee);
  syncMarquee();

  const setLanguage = lang => {
    const dict = language[lang] || language.en;
    syncMarquee();
    document.fonts?.ready.then(syncMarquee);
    document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = dict.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict.pageDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', dict.pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', dict.pageDescription);
    document.body.classList.toggle('is-fa', lang === 'fa');
    document.body.classList.toggle('is-en', lang !== 'fa');
    document.body.classList.add('language-ready');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });
    if (langToggle) {
      langToggle.setAttribute('aria-pressed', String(lang === 'fa'));
      langToggle.setAttribute('aria-label', lang === 'fa' ? 'Switch to English' : 'رفتن به فارسی');
      langToggle.innerHTML = lang === 'fa'
        ? '<span>EN</span><span class="lang-divider">/</span><span class="lang-active">FA</span>'
        : '<span class="lang-active">EN</span><span class="lang-divider">/</span><span>FA</span>';
    }
    localStorage.setItem('language', lang);
  };

  setLanguage(localStorage.getItem('language') || 'en');
  langToggle?.addEventListener('click', () => {
    setLanguage(document.documentElement.lang === 'fa' ? 'en' : 'fa');
  });

  /* ---------------- mobile nav ---------------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  const closeNav = () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------------- custom cursor ---------------- */
  const cursor = document.getElementById('cursor');
  if (cursor && !isTouch && !reduceMotion) {
    let x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('on');
      const hot = e.target instanceof Element && e.target.closest('a, button');
      cursor.classList.toggle('hot', Boolean(hot));
    }, { passive: true });
    window.addEventListener('pointerleave', () => cursor.classList.remove('on'));
    (function loop() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- 3D tilt ---------------- */
  document.querySelectorAll('.tilt').forEach(el => {
    if (reduceMotion || isTouch) return;
    const MAX = 12;
    let raf = null, tx = 0, ty = 0;
    const apply = () => {
      el.style.transform =
        `perspective(700px) rotateX(${ty}deg) rotateY(${tx}deg) translateY(0.02em)`;
      raf = null;
    };
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = px * MAX; ty = -py * MAX;
      el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener('pointerleave', () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  });

  /* ---------------- magnetic buttons ---------------- */
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = 0.28;
      let raf = null, mx = 0, my = 0;
      const apply = () => { el.style.transform = `translate(${mx}px, ${my}px)`; raf = null; };
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        mx = (e.clientX - r.left - r.width / 2) * strength;
        my = (e.clientY - r.top - r.height / 2) * strength;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      el.addEventListener('pointerleave', () => {
        mx = 0; my = 0;
        el.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1)';
        if (!raf) raf = requestAnimationFrame(apply);
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

  /* ---------------- spotlight cards ---------------- */
  if (!isTouch) {
    document.querySelectorAll('.spot-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }, { passive: true });
    });
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); ro.unobserve(en.target); }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => ro.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------------- animated counters ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      cio.unobserve(en.target);
      const el = en.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const sup = el.querySelector('sup');
      if (reduceMotion || target === 0) { el.textContent = String(target); if (sup) el.appendChild(sup); continue; }
      const t0 = performance.now(), DUR = 1200;
      (function step(now) {
        const p = Math.min((now - t0) / DUR, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (sup) el.appendChild(sup);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---------------- nav state + scroll progress ---------------- */
  const progress = document.getElementById('progress');
  const scrollHint = document.querySelector('.scroll-hint');
  const topbar = document.querySelector('.topbar');

  const sections = ['top', 'about', 'work', 'awards', 'contact']
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(s => s.el);

  const navLinks = document.querySelectorAll('[data-nav]');
  const setActive = id => {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  };

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    scrollHint?.classList.toggle('gone', window.scrollY > 60);
    topbar?.classList.toggle('scrolled', window.scrollY > 8);

    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = s.id;
    }
    if (current) setActive(current);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
})();

/* ============================================================
   MOHAMMAD SOLTANI — interactions
   (3D background lives in scene3d.js)
   Typewriter / 3D tilt / magnetic buttons / spotlight cards /
   reveal-on-scroll / counters / nav state
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------------- typewriter ---------------- */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      'whoami → full-stack web developer',
      'php artisan serve --host=your-project.dev',
      'npm run build -- --mode=production',
      'SELECT * FROM skills WHERE passion > 9000;',
      'console.log("Let\'s build something great.");'
    ];
    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      let pi = 0, ci = 0, deleting = false;
      (function loop() {
        const phrase = phrases[pi];
        typedEl.textContent = phrase.slice(0, ci);
        let delay = deleting ? 26 : 52;
        if (!deleting && ci === phrase.length) { delay = 2100; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }
        else ci += deleting ? -1 : 1;
        setTimeout(loop, delay);
      })();
    }
  }

  /* ---------------- 3D tilt (react-bits style) ---------------- */
  document.querySelectorAll('.tilt').forEach(el => {
    if (reduceMotion || isTouch) return;
    const MAX = 10;
    let raf = null, tx = 0, ty = 0;
    const apply = () => {
      el.style.transform =
        `perspective(800px) rotateX(${ty}deg) rotateY(${tx}deg) scale3d(1.02,1.02,1.02)`;
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

  /* portrait glare follows pointer even on touch-less hover of wrap */
  const slot = document.getElementById('tiltCard');
  if (slot && !isTouch) {
    const wrap = slot.closest('.portrait-wrap') || slot;
    wrap.addEventListener('pointermove', e => {
      const r = slot.getBoundingClientRect();
      slot.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      slot.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
    }, { passive: true });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = 0.3;
      let raf = null, mx = 0, my = 0;
      const apply = () => {
        el.style.transform = `translate(${mx}px, ${my}px)`;
        raf = null;
      };
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
      const supHtml = sup ? sup.outerHTML : '';
      if (reduceMotion || target === 0) { el.innerHTML = target + supHtml; continue; }
      const t0 = performance.now(), DUR = 1200;
      (function step(now) {
        const p = Math.min((now - t0) / DUR, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (sup) el.appendChild(sup);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---------------- scroll progress ---------------- */
  const progress = document.getElementById('progress');
  const scrollHint = document.querySelector('.scroll-hint');

  /* ---------------- active section nav ---------------- */
  const sections = [
    { id: 'top', el: document.getElementById('top') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'awards', el: document.getElementById('awards') },
    { id: 'contact', el: document.getElementById('contact') }
  ].filter(s => s.el);

  const navLinks = document.querySelectorAll('[data-nav]');
  const dotBtns = document.querySelectorAll('.dots-nav [data-goto]');

  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    dotBtns.forEach(b => b.classList.toggle('active', b.dataset.goto === id));
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    if (scrollHint) scrollHint.classList.toggle('gone', window.scrollY > 60);

    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = s.id;
    }
    if (current) setActive(current);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  dotBtns.forEach(b => b.addEventListener('click', () => {
    const target = document.getElementById(b.dataset.goto);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  /* smooth anchor scrolling with header offset */
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

  /* glitch text re-trigger occasionally */
  if (!reduceMotion) {
    setInterval(() => {
      document.querySelectorAll('.glitch').forEach(g => {
        g.style.animationName = 'none';
        void g.offsetWidth;
        g.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); });
        g.style.animationName = '';
      });
    }, 9000);
  }
})();

/**
 * Main Application Logic for Akhil Shibu Portfolio
 * Written in TypeScript (zero UI frameworks). The WebGL hero (Three.js + visualizer)
 * is lazy-loaded: only when the card is visible and the browser is idle, or on tap.
 */

import type { VisualizerMode } from './types.js';

const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function initLazyHero(): void {
  const container = document.getElementById('v3dCanvasContainer');
  if (!container) return;

  const poster = document.getElementById('v3dPoster');
  const loadBtn = document.getElementById('v3dLoadBtn') as HTMLButtonElement | null;
  const modes = document.getElementById('v3dModes');
  let started = false;

  const start = async (): Promise<void> => {
    if (started) return;
    started = true;
    if (loadBtn) {
      loadBtn.disabled = true;
      loadBtn.textContent = 'Loading...';
    }
    try {
      await loadScript(THREE_URL);
      const { DataVisualizer3D } = await import('./visualizer3d.js');
      container.innerHTML = '';
      const visualizer = new DataVisualizer3D('v3dCanvasContainer');
      if (modes) modes.hidden = false;
      const modeButtons = document.querySelectorAll<HTMLButtonElement>('.v3d-mode-btn');
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          modeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mode = btn.dataset.mode as VisualizerMode;
          if (mode) visualizer.setMode(mode);
        });
      });
    } catch (err) {
      console.warn('3D visualizer unavailable, keeping static poster:', err);
      started = false;
      if (loadBtn) {
        loadBtn.disabled = false;
        loadBtn.textContent = 'Retry 3D view';
      }
    }
  };

  loadBtn?.addEventListener('click', () => void start());
  poster?.addEventListener('pointerenter', () => {
    // Warm up the connection on intent
    if (!document.querySelector('link[rel="preconnect"][href="https://cdnjs.cloudflare.com"]')) {
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = 'https://cdnjs.cloudflare.com';
      document.head.appendChild(l);
    }
  }, { once: true });

  // Auto-start only on capable connections: visible + idle. Otherwise wait for a tap.
  const conn = (navigator as any).connection;
  const saveData = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = window.matchMedia('(max-width: 768px)').matches;
  if (saveData || reduceMotion || smallScreen || !('IntersectionObserver' in window)) return;

  const idle = (cb: () => void) => {
    const ric = (window as any).requestIdleCallback as undefined | ((fn: () => void, o?: object) => void);
    if (ric) ric(cb, { timeout: 4000 });
    else setTimeout(cb, 2500);
  };
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      io.disconnect();
      const go = () => idle(() => void start());
      if (document.readyState === 'complete') go();
      else window.addEventListener('load', go, { once: true });
    }
  });
  io.observe(container);
}

/** Fade/slide-in on scroll. Opacity + translate only, so it cannot cause layout shift. */
function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(e => io.observe(e));
}

/** Highlights the nav item whose home-page section is currently in view. */
function initScrollSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link[data-section]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const ratios = new Map<string, number>();
  const setActive = (id: string): void => {
    links.forEach(l => {
      const on = l.dataset.section === id;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
    let best = '';
    let bestRatio = 0;
    ratios.forEach((r, id) => { if (r > bestRatio) { bestRatio = r; best = id; } });
    if (best) setActive(best);
  }, { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] });
  links.forEach(l => {
    const s = document.getElementById(l.dataset.section as string);
    if (s) io.observe(s);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 0. Scroll-reveal and nav scroll-spy
  initReveal();
  initScrollSpy();

  // 1. Lazy WebGL hero (home page only)
  initLazyHero();

  // 2. Mobile Navigation Drawer
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // 3. Copy Email with Accessible Toast Notification
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  if (copyBtn && toast) {
    copyBtn.addEventListener('click', () => {
      const email = 'akhilshibu03@gmail.com';
      const showToast = (msg: string) => {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`Email copied: ${email}`))
          .catch(() => showToast(`Email: ${email}`));
      } else {
        showToast(`Email: ${email}`);
      }
    });
  }

  // 4. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});

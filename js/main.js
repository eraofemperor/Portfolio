/**
 * Main Application Logic for Akhil Shibu Portfolio
 * Written in TypeScript (Zero external UI frameworks)
 */
import { DataVisualizer3D } from './visualizer3d.js';
import { SeoEngine } from './seo.js';
document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Pure TypeScript SEO, GEO & AEO Engine
    const seoEngine = new SeoEngine();
    window.__seoEngine = seoEngine;
    // 1. Initialize 3D Data Visualizer in Hero Section
    try {
        const visualizer = new DataVisualizer3D('v3dCanvasContainer');
        const modeButtons = document.querySelectorAll('.v3d-mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.dataset.mode;
                if (mode) {
                    visualizer.setMode(mode);
                }
            });
        });
    }
    catch (err) {
        console.warn('3D visualizer initialized with standard fallback:', err);
    }
    // 2. FAQ Accordion Handler (Accessible ARIA state)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger)
            return;
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => {
                i.classList.remove('open');
                const t = i.querySelector('.faq-trigger');
                if (t)
                    t.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
    // 3. Mobile Navigation Drawer
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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }
    // 4. Copy Email with Accessible Toast Notification
    const copyBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toast');
    if (copyBtn && toast) {
        copyBtn.addEventListener('click', () => {
            const email = 'akhilshibu03@gmail.com';
            const showToast = (msg) => {
                toast.textContent = msg;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2800);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(() => showToast(`Email copied: ${email}`))
                    .catch(() => showToast(`Email: ${email}`));
            }
            else {
                showToast(`Email: ${email}`);
            }
        });
    }
    // 5. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                backToTop.classList.add('visible');
            }
            else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // 6. Active Nav Link Scrollspy via IntersectionObserver
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-25% 0px -65% 0px' });
        sections.forEach(s => observer.observe(s));
    }
    // 7. Dynamic Footer Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
});

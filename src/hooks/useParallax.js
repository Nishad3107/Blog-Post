import { useEffect } from 'react';

export default function useParallax() {
  useEffect(() => {
    let frame = null;
    let isMounted = true;

    const elements = Array.from(document.querySelectorAll('[data-parallax]'));
    const fadeElements = Array.from(document.querySelectorAll('[data-fade]'));

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    });

    fadeElements.forEach((el) => observer.observe(el));

    const update = () => {
      if (!isMounted) return;
      const viewportHeight = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = Number(el.dataset.speed || 0.15);
        const offset = (rect.top - viewportHeight * 0.5) * speed;
        el.style.setProperty('--parallax-translate', `${offset.toFixed(2)}px`);

        if (el.dataset.zoom) {
          const zoomAmount = Number(el.dataset.zoom || 0.08);
          const progress = 1 - Math.min(Math.max((rect.top + rect.height) / (viewportHeight + rect.height), 0), 1);
          const scale = 1 + zoomAmount * progress;
          el.style.setProperty('--parallax-scale', `${scale.toFixed(3)}`);
        }

      });

      frame = null;
    };

    const requestTick = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    };

    requestTick();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);

    return () => {
      isMounted = false;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      observer.disconnect();
    };
  }, []);
}

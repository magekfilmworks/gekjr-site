document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (slides.length < 2) return; // nothing to cycle

  let current = slides.findIndex((s) => s.classList.contains("active"));
  if (current === -1) current = 0;

  const AUTOPLAY_MS = 6500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
  }

  let timer = null;
  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    timer = setInterval(() => show(current + 1), AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  startAutoplay();

  // Swipe support — no visible arrows/buttons, gesture-only
  let touchStartX = 0;
  let touchStartY = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      // Ignore mostly-vertical swipes (visitor is scrolling the page)
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      dx < 0 ? show(current + 1) : show(current - 1);
      startAutoplay(); // reset the timer after a manual swipe
    },
    { passive: true }
  );
});

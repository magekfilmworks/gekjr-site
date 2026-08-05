document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (slides.length < 2) return; // nothing to cycle

  let current = slides.findIndex((s) => s.classList.contains("active"));
  if (current === -1) current = 0;

  const AUTOPLAY_MS = 9000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // respect reduced-motion preference, stay on first slide

  setInterval(() => {
    current = (current + 1) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
  }, AUTOPLAY_MS);
});

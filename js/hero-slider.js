document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsWrap = slider.querySelector(".dots");
  const prevBtn = slider.querySelector(".arrow.prev");
  const nextBtn = slider.querySelector(".arrow.next");
  if (slides.length === 0) return;

  let current = slides.findIndex((s) => s.classList.contains("active"));
  if (current === -1) current = 0;

  const AUTOPLAY_MS = 5500;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;

  // Build dots to match slide count
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Go to photo ${i + 1}`);
      if (i === current) b.classList.add("active");
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
  }

  if (slides.length < 2) {
    if (dotsWrap) dotsWrap.style.display = "none";
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
  }

  function render() {
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((b, i) =>
        b.classList.toggle("active", i === current)
      );
    }
  }

  function goTo(i, userTriggered) {
    current = (i + slides.length) % slides.length;
    render();
    if (userTriggered) restart();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    if (slides.length < 2 || reduceMotion) return;
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stop() { if (timer) clearInterval(timer); }
  function restart() { stop(); start(); }

  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1, true));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1, true));

  // Pause on hover/focus, resume on leave
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // Basic touch swipe
  let touchStartX = null;
  slider.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1, true) : goTo(current - 1, true);
    touchStartX = null;
  });

  render();
  start();
});

document.addEventListener("DOMContentLoaded", () => {
  const allItems = Array.from(document.querySelectorAll(".gallery-item"));
  const overlay = document.getElementById("lightbox");
  const tabs = Array.from(document.querySelectorAll(".filter-tab"));
  if (!allItems.length || !overlay) return;

  const imgEl = document.getElementById("lightbox-img");
  const capEl = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let visibleItems = allItems.slice();
  let current = 0;

  // ---- Category filtering ----
  // "All" intentionally excludes "archive" — those photos are backdated
  // and should only surface when Archive is explicitly selected.
  function applyFilter(filter) {
    visibleItems = [];
    allItems.forEach((item) => {
      const category = item.getAttribute("data-category");
      const matches =
        filter === category ||
        (filter === "all" && category !== "archive");
      item.classList.toggle("filtered-out", !matches);
      if (matches) visibleItems.push(item);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      applyFilter(tab.getAttribute("data-filter"));
    });
  });

  applyFilter("all");

  // ---- Lightbox ----
  function show(i) {
    current = (i + visibleItems.length) % visibleItems.length;
    const item = visibleItems[current];
    imgEl.src = item.getAttribute("data-full");
    imgEl.alt = item.getAttribute("data-caption") || "";
    capEl.textContent = item.getAttribute("data-caption") || "";
  }

  function open(item) {
    const idx = visibleItems.indexOf(item);
    show(idx === -1 ? 0 : idx);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  allItems.forEach((item) => {
    item.addEventListener("click", () => open(item));
  });

  closeBtn.addEventListener("click", close);
  nextBtn.addEventListener("click", () => show(current + 1));
  prevBtn.addEventListener("click", () => show(current - 1));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  // ---- Touch swipe ----
  let touchStartX = null;
  let touchStartY = null;

  overlay.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only treat as a swipe if horizontal movement dominates (avoids
    // hijacking vertical scroll/pinch gestures)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? show(current + 1) : show(current - 1);
    }
    touchStartX = null;
    touchStartY = null;
  });
});

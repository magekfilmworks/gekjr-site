document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const overlay = document.getElementById("lightbox");
  if (!items.length || !overlay) return;

  const imgEl = document.getElementById("lightbox-img");
  const capEl = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    imgEl.src = item.getAttribute("data-full");
    imgEl.alt = item.getAttribute("data-caption") || "";
    capEl.textContent = item.getAttribute("data-caption") || "";
  }

  function open(i) {
    show(i);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => open(i));
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
});

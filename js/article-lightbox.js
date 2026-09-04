document.addEventListener("DOMContentLoaded", () => {
  const figures = Array.from(document.querySelectorAll(".article-body figure"));
  const galleryItems = Array.from(document.querySelectorAll(".photo-gallery-item"));
  const overlay = document.getElementById("article-lightbox");
  if ((!figures.length && !galleryItems.length) || !overlay) return;

  const imgEl = document.getElementById("article-lightbox-img");
  const capEl = document.getElementById("article-lightbox-caption");
  const closeBtn = document.getElementById("article-lightbox-close");

  // Only figures that actually contain a clickable photo — a figure
  // wrapping a <video> (used on a couple posts) is skipped, since video
  // controls already handle their own fullscreen/playback interaction.
  // Gallery items (the .photo-gallery grid used on the Aquilon/Encore3
  // posts) are a separate markup pattern — plain wrapped <img>, no
  // <figure> — so they're collected alongside figures into one combined
  // list, in document order, so lightbox prev/next navigation flows
  // naturally through a post regardless of which pattern each photo uses.
  const figureItems = figures.filter((fig) => fig.querySelector("img"));
  const allClickable = [...figureItems, ...galleryItems];
  // Re-sort into actual document order, since the two queries above run
  // independently and a post could interleave figures and gallery blocks.
  allClickable.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  );
  const items = allClickable;
  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    const img = items[current].querySelector("img");
    imgEl.src = img.getAttribute("src");
    imgEl.alt = img.getAttribute("alt") || "";
    const cap = items[current].querySelector("figcaption");
    capEl.textContent = cap ? cap.textContent : (img.getAttribute("alt") || "");
  }

  function open(fig) {
    const idx = items.indexOf(fig);
    show(idx === -1 ? 0 : idx);
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach((fig) => {
    fig.addEventListener("click", () => open(fig));
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  // ---- Touch swipe (same pattern as the photo gallery lightbox) ----
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
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? show(current + 1) : show(current - 1);
    }
    touchStartX = null;
    touchStartY = null;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".header-right");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // "Media" dropdown — its link is a placeholder (href="#"), never a real
  // destination, so always prevent the default jump-to-top behavior.
  // Only toggle the open/close class on devices without real hover
  // (touch devices like iPad, regardless of screen width) — mouse users
  // get it via CSS :hover instead.
  const hasHover = window.matchMedia("(hover: hover)").matches;
  document.querySelectorAll("nav.primary-nav li.has-sub > a").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (!hasHover || window.innerWidth <= 1024) {
        trigger.parentElement.classList.toggle("open");
      }
    });
  });

  // Homepage pitch banner — a single, static call-to-action linking to
  // Contact. Recent posts already have their own "Latest from the field"
  // section further down the page, so this stays focused on one message.
  const pitchLink = document.getElementById("pitch-banner-text-wrap");
  const pitchText = document.getElementById("pitch-banner-text");
  if (pitchLink && pitchText) {
    pitchLink.href = "contact.html";
    pitchText.textContent = "Ask Me About Deploying Your Next Hybrid Project via Cloudflex and AWS";
  }

  // Dismissible homepage hero caption
  const captionClose = document.getElementById("hero-caption-close");
  const caption = document.getElementById("hero-caption");
  if (captionClose && caption) {
    captionClose.addEventListener("click", () => {
      caption.classList.add("dismissed");
    });
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = document.querySelector("#form-status");
      // Wire this up to your form backend of choice (SES, Formspree,
      // AWS API Gateway + Lambda, etc.) — this just confirms the UI works.
      note.textContent = "Thanks for reaching out — George will get back to you soon.";
      note.style.color = "#131313";
      form.reset();
    });
  }
});

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

  // "Media" dropdown — click toggles on mobile, hover handles desktop via CSS
  document.querySelectorAll("nav.primary-nav li.has-sub > a").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 760) {
        e.preventDefault();
        trigger.parentElement.classList.toggle("open");
      }
    });
  });

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

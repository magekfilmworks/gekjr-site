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

  // Header center tagline — rotates between the site's core pitch and
  // recent Insights posts, linking straight to each
  const tagline = document.getElementById("header-tagline");
  if (tagline) {
    const inPosts = window.location.pathname.includes("/posts/");
    const rootPrefix = inPosts ? "../" : "";
    const postsPrefix = inPosts ? "" : "posts/";
    const slides = [
      { text: "Ask Me About Deploying Your Next Hybrid Project via Cloudflex and AWS", href: rootPrefix + "contact.html" },
      { text: "New post: The Art of Cutting Live — What Makes a Great Technical Director", href: postsPrefix + "art-of-cutting-live.html" },
      { text: "New post: It's Time for 9:16 Framing Guides in All Professional Broadcast Cameras", href: postsPrefix + "9-16-framing-guides.html" },
    ];
    let taglineIndex = 0;
    tagline.href = slides[taglineIndex].href;
    const taglineReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slides.length > 1 && !taglineReduceMotion) {
      setInterval(() => {
        taglineIndex = (taglineIndex + 1) % slides.length;
        tagline.style.opacity = "0";
        setTimeout(() => {
          tagline.textContent = slides[taglineIndex].text;
          tagline.href = slides[taglineIndex].href;
          tagline.style.opacity = "1";
        }, 400);
      }, 6000);
    }
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

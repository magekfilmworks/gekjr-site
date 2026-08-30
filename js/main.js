document.addEventListener("DOMContentLoaded", () => {
  // Clients & Partners disclosure — open by default on desktop (matches
  // prior always-visible behavior), collapsed by default on mobile to
  // save scroll length. Only sets the initial state; doesn't fight a
  // visitor who's already toggled it themselves.
  const clientsDisclosure = document.getElementById("record-clients-disclosure");
  if (clientsDisclosure) {
    clientsDisclosure.open = window.innerWidth > 900;
  }

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

  // "Media" dropdown — now a real page (media.html), so mouse users can
  // click straight through to it (hover still reveals the Photos/Video
  // submenu as a shortcut). Touch devices have no hover, so tapping opens
  // the submenu instead of navigating immediately — they can tap again,
  // or tap a submenu item, to go further.
  const hasHover = window.matchMedia("(hover: hover)").matches;

  // Contact page map pin — real hover on desktop (handled in CSS), tap
  // to toggle on touch devices where hover doesn't apply.
  const mapPinWrap = document.getElementById("map-pin-wrap");
  if (mapPinWrap && !hasHover) {
    mapPinWrap.querySelector("svg").addEventListener("click", (e) => {
      e.stopPropagation();
      mapPinWrap.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!mapPinWrap.contains(e.target)) {
        mapPinWrap.classList.remove("open");
      }
    });
  }

  document.querySelectorAll("nav.primary-nav li.has-sub > a").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      if (!hasHover || window.innerWidth <= 1024) {
        const isOpen = trigger.parentElement.classList.contains("open");
        if (!isOpen) {
          e.preventDefault();
          trigger.parentElement.classList.add("open");
        }
        // If already open, let the click through — tapping "Media" again
        // navigates to the Media page itself.
      }
    });
  });

  // Homepage pitch banner — rotates between the core business pitch and
  // a link to the latest video. Recent blog posts already have their own
  // "Latest from the field" section further down, so this stays focused
  // on just these two.
  const pitchLink = document.getElementById("pitch-banner-text-wrap");
  const pitchText = document.getElementById("pitch-banner-text");
  if (pitchLink && pitchText) {
    const pitchSlides = [
      { text: "Ask Me About Deploying Your Next Hybrid Project via Cloudflex and AWS", href: "contact.html" },
      { text: "Watch: Custom In Ear Moulding @JHAudio, Orlando FL", href: "video.html#in-ear-mould" },
    ];
    let pitchIndex = 0;
    pitchLink.href = pitchSlides[pitchIndex].href;
    const pitchReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pitchSlides.length > 1 && !pitchReduceMotion) {
      setInterval(() => {
        pitchIndex = (pitchIndex + 1) % pitchSlides.length;
        pitchText.style.opacity = "0";
        setTimeout(() => {
          pitchText.textContent = pitchSlides[pitchIndex].text;
          pitchLink.href = pitchSlides[pitchIndex].href;
          pitchText.style.opacity = "1";
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
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const note = document.querySelector("#form-status");
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      note.textContent = "Sending...";
      note.style.color = "#4a4a48";

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          note.textContent = "Thanks for reaching out — George will get back to you soon. Redirecting you home...";
          note.style.color = "#131313";
          form.reset();
          setTimeout(() => {
            window.location.href = "index.html";
          }, 4000);
        } else {
          note.textContent = "Something went wrong — please email contact@gekjr.pro directly.";
          note.style.color = "#e0332b";
        }
      } catch (err) {
        note.textContent = "Something went wrong — please email contact@gekjr.pro directly.";
        note.style.color = "#e0332b";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Second scroll cue — appears once the visitor has scrolled to (or past)
  // the video, nudging them to keep going. Hides again if they scroll back
  // up above it, so it only shows when it's actually relevant.
  const videoHero = document.getElementById("video");
  const scrollCue2 = document.getElementById("scroll-indicator-2");
  if (videoHero && scrollCue2) {
    const headerHeight = 100;
    const onScroll = () => {
      const top = videoHero.getBoundingClientRect().top;
      scrollCue2.classList.toggle("visible", top <= headerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
});

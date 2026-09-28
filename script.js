
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden","true");
    if (lightboxImage) lightboxImage.src = "";
  };
  const openLightbox = (img) => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "Expanded photo";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden","false");
  };

  document.querySelectorAll(".gallery-item img, .rental-slider img").forEach(img => {
    img.addEventListener("click", () => openLightbox(img));
  });
  document.querySelector(".photo-lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  document.querySelectorAll(".rental-slider").forEach(slider => {
    let slides = [];
    try { slides = JSON.parse(slider.dataset.rentalSlides || "[]"); } catch(e) {}
    if (!slides.length) return;
    const img = slider.querySelector("img");
    const counter = slider.querySelector(".rental-counter");
    const dots = slider.querySelector(".rental-dots");
    let index = 0;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      img.src = slides[index];
      img.alt = slider.dataset.rentalAlt || "Rental photo";
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
      dots?.querySelectorAll(".rental-dot").forEach((d,j) => d.classList.toggle("active", j === index));
    };

    if (dots) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "rental-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Show photo ${i + 1}`);
        dot.addEventListener("click", e => { e.stopPropagation(); show(i); });
        dots.appendChild(dot);
      });
    }

    slider.querySelector(".rental-prev")?.addEventListener("click", e => { e.stopPropagation(); show(index - 1); });
    slider.querySelector(".rental-next")?.addEventListener("click", e => { e.stopPropagation(); show(index + 1); });
  });

  // Tight masonry-style gallery on desktop.
  const gallery = document.querySelector(".gallery-grid");
  const layoutGallery = () => {
    if (!gallery) return;
    if (window.innerWidth <= 900) return;
    const rowHeight = 8;
    const gap = 12;
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
    gallery.style.gridAutoRows = rowHeight + "px";
    gallery.style.columnGap = gap + "px";
    gallery.style.rowGap = gap + "px";
    gallery.querySelectorAll(".gallery-item").forEach(item => {
      item.style.gridColumn = "span 1";
      item.style.gridRowEnd = "auto";
    });
    requestAnimationFrame(() => {
      gallery.querySelectorAll(".gallery-item").forEach(item => {
        const img = item.querySelector("img");
        if (img) {
          const h = img.getBoundingClientRect().height;
          item.style.gridRowEnd = "span " + Math.max(1, Math.ceil((h + gap) / (rowHeight + gap)));
        }
      });
    });
  };
  document.querySelectorAll(".gallery-grid img").forEach(img => {
    if (!img.complete) img.addEventListener("load", layoutGallery);
  });
  window.addEventListener("load", layoutGallery);
  window.addEventListener("resize", layoutGallery);
  layoutGallery();


});

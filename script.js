
document.addEventListener("DOMContentLoaded", () => {
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
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      img.src = slides[index];
      img.alt = slider.dataset.rentalAlt || "Rental photo";
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
      dots?.querySelectorAll(".rental-dot").forEach((d,j) => d.classList.toggle("active", j === index));
    };
    slider.querySelector(".rental-prev")?.addEventListener("click", e => { e.stopPropagation(); show(index - 1); });
    slider.querySelector(".rental-next")?.addEventListener("click", e => { e.stopPropagation(); show(index + 1); });
  });
});

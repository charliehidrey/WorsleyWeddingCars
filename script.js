document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));

  const lightbox = document.getElementById('photoLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  function openLightbox(src, alt='Expanded photo') {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }
  document.querySelector('.photo-lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  document.querySelectorAll('.rental-slider').forEach(slider => {
    let slides = [];
    try { slides = JSON.parse(slider.dataset.rentalSlides || '[]'); } catch (_) {}
    const img = slider.querySelector('img');
    const counter = slider.querySelector('.rental-counter');
    const dots = slider.querySelector('.rental-dots');
    if (!img || !slides.length) return;
    let current = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'rental-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Show photo ${i + 1}`);
      dot.addEventListener('click', e => { e.stopPropagation(); show(i); });
      dots?.appendChild(dot);
    });
    function show(n) {
      current = (n + slides.length) % slides.length;
      img.src = slides[current];
      counter.textContent = `${current + 1} / ${slides.length}`;
      dots?.querySelectorAll('.rental-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    slider.querySelector('.rental-prev')?.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
    slider.querySelector('.rental-next')?.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
    img.addEventListener('click', () => openLightbox(img.src, slider.dataset.rentalAlt || 'Rental photo'));
  });

  const revealItems = document.querySelectorAll('.feature-copy,.section-heading,.gallery-item,.social-card,.about>div,.contact-intro,.enquiry-form');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
    }), {threshold:.12});
    revealItems.forEach(i => { i.classList.add('reveal'); observer.observe(i); });
  }
});

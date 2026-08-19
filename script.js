const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded',open);
});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Subtle reveal animation
const items=document.querySelectorAll('.feature-copy,.section-heading,.gallery-item,.social-card,.about>div,.contact-intro,.enquiry-form');
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}})
},{threshold:.12});
items.forEach(i=>{i.classList.add('reveal');observer.observe(i)});

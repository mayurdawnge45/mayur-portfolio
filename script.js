// ===== Navbar scroll & mobile toggle =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  // Active link
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top && window.scrollY < top + sec.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });
});

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===== Typing effect =====
const roles = ['UI/UX Designer', 'Web Designer', 'Product Designer', 'Freelancer'];
const roleEl = document.getElementById('role');
let ri = 0, ci = 0, deleting = false;
function type() {
  const w = roles[ri];
  roleEl.textContent = deleting ? w.substring(0, ci--) : w.substring(0, ci++);
  if (!deleting && ci === w.length + 1) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, deleting ? 50 : 100);
}
type();

// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      // Animate skill bars
      if (e.target.classList.contains('skills-right')) {
        e.target.querySelectorAll('.fill').forEach(f => {
          f.style.width = f.dataset.value + '%';
        });
      }
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Portfolio filter =====
const filterBtns = document.querySelectorAll('.filter button');
const items = document.querySelectorAll('.portfolio-item');
filterBtns.forEach(b => b.addEventListener('click', () => {
  filterBtns.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const cat = b.dataset.filter;
  items.forEach(it => {
    it.style.display = (cat === 'all' || it.dataset.cat === cat) ? '' : 'none';
  });
}));

// ===== Testimonials slider =====
const slides = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dots button');
let current = 0;
function show(i) {
  current = i;
  document.querySelector('.testimonial-track').style.transform = `translateX(-${i * 100}%)`;
  dots.forEach((d, di) => d.classList.toggle('active', di === i));
}
dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
setInterval(() => show((current + 1) % slides.length), 5000);

// ===== Contact form =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function validate() {
  let ok = true;
  const fields = [
    { id: 'name', test: v => v.trim().length >= 2, msg: 'Please enter your name (2+ chars)' },
    { id: 'email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter a valid email' },
    { id: 'subject', test: v => v.trim().length >= 3, msg: 'Subject must be 3+ chars' },
    { id: 'message', test: v => v.trim().length >= 10, msg: 'Message must be 10+ chars' },
  ];
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const group = input.closest('.form-group');
    const err = group.querySelector('.form-error');
    if (!f.test(input.value)) {
      group.classList.add('error'); err.textContent = f.msg; ok = false;
    } else {
      group.classList.remove('error');
    }
  });
  return ok;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.className = 'form-status'; status.textContent = '';
  if (!validate()) {
    status.className = 'form-status error';
    status.textContent = 'Please fix the errors above.';
    return;
  }
  // Save to localStorage as a demo backend
  const data = Object.fromEntries(new FormData(form));
  data.date = new Date().toISOString();
  const msgs = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  msgs.push(data);
  localStorage.setItem('portfolio_messages', JSON.stringify(msgs));

  status.className = 'form-status success';
  status.textContent = "Thanks " + data.name + "! Your message has been sent. I'll get back to you soon.";
  form.reset();
  setTimeout(() => { status.className = 'form-status'; status.textContent = ''; }, 6000);
});

// Clear error on input
form.querySelectorAll('input, textarea').forEach(el =>
  el.addEventListener('input', () => el.closest('.form-group').classList.remove('error'))
);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

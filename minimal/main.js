// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('nav-primary');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Close' : 'Menu';
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a') && menu.classList.contains('is-open')) toggle.click();
});

// Bag counter (demo only, no checkout)
const count = document.querySelector('.bag-count');
let items = 0;
document.querySelectorAll('.add').forEach((btn) => {
  btn.addEventListener('click', () => {
    items += 1;
    count.textContent = items;
    btn.textContent = 'Added';
    btn.classList.add('is-added');
    setTimeout(() => {
      btn.textContent = 'Add to bag';
      btn.classList.remove('is-added');
    }, 1600);
  });
});

// Newsletter (demo only, nothing is sent)
const form = document.getElementById('subscribe');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.querySelector('.subscribe-note').textContent = 'Thank you. The next letter will find you.';
  form.reset();
});

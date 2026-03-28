document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
  });
});

const cards = document.querySelectorAll('.member-card');
const details = document.getElementById('member-details');
const currentDisplay = document.getElementById('current-member');
const totalDisplay = document.getElementById('total-members');

totalDisplay.textContent = String(cards.length).padStart(2, '0');

cards.forEach(card => {
  card.addEventListener('click', () => {

    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const index = parseInt(card.dataset.index) + 1;
    currentDisplay.textContent = String(index).padStart(2, '0');

    details.style.opacity = 0;

    setTimeout(() => {
      details.querySelector('.details-name').textContent = card.dataset.name;
      details.querySelector('.details-role').textContent = card.dataset.role;
      details.querySelector('.details-desc').textContent = card.dataset.desc;
      details.style.opacity = 1;
    }, 200);

  });
});
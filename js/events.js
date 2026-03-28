document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.event-item');
  items.forEach(function (item, i) {
    item.style.animationDelay = (i * 80) + 'ms';
  });
});

function initSlider(wrapper, options) {
  if (!wrapper) return null;

  const settings = options || {};
  const visibleCount = settings.visibleCount || 3;
  const loop = settings.loop !== false;

  const track = wrapper.querySelector('.slider-track') || wrapper.querySelector('.spotlight-track');
  const btnPrev = wrapper.querySelector('.slider-btn--prev');
  const btnNext = wrapper.querySelector('.slider-btn--next');

  if (!track) return null;

  const slides = Array.from(track.children);
  if (!slides.length) return null;

  let currentIndex = 0;

  function getGap() {
    return parseInt(getComputedStyle(track).gap, 10) || 16;
  }

  function getSlideWidth() {
    const slide = slides[0];
    return slide.offsetWidth + getGap();
  }

  function normalize(index) {
    if (!loop) {
      return Math.max(0, Math.min(index, slides.length - visibleCount));
    }
    return ((index % slides.length) + slides.length) % slides.length;
  }

  function goTo(index) {
    currentIndex = normalize(index);
    const offset = currentIndex * getSlideWidth();
    track.style.transform = 'translateX(-' + offset + 'px)';
    track.classList.add('animating');

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === currentIndex);
    });

    if (!loop) {
      if (btnPrev) btnPrev.disabled = currentIndex === 0;
      if (btnNext) btnNext.disabled = currentIndex >= slides.length - visibleCount;
    }
  }

  if (btnPrev) btnPrev.addEventListener('click', function () { goTo(currentIndex - 1); });
  if (btnNext) btnNext.addEventListener('click', function () { goTo(currentIndex + 1); });

  wrapper.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  });

  window.addEventListener('resize', function () {
    goTo(currentIndex);
  });

  goTo(0);

  return {
    goTo: goTo,
    getCurrentIndex: function () { return currentIndex; }
  };
}

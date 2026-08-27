(function () {
  'use strict';

  const deck = document.querySelector('.deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!deck || !slides.length) return;

  const nav = document.createElement('nav');
  nav.className = 'booklet-nav';
  nav.setAttribute('aria-label', '旅遊手札頁面導覽');

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'nav-arrow';
  previous.setAttribute('aria-label', '上一頁');
  previous.textContent = '←';

  const dotTray = document.createElement('div');
  dotTray.className = 'dot-tray';

  const dots = slides.map(function (slide, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'nav-dot';
    dot.textContent = slide.dataset.nav || String(index + 1);
    dot.title = slide.dataset.title || '未命名頁面';
    dot.setAttribute('aria-label', '前往第 ' + (index + 1) + ' 頁：' + (slide.dataset.title || '未命名頁面'));
    dot.addEventListener('click', function () {
      location.hash = '#/' + (index + 1);
    });
    dotTray.appendChild(dot);
    return dot;
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'nav-arrow';
  next.setAttribute('aria-label', '下一頁');
  next.textContent = '→';

  const count = document.createElement('span');
  count.className = 'nav-count';
  count.setAttribute('aria-live', 'polite');

  nav.append(previous, dotTray, count, next);
  deck.appendChild(nav);

  function activeIndex() {
    const found = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    return found >= 0 ? found : 0;
  }

  function go(index) {
    const bounded = Math.max(0, Math.min(slides.length - 1, index));
    location.hash = '#/' + (bounded + 1);
  }

  function update() {
    const index = activeIndex();
    dots.forEach(function (dot, dotIndex) {
      const active = dotIndex === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'page' : 'false');
    });
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    count.textContent = String(index + 1).padStart(2, '0') + '/' + String(slides.length).padStart(2, '0');

    const activeDot = dots[index];
    if (activeDot) {
      const targetLeft = activeDot.offsetLeft - (dotTray.clientWidth - activeDot.offsetWidth) / 2;
      dotTray.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }

  previous.addEventListener('click', function () { go(activeIndex() - 1); });
  next.addEventListener('click', function () { go(activeIndex() + 1); });

  const observer = new MutationObserver(update);
  slides.forEach(function (slide) {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
  });
  window.addEventListener('hashchange', update);
  update();

})();

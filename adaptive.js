/* ==================================================
   АДАПТИВ (МОБИЛЬНАЯ ВЕРСИЯ) — JS
   Драг-энд-дроп лотка (блок3), перенесён из js.js
   и переведён с мышиных событий на pointer events,
   чтобы механика одинаково работала и мышью, и тапом
   ================================================== */

// ДРЭГ ЭНД ДРОП

(function() {
  const container = document.querySelector('.block3');
  if (!container) return;

  const draggableElements = document.querySelectorAll(
    '.zemchug1, .zemchug2, .perlamytr, .racyshka, .bysina1, .bysina2, .bysina3, .kryzok, .colzo\\.mal, .colzo\\.mal2, .zyb, .brysochek, .zvezdochka, .krestik'
  );

  const targetMap = {
    'zyb': document.querySelector('.obvodka\\.zyb'),
    'krestik': document.querySelector('.obvodka\\.krestik'),
    'racyshka': document.querySelector('.obvodka\\.rakyshka')
  };

  const movingElement = document.querySelector('.podviznaya\\.bysina');
  const shkalaElement = document.querySelector('.shkala');
  const popup = document.getElementById('popup2');

  // шаг и стартовая позиция бусины считаются от реальной геометрии шкалы,
  // чтобы прогресс-бар корректно работал в любой раскладке (десктоп/адаптив)
  const stepVW = (shkalaElement.getBoundingClientRect().width / window.innerWidth * 100) / 3;
  let correctCount = 0;
  let popupShown = false;

  const initialLeft = parseFloat(getComputedStyle(movingElement).left) / window.innerWidth * 100;

  let activeElement = null;
  let offsetX = 0, offsetY = 0;

  function saveOriginalPosition(el) {
    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const leftPercent = ((rect.left - containerRect.left) / containerRect.width) * 100;
    const topPercent = ((rect.top - containerRect.top) / containerRect.height) * 100;
    el.dataset.originalLeftPercent = leftPercent;
    el.dataset.originalTopPercent = topPercent;
  }

  function applyOriginalPosition(el) {
    if (el.dataset.originalLeftPercent && el.dataset.originalTopPercent) {
      el.style.left = el.dataset.originalLeftPercent + '%';
      el.style.top = el.dataset.originalTopPercent + '%';
      el.style.position = 'absolute';
    }
  }

  function onPointerDown(e) {
    e.preventDefault();
    if (this.classList.contains('placed')) return;

    activeElement = this;
    const rect = activeElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    if (!activeElement.dataset.originalLeftPercent) {
      saveOriginalPosition(activeElement);
    }

    activeElement.style.position = 'absolute';
    activeElement.style.left = (rect.left - containerRect.left) + 'px';
    activeElement.style.top = (rect.top - containerRect.top) + 'px';
    activeElement.style.width = rect.width + 'px';
    activeElement.style.height = rect.height + 'px';
    activeElement.style.zIndex = '1000';
    activeElement.style.cursor = 'grabbing';
    activeElement.style.transition = 'none';
    activeElement.style.pointerEvents = 'none';

    if (activeElement.setPointerCapture) {
      try { activeElement.setPointerCapture(e.pointerId); } catch (_) {}
    }

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e) {
    if (!activeElement) return;

    const containerRect = container.getBoundingClientRect();
    let left = e.clientX - offsetX - containerRect.left;
    let top = e.clientY - offsetY - containerRect.top;
    const maxLeft = containerRect.width - activeElement.offsetWidth;
    const maxTop = containerRect.height - activeElement.offsetHeight;
    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    activeElement.style.left = left + 'px';
    activeElement.style.top = top + 'px';
  }

  function onPointerUp(e) {
    if (!activeElement) return;

    const rect = activeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let success = false;

    for (let key in targetMap) {
      if (activeElement.classList.contains(key) && targetMap[key]) {
        const targetRect = targetMap[key].getBoundingClientRect();
        if (
          centerX > targetRect.left &&
          centerX < targetRect.right &&
          centerY > targetRect.top &&
          centerY < targetRect.bottom
        ) {
          success = true;

          const newLeft = targetRect.left + (targetRect.width - rect.width) / 2;
          const newTop = targetRect.top + (targetRect.height - rect.height) / 2;

          const containerRect = container.getBoundingClientRect();
          const newLeftPercent = ((newLeft - containerRect.left) / containerRect.width) * 100;
          const newTopPercent = ((newTop - containerRect.top) / containerRect.height) * 100;

          activeElement.dataset.originalLeftPercent = newLeftPercent;
          activeElement.dataset.originalTopPercent = newTopPercent;
          activeElement.style.left = newLeftPercent + '%';
          activeElement.style.top = newTopPercent + '%';

          if (!activeElement.classList.contains('placed')) {
            activeElement.classList.add('placed');
            correctCount++;

            const newProgress = initialLeft + stepVW * correctCount;
            movingElement.style.left = newProgress + 'vw';
          }

          break;
        }
      }
    }

    activeElement.style.pointerEvents = '';
    activeElement.style.zIndex = '';
    activeElement.style.cursor = 'grab';
    activeElement.style.transition = '';
    activeElement.style.width = '';
    activeElement.style.height = '';

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    activeElement = null;

    if (correctCount === 3 && !popupShown) {
      popup.style.display = 'flex';
      popupShown = true;
    }
  }

  function resetGame() {
    correctCount = 0;
    popupShown = false;

    draggableElements.forEach(el => {
      el.classList.remove('placed');
      el.style.pointerEvents = '';
      el.style.zIndex = '';
      el.style.cursor = 'grab';
      applyOriginalPosition(el);
    });

    movingElement.style.left = initialLeft + 'vw';
  }

  draggableElements.forEach(el => {
    el.style.cursor = 'grab';
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', onPointerDown);
    saveOriginalPosition(el);
  });

  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });

  window.addEventListener('resize', function() {
    draggableElements.forEach(el => {
      if (!el.classList.contains('placed')) {
        applyOriginalPosition(el);
      }
    });
  });
})();

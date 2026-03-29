document.addEventListener('DOMContentLoaded', function() {

window.addEventListener('load', function() {
(function() {
    const EXTRA_VW = 10;

    function recalcBodyHeight() {
      const extraPx = (EXTRA_VW / 100) * window.innerWidth;
      let maxBottom = 0;

      document.body.querySelectorAll(':scope > *').forEach(el => {
        if (el.tagName === 'SCRIPT') return;
        if (el.classList && el.classList.contains('modal-overlay')) return;
        const rect = el.getBoundingClientRect();
        const bottom = rect.bottom + window.scrollY;
        if (bottom > maxBottom) maxBottom = bottom;
      });

      document.body.style.height = (maxBottom + extraPx) + 'px';
    }

    requestAnimationFrame(recalcBodyHeight);
    window.addEventListener('resize', recalcBodyHeight);
  })();

//ЗВУК ДЛЯ ТЕКСТА 

(function() {
  const sound = new Audio('./mp3/zvyk1.mp3');
  sound.preload = 'auto';

  let canPlay = false;
  document.addEventListener('click', function enableSound() {
    canPlay = true;
    document.removeEventListener('click', enableSound);
  }, { once: true });

  const textBlocks = document.querySelectorAll(
    '.text11, .text12, .text13, .text21, .text22, .text23, .text24, .text41, .text42, .text43, .text44, .text51, .text52, .text53, .text54, .textp1, .textp2, .textp3'
  );

  if (textBlocks.length > 0) {
    textBlocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        if (!canPlay) return;
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
      });
      block.addEventListener('mouseleave', () => {
        sound.pause();
        sound.currentTime = 0;
      });
    });
    console.log('Звук настроен для', textBlocks.length, 'блоков.');
  } else {
    console.log('Текстовые блоки для звука не найдены.');
  }
})();

  //ПАЗЛ 1

  (function() {
    const pieces = document.querySelectorAll('.block2 [class^="kvadratik"]');
    const modal = document.getElementById('puzzleModal');

  
    function getRandomRotation() {
      const rotations = [0 , 90, 180, 270];
      return rotations[Math.floor(Math.random() * rotations.length)];
    }

    pieces.forEach(piece => {
      let rot = getRandomRotation();
      piece.dataset.rotation = rot;
      piece.style.transform = `rotate(${rot}deg)`;
      piece.style.transition = 'transform 0.3s';
      piece.style.cursor = 'pointer';
    });

    pieces.forEach(piece => {
      piece.addEventListener('click', function(e) {
        e.stopPropagation();
        let current = (parseInt(this.dataset.rotation) + 90) % 360;
        this.dataset.rotation = current;
        this.style.transform = `rotate(${current}deg)`;

        let allCorrect = true;
        pieces.forEach(p => {
          if (parseInt(p.dataset.rotation) !== 0) allCorrect = false;
        });

        if (allCorrect) {
       
          modal.style.display = 'flex';
        } else {
          let rotations = Array.from(pieces).map(p => parseInt(p.dataset.rotation));
     
        }
      });
    });

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });

    console.log('Пазл настроен, элементов:', pieces.length);
  })();
});

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
  const popup = document.getElementById('popup2');

  const stepVW = 10.486;
  let correctCount = 0;
  let popupShown = false;

  const initialLeft = 50.7; 

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

  function onMouseDown(e) {
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

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
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

  function onMouseUp(e) {
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

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

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
    el.addEventListener('mousedown', onMouseDown);
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

// ПАЗЛ 2

(function() {
  const pieces = document.querySelectorAll('.block4 [class^="kvadratik"]');
  const modal = document.getElementById('popup3');

  function getRandomRotation() {
    const rotations = [0, 90, 180, 270];
    return rotations[Math.floor(Math.random() * rotations.length)];
  }

  pieces.forEach(piece => {
    let rot = getRandomRotation();
    piece.dataset.rotation = rot;
    piece.style.transform = `rotate(${rot}deg)`;
    piece.style.transition = 'transform 0.3s';
    piece.style.cursor = 'pointer';
  });

  pieces.forEach(piece => {
    piece.addEventListener('click', function(e) {
      e.stopPropagation();
      let current = (parseInt(this.dataset.rotation) + 90) % 360;
      this.dataset.rotation = current;
      this.style.transform = `rotate(${current}deg)`;

      let allCorrect = true;
      pieces.forEach(p => {
        if (parseInt(p.dataset.rotation) !== 0) allCorrect = false;
      });

      if (allCorrect) {
        modal.style.display = 'flex';
      }
    });
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });
})();

});

 // РИСОВАШКА

(function() {
  const drawZone = document.querySelector('.kostilris');
  let isDrawing = false;
  let painted = 0;
  let modalJustOpenedAt = 0;
  let popupShown = false;
  let activePointerId = null;
  let lastX = null;
  let lastY = null;
  const POPUP_THRESHOLD = 300;

  if (!drawZone) return;
  drawZone.setAttribute('draggable', 'false');
  drawZone.addEventListener('dragstart', (e) => e.preventDefault());

  function isInsideDrawZone(e) {
    const rect = drawZone.getBoundingClientRect();
    return (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
  }

  function placeDot(pageX, pageY) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.style.left = pageX + 'px';
    dot.style.top = pageY + 'px';
    document.body.appendChild(dot);

    painted++;
    if (!popupShown && painted >= POPUP_THRESHOLD) {
      popupShown = true;
      const modal = document.getElementById('popup4');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '20000';
        modal.style.pointerEvents = 'auto';
        modalJustOpenedAt = Date.now();
      }
    }
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;
    if (!isInsideDrawZone(e)) return;

    e.preventDefault();
    isDrawing = true;
    activePointerId = e.pointerId;
    lastX = e.pageX;
    lastY = e.pageY;

    if (drawZone.setPointerCapture) {
      try { drawZone.setPointerCapture(e.pointerId); } catch (_) {}
    }

    placeDot(e.pageX, e.pageY);
  }

  function onPointerMove(e) {
    if (!isDrawing) return;
    if (activePointerId !== null && e.pointerId !== activePointerId) return;
    if (!isInsideDrawZone(e)) return;

    const dx = (lastX === null) ? 0 : (e.pageX - lastX);
    const dy = (lastY === null) ? 0 : (e.pageY - lastY);
    const dist = Math.hypot(dx, dy);
    if (dist < 3) return; 

    lastX = e.pageX;
    lastY = e.pageY;
    placeDot(e.pageX, e.pageY);
  }

  function onPointerUp(e) {
    if (activePointerId !== null && e.pointerId !== activePointerId) return;
    isDrawing = false;
    activePointerId = null;
    lastX = null;
    lastY = null;
  }

  drawZone.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('popup4');
    if (!modal) return;
    if (e.target === modal) {
    if (Date.now() - modalJustOpenedAt < 1000) return;
      modal.style.display = 'none';
    }
  });
})();

(function() {
  const SLOW_RATE = 2 / 3;
  const NORMAL_RATE = 1;

  function setMarqueeRate(marquee, rate) {
    marquee.querySelectorAll('.begstrok').forEach(el => {
      el.getAnimations().forEach(anim => {
        anim.playbackRate = rate;
      });
    });
  }

  document.addEventListener('pointerenter', (e) => {
    const marquee = e.target.closest?.('.marquee');
    if (!marquee) return;
    setMarqueeRate(marquee, SLOW_RATE);
  }, true);

  document.addEventListener('pointerleave', (e) => {
    const marquee = e.target.closest?.('.marquee');
    if (!marquee) return;
    setMarqueeRate(marquee, NORMAL_RATE);
  }, true);
})();
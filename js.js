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

// ДРЭГ ЭНД ДРОП вынесен в adaptive.js (тот же код, поддержка мыши и тача через pointer events)

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
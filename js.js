window.addEventListener('load', function() {
  console.log('Страница загружена, запускаем скрипты.');

  //ЗВУК ДЛЯ ТЕКСТА 
  (function() {
    const sound = new Audio('./mp3/zvyk1.mp3');
    sound.preload = 'auto';

    let canPlay = false;
    document.addEventListener('click', function enableSound() {
      canPlay = true;
      document.removeEventListener('click', enableSound);
    }, { once: true });

    const textBlocks = document.querySelectorAll('.text11, .text12, .text13');
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

  //ПАЗЛ

  (function() {
    const pieces = document.querySelectorAll('.block2 [class^="kvadratik"]');
    const modal = document.getElementById('puzzleModal');

  
    function getRandomRotation() {
      const rotations = [90, 180, 270];
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
        let current = parseInt(this.dataset.rotation);
        current = (current + 90) % 360;
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


window.addEventListener('load', function() {

  (function() {
    const sound = new Audio('./mp3/zvyk1.mp3');
    sound.preload = 'auto';
    let canPlay = false;
    document.addEventListener('click', function enableSound() {
      canPlay = true;
      document.removeEventListener('click', enableSound);
    }, { once: true });

    const textBlocks = document.querySelectorAll('.text11, .text12, .text13');
    if (textBlocks.length > 0) {
      textBlocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
          if (!canPlay) return;
          sound.currentTime = 0;
          sound.play().catch(() => {});
        });
        block.addEventListener('mouseleave', () => {
          sound.pause();
          sound.currentTime = 0;
        });
      });
    }
  })();

  (function() {
    const pieces = document.querySelectorAll('.block2 [class^="kvadratik"]');
    const modal = document.getElementById('puzzleModal');

    function getRandomRotation() {
      const rotations = [90, 180, 270];
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

  (function() {
    const draggableElements = document.querySelectorAll('.zemchug1, .zemchug2, .perlamytr, .racyshka, .bysina1, .bysina2, .bysina3, .kryzok, .colzo\\.mal, .colzo\\.mal2, .zyb, .brysochek, .zvezdochka, .krestik');
    const targetMap = {
      'zyb': document.querySelector('.obvodka\\.zyb'),
      'krestik': document.querySelector('.obvodka\\.krestik'),
      'racyshka': document.querySelector('.obvodka\\.rakyshka')
    };
    const movingElement = document.querySelector('.podviznaya\\.bysina');
    const popup = document.getElementById('popup2');
    const stepVW = 10.486;
    let correctCount = 0;
    const initialLeft = parseFloat(movingElement.style.left) || 50.7;

    let activeElement = null;
    let offsetX = 0, offsetY = 0;

    draggableElements.forEach(el => {
      el.style.cursor = 'grab';
      el.addEventListener('mousedown', onMouseDown);
    });

    function onMouseDown(e) {
      e.preventDefault();
      if (this.classList.contains('placed')) return;

      activeElement = this;
      const rect = activeElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      if (!activeElement.dataset.originalLeft) {
        activeElement.dataset.originalLeft = rect.left;
        activeElement.dataset.originalTop = rect.top;
      }

      activeElement.style.position = 'fixed';
      activeElement.style.left = rect.left + 'px';
      activeElement.style.top = rect.top + 'px';
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
      e.preventDefault();
      if (!activeElement) return;
      activeElement.style.left = (e.clientX - offsetX) + 'px';
      activeElement.style.top = (e.clientY - offsetY) + 'px';
    }

    function onMouseUp(e) {
      if (!activeElement) return;

      const elementRect = activeElement.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;

      let success = false;
      for (let key in targetMap) {
        if (activeElement.classList.contains(key) && targetMap[key]) {
          const targetRect = targetMap[key].getBoundingClientRect();
          if (elementCenterX > targetRect.left && elementCenterX < targetRect.right &&
              elementCenterY > targetRect.top && elementCenterY < targetRect.bottom) {
            success = true;
            if (!activeElement.classList.contains('placed')) {
              activeElement.classList.add('placed');
              correctCount++;
              const newLeft = initialLeft + stepVW * correctCount;
              movingElement.style.left = newLeft + 'vw';
            }
            break;
          }
        }
      }

      if (!success) {
        activeElement.style.position = 'absolute';
        activeElement.style.left = activeElement.dataset.originalLeft + 'px';
        activeElement.style.top = activeElement.dataset.originalTop + 'px';
        activeElement.style.width = '';
        activeElement.style.height = '';
      } else {
        activeElement.style.position = 'fixed';
        activeElement.style.pointerEvents = 'none';
      }

      activeElement.style.zIndex = '';
      activeElement.style.cursor = 'grab';
      activeElement.style.transition = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      activeElement = null;

      if (correctCount === 3) {
        popup.style.display = 'flex';
      }
    }

    popup.addEventListener('click', function(e) {
      if (e.target === popup) popup.style.display = 'none';
    });
  })();
});





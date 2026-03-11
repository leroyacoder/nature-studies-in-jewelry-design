// js.js

window.addEventListener('load', function() {
  console.log('Страница загружена, запускаем скрипты.');

  // --- ЗВУК ДЛЯ ТЕКСТА ---
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

  // --- ПАЗЛ (МОЗАИКА) ---
  (function() {
    const pieces = document.querySelectorAll('.block2 [class^="kvadratik"]');
    const modal = document.getElementById('puzzleModal');

    console.log('Найдено квадратиков в блоке 2:', pieces.length);
    console.log('Модальное окно:', modal);

    if (!pieces.length || !modal) {
      console.error('Пазл: не найдены элементы или модальное окно');
      return;
    }

    function getRandomRotation() {
      const rotations = [90, 180, 270];
      return rotations[Math.floor(Math.random() * rotations.length)];
    }

    pieces.forEach(piece => {
      const rot = getRandomRotation();
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
          console.log('Победа! Все квадратики блока 2 на 0');
          modal.style.display = 'flex';
        } else {
          const rotations = Array.from(pieces).map(p => parseInt(p.dataset.rotation));
          console.log('Текущие rotation:', rotations);
        }
      });
    });

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });

    console.log('Пазл настроен, элементов:', pieces.length);
  })();
});





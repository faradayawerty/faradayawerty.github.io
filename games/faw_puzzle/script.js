
(() => {
  const puzzle = document.getElementById('puzzle');
  const sizeSelect = document.getElementById('sizeSelect');
  const fileInput = document.getElementById('fileInput');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorCount = document.getElementById('errorCount');

  let imgSrc = 'img.jpg';
  let size = 3;
  let pieces = [];
  let pieceSizePx;
  let fullSizePx;

  // Заполнение селекта размера
  for (let i = 2; i <= 16; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i + ' x ' + i;
    sizeSelect.appendChild(opt);
  }
  sizeSelect.value = size;

  // Создаём кнопку подсказок
  const hintsBtn = document.createElement('button');
  hintsBtn.textContent = 'Подсказки';
  hintsBtn.style.marginLeft = '10px';
  shuffleBtn.insertAdjacentElement('afterend', hintsBtn);

  let hintsOn = false;

  hintsBtn.addEventListener('click', () => {
    hintsOn = !hintsOn;
    hintsBtn.style.backgroundColor = '';
    applyHints();
  });

  function updatePuzzleGrid() {
    puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.7;
    const tileW = Math.floor(maxWidth / size);
    const tileH = Math.floor(maxHeight / size);
    pieceSizePx = Math.min(tileW, tileH);

    puzzle.style.width = pieceSizePx * size + 'px';
    puzzle.style.height = pieceSizePx * size + 'px';
  }

  function createPieces() {
    puzzle.innerHTML = '';
    pieces = [];

    updatePuzzleGrid();
    fullSizePx = pieceSizePx * size;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const div = document.createElement('div');
        div.classList.add('piece');

        div.style.backgroundImage = `url(${imgSrc})`;
        div.style.backgroundPosition = `-${col * pieceSizePx}px -${row * pieceSizePx}px`;
        div.style.backgroundSize = `${fullSizePx}px ${fullSizePx}px`;

        div.style.width = pieceSizePx + 'px';
        div.style.height = pieceSizePx + 'px';

        div.dataset.flipH = 'false';
        div.dataset.flipV = 'false';
        div.dataset.row = row;
        div.dataset.col = col;

        div.addEventListener('click', e => {
          e.preventDefault();
          toggleFlip(div, 'vertical');
          checkSolved();
        });

        div.addEventListener('contextmenu', e => {
          e.preventDefault();
          toggleFlip(div, 'horizontal');
          checkSolved();
        });

        puzzle.appendChild(div);
        pieces.push(div);
      }
    }

    checkSolved();
  }

  function toggleFlip(div, axis) {
    if (axis === 'horizontal') {
      div.dataset.flipH = div.dataset.flipH === 'true' ? 'false' : 'true';
    } else if (axis === 'vertical') {
      div.dataset.flipV = div.dataset.flipV === 'true' ? 'false' : 'true';
    }
    updateTransform(div);
  }

  function updateTransform(div) {
    const flipH = div.dataset.flipH === 'true';
    const flipV = div.dataset.flipV === 'true';
    const scaleX = flipH ? -1 : 1;
    const scaleY = flipV ? -1 : 1;
    div.style.transform = `scale(${scaleX}, ${scaleY})`;
  }

  function shuffleFlips() {
    pieces.forEach(div => {
      div.dataset.flipH = Math.random() < 0.5 ? 'true' : 'false';
      div.dataset.flipV = Math.random() < 0.5 ? 'true' : 'false';
      updateTransform(div);
    });
    checkSolved();
  }

  function resetFlips() {
    pieces.forEach(div => {
      div.dataset.flipH = 'false';
      div.dataset.flipV = 'false';
      updateTransform(div);
    });
    checkSolved();
  }

  function applyHints() {
    pieces.forEach(div => {
      div.classList.remove('hint-correct', 'hint-wrong');
      if (!hintsOn) return;

      const correct = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
      if (correct) {
        div.classList.add('hint-correct');
      } else {
        div.classList.add('hint-wrong');
      }
    });
  }

  function checkSolved() {
    let wrongCount = 0;

    for (const div of pieces) {
      if (div.dataset.flipH !== 'false' || div.dataset.flipV !== 'false') {
        wrongCount++;
      }
    }

    errorCount.textContent = `Не на своём месте: ${wrongCount}`;
    puzzle.style.borderColor = wrongCount === 0 ? 'green' : 'red';

    applyHints();

    return wrongCount === 0;
  }

  sizeSelect.addEventListener('change', () => {
    size = +sizeSelect.value;
    createPieces();
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        imgSrc = ev.target.result;
        createPieces();
      };
      reader.readAsDataURL(file);
    }
  });

  shuffleBtn.addEventListener('click', shuffleFlips);
  resetBtn.addEventListener('click', resetFlips);

  window.addEventListener('resize', () => {
    updatePuzzleGrid();
    pieces.forEach(div => {
      div.style.backgroundSize = `${pieceSizePx * size}px ${pieceSizePx * size}px`;
      div.style.backgroundPosition = `-${div.dataset.col * pieceSizePx}px -${div.dataset.row * pieceSizePx}px`;
      div.style.width = pieceSizePx + 'px';
      div.style.height = pieceSizePx + 'px';
    });
  });

  createPieces();
})();

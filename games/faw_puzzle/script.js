
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

  // Добавляем кнопку переключения режима
  const controls = document.getElementById('controls');
  const modeBtn = document.createElement('button');
  modeBtn.id = 'modeBtn';
  modeBtn.textContent = 'Режим: Перевороты';
  controls.appendChild(modeBtn);

  // Переменные для режима
  let dragMode = false; // false - перевороты, true - перетаскивание
  let selectedPiece = null;

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
  hintsBtn.id = 'hintsBtn';
  hintsBtn.textContent = 'Подсказки';
  controls.appendChild(hintsBtn);

  let hintsOn = false;

  hintsBtn.addEventListener('click', () => {
    hintsOn = !hintsOn;
    hintsBtn.style.backgroundColor = '';
    applyHints();
  });

  modeBtn.addEventListener('click', () => {
    dragMode = !dragMode;
    modeBtn.textContent = dragMode ? 'Режим: Перетаскивание' : 'Режим: Перевороты';
    createPieces();
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

    // Для режима перетаскивания создаём массив с "позициями"
    // Для переворотов создаём "стандартные" кусочки
    // В режиме перетаскивания зададим случайный порядок для row и col

    // Создадим массив с позициями
    let positions = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        positions.push({ row: r, col: c });
      }
    }

    if (dragMode) {
      // Перемешиваем позиции
      positions = shuffleArray(positions);
    }

    for (let i = 0; i < positions.length; i++) {
      const { row, col } = positions[i];

      const div = document.createElement('div');
      div.classList.add('piece');

      div.style.backgroundImage = `url(${imgSrc})`;
      div.style.backgroundSize = `${fullSizePx}px ${fullSizePx}px`;

      // В режиме перетаскивания фон фиксируем на правильной позиции,
      // но сам кусок поставим на позицию в сетке согласно positions[i]
      // Чтобы фон совпадал с "правильным" местом, фон позиционируем по row и col в правильном порядке,
      // а grid позицию задаём с shuffled row/col.

      if (dragMode) {
        // Фон всегда правильный для этого куска (row,col по i)
        // Но data-row/data-col - положение на поле (positions[i])
        const correctRow = Math.floor(i / size);
        const correctCol = i % size;

        div.style.backgroundPosition = `-${correctCol * pieceSizePx}px -${correctRow * pieceSizePx}px`;
        div.dataset.correctRow = correctRow;
        div.dataset.correctCol = correctCol;

        div.dataset.row = row; // позиция на поле
        div.dataset.col = col;

        // ставим на сетку по row/col из shuffled positions
        div.style.gridRowStart = row + 1;
        div.style.gridColumnStart = col + 1;

        div.dataset.flipH = 'false';
        div.dataset.flipV = 'false';

        // В режиме перетаскивания отключаем перевороты и клики для них
        div.style.cursor = 'grab';

        // Добавим drag & drop события
        div.draggable = true;

        div.addEventListener('dragstart', dragStart);
        div.addEventListener('dragover', dragOver);
        div.addEventListener('drop', drop);
        div.addEventListener('dragend', dragEnd);

        // Также поддержим тап/клик — выбираем кусок, затем другой — меняем местами
        div.addEventListener('click', dragModeClickHandler);

      } else {
        // Обычный режим переворотов - на своих местах
        div.style.backgroundPosition = `-${col * pieceSizePx}px -${row * pieceSizePx}px`;
        div.dataset.row = row;
        div.dataset.col = col;
        div.dataset.flipH = 'false';
        div.dataset.flipV = 'false';

        div.style.gridRowStart = row + 1;
        div.style.gridColumnStart = col + 1;
        div.style.cursor = 'pointer';

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
      }

      puzzle.appendChild(div);
      pieces.push(div);
    }

    checkSolved();
  }

  // Перемешивание массива (Фишер-Йейтс)
  function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    if (dragMode) {
      // В режиме перетаскивания перемешиваем позиции
      // просто перемешиваем data-row/data-col и стили сетки
      let positions = pieces.map(p => ({ row: p.dataset.row, col: p.dataset.col }));
      positions = shuffleArray(positions);
      pieces.forEach((p, i) => {
        p.dataset.row = positions[i].row;
        p.dataset.col = positions[i].col;
        p.style.gridRowStart = parseInt(positions[i].row) + 1;
        p.style.gridColumnStart = parseInt(positions[i].col) + 1;
      });
      checkSolved();
    } else {
      // Обычный режим — перевороты
      pieces.forEach(div => {
        div.dataset.flipH = Math.random() < 0.5 ? 'true' : 'false';
        div.dataset.flipV = Math.random() < 0.5 ? 'true' : 'false';
        updateTransform(div);
      });
      checkSolved();
    }
  }

  function resetFlips() {
    if (dragMode) {
      // В режиме перетаскивания - вернуть на правильные места (data-row=data-correctRow и col)
      pieces.forEach(div => {
        div.dataset.row = div.dataset.correctRow;
        div.dataset.col = div.dataset.correctCol;
        div.style.gridRowStart = parseInt(div.dataset.correctRow) + 1;
        div.style.gridColumnStart = parseInt(div.dataset.correctCol) + 1;
      });
      checkSolved();
    } else {
      // Обычный режим - перевороты в исходное состояние (без отражений)
      pieces.forEach(div => {
        div.dataset.flipH = 'false';
        div.dataset.flipV = 'false';
        updateTransform(div);
      });
      checkSolved();
    }
  }

  function applyHints() {
    puzzle.classList.toggle('hints-on', hintsOn);

    pieces.forEach(div => {
      div.classList.remove('hint-correct', 'hint-wrong');
      if (!hintsOn) return;

      if (dragMode) {
        // В режиме перетаскивания: сравниваем позицию с правильной
        const correct = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
        div.classList.add(correct ? 'hint-correct' : 'hint-wrong');
      } else {
        // Обычный режим - перевороты
        const correct = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
        div.classList.add(correct ? 'hint-correct' : 'hint-wrong');
      }
    });
  }

  function checkSolved() {
    let wrongCount = 0;

    if (dragMode) {
      for (const div of pieces) {
        if (div.dataset.row != div.dataset.correctRow || div.dataset.col != div.dataset.correctCol) {
          wrongCount++;
        }
      }
    } else {
      for (const div of pieces) {
        if (div.dataset.flipH !== 'false' || div.dataset.flipV !== 'false') {
          wrongCount++;
        }
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
      if (dragMode) {
        // фон всегда фиксированный
        const correctRow = parseInt(div.dataset.correctRow);
        const correctCol = parseInt(div.dataset.correctCol);
        div.style.backgroundPosition = `-${correctCol * pieceSizePx}px -${correctRow * pieceSizePx}px`;
      } else {
        const row = parseInt(div.dataset.row);
        const col = parseInt(div.dataset.col);
        div.style.backgroundPosition = `-${col * pieceSizePx}px -${row * pieceSizePx}px`;
      }
      div.style.width = pieceSizePx + 'px';
      div.style.height = pieceSizePx + 'px';
    });
  });

  // --- Drag & Drop обработчики ---

  function dragStart(e) {
    selectedPiece = e.target;
    e.dataTransfer.effectAllowed = 'move';
  }

  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function drop(e) {
    e.preventDefault();
    if (!selectedPiece) return;
    const target = e.target;
    if (!target.classList.contains('piece') || target === selectedPiece) return;

    swapPieces(selectedPiece, target);
    selectedPiece = null;
    checkSolved();
  }

  function dragEnd(e) {
    selectedPiece = null;
  }

  // При тапе по кусочку в режиме drag — выбираем, а при выборе второго — меняем местами
  function dragModeClickHandler(e) {
    const target = e.currentTarget;
    if (!selectedPiece) {
      selectedPiece = target;
      target.style.outline = '2px solid #4a6ef7';
    } else if (selectedPiece === target) {
      selectedPiece.style.outline = '';
      selectedPiece = null;
    } else {
      // поменять местами
      swapPieces(selectedPiece, target);
      selectedPiece.style.outline = '';
      selectedPiece = null;
      checkSolved();
    }
  }

  function swapPieces(p1, p2) {
    // Меняем data-row, data-col и CSS grid позиции
    const r1 = p1.dataset.row;
    const c1 = p1.dataset.col;
    const r2 = p2.dataset.row;
    const c2 = p2.dataset.col;

    p1.dataset.row = r2;
    p1.dataset.col = c2;
    p2.dataset.row = r1;
    p2.dataset.col = c1;

    p1.style.gridRowStart = parseInt(r2) + 1;
    p1.style.gridColumnStart = parseInt(c2) + 1;
    p2.style.gridRowStart = parseInt(r1) + 1;
    p2.style.gridColumnStart = parseInt(c1) + 1;
  }

  createPieces();
})();

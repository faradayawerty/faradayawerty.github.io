
(() => {
    const puzzle = document.getElementById('puzzle');
    const sizeSelect = document.getElementById('sizeSelect');
    const fileInput = document.getElementById('fileInput');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorCount = document.getElementById('errorCount');
    const timerDisplay = document.getElementById('timerDisplay');
    const resetTimerBtn = document.getElementById('resetTimerBtn');

    const cropModal = document.getElementById('cropModal');
    const closeCropModalBtn = document.getElementById('closeCropModal');
    const cropperImage = document.getElementById('cropperImage');
    const applyCropBtn = document = document.getElementById('applyCropBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');

    let imgSrc = 'img.jpg';
    let size = 3;
    let pieces = [];
    let pieceSizePx;
    let fullSizePx;
    let cropper;

    const controls = document.getElementById('controls');

    const modeBtn = document.createElement('button');
    modeBtn.id = 'modeBtn';
    modeBtn.textContent = 'Режим: Перевороты';
    controls.appendChild(modeBtn);

    const hintsBtn = document.createElement('button');
    hintsBtn.id = 'hintsBtn';
    hintsBtn.textContent = 'Подсказки: ВЫКЛ';
    controls.appendChild(hintsBtn);

    const modes = ['flips', 'drag', 'fifteen', 'mixed'];
    let currentModeIndex = 0;
    let currentMode = modes[currentModeIndex];
    let selectedPiece = null;
    let hintsOn = false;

    let timer = 0;
    let timerInterval;

    for (let i = 2; i <= 16; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i + ' x ' + i;
        sizeSelect.appendChild(opt);
    }
    sizeSelect.value = size;

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    function startTimerLoop() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!checkSolved()) {
                timer++;
                timerDisplay.textContent = formatTime(timer);
            }
        }, 1000);
    }

    hintsBtn.addEventListener('click', () => {
        hintsOn = !hintsOn;
        hintsBtn.textContent = hintsOn ? 'Подсказки: ВКЛ' : 'Подсказки: ВЫКЛ';
        applyHints();
    });

    modeBtn.addEventListener('click', () => {
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        currentMode = modes[currentModeIndex];

        switch (currentMode) {
            case 'flips':
                modeBtn.textContent = 'Режим: Перевороты';
                break;
            case 'drag':
                modeBtn.textContent = 'Режим: Перетаскивание';
                break;
            case 'fifteen':
                modeBtn.textContent = 'Режим: Пятнашки';
                break;
            case 'mixed':
                modeBtn.textContent = 'Режим: Смешанный';
                break;
        }

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

        let positions = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                positions.push({
                    row: r,
                    col: c
                });
            }
        }

        if (currentMode === 'fifteen') {
            positions.pop();
        }

        for (let i = 0; i < positions.length; i++) {
            const {
                row,
                col
            } = positions[i];
            const div = document.createElement('div');
            div.classList.add('piece');
            div.style.backgroundImage = `url(${imgSrc})`;
            div.style.backgroundSize = `${fullSizePx}px ${fullSizePx}px`;

            const correctRow = Math.floor(i / size);
            const correctCol = i % size;

            div.style.backgroundPosition = `-${correctCol * pieceSizePx}px -${correctRow * pieceSizePx}px`;
            div.dataset.correctRow = correctRow;
            div.dataset.correctCol = correctCol;

            div.dataset.row = row;
            div.dataset.col = col;
            div.dataset.flipH = 'false';
            div.dataset.flipV = 'false';

            div.style.gridRowStart = row + 1;
            div.style.gridColumnStart = col + 1;

            if (currentMode === 'fifteen') {
                div.style.cursor = 'pointer';
                div.addEventListener('click', fifteenModeClickHandler);
            } else if (currentMode === 'drag') {
                div.style.cursor = 'grab';
                div.draggable = true;
                div.addEventListener('dragstart', dragStart);
                div.addEventListener('dragover', dragOver);
                div.addEventListener('drop', drop);
                div.addEventListener('dragend', dragEnd);
                div.addEventListener('click', dragModeClickHandler);
            } else if (currentMode === 'flips') {
                div.style.cursor = 'pointer';
                div.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    toggleFlip(div, 'horizontal');
                    checkSolved();
                });
                div.addEventListener('dblclick', e => {
                    e.preventDefault();
                    toggleFlip(div, 'horizontal');
                    checkSolved();
                });
                div.addEventListener('click', e => {
                    e.preventDefault();
                    toggleFlip(div, 'vertical');
                    checkSolved();
                });
            } else if (currentMode === 'mixed') {
                div.style.cursor = 'grab';
                div.draggable = true;
                div.addEventListener('dragstart', dragStart);
                div.addEventListener('dragover', dragOver);
                div.addEventListener('drop', drop);
                div.addEventListener('dragend', dragEnd);
                div.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    toggleFlip(div, 'horizontal');
                    checkSolved();
                });
                div.addEventListener('dblclick', e => {
                    e.preventDefault();
                    toggleFlip(div, 'horizontal');
                    checkSolved();
                });
                div.addEventListener('click', e => {
                    toggleFlip(div, 'vertical');
                    checkSolved();
                });
            }

            puzzle.appendChild(div);
            pieces.push(div);
        }

        if (currentMode === 'fifteen') {
            const emptySpot = document.createElement('div');
            emptySpot.classList.add('empty-spot');
            emptySpot.dataset.row = size - 1;
            emptySpot.dataset.col = size - 1;
            emptySpot.dataset.correctRow = size - 1;
            emptySpot.dataset.correctCol = size - 1;
            emptySpot.style.gridRowStart = size;
            emptySpot.style.gridColumnStart = size;
            puzzle.appendChild(emptySpot);
            pieces.push(emptySpot);
        }

        checkSolved();
    }

    function shuffleArray(arr) {
        const array = arr.slice();
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function shuffleFifteen() {
        resetPuzzle();
        let tiles = pieces.filter(p => !p.classList.contains('empty-spot'));
        let emptySpot = pieces.find(p => p.classList.contains('empty-spot'));

        const emptyInitialPos = {
            row: parseInt(emptySpot.dataset.row),
            col: parseInt(emptySpot.dataset.col)
        };

        const moves = size * size * 100;
        let prevMove = null;

        for (let i = 0; i < moves; i++) {
            const emptyRow = parseInt(emptySpot.dataset.row);
            const emptyCol = parseInt(emptySpot.dataset.col);

            const neighbors = [];
            if (emptyRow > 0) neighbors.push({
                row: emptyRow - 1,
                col: emptyCol
            });
            if (emptyRow < size - 1) neighbors.push({
                row: emptyRow + 1,
                col: emptyCol
            });
            if (emptyCol > 0) neighbors.push({
                row: emptyRow,
                col: emptyCol - 1
            });
            if (emptyCol < size - 1) neighbors.push({
                row: emptyRow,
                col: emptyCol + 1
            });

            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            const neighborPiece = pieces.find(p => parseInt(p.dataset.row) === randomNeighbor.row && parseInt(p.dataset.col) === randomNeighbor.col);

            if (neighborPiece) {
                swapPieces(neighborPiece, emptySpot);
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

    function shufflePuzzle() {
        if (currentMode === 'fifteen') {
            shuffleFifteen();
        } else if (currentMode === 'drag' || currentMode === 'mixed') {
            let positions = pieces.map(p => ({
                row: p.dataset.row,
                col: p.dataset.col
            }));
            positions = shuffleArray(positions);
            pieces.forEach((p, i) => {
                p.dataset.row = positions[i].row;
                p.dataset.col = positions[i].col;
                p.style.gridRowStart = parseInt(positions[i].row) + 1;
                p.style.gridColumnStart = parseInt(positions[i].col) + 1;
            });

            if (currentMode === 'mixed') {
                pieces.forEach(div => {
                    div.dataset.flipH = Math.random() < 0.5 ? 'true' : 'false';
                    div.dataset.flipV = Math.random() < 0.5 ? 'true' : 'false';
                    updateTransform(div);
                });
            }

            checkSolved();
        } else {
            pieces.forEach(div => {
                div.dataset.flipH = Math.random() < 0.5 ? 'true' : 'false';
                div.dataset.flipV = Math.random() < 0.5 ? 'true' : 'false';
                updateTransform(div);
            });
            checkSolved();
        }
        timer = 0;
        timerDisplay.textContent = formatTime(timer);
    }

    function resetPuzzle() {
        if (currentMode === 'fifteen') {
            pieces.forEach(div => {
                const correctRow = div.dataset.correctRow;
                const correctCol = div.dataset.correctCol;

                div.dataset.row = correctRow;
                div.dataset.col = correctCol;
                div.style.gridRowStart = parseInt(correctRow) + 1;
                div.style.gridColumnStart = parseInt(correctCol) + 1;
            });
        } else if (currentMode === 'drag' || currentMode === 'mixed') {
            pieces.forEach(div => {
                div.dataset.row = div.dataset.correctRow;
                div.dataset.col = div.dataset.correctCol;
                div.style.gridRowStart = parseInt(div.dataset.correctRow) + 1;
                div.style.gridColumnStart = parseInt(div.dataset.correctCol) + 1;
            });
        }

        if (currentMode === 'flips' || currentMode === 'mixed') {
            pieces.forEach(div => {
                div.dataset.flipH = 'false';
                div.dataset.flipV = 'false';
                updateTransform(div);
            });
        }
        checkSolved();
    }

    function applyHints() {
        puzzle.classList.toggle('hints-on', hintsOn);

        pieces.forEach(div => {
            div.classList.remove('hint-correct', 'hint-wrong');
            if (!hintsOn || div.classList.contains('empty-spot')) return;

            if (currentMode === 'fifteen' || currentMode === 'drag') {
                const correct = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                div.classList.add(correct ? 'hint-correct' : 'hint-wrong');
            } else if (currentMode === 'flips') {
                const correct = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                div.classList.add(correct ? 'hint-correct' : 'hint-wrong');
            } else if (currentMode === 'mixed') {
                 const correctPosition = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                 const correctFlip = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                 div.classList.add(correctPosition && correctFlip ? 'hint-correct' : 'hint-wrong');
            }
        });
    }

    function checkSolved() {
        let wrongCount = 0;
        let allCorrect = true;

        if (currentMode === 'fifteen' || currentMode === 'drag') {
            for (const div of pieces.filter(p => !p.classList.contains('empty-spot'))) {
                if (div.dataset.row != div.dataset.correctRow || div.dataset.col != div.dataset.correctCol) {
                    wrongCount++;
                    allCorrect = false;
                }
            }
        } else if (currentMode === 'flips') {
            for (const div of pieces) {
                if (div.dataset.flipH !== 'false' || div.dataset.flipV !== 'false') {
                    wrongCount++;
                    allCorrect = false;
                }
            }
        } else if (currentMode === 'mixed') {
            for (const div of pieces) {
                const correctPosition = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                const correctFlip = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                if (!correctPosition || !correctFlip) {
                    wrongCount++;
                    allCorrect = false;
                }
            }
        }

        errorCount.textContent = `Не на своём месте: ${wrongCount}`;
        puzzle.style.borderColor = allCorrect ? 'green' : 'red';

        applyHints();
        return allCorrect;
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
                cropModal.classList.add('active');
                cropperImage.src = ev.target.result;

                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(cropperImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 1,
                    responsive: true,
                    background: false,
                    zoomable: true,
                    movable: true,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    applyCropBtn.addEventListener('click', () => {
        if (cropper) {
            imgSrc = cropper.getCroppedCanvas({
                width: 1000,
                height: 1000,
                fillColor: '#fff',
            }).toDataURL('image/jpeg');

            cropModal.classList.remove('active');
            cropper.destroy();
            createPieces();
        }
    });

    cancelCropBtn.addEventListener('click', () => {
        cropModal.classList.remove('active');
        if (cropper) {
            cropper.destroy();
        }
        fileInput.value = '';
    });

    closeCropModalBtn.addEventListener('click', () => {
        cropModal.classList.remove('active');
        if (cropper) {
            cropper.destroy();
        }
        fileInput.value = '';
    });

    shuffleBtn.addEventListener('click', shufflePuzzle);
    resetBtn.addEventListener('click', resetPuzzle);
    resetTimerBtn.addEventListener('click', () => {
        timer = 0;
        timerDisplay.textContent = formatTime(timer);
    });

    window.addEventListener('resize', () => {
        updatePuzzleGrid();
        pieces.forEach(div => {
            if (div.classList.contains('empty-spot')) return;
            div.style.backgroundSize = `${pieceSizePx * size}px ${pieceSizePx * size}px`;
            if (currentMode === 'fifteen' || currentMode === 'drag' || currentMode === 'mixed') {
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
        selectedPiece.style.outline = '';
        selectedPiece = null;
        checkSolved();
    }

    function dragEnd() {
        if (selectedPiece) {
            selectedPiece.style.outline = '';
        }
        selectedPiece = null;
    }

    function dragModeClickHandler(e) {
        const target = e.currentTarget;
        if (target.classList.contains('piece')) {
            if (!selectedPiece) {
                selectedPiece = target;
                target.style.outline = '2px solid #4a6ef7';
            } else if (selectedPiece === target) {
                selectedPiece.style.outline = '';
                selectedPiece = null;
            } else {
                swapPieces(selectedPiece, target);
                selectedPiece.style.outline = '';
                selectedPiece = null;
                checkSolved();
            }
        }
    }

    function fifteenModeClickHandler(e) {
        const clickedPiece = e.currentTarget;
        const emptySpot = pieces.find(p => p.classList.contains('empty-spot'));
        if (!emptySpot) {
            return;
        }
        const emptyRow = parseInt(emptySpot.dataset.row);
        const emptyCol = parseInt(emptySpot.dataset.col);
        const clickedRow = parseInt(clickedPiece.dataset.row);
        const clickedCol = parseInt(clickedPiece.dataset.col);
        const isAdjacent = (Math.abs(emptyRow - clickedRow) === 1 && emptyCol === clickedCol) ||
            (Math.abs(emptyCol - clickedCol) === 1 && emptyRow === clickedRow);
        if (isAdjacent) {
            const tempRow = clickedPiece.dataset.row;
            const tempCol = clickedPiece.dataset.col;
            clickedPiece.dataset.row = emptySpot.dataset.row;
            clickedPiece.dataset.col = emptySpot.dataset.col;
            emptySpot.dataset.row = tempRow;
            emptySpot.dataset.col = tempCol;
            clickedPiece.style.gridRowStart = parseInt(clickedPiece.dataset.row) + 1;
            clickedPiece.style.gridColumnStart = parseInt(clickedPiece.dataset.col) + 1;
            emptySpot.style.gridRowStart = parseInt(emptySpot.dataset.row) + 1;
            emptySpot.style.gridColumnStart = parseInt(emptySpot.dataset.col) + 1;
            checkSolved();
        }
    }

    function swapPieces(p1, p2) {
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
    startTimerLoop();
})();

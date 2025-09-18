
(() => {
    const puzzle = document.getElementById('puzzle');
    const sizeSelect = document.getElementById('sizeSelect');
    const fileInput = document.getElementById('fileInput');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorCount = document.getElementById('errorCount');
    const timerDisplay = document.getElementById('timerDisplay');
    const resetTimerBtn = document.getElementById('resetTimerBtn');
    const multiplayerBtn = document.getElementById('multiplayer');

    const cropModal = document.getElementById('cropModal');
    const closeCropModalBtn = document.getElementById('closeCropModal');
    const cropperImage = document.getElementById('cropperImage');
    const applyCropBtn = document.getElementById('applyCropBtn');
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
    controls.appendChild(modeBtn);

    const hintsBtn = document.createElement('button');
    hintsBtn.id = 'hintsBtn';
    controls.appendChild(hintsBtn);

    const langSelect = document.createElement('select');
    langSelect.id = 'langSelect';
    controls.insertBefore(langSelect, multiplayerBtn);

    let currentLanguage = 'ru';

    const modes = ['flips', 'drag', 'mixed', 'fifteen', 'rotate', 'complex_flips', 'complex_rotate'];
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

    for (const langCode in languages) {
        const opt = document.createElement('option');
        opt.value = langCode;
        opt.textContent = languages[langCode].flag + ' ' + languages[langCode].name;
        langSelect.appendChild(opt);
    }
    langSelect.value = currentLanguage;

    function getTranslation(key) {
        return translations[currentLanguage][key] || translations['en'][key] || key;
    }

    function applyTranslations() {
        modeBtn.textContent = getTranslation('mode_' + currentMode);
        hintsBtn.textContent = hintsOn ? getTranslation('hints_on') : getTranslation('hints_off');
        shuffleBtn.textContent = getTranslation('shuffle_btn');
        resetBtn.textContent = getTranslation('reset_btn');
        resetTimerBtn.textContent = getTranslation('reset_timer_btn');
        errorCount.textContent = getTranslation('error_count') + getWrongCount();

        const fileLabel = document.querySelector('.file-label span');
        if (fileLabel) {
            fileLabel.textContent = getTranslation('file_label');
        }

        const multiplayerBtn = document.getElementById('multiplayer');
        if (multiplayerBtn) {
            multiplayerBtn.textContent = getTranslation('multiplayer');
        }

        const modalTitle = document.querySelector('#cropModal h2');
        if (modalTitle) {
            modalTitle.textContent = getTranslation('crop_modal_title');
        }

        const applyBtn = document.getElementById('applyCropBtn');
        if (applyBtn) {
            applyBtn.textContent = getTranslation('apply_crop_btn');
        }

        const cancelBtn = document.getElementById('cancelCropBtn');
        if (cancelBtn) {
            cancelBtn.textContent = getTranslation('cancel_crop_btn');
        }
    }

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
        hintsBtn.textContent = hintsOn ? getTranslation('hints_on') : getTranslation('hints_off');
        checkSolved();
    });

    modeBtn.addEventListener('click', () => {
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        currentMode = modes[currentModeIndex];
        modeBtn.textContent = getTranslation('mode_' + currentMode);
        timer = 0;
        timerDisplay.textContent = formatTime(timer);
        createPieces();
    });

    langSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        applyTranslations();
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
            div.style.fontSize = `${pieceSizePx * 0.3}px`; // Размер шрифта для адаптивных подсказок

            const imageInner = document.createElement('div');
            imageInner.classList.add('piece-image-inner');
            imageInner.style.backgroundImage = `url(${imgSrc})`;
            imageInner.style.backgroundSize = `${fullSizePx}px ${fullSizePx}px`;

            const correctRow = Math.floor(i / size);
            const correctCol = i % size;

            imageInner.style.backgroundPosition = `-${correctCol * pieceSizePx}px -${correctRow * pieceSizePx}px`;

            div.dataset.correctRow = correctRow;
            div.dataset.correctCol = correctCol;

            div.dataset.row = row;
            div.dataset.col = col;
            div.dataset.flipH = 'false';
            div.dataset.flipV = 'false';
            div.dataset.rotate = '0';

            div.style.gridRowStart = row + 1;
            div.style.gridColumnStart = col + 1;

            div.appendChild(imageInner);

            const hintNumber = document.createElement('span');
            hintNumber.classList.add('hint-number');
            hintNumber.textContent = i + 1;
            div.appendChild(hintNumber);

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
                div.addEventListener('dblclick', e => {
                    e.preventDefault();
                    toggleFlip(div, 'horizontal');
                    checkSolved();
                });
                div.addEventListener('click', e => {
                    toggleFlip(div, 'vertical');
                    checkSolved();
                });
            } else if (currentMode === 'rotate') {
                const hintArrow = document.createElement('span');
                hintArrow.classList.add('hint-arrow');
                div.appendChild(hintArrow);
                div.addEventListener('click', () => {
                    rotatePiece(div);
                    checkSolved();
                });
            } else if (currentMode === 'complex_flips') {
                div.style.cursor = 'pointer';
                div.addEventListener('click', e => {
                    e.preventDefault();
                    complexFlipClickHandler(div, 'vertical');
                });
                div.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    complexFlipClickHandler(div, 'horizontal');
                });
                div.addEventListener('dblclick', e => {
                    e.preventDefault();
                    complexFlipClickHandler(div, 'horizontal');
                });

                const flipIndicatorH = document.createElement('span');
                flipIndicatorH.classList.add('flip-indicator', 'flip-indicator-h');
                div.appendChild(flipIndicatorH);

                const flipIndicatorV = document.createElement('span');
                flipIndicatorV.classList.add('flip-indicator', 'flip-indicator-v');
                div.appendChild(flipIndicatorV);

            } else if (currentMode === 'complex_rotate') {
                const hintArrow = document.createElement('span');
                hintArrow.classList.add('hint-arrow');
                div.appendChild(hintArrow);
                div.style.cursor = 'pointer';
                div.addEventListener('click', e => {
                    e.preventDefault();
                    complexRotateClickHandler(div);
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
        const grid = Array.from({
            length: size
        }, () => Array.from({
            length: size
        }, () => null));

        pieces.forEach(p => {
            const row = parseInt(p.dataset.correctRow);
            const col = parseInt(p.dataset.correctCol);
            grid[row][col] = p;
        });

        let emptySpot = pieces.find(p => p.classList.contains('empty-spot'));
        let emptyRow = parseInt(emptySpot.dataset.row);
        let emptyCol = parseInt(emptySpot.dataset.col);

        const moves = size * size * 10;
        let lastMove = null;

        for (let i = 0; i < moves; i++) {
            const possibleMoves = [];
            if (emptyRow > 0 && lastMove !== 'down') possibleMoves.push('up');
            if (emptyRow < size - 1 && lastMove !== 'up') possibleMoves.push('down');
            if (emptyCol > 0 && lastMove !== 'right') possibleMoves.push('left');
            if (emptyCol < size - 1 && lastMove !== 'left') possibleMoves.push('right');

            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            lastMove = move;

            let pieceToMove;
            switch (move) {
                case 'up':
                    pieceToMove = grid[emptyRow - 1][emptyCol];
                    break;
                case 'down':
                    pieceToMove = grid[emptyRow + 1][emptyCol];
                    break;
                case 'left':
                    pieceToMove = grid[emptyRow][emptyCol - 1];
                    break;
                case 'right':
                    pieceToMove = grid[emptyRow][emptyCol + 1];
                    break;
            }

            const pieceToMoveRow = parseInt(pieceToMove.dataset.row);
            const pieceToMoveCol = parseInt(pieceToMove.dataset.col);

            const tempPiece = grid[emptyRow][emptyCol];
            grid[emptyRow][emptyCol] = grid[pieceToMoveRow][pieceToMoveCol];
            grid[pieceToMoveRow][pieceToMoveCol] = tempPiece;

            emptySpot.dataset.row = pieceToMoveRow;
            emptySpot.dataset.col = pieceToMoveCol;
            pieceToMove.dataset.row = emptyRow;
            pieceToMove.dataset.col = emptyCol;

            emptyRow = parseInt(emptySpot.dataset.row);
            emptyCol = parseInt(emptySpot.dataset.col);
        }

        pieces.forEach(p => {
            p.style.gridRowStart = parseInt(p.dataset.row) + 1;
            p.style.gridColumnStart = parseInt(p.dataset.col) + 1;
        });

        checkSolved();
    }

    function toggleFlip(div, axis) {
        if (!div.classList.contains('piece')) return;
        const imageInner = div.querySelector('.piece-image-inner');
        if (!imageInner) return;

        if (axis === 'horizontal') {
            div.dataset.flipH = div.dataset.flipH === 'true' ? 'false' : 'true';
        } else if (axis === 'vertical') {
            div.dataset.flipV = div.dataset.flipV === 'true' ? 'false' : 'true';
        }
        updateTransform(div);
    }

    function rotatePiece(div) {
        if (!div.classList.contains('piece')) return;
        let currentRotation = parseInt(div.dataset.rotate);
        currentRotation += 90;
        div.dataset.rotate = currentRotation;

        div.dataset.flipH = 'false';
        div.dataset.flipV = 'false';

        updateTransform(div);
    }

    function updateTransform(div) {
        const imageInner = div.querySelector('.piece-image-inner');
        if (!imageInner) return;

        let pieceTransformString = '';
        let imageTransformString = '';

        if (currentMode === 'flips' || currentMode === 'mixed' || currentMode === 'complex_flips') {
            const flipH = div.dataset.flipH === 'true';
            const flipV = div.dataset.flipV === 'true';
            const scaleX = flipH ? -1 : 1;
            const scaleY = flipV ? -1 : 1;
            imageTransformString += `scale(${scaleX}, ${scaleY}) `;
        }

        if (currentMode === 'rotate' || currentMode === 'complex_rotate') {
            const rotation = parseInt(div.dataset.rotate);
            pieceTransformString += `rotate(${rotation}deg)`;
        }

        div.style.transform = pieceTransformString.trim();
        imageInner.style.transform = imageTransformString.trim();
    }

    function getNeighbors(div) {
        const row = parseInt(div.dataset.row);
        const col = parseInt(div.dataset.col);
        const neighbors = [];

        const neighborCoords = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1]
        ];

        neighborCoords.forEach(([nRow, nCol]) => {
            const neighbor = pieces.find(p => parseInt(p.dataset.row) === nRow && parseInt(p.dataset.col) === nCol);
            if (neighbor && !neighbor.classList.contains('empty-spot')) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

    function complexFlipClickHandler(div, axis) {
        const tilesToFlip = [div, ...getNeighbors(div)];
        tilesToFlip.forEach(tile => toggleFlip(tile, axis));
        checkSolved();
    }

    function complexRotateClickHandler(div) {
        const tilesToRotate = [div, ...getNeighbors(div)];
        tilesToRotate.forEach(tile => rotatePiece(tile));
        checkSolved();
    }

    function shufflePuzzle() {
        if (currentMode === 'fifteen') {
            resetPuzzle();
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
        } else if (currentMode === 'flips') {
            pieces.forEach(div => {
                div.dataset.flipH = Math.random() < 0.5 ? 'true' : 'false';
                div.dataset.flipV = Math.random() < 0.5 ? 'true' : 'false';
                updateTransform(div);
            });
            checkSolved();
        } else if (currentMode === 'rotate') {
            pieces.forEach(div => {
                const randomRotation = Math.floor(Math.random() * 4) * 90;
                div.dataset.rotate = randomRotation;
                div.dataset.flipH = 'false';
                div.dataset.flipV = 'false';
                updateTransform(div);
            });
            checkSolved();
        } else if (currentMode === 'complex_flips' || currentMode === 'complex_rotate') {
            resetPuzzle();

            const puzzlePieces = pieces.filter(p => !p.classList.contains('empty-spot'));
            puzzlePieces.forEach(piece => {
                if (Math.random() < 0.5) {
                    if (currentMode === 'complex_flips') {
                        const axis = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                        complexFlipClickHandler(piece, axis);
                    } else if (currentMode === 'complex_rotate') {
                        complexRotateClickHandler(piece);
                    }
                }
            });
        }
        timer = 0;
        timerDisplay.textContent = formatTime(timer);
    }

    function resetPuzzle() {
        pieces.forEach(div => {
            div.dataset.flipH = 'false';
            div.dataset.flipV = 'false';
            div.dataset.rotate = '0';
            updateTransform(div);

            div.dataset.row = div.dataset.correctRow;
            div.dataset.col = div.dataset.correctCol;
            div.style.gridRowStart = parseInt(div.dataset.correctRow) + 1;
            div.style.gridColumnStart = parseInt(div.dataset.correctCol) + 1;
        });

        const emptySpot = pieces.find(p => p.classList.contains('empty-spot'));
        if (emptySpot) {
            emptySpot.dataset.row = emptySpot.dataset.correctRow;
            emptySpot.dataset.col = emptySpot.dataset.correctCol;
            emptySpot.style.gridRowStart = parseInt(emptySpot.dataset.correctRow) + 1;
            emptySpot.style.gridColumnStart = parseInt(emptySpot.dataset.correctCol) + 1;
        }

        timer = 0;
        timerDisplay.textContent = formatTime(timer);
        checkSolved();
    }

    function applyHints() {
        pieces.forEach(div => {
            const hintNumberEl = div.querySelector('.hint-number');
            const hintArrowEl = div.querySelector('.hint-arrow');
            const flipIndicatorHEl = div.querySelector('.flip-indicator-h');
            const flipIndicatorVEl = div.querySelector('.flip-indicator-v');

            div.classList.remove('hint-correct', 'hint-wrong');
            if (hintNumberEl) {
                hintNumberEl.style.display = 'none';
                hintNumberEl.classList.remove('hint-number-correct', 'hint-number-wrong');
            }
            if (hintArrowEl) {
                hintArrowEl.style.display = 'none';
                hintArrowEl.classList.remove('hint-arrow-correct', 'hint-arrow-wrong');
            }
            if (flipIndicatorHEl) {
                flipIndicatorHEl.style.display = 'none';
                flipIndicatorHEl.classList.remove('flip-indicator-correct', 'flip-indicator-wrong');
            }
            if (flipIndicatorVEl) {
                flipIndicatorVEl.style.display = 'none';
                flipIndicatorVEl.classList.remove('flip-indicator-correct', 'flip-indicator-wrong');
            }
        });

        if (!hintsOn) {
            return;
        }

        pieces.forEach(div => {
            const hintNumberEl = div.querySelector('.hint-number');
            const hintArrowEl = div.querySelector('.hint-arrow');
            const flipIndicatorHEl = div.querySelector('.flip-indicator-h');
            const flipIndicatorVEl = div.querySelector('.flip-indicator-v');

            if (div.classList.contains('empty-spot')) {
                return;
            }

            let correct = false;

            if (currentMode === 'fifteen' || currentMode === 'drag') {
                correct = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                if (hintNumberEl) hintNumberEl.style.display = 'block';
            } else if (currentMode === 'flips') {
                correct = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
            } else if (currentMode === 'mixed') {
                const correctPosition = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                const correctFlip = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                correct = correctPosition && correctFlip;
                if (hintNumberEl) hintNumberEl.style.display = 'block';
            } else if (currentMode === 'rotate' || currentMode === 'complex_rotate') {
                correct = parseInt(div.dataset.rotate) % 360 === 0;
                if (hintArrowEl) {
                    hintArrowEl.textContent = '↑';
                    hintArrowEl.classList.add(correct ? 'hint-arrow-correct' : 'hint-arrow-wrong');
                    hintArrowEl.style.display = 'block';
                }
            } else if (currentMode === 'complex_flips') {
                if (flipIndicatorHEl) {
                    const isHCorrect = div.dataset.flipH === 'false';
                    flipIndicatorHEl.textContent = isHCorrect ? '✓' : '✗';
                    flipIndicatorHEl.classList.toggle('flip-indicator-correct', isHCorrect);
                    flipIndicatorHEl.classList.toggle('flip-indicator-wrong', !isHCorrect);
                }
                if (flipIndicatorVEl) {
                    const isVCorrect = div.dataset.flipV === 'false';
                    flipIndicatorVEl.textContent = isVCorrect ? '✓' : '✗';
                    flipIndicatorVEl.classList.toggle('flip-indicator-correct', isVCorrect);
                    flipIndicatorVEl.classList.toggle('flip-indicator-wrong', !isVCorrect);
                }
                correct = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                if (flipIndicatorHEl && flipIndicatorVEl) {
                    flipIndicatorHEl.style.display = 'block';
                    flipIndicatorVEl.style.display = 'block';
                }
            }


            div.classList.toggle('hint-correct', correct);
            div.classList.toggle('hint-wrong', !correct);

            if (hintNumberEl) {
                hintNumberEl.classList.toggle('hint-number-correct', correct);
                hintNumberEl.classList.toggle('hint-number-wrong', !correct);
            }
        });
    }

    function getWrongCount() {
        let wrongCount = 0;
        if (currentMode === 'fifteen' || currentMode === 'drag') {
            for (const div of pieces.filter(p => !p.classList.contains('empty-spot'))) {
                if (div.dataset.row != div.dataset.correctRow || div.dataset.col != div.dataset.correctCol) {
                    wrongCount++;
                }
            }
        } else if (currentMode === 'flips' || currentMode === 'complex_flips') {
            for (const div of pieces) {
                if (div.dataset.flipH !== 'false' || div.dataset.flipV !== 'false') {
                    wrongCount++;
                }
            }
        } else if (currentMode === 'mixed') {
            for (const div of pieces) {
                const correctPosition = div.dataset.row == div.dataset.correctRow && div.dataset.col == div.dataset.correctCol;
                const correctFlip = div.dataset.flipH === 'false' && div.dataset.flipV === 'false';
                if (!correctPosition || !correctFlip) {
                    wrongCount++;
                }
            }
        } else if (currentMode === 'rotate' || currentMode === 'complex_rotate') {
            for (const div of pieces) {
                if (parseInt(div.dataset.rotate) % 360 !== 0) {
                    wrongCount++;
                }
            }
        }
        return wrongCount;
    }

    function checkSolved() {
        const wrongCount = getWrongCount();
        const allCorrect = wrongCount === 0;
        errorCount.textContent = getTranslation('error_count') + wrongCount;
        puzzle.style.borderColor = allCorrect ? 'green' : 'red';
        applyHints();
        return allCorrect;
    }

    sizeSelect.addEventListener('change', () => {
        size = +sizeSelect.value;
        timer = 0;
        timerDisplay.textContent = formatTime(timer);
        createPieces();
    });

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    document.body.addEventListener('paste', e => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                handleImageUpload(blob);
                break;
            }
        }
    });

    function handleImageUpload(file) {
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
            timer = 0;
            timerDisplay.textContent = formatTime(timer);
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
            const imageInner = div.querySelector('.piece-image-inner');
            if (div.classList.contains('empty-spot') || !imageInner) return;
            
            div.style.fontSize = `${pieceSizePx * 0.3}px`;
            
            imageInner.style.backgroundSize = `${pieceSizePx * size}px ${pieceSizePx * size}px`;
            
            const correctRow = parseInt(div.dataset.correctRow);
            const correctCol = parseInt(div.dataset.correctCol);
            imageInner.style.backgroundPosition = `-${correctCol * pieceSizePx}px -${correctRow * pieceSizePx}px`;
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
        const target = e.target.closest('.piece');
        if (!target || target === selectedPiece) return;

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
    applyTranslations();
})();

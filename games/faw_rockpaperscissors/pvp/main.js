
(function(ns) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const startGameBtn = document.getElementById("startGameBtn");
  const restartGameBtn = document.getElementById("restartGameBtn");
  const player1Controls = document.getElementById("player1Controls");
  const player2Controls = document.getElementById("player2Controls");

  ns.isRunning = false;  // Флаг состояния игры
  ns.units = ns.units || []; // Если массив не инициализирован
  ns.placing = true;     // Флаг размещения юнитов
  ns.winnerText = "";
  ns.winnerPlayer = null;
  ns.activePlayer = "player1";

ns.spawnRandomUnits = function() {
  const minUnits = 1;
  const maxUnits = 5;

  const allTypes = ["rock", "scissors", "paper"];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (const player of ["player1", "player2"]) {
    // Сколько юнитов сгенерировать — не больше количества типов
    const count = Math.min(randomInt(minUnits, maxUnits), allTypes.length);

    // Перемешиваем типы, чтобы выбрать уникальные
    const shuffledTypes = allTypes.slice().sort(() => Math.random() - 0.5);

    const chosenTypes = shuffledTypes.slice(0, count);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * ns.WIDTH;
      const y = Math.random() * ns.HEIGHT;

      const type = chosenTypes[i];
      ns.units.push(new ns.Unit(x, y, type, player));
    }
  }
};

  ns.draw = function() {
    ctx.clearRect(0, 0, ns.WIDTH, ns.HEIGHT);

    // --- Рисуем глобальную серую сетку ---
    const gridSize = 20;
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= ns.WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ns.HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ns.HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ns.WIDTH, y);
      ctx.stroke();
    }

    // --- Отрисовка юнитов ---
    for (let u of ns.units) {
      u.draw(ctx);
    }

    // --- Отрисовка текста победителя ---
    if (ns.winnerText) {
      const centerX = ns.WIDTH / 2;
      const centerY = ns.HEIGHT / 2;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(centerX - 150, centerY - 40, 300, 80);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 32px Arial";

      if (ns.winnerPlayer === "player1") {
        ctx.fillStyle = "#87CEFA";
        ctx.shadowColor = "#00BFFF";
      } else if (ns.winnerPlayer === "player2") {
        ctx.fillStyle = "#FF6347";
        ctx.shadowColor = "#FF4500";
      } else {
        ctx.fillStyle = "white";
        ctx.shadowColor = "white";
      }
      ctx.shadowBlur = 20;
      ctx.fillText(ns.winnerText, centerX, centerY);
      ctx.shadowBlur = 0;
    }
  };

  ns.gameLoop = function() {
    ns.update();
    ns.draw();
    if (!ns.winnerText) {
      ns.loop = requestAnimationFrame(ns.gameLoop);
    } else {
      ns.isRunning = false;  // Игра закончилась
    }
  };

  startGameBtn.addEventListener("click", () => {
    if (ns.isRunning) {
      return;
    }

    if (ns.units.length === 0) {
      ns.spawnRandomUnits();
      ns.ui.updateUI();
      ns.draw();
    }

    ns.placing = false;
    ns.isRunning = true;

    startGameBtn.style.display = "none";
    player1Controls.style.pointerEvents = "none";
    player2Controls.style.pointerEvents = "none";

    ns.loop = requestAnimationFrame(ns.gameLoop);
  });

  restartGameBtn.addEventListener("click", () => {
    ns.isRunning = false;

    ns.units = [];
    ns.placing = true;
    ns.winnerText = "";
    ns.winnerPlayer = null;
    ns.activePlayer = "player1";

    const activePlayerLabel = document.getElementById("activePlayer");
    activePlayerLabel.textContent = "Игрок 1";

    startGameBtn.style.display = "inline-block";
    player1Controls.style.pointerEvents = "auto";
    player2Controls.style.pointerEvents = "auto";
    document.getElementById("player1UnitsCount").textContent = "0";
    document.getElementById("player2UnitsCount").textContent = "0";
    restartGameBtn.style.display = "none";

    ns.ui.updateUI();
    ns.draw();
  });

canvas.addEventListener("click", (e) => {
  if (!ns.placing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Поиск юнита под курсором (берём последний попавший, если несколько)
  let clickedUnitIndex = -1;
  for (let i = ns.units.length - 1; i >= 0; i--) {
    const u = ns.units[i];
    // Предполагаем, что у Unit есть метод hitTest(x,y) или аналог, либо проверим по расстоянию
    // Если такого метода нет — проверим по расстоянию (например, радиус 15)
    const dx = u.x - x;
    const dy = u.y - y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance <= 15) {
      clickedUnitIndex = i;
      break;
    }
  }

  if (clickedUnitIndex >= 0) {
    // Удаляем юнита
    ns.units.splice(clickedUnitIndex, 1);
  } else {
    // Если юнита нет — создаём новый
    const type = ns.selectedTypes[ns.activePlayer];
    ns.units.push(new ns.Unit(x, y, type, ns.activePlayer));
  }

  ns.ui.updateUI();
  ns.draw();
});

  canvas.addEventListener("touchstart", (e) => {
    if (!ns.placing) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    const type = ns.selectedTypes[ns.activePlayer];
    ns.units.push(new ns.Unit(x, y, type, ns.activePlayer));

    ns.ui.updateUI();
    ns.draw();
  }, { passive: false });

  canvas.width = 700;
  canvas.height = 500;

  ns.WIDTH = canvas.width;
  ns.HEIGHT = canvas.height;

  ns.ui.setupTypeButtons();
  ns.ui.updateUI();
  ns.draw();

})(Game);

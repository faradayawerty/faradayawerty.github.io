
(function(ns) {
  function updateCanvasSize() {
    const canvas = ns.elements.canvas;
    const ctx = ns.elements.ctx;

    // Вычисляем размер canvas как меньшую сторону окна
    const cssSize = Math.min(window.innerWidth, window.innerHeight) * 0.95;

    // Устанавливаем реальные размеры canvas (без учета DPR)
    canvas.width = cssSize;
    canvas.height = cssSize;
    canvas.style.width = cssSize + "px";
    canvas.style.height = cssSize + "px";

    // Устанавливаем логические размеры игры
    ns.CANVAS_SIZE = cssSize;

    const BASE_LOGICAL_SIZE = 800; // базовая ширина/высота логики игры
    ns.scaleFactor = 1; // Без масштабирования

    // Устанавливаем логические размеры для игры
    ns.WIDTH = BASE_LOGICAL_SIZE;
    ns.HEIGHT = BASE_LOGICAL_SIZE;

    // Центрируем canvas
    canvas.style.position = "absolute";
    canvas.style.top = "50%";
    canvas.style.left = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
  }

  ns.init = function() {
    ns.elements.canvas = document.getElementById("gameCanvas");
    ns.elements.ctx = ns.elements.canvas.getContext("2d");
    ns.elements.typeButtons = document.querySelectorAll(".type-button");
    ns.elements.levelSelect = document.getElementById("levelSelect");
    ns.elements.startButton = document.getElementById("startButton");
    ns.elements.replayButton = document.getElementById("replayButton");
    ns.elements.playerUnitsLeft = document.getElementById("playerUnitsLeft");
    ns.elements.enemyUnitsCount = document.getElementById("enemyUnitsCount");

    updateCanvasSize(); // Изначально устанавливаем размеры канваса
    window.addEventListener("resize", () => {
      updateCanvasSize();  // Обновляем размеры при изменении окна
      ns.draw();
    });

    // Загрузка уровней в селектор
    Levels.forEach((lvl, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = lvl.name;
      ns.elements.levelSelect.appendChild(option);
    });

    ns.loadLevel(0);

    ns.elements.typeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        ns.selectedType = btn.dataset.type;
        ns.elements.typeButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });

    ns.elements.levelSelect.addEventListener("change", (e) => {
      ns.loadLevel(parseInt(e.target.value));
    });

    // Обработка мыши и касания
    ns.elements.canvas.addEventListener("click", ns.handleCanvasClick);
    ns.elements.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        e.preventDefault(); // Отключаем прокрутку
        ns.handleCanvasClick(e.touches[0]);
      }
    }, { passive: false });

    ns.elements.startButton.addEventListener("click", () => {
      if (ns.units.filter(u => u.team === "player").length === 0) {
        alert("Поставьте хотя бы один юнит!");
        return;
      }
      ns.winnerTeam = null;
      ns.winnerText = "";
      ns.placing = false;
      ns.elements.startButton.style.display = "none";
      ns.elements.replayButton.style.display = "inline-block";
      ns.elements.levelSelect.disabled = true;
      ns.run();
    });

    ns.elements.replayButton.addEventListener("click", () => {
      ns.loadLevel(ns.currentLevelIndex);
      ns.elements.startButton.style.display = "inline-block";
      ns.elements.replayButton.style.display = "none";
      ns.placing = true;
      ns.winnerText = "";
      ns.winnerTeam = null;
      ns.elements.levelSelect.disabled = false;
      ns.updateUnitCounts();
      ns.draw();
    });

    ns.updateUnitCounts();
    ns.draw();
  };

  ns.handleCanvasClick = function(event) {
    if (!ns.placing) return;

    const rect = ns.elements.canvas.getBoundingClientRect(); // Получаем размер канваса

    const touch = event.touches ? event.touches[0] : event;  // Если это касание, берем первое касание

    // Координаты относительно канваса
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Логируем координаты для проверки
    console.log('Canvas click at:', x, y);

    // Проверка на максимальное количество юнитов
    if (ns.units.filter(u => u.team === "player").length >= ns.maxPlayerUnits) {
      console.log("Максимальное количество юнитов достигнуто!");
      return;
    }

    // Создаем новый юнит игрока в логических координатах
    console.log("Создание юнита на:", x, y);
    ns.units.push(new ns.Unit(x, y, ns.selectedType, "player"));
    ns.updateUnitCounts();
    ns.draw();
  };

  ns.loadLevel = function(index) {
    ns.currentLevelIndex = index;
    ns.units = [];
    ns.placing = true;
    ns.winnerText = "";
    ns.winnerTeam = null;

    const level = Levels[index];
    level.enemyUnits.forEach(eu => {
      ns.units.push(new ns.Unit(eu.x, eu.y, eu.type, "enemy"));
    });

    ns.maxPlayerUnits = level.maxPlayerUnits;
    ns.elements.levelSelect.value = index;
    ns.updateUnitCounts();
    ns.draw();
  };

  ns.updateUnitCounts = function() {
    const playerCount = ns.units.filter(u => u.team === "player").length;
    const enemyCount = ns.units.filter(u => u.team === "enemy").length;
    ns.elements.playerUnitsLeft.textContent = `Player units: ${playerCount} / ${ns.maxPlayerUnits}`;
    ns.elements.enemyUnitsCount.textContent = `Enemy units: ${enemyCount}`;
  };

  ns.run = function() {
    if (ns.winnerTeam !== null) return;
    ns.update();
    ns.draw();
    ns.loop = requestAnimationFrame(ns.run);
  };

  ns.update = function() {
    ns.units.forEach(unit => unit.move());

    for (let i = ns.units.length - 1; i >= 0; i--) {
      const u1 = ns.units[i];
      for (let j = i - 1; j >= 0; j--) {
        const u2 = ns.units[j];
        if (u1.team !== u2.team) {
          const dx = ns.wrapDistance(u1.x, u2.x, ns.WIDTH);
          const dy = ns.wrapDistance(u1.y, u2.y, ns.HEIGHT);
          const dist = Math.hypot(dx, dy);
          if (dist < u1.radius + u2.radius) {
            ns.resolveConflict(u1, u2);
          }
        }
      }
    }

    ns.checkWin();
    ns.updateUnitCounts();
  };

  ns.checkWin = function() {
    const playerUnits = ns.units.filter(u => u.team === "player");
    const enemyUnits = ns.units.filter(u => u.team === "enemy");

    const playerAlive = playerUnits.length > 0;
    const enemyAlive = enemyUnits.length > 0;

    if (!playerAlive || !enemyAlive) {
      ns.winnerTeam = playerAlive ? "player" : "enemy";
      ns.winnerText = ns.winnerTeam === "player" ? "Уровень пройден!" : "";
      cancelAnimationFrame(ns.loop);
      ns.draw();
      return;
    }

    let canEat = false;
    for (let u1 of ns.units) {
      for (let u2 of ns.units) {
        if (u1.team !== u2.team && (ns.shouldChase(u1.type, u2.type) || ns.shouldFlee(u1.type, u2.type))) {
          canEat = true;
          break;
        }
      }
      if (canEat) break;
    }

    if (!canEat) {
      if (playerUnits.length > enemyUnits.length) {
        ns.winnerTeam = "player";
        ns.winnerText = "Уровень пройден!";
      } else if (enemyUnits.length > playerUnits.length) {
        ns.winnerTeam = "enemy";
        ns.winnerText = "";
      } else {
        ns.winnerTeam = null;
        ns.winnerText = "";
        return;
      }
      cancelAnimationFrame(ns.loop);
      ns.draw();
    }
  };
})(Game);

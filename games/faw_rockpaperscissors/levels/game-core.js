
(function(ns) {
  function updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ns.WIDTH = width * 0.75;
    ns.HEIGHT = height * 0.85;

    if (ns.elements.canvas) {
      ns.elements.canvas.style.width = ns.WIDTH + "px";
      ns.elements.canvas.style.height = ns.HEIGHT + "px";
      ns.elements.canvas.width = ns.WIDTH * dpr;
      ns.elements.canvas.height = ns.HEIGHT * dpr;
      ns.elements.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ns.elements.ctx.scale(dpr, dpr); // Scale drawing for high-DPI
    }
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

    updateCanvasSize();
    window.addEventListener("resize", () => {
      updateCanvasSize();
      ns.draw();
    });

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

    // Обработка мыши
    ns.elements.canvas.addEventListener("click", ns.handleCanvasClick);

    // Обработка касания
    ns.elements.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        e.preventDefault(); // отключаем прокрутку при касании
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

    const rect = ns.elements.canvas.getBoundingClientRect();
    const x = (event.clientX || event.pageX) - rect.left;
    const y = (event.clientY || event.pageY) - rect.top;

    for (let i = ns.units.length - 1; i >= 0; i--) {
      const unit = ns.units[i];
      if (unit.team === "player") {
        const dx = ns.wrapDistance(x, unit.x, ns.WIDTH);
        const dy = ns.wrapDistance(y, unit.y, ns.HEIGHT);
        if (Math.hypot(dx, dy) < unit.radius) {
          ns.units.splice(i, 1);
          ns.updateUnitCounts();
          ns.draw();
          return;
        }
      }
    }

    if (ns.units.filter(u => u.team === "player").length >= ns.maxPlayerUnits) return;

    const forbiddenRadius = 60;
    for (let enemyUnit of ns.units.filter(u => u.team === "enemy")) {
      const dx = ns.wrapDistance(x, enemyUnit.x, ns.WIDTH);
      const dy = ns.wrapDistance(y, enemyUnit.y, ns.HEIGHT);
      if (Math.hypot(dx, dy) < forbiddenRadius) return;
    }

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


var Game = Game || {};

(function(ns) {
  ns.CELL_SIZE = 30;
  ns.WIDTH = window.innerWidth * 0.8;
  ns.HEIGHT = window.innerHeight * 0.8;

  ns.units = [];
  ns.placing = true;
  ns.selectedType = "rock";
  ns.loop = null;
  ns.winnerText = "";
  ns.winnerTeam = null;
  ns.currentLevelIndex = 0;
  ns.maxPlayerUnits = 5;

  ns.elements = {};

  // --- Утилиты ---
  ns.wrapDistance = function(a, b, size) {
    let d = b - a;
    if (Math.abs(d) > size / 2) d -= Math.sign(d) * size;
    return d;
  };

  ns.shouldChase = function(t1, t2) {
    const map = { rock: "scissors", scissors: "paper", paper: "rock" };
    return map[t1] === t2;
  };

  ns.shouldFlee = function(t1, t2) {
    const map = { rock: "paper", paper: "scissors", scissors: "rock" };
    return map[t1] === t2;
  };

  ns.resolveConflict = function(a, b) {
    const map = { rock: "scissors", scissors: "paper", paper: "rock" };
    if (map[a.type] === b.type) {
      b.type = a.type;
      b.team = a.team;
    } else if (map[b.type] === a.type) {
      a.type = b.type;
      a.team = b.team;
    }
  };

  // --- Юнит ---
  class Unit {
    constructor(x, y, type, team) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.team = team;
      this.vx = (Math.random() * 2 - 1);
      this.vy = (Math.random() * 2 - 1);
      this.radius = 14;
      this.spawnTime = Date.now();
      this.nextDashTime = Date.now() + this.getRandomDashInterval();
    }

    getRandomDashInterval() {
      return 2000 + Math.random() * 3000;
    }

    dash() {
      const dashStrength = 5 + Math.random() * 10;
      const speed = Math.hypot(this.vx, this.vy) || 1;
      this.vx += (this.vx / speed) * dashStrength;
      this.vy += (this.vy / speed) * dashStrength;
      this.nextDashTime = Date.now() + this.getRandomDashInterval();
    }

    move() {
      if (Date.now() >= this.nextDashTime) {
        this.dash();
      }

      let target = null;
      let minDist = Infinity;

      for (let other of ns.units) {
        if (other === this || other.team === this.team) continue;
        if (ns.shouldChase(this.type, other.type) || ns.shouldFlee(this.type, other.type)) {
          let dx = ns.wrapDistance(this.x, other.x, ns.WIDTH);
          let dy = ns.wrapDistance(this.y, other.y, ns.HEIGHT);
          let dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            target = other;
          }
        }
      }

      const speed = 1.5;
      if (target) {
        let dx = ns.wrapDistance(this.x, target.x, ns.WIDTH);
        let dy = ns.wrapDistance(this.y, target.y, ns.HEIGHT);
        const d = Math.hypot(dx, dy) + 0.01;

        if (ns.shouldChase(this.type, target.type)) {
          this.vx += (dx / d) * speed * 0.1;
          this.vy += (dy / d) * speed * 0.1;
        } else if (ns.shouldFlee(this.type, target.type)) {
          this.vx -= (dx / d) * speed * 0.1;
          this.vy -= (dy / d) * speed * 0.1;
        }
      }

      for (let other of ns.units) {
        if (other === this || other.team !== this.team) continue;
        const dx = ns.wrapDistance(this.x, other.x, ns.WIDTH);
        const dy = ns.wrapDistance(this.y, other.y, ns.HEIGHT);
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < this.radius * 2) {
          const repulse = 1.5;
          this.vx -= (dx / dist) * repulse * 0.05;
          this.vy -= (dy / dist) * repulse * 0.05;
        }
      }

      this.vx *= 0.95;
      this.vy *= 0.95;

      this.x = (this.x + this.vx + ns.WIDTH) % ns.WIDTH;
      this.y = (this.y + this.vy + ns.HEIGHT) % ns.HEIGHT;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const age = Date.now() - this.spawnTime;
      if (age < 1000) ctx.globalAlpha = 0.5 + 0.5 * (age / 1000);
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = ns.COLORS[this.team];
      ctx.shadowBlur = 8;
      ctx.fillStyle = ns.COLORS[this.team];
      ctx.fillText(ns.EMOJIS[this.type], 0, 0);
      ctx.restore();
    }
  }
  ns.Unit = Unit;

  function updateCanvasSize() {
    ns.WIDTH = window.innerWidth * 0.8;
    ns.HEIGHT = window.innerHeight * 0.8;
    if (ns.elements.canvas) {
      ns.elements.canvas.width = ns.WIDTH;
      ns.elements.canvas.height = ns.HEIGHT;
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

    ns.elements.canvas.addEventListener("click", ns.handleCanvasClick);
    ns.elements.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      ns.handleCanvasClick(e.touches[0]);
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

    if (ns.units.filter(u => u.team === "player").length >= ns.maxPlayerUnits) {
      return;
    }

    const forbiddenRadius = 60;
    for (let enemyUnit of ns.units.filter(u => u.team === "enemy")) {
      const dx = ns.wrapDistance(x, enemyUnit.x, ns.WIDTH);
      const dy = ns.wrapDistance(y, enemyUnit.y, ns.HEIGHT);
      if (Math.hypot(dx, dy) < forbiddenRadius) {
        return;
      }
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

  ns.drawGrid = function(ctx) {
    ctx.strokeStyle = "#444"; // темно-серая сетка
    ctx.lineWidth = 1;

    for (let x = 0; x <= ns.WIDTH; x += ns.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ns.HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= ns.HEIGHT; y += ns.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ns.WIDTH, y);
      ctx.stroke();
    }
  };

  ns.draw = function() {
    const ctx = ns.elements.ctx;

    // фон
    ctx.fillStyle = "#222"; // темный фон
    ctx.fillRect(0, 0, ns.WIDTH, ns.HEIGHT);

    // сетка
    ns.drawGrid(ctx);

    // запретная зона при расстановке
    if (ns.placing) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ns.units.filter(u => u.team === "enemy").forEach(u => {
        ctx.beginPath();
        ctx.arc(u.x, u.y, 60, 0, 2 * Math.PI);
        ctx.stroke();
      });
      ctx.restore();
    }

    ns.units.forEach(unit => unit.draw(ctx));

    if (ns.winnerText) {
      ctx.font = "48px serif";
      ctx.fillStyle = "limegreen";
      ctx.textAlign = "center";
      ctx.fillText(ns.winnerText, ns.WIDTH / 2, ns.HEIGHT / 2);
    }
  };

  ns.COLORS = {
    player: "lightblue", // синий
    enemy: "tomato",  // оранжевый
  };

  ns.EMOJIS = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️",
  };

})(Game);

window.onload = function() {
  Game.init();
};

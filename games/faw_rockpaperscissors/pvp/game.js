
const Game = {
  WIDTH: 800,
  HEIGHT: 500,
  TYPES: ["rock", "paper", "scissors"],
  EMOJIS: { rock: "🪨", paper: "📄", scissors: "✂️" },
  COLORS: { player1: "#87CEFA", player2: "#FF6347" },
  units: [],
  placing: true,
  activePlayer: "player1",
  selectedTypes: { player1: "rock", player2: "rock" },
  loop: null,
  winnerText: "",
  winnerPlayer: null,
};

(function(ns) {
  class Unit {
    constructor(x, y, type, player) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.player = player;
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 - 1;
      this.radius = 12;
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

      for (const other of ns.units) {
        if (other === this || other.player === this.player) continue;
        if (shouldChase(this.type, other.type) || shouldFlee(this.type, other.type)) {
          const dx = wrapDistance(this.x, other.x, ns.WIDTH);
          const dy = wrapDistance(this.y, other.y, ns.HEIGHT);
          const dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            minDist = dist;
            target = other;
          }
        }
      }

      const baseSpeed = 1.5;
      if (target) {
        const dx = wrapDistance(this.x, target.x, ns.WIDTH);
        const dy = wrapDistance(this.y, target.y, ns.HEIGHT);
        const d = Math.hypot(dx, dy) + 0.01;

        if (shouldChase(this.type, target.type)) {
          this.vx += (dx / d) * baseSpeed * 0.1;
          this.vy += (dy / d) * baseSpeed * 0.1;
        } else if (shouldFlee(this.type, target.type)) {
          this.vx -= (dx / d) * baseSpeed * 0.1;
          this.vy -= (dy / d) * baseSpeed * 0.1;
        }
      }

      for (const other of ns.units) {
        if (other === this || other.player !== this.player) continue;
        const dx = wrapDistance(this.x, other.x, ns.WIDTH);
        const dy = wrapDistance(this.y, other.y, ns.HEIGHT);
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
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = ns.COLORS[this.player];
      ctx.shadowBlur = 6;
      ctx.fillStyle = ns.COLORS[this.player];
      ctx.fillText(ns.EMOJIS[this.type], 0, 0);
      ctx.restore();
    }
  }

  ns.Unit = Unit;

  function wrapDistance(a, b, size) {
    let d = b - a;
    if (Math.abs(d) > size / 2) d -= Math.sign(d) * size;
    return d;
  }

  function shouldChase(t1, t2) {
    const map = { rock: "scissors", scissors: "paper", paper: "rock" };
    return map[t1] === t2;
  }

  function shouldFlee(t1, t2) {
    const map = { rock: "paper", paper: "scissors", scissors: "rock" };
    return map[t1] === t2;
  }

  function beats(t1, t2) {
    return shouldChase(t1, t2);
  }

function resolveConflict(a, b) {
  let changed = false;
  if (beats(a.type, b.type)) {
    b.type = a.type;
    b.player = a.player;
    changed = true;
  } else if (beats(b.type, a.type)) {
    a.type = b.type;
    a.player = b.player;
    changed = true;
  }

  if (changed && Game.ui && typeof Game.ui.updateUI === "function") {
    Game.ui.updateUI();
  }
}

  ns.wrapDistance = wrapDistance;
  ns.shouldChase = shouldChase;
  ns.shouldFlee = shouldFlee;

  ns.update = function() {
    for (let u of ns.units) u.move();

    for (let i = 0; i < ns.units.length; i++) {
      for (let j = i + 1; j < ns.units.length; j++) {
        const a = ns.units[i];
        const b = ns.units[j];
        if (a.player === b.player) continue;

        const dx = wrapDistance(a.x, b.x, ns.WIDTH);
        const dy = wrapDistance(a.y, b.y, ns.HEIGHT);
        const dist = Math.hypot(dx, dy);

        if (dist < 24 && a.type !== b.type) {
          resolveConflict(a, b);
          const overlap = 24 - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;
        }
      }
    }

    checkWinCondition();
  };

function checkWinCondition() {
  if (ns.placing) return;

  const p1Units = ns.units.filter(u => u.player === "player1");
  const p2Units = ns.units.filter(u => u.player === "player2");

  if (p1Units.length === 0 && p2Units.length === 0) {
    showWinner("Ничья!", null);
    cancelAnimationFrame(ns.loop);
    return;
  }

  if (p1Units.length === 0) {
    showWinner("Игрок 2 победил!", "player2");
    cancelAnimationFrame(ns.loop);
    return;
  }

  if (p2Units.length === 0) {
    showWinner("Игрок 1 победил!", "player1");
    cancelAnimationFrame(ns.loop);
    return;
  }

  // Проверка на патовую ситуацию
  const p1CanBeat = p1Units.some(u1 =>
    p2Units.some(u2 => shouldChase(u1.type, u2.type))
  );
  const p2CanBeat = p2Units.some(u2 =>
    p1Units.some(u1 => shouldChase(u2.type, u1.type))
  );

  if (!p1CanBeat && !p2CanBeat) {
    if (p1Units.length > p2Units.length) {
      showWinner("Игрок 1 победил!", "player1");
    } else if (p2Units.length > p1Units.length) {
      showWinner("Игрок 2 победил!", "player2");
    } else {
      showWinner("Ничья!", null);
    }
    cancelAnimationFrame(ns.loop);
  }
}

  function showWinner(text, player) {
    ns.winnerText = text;
    ns.winnerPlayer = player;
    document.getElementById("restartGameBtn").style.display = "block";
    document.getElementById("startGameBtn").style.display = "none";
    document.getElementById("player1Controls").style.pointerEvents = "none";
    document.getElementById("player2Controls").style.pointerEvents = "none";
  }
})(Game);

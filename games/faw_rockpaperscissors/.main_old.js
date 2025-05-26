
// --- CONSTANTS ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 50;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const TYPES = ["rock", "paper", "scissors"];
const EMOJIS = { rock: "🪨", paper: "📄", scissors: "✂️" };
const COLORS = { player: "lightblue", enemy: "tomato" };

const MAX_PLAYER_UNITS = 15;
const MAX_ENEMY_UNITS = 15;

// --- GAME STATE ---
let units = [];
let placing = true;
let selectedType = "rock";
let loop;
let playerUnitCount = 0;
let battleStartTime = 0;
let winnerText = ""; // используется вместо DOM-элемента

// --- UI ELEMENTS ---
const playerUnitsLeftSpan = document.getElementById("playerUnitsLeft");
const enemyUnitsCountSpan = document.getElementById("enemyUnitsCount");
const replayButton = document.getElementById("replayButton");
const startButton = document.getElementById("startButton"); // добавили эту строку

// --- UNIT CLASS ---
class Unit {
  constructor(x, y, type, team) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.team = team;
    this.vx = (Math.random() * 2 - 1);
    this.vy = (Math.random() * 2 - 1);
    this.radius = 20;
    this.spawnTime = Date.now();
  }

  move() {
    let target = null;
    let minDist = Infinity;

    for (let other of units) {
      if (other === this || other.team === this.team) continue;
      if (shouldChase(this.type, other.type) || shouldFlee(this.type, other.type)) {
        let dx = wrapDistance(this.x, other.x, WIDTH);
        let dy = wrapDistance(this.y, other.y, HEIGHT);
        let dist = Math.hypot(dx, dy);
        if (dist < minDist) {
          minDist = dist;
          target = other;
        }
      }
    }

    const speed = 1.5;
    if (target) {
      let dx = wrapDistance(this.x, target.x, WIDTH);
      let dy = wrapDistance(this.y, target.y, HEIGHT);
      const d = Math.hypot(dx, dy) + 0.01;

      if (shouldChase(this.type, target.type)) {
        this.vx += (dx / d) * speed * 0.1;
        this.vy += (dy / d) * speed * 0.1;
      } else if (shouldFlee(this.type, target.type)) {
        this.vx -= (dx / d) * speed * 0.1;
        this.vy -= (dy / d) * speed * 0.1;
      }
    }

    // Avoid allies
    for (let other of units) {
      if (other === this || other.team !== this.team) continue;
      const dx = wrapDistance(this.x, other.x, WIDTH);
      const dy = wrapDistance(this.y, other.y, HEIGHT);
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < this.radius * 2) {
        const repulse = 1.5;
        this.vx -= (dx / dist) * repulse * 0.05;
        this.vy -= (dy / dist) * repulse * 0.05;
      }
    }

    this.vx *= 0.95;
    this.vy *= 0.95;

    this.x = (this.x + this.vx + WIDTH) % WIDTH;
    this.y = (this.y + this.vy + HEIGHT) % HEIGHT;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    const age = Date.now() - this.spawnTime;
    if (age < 1000) ctx.globalAlpha = 0.5 + 0.5 * (age / 1000);
    ctx.font = "32px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = COLORS[this.team];
    ctx.shadowBlur = 8;
    ctx.fillStyle = COLORS[this.team];
    ctx.fillText(EMOJIS[this.type], 0, 0);
    ctx.restore();
  }
}

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

function generateEnemyUnits() {
  units = units.filter(u => u.team === "player");
  for (let i = 0; i < MAX_ENEMY_UNITS; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    units.push(new Unit(x, y, randomType(), "enemy"));
  }
  updateUnitCountDisplay();
}

function randomType() {
  return TYPES[Math.floor(Math.random() * TYPES.length)];
}

function update() {
  for (let u of units) u.move();
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const a = units[i];
      const b = units[j];
      if (a.team === b.team) continue;
      const dx = wrapDistance(a.x, b.x, WIDTH);
      const dy = wrapDistance(a.y, b.y, HEIGHT);
      const dist = Math.hypot(dx, dy);
      if (dist < 20 && a.type !== b.type) resolveConflict(a, b);
    }
  }
  checkWinCondition();
}

function resolveConflict(a, b) {
  const map = { rock: "scissors", scissors: "paper", paper: "rock" };
  if (map[a.type] === b.type) {
    b.type = a.type;
    b.team = a.team;
  } else if (map[b.type] === a.type) {
    a.type = b.type;
    a.team = b.team;
  }
}

function checkWinCondition() {
  const p = units.filter(u => u.team === "player");
  const e = units.filter(u => u.team === "enemy");

  if (!placing) {
    if (p.length === 0) {
      showWinner("Enemy wins!");
      stopGame();
    } else if (e.length === 0) {
      showWinner("Player wins!");
      stopGame();
    }
  }
}

function showWinner(msg) {
  winnerText = msg;
  replayButton.style.display = "inline-block";
}

function stopGame() {
  clearInterval(loop);
}

function drawGrid() {
  const gridSize = CELL_SIZE; // 50 px по умолчанию
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;

  // Вертикальные линии
  for (let x = 0; x <= WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }

  // Горизонтальные линии
  for (let y = 0; y <= HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawGrid(); // добавляем сетку
  for (let u of units) u.draw();
  drawWinnerMessage();
}

function drawWinnerMessage() {
  if (!winnerText) return;
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(centerX - 150, centerY - 40, 300, 80);
  ctx.fillStyle = "white";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(winnerText, centerX, centerY);
}

function gameLoop() {
  update();
  draw();
  updateUnitCountDisplay();
}

function updateUnitCountDisplay() {
  const p = units.filter(u => u.team === "player").length;
  const e = units.filter(u => u.team === "enemy").length;
  playerUnitsLeftSpan.textContent = `Player units left: ${MAX_PLAYER_UNITS - playerUnitCount}`;
  enemyUnitsCountSpan.textContent = `Enemy units: ${e}`;
}


function placeUnit(e) {
  if (!placing) return; // Можно менять юниты только в режиме расстановки

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Проверяем, есть ли юнит игрока под курсором
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.team === "player") {
      const dx = wrapDistance(u.x, x, WIDTH);
      const dy = wrapDistance(u.y, y, HEIGHT);
      const dist = Math.hypot(dx, dy);
      if (dist <= u.radius) {
        // Удаляем юнита игрока
        units.splice(i, 1);
        playerUnitCount--;
        updateUnitCountDisplay();
        draw();
        return; // Если удалили, не ставим новый
      }
    }
  }

  // Если не кликнули по юниту, ставим новый (если есть лимит)
  if (playerUnitCount >= MAX_PLAYER_UNITS) return;

  units.push(new Unit(x, y, selectedType, "player"));
  playerUnitCount++;
  updateUnitCountDisplay();
  draw();
}

canvas.addEventListener("click", placeUnit);

const typeButtons = document.querySelectorAll(".type-button");
typeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    typeButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedType = btn.getAttribute("data-type");
  });
});

document.getElementById("startButton").addEventListener("click", () => {
  if (playerUnitCount === 0) return alert("Place at least one unit!");
  placing = false;
  generateEnemyUnits();
  winnerText = "";
  replayButton.style.display = "none";
  startButton.style.display = "none"; // Скрываем кнопку "Start"
  loop = setInterval(gameLoop, 30);
});

// --- Кнопка Replay ---
replayButton.addEventListener("click", () => {
  clearInterval(loop);
  units = [];
  playerUnitCount = 0;
  placing = true;
  winnerText = "";
  replayButton.style.display = "none";
  startButton.style.display = "inline-block"; // Показываем кнопку "Start" снова
  updateUnitCountDisplay();
  draw();
  requestAnimationFrame(idleLoop); // Запускаем отрисовку юнитов при расстановке
});

document.querySelector(".type-button[data-type='rock']").classList.add("selected");
updateUnitCountDisplay();

function idleLoop() {
  draw();
  if (placing) requestAnimationFrame(idleLoop);
}

idleLoop();

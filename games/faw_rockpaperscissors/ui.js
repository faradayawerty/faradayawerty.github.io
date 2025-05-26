
(function(ns) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ns.elements = {
    playerUnitsLeftSpan: document.getElementById("playerUnitsLeft"),
    enemyUnitsCountSpan: document.getElementById("enemyUnitsCount"),
    replayButton: document.getElementById("replayButton"),
    startButton: document.getElementById("startButton"),
    typeButtons: document.querySelectorAll(".type-button"),
  };

  ns.stopGame = function() {
    clearInterval(ns.loop);
    ns.loop = null;
  };

  ns.showWinner = function(text, team) {
    ns.winnerText = text;
    ns.winnerTeam = team || null;
    ns.elements.replayButton.style.display = "inline-block";
    clearInterval(ns.loop);
  };

  function drawGrid() {
    const gridSize = ns.CELL_SIZE;
    ctx.strokeStyle = '#333';
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
  }

  ns.drawWinnerMessage = function() {
    if (!ns.winnerText) return;
    const centerX = ns.WIDTH / 2;
    const centerY = ns.HEIGHT / 2;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(centerX - 150, centerY - 40, 300, 80);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 32px Arial";

    if (ns.winnerTeam === "player") {
      ctx.fillStyle = "#87CEFA";
      ctx.shadowColor = "#00BFFF";
    } else if (ns.winnerTeam === "enemy") {
      ctx.fillStyle = "#FF6347";
      ctx.shadowColor = "#FF4500";
    } else {
      ctx.fillStyle = "white";
      ctx.shadowColor = "white";
    }
    ctx.shadowBlur = 20;
    ctx.fillText(ns.winnerText, centerX, centerY);
    ctx.shadowBlur = 0;
  };

  ns.draw = function() {
    ctx.clearRect(0, 0, ns.WIDTH, ns.HEIGHT);
    drawGrid();
    for (let u of ns.units) u.draw(ctx);
    ns.drawWinnerMessage();
  };

  ns.updateUnitCountDisplay = function() {
    const p = ns.units.filter(u => u.team === "player").length;
    const e = ns.units.filter(u => u.team === "enemy").length;
    ns.elements.playerUnitsLeftSpan.textContent = `Player units left: ${ns.MAX_PLAYER_UNITS - ns.playerUnitCount}`;
    ns.elements.enemyUnitsCountSpan.textContent = `Enemy units: ${e}`;
  };

  ns.gameLoop = function() {
    ns.update();
    ns.draw();
    ns.updateUnitCountDisplay();
  };

  function placeUnit(e) {
    if (!ns.placing) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    for (let i = 0; i < ns.units.length; i++) {
      const u = ns.units[i];
      if (u.team === "player") {
        const dx = ns.wrapDistance(u.x, x, ns.WIDTH);
        const dy = ns.wrapDistance(u.y, y, ns.HEIGHT);
        const dist = Math.hypot(dx, dy);
        if (dist <= u.radius) {
          ns.units.splice(i, 1);
          ns.playerUnitCount--;
          ns.updateUnitCountDisplay();
          ns.draw();
          return;
        }
      }
    }

    if (ns.playerUnitCount >= ns.MAX_PLAYER_UNITS) return;

    ns.units.push(new ns.Unit(x, y, ns.selectedType, "player"));
    ns.playerUnitCount++;
    ns.updateUnitCountDisplay();
    ns.draw();
  }

  canvas.addEventListener("click", placeUnit);
  canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    placeUnit(e);
  }, { passive: false });

  ns.elements.typeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      ns.elements.typeButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      ns.selectedType = btn.getAttribute("data-type");
    });
  });

  ns.elements.startButton.addEventListener("click", () => {
    if (ns.playerUnitCount === 0) return alert("Place at least one unit!");
    ns.placing = false;
    ns.generateEnemyUnits();
    ns.winnerText = "";
    ns.winnerTeam = null;
    ns.elements.replayButton.style.display = "none";
    ns.elements.startButton.style.display = "none";
    ns.loop = setInterval(ns.gameLoop, 30);
  });

  ns.elements.replayButton.addEventListener("click", () => {
    clearInterval(ns.loop);
    ns.units = [];
    ns.playerUnitCount = 0;
    ns.placing = true;
    ns.winnerText = "";
    ns.winnerTeam = null;
    ns.elements.replayButton.style.display = "none";
    ns.elements.startButton.style.display = "inline-block";
    ns.updateUnitCountDisplay();
    ns.draw();
    requestAnimationFrame(idleLoop);
  });

  ns.elements.typeButtons.forEach(btn => btn.classList.remove("selected"));
  document.querySelector(".type-button[data-type='rock']").classList.add("selected");

  ns.updateUnitCountDisplay();

  function idleLoop() {
    ns.draw();
    if (ns.placing) requestAnimationFrame(idleLoop);
  }

  idleLoop();

  ns.checkWinCondition = function() {
    if (ns.placing) return;

    const playerUnits = ns.units.filter(u => u.team === "player");
    const enemyUnits = ns.units.filter(u => u.team === "enemy");

    if (playerUnits.length === 0 && enemyUnits.length === 0) {
      ns.showWinner("It's a draw!", null);
      ns.stopGame();
      return;
    }

    if (playerUnits.length === 0) {
      ns.showWinner("Enemy wins!", "enemy");
      ns.stopGame();
      return;
    }

    if (enemyUnits.length === 0) {
      ns.showWinner("Player wins!", "player");
      ns.stopGame();
      return;
    }

    const playerTypes = new Set(playerUnits.map(u => u.type));
    const enemyTypes = new Set(enemyUnits.map(u => u.type));

    if (playerTypes.size === 1 && enemyTypes.size === 1) {
      const pType = [...playerTypes][0];
      const eType = [...enemyTypes][0];

      if (pType === eType) {
        if (playerUnits.length > enemyUnits.length) {
          ns.showWinner("Player wins!", "player");
        } else if (enemyUnits.length > playerUnits.length) {
          ns.showWinner("Enemy wins!", "enemy");
        } else {
          ns.showWinner("It's a draw!", null);
        }
        ns.stopGame();
      }
    }
  };
})(Game);

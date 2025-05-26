
(function(ns) {

  ns.randomType = function() {
    return ns.TYPES[Math.floor(Math.random() * ns.TYPES.length)];
  };

ns.generateEnemyUnits = function() {
  const rock = parseInt(document.getElementById("enemyRockCount").value, 10) || 0;
  const paper = parseInt(document.getElementById("enemyPaperCount").value, 10) || 0;
  const scissors = parseInt(document.getElementById("enemyScissorsCount").value, 10) || 0;

  function spawn(type, count) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * Game.WIDTH;
      const y = Math.random() * Game.HEIGHT;
      Game.units.push(new Game.Unit(x, y, type, "enemy"));
    }
  }

  spawn("rock", rock);
  spawn("paper", paper);
  spawn("scissors", scissors);
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

  ns.checkWinCondition = function() {
    const p = ns.units.filter(u => u.team === "player");
    const e = ns.units.filter(u => u.team === "enemy");

    if (!ns.placing) {
      if (p.length === 0) {
        ns.showWinner("Enemy wins!");
        ns.stopGame();
      } else if (e.length === 0) {
        ns.showWinner("Player wins!");
        ns.stopGame();
      }
    }
  };

  ns.update = function() {
    for (let u of ns.units) u.move();

    for (let i = 0; i < ns.units.length; i++) {
      for (let j = i + 1; j < ns.units.length; j++) {
        const a = ns.units[i];
        const b = ns.units[j];
        if (a.team === b.team) continue;
        const dx = ns.wrapDistance(a.x, b.x, ns.WIDTH);
        const dy = ns.wrapDistance(a.y, b.y, ns.HEIGHT);
        const dist = Math.hypot(dx, dy);
        if (dist < 30 && a.type !== b.type) ns.resolveConflict(a, b);
      }
    }

    ns.checkWinCondition();
  };

})(Game);


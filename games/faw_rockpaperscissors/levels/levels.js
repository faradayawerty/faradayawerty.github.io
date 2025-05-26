
var Levels = (function() {
  return [
    // Уровень 1 — правильный треугольник, 3 врага, 4 игрока
    {
      name: "Уровень 1",
      maxPlayerUnits: 4,
      enemyUnits: (function() {
        const centerX = 400, centerY = 300, radius = 150;
        const types = ["rock", "paper", "scissors"];
        let units = [];
        for (let i = 0; i < 3; i++) {
          const angle = (2 * Math.PI / 3) * i - Math.PI / 2;
          units.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            type: types[i]
          });
        }
        return units;
      })()
    },

    // Уровень 2 — 4 врага: 2 бумаги и 2 камня, 2 игрока
    {
      name: "Уровень 2",
      maxPlayerUnits: 2,
      enemyUnits: [
        { x: 150, y: 300, type: "paper" },
        { x: 300, y: 100, type: "paper" },
        { x: 650, y: 220, type: "rock" },
        { x: 550, y: 400, type: "rock" }
      ]
    },

    // Уровень 3 — правильный шестиугольник, 6 врагов, 7 игроков
    {
      name: "Уровень 3",
      maxPlayerUnits: 7,
      enemyUnits: (function() {
        const centerX = 400, centerY = 300, radius = 150;
        const types = ["rock", "paper", "scissors", "rock", "paper", "scissors"];
        let units = [];
        for (let i = 0; i < 6; i++) {
          const angle = (2 * Math.PI / 6) * i - Math.PI / 2;
          units.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            type: types[i]
          });
        }
        return units;
      })()
    },

    // Уровень 4 — выдуманный: 8 врагов в случайных позициях, 6 игроков
    {
      name: "Уровень 4",
      maxPlayerUnits: 6,
      enemyUnits: [
        { x: 120, y: 150, type: "rock" },
        { x: 220, y: 250, type: "paper" },
        { x: 320, y: 100, type: "scissors" },
        { x: 450, y: 200, type: "rock" },
        { x: 550, y: 280, type: "paper" },
        { x: 650, y: 350, type: "scissors" },
        { x: 700, y: 420, type: "rock" },
        { x: 750, y: 150, type: "paper" }
      ]
    },

    // Уровень 5 — выдуманный: 10 врагов с равномерным распределением, 10 игроков
    {
      name: "Уровень 5",
      maxPlayerUnits: 10,
      enemyUnits: [
        { x: 100, y: 400, type: "scissors" },
        { x: 180, y: 320, type: "rock" },
        { x: 260, y: 350, type: "paper" },
        { x: 340, y: 280, type: "scissors" },
        { x: 420, y: 370, type: "rock" },
        { x: 500, y: 300, type: "paper" },
        { x: 580, y: 330, type: "scissors" },
        { x: 660, y: 280, type: "rock" },
        { x: 740, y: 350, type: "paper" },
        { x: 800, y: 400, type: "scissors" }
      ]
    },

    // Уровень 6 — враги слоями на кругах, 20 игроков
    {
      name: "Уровень 6",
      maxPlayerUnits: 20,
      enemyUnits: (function() {
        const centerX = 400, centerY = 300;
        let units = [];
        const radii = [80, 140, 200]; // три слоя
        const types = ["rock", "paper", "scissors"];
        for (let layer = 0; layer < radii.length; layer++) {
          const radius = radii[layer];
          const count = (layer + 1) * 6; // 6, 12, 18 юнитов по слоям
          for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI / count) * i - Math.PI / 2;
            units.push({
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
              type: types[(i + layer) % 3]
            });
          }
        }
        return units;
      })()
    }
  ];
})();

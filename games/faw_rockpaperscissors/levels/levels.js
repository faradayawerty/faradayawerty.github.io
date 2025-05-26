
var Levels = (function() {
  const normalize = (x, y) => ({ x: x, y: y * 4/3 }); // преобразуем из 800x600 в 800x800

  return [
    {
      name: "Уровень 1",
      maxPlayerUnits: 4,
      enemyUnits: (function() {
        const centerX = 400, centerY = 400, radius = 200;
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

    {
      name: "Уровень 2",
      maxPlayerUnits: 2,
      enemyUnits: [
        normalize(150, 300),
        normalize(300, 100),
        normalize(650, 220),
        normalize(550, 400)
      ].map((pos, i) => ({
        ...pos,
        type: i < 2 ? "paper" : "rock"
      }))
    },

    {
      name: "Уровень 3",
      maxPlayerUnits: 7,
      enemyUnits: (function() {
        const centerX = 400, centerY = 400, radius = 200;
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
        { x: 650, y: 150, type: "paper" }
      ].map(u => ({ ...normalize(u.x, u.y), type: u.type }))
    },

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
        { x: 700, y: 350, type: "paper" },
        { x: 500, y: 400, type: "scissors" }
      ].map(u => ({ ...normalize(u.x, u.y), type: u.type }))
    },

    {
      name: "Уровень 6",
      maxPlayerUnits: 20,
      enemyUnits: (function() {
        const centerX = 400, centerY = 400;
        let units = [];
        const radii = [100, 170, 240];
        const types = ["rock", "paper", "scissors"];
        for (let layer = 0; layer < radii.length; layer++) {
          const radius = radii[layer];
          const count = (layer + 1) * 6;
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

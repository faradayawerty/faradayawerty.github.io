
(function(ns) {
  ns.drawGrid = function(ctx) {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    // Рисуем сетку в логических координатах (без масштабирования)
    for (let x = 0; x <= ns.WIDTH; x += ns.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);  // Используем логические координаты
      ctx.lineTo(x, ns.HEIGHT);  // Используем логические координаты
      ctx.stroke();
    }
    for (let y = 0; y <= ns.HEIGHT; y += ns.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);  // Используем логические координаты
      ctx.lineTo(ns.WIDTH, y);  // Используем логические координаты
      ctx.stroke();
    }
  };

  ns.draw = function() {
    const ctx = ns.elements.ctx;

    // Сначала рисуем фон и сетку
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, ns.WIDTH, ns.HEIGHT); // Рисуем фон с логическими размерами
    ns.drawGrid(ctx); // Рисуем сетку без масштабирования

    // Рисуем юнитов с использованием логических координат
    ns.units.forEach(unit => unit.draw(ctx));

    if (ns.placing) {
      // Рисуем маркеры для расположения врагов
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Рисуем радиус вокруг вражеских юнитов, без масштабирования
      ns.units.filter(u => u.team === "enemy").forEach(u => {
        ctx.beginPath();
        
        // Используем логические координаты без масштабирования
        ctx.arc(u.x, u.y, 60, 0, 2 * Math.PI);  // Радиус остается фиксированным
        ctx.stroke();
      });
      ctx.restore();
    }

    // Рисуем текст с победой, без масштабирования
    if (ns.winnerText) {
      ctx.font = "48px serif";
      ctx.fillStyle = "limegreen";
      ctx.textAlign = "center";
      ctx.fillText(ns.winnerText, ns.WIDTH / 2, ns.HEIGHT / 2);
    }
  };
})(Game);


(function(ns) {
  ns.drawGrid = function(ctx) {
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    // Рисуем сетку в логических координатах (без масштабирования)
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

    // Сначала рисуем фон и сетку без масштабирования
    ctx.setTransform(1, 0, 0, 1, 0, 0); // сбрасываем старую трансформацию
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, ns.WIDTH, ns.HEIGHT); // рисуем фон
    ns.drawGrid(ctx); // рисуем сетку

    // Рисуем юнитов (с учетом масштаба)
    ns.units.forEach(unit => unit.draw(ctx));

    if (ns.placing) {
      // Рисуем маркеры для расположения врагов
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

    // Рисуем текст с победой
    if (ns.winnerText) {
      ctx.font = "48px serif";
      ctx.fillStyle = "limegreen";
      ctx.textAlign = "center";
      ctx.fillText(ns.winnerText, ns.WIDTH / 2, ns.HEIGHT / 2);
    }
  };
})(Game);

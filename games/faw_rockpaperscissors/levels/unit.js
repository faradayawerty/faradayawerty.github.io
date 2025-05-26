
(function(ns) {
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
})(Game);

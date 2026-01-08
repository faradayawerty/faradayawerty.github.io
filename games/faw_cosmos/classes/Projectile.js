
class Projectile {

	constructor(emitter, x, y) {
		Validate.isGameObject(emitter);
		this.emitter = emitter;
		this.time = 0;
		this.x = x;
		this.y = y;
		this.lifetimer = new Lifetimer(this, 2000);
		this.dead = false;
	}

	update(dt) {
		let speed = Config.projectileSpeedPerFrame;
		this.time += dt;
		this.y += speed * dt;
		this.lifetimer.update(dt);
	}

	draw(ctx) {
		let r = Config.projectileSize;
		Graphics.drawCircle(ctx, this.x, this.y, r, 'yellow', 'white', 2);
	}

	die() {
		this.dead = true;
	}

}



class Projectile {

	constructor(x, y) {
		this.time = 0;
		this.type = "projectile";
		this.x = x;
		this.y = y;
	}

	update(dt) {
		let speed = Config.projectileSpeedPerFrame;
		this.time += dt;
		this.y += speed * dt;
	}

	draw(ctx) {
		let r = Config.projectileSize;
		Graphics.drawCircle(ctx, this.x, this.y, r, 'yellow', 'white', 2);
	}

	die(game) {
		game.objects.delete(this);
	}

}


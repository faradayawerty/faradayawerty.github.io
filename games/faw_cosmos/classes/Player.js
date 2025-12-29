
class Player {

	constructor(game, x, y, input) {
		this.type = "player";
		this.time = 0;
		this.game = game;
		this.x = x;
		this.y = y;
		this.input = input;
	}

	update(dt) {
		let speed = 10;
		this.time += dt;
		if(this.input.isKeyDown('w'))
			this.y += speed;
		if(this.input.isKeyDown('s'))
			this.y -= speed;
		if(this.input.isKeyDown('a'))
			this.x -= speed;
		if(this.input.isKeyDown('d'))
			this.x += speed;
		if(this.input.isKeyDown(' '))
			this.shoot();
	}

	draw(ctx) {
		let w = Config.playerWidth;
		let x = this.x - 0.5 * w;
		let y = this.y - 0.5 * w;
		ctx.fillStyle = "red";
		ctx.fillRect(x, y, w, w);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x, y, w, w);
	}

	shoot() {
		let offset = Config.playerWidth;
		if(this.time - this.lastShotTime > Config.projectileShootDelay || this.lastShotTime == undefined) {
			this.game.objects.add(new Projectile(this.x, this.y + offset));
			this.lastShotTime = this.time;
		}
	}
	
}


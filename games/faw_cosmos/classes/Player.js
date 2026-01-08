
class Player {

	constructor(game, x, y, input) {
		this.time = 0;
		this.game = game;
		this.x = x;
		this.y = y;
		this.w = Config.playerWidth;
		this.h = Config.playerWidth;
		this.input = input;
		this.bb = new BoundingBox(0, 0, 4000, 1700);
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
		this.bb.correctPosition(this);
	}

	draw(ctx) {
		let w = this.w;
		let x = this.x - 0.5 * w;
		let y = this.y - 0.5 * w;
		ctx.fillStyle = "red";
		ctx.fillRect(x, y, w, w);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x, y, w, w);
		this.bb.draw(ctx);
	}

	shoot() {
		let offset = this.w;
		if(this.time - this.lastShotTime > Config.projectileShootDelay || this.lastShotTime == undefined) {
			this.game.objects.add(new Projectile(this, this.x, this.y + offset));
			this.lastShotTime = this.time;
		}
	}
	
}


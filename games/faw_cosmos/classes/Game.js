
class Game {

	constructor(input) {
		this.time = 0;
		this.objects = new Set();
		this.objects.add(new Player(this, 100, 100, input));
	}

	pause() {
	}

	update(dt) {
		this.time += dt;
		for(let object of this.objects) {
			object.update(dt);
		}
	}

	draw(ctx) {
		for(let object of this.objects) {
			object.draw(ctx);
		}
	}

}



class Game {

	constructor(input) {
		this.time = 0;
		this.paused = false;
		this.objects = new Set();
		this.objects.add(new Player(this, 100, 100, input));
	}

	pause() {
		this.paused = !this.paused;
	}

	update(dt) {

		if(this.paused)
			return;

		this.time += dt;
		for(let object of this.objects)
			object.update(dt);

		let toDelete = [];
		for(let object of this.objects) {
			if(object.dead)
				toDelete.push(object);
		}
		for(let i = 0; i < toDelete.length; i++)
			this.objects.delete(toDelete[i]);

	}

	draw(ctx) {
		for(let object of this.objects) {
			object.draw(ctx);
		}
	}

}



class UserInterface {

	constructor(input) {
		this.input = input;
	}

	update() {
	}

	draw(ctx) {
		ctx.fillStyle = "#005577";
		ctx.fillRect(0, 15.0 / 16.0 * ctx.canvas.height, ctx.canvas.width, ctx.canvas.height);
	}

}


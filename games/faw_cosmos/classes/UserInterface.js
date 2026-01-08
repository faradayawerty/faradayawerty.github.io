
class UserInterface {

	constructor(input) {
		this.input = input;
		this.position = "bottom";
		this.width = 1.0; // 100% of screen width
		this.height = 15.0 / 16.0;
	}

	update() {
	}

	draw(ctx) {
		ctx.fillStyle = "#005577";
		ctx.fillRect(0, 15.0 / 16.0 * ctx.canvas.height, ctx.canvas.width, ctx.canvas.height);
	}

}


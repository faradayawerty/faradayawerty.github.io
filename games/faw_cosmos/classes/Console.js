
class Console {

	constructor() {
		this.lines = [];
		this.maxLines = 128;
	}

	echo(line) {
		this.lines.push(line);
	}

	draw(ctx) {
	}

}


function drawText(ctx, x, y, text) {
	ctx.font = "14px verdana";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawMatterBody(ctx, b, color) {
	ctx.beginPath();
	let vertices = b.vertices;
	ctx.moveTo(vertices[0].x, vertices[0].y);
	for (let j = 1; j < vertices.length; j += 1)
		ctx.lineTo(vertices[j].x, vertices[j].y);
	ctx.lineTo(vertices[0].x, vertices[0].y);
	ctx.lineWidth = 0.1;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function drawMatterBodyFull(ctx, b, color) {
	ctx.beginPath();
	let vertices = b.vertices;
	for (let i = 0; i < vertices.length; i += 1) {
		for (let j = i; j < vertices.length; j += 1) {
			ctx.moveTo(vertices[i].x, vertices[i].y);
			ctx.lineTo(vertices[j].x, vertices[j].y);
		}
	}
	ctx.lineTo(vertices[0].x, vertices[0].y);
	ctx.lineWidth = 0.1;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function fillMatterBody(ctx, b, color) {
	ctx.beginPath();
	let vertices = b.vertices;
	ctx.moveTo(vertices[0].x, vertices[0].y);
	for (let j = 1; j < vertices.length; j += 1)
		ctx.lineTo(vertices[j].x, vertices[j].y);
	ctx.lineTo(vertices[0].x, vertices[0].y);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawCircle(ctx, x, y, r, fill_color, stroke_color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = fill_color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = stroke_color;
	ctx.stroke();
}

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function drawButton(ctx, x, y, text) {
	ctx.font = "36px verdana";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawText(ctx, x, y, text) {
	ctx.font = "14px verdana";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
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

function drawMatterBody(ctx, b, color) {
	ctx.beginPath();
	let vertices = b.vertices;
	ctx.moveTo(vertices[0].x, vertices[0].y);
	for (let j = 1; j < vertices.length; j += 1)
		ctx.lineTo(vertices[j].x, vertices[j].y);
	ctx.lineTo(vertices[0].x, vertices[0].y);
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function dist(v1, v2) {
	return Matter.Vector.magnitude(Matter.Vector.sub(v1, v2));
}

function doRectsCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
	return Math.abs(x1 + 0.5 * w1 - x2 - 0.5 * w2) < 0.5 * (w1 + w2) && Math.abs(y1 + 0.5 * h1 - y2 - 0.5 * h2) < 0.5 * (h1 + h2);
}


function drawButton(ctx, x, y, text) {
	ctx.font = "36px sans";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawText(ctx, x, y, text, fontsize = 18, color = 'white', isBold =
	false) {
	ctx.save();
	let weight = isBold ? "bold " : "";
	ctx.font = weight + fontsize + "px sans-serif";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = color;
	ctx.fillText(text, x + 1, y + 1);
	ctx.restore();
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

function drawMatterBody(ctx, b, color, lw = 2) {
	ctx.beginPath();
	ctx.lineWidth = lw;
	let vertices = b.vertices;
	ctx.moveTo(vertices[0].x, vertices[0].y);
	for (let j = 1; j < vertices.length; j += 1)
		ctx.lineTo(vertices[j].x, vertices[j].y);
	ctx.lineTo(vertices[0].x, vertices[0].y);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function dist(v1, v2) {
	return Matter.Vector.magnitude(Matter.Vector.sub(v1, v2));
}

function doRectsCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
	return Math.abs(x1 + 0.5 * w1 - x2 - 0.5 * w2) < 0.5 * (w1 + w2) && Math
		.abs(y1 + 0.5 * h1 - y2 - 0.5 * h2) < 0.5 * (h1 + h2);
}

function drawLine(ctx, x1, y1, x2, y2, color, width) {
	ctx.beginPath();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
	if (fill) {
		ctx.fillStyle = fill
		ctx.fill()
	}
	if (stroke) {
		ctx.lineWidth = strokeWidth
		ctx.strokeStyle = stroke
		ctx.stroke()
	}
}

function smoothMin(a, b) {
	return 0.5 * (a + b - 0.5 + Math.sqrt(0.25 + (a - b) * (a - b)));
}

function randomNormal() {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random();
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	num = num / 10.0 + 0.5;
	if (num > 1 || num < 0) return randomNormal();
	return num;
}
const drawMouse = (ctx, mx, my, w, h) => {
	let mw = 0.28 * w,
		mh = 0.42 * h;
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.beginPath();
	ctx.roundRect(mx, my, mw, mh, 0.08 * w);
	ctx.fill();
	ctx.strokeStyle = "rgba(0,0,0,0.6)";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(mx, my + mh * 0.4);
	ctx.lineTo(mx + mw, my + mh * 0.4);
	ctx.moveTo(mx + mw * 0.5, my);
	ctx.lineTo(mx + mw * 0.5, my + mh * 0.4);
	ctx.stroke();
	ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
	ctx.beginPath();
	ctx.roundRect(mx, my, mw * 0.5, mh * 0.4, {
		tl: 0.08 * w,
		tr: 0,
		bl: 0,
		br: 0
	});
	ctx.fill();
}
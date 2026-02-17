let DEATH_MESSAGE = "default death message";
const FONT_CACHE = {};
const MOUSE_RADII_POOL = [0, 0, 0, 0];
const PI2 = Math.PI * 2;

function drawButton(ctx, x, y, text) {
	if (text === "DEATH")
		text = DEATH_MESSAGE;
	ctx.font = "36px sans";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawText(ctx, x, y, text, fontsize = 18, color = 'white', isBold =
	false) {
	const fontKey = (isBold ? "b" : "n") + fontsize;
	if (!FONT_CACHE[fontKey]) {
		FONT_CACHE[fontKey] = (isBold ? "bold " : "") + fontsize +
			"px sans-serif";
	}
	ctx.font = FONT_CACHE[fontKey];
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = color;
	ctx.fillText(text, x + 1, y + 1);
}

function fillMatterBody(ctx, b, color) {
	const vertices = b.vertices;
	const v0 = vertices[0];
	ctx.beginPath();
	ctx.moveTo(v0.x, v0.y);
	for (let j = 1; j < vertices.length; j += 1) {
		const v = vertices[j];
		ctx.lineTo(v.x, v.y);
	}
	ctx.lineTo(v0.x, v0.y);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawMatterBody(ctx, b, color, lw = 2) {
	const vertices = b.vertices;
	const v0 = vertices[0];
	ctx.beginPath();
	ctx.lineWidth = lw;
	ctx.moveTo(v0.x, v0.y);
	for (let j = 1; j < vertices.length; j += 1) {
		const v = vertices[j];
		ctx.lineTo(v.x, v.y);
	}
	ctx.lineTo(v0.x, v0.y);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function dist(v1, v2) {
	const dx = v1.x - v2.x;
	const dy = v1.y - v2.y;
	return Math.sqrt(dx * dx + dy * dy);
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
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, PI2, false);
	if (fill) {
		ctx.fillStyle = fill;
		ctx.fill();
	}
	if (stroke) {
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = stroke;
		ctx.stroke();
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
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(PI2 * v);
	num = num / 10.0 + 0.5;
	if (num > 1 || num < 0) return randomNormal();
	return num;
}
const drawMouse = (ctx, mx, my, w, h) => {
	const mw = 0.28 * w;
	const mh = 0.42 * h;
	const r = 0.08 * w;
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.beginPath();
	ctx.roundRect(mx, my, mw, mh, r);
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
	MOUSE_RADII_POOL[0] = r;
	MOUSE_RADII_POOL[1] = 0;
	MOUSE_RADII_POOL[2] = 0;
	MOUSE_RADII_POOL[3] = 0;
	ctx.roundRect(mx, my, mw * 0.5, mh * 0.4, MOUSE_RADII_POOL);
	ctx.fill();
}
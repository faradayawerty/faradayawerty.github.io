
function drawButton(ctx, x, y, text) {
	ctx.font = "36px verdana";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawText(ctx, x, y, text, fontsize=18) {
	ctx.font = fontsize + "px sans";
	ctx.fillStyle = 'black';
	ctx.fillText(text, x, y);
	ctx.fillStyle = 'white';
	ctx.fillText(text, x + 1, y + 1);
}

function drawHint(ctx, x, y, text) {
	ctx.font = "8px verdana";
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

function drawMatterBody(ctx, b, color, lw=2) {
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
	return Math.abs(x1 + 0.5 * w1 - x2 - 0.5 * w2) < 0.5 * (w1 + w2) && Math.abs(y1 + 0.5 * h1 - y2 - 0.5 * h2) < 0.5 * (h1 + h2);
}

function drawLine(ctx, x1, y1, x2, y2, color, width) {
	ctx.beginPath();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

// source: https://stackoverflow.com/questions/25095548/how-to-draw-a-circle-in-html5-canvas-using-javascript
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
	return 0.5 * (a + b - 0.5 +  Math.sqrt(0.25 + (a - b) * (a - b)));
}


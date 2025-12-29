
class Graphics {

	static drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
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

}


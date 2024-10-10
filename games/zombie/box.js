
function box_update(g, b, dt) {
}

function box_draw(g, b, ctx) {
	ctx.fillStyle = 'black';
	ctx.fillRect(b.x, b.y, 1, 1);
	ctx.fillStyle = 'yellow';
	ctx.fillRect(b.x + 0.1, b.y + 0.1, 0.8, 0.8);
}

function box_create(g, x_, y_) {
	let b = {
		x: x_,
		y: y_
	};
	return game_object_create(g, box_update, box_draw, b);
}


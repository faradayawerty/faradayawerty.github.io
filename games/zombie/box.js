
function box_update(g, b, dt) {
}

function box_draw(g, b, ctx) {
	ctx.fillStyle = 'yellow';
	ctx.fillRect(b.x, b.y, 1, 1);
}

function box_create(g, x_, y_) {
	let b = {
		x: x_,
		y: y_
	};
	return game_object_create(g, box_update, box_draw, b);
}


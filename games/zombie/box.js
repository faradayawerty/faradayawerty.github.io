
function box_create(g, x, y) {
	let p = {
		body: Matter.Bodies.rectangle(x, y, 1, 1)
	};
	Matter.Composite.add(engine.world, p.body);
	return game_object_create(g, box_update, box_draw, p);
}

function box_update(g, p, dt) {
}

function box_draw(g, p, ctx) {
	drawMatterBody(ctx, p.body, 'yellow')
}


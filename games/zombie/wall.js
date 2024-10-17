function wall_create(g, x, y, w, h) {
	let data = {
		body: Matter.Bodies.rectangle(x, y, w, h, {
			isStatic: true
		})
	};
	Matter.Composite.add(g.engine.world, data.body);
	return game_object_create(g, wall_update, wall_draw, data);
}

function wall_update(g, w, dt) {}

function wall_draw(g, w, ctx) {
	drawMatterBody(ctx, w.body, 'blue')
}

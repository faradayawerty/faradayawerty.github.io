function box_create(g, x, y, size, mass) {
	let b = {
		body: Matter.Bodies.rectangle(x, y, size, size)
	};
	Matter.Body.setMass(b.body, mass);
	Matter.Composite.add(g.engine.world, b.body);
	return game_object_create(g, box_update, box_draw, b);
}

function box_update(g, b, dt) {}

function box_draw(g, b, ctx) {
	fillMatterBody(ctx, b.body, 'orange')
	drawMatterBodyFull(ctx, b.body, 'black')
}
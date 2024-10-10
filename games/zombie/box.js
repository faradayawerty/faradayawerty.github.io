
function box_create(g, x, y, size, mass) {
	let b = {
		body: Matter.Bodies.rectangle(x, y, size, size)
	};
	Matter.Body.setMass(b.body, mass);
	Matter.Composite.add(engine.world, b.body);
	return game_object_create(g, box_update, box_draw, b);
}

function box_update(g, p, dt) {
}

function box_draw(g, p, ctx) {
	fillMatterBody(ctx, p.body, 'yellow')
}


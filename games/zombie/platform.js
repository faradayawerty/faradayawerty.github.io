
function platform_create(g, x, y, w, h) {
	let p = {
		body: Matter.Bodies.rectangle(x, y, w, h, {isStatic: true})
	};
	Matter.Composite.add(engine.world, p.body);
	return game_object_create(g, platform_update, platform_draw, p);
}

function platform_update(g, p, dt) {
}

function platform_draw(g, p, ctx) {
	drawMatterBody(ctx, p.body, 'black')
}


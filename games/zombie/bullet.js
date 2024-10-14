function bullet_create(g, x, y, tx, ty) {
	let r = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
	let b = {
		speed: 1.5,
		body: Matter.Bodies.rectangle(x + 2.5 * (tx - x) / r, y + 2.5 * (ty - y) / r, 0.5, 0.5)
	};
	let vel = Matter.Vector.create(b.speed * (tx - x) / r, b.speed * (ty - y) / r);
	Matter.Body.setVelocity(b.body, vel);
	Matter.Composite.add(engine.world, b.body);
	return game_object_create(g, bullet_update, bullet_draw, b);
}

function bullet_update(g, b, dt) {}

function bullet_draw(g, b, ctx) {
	drawMatterBody(ctx, b.body, 'yellow')
}

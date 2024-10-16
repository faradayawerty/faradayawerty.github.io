function bullet_create(g, x, y, dx, dy) {
	let r = Math.sqrt(dx*dx + dy*dy)
	let b = {
		speed: 1.5,
		body: Matter.Bodies.rectangle(x + 2.5 * dx / r, y + 2.5 * dy / r, 0.5, 0.5)
	};
	let vel = Matter.Vector.create(b.speed * dx / r, b.speed * dy / r);
	Matter.Body.setVelocity(b.body, vel);
	Matter.Composite.add(engine.world, b.body);
	return game_object_create(g, bullet_update, bullet_draw, b);
}

function bullet_update(g, b, dt) {}

function bullet_draw(g, b, ctx) {
	fillMatterBody(ctx, b.body, 'yellow')
}

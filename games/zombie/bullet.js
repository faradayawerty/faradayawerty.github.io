
function bullet_create(g, x, y, dx, dy, speed_) {
	let r = Math.sqrt(dx*dx + dy*dy)
	let b = {
		destroy: false,
		speed: speed_,
		lifetime: 1000,
		//body: Matter.Bodies.rectangle(x + 2.5 * dx / r, y + 2.5 * dy / r, 0.35, 0.35)
		body: Matter.Bodies.rectangle(x, y, 0.35, 0.35)
	};
	let vel = Matter.Vector.create(b.speed * dx / r, b.speed * dy / r);
	Matter.Body.setVelocity(b.body, vel);
	Matter.Composite.add(g.engine.world, b.body);
	return game_object_create(g, bullet_update, bullet_draw, b);
}

function bullet_destroy(g, b) {
	Matter.Composite.remove(g.engine.world, b.body);
	delete b.body;
	b.destroy = true;
}

function bullet_update(g, b, dt) {
	b.lifetime -= dt;
	if(b.lifetime < 0)
		bullet_destroy(g, b);
}

function bullet_draw(g, b, ctx) {
	fillMatterBody(ctx, b.body, 'orange');
	drawMatterBody(ctx, b.body, 'yellow');
}


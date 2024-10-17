function enemy_create(g, x, y, target_) {
	let e = {
		target: target_,
		speed: 0.25,
		body: Matter.Bodies.rectangle(x, y, 1, 1)
	};
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, enemy_update, enemy_draw, e);
}

function enemy_update(g, e, dt) {
	itarget = g.objects.indexOf(e.target);
	if (!g.objects[itarget].data.body)
		return;
	let tx = g.objects[itarget].data.body.vertices[0].x;
	let ty = g.objects[itarget].data.body.vertices[0].y;
	let x = e.body.vertices[0].x;
	let y = e.body.vertices[0].y;
	let r = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
	let vel = Matter.Vector.create(e.speed * (tx - x) / r, e.speed * (ty - y) / r);
	Matter.Body.setVelocity(e.body, vel);
}

function enemy_draw(g, e, ctx) {
	fillMatterBody(ctx, e.body, 'green')
}

function enemy_create(g, x, y, target_) {
	let w_ = 1 + 1.5 * Math.random(),
		h_ = w_;
	let e = {
		max_hp: 100 * w_,
		hp: 100 * w_,
		damage: 0.1, // per delta time
		w: w_,
		h: h_,
		target: target_,
		can_be_hit: true,
		destroy: false,
		speed: 0.15 + 0.15 * Math.random() / w_,
		body: Matter.Bodies.rectangle(x, y, w_, h_)
	};
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, enemy_update, enemy_draw, e);
}

function enemy_update(g, e, dt) {
	if(e.hp <= 0)
		return enemy_destroy(g, e);
	itarget = g.objects.indexOf(e.target);
	if (!g.objects[itarget] || !g.objects[itarget].data.body)
		return;
	let tx = g.objects[itarget].data.body.vertices[0].x;
	let ty = g.objects[itarget].data.body.vertices[0].y;
	let x = e.body.vertices[0].x;
	let y = e.body.vertices[0].y;
	let r = Math.sqrt((tx - x) * (tx - x) + (ty - y) * (ty - y));
	let vel = Matter.Vector.create(e.speed * (tx - x) / r, e.speed * (ty - y) / r);
	Matter.Body.setVelocity(e.body, vel);
	if (!g.objects[itarget].data.hp)
		return;
	if(Matter.Collision.collides(e.body, g.objects[itarget].data.body) != null)
		g.objects[itarget].data.hp -= e.damage * dt;
}

function enemy_draw(g, e, ctx) {
	if (g.draw_invisible)
		drawMatterBody(ctx, e.body, 'green')
	if (!g.objects[itarget] || !g.objects[itarget].data.hp)
		return;
	ctx.drawImage(g.images.enemy, e.body.position.x - e.w / 2, e.body.position.y - e.h / 2, e.w, e.h);
	ctx.fillStyle = 'red';
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - e.h / 1.5, e.w, 0.05);
	ctx.fillStyle = 'lime';
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - e.h / 1.5, e.w * (e.hp / e.max_hp), 0.05);
}

function enemy_destroy(g, e) {
	Matter.Composite.remove(g.engine.world, e.body);
	delete e.body;
	e.destroy = true;
	return 0;
}

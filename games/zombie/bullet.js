
function bullet_create(g, x, y, dx, dy, speed_, damage_) {
	let r = Math.sqrt(dx * dx + dy * dy)
	let b = {
		destroy: false,
		speed: speed_,
		damage: damage_,
		lifetime: 1000,
		//body: Matter.Bodies.rectangle(x + 2.5 * dx / r, y + 2.5 * dy / r, 0.35, 0.35)
		body: Matter.Bodies.rectangle(x, y, 0.15, 0.15)
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
	return 0;
}

function bullet_update(g, b, dt) {
	hittable_objects = g.objects.filter(function(x) {
		if (x.data.can_be_hit && !x.data.destroy)
			return x;
	});
	for(let i = 0; i < hittable_objects.length; i++)
		if(Matter.Collision.collides(b.body, hittable_objects[i].data.body) != null)
			hittable_objects[i].data.hp -= b.damage * dt;
	b.lifetime -= dt;
	if (b.lifetime < 0)
		return bullet_destroy(g, b);
}

function bullet_draw(g, b, ctx) {
	fillMatterBody(ctx, b.body, 'orange');
	drawMatterBody(ctx, b.body, 'yellow');
}

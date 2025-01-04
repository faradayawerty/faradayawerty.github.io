
function bullet_create(g, x, y, dx, dy) {
	let width = 6, height = 6;
	let d = Math.sqrt(dx*dx + dy*dy);
	let b = {
		lifetime: 1000,
		damage: 0.5,
		speed: 20,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x + 50 * dx/d, y + 50 * dy/d, width, height)
	};
	Matter.Composite.add(g.engine.world, b.body);
	let vel = Matter.Vector.create(b.speed * dx/d, b.speed * dy/d);
	Matter.Body.setVelocity(b.body, vel);
	return game_object_create(g, "bullet", b, bullet_update, bullet_draw, bullet_destroy);
}

function bullet_destroy(bullet_object) {
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data.body);
	bullet_object.destroyed = true;
}

function bullet_update(bullet_object, dt) {
	if (bullet_object.data.lifetime < 0)
		bullet_destroy(bullet_object);
	else
		bullet_object.data.lifetime -= dt;

	for(let i = 0; i < bullet_object.game.objects.length; i++)
		if(bullet_object.game.objects[i].name == "enemy" && Matter.Collision.collides(bullet_object.data.body, bullet_object.game.objects[i].data.body) != null)
			bullet_object.game.objects[i].data.health -= bullet_object.data.damage * dt;
}

function bullet_draw(bullet_object, ctx) {
	fillMatterBody(ctx, bullet_object.data.body, 'yellow');
	drawMatterBody(ctx, bullet_object.data.body, 'orange');
}


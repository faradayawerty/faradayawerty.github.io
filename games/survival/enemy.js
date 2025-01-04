
function enemy_create(g, x, y) {
	if(!g.settings.enemies_spawn)
		return;
	let width = 30, height = 30;
	let e = {
		health: 200,
		max_health: 200,
		damage: 0.1,
		speed: 7,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x, y, width, height)
	};
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw, enemy_destroy);
}

function enemy_destroy(enemy_object) {
	let g = enemy_object.game;
	Matter.Composite.remove(g.engine.world, enemy_object.data.body);
	enemy_object.destroyed = true;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	let target_object = enemy_object.game.player_object;
	if(target_object != null) {
		let dx = target_object.data.body.position.x - e.body.position.x;
		let dy = target_object.data.body.position.y - e.body.position.y;
		let v = Math.sqrt(dx*dx + dy*dy);
		dx = e.speed * dx / v;
		dy = e.speed * dy / v;
		let vel = Matter.Vector.create(dx, dy);
		Matter.Body.setVelocity(e.body, vel);
		if(target_object.data.health && Matter.Collision.collides(e.body, target_object.data.body) != null)
			target_object.data.health -= e.damage * dt;
	}
	if(enemy_object.data.health <= 0)
		enemy_destroy(enemy_object);
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	fillMatterBody(ctx, e.body, 'green');
	drawMatterBody(ctx, e.body, 'white');
	ctx.fillStyle = "red";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.75 * e.h, e.w, 2);
	ctx.fillStyle = "lime";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.75 * e.h, e.w * e.health / e.max_health, 2);
}


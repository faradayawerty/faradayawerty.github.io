
function enemy_create(g, x, y) {
	let enemies = g.objects.filter((obj) => obj.name == "enemy");
	if(enemies.length > 100)
		for(let i = 0; i < 20 * Math.random() + 1; i++)
			enemies[i].destroy(enemies[i]);
	if(!g.settings.enemies_spawn)
		return;
	let width = 30, height = 30;
	let e = {
		health: 200,
		max_health: 200,
		hunger: 300,
		max_hunger: 300,
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
	if(e.hunger > 0)
		e.hunger = Math.max(0, e.hunger - 0.001 * dt)
	if(e.hunger <= 0)
		e.health -= 0.05 * dt;
	let target_object = game_object_find_closest(enemy_object.game, e.body.position.x,e.body.position.y, "player", 1000);
	if(target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body.position.x, e.body.position.y, "car", 1000);
	if(target_object != null) {
		if(target_object.data.car_object)
			target_object = target_object.data.car_object;
		let dx = target_object.data.body.position.x - e.body.position.x;
		let dy = target_object.data.body.position.y - e.body.position.y;
		let v = Math.sqrt(dx*dx + dy*dy);
		dx = e.speed * dx / v;
		dy = e.speed * dy / v;
		let vel = Matter.Vector.create(dx, dy);
		Matter.Body.setVelocity(e.body, vel);
		if(target_object.data.health && Matter.Collision.collides(e.body, target_object.data.body) != null) {
			target_object.data.health -= e.damage * dt;
			if(target_object.name == "car"
				&& Matter.Vector.magnitude(Matter.Body.getVelocity(target_object.data.body)) > 0.9 * target_object.data.max_speed) {
				enemy_object.data.health -= 10 * e.damage * dt;
			} else
				e.hunger = Math.min(e.max_hunger, e.hunger + 0.05 * dt)
		}
	}
	if(enemy_object.data.health <= 0)
		enemy_destroy(enemy_object);
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	fillMatterBody(ctx, e.body, 'green');
	drawMatterBody(ctx, e.body, 'white');
	ctx.fillStyle = "red";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w, 2);
	ctx.fillStyle = "orange";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w * e.hunger / e.max_hunger, 2);
	ctx.fillStyle = "red";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w, 2);
	ctx.fillStyle = "lime";
	ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w * e.health / e.max_health, 2);
}


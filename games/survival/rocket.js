function rocket_create(g, x, y, dx, dy, w, target_object, damage, health, enemy = true, speed = 10, lifetime = 4800) {
	let rockets = g.objects.filter((obj) => obj.name == "rocket");
	// TODO fix limit
	//if(rockets.length > 100)
	//	for(let i = 0; i < rockets.length - 200; i++)
	//		rockets[i].destroy(rockets[i]);
	let r = {
		lifetime: lifetime,
		health: health,
		max_health: health,
		w: w,
		speed: speed,
		damage: damage,
		target_object: target_object,
		body: Matter.Bodies.rectangle(x, y, 20, 20),
		enemy: enemy
	};
	let d = Math.sqrt(dx * dx + dy * dy);
	let vel = Matter.Vector.create(r.speed * dx / d, r.speed * dy / d);
	Matter.Composite.add(g.engine.world, r.body);
	Matter.Body.setVelocity(r.body, vel);
	if (r.enemy)
		r.body.collisionFilter.category = 4;
	else
		r.body.collisionFilter.mask = -5;
	return game_object_create(g, "rocket", r, rocket_update, rocket_draw, rocket_destroy);
}

function rocket_destroy(rocket_object) {
	if (rocket_object.destroyed)
		return;
	rocket_object.data.target_object = null;
	rocket_object.destroyed = true;
	Matter.Composite.remove(rocket_object.game.engine.world, rocket_object.data.body);
	rocket_object.data.body = null;
}

function rocket_update(rocket_object, dt) {
	if (rocket_object.destroyed)
		return;
	let r = rocket_object.data;
	if (rocket_object.data.lifetime < 0) {
		r.health = -1;
	} else {
		rocket_object.data.lifetime -= dt;
	}

	if (r.health < 0) {
		rocket_destroy(rocket_object);
		return;
	}

	if (!r.enemy) {
		r.target_object = game_object_find_closest(rocket_object.game, r.body.position.x, r.body.position.y, "enemy", 300);
		if (!r.target_object)
			r.target_object = game_object_find_closest(rocket_object.game, r.body.position.x, r.body.position.y, "car", 200);
		if (!r.target_object)
			r.target_object = game_object_find_closest(rocket_object.game, r.body.position.x, r.body.position.y, "animal", 200);
		if (!r.target_object) {
			rocket_object.name = "ROCKET";
			r.target_object = game_object_find_closest(rocket_object.game, r.body.position.x, r.body.position.y, "rocket", 25);
			rocket_object.name = "rocket";
		}
	}

	if (r.target_object) {
		if (r.target_object.destroyed ||
			r.target_object.name != "animal" && r.target_object.name != "player" && r.target_object.name != "enemy" && r.target_object.name != "car" && r.target_object.name != "rocket" ||
			r.target_object.name == "car" && r.target_object.data.is_tank) {
			r.target_object = null;
		} else {
			//rocket_object.game.debug_console.unshift("rocket object found " + r.target_object.name);
			if (r.target_object.name == "player" && r.target_object.data.car_object) {
				r.target_object = r.target_object.data.car_object;
			}
			let dx = r.target_object.data.body.position.x - r.body.position.x;
			let dy = r.target_object.data.body.position.y - r.body.position.y;
			let d = Math.sqrt(dx * dx + dy * dy);
			let vel = Matter.Vector.create(r.speed * dx / d, r.speed * dy / d);
			Matter.Body.setVelocity(r.body, vel);
			if (r.target_object && Matter.Collision.collides(rocket_object.data.body, r.target_object.data.body) != null) {
				rocket_object.game.debug_console.unshift("rocket object collides with " + r.target_object.name);
				let alpha = 25;
				if (r.target_object.name == "player") {
					if (r.target_object.data.shield_blue_health > 0) {
						r.target_object.data.shield_blue_health -= 0.95 * alpha * rocket_object.data.damage * dt;
					} else if (r.target_object.data.shield_green_health > 0) {
						r.target_object.data.shield_green_health -= 0.75 * alpha * rocket_object.data.damage * dt;
					} else if (r.target_object.data.shield_rainbow_health > 0) {
						r.target_object.data.shield_rainbow_health -= 0.55 * alpha * rocket_object.data.damage * dt;
					} else if (r.target_object.data.immunity <= 0) {
						let k = 1.0;
						if (r.target_object.data.sword_visible)
							k = 0.25;
						r.target_object.data.health -= alpha * k * rocket_object.data.damage * dt;
					}
				} else {
					r.target_object.data.health -= alpha * rocket_object.data.damage * dt;
					if (r.target_object.name == "enemy")
						r.target_object.data.hit_by_player = true;
				}
				r.health -= 10 * alpha * rocket_object.data.damage * dt;
			}
		}
	} else {
		if (!r.body)
			return;
		rocket_object.name = "ROCKET";
		r.target_object = game_object_find_closest(rocket_object.game, r.body.position.x, r.body.position.y, "rocket", 50);
		rocket_object.name = "rocket";
		if (r.target_object && !r.target_object.data.enemy)
			r.target_object = null;
	}
	let dx = Matter.Body.getVelocity(r.body).x;
	let dy = Matter.Body.getVelocity(r.body).y;
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d < 8.5)
		r.health = -1;
}

function rocket_draw(rocket_object, ctx) {
	let r = rocket_object.data;
	if (r.target_object && r.target_object.data.body) {
		let rx = r.body.position.x;
		let ry = r.body.position.y;
		let dx = r.target_object.data.body.position.x - r.body.position.x;
		let dy = r.target_object.data.body.position.y - r.body.position.y;
		let d = Math.sqrt(dx * dx + dy * dy);
		dx = 2.5 * r.w * dx / d;
		dy = 2.5 * r.w * dy / d;
		drawLine(ctx, rx + 0.3 * dy - dx, ry - 0.3 * dx - dy, rx - 0.3 * dy - dx, ry + 0.3 * dx - dy, "red", r.w);
		drawLine(ctx, rx - 0.25 * dx - dx, ry - 0.25 * dy - dy, rx + dx - dx, ry + dy - dy, "gray", r.w);
		drawLine(ctx, rx - dx, ry - dy, rx + 1.125 * dx - dx, ry + 1.125 * dy - dy, "gray", 0.75 * r.w);
	}
	if (!r.target_object) {
		let rx = r.body.position.x;
		let ry = r.body.position.y;
		let dx = Matter.Body.getVelocity(r.body).x;
		let dy = Matter.Body.getVelocity(r.body).y;
		let d = Math.sqrt(dx * dx + dy * dy);
		dx = 2.5 * r.w * dx / d;
		dy = 2.5 * r.w * dy / d;
		drawLine(ctx, rx + 0.3 * dy - dx, ry - 0.3 * dx - dy, rx - 0.3 * dy - dx, ry + 0.3 * dx - dy, "red", r.w);
		drawLine(ctx, rx - 0.25 * dx - dx, ry - 0.25 * dy - dy, rx + dx - dx, ry + dy - dy, "gray", r.w);
		drawLine(ctx, rx - dx, ry - dy, rx + 1.125 * dx - dx, ry + 1.125 * dy - dy, "gray", 0.75 * r.w);
	}
	if (rocket_object.game.settings.indicators["show rocket health"] && r.health > 0) {
		let e = rocket_object.data;
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - 7 * e.w / 2, e.body.position.y - 3 * e.w, 7 * e.w, Math.min(4, e.w * 0.5));
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - 7 * e.w / 2, e.body.position.y - 3 * e.w, 7 * e.w * e.health / e.max_health, Math.min(4, e.w * 0.5));
	}
}
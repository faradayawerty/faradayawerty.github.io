function rocket_create(g, x, y, dx, dy, w, target_object, damage, health,
	enemy = true, speed = 10, lifetime = 4800) {
	let r = {
		lifetime: lifetime,
		health: health,
		max_health: health,
		w: w,
		speed: speed,
		damage: damage,
		target_object: target_object,
		bounce_ticks: 0,
		body: Matter.Bodies.rectangle(x, y, 20, 20, {
			restitution: 0.4,
			friction: 0.1,
			frictionAir: 0.01
		}),
		enemy: enemy
	};
	let d = Math.sqrt(dx * dx + dy * dy);
	let vel = Matter.Vector.create(r.speed * dx / d, r.speed * dy / d);
	Matter.Composite.add(g.engine.world, r.body);
	Matter.Body.setVelocity(r.body, vel);
	if (r.enemy)
		r.body.collisionFilter.category = 4;
	else
		r.body.collisionFilter.mask = 0xFFFFFFFF;
	return game_object_create(g, "rocket", r, rocket_update, rocket_draw,
		rocket_destroy);
}

function rocket_destroy(rocket_object) {
	if (rocket_object.destroyed)
		return;
	rocket_object.data.target_object = null;
	rocket_object.destroyed = true;
	Matter.Composite.remove(rocket_object.game.engine.world, rocket_object.data
		.body);
	rocket_object.data.body = null;
}

function rocket_update(rocket_object, dt) {
	if (rocket_object.destroyed)
		return;
	let r = rocket_object.data;
	if (r.lifetime < 0) {
		r.health = -1;
	}
	else {
		r.lifetime -= dt;
	}
	if (r.health < 0) {
		rocket_destroy(rocket_object);
		return;
	}
	if (r.bounce_ticks > 0) r.bounce_ticks--;
	if (r.bounce_ticks <= 0) {
		if (!r.target_object) {
			if (r.enemy) {
				r.target_object = game_object_find_closest(rocket_object.game, r
					.body.position.x, r.body.position.y, "player", 1500);
			}
			else {
				r.target_object = game_object_find_closest(rocket_object.game, r
					.body.position.x, r.body.position.y, "enemy", 500);
				if (!r.target_object) r.target_object =
					game_object_find_closest(rocket_object.game, r.body.position
						.x, r.body.position.y, "car", 400);
				if (!r.target_object) r.target_object =
					game_object_find_closest(rocket_object.game, r.body.position
						.x, r.body.position.y, "trashcan", 200);
				if (!r.target_object) {
					rocket_object.name = "ROCKET_SEARCH";
					let target_rocket = game_object_find_closest(rocket_object
						.game, r.body.position.x, r.body.position.y,
						"rocket", 150);
					rocket_object.name = "rocket";
					if (target_rocket && target_rocket.data.enemy) r
						.target_object = target_rocket;
				}
			}
		}
		if (r.target_object) {
			if (r.target_object.destroyed || (r.target_object.name == "car" && r
					.target_object.data.is_tank && !r.enemy)) {
				r.target_object = null;
			}
			else {
				let target_body = r.target_object.data.body;
				if (r.target_object.name == "player" && r.target_object.data
					.car_object) {
					target_body = r.target_object.data.car_object.data.body;
				}
				let dx = target_body.position.x - r.body.position.x;
				let dy = target_body.position.y - r.body.position.y;
				let d = Math.sqrt(dx * dx + dy * dy);
				if (d > 0.1) {
					let vel = Matter.Vector.create(r.speed * dx / d, r.speed *
						dy / d);
					Matter.Body.setVelocity(r.body, vel);
				}
			}
		}
	}
	let current_vel = Matter.Body.getVelocity(r.body);
	let current_d = Math.sqrt(current_vel.x * current_vel.x + current_vel.y *
		current_vel.y);
	if (current_d < 1.0 && r.bounce_ticks <= 0)
		r.health = -1;
}

function rocket_draw(rocket_object, ctx) {
	let r = rocket_object.data;
	let rx = r.body.position.x;
	let ry = r.body.position.y;
	let vel = Matter.Body.getVelocity(r.body);
	let dx, dy;
	if (r.target_object && r.target_object.data && r.target_object.data.body &&
		r.bounce_ticks <= 0) {
		dx = r.target_object.data.body.position.x - rx;
		dy = r.target_object.data.body.position.y - ry;
	}
	else {
		dx = vel.x;
		dy = vel.y;
	}
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d > 0.1) {
		let sdx = 2.5 * r.w * dx / d;
		let sdy = 2.5 * r.w * dy / d;
		drawLine(ctx, rx + 0.3 * sdy - sdx, ry - 0.3 * sdx - sdy, rx - 0.3 *
			sdy - sdx, ry + 0.3 * sdx - sdy, "red", r.w);
		drawLine(ctx, rx - 0.25 * sdx - sdx, ry - 0.25 * sdy - sdy, rx + sdx -
			sdx, ry + sdy - sdy, "gray", r.w);
		drawLine(ctx, rx - sdx, ry - sdy, rx + 1.125 * sdx - sdx, ry + 1.125 *
			sdy - sdy, "gray", 0.75 * r.w);
	}
	if (rocket_object.game.settings.indicators["show rocket health"] && r
		.health > 0) {
		ctx.fillStyle = "red";
		ctx.fillRect(rx - 7 * r.w / 2, ry - 3 * r.w, 7 * r.w, Math.min(4, r.w *
			0.5));
		ctx.fillStyle = "lime";
		ctx.fillRect(rx - 7 * r.w / 2, ry - 3 * r.w, 7 * r.w * r.health / r
			.max_health, Math.min(4, r.w * 0.5));
	}
}
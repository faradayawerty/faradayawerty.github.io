const ROCKET_POOL = [];

function rocket_create(g, x, y, dx, dy, w, target_object, damage, health,
	enemy = true, speed = 10, lifetime = 4800, theme = "rocket") {
	let rocket_object;
	let r;
	if (ROCKET_POOL.length > 0) {
		rocket_object = ROCKET_POOL.pop();
		r = rocket_object.data;
		r.lifetime = lifetime;
		r.health = health;
		r.max_health = health;
		r.w = w;
		r.speed = speed;
		r.damage = damage;
		r.target_object = target_object;
		r.bounce_ticks = 0;
		r.enemy = enemy;
		r.damaged = false;
		r.theme = theme;
		Matter.Body.setPosition(r.body, {
			x: x,
			y: y
		});
		Matter.Body.setVelocity(r.body, {
			x: 0,
			y: 0
		});
		Matter.Body.setAngle(r.body, 0);
		Matter.Body.setAngularVelocity(r.body, 0);
		rocket_object.prevX = x;
		rocket_object.prevY = y;
		rocket_object.destroyed = false;
	}
	else {
		r = {
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
			enemy: enemy,
			damaged: false,
			theme: theme
		};
		rocket_object = null;
	}
	let d = Math.sqrt(dx * dx + dy * dy) || 1;
	let vel = {
		x: r.speed * dx / d,
		y: r.speed * dy / d
	};
	r.body.collisionFilter.group = 0;
	r.body.collisionFilter.category = 1;
	r.body.collisionFilter.mask = 0xFFFFFFFF;
	if (r.enemy) {
		r.body.collisionFilter.category = 4;
	}
	Matter.Composite.add(g.engine.world, r.body);
	Matter.Body.setVelocity(r.body, vel);
	if (rocket_object) {
		rocket_object.game = g;
		if (!g.collections["rocket"]) g.collections["rocket"] = [];
		g.collections["rocket"].push(rocket_object);
		const newWeight = GAME_OBJECT_WEIGHTS["rocket"] || 0;
		let insertIndex = g.objects.length;
		for (let i = 0; i < g.objects.length; i++) {
			let currentWeight = GAME_OBJECT_WEIGHTS[g.objects[i].name] || 0;
			if (newWeight > currentWeight) {
				insertIndex = i;
				break;
			}
		}
		g.objects.splice(insertIndex, 0, rocket_object);
		return insertIndex;
	}
	else {
		let idx = game_object_create(g, "rocket", r, rocket_update, rocket_draw,
			rocket_destroy);
		let createdObj = g.objects[idx];
		r.body.gameObject = createdObj;
		createdObj.prevX = x;
		createdObj.prevY = y;
		return idx;
	}
}

function rocket_destroy(rocket_object) {
	if (rocket_object.destroyed)
		return;
	rocket_object.data.target_object = null;
	rocket_object.destroyed = true;
	Matter.Composite.remove(rocket_object.game.engine.world, rocket_object.data
		.body);
	ROCKET_POOL.push(rocket_object);
}

function rocket_update(rocket_object, dt) {
	if (rocket_object.destroyed)
		return;
	let r = rocket_object.data;
	if (r.damaged) {
		rocket_destroy(rocket_object);
		return;
	}
	if (r.lifetime < 0) {
		r.health = 0;
	}
	else {
		r.lifetime -= dt;
	}
	if (r.health <= 0) {
		rocket_destroy(rocket_object);
		return;
	}
	if (r.bounce_ticks > 0) r.bounce_ticks--;
	if (r.bounce_ticks <= 0 && !r.damaged) {
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
					Matter.Body.setVelocity(r.body, {
						x: r.speed * dx / d,
						y: r.speed * dy / d
					});
				}
			}
		}
	}
	if (r.damaged) {
		r.target_object = null;
	}
	let current_vel = Matter.Body.getVelocity(r.body);
	let current_d = Math.sqrt(current_vel.x * current_vel.x + current_vel.y *
		current_vel.y);
	if (current_d < 1.0 && r.bounce_ticks <= 0)
		r.health = 0;
}

function rocket_draw(rocket_object, ctx) {
	let r = rocket_object.data;
	let rx = r.body.position.x;
	let ry = r.body.position.y;
	let vel = Matter.Body.getVelocity(r.body);
	let dx, dy;
	if (r.target_object && r.target_object.data && r.target_object.data.body &&
		r.bounce_ticks <= 0 && !r.damaged) {
		dx = r.target_object.data.body.position.x - rx;
		dy = r.target_object.data.body.position.y - ry;
	}
	else {
		dx = vel.x;
		dy = vel.y;
	}
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d > 0.1) {
		if (r.theme === "bat") {
			ctx.save();
			ctx.translate(rx, ry);
			ctx.rotate(Math.atan2(dy, dx));
			const wingAnim = Math.sin(Date.now() * 0.01) * 0.8;
			const size = r.w * 2.2;
			ctx.fillStyle = "#000000";
			[-1, 1].forEach(side => {
				ctx.save();
				ctx.scale(1, side);
				ctx.rotate(wingAnim);
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(-size * 1.5, -size * 2.5);
				ctx.lineTo(-size * 0.8, -size * 1.8);
				ctx.lineTo(-size * 0.4, -size * 2.2);
				ctx.lineTo(0, -size * 1.5);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			});
			ctx.fillStyle = "#151515";
			ctx.beginPath();
			ctx.moveTo(-size, 0);
			ctx.quadraticCurveTo(0, -size * 0.4, size * 0.8, 0);
			ctx.quadraticCurveTo(0, size * 0.4, -size, 0);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(size * 0.7, 0, size * 0.35, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(size * 0.5, -size * 0.2);
			ctx.lineTo(size * 0.9, -size * 0.6);
			ctx.lineTo(size * 0.8, -size * 0.1);
			ctx.moveTo(size * 0.5, size * 0.2);
			ctx.lineTo(size * 0.9, size * 0.6);
			ctx.lineTo(size * 0.8, size * 0.1);
			ctx.fill();
			ctx.fillStyle = "#ff2200";
			ctx.beginPath();
			ctx.arc(size * 0.85, -size * 0.12, 1.2, 0, Math.PI * 2);
			ctx.arc(size * 0.85, size * 0.12, 1.2, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
		else {
			let sdx = 2.5 * r.w * dx / d;
			let sdy = 2.5 * r.w * dy / d;
			drawLine(ctx, rx + 0.3 * sdy - sdx, ry - 0.3 * sdx - sdy, rx - 0.3 *
				sdy - sdx, ry + 0.3 * sdx - sdy, COLORS_DEFAULT.rocket
				.wings, r
				.w);
			drawLine(ctx, rx - 0.25 * sdx - sdx, ry - 0.25 * sdy - sdy, rx +
				sdx -
				sdx, ry + sdy - sdy, COLORS_DEFAULT.rocket.color, r.w);
			drawLine(ctx, rx - sdx, ry - sdy, rx + 1.125 * sdx - sdx, ry +
				1.125 *
				sdy - sdy, COLORS_DEFAULT.rocket.color, 0.75 * r.w);
		}
	}
	if (rocket_object.game.settings.indicators["show rocket health"] && r
		.health > 0) {
		const hPerc = Math.max(0, r.health / r.max_health);
		const fontSize = r.w * 1.6;
		const yPos = ry - 3.5 * r.w;
		const red = Math.floor(255 * (1 - hPerc));
		const green = Math.floor(255 * hPerc);
		const color = `rgb(${red}, ${green}, 0)`;
		const text = `${Math.ceil(r.health)}/${Math.ceil(r.max_health)}`;
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = `bold ${fontSize}px Arial`;
		ctx.strokeStyle = "black";
		ctx.lineWidth = fontSize * 0.15;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.strokeText(text, rx, yPos);
		ctx.fillStyle = color;
		ctx.fillText(text, rx, yPos);
		ctx.restore();
	}
}
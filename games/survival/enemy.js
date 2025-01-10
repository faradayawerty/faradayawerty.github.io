
function enemy_create(g, x, y, make_boss=false, make_minion=false, type="random") {
	if(!g.settings.enemies_spawn)
		return;
	let enemies = g.objects.filter((obj) => obj.name == "enemy");
	if(enemies.length > 100)
		for(let i = 0; i < 20 * Math.random() + 1; i++) {
			if(!enemies[i].data.boss)
				enemies[i].destroy(enemies[i]);
		}
	let width = 30, height = 30;
	let boss = make_boss;
	if(g.player_object) {
		let m = 0.33 * (
			g.player_object.data.health / g.player_object.data.max_health
			+ g.player_object.data.thirst / g.player_object.data.max_thirst
			+ g.player_object.data.hunger / g.player_object.data.max_hunger
		);
		if(g.kills < 3)
			m *= 0;
		let bd = enemy_boss_distance_to_player(g);
		if(-1 < bd && bd < 15000)
			m *= 0.01;
		if(g.boss_kills > 0) {
			if(type == "random" && Math.random() < 0.5)
				type = "shooting";
			m *= 0.5;
		}
		if(Math.random() > 1 - 0.25 * m)
			boss = true;
	}
	if(make_minion)
		boss = false;
	if(boss) {
		width = 80;
		height = 80;
	}
	if(make_minion) {
		width = 20;
		height = 20;
	}
	let e = {
		health: 200,
		max_health: 200,
		hunger: 300,
		max_hunger: 300,
		damage: 0.1,
		speed: 7,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x, y, width, height),
		hit_by_player: false,
		boss: false,
		follow_range: 1000,
		spawn_minion_delay: 4000,
		color: "green",
		type: "regular",
		shooting_delay: 1000,
		shooting_range: 400
	};
	if(type == "shooting") {
		e.type = "shooting";
		e.health = 1000;
		e.max_health = 1000;
		e.speed = 5;
		e.color = "#335544";
		e.damage = 5 * e.damage;
		e.body.collisionFilter.mask = -5;
	}
	if(boss) {
		e.damage = 5 * e.damage;
		e.health = 25 * e.max_health;
		e.max_health = 25 * e.max_health;
		e.hunger = 2 * e.max_hunger;
		e.max_hunger = 2 * e.max_hunger;
		e.speed = 0.5 * e.speed;
		e.boss = true;
		e.follow_range = 10 * e.follow_range;
		e.shooting_range = 1.25 * e.shooting_range;
	}
	if(make_minion) {
		e.damage = 0.5 * e.damage;
		e.health = 0.25 * e.max_health;
		e.max_health = 0.25 * e.max_health;
		e.hunger = 0.25 * e.max_hunger;
		e.max_hunger = 0.25 * e.max_hunger;
		e.speed = 1.15 * e.speed;
		e.boss = false;
		e.follow_range = 1.25 * e.follow_range;
		e.shooting_range = 0.75 * e.shooting_range;
	}
	
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw, enemy_destroy);
}

function enemy_destroy(enemy_object) {
	let g = enemy_object.game;
	if(enemy_object.data.hit_by_player)
		if(enemy_object.data.boss) {
			g.boss_kills += 1;
			if(enemy_object.game.player_object)
				enemy_object.game.player_object.data.defeated_boss = true;
		} else
			g.kills += 1;
	Matter.Composite.remove(g.engine.world, enemy_object.data.body);
	enemy_object.destroyed = true;
}

function enemy_get_target_object(enemy_object) {
	let e = enemy_object.data;
	let target_object = game_object_find_closest(enemy_object.game, e.body.position.x,e.body.position.y, "player", e.follow_range);
	if(target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body.position.x, e.body.position.y, "car", e.follow_range);
	if(target_object != null)
		if(target_object.data.car_object)
			target_object = target_object.data.car_object;
	return target_object;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	if(e.hunger > 0)
		e.hunger = Math.max(0, e.hunger - 0.001 * dt)
	if(e.hunger <= 0)
		e.health -= 0.05 * dt;
	if(e.shooting_delay < 1000)
		e.shooting_delay += dt;
	let target_object = enemy_get_target_object(enemy_object);
	if(target_object != null) {
		let dx = target_object.data.body.position.x - e.body.position.x;
		let dy = target_object.data.body.position.y - e.body.position.y;
		let v = Math.sqrt(dx*dx + dy*dy);
		dx = e.speed * dx / v;
		dy = e.speed * dy / v;
		if(e.type == "shooting" && v < e.shooting_range) {
			if(e.shooting_delay >= 1000) {
				bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, dx, dy, 10, e.damage, true, e.w * 0.2, 3000, "blue", "white");
				e.shooting_delay = 0;
			}
			dx = 0;
			dy = 0;
		}
		let vel = Matter.Vector.create(dx, dy);
		Matter.Body.setVelocity(e.body, vel);
		if(target_object.data.health && Matter.Collision.collides(e.body, target_object.data.body) != null) {
			target_object.data.health -= e.damage * dt;
			if(target_object.name == "car"
				&& Matter.Vector.magnitude(Matter.Body.getVelocity(target_object.data.body)) > 0.9 * target_object.data.max_speed
				&& !e.boss) {
				enemy_object.data.health -= 10 * e.damage * dt;
				enemy_object.data.hit_by_player = true;
			} else
				e.hunger = Math.min(e.max_hunger, e.hunger + 0.05 * dt)
		}
		if(e.spawn_minion_delay >= 4000 && e.boss) {
			for(let i = 0; i < Math.random() * 4 + 1; i++) {
				let theta = 2 * Math.PI * Math.random();
				let x = e.body.position.x + 300 * Math.cos(theta);
				let y = e.body.position.y + 300 * Math.sin(theta);
				enemy_create(enemy_object.game, x, y, false, true, e.type);
			}
			e.spawn_minion_delay = 0;
		}
		if(e.spawn_minion_delay < 4000)
			e.spawn_minion_delay += Math.random() * dt;
	}
	if(enemy_object.data.health <= 0) {
		if(enemy_object.data.hit_by_player) {
			let N = 1;
			if(enemy_object.data.boss) {
				if(enemy_object.data.hunger > 0) {
					N = 20 * Math.random() + 10;
					if(e.type == "shooting")
						item_create(enemy_object.game, ITEM_PLASMA_LAUNCHER, e.body.position.x, e.body.position.y);
					else if(Math.random() > 0.33)
						item_create(enemy_object.game, ITEM_SHOTGUN, e.body.position.x, e.body.position.y);
					else
						item_create(enemy_object.game, ITEM_MINIGUN, e.body.position.x, e.body.position.y);
				} else
					N = 10 * Math.random() + 5;
			}
			for(let i = 0; i < N; i++) {
				let theta = 2 * Math.PI * Math.random();
				let x = e.body.position.x + 50 * Math.cos(theta);
				let y = e.body.position.y + 50 * Math.sin(theta);
				if(Math.random() > 0.85)
					item_create_from_list(enemy_object.game, ITEMS_FOODS.concat(ITEMS_DRINKS), x, y);
				else if(Math.random() > 0.85)
					item_create(enemy_object.game, ITEM_AMMO, x, y);
				else if(Math.random() > 0.85)
					item_create(enemy_object.game, ITEM_HEALTH, x, y);
				else if(Math.random() > 0.95)
					item_create(enemy_object.game, ITEM_FUEL, x, y);
				else if(e.type == "shooting" && Math.random() > 0.5)
					item_create(enemy_object.game, ITEM_PLASMA, x, y);
			}
		}
		enemy_destroy(enemy_object);
	}
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	fillMatterBody(ctx, e.body, e.color);
	drawMatterBody(ctx, e.body, 'white');
	if(enemy_object.game.settings.indicators["show enemy hunger"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w, e.h * 0.05);
		ctx.fillStyle = "orange";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w * e.hunger / e.max_hunger, e.h * 0.05);
	}
	if(enemy_object.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w, e.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w * e.health / e.max_health, e.h * 0.05);
	}
	let target_object = enemy_get_target_object(enemy_object);
	if(target_object != null) {
		let px = e.body.position.x - 0.45 * e.w;
		let py = e.body.position.y - 0.45 * e.h;
		let gx = target_object.data.body.position.x - e.body.position.x;
		let gy = target_object.data.body.position.y - e.body.position.y;
		let g = Math.sqrt(gx*gx + gy*gy);
		if(e.type == "shooting" && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + e.w * gx / g, py + e.h * gy / g);
			ctx.lineWidth = 0.25 * e.w;
			ctx.stroke();
		}
	}
}

function enemy_boss_exists(g) {
	if(!g.objects.find((obj) => obj.name == "enemy" && obj.data.boss))
		return false;
	return true;
}

function enemy_boss_distance_to_player(g) {
	let boss_objects = g.objects.filter((obj) => obj.name == "enemy" && obj.data.boss);
	if(boss_objects.length < 1 || !g.player_object)
		return -1;
	let boss_closest = boss_objects[0];
	for(let i = 1; i < boss_objects.length; i++)
		if(dist(boss_closest.data.body.position, g.player_object.data.body.position) > dist(boss_objects[i].data.body.position, g.player_object.data.body.position))
			boss_closest = boss_objects[i];
	return dist(boss_closest.data.body.position, g.player_object.data.body.position);
}


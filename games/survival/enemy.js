
function enemy_create(g, x, y, make_boss=false, make_minion=false) {
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
	if(Math.random() > 0.99)
		boss = true;
	if(make_minion)
		boss = false;
	if(boss) {
		width = 100;
		height = 100;
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
		spawn_minion_delay: 4000
	};
	if(boss) {
		e.damage = 0.5;
		e.health = 10000;
		e.max_health = 10000;
		e.hunger = 600;
		e.max_hunger = 600;
		e.speed = 4.5;
		e.boss = true;
		e.follow_range = 10000;
	}
	if(make_minion) {
		e.damage = 0.05;
		e.health = 50;
		e.max_health = 50;
		e.hunger = 25;
		e.max_hunger = 25;
		e.speed = 9;
		e.boss = false;
		e.follow_range = 1000;
	}
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw, enemy_destroy);
}

function enemy_destroy(enemy_object) {
	let g = enemy_object.game;
	if(enemy_object.data.hit_by_player)
		if(enemy_object.data.boss)
			g.boss_kills += 1;
		else
			g.kills += 1;
	Matter.Composite.remove(g.engine.world, enemy_object.data.body);
	enemy_object.destroyed = true;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	if(e.hunger > 0)
		e.hunger = Math.max(0, e.hunger - 0.001 * dt)
	if(e.hunger <= 0)
		e.health -= 0.05 * dt;
	let target_object = game_object_find_closest(enemy_object.game, e.body.position.x,e.body.position.y, "player", e.follow_range);
	if(target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body.position.x, e.body.position.y, "car", e.follow_range);
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
				enemy_create(enemy_object.game, x, y, false, true);
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
				if(enemy_object.data.hunger > 0)
					N = 20 * Math.random() + 10;
				else
					N = 5 * Math.random() + 5;
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
				else if(Math.random() > 0.85)
					item_create(enemy_object.game, ITEM_FUEL, x, y);
			}
		}
		enemy_destroy(enemy_object);
	}
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	fillMatterBody(ctx, e.body, 'green');
	drawMatterBody(ctx, e.body, 'white');
	if(enemy_object.game.settings.indicators["show enemy hunger"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w, 2);
		ctx.fillStyle = "orange";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w * e.hunger / e.max_hunger, 2);
	}
	if(enemy_object.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w, 2);
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w * e.health / e.max_health, 2);
	}
}


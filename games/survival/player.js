
function player_create(g, x, y, respawn=false, ai_controlled=false) {
	let width = 40, height = 40;
	let p = {
		old_health: 100,
		health: 100,
		max_health: 100,
		thirst: 210,
		max_thirst: 210,
		hunger: 210,
		max_hunger: 210,
		saved_health: 100,
		saved_thirst: 210,
		saved_hunger: 210,
		speed: 10,
		max_speed: 10,
		shot_cooldown: 0,
		shotgun_cooldown: 0,
		minigun_cooldown: 0,
		want_level: "0x0",
		w: width,
		h: height,
		inventory_element: null,
		hotbar_element: null,
		car_object: null,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			inertia: Infinity
		}),
		immunity: 6000,
		shield_blue_health: 0,
		shield_blue_health_max: 9000,
		shield_green_health: 0,
		shield_green_health_max: 18000,
		shield_rainbow_health: 0,
		shield_rainbow_health_max: 36000,
		sword_direction: 0,
		sword_visible: false,
		ai_controlled: ai_controlled,
		ai_random_dir: 0,
		gradient: 0,
		item_animstate: 0,
		laser_direction: 0,
		shooting_laser: false
	};
	p.inventory_element = g.gui_elements[inventory_create(g)];
	for(let i = 0; i < g.saved_items.length; i++)
		for(let j = 0; j < g.saved_items[i].length; j++) {
			p.inventory_element.data.items[i][j] = g.saved_items[i][j];
			g.saved_items[i][j] = 0;
		}
	p.hotbar_element = g.gui_elements[hotbar_create(g, p.inventory_element.data)];
	Matter.Composite.add(g.engine.world, p.body);
	let iplayer = game_object_create(g, "player", p, player_update, player_draw, player_destroy);
	g.player_object = null;
	if(respawn) {
		p.health = 0.15 * p.max_health;
		p.hunger = 0.35 * p.max_hunger;
		p.thirst = 0.55 * p.max_thirst;
	}
	p.inventory_element.data.attached_to_object = g.objects[iplayer];
	p.hotbar_element.data.attached_to_object = g.objects[iplayer];
	if(ai_controlled) {
		p.inventory_element.data.items[0][0] = ITEM_GUN;
		p.inventory_element.data.items[0][1] = ITEM_AMMO;
		p.inventory_element.data.items[0][2] = Math.round(Math.random()) * ITEM_WATER;
		p.inventory_element.data.items[0][3] = Math.round(Math.random()) * ITEM_CANNED_MEAT;
	}
	if(level_visible(g, p.want_level))
		levels_set(g, p.want_level);
	return iplayer;
}

function player_destroy(player_object) {
	if(player_object.destroyed)
		return;
	let p = player_object.data;
	let g = player_object.game;
	g.debug_console.unshift("destroying player");
	if(!level_visible(g, p.want_level, player_object))
		game_destroy_level(g, p.want_level);
	if(player_object.game.camera_target_body == player_object.data.body)
		player_object.game.camera_target_body = null;
	Matter.Composite.remove(player_object.game.engine.world, player_object.data.body);
	player_object.data.body = null;
	inventory_destroy(player_object.data.inventory_element);
	hotbar_destroy(player_object.data.hotbar_element);
	player_object.destroyed = true;
	player_object.game.player_object = null;
}

function player_die(player_object) {
	player_object.game.input.mouse.leftButtonPressed = false;
	player_object.game.deaths += 1;
	if(player_object.data.ai_controlled || player_object.game.settings.lose_items_on_death) {
		inventory_drop_all_items(player_object.data.inventory_element);
	} else {
		for(let i = 0; i < player_object.game.saved_items.length; i++)
			for(let j = 0; j < player_object.game.saved_items[i].length; j++)
				player_object.game.saved_items[i][j] = player_object.data.inventory_element.data.items[i][j];
	}
	if(!player_object.data.ai_controlled || player_object.game.objects.filter((obj) => obj.name == "player" && obj != player_object).length < 1)
		player_object.game.want_respawn_menu = true;
	for(let i = 0; i < player_object.game.objects.length; i++) {
		if(player_object.game.objects[i].name == "enemy" && !player_object.game.objects[i].destroyed)
			player_object.game.objects[i].data.health = Math.min(
				player_object.game.objects[i].data.max_health,
				player_object.game.objects[i].data.health * 1.5
			);
	}
	player_destroy(player_object);
}

function player_update(player_object, dt) {

	if(!player_object || player_object.destroyed || !player_object.data.body)
		return;

	let p = player_object.data;
	if(p.shot_cooldown > 0)
		p.shot_cooldown -= dt;
	if(p.shotgun_cooldown > 0)
		p.shotgun_cooldown -= dt;
	if(p.minigun_cooldown > 0)
		p.minigun_cooldown -= dt;

	p.item_animstate += 0.01 * dt;

	if(p.shield_blue_health > 0) {
		p.shield_blue_health -= 0.15 * dt;
	}

	if(p.shield_green_health > 0) {
		p.shield_green_health -= 0.15 * dt;
	}

	if(p.shield_rainbow_health > 0) {
		p.shield_rainbow_health -= 0.15 * dt;
	}

	if(p.saved_health - p.health > 1) {
		player_object.game.debug_console.unshift("player health: " + Math.round(p.health) + ", change " + Math.round(p.saved_health - p.health)
			+ ": hunger: " + Math.round(p.hunger) + ", thirst: " + Math.round(p.thirst));
	}

	p.saved_health = p.health;
	p.saved_hunger = p.hunger;
	p.saved_thirst = p.thirst;

	if(p.shield_rainbow_health < 0) {
		p.shield_rainbow_health = 0;
	}

	if(p.shield_green_health < 0) {
		p.shield_green_health = 0;
	}

	if(p.shield_blue_health < 0) {
		p.shield_blue_health = 0;
	}

	if(p.immunity > 0)
		p.immunity -= dt;

	if(player_object.data.health <= 0) {
		player_die(player_object);
		return;
	}

	if(p.thirst > 0) {
		if(p.shield_green_health > 0)
			p.thirst = Math.max(0, p.thirst - 0.0005 * dt)
		else if(p.shield_rainbow_health > 0)
			p.thirst = Math.max(0, p.thirst - 0.00000025 * dt)
		else
			p.thirst = Math.max(0, p.thirst - 0.001 * dt)
	}

	if(p.thirst <= 0)
		p.health -= 0.01 * dt;

	if(p.hunger > 0) {
		if(p.shield_green_health > 0)
			p.hunger = Math.max(0, p.hunger - 0.0005 * dt)
		else if(p.shield_rainbow_health > 0)
			p.hunger = Math.max(0, p.hunger - 0.00000025 * dt)
		else
			p.hunger = Math.max(0, p.hunger - 0.001 * dt)
	}

	if(p.hunger <= 0)
		p.health -= 0.005 * dt;

	p.speed = p.max_speed;
	if(p.thirst < 0.33 * p.max_thirst)
		p.speed = 0.875 * p.speed;
	if(p.hunger < 0.11 * p.max_hunger)
		p.speed = 0.75 * p.speed;
	if(p.hunger > 0.75 * p.max_hunger && p.thirst > 0.75 * p.max_thirst)
		p.health = Math.min(p.max_health, p.health + 0.0025 * dt);

	let old_level = p.want_level;

	// choose level based on coordinates
	let level_x = Number(p.want_level.split("x")[0]);
	let level_y = Number(p.want_level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	if(p.body.position.x < Ox)
		p.want_level = (level_x - 1) + "x" + level_y;
	else if(p.body.position.x > Ox + 2500)
		p.want_level = (level_x + 1) + "x" + level_y;
	if(p.body.position.y < Oy)
		p.want_level = level_x + "x" + (level_y - 1);
	else if(p.body.position.y > Oy + 2500)
		p.want_level = level_x + "x" + (level_y + 1);

	if(old_level != p.want_level) {
		if(!level_visible(player_object.game, old_level, player_object))
			game_destroy_level(player_object.game, old_level);
		if(!level_visible(player_object.game, p.want_level, player_object))
			levels_set(player_object.game, p.want_level, old_level);
	}

	if(p.ai_controlled) {

		if(p.hunger < 0.5 * p.max_hunger) {
			let id = inventory_has_item_from_list(player_object.data.inventory_element, ITEMS_FOODS);
			if(id > -1)
				player_item_consume(player_object, id, true);
		}

		if(p.thirst < 0.5 * p.max_thirst) {
 			let id = inventory_has_item_from_list(player_object.data.inventory_element, ITEMS_DRINKS);
			if(id > -1)
				player_item_consume(player_object, id, true);
		}

		if(p.health < 0.5 * p.max_health) {
 			let id = inventory_has_item_from_list(player_object.data.inventory_element, [ITEM_HEALTH, ITEM_HEALTH_GREEN]);
			if(id > -1)
				player_item_consume(player_object, id, true);
		}

		p.car_object = null;
		p.body.collisionFilter.mask = -1;

		let vel = Matter.Vector.create(0, 0);

		let closest_enemy = null;
		let closest_item = null;
		let closest_player = null;

		let follow_range = 10000;

 		if(inventory_has_item(player_object.data.inventory_element, 0))
			closest_item = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "item", follow_range);

		closest_enemy = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "enemy", follow_range);

		let iv = -1;
		if(closest_item) {
			let tx = closest_item.data.body.position.x - p.body.position.x;
			let ty = closest_item.data.body.position.y - p.body.position.y;
			let iv = Math.sqrt(tx*tx + ty*ty);
			let dx = p.speed * tx / iv;
			let dy = p.speed * ty / iv;
			if(iv < 1.5 * p.w) {
				if(!item_pickup(player_object.data.inventory_element, closest_item))
					item_pickup(player_object.data.inventory_element, closest_item, true);
			}
			vel = Matter.Vector.create(dx, dy);
		}

		if(closest_enemy) {
 			let id = inventory_has_item_from_list(player_object.data.inventory_element, ITEMS_GUNS);
			if(id > -1) {
				for(let i = 0; i < player_object.data.inventory_element.data.items.length; i++)
					for(let j = 0; j < player_object.data.inventory_element.data.items[i].length; j++)
						if(player_object.data.inventory_element.data.items[i][j] == id) {
							player_object.data.inventory_element.data.items[i][j]
								= player_object.data.hotbar_element.data.row[player_object.data.hotbar_element.data.iselected];
							player_object.data.hotbar_element.data.row[player_object.data.hotbar_element.data.iselected] = id;
						}
						
			}
			let tx = closest_enemy.data.body.position.x - p.body.position.x;
			let ty = closest_enemy.data.body.position.y - p.body.position.y;
			let v = Math.sqrt(tx*tx + ty*ty);
			let dx = p.speed * tx / v;
			let dy = p.speed * ty / v;
			if(p.w * 7.5 < v && v < p.w * 16.5) {
				player_shoot(player_object, dt, closest_enemy.data.body);
				dx = 0;
				dy = 0;
			}
			if(v < p.w * 7.5) {
				dx = -dx;
				dy = -dy;
				if(iv > v)
					vel = Matter.Vector.create(dx, dy);
			}
			if(iv < v && Matter.Vector.magnitude(Matter.Vector.add(Matter.Vector.create(dx, dy), vel)) > 5)
				vel = Matter.Vector.add(Matter.Vector.create(dx, dy), vel);
		}

		if(!closest_enemy && !closest_item)
			closest_player = player_object.game.objects.find((obj) => obj.name == "player" && !obj.data.ai_controlled && !obj.destroyed);
		if(!closest_player) {
			player_object.name = "PLAYER";
			closest_player = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "player", follow_range);
			player_object.name = "player";
		}

		if(closest_player && !closest_player.destroyed && closest_player.data.body) {
			let tx = closest_player.data.body.position.x - p.body.position.x;
			let ty = closest_player.data.body.position.y - p.body.position.y;
			let v = Math.sqrt(tx*tx + ty*ty);
			let dx = p.speed * tx / v;
			let dy = p.speed * ty / v;
			if(p.w * 4.5 > v) {
				dx = 0;
				dy = 0;
			}
			if(p.w * 7.5 < v && v < 10.5 * p.w)
				vel = Matter.Vector.create(dx, dy);
			else
				closest_player = null;
		}
		if(!closest_player && !closest_item && !closest_enemy) {
			if(Math.random() < 0.001 * dt)
				p.ai_random_dir = 2 * Math.PI * Math.random();
			vel = Matter.Vector.create(p.speed * Math.cos(p.ai_random_dir), p.speed * Math.sin(p.ai_random_dir));
		}

		Matter.Body.setVelocity(p.body, vel);
		return;
	}

	if(!p.inventory_element.shown && !p.hotbar_element.shown) {
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
	}

	//if(isKeyDown(player_object.game.input, 'm', true))
	//	player_create(player_object.game, p.body.position.x, p.body.position.y, false, true);

	if(isKeyDown(player_object.game.input, 'e', true) || isKeyDown(player_object.game.input, 'i', true)) {
		p.inventory_element.shown = !p.inventory_element.shown;
		p.hotbar_element.shown = !p.hotbar_element.shown;
	}

	if(player_object.game.want_hide_inventory) {
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
		player_object.game.want_hide_inventory = false;
	}

	if(p.inventory_element.shown == false && p.hotbar_element.shown == true && player_object.game.input.mouse.leftButtonPressed)
		player_item_consume(player_object, hotbar_get_selected_item(p.hotbar_element));

	let vel = Matter.Vector.create(0, 0);

	if(!p.inventory_element.shown && !p.car_object) {
		player_object.game.camera_target_body = p.body;
		p.body.collisionFilter.mask = -1;
		if(player_object.game.input.keys.down['d'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
		if(player_object.game.input.keys.down['a'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
		if(player_object.game.input.keys.down['s'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
		if(player_object.game.input.keys.down['w'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));

		let f_down = isKeyDown(player_object.game.input, 'f', true) || isKeyDown(player_object.game.input, ' ', true);
		let closest_item = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "item", 100);
		if(closest_item && !closest_item.data.dropped && ITEMS_AMMOS.includes(closest_item.data.id)) {
			if(player_object.game.settings.auto_pickup["automatically pickup ammo"] || f_down)
				item_pickup(p.inventory_element, closest_item);
		} else if(closest_item && !closest_item.data.dropped && ITEMS_FOODS.concat(ITEMS_DRINKS).includes(closest_item.data.id)) {
			if(player_object.game.settings.auto_pickup["automatically pickup food and drinks"] || f_down)
				item_pickup(p.inventory_element, closest_item);
		} else if(closest_item && !closest_item.data.dropped && [ITEM_HEALTH, ITEM_HEALTH_GREEN].includes(closest_item.data.id)) {
			if(player_object.game.settings.auto_pickup["automatically pickup health"] || f_down)
				item_pickup(p.inventory_element, closest_item);
		} else if(closest_item && !closest_item.data.dropped && closest_item.data.id == ITEM_FUEL) {
			if(player_object.game.settings.auto_pickup["automatically pickup fuel"] || f_down)
				item_pickup(p.inventory_element, closest_item);
		} else if(f_down) {
			if(!item_pickup(p.inventory_element, closest_item))
				p.car_object = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "car", 200);
			if(!p.car_object) {
				player_object.name = "PLAYER";
				let player_closest = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "player", 100);
				player_object.name = "player";
				if(player_closest) {
					player_closest.data.ai_controlled = false;
					player_object.data.ai_controlled = true;
				}
			}
		}

		if(player_object.game.input.mouse.leftButtonPressed)
			player_shoot(player_object, dt);

		if(isKeyDown(player_object.game.input, 'q', true))
			inventory_drop_item(p.inventory_element, 0, p.hotbar_element.data.iselected);
		Matter.Body.setVelocity(p.body, vel);
	}

	if(!p.inventory_element.shown && p.car_object) {
		if(player_object.game.settings.auto_pickup["automatically pickup fuel"]) {
			let closest_item = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "item", 200);
			if(closest_item && closest_item.data.id == ITEM_FUEL)
				item_pickup(p.inventory_element, closest_item);
		}
		let rotatedir = 0;
		player_object.game.camera_target_body = p.car_object.data.body;
		p.body.collisionFilter.mask = -3;
		if(player_object.game.input.keys.down['w'] && p.car_object.data.fuel > 0) {
			vel = Matter.Vector.create(p.car_object.data.speed * Math.cos(p.car_object.data.body.angle), p.car_object.data.speed * Math.sin(p.car_object.data.body.angle));
			p.car_object.data.fuel = Math.max(p.car_object.data.fuel - 0.005 * dt, 0);
			rotatedir = 1;
		}
		if(player_object.game.input.keys.down['s'] && p.car_object.data.fuel > 0) {
			vel = Matter.Vector.create(-0.5 * p.car_object.data.speed * Math.cos(p.car_object.data.body.angle), -0.5 * p.car_object.data.speed * Math.sin(p.car_object.data.body.angle));
			p.car_object.data.fuel = Math.max(p.car_object.data.fuel - 0.005 * dt, 0);
			rotatedir = -1;
		}
		if(player_object.game.input.keys.down['d'])
			Matter.Body.rotate(p.car_object.data.body, rotatedir * 0.0015 * dt);
		if(player_object.game.input.keys.down['a'])
			Matter.Body.rotate(p.car_object.data.body, -rotatedir * 0.0015 * dt);
		Matter.Body.setVelocity(p.car_object.data.body, vel);
		Matter.Body.setPosition(p.body, Matter.Vector.add(p.car_object.data.body.position, Matter.Vector.create(0, 0)));
		if(isKeyDown(player_object.game.input, 'f', true) || isKeyDown(player_object.game.input, ' ', true)) {
			Matter.Body.setPosition(p.body, Matter.Vector.add(p.car_object.data.body.position, Matter.Vector.create(150, 0)));
			p.car_object = null;
		}
	} 
}

function player_draw(player_object, ctx) {
	let p = player_object.data;
	if(p.immunity % 350 > 175)
		return;
	if(!p.car_object) {
		fillMatterBody(ctx, p.body, player_object.game.settings.player_color);
		drawMatterBody(ctx, p.body, "white");
		if(player_object.game.settings.indicators["show player health"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 * p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "lime";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 * p.h, p.w * Math.max(p.health, 0) / p.max_health, p.h * 0.05);
		}
		if(player_object.game.settings.indicators["show player thirst"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 * p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "cyan";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 * p.h, p.w * p.thirst / p.max_thirst, p.h * 0.05);
		}
		if(player_object.game.settings.indicators["show player hunger"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 * p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "orange";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 * p.h, p.w * p.hunger / p.max_hunger, p.h * 0.05);
		}

		if(p.shooting_laser) {

			let r = Math.cos(0.1 * p.item_animstate) * 15;
			let g = 0.7 * (Math.cos(0.1 * p.item_animstate) + Math.sin(0.1 * p.item_animstate)) * 15;
			let b = Math.sin(0.1 * p.item_animstate) * 15;
			r = Math.floor(r*r);
			g = Math.floor(g*g);
			b = Math.floor(b*b);
			let color = "#"+(r).toString(16).padStart(2,'0') + (g).toString(16).padStart(2,'0') + (b).toString(16).padStart(2,'0');

			ctx.beginPath();
			ctx.lineWidth = p.w * 0.65;
			ctx.strokeStyle = color;
			let px = p.body.position.x;
			let py = p.body.position.y;
			let gx = p.w * 60 * Math.cos(p.laser_direction);
			let gy = p.w * 60 * Math.sin(p.laser_direction);
			let ggx = gx;
			let ggy = gy;
			let gg = Math.sqrt(ggx * ggx + ggy * ggy);
			ggx = ggx / gg;
			ggy = ggy / gg;
			px = px + 1.7 * p.w * ggx;
			py = py + 1.7 * p.w * ggy;
			ctx.moveTo(px, py);
			ctx.lineTo(px + gx, py + gy);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = p.w * 0.45;
			ctx.strokeStyle = "white";
			px = p.body.position.x;
			py = p.body.position.y;
			gx = p.w * 60 * Math.cos(p.laser_direction);
			gy = p.w * 60 * Math.sin(p.laser_direction);
			ggx = gx;
			ggy = gy;
			gg = Math.sqrt(ggx * ggx + ggy * ggy);
			ggx = ggx / gg;
			ggy = ggy / gg;
			px = px + 1.7 * p.w * ggx;
			py = py + 1.7 * p.w * ggy;
			ctx.moveTo(px, py);
			ctx.lineTo(px + gx, py + gy);
			ctx.stroke();

			p.shooting_laser = false;
		}

		if(player_object.game.settings.player_draw_gun &&
			ITEMS_GUNS.includes(hotbar_get_selected_item(p.hotbar_element))) {

			let px = p.body.position.x - 0.45 * p.w;
			let py = p.body.position.y - 0.45 * p.h;

			let mx = 1;
			let my = 1;
			let cx = 0;
			let cy = 0;

			if(p.ai_controlled) {
				let closest_enemy = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "enemy", 1000);
				if(closest_enemy) {
					mx = closest_enemy.data.body.position.x;
					my = closest_enemy.data.body.position.y;
					cx = p.body.position.x;
					cy = p.body.position.y;
				}
			} else {
				mx = player_object.game.input.mouse.x;
				my = player_object.game.input.mouse.y;
				cx = 0.5 * ctx.canvas.width;
				cy = 0.5 * ctx.canvas.height;		
			}

			ctx.strokeStyle = "black";
			let lw = 0.25 * p.w;
			let gl = 1;
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_GREEN_GUN)
				ctx.strokeStyle = "#117733";
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_LASER_GUN) {
				ctx.strokeStyle = "purple";
				lw *= 1.25;
				gl *= 1.75;
				px = p.body.position.x;
				py = p.body.position.y;
			}

			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_SHOTGUN)
				ctx.strokeStyle = "#773311";
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_SHOTGUN)
				ctx.strokeStyle = "#551111";
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_PISTOLS) {
				ctx.strokeStyle = "#551111";
				lw *= 0.75;
				gl *= 0.75;
				ctx.beginPath();
				let px = p.body.position.x - 0.45 * p.w + p.w;
				let py = p.body.position.y - 0.45 * p.h;
				ctx.moveTo(px, py);
				let gx = 1, gy = 1;
				gx = mx - cx;
				gy = my - cy;
				let g = Math.sqrt(gx * gx + gy * gy);
				ctx.lineTo(px + gl * p.w * gx / g, py + gl * p.h * gy / g);
				ctx.lineWidth = lw;
				ctx.stroke();
			}
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RAINBOW_PISTOLS) {
				ctx.strokeStyle = "purple";
				lw *= 0.75;
				gl *= 0.75;
				ctx.beginPath();
				let px = p.body.position.x - 0.45 * p.w + p.w;
				let py = p.body.position.y - 0.45 * p.h;
				ctx.moveTo(px, py);
				let gx = 1, gy = 1;
				gx = mx - cx;
				gy = my - cy;
				let g = Math.sqrt(gx * gx + gy * gy);
				ctx.lineTo(px + gl * p.w * gx / g, py + gl * p.h * gy / g);
				ctx.lineWidth = lw;
				ctx.stroke();
			}
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_MINIGUN)
				ctx.strokeStyle = "#113377";
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_PLASMA_LAUNCHER) {
				ctx.strokeStyle = "#331133";
				lw *= 2.25;
				gl *= 1.5;
			}
			if(hotbar_get_selected_item(p.hotbar_element) == ITEM_ROCKET_LAUNCHER) {
				ctx.strokeStyle = "#111133";
				lw *= 2.25;
				gl *= 1.5;
			}
			
			ctx.beginPath();
			ctx.moveTo(px, py);
			let gx = 1, gy = 1;
			gx = mx - cx;
			gy = my - cy;
			let g = Math.sqrt(gx * gx + gy * gy);
			ctx.lineTo(px + gl * p.w * gx / g, py + gl * p.h * gy / g);
			ctx.lineWidth = lw;
			ctx.stroke();

			ctx.lineWidth = 2;
		} else if(p.sword_visible) {
			let px = p.body.position.x - p.w * 0.45;
			let py = p.body.position.y - p.h * 0.45;
			let sword_length = 100;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#55aa11";
			ctx.lineTo(px + Math.cos(p.sword_direction) * sword_length, py + Math.sin(p.sword_direction) * sword_length);
			ctx.lineWidth = 0.25 * p.w;
			ctx.stroke();
			p.sword_visible = false;
		} else if(hotbar_get_selected_item(p.hotbar_element) > 0) {
			let px = p.body.position.x - 0.25 * p.w, py = p.body.position.y - 0.25 * p.h;
			item_icon_draw(ctx, hotbar_get_selected_item(p.hotbar_element), px, py, 0.5 * p.w, 0.5 * p.h, p.item_animstate);
		}
		if(p.shield_blue_health > 0) {
			ctx.fillStyle = "gray";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w, p.h * 0.05);
			ctx.fillStyle = "cyan";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w * p.shield_blue_health / p.shield_blue_health_max, p.h * 0.05);
			ctx.globalAlpha = 0.25;
			drawCircle(ctx, p.body.position.x, p.body.position.y, 62.5, "#115577", "#113377", 0.05 * p.w);
			ctx.globalAlpha = 1.0;
		}
		if(p.shield_green_health > 0) {
			ctx.fillStyle = "gray";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w, p.h * 0.05);
			ctx.fillStyle = "lime";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w * p.shield_green_health / p.shield_green_health_max, p.h * 0.05);
			ctx.globalAlpha = 0.25;
			drawCircle(ctx, p.body.position.x, p.body.position.y, 62.5, "#117755", "#117733", 0.05 * p.w);
			ctx.globalAlpha = 1.0;
		}
		if(p.shield_rainbow_health > 0) {
			let r = Math.cos(0.1 * p.item_animstate) * 15;
			let g = 0.7 * (Math.cos(0.1 * p.item_animstate) + Math.sin(0.1 * p.item_animstate)) * 15;
			let b = Math.sin(0.1 * p.item_animstate) * 15;
			r = Math.floor(r*r);
			g = Math.floor(g*g);
			b = Math.floor(b*b);
			let color = "#"+(r).toString(16).padStart(2,'0') + (g).toString(16).padStart(2,'0') + (b).toString(16).padStart(2,'0');
			let color1 = "#"+(g).toString(16).padStart(2,'0') + (b).toString(16).padStart(2,'0') + (r).toString(16).padStart(2,'0');
			ctx.fillStyle = "gray";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w, p.h * 0.05);
			ctx.fillStyle = color;
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position.y - 1.85 * p.h, 2.5 * p.w * p.shield_rainbow_health / p.shield_rainbow_health_max, p.h * 0.05);
			ctx.globalAlpha = 0.25;
			drawCircle(ctx, p.body.position.x, p.body.position.y, 62.5, color, "white", 0.05 * p.w);
			ctx.globalAlpha = 1.0;
		}
	}
}


function player_shoot(player_object, dt, target_body=null) {

	let base_damage = 0.5;

	let p = player_object.data;

	let sx = 0;
	let sy = 0;
	let tx = 1;
	let ty = 1;

	if(!p.ai_controlled) {
		sx = 0.5 * window.innerWidth;
		sy = 0.5 * window.innerHeight;
		tx = player_object.game.input.mouse.x
		ty = player_object.game.input.mouse.y
	} else if(target_body) {
		sx = p.body.position.x;
		sy = p.body.position.y;
		tx = target_body.position.x;
		ty = target_body.position.y;

		tx = (tx - sx) * 10 + sx;
		ty = (ty - sy) * 10 + sy;
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_LASER_GUN
		&& true
		&& inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
			p.laser_direction = Math.atan2(ty - sy, tx - sx);
			p.shooting_laser = true;
			let g = player_object.game;
			for(let i = 0; i < g.objects.length; i++) {
				let obj = g.objects[i];
				if(!obj.destroyed && (obj.name == "enemy" || obj.name == "car" && !obj.data.is_tank || obj.name == "rocket")) {
					if(player_laser_hits_point(player_object, obj.data.body.position.x, obj.data.body.position.y, 1.5 * p.w, 60 * p.w, p.laser_direction)) {
						obj.data.health -= 15625 * dt;
						obj.data.hit_by_player = true;
					}
				}
			}
		if(Math.random() < 0.0001 * dt)
			inventory_clear_item(p.inventory_element, ITEM_RAINBOW_AMMO, 1);
	}
	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			tx - sx,
			ty - sy,
			20,
			base_damage
		);
		p.shot_cooldown = 200;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_SHOTGUN
		&& true
		&& p.shotgun_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		for(let i = 0; i < Math.random() * 7 + 7; i++)
			bullet_create(
				player_object.game,
				p.body.position.x,
				p.body.position.y,
				(0.95 + 0.1 * Math.random()) * tx - sx,
				(0.95 + 0.1 * Math.random()) * ty - sy,
				Math.random() * 10 + 10,
				5 * base_damage * (0.5 + 1.0 * Math.random())
			);
		p.shotgun_cooldown = 750;
		if(Math.random() > 0.985)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_MINIGUN
		&& true
		&& p.minigun_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			(0.95 + 0.1 * Math.random()) * tx - sx,
			(0.95 + 0.1 * Math.random()) * ty - sy,
			Math.random() * 10 + 10,
			0.33 * 10 * base_damage * Math.random()
		);
		p.minigun_cooldown = 60;
		if(Math.random() > 0.995)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_PLASMA_LAUNCHER
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_PLASMA)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			tx - sx,
			ty - sy,
			17.5,
			3 * 25 * base_damage * (0.25 + 2 * 0.75 * Math.random()),
			false,
			12.5,
			1500,
			"cyan",
			"blue"
		);
		p.shot_cooldown = 400;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_PLASMA, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_PISTOLS
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		bullet_create(
			player_object.game,
			p.body.position.x + p.w * Math.cos(theta - Math.PI / 4),
			p.body.position.y + p.w * Math.sin(theta - Math.PI / 4),
			tx - sx,
			ty - sy,
			30,
			0.66 * 125 * base_damage * 2 * Math.random(),
			false,
			6,
			1500,
			"pink",
			"red"
		);
		bullet_create(
			player_object.game,
			p.body.position.x + p.w * Math.cos(theta + Math.PI / 4),
			p.body.position.y + p.w * Math.sin(theta + Math.PI / 4),
			tx - sx,
			ty - sy,
			30,
			0.66 * 125 * base_damage * 2 * Math.random(),
			false,
			6,
			1500,
			"pink",
			"red"
		);
		p.shot_cooldown = 100;
		if(Math.random() > 0.999)
			inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_SHOTGUN
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		N = Math.floor(Math.random() * 7 + 5);
		for(let i = 0; i < N; i++)
			bullet_create(
				player_object.game,
				p.body.position.x + 2 * p.w * Math.cos(theta - (0.5 * N - i) * Math.PI / N),
				p.body.position.y + 2 * p.w * Math.sin(theta - (0.5 * N - i) * Math.PI / N),
				tx - sx,
				ty - sy,
				30,
				1.5 * 125 * base_damage * (0.5 + 1.0 * Math.random()),
				false,
				6,
				1500,
				"pink",
				"red"
			);
		p.shot_cooldown = 500;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
	}

	// TODO balance damage
	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_SWORD && true) {
		if(tx > sx)
			p.sword_direction += 0.02 * dt
		else
			p.sword_direction -= 0.02 * dt
		p.sword_direction = p.sword_direction % (2 * Math.PI);
		let closest_enemy = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "enemy", 200);
		if(closest_enemy) {
			enemy_direction = Math.atan2(closest_enemy.data.body.position.y - p.body.position.y, closest_enemy.data.body.position.x - p.body.position.x);
			if(Math.abs(enemy_direction - p.sword_direction) % (2 * Math.PI) < Math.PI / 8) {
				closest_enemy.data.health -= (Math.random() * 3000 + 2000) * dt;
				closest_enemy.data.hit_by_player = true;
			}
		}
		let closest_bullet = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "bullet", 200);
		if(closest_bullet) {                                                   
			let vx = closest_bullet.data.body.position.x - player_object.data.body.position.x;
			let vy = closest_bullet.data.body.position.y - player_object.data.body.position.y;
			let v = Math.sqrt(vx*vx + vy*vy);
			Matter.Body.setVelocity(closest_bullet.data.body, {x: 5 * vx / v, y: 5 * vy / v});
		}
		let closest_rocket = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "rocket", 200);
		if(closest_rocket) {                                                   
			rocket_direction = Math.atan2(closest_rocket.data.body.position.y - p.body.position.y, closest_rocket.data.body.position.x - p.body.position.x);
			if(Math.abs(rocket_direction - p.sword_direction) % (2 * Math.PI) < Math.PI / 8) {
				closest_rocket.data.health -= (Math.random() * 1500 + 500) * dt;
				closest_rocket.data.hit_by_player = true;
			}
		}
		p.sword_visible = true;
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_GREEN_GUN
		&& true
		&& p.minigun_cooldown <= 0) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			(1 - 0.05 / 2 + 0.05 * Math.random()) * tx - sx,
			(1 - 0.05 / 2 + 0.05 * Math.random()) * ty - sy,
			Math.random() * 10 + 20,
			625 * base_damage * 2 * Math.random(),
			false,
			6,
			1500,
			"lime",
			"green"
		);
		p.minigun_cooldown = 80;
		p.health -= 0.0255 * dt
		p.hunger -= 0.0125 * dt
		p.thirst -= 0.0125 * dt
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_ROCKET_LAUNCHER
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		rocket_create(
			player_object.game,
			p.body.position.x + Math.cos(theta) * p.w * 1.75,
			p.body.position.y + Math.sin(theta) * p.h * 1.75,
			tx - sx,
			ty - sy,
			Math.min(0.25 * p.w, 10),
			null,
			0.33 * 3125 * base_damage * (0.75 + 0.5 * Math.random()),
			p.max_health,
			false,
			20
		);
		p.shot_cooldown = 400;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_RAINBOW_PISTOLS
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item_from_list(p.inventory_element, [ITEM_AMMO, ITEM_RED_PLASMA, ITEM_PLASMA, ITEM_RAINBOW_AMMO, ITEM_ROCKET]) > -1) {
		let theta = Math.atan2(ty - sy, tx - sx);

		let colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "purple"];
		let color1 = null;
		let color2 = null;

		p.gradient += 0.01 * dt;

		if(inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
			color1 = colors[Math.floor(p.gradient) % 7];
			color2 = "white";
			if(Math.random() > 0.999)
				inventory_clear_item(p.inventory_element, ITEM_RAINBOW_AMMO, 1);
		}

		else if(inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
			color1 = "red";
			color2 = "pink";
			if(Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
		}

		else if(inventory_has_item(p.inventory_element, ITEM_PLASMA)) {
			color1 = "cyan";
			color2 = "blue";
			if(Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_PLASMA, 1);
		}

		else if(inventory_has_item(p.inventory_element, ITEM_AMMO)) {
			color1 = "yellow";
			color2 = "orange";
			if(Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		}

		if(!inventory_has_item(p.inventory_element, ITEM_ROCKET) || inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
			bullet_create(
				player_object.game,
				p.body.position.x + p.w * Math.cos(theta - Math.PI / 4),
				p.body.position.y + p.w * Math.sin(theta - Math.PI / 4),
				tx - sx,
				ty - sy,
				30,
				3 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				false,
				6,
				1500,
				color1,
				color2
			);
			bullet_create(
				player_object.game,
				p.body.position.x + p.w * Math.cos(theta + Math.PI / 4),
				p.body.position.y + p.w * Math.sin(theta + Math.PI / 4),
				tx - sx,
				ty - sy,
				30,
				3 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				false,
				6,
				1500,
				color1,
				color2
			);
		} else if(inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
			rocket_create(
				player_object.game,
				p.body.position.x + Math.cos(theta - Math.PI / 4) * p.w * 1.75,
				p.body.position.y + Math.sin(theta - Math.PI / 4) * p.h * 1.75,
				tx - sx,
				ty - sy,
				0.15 * p.w,
				null,
				3 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				p.max_health,
				false,
				20
			);
			rocket_create(
				player_object.game,
				p.body.position.x + Math.cos(theta + Math.PI / 4) * p.w * 1.75,
				p.body.position.y + Math.sin(theta + Math.PI / 4) * p.h * 1.75,
				tx - sx,
				ty - sy,
				0.15 * p.w,
				null,
				3 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				p.max_health,
				false,
				20
			);
			if(Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
		}
		p.shot_cooldown = 100;
	}
}

function player_item_consume(player_object, id, anywhere=false) {
	let p = player_object.data;


	let item_i = 0;
	let item_j = player_object.data.hotbar_element.data.iselected;

	if(anywhere) {
		item_i = -1;
		item_j = -1;
	}

	if(id == ITEM_FUEL && true) {
		let c = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "car", 200);
		if(c) {
			c.data.fuel += Math.min(c.data.max_fuel - c.data.fuel, c.data.max_fuel * (Math.random() * 0.0625 + 0.0625));
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}
	}

	if(id == ITEM_SHIELD && true) {
		p.shield_blue_health = p.shield_blue_health_max;
		p.shield_green_health = 0;
		p.shield_rainbow_health = 0;
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(id == ITEM_SHIELD_GREEN && true) {
		p.shield_blue_health = 0;
		p.shield_green_health = p.shield_green_health_max;
		p.shield_rainbow_health = 0;
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(id == ITEM_SHIELD_RAINBOW && true) {
		p.shield_blue_health = 0;
		p.shield_green_health = 0;
		p.shield_rainbow_health = p.shield_rainbow_health_max;
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(id == ITEM_HEALTH && true) {
		p.health += Math.min(p.max_health - p.health, (Math.random() * 0.125 + 0.125) * p.max_health);
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(id == ITEM_HEALTH_GREEN && true) {
		p.health = Math.min(p.max_health, p.health + p.max_health * (Math.random() * 0.125 + 0.375));
		p.hunger = Math.min(p.max_hunger, p.hunger + p.max_hunger * (Math.random() * 0.125 + 0.375));
		p.thirst = Math.min(p.max_thirst, p.thirst + p.max_thirst * (Math.random() * 0.125 + 0.375));
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(ITEMS_DRINKS.includes(id) && true) {
		p.thirst += Math.min(p.max_thirst - p.thirst, (Math.random() * 0.125 + 0.125) * p.max_thirst);
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}

	if(ITEMS_FOODS.includes(id) && true) {
		p.hunger += Math.min(p.max_hunger - p.hunger, (Math.random() * 0.125 + 0.125) * p.max_hunger);
		inventory_clear_item(player_object.data.inventory_element, id, 1, item_i, item_j);
	}
}

function player_laser_hits_point(player_object, x, y, w, l, alpha) {
	let px = player_object.data.body.position.x;
	let py = player_object.data.body.position.y;
	x = x - px;
	y = y - py;
	let X = x * Math.cos(alpha) + y * Math.sin(alpha);
	let Y = -x * Math.sin(alpha) + y * Math.cos(alpha);
	return Math.pow(Math.abs(X/l - 1), 4) + Math.pow(Math.abs(Y/w), 4) < 1;
}


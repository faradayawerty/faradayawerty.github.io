
function player_create(g, x, y, respawn=false, ai_controlled=false) {
	let width = 40, height = 40;
	let p = {
		health: 100,
		max_health: 100,
		thirst: 210,
		max_thirst: 210,
		hunger: 210,
		max_hunger: 210,
		speed: 10,
		max_speed: 10,
		shot_cooldown: 0,
		shotgun_cooldown: 0,
		minigun_cooldown: 0,
		want_level: g.level,
		w: width,
		h: height,
		infobox_element: null,
		inventory_element: null,
		hotbar_element: null,
		car_object: null,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			inertia: Infinity
		}),
		immunity: 9000,
		shield_blue_health: 0,
		shield_blue_health_max: 9000,
		sword_direction: 0,
		sword_visible: false,
		ai_controlled: ai_controlled
	};
	p.infobox_element = g.gui_elements[infobox_create(g, 50, 300, 4)];
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
	p.infobox_element.data.attached_to_object = g.objects[iplayer];
	p.inventory_element.data.attached_to_object = g.objects[iplayer];
	p.hotbar_element.data.attached_to_object = g.objects[iplayer];
	if(ai_controlled) {
		p.inventory_element.data.items[0][0] = ITEM_GUN;
		p.inventory_element.data.items[0][1] = ITEM_AMMO;
		p.inventory_element.data.items[0][2] = Math.round(Math.random()) * ITEM_WATER;
		p.inventory_element.data.items[0][3] = Math.round(Math.random()) * ITEM_CANNED_MEAT;
	}
	return iplayer;
}

function player_destroy(player_object) {
	if(player_object.destroyed)
		return;
	if(player_object.game.camera_target_body == player_object.data.body)
		player_object.game.camera_target_body = null;
	Matter.Composite.remove(player_object.game.engine.world, player_object.data.body);
	player_object.data.body = null;
	infobox_destroy(player_object.data.infobox_element);
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
	player_destroy(player_object);
}

function player_update(player_object, dt) {

	if(!player_object || player_object.destroyed)
		return;

	let p = player_object.data;
	if(p.shot_cooldown > 0)
		p.shot_cooldown -= dt;
	if(p.shotgun_cooldown > 0)
		p.shotgun_cooldown -= dt;
	if(p.minigun_cooldown > 0)
		p.minigun_cooldown -= dt;

	if(p.shield_blue_health > 0)
		p.shield_blue_health -= 0.15 * dt;
	if(p.immunity > 0)
		p.immunity -= dt;

	if(player_object.data.health <= 0) {
		player_die(player_object);
		return;
	}

	if(p.thirst > 0)
		p.thirst = Math.max(0, p.thirst - 0.001 * dt)
	if(p.thirst <= 0)
		p.health -= 0.01 * dt;
	if(p.hunger > 0)
		p.hunger = Math.max(0, p.hunger - 0.001 * dt)
	if(p.hunger <= 0)
		p.health -= 0.01 * dt;

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

		p.car_object = null;
		p.body.collisionFilter.mask = -1;

		let vel = Matter.Vector.create(0, 0);
		let closest_enemy = game_object_find_closest(player_object.game, player_object.data.body.position.x, player_object.data.body.position.y, "enemy", 1000);
		if(closest_enemy) {
			let tx = closest_enemy.data.body.position.x - p.body.position.x;
			let ty = closest_enemy.data.body.position.y - p.body.position.y;
			let v = Math.sqrt(tx*tx + ty*ty);
			let dx = p.speed * tx / v;
			let dy = p.speed * ty / v;
			if(p.w * 4.5 < v && v < p.w * 11.5) {
				player_shoot(player_object, dt, closest_enemy.data.body);
				dx = 0;
				dy = 0;
			}
			if(p.w * 4.5 > v) {
				dx = -dx;
				dy = -dy;
			}
			vel = Matter.Vector.create(dx, dy);
		}
		//else {
		//	let closest_player = player_object.game.objects.find((obj) => obj.name == "player" && !obj.data.ai_controlled);
		//	if(closest_player) {
		//		let tx = closest_player.data.body.position.x - p.body.position.x;
		//		let ty = closest_player.data.body.position.y - p.body.position.y;
		//		let v = Math.sqrt(tx*tx + ty*ty);
		//		let dx = p.speed * tx / v;
		//		let dy = p.speed * ty / v;
		//		if(p.w * 4.5 > v) {
		//			dx = 0;
		//			dy = 0;
		//		}
		//		vel = Matter.Vector.create(dx, dy);
		//	}
		//}
		Matter.Body.setVelocity(p.body, vel);
		return;
	}

	if(!p.inventory_element.shown && !p.hotbar_element.shown) {
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
	}

	p.infobox_element.data.lines.unshift(Math.round(player_object.game.input.mouse.x) + ":" + Math.round(player_object.game.input.mouse.y));
	p.infobox_element.data.lines.unshift(player_object.game.level);
	p.infobox_element.data.lines.unshift(Math.round(player_object.data.health));
	p.infobox_element.data.lines.unshift(Math.round(p.body.position.x) + ":" + Math.round(p.body.position.y));

	if(isKeyDown(player_object.game.input, 'm', true))
		player_create(player_object.game, p.body.position.x, p.body.position.y, false, true);

	if(isKeyDown(player_object.game.input, 'o', true))
		p.infobox_element.shown = !p.infobox_element.shown;

	if(isKeyDown(player_object.game.input, 'e', true) || isKeyDown(player_object.game.input, 'i', true)) {
		p.inventory_element.shown = !p.inventory_element.shown;
		p.hotbar_element.shown = !p.hotbar_element.shown;
	}

	if(player_object.game.want_hide_inventory) {
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
		player_object.game.want_hide_inventory = false;
	}

	if(p.inventory_element.shown = false && p.hotbar_element.shown = true) {
		if(hotbar_get_selected_item(p.hotbar_element) == ITEM_FUEL
			&& player_object.game.input.mouse.leftButtonPressed) {
			let c = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "car", 200);
			if(c) {
				c.data.fuel += Math.min(c.data.max_fuel - c.data.fuel, c.data.max_fuel * (Math.random() * 0.25 + 0.25));
				p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
			}
		}

		if(hotbar_get_selected_item(p.hotbar_element) == ITEM_SHIELD
			&& player_object.game.input.mouse.leftButtonPressed) {
			p.shield_blue_health = p.shield_blue_health_max;
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}

		if(hotbar_get_selected_item(p.hotbar_element) == ITEM_HEALTH
			&& player_object.game.input.mouse.leftButtonPressed) {
			p.health += Math.min(p.max_health - p.health, Math.random() * 10 + 5);
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}

		if(hotbar_get_selected_item(p.hotbar_element) == ITEM_HEALTH_GREEN
			&& player_object.game.input.mouse.leftButtonPressed) {
			p.health = p.max_health;
			p.hunger = p.max_hunger;
			p.thirst = p.max_thirst;
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}

		if(ITEMS_DRINKS.includes(hotbar_get_selected_item(p.hotbar_element))
			&& player_object.game.input.mouse.leftButtonPressed) {
			p.thirst += Math.min(p.max_thirst - p.thirst, Math.random() * 20 + 5);
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}

		if(ITEMS_FOODS.includes(hotbar_get_selected_item(p.hotbar_element))
			&& player_object.game.input.mouse.leftButtonPressed) {
			p.hunger += Math.min(p.max_hunger - p.hunger, Math.random() * 30 + 5);
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}
	}

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
		} else if(closest_item && !closest_item.data.dropped && closest_item.data.id == ITEM_HEALTH) {
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
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 * p.h, p.w * p.health / p.max_health, p.h * 0.05);
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

		if(player_object.game.settings.player_draw_gun &&
			ITEMS_GUNS.includes(hotbar_get_selected_item(p.hotbar_element))) {

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
			let px = p.body.position.x - 0.45 * p.w;
			let py = p.body.position.y - 0.45 * p.h;
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
			let px = p.body.position.x - 0.25 * p.w,
				py = p.body.position.y - 0.25 * p.h;
			item_icon_draw(ctx, hotbar_get_selected_item(p.hotbar_element), px, py, 0.5 * p.w, 0.5 * p.h);
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
	}
}


function player_shoot(player_object, dt, target_body=null) {

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
			ty - sy
		);
		p.shot_cooldown = 200;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
	}
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
				50 + 50 * Math.random(),
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
			20 + 10 * Math.random(),
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
			20 + 10 * Math.random(),
			false,
			6,
			1500,
			"pink",
			"red"
		);
		p.shot_cooldown = 100;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
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
				Math.random() * 1.25 + 0.25
			);
		p.shotgun_cooldown = 750;
		if(Math.random() > 0.91)
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
			Math.random() * 10 + 20,
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
	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_ROCKET_LAUNCHER
		&& true
		&& p.shot_cooldown <= 0
		&& inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		rocket_create(
			player_object.game,
			p.body.position.x + Math.cos(theta) * p.w * 3,
			p.body.position.y + Math.sin(theta) * p.h * 3,
			tx - sx,
			ty - sy,
			Math.min(0.25 * p.w, 10),
			game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "enemy", 1000),
			1000 + 2000 * Math.random(),
			p.max_health,
			false,
			15
		);
		p.shot_cooldown = 400;
		if(Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
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
			Math.random()
		);
		p.minigun_cooldown = 60;
		if(Math.random() > 0.995)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
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
			Math.random() * 800,
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
}


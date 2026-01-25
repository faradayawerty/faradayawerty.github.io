function player_create(g, x, y, respawn = false, ai_controlled = false) {
	let width = 40,
		height = 40;
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
		want_level: null,
		w: width,
		h: height,
		inventory_element: null,
		hotbar_element: null,
		achievements_element: null,
		achievements_shower_element: null,
		car_object: null,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			isStatic: false,
			inertia: Infinity
		}),
		immunity: 6000,
		shield_blue_health: 0,
		shield_blue_health_max: 500,
		shield_green_health: 0,
		shield_green_health_max: 2500,
		shield_rainbow_health: 0,
		shield_rainbow_health_max: 12500,
		sword_direction: 0,
		sword_visible: false,
		sword_protection: false,
		ai_controlled: ai_controlled,
		ai_random_dir: 0,
		gradient: 0,
		item_animstate: 0,
		laser_direction: 0,
		shooting_laser: false,
		laser_sound_has_played: false,
	};
	p.achievements_element = g.gui_elements[achievements_create(g)];
	p.achievements_shower_element = g.gui_elements[achievements_shower_create(g,
		p.achievements_element)];
	if (!p.ai_controlled) {
		p.achievements_shower_element.shown = true;
		for (let i = 0; i < g.saved_achievements.length; i++)
			achievement_do(p.achievements_element.data.achievements, g
				.saved_achievements[i].name, p.achievements_shower_element, true
			);
		g.saved_achievements = [];
	}
	p.inventory_element = g.gui_elements[inventory_create(g)];
	for (let i = 0; i < g.saved_items.length; i++)
		for (let j = 0; j < g.saved_items[i].length; j++) {
			p.inventory_element.data.items[i][j] = g.saved_items[i][j];
			g.saved_items[i][j] = 0;
		}
	p.hotbar_element = g.gui_elements[hotbar_create(g, p.inventory_element
		.data)];
	Matter.Composite.add(g.engine.world, p.body);
	if (ai_controlled) {
		p.inventory_element.data.items[0][0] = ITEM_GUN;
		p.inventory_element.data.items[0][1] = ITEM_AMMO;
		p.inventory_element.data.items[0][2] = Math.round(Math.random()) *
			ITEM_WATER;
		p.inventory_element.data.items[0][3] = Math.round(Math.random()) *
			ITEM_CANNED_MEAT;
		for (let i = 0; i < g.objects.length; i++) {
			if (g.objects[i].name == "player")
				g.objects[i].data.ai_controlled = false;
		}
	}
	let iplayer = game_object_create(g, "player", p, player_update, player_draw,
		player_destroy);
	g.player_object = null;
	if (respawn) {
		p.health = 0.15 * p.max_health;
		p.hunger = 0.35 * p.max_hunger;
		p.thirst = 0.55 * p.max_thirst;
	}
	p.inventory_element.data.attached_to_object = g.objects[iplayer];
	p.hotbar_element.data.attached_to_object = g.objects[iplayer];
	return iplayer;
}

function player_destroy(player_object) {
	if (player_object.destroyed)
		return;
	let p = player_object.data;
	let g = player_object.game;
	g.debug_console.unshift("destroying player");
	if (!level_visible(g, p.want_level, player_object))
		game_destroy_level(g, p.want_level);
	if (player_object.game.camera_target_body == player_object.data.body)
		player_object.game.camera_target_body = null;
	Matter.Composite.remove(player_object.game.engine.world, player_object.data
		.body);
	player_object.data.body = null;
	achievements_shower_destroy(player_object.data.achievements_shower_element);
	achievements_destroy(player_object.data.achievements_element);
	inventory_destroy(player_object.data.inventory_element);
	hotbar_destroy(player_object.data.hotbar_element);
	player_object.destroyed = true;
	player_object.game.player_object = null;
}

function player_die(player_object) {
	player_object.game.input.mouse.leftButtonPressed = false;
	player_object.game.deaths += 1;
	if (player_object.data.ai_controlled || player_object.game.settings
		.lose_items_on_death) {
		inventory_drop_all_items(player_object.data.inventory_element);
	} else {
		for (let i = 0; i < player_object.game.saved_items.length; i++)
			for (let j = 0; j < player_object.game.saved_items[i].length; j++)
				player_object.game.saved_items[i][j] = player_object.data
				.inventory_element.data.items[i][j];
	}
	if (!player_object.data.ai_controlled && !player_object.game.settings
		.lose_achievements_on_death) {
		player_object.game.saved_achievements = player_object.data
			.achievements_element.data.achievements.filter((ach) => ach.done);
	}
	if (!player_object.data.ai_controlled || player_object.game.objects.filter((
			obj) => obj.name == "player" && obj != player_object).length < 1)
		player_object.game.want_respawn_menu = true;
	for (let i = 0; i < player_object.game.objects.length; i++) {
		if (player_object.game.objects[i].name == "enemy" && !player_object.game
			.objects[i].destroyed) {
			player_object.game.objects[i].data.health = Math.min(
				player_object.game.objects[i].data.max_health,
				player_object.game.objects[i].data.health * 1.5
			);
			player_object.game.objects[i].data.hunger = Math.max(0,
				player_object.game.objects[i].data.hunger - 0.25 *
				player_object.game.objects[i].data.max_hunger);
		}
	}
	let g = player_object.game;
	g.kills_for_boss = Math.min(32, g.kills_for_boss + 6);
	player_destroy(player_object);
}

function player_update(player_object, dt) {
	if (dt < 1000 / 120 && !player_object || player_object.destroyed || !
		player_object.data.body)
		return;
	let p = player_object.data;
	if (p.mobile_delay === undefined) p.mobile_delay = 0;
	if (p.mobile_delay > 0) p.mobile_delay -= dt;
	if (!menu1.shown)
		achievement_do(p.achievements_element.data.achievements, "joining in", p
			.achievements_shower_element);
	let has_empty = false;
	for (let i = 0; i < p.inventory_element.data.items.length; i++)
		for (let j = 0; j < p.inventory_element.data.items[i].length; j++)
			if (p.inventory_element.data.items[i][j] == 0)
				has_empty = true;
	if (!has_empty)
		achievement_do(p.achievements_element.data.achievements,
			"full inventory", p.achievements_shower_element);
	let max_levels = 600;
	if (p.body.position.x < -max_levels * 2500) Matter.Body.setPosition(p
		.body, {
			x: max_levels * 2500,
			y: p.body.position.y
		}, false);
	if (max_levels * 2500 < p.body.position.x) Matter.Body.setPosition(p.body, {
		x: -max_levels * 2500,
		y: p.body.position.y
	}, false);
	if (p.body.position.y < -max_levels * 2500) Matter.Body.setPosition(p
		.body, {
			x: p.body.position.x,
			y: max_levels * 2500
		}, false);
	if (max_levels * 2500 < p.body.position.y) Matter.Body.setPosition(p.body, {
		x: p.body.position.x,
		y: -max_levels * 2500
	}, false);
	if (p.shot_cooldown > 0) p.shot_cooldown -= dt;
	if (p.shotgun_cooldown > 0) p.shotgun_cooldown -= dt;
	if (p.minigun_cooldown > 0) p.minigun_cooldown -= dt;
	p.item_animstate += 0.01 * dt;
	if (p.shield_blue_health > 0) p.shield_blue_health -= 0.01 * dt;
	if (p.shield_green_health > 0) p.shield_green_health -= 0.01 * dt;
	if (p.shield_rainbow_health > 0) p.shield_rainbow_health -= 0.01 * dt;
	if (p.saved_health - p.health > 1) {
		player_object.game.debug_console.unshift("player health: " + Math.round(
				p.health) + ", change " + Math.round(p.saved_health - p
				.health) +
			": hunger: " + Math.round(p.hunger) + ", thirst: " + Math.round(
				p.thirst) +
			", at x:" + Math.round(p.body.position.x) + " y:" + Math.round(p
				.body.position.y));
	}
	p.saved_health = p.health;
	p.saved_hunger = p.hunger;
	p.saved_thirst = p.thirst;
	if (p.immunity > 0) p.immunity -= dt;
	if (player_object.data.health <= 0 && !player_object.game.godmode) {
		player_die(player_object);
		return;
	}
	if (player_object.game.godmode) {
		p.health = p.max_health;
		p.hunger = p.max_hunger;
		p.thirst = p.max_thirst;
	}
	if (p.thirst > 0 && achievement_get(p.achievements_element.data
			.achievements, "first steps").done) {
		if (p.shield_green_health > 0) p.thirst = Math.max(0, p.thirst -
			0.0005 * dt);
		else if (p.shield_rainbow_health > 0) p.thirst = Math.max(0, p.thirst -
			0.00000025 * dt);
		else p.thirst = Math.max(0, p.thirst - 0.001 * dt);
	}
	if (p.thirst <= 0) p.health -= 0.01 * dt;
	if (p.hunger > 0 && achievement_get(p.achievements_element.data
			.achievements, "first steps").done) {
		if (p.shield_green_health > 0) p.hunger = Math.max(0, p.hunger -
			0.0005 * dt);
		else if (p.shield_rainbow_health > 0) p.hunger = Math.max(0, p.hunger -
			0.00000025 * dt);
		else p.hunger = Math.max(0, p.hunger - 0.001 * dt);
	}
	if (p.hunger <= 0) p.health -= 0.005 * dt;
	p.speed = p.max_speed;
	if (p.thirst < 0.33 * p.max_thirst) p.speed *= 0.875;
	if (p.hunger < 0.11 * p.max_hunger) p.speed *= 0.75;
	if (p.hunger > 0.75 * p.max_hunger && p.thirst > 0.75 * p.max_thirst)
		p.health = Math.min(p.max_health, p.health + 0.0025 * dt);
	if (p.want_level == null) {
		if (!level_visible(player_object.game, "0x0", player_object))
			levels_set(player_object.game, "0x0");
		p.want_level = "0x0";
	}
	let old_level = p.want_level;
	p.want_level = (Math.floor(p.body.position.x / 2500)) + "x" + (Math.floor(p
		.body.position.y / 2500));
	if (old_level != p.want_level) {
		if (!level_visible(player_object.game, old_level, player_object))
			game_destroy_level(player_object.game, old_level);
		if (!level_visible(player_object.game, p.want_level, player_object))
			levels_set(player_object.game, p.want_level, old_level);
		achievement_do(p.achievements_element.data.achievements,
			"outside the box", p.achievements_shower_element);
	}
	if (p.ai_controlled) return;
	if (p.inventory_element.shown) p.achievements_element.shown = false;
	if (p.inventory_element.shown || p.achievements_element.shown) {
		p.hotbar_element.shown = false;
		p.achievements_shower_element.shown = false;
	} else {
		p.achievements_shower_element.shown = true;
	}
	if (!p.inventory_element.shown && !p.hotbar_element.shown && !p
		.achievements_element.shown) {
		p.hotbar_element.shown = true;
		p.achievements_shower_element.shown = true;
	}
	if (player_object.game.want_hide_inventory) {
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
		p.achievements_element.shown = false;
		player_object.game.want_hide_inventory = false;
	}
	if (p.mobile_delay <= 0 && player_object.game.input.mouse
		.leftButtonPressed && p.hotbar_element.shown) {
		let mx = player_object.game.input.mouse.x / get_scale();
		let my = player_object.game.input.mouse.y / get_scale();
		let hb = p.hotbar_element.data;
		let s = hb.slot_size;
		let step = s * 1.05;
		let button_y = 40;
		if (my >= button_y && my <= button_y + s) {
			let x_start_buttons = 60 + step * 9;
			if (mx >= x_start_buttons && mx <= x_start_buttons + s) {
				achievement_do(p.achievements_element.data.achievements,
					"discovering inventory", p.achievements_shower_element);
				p.inventory_element.shown = !p.inventory_element.shown;
				p.hotbar_element.shown = !p.inventory_element.shown;
				p.achievements_element.shown = false;
				p.inventory_element.data.imove = -1;
				p.inventory_element.data.jmove = -1;
				p.mobile_delay = 300;
			} else if (mx >= x_start_buttons + step && mx <= x_start_buttons +
				step + s) {
				achievement_do(p.achievements_element.data.achievements,
					"achievements", p.achievements_shower_element);
				p.achievements_element.shown = !p.achievements_element.shown;
				p.inventory_element.shown = false;
				p.hotbar_element.shown = !p.achievements_element.shown;
				p.mobile_delay = 300;
			} else if (mx >= x_start_buttons + step * 2 && mx <=
				x_start_buttons + step * 2 + s) {
				player_object.game.want_menu = true;
				p.mobile_delay = 300;
			}
		}
	}
	if (isKeyDown(player_object.game.input, 'e', true) || isKeyDown(
			player_object.game.input, 'i', true) || isKeyDown(player_object.game
			.input, 'у', true) || isKeyDown(player_object.game.input, 'ш',
			true)) {
		achievement_do(p.achievements_element.data.achievements,
			"discovering inventory", p.achievements_shower_element);
		p.inventory_element.shown = !p.inventory_element.shown;
		p.inventory_element.data.imove = -1;
		p.inventory_element.data.jmove = -1;
		p.hotbar_element.shown = !p.inventory_element.shown;
		p.achievements_element.shown = false;
		p.mobile_delay = 300;
	}
	if (isKeyDown(p.achievements_element.game.input, 'j', true) || isKeyDown(p
			.achievements_element.game.input, 'r', true) || isKeyDown(p
			.achievements_element.game.input, 'о', true) || isKeyDown(p
			.achievements_element.game.input, 'к', true)) {
		p.achievements_element.data.x = 75;
		p.achievements_element.data.y = 75;
		achievement_do(p.achievements_element.data.achievements, "achievements",
			p.achievements_shower_element);
		p.achievements_element.shown = !p.achievements_element.shown;
		p.inventory_element.shown = false;
		p.hotbar_element.shown = !p.achievements_element.shown;
		p.mobile_delay = 300;
	}
	let scale = get_scale();
	let mx = player_object.game.input.mouse.x / scale;
	let my = player_object.game.input.mouse.y / scale;
	let hb = p.hotbar_element.data;
	let hb_total_width = (hb.slot_size * 1.05) * hb.row.length;
	if (player_object.game.mobile) {
		hb_total_width += (hb.slot_size * 1.05) * 3 + 20;
	}
	let is_clicking_hotbar = doRectsCollide(mx, my, 0, 0, 40, 40,
		hb_total_width, hb.slot_size);
	let use_triggered = player_object.game.mobile ?
		isKeyDown(player_object.game.input, 'c', true) :
		player_object.game.input.mouse.leftButtonPressed;
	if (use_triggered) {
		if (!p.hotbar_element.shown || !is_clicking_hotbar) {
			let item = hotbar_get_selected_item(p.hotbar_element);
			if (item > 0) {
				player_item_consume(player_object, item);
				if (player_object.game.mobile) p.mobile_delay = 200;
			}
		}
	}
	if (!p.car_object) {
		player_object.game.camera_target_body = p.body;
		p.body.collisionFilter.mask = -1;
		let vel = Matter.Vector.mult(getWishDir(player_object.game.input), p
			.speed);
		let f_down = isKeyDown(player_object.game.input, 'f', true) ||
			isKeyDown(player_object.game.input, 'а', true) || isKeyDown(
				player_object.game.input, ' ', true);
		let closest_item = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "item", 100);
		if (closest_item) {
			let id = closest_item.data.id;
			if (
				(
					(ITEMS_AMMOS.concat(ITEMS_JUNK).includes(id) &&
						player_object.game.settings.auto_pickup[
							"automatically pickup ammo"]) ||
					(ITEMS_FOODS.concat(ITEMS_DRINKS).includes(id) &&
						player_object.game.settings.auto_pickup[
							"automatically pickup food and drinks"]) ||
					(ITEMS_GUNS.concat(ITEMS_MELEE).includes(id) &&
						player_object.game.settings.auto_pickup[
							"automatically pickup weapons"]) ||
					([ITEM_SHIELD, ITEM_SHIELD_GREEN, ITEM_SHIELD_RAINBOW]
						.includes(id) && player_object.game.settings
						.auto_pickup["automatically pickup shields"]) ||
					([ITEM_HEALTH, ITEM_HEALTH_GREEN].includes(id) &&
						player_object.game.settings.auto_pickup[
							"automatically pickup health"]) ||
					(id == ITEM_FUEL && player_object.game.settings.auto_pickup[
						"automatically pickup fuel"])
				) && !closest_item.data.dropped ||
				f_down
			) {
				if (item_pickup(p.inventory_element, closest_item)) {
					achievement_do(p.achievements_element.data.achievements,
						"pick an item", p.achievements_shower_element);
					if (id == ITEM_GUN) achievement_do(p.achievements_element
						.data.achievements, "get a gun", p
						.achievements_shower_element);
				}
			}
		} else if (f_down && p.mobile_delay <= 0) {
			let found_car = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "car", 200);
			if (found_car) {
				p.car_object = found_car;
				audio_play("data/sfx/car_1.mp3", 0.25);
				achievement_do(p.achievements_element.data.achievements,
					"get a ride", p.achievements_shower_element);
				p.mobile_delay = 500;
			}
		}
		let scale = get_scale();
		let hb = p.hotbar_element.data;
		let hb_w = (hb.slot_size * 1.05) * hb.row.length;
		if (player_object.game.mobile) hb_w += (hb.slot_size * 1.05) * 3 + 20;
		let is_clicking_hotbar = p.hotbar_element.shown && doRectsCollide(
			player_object.game.input.mouse.x / scale,
			player_object.game.input.mouse.y / scale,
			0, 0, 40, 40, hb_w, hb.slot_size
		);
		let shooting = (!player_object.game.mobile && player_object.game.input
				.mouse.leftButtonPressed && !is_clicking_hotbar) ||
			(player_object.game.mobile && (player_object.game.input.joystick
				.left.dx ** 2 + player_object.game.input.joystick.left.dy **
				2 > 0.01));
		let shootDir = getShootDir(player_object.game.input);
		let targetX = shootDir.x;
		let targetY = shootDir.y;
		if (player_object.game.settings.auto_aim) {
			let nearest_enemy = game_object_find_closest(player_object.game, p
				.body.position.x, p.body.position.y, "rocket", 800);
			if (!nearest_enemy) {
				nearest_enemy = game_object_find_closest(player_object.game, p
					.body.position.x, p.body.position.y, "enemy", 800);
			}
			if (nearest_enemy) {
				let dx = nearest_enemy.data.body.position.x - p.body.position.x;
				let dy = nearest_enemy.data.body.position.y - p.body.position.y;
				let item = hotbar_get_selected_item(p.hotbar_element);
				if (item == ITEM_RED_PISTOLS || item == ITEM_RAINBOW_PISTOLS) {
					dx += p.w;
					dy += p.h;
				}
				let mag = Math.sqrt(dx * dx + dy * dy);
				if (mag > 0) {
					targetX = dx / mag * 100;
					targetY = dy / mag * 100;
				}
			}
		}
		if (shooting && !p.achievements_element.shown) {
			player_shoot(player_object, dt, null, targetX, targetY);
			if (!inventory_has_item(p.inventory_element, ITEM_AMMO) &&
				hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN)
				achievement_do(p.achievements_element.data.achievements,
					"need for ammo", p.achievements_shower_element);
		} else {
			p.laser_sound_has_played = false;
			p.sword_protection = false;
		}
		if (p.hotbar_element.shown && (isKeyDown(player_object.game.input, 'q',
				true) || isKeyDown(player_object.game.input, 'й', true)))
			inventory_drop_item(p.inventory_element, 0, p.hotbar_element.data
				.iselected);
		if (Matter.Vector.magnitude(vel) > 0)
			achievement_do(p.achievements_element.data.achievements,
				"first steps", p.achievements_shower_element);
		Matter.Body.setVelocity(p.body, vel);
	} else {
		if (player_object.game.settings.auto_pickup[
				"automatically pickup fuel"]) {
			let cl_item = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "item", 200);
			if (cl_item && cl_item.data.id == ITEM_FUEL) item_pickup(p
				.inventory_element, cl_item);
		}
		let carBody = p.car_object.data.body;
		let carData = p.car_object.data;
		let wish = getWishDir(player_object.game.input);
		player_object.game.camera_target_body = carBody;
		p.body.collisionFilter.mask = -3;
		let moveMag = 0;
		let rotatedir = 0;
		if (carData.fuel > 0) {
			if (wish.y < -0.1) {
				moveMag = carData.speed;
				rotatedir = 1;
				carData.fuel = Math.max(carData.fuel - 0.005 * dt, 0);
			} else if (wish.y > 0.1) {
				moveMag = -carData.speed * 0.5;
				rotatedir = -1;
				carData.fuel = Math.max(carData.fuel - 0.005 * dt, 0);
			}
			if (Math.abs(wish.x) > 0.1) {
				let turnFactor = (moveMag !== 0) ? rotatedir : 0.5;
				Matter.Body.rotate(carBody, turnFactor * (wish.x * 0.0018) *
					dt);
			}
		}
		if (moveMag !== 0) {
			Matter.Body.setVelocity(carBody, {
				x: moveMag * Math.cos(carBody.angle),
				y: moveMag * Math.sin(carBody.angle)
			});
		} else {
			Matter.Body.setVelocity(carBody, {
				x: carBody.velocity.x * 0.96,
				y: carBody.velocity.y * 0.96
			});
		}
		Matter.Body.setPosition(p.body, carBody.position);
		let exit_key = isKeyDown(player_object.game.input, 'а', true) ||
			isKeyDown(player_object.game.input, 'f', true) || isKeyDown(
				player_object.game.input, ' ', true);
		if (exit_key && p.mobile_delay <= 0) {
			let sideAngle = carBody.angle + Math.PI / 2;
			Matter.Body.setPosition(p.body, {
				x: carBody.position.x + 120 * Math.cos(sideAngle),
				y: carBody.position.y + 120 * Math.sin(sideAngle)
			});
			p.car_object = null;
			p.mobile_delay = 500;
		}
	}
}

function player_draw(player_object, ctx) {
	let p = player_object.data;
	if (p.immunity % 350 > 175)
		return;
	if (!p.car_object) {
		fillMatterBody(ctx, p.body, player_object.game.settings.player_color);
		drawMatterBody(ctx, p.body, "white");
		if (player_object.game.settings.indicators["show player health"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 *
				p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "lime";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 *
				p.h, p.w * Math.max(p.health, 0) / p.max_health, p.h * 0.05);
		}
		if (player_object.game.settings.indicators["show player thirst"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 *
				p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "cyan";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 *
				p.h, p.w * p.thirst / p.max_thirst, p.h * 0.05);
		}
		if (player_object.game.settings.indicators["show player hunger"]) {
			ctx.fillStyle = "red";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 *
				p.h, p.w, p.h * 0.05);
			ctx.fillStyle = "orange";
			ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 *
				p.h, p.w * p.hunger / p.max_hunger, p.h * 0.05);
		}
		if (p.shooting_laser) {
			let r = Math.cos(0.1 * p.item_animstate) * 15;
			let g = 0.7 * (Math.cos(0.1 * p.item_animstate) + Math.sin(0.1 * p
				.item_animstate)) * 15;
			let b = Math.sin(0.1 * p.item_animstate) * 15;
			r = Math.floor(r * r);
			g = Math.floor(g * g);
			b = Math.floor(b * b);
			let color = "#" + (r).toString(16).padStart(2, '0') + (g).toString(
				16).padStart(2, '0') + (b).toString(16).padStart(2, '0');
			const drawLaserLine = (width, strokeCol) => {
				ctx.beginPath();
				ctx.lineWidth = width;
				ctx.strokeStyle = strokeCol;
				let gx = p.w * 60 * Math.cos(p.laser_direction);
				let gy = p.w * 60 * Math.sin(p.laser_direction);
				let gLen = Math.sqrt(gx * gx + gy * gy) || 1;
				let px = p.body.position.x + 1.7 * p.w * (gx / gLen);
				let py = p.body.position.y + 1.7 * p.w * (gy / gLen);
				ctx.moveTo(px, py);
				ctx.lineTo(px + gx, py + gy);
				ctx.stroke();
			};
			drawLaserLine(p.w * 0.65, color);
			drawLaserLine(p.w * 0.45, "white");
			p.shooting_laser = false;
		}
		let selected_item = hotbar_get_selected_item(p.hotbar_element);
		if (player_object.game.settings.player_draw_gun && ITEMS_GUNS.includes(
				selected_item)) {
			let px = p.body.position.x - 0.45 * p.w;
			let py = p.body.position.y - 0.45 * p.h;
			let mx = 1,
				my = 0,
				cx = 0,
				cy = 0;
			if (p.ai_controlled) {
				let target = game_object_find_closest(player_object.game, p.body
					.position.x, p.body.position.y, "enemy", 1000);
				mx = target ? target.data.body.position.x : p.body.position.x +
					1;
				my = target ? target.data.body.position.y : p.body.position.y;
				cx = p.body.position.x;
				cy = p.body.position.y;
			} else if (player_object.game.mobile) {
				mx = player_object.game.input.joystick.left.dx || player_object
					.game.input.joystick.right.dx || -1;
				my = player_object.game.input.joystick.left.dy || player_object
					.game.input.joystick.right.dy || 1;
				cx = 0;
				cy = 0;
			} else {
				mx = player_object.game.input.mouse.x;
				my = player_object.game.input.mouse.y;
				cx = 0.5 * ctx.canvas.width;
				cy = 0.5 * ctx.canvas.height;
			}
			let gx = mx - cx;
			let gy = my - cy;
			let dist = Math.sqrt(gx * gx + gy * gy) || 1;
			ctx.strokeStyle = "black";
			let lw = 0.25 * p.w;
			let gl = 0.8;
			if (selected_item == ITEM_DESERT_EAGLE) {
				ctx.strokeStyle = "#888888"; 
			}
			if (selected_item == ITEM_GREEN_GUN) {
				ctx.strokeStyle = "#117733";
				gl = 1.6;
			}
			if (selected_item == ITEM_LASER_GUN) {
				ctx.strokeStyle = "purple";
				lw *= 2.0;
				gl = 1.8;
				px = p.body.position.x;
				py = p.body.position.y;
			}
			if (selected_item == ITEM_SHOTGUN || selected_item ==
				ITEM_ROCKET_SHOTGUN || selected_item == ITEM_RED_SHOTGUN ||
				selected_item == ITEM_MINIGUN) {
				lw *= 1.25;
				gl = 1.3;
				if (selected_item == ITEM_SHOTGUN) ctx.strokeStyle = "#773311";
				if (selected_item == ITEM_ROCKET_SHOTGUN) ctx.strokeStyle =
					"#111133";
				if (selected_item == ITEM_RED_SHOTGUN) ctx.strokeStyle =
					"#551111";
				if (selected_item == ITEM_MINIGUN) {
					ctx.strokeStyle = "#113377";
					gl = 1.5;
					lw *= 1.125;
				}
			}
			if (selected_item == ITEM_JUNK_CANNON) {
				ctx.strokeStyle = "#444444";
				lw *= 2.8;
				gl = 1.6;
			}
			if (selected_item == ITEM_PLASMA_LAUNCHER || selected_item ==
				ITEM_ROCKET_LAUNCHER) {
				ctx.strokeStyle = (selected_item == ITEM_PLASMA_LAUNCHER) ?
					"#331133" : "#111133";
				lw *= 2.25;
				gl = 1.3;
			}
			if (selected_item == ITEM_PLASMA_PISTOL) ctx.strokeStyle =
				"#331133";
			if (selected_item == ITEM_RED_PISTOLS || selected_item ==
				ITEM_RAINBOW_PISTOLS) {
				let hue = (p.item_animstate * 24) % 360;
				ctx.strokeStyle = (selected_item == ITEM_RED_PISTOLS) ?
					"#551111" : `hsl(${hue}, 80%, 50%)`;
				let p2x = p.body.position.x + 0.55 * p.w;
				let p2y = p.body.position.y - 0.45 * p.h;
				ctx.beginPath();
				ctx.lineWidth = lw;
				ctx.moveTo(p2x, p2y);
				ctx.lineTo(p2x + gl * p.w * gx / dist, p2y + gl * p.h * gy /
					dist);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.lineWidth = lw;
			ctx.moveTo(px, py);
			ctx.lineTo(px + gl * p.w * gx / dist, py + gl * p.h * gy / dist);
			ctx.stroke();
			if (selected_item == ITEM_JUNK_CANNON) {
				ctx.strokeStyle = "#0033aa";
				ctx.lineWidth = lw * 1.1;
				let tapePos = 0.4;
				ctx.beginPath();
				ctx.moveTo(px + (gl * tapePos * p.w) * gx / dist, py + (gl *
					tapePos * p.h) * gy / dist);
				ctx.lineTo(px + (gl * (tapePos + 0.1) * p.w) * gx / dist, py + (
					gl * (tapePos + 0.1) * p.h) * gy / dist);
				ctx.stroke();
				ctx.strokeStyle = "#333333";
				ctx.lineWidth = lw * 1.3;
				ctx.beginPath();
				ctx.moveTo(px + (gl * 0.95 * p.w) * gx / dist, py + (gl * 0.95 *
					p.h) * gy / dist);
				ctx.lineTo(px + (gl * 1.05 * p.w) * gx / dist, py + (gl * 1.05 *
					p.h) * gy / dist);
				ctx.stroke();
			}
			ctx.lineWidth = 2;
		} else if (p.sword_visible) {
			let px = p.body.position.x - p.w * 0.45;
			let py = p.body.position.y - p.h * 0.45;
			let sword_length = 100;
			let col = (hotbar_get_selected_item(p.hotbar_element) ==
				ITEM_HORN) ? "brown" : "#55aa11";
			ctx.beginPath();
			ctx.strokeStyle = col;
			ctx.lineWidth = 0.25 * p.w;
			ctx.moveTo(px, py);
			ctx.lineTo(px + Math.cos(p.sword_direction) * sword_length, py +
				Math.sin(p.sword_direction) * sword_length);
			ctx.stroke();
			if (hotbar_get_selected_item(p.hotbar_element) == ITEM_HORN) {
				let dx = Math.cos(p.sword_direction) * sword_length;
				let dy = Math.sin(p.sword_direction) * sword_length;
				drawLine(ctx, px + 0.4 * dx, py + 0.4 * dy, px + 0.95 * dx -
					0.25 * dy, py + 0.95 * dy + 0.25 * dx, "brown", p.w *
					0.2);
				drawLine(ctx, px + 0.3 * dx, py + 0.3 * dy, px + 0.85 * dx +
					0.25 * dy, py + 0.85 * dy - 0.25 * dx, "brown", p.w *
					0.2);
			}
			p.sword_visible = false;
		} else if (selected_item > 0) {
			let px = p.body.position.x - 0.25 * p.w,
				py = p.body.position.y - 0.25 * p.h;
			item_icon_draw(ctx, selected_item, px, py, 0.5 * p.w, 0.5 * p.h, p
				.item_animstate);
		}
		const drawShield = (health, maxHealth, fill, stroke) => {
			if (health <= 0) return;
			ctx.fillStyle = "gray";
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position
				.y - 1.85 * p.h, 2.5 * p.w, p.h * 0.05);
			ctx.fillStyle = fill;
			ctx.fillRect(p.body.position.x - 2.5 * p.w / 2, p.body.position
				.y - 1.85 * p.h, 2.5 * p.w * health / maxHealth, p.h *
				0.05);
			ctx.globalAlpha = 0.25;
			drawCircle(ctx, p.body.position.x, p.body.position.y, 62.5,
				fill, stroke, 0.05 * p.w);
			ctx.globalAlpha = 1.0;
		};
		drawShield(p.shield_blue_health, p.shield_blue_health_max, "#115577",
			"#113377");
		drawShield(p.shield_green_health, p.shield_green_health_max, "lime",
			"#117733");
		if (p.shield_rainbow_health > 0) {
			let r = Math.floor(Math.pow(Math.cos(0.1 * p.item_animstate) * 15,
				2));
			let g = Math.floor(Math.pow(0.7 * (Math.cos(0.1 * p
				.item_animstate) + Math.sin(0.1 * p
				.item_animstate)) * 15, 2));
			let b = Math.floor(Math.pow(Math.sin(0.1 * p.item_animstate) * 15,
				2));
			let color = "#" + r.toString(16).padStart(2, '0') + g.toString(16)
				.padStart(2, '0') + b.toString(16).padStart(2, '0');
			drawShield(p.shield_rainbow_health, p.shield_rainbow_health_max,
				color, "white");
		}
	}
}

function player_shoot(player_object, dt, target_body = null, shoot_dir_x = null,
	shoot_dir_y = null) {
	if (player_object.data.immunity > 0)
		return;
	let base_damage = 0.5;
	let p = player_object.data;
	let sx = 0;
	let sy = 0;
	let tx = 1;
	let ty = 1;
	let enable_audio = !p.ai_controlled;
	if (!p.ai_controlled) {
		sx = 0.5 * window.innerWidth;
		sy = 0.5 * window.innerHeight;
		tx = player_object.game.input.mouse.x
		ty = player_object.game.input.mouse.y
		if (shoot_dir_x)
			tx = shoot_dir_x + sx;
		if (shoot_dir_y)
			ty = shoot_dir_y + sy;
	}
	if (target_body) {
		sx = p.body.position.x;
		sy = p.body.position.y;
		tx = target_body.position.x;
		ty = target_body.position.y;
		tx = (tx - sx) * 10 + sx;
		ty = (ty - sy) * 10 + sy;
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_LASER_GUN &&
		true &&
		inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
		if (!p.laser_sound_has_played) {
			audio_play("data/sfx/beam_of_laser_fires_1.mp3", 0.25);
			p.laser_sound_has_played = true;
		}
		p.laser_direction = Math.atan2(ty - sy, tx - sx);
		p.shooting_laser = true;
		let g = player_object.game;
		for (let i = 0; i < g.objects.length; i++) {
			let obj = g.objects[i];
			if (!obj.destroyed && (obj.name == "animal" || obj.name == "enemy" || obj.name == "trashcan" || obj.name == "car" && !obj.data.is_tank || obj
					.name == "rocket")) {
				if (player_laser_hits_point(player_object, obj.data.body
						.position.x, obj.data.body.position.y, 1.5 * p.w, 60 * p
						.w, p.laser_direction)) {
					obj.data.health -= 15625 * dt;
					obj.data.hit_by_player = true;
				}
			}
		}
		if (Math.random() < 0.00005 * dt)
			inventory_clear_item(p.inventory_element, ITEM_RAINBOW_AMMO, 1);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_JUNK_CANNON && p
		.shot_cooldown <= 0) {
		let junk_id = -1;
		for (let i = 0; i < ITEMS_JUNK.length; i++) {
			if (inventory_has_item(p.inventory_element, ITEMS_JUNK[i])) {
				junk_id = ITEMS_JUNK[i];
				break;
			}
		}
		if (junk_id != -1) {
			let theta = Math.atan2(ty - sy, tx - sx);
			let angles = [0, Math.PI / 8, -Math.PI / 8];
			let offset = p.w * 1.5;
			angles.forEach(angleOffset => {
				let finalAngle = theta + angleOffset;
				let dx = Math.cos(finalAngle);
				let dy = Math.sin(finalAngle);
				let spawnX = p.body.position.x + Math.cos(theta) *
					offset;
				let spawnY = p.body.position.y + Math.sin(theta) *
					offset;
				trash_bullet_create(
					player_object.game,
					spawnX,
					spawnY,
					dx,
					dy,
					25,
					150 * 15625 * base_damage * (1 + Math.random()),
					false,
					45
				);
			});
			p.shot_cooldown = 250;
			if (Math.random() < 0.25) {
				inventory_clear_item(p.inventory_element, junk_id, 1);
			}
			if (enable_audio) {
				audio_play("data/sfx/shotgun_1.mp3", 0.5);
			}
		}
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_AMMO)) {
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
		if (Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		if (enable_audio)
			audio_play("data/sfx/gunshot_1.mp3", 0.25);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_PLASMA_PISTOL &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_PLASMA)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			tx - sx,
			ty - sy,
			20,
			(25 + 25 * Math.random()) * base_damage,
			false,
			6,
			1500,
			"cyan",
			"blue"
		);
		p.shot_cooldown = 200;
		if (Math.random() > 0.995)
			inventory_clear_item(p.inventory_element, ITEM_PLASMA, 1);
		if (enable_audio)
			audio_play("data/sfx/red_pistols_1.mp3", 0.25);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_SHOTGUN &&
		true &&
		p.shotgun_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		for (let i = 0; i < Math.random() * 7 + 7; i++)
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
		if (Math.random() > 0.985)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		if (enable_audio)
			audio_play("data/sfx/shotgun_1.mp3", 0.25);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_MINIGUN &&
		true &&
		p.minigun_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			(0.95 + 0.1 * Math.random()) * tx - sx,
			(0.95 + 0.1 * Math.random()) * ty - sy,
			Math.random() * 10 + 10,
			0.66 * 10 * base_damage * Math.random()
		);
		p.minigun_cooldown = 60;
		if (Math.random() > 0.995)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		if (enable_audio)
			audio_play("data/sfx/gunshot_1.mp3", 0.25);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_PLASMA_LAUNCHER &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_PLASMA)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			tx - sx,
			ty - sy,
			17.5,
			4.25 * 25 * base_damage * (0.25 + 2 * 0.75 * Math.random()),
			false,
			12.5,
			1500,
			"cyan",
			"blue"
		);
		p.shot_cooldown = 400;
		if (Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_PLASMA, 1);
		if (enable_audio)
			audio_play("data/sfx/plasmagun_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_PISTOLS &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		bullet_create(
			player_object.game,
			p.body.position.x + p.w * Math.cos(theta - Math.PI / 4),
			p.body.position.y + p.w * Math.sin(theta - Math.PI / 4),
			tx - sx,
			ty - sy,
			30,
			1.5 * 125 * base_damage * 2.5 * Math.random(),
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
			1.5 * 125 * base_damage * 2.5 * Math.random(),
			false,
			6,
			1500,
			"pink",
			"red"
		);
		p.shot_cooldown = 100;
		if (Math.random() > 0.999)
			inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
		audio_play("data/sfx/red_pistols_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_ROCKET_SHOTGUN &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		N = Math.floor(Math.random() * 4 + 3);
		for (let i = 0; i <= N; i++)
			rocket_create(
				player_object.game,
				p.body.position.x + 2 * p.w * Math.cos(theta - (0.5 * N - i) *
					Math.PI / N),
				p.body.position.y + 2 * p.w * Math.sin(theta - (0.5 * N - i) *
					Math.PI / N),
				tx - sx,
				ty - sy,
				6,
				null,
				0.11 * 3125 * base_damage * (0.1 + 0.9 * Math.random()),
				p.max_health,
				false,
				20,
				1500
			);
		p.shot_cooldown = 500;
		if (Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
		if (enable_audio)
			audio_play("data/sfx/rocketlauncher_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_RED_SHOTGUN &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
		let theta = Math.atan2(ty - sy, tx - sx);
		N = Math.floor(Math.random() * 7 + 5);
		for (let i = 0; i <= N; i++)
			bullet_create(
				player_object.game,
				p.body.position.x + 2 * p.w * Math.cos(theta - (0.5 * N - i) *
					Math.PI / N),
				p.body.position.y + 2 * p.w * Math.sin(theta - (0.5 * N - i) *
					Math.PI / N),
				tx - sx,
				ty - sy,
				30,
				4.0 * 125 * base_damage * (0.75 + 0.25 * Math.random()),
				false,
				6,
				1500,
				"pink",
				"red"
			);
		p.shot_cooldown = 500;
		if (Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
		if (enable_audio)
			audio_play("data/sfx/red_pistols_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_DESERT_EAGLE &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_AMMO)) {
		bullet_create(
			player_object.game,
			p.body.position.x,
			p.body.position.y,
			tx - sx,
			ty - sy,
			32, 
			55 * base_damage 
		);
		p.shot_cooldown = 600; 
		
		if (Math.random() > 0.90)
			inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		if (enable_audio)
			audio_play("data/sfx/shotgun_1.mp3", 0.35);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_SWORD && true) {
		if (Math.cos(p.sword_direction) < -0.985)
			audio_play("data/sfx/sword_1.mp3");
		if (tx > sx)
			p.sword_direction += 0.02 * dt
		else
			p.sword_direction -= 0.02 * dt
		p.sword_direction = p.sword_direction % (2 * Math.PI);
		let closest_target = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "enemy", 200);
		if (!closest_target)
			closest_target = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "animal", 200);
		if (!closest_target)
			closest_target = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "car", 300);
		if (!closest_target)
		    closest_target = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "trashcan", 200);
		if (closest_target && closest_target.name == "car" && closest_target
			.data.is_tank)
			closest_target = null;
		if (closest_target) {
			target_direction = Math.atan2(closest_target.data.body.position.y -
				p.body.position.y, closest_target.data.body.position.x - p
				.body.position.x);
			if (Math.abs(target_direction - p.sword_direction) % (2 * Math.PI) <
				Math.PI / 8) {
				closest_target.data.health -= (Math.random() * 3000 + 2000) *
					dt;
				if (closest_target.name == "enemy")
					closest_target.data.hit_by_player = true;
			}
		}
		let closest_bullet = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "bullet", 200);
		if (closest_bullet) {
			let vx = closest_bullet.data.body.position.x - player_object.data
				.body.position.x;
			let vy = closest_bullet.data.body.position.y - player_object.data
				.body.position.y;
			let v = Math.sqrt(vx * vx + vy * vy);
			Matter.Body.setVelocity(closest_bullet.data.body, {
				x: 5 * vx / v,
				y: 5 * vy / v
			});
		}
		let closest_rocket = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "rocket", 200);
		if (closest_rocket) {
			rocket_direction = Math.atan2(closest_rocket.data.body.position.y -
				p.body.position.y, closest_rocket.data.body.position.x - p
				.body.position.x);
			if (Math.abs(rocket_direction - p.sword_direction) % (2 * Math.PI) <
				Math.PI / 8) {
				closest_rocket.data.health -= (Math.random() * 1500 + 500) * dt;
				closest_rocket.data.hit_by_player = true;
			}
		}
		p.sword_visible = true;
		p.sword_protection = true;
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_HORN && true) {
		if (Math.cos(p.sword_direction) < -0.955)
			audio_play("data/sfx/sword_1.mp3");
		if (tx > sx)
			p.sword_direction += 0.04 * dt
		else
			p.sword_direction -= 0.04 * dt
		p.sword_direction = p.sword_direction % (2 * Math.PI);
		let closest_target = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "enemy", 200);
		if (!closest_target)
			closest_target = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "animal", 200);
		if (!closest_target)
			closest_target = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "car", 300);
		if (!closest_target)
		    closest_target = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "trashcan", 200);
		if (closest_target && closest_target.name == "car" && closest_target
			.data.is_tank)
			closest_target = null;
		if (closest_target) {
			target_direction = Math.atan2(closest_target.data.body.position.y -
				p.body.position.y, closest_target.data.body.position.x - p
				.body.position.x);
			if (Math.abs(target_direction - p.sword_direction) % (2 * Math.PI) <
				Math.PI / 4) {
				closest_target.data.health -= (Math.random() * 300000 +
					200000) * dt;
				if (closest_target.name == "enemy")
					closest_target.data.hit_by_player = true;
			}
		}
		let closest_bullet = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "bullet", 200);
		if (closest_bullet) {
			let vx = closest_bullet.data.body.position.x - player_object.data
				.body.position.x;
			let vy = closest_bullet.data.body.position.y - player_object.data
				.body.position.y;
			let v = Math.sqrt(vx * vx + vy * vy);
			Matter.Body.setVelocity(closest_bullet.data.body, {
				x: 5 * vx / v,
				y: 5 * vy / v
			});
		}
		let closest_rocket = game_object_find_closest(player_object.game, p.body
			.position.x, p.body.position.y, "rocket", 200);
		if (closest_rocket) {
			rocket_direction = Math.atan2(closest_rocket.data.body.position.y -
				p.body.position.y, closest_rocket.data.body.position.x - p
				.body.position.x);
			if (Math.abs(rocket_direction - p.sword_direction) % (2 * Math.PI) <
				Math.PI / 8) {
				closest_rocket.data.health -= (Math.random() * 15000 + 5000) *
					dt;
				closest_rocket.data.hit_by_player = true;
			}
		}
		p.sword_visible = true;
		p.sword_protection = true;
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_GREEN_GUN &&
		true &&
		p.minigun_cooldown <= 0) {
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
		p.minigun_cooldown = 90;
		p.health -= 0.0255 * dt
		p.hunger -= 0.0125 * dt
		p.thirst -= 0.0125 * dt
		audio_play("data/sfx/red_pistols_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_ROCKET_LAUNCHER &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
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
		if (Math.random() > 0.99)
			inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
		audio_play("data/sfx/rocketlauncher_1.mp3", 0.125);
	}
	if (hotbar_get_selected_item(p.hotbar_element) == ITEM_RAINBOW_PISTOLS &&
		true &&
		p.shot_cooldown <= 0 &&
		inventory_has_item_from_list(p.inventory_element, [ITEM_AMMO,
			ITEM_RED_PLASMA, ITEM_PLASMA, ITEM_RAINBOW_AMMO, ITEM_ROCKET
		]) > -1) {
		let theta = Math.atan2(ty - sy, tx - sx);
		let colors = ["red", "orange", "yellow", "lime", "cyan", "blue",
			"purple"
		];
		let color1 = null;
		let color2 = null;
		p.gradient += 0.01 * dt;
		let shot_sound = "red_pistols_1";
		if (inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
			color1 = colors[Math.floor(p.gradient) % 7];
			color2 = "white";
			if (Math.random() > 0.999)
				inventory_clear_item(p.inventory_element, ITEM_RAINBOW_AMMO, 1);
		} else if (inventory_has_item(p.inventory_element, ITEM_RED_PLASMA)) {
			color1 = "red";
			color2 = "pink";
			if (Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_RED_PLASMA, 1);
		} else if (inventory_has_item(p.inventory_element, ITEM_PLASMA)) {
			color1 = "cyan";
			color2 = "blue";
			if (Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_PLASMA, 1);
		} else if (inventory_has_item(p.inventory_element, ITEM_AMMO)) {
			color1 = "yellow";
			color2 = "orange";
			if (Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
			shot_sound = "gunshot_1"
		}
		if (!inventory_has_item(p.inventory_element, ITEM_ROCKET) ||
			inventory_has_item(p.inventory_element, ITEM_RAINBOW_AMMO)) {
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
			audio_play("data/sfx/" + shot_sound + ".mp3", 0.25);
		} else if (inventory_has_item(p.inventory_element, ITEM_ROCKET)) {
			rocket_create(
				player_object.game,
				p.body.position.x + Math.cos(theta - Math.PI / 4) * p.w *
				1.75,
				p.body.position.y + Math.sin(theta - Math.PI / 4) * p.h *
				1.75,
				tx - sx,
				ty - sy,
				0.15 * p.w,
				null,
				0.5 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				p.max_health,
				false,
				20
			);
			rocket_create(
				player_object.game,
				p.body.position.x + Math.cos(theta + Math.PI / 4) * p.w *
				1.75,
				p.body.position.y + Math.sin(theta + Math.PI / 4) * p.h *
				1.75,
				tx - sx,
				ty - sy,
				0.15 * p.w,
				null,
				0.5 * 15625 * base_damage * (0.25 + 1.5 * Math.random()),
				p.max_health,
				false,
				20
			);
			if (Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_ROCKET, 1);
			audio_play("data/sfx/rocketlauncher_1.mp3", 0.125);
		}
		p.shot_cooldown = 100;
	}
}

function player_item_consume(player_object, id, anywhere = false) {
	let p = player_object.data;
	let item_i = -1;
	let item_j = -1;
	if (!anywhere && p.hotbar_element.shown) {
		item_i = 0;
		item_j = player_object.data.hotbar_element.data.iselected;
	}
	if (!anywhere && p.inventory_element.shown) {
		item_i = p.inventory_element.data.imove;
		item_j = p.inventory_element.data.jmove;
	}
	if (id == ITEM_FUEL && true) {
		let c = game_object_find_closest(player_object.game, p.body.position.x,
			p.body.position.y, "car", 200);
		if (c) {
			c.data.fuel += Math.min(c.data.max_fuel - c.data.fuel, c.data
				.max_fuel * (Math.random() * 0.1 + 0.1));
			c.data.health += Math.min(c.data.max_health - c.data.health, c.data
				.max_health * (Math.random() * 0.1 + 0.1));
			inventory_clear_item(player_object.data.inventory_element, id, 1,
				item_i, item_j);
			achievement_do(p.achievements_element.data.achievements, "fuel up",
				p.achievements_shower_element);
		}
	}
	if (id == ITEM_BOSSIFIER && true) {
		let eo = null;
		let ao = game_object_find_closest(player_object.game, p.body.position.x,
			p.body.position.y, "animal", 500);
		if (ao) {
			enemy_create(ao.game, ao.data.body.position.x, ao.data.body.position
				.y, true, false, ao.data.type);
			animal_destroy(ao, false);
			inventory_clear_item(player_object.data.inventory_element, id, 1,
				item_i, item_j);
		} else {
			eo = game_object_find_closest(player_object.game, p.body.position.x,
				p.body.position.y, "enemy", 500);
		}
		if (eo) {
			enemy_create(eo.game, eo.data.body.position.x, eo.data.body.position
				.y, true, false, eo.data.type);
			enemy_destroy(eo);
			inventory_clear_item(player_object.data.inventory_element, id, 1,
				item_i, item_j);
		}
	}
	if (id == ITEM_SHIELD && true) {
		p.shield_blue_health = p.shield_blue_health_max;
		p.shield_green_health = 0;
		p.shield_rainbow_health = 0;
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/shield_1.mp3");
	}
	if (id == ITEM_SHIELD_GREEN && true) {
		p.shield_blue_health = 0;
		p.shield_green_health = p.shield_green_health_max;
		p.shield_rainbow_health = 0;
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/shield_1.mp3");
	}
	if (id == ITEM_SHIELD_RAINBOW && true) {
		p.shield_blue_health = 0;
		p.shield_green_health = 0;
		p.shield_rainbow_health = p.shield_rainbow_health_max;
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/shield_1.mp3");
	}
	if (id == ITEM_HEALTH && true) {
		achievement_do(p.achievements_element.data.achievements,
			"healthy lifestyle", p.achievements_shower_element);
		p.health += Math.min(p.max_health - p.health, (Math.random() * 0.125 +
			0.125) * p.max_health);
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/healing_1.mp3");
	}
	if (id == ITEM_HEALTH_GREEN && true) {
		p.health = Math.min(p.max_health, p.health + p.max_health * (Math
			.random() * 0.125 + 0.375));
		p.hunger = Math.min(p.max_hunger, p.hunger + p.max_hunger * (Math
			.random() * 0.125 + 0.375));
		p.thirst = Math.min(p.max_thirst, p.thirst + p.max_thirst * (Math
			.random() * 0.125 + 0.375));
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/healing_1.mp3");
	}
	if (ITEMS_DRINKS.includes(id) && true) {
		achievement_do(p.achievements_element.data.achievements,
			"stay hydrated", p.achievements_shower_element);
		p.thirst += Math.min(p.max_thirst - p.thirst, (Math.random() * 0.125 +
			0.125) * p.max_thirst);
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/water_1.mp3");
	}
	if (ITEMS_FOODS.includes(id) && true) {
		achievement_do(p.achievements_element.data.achievements, "yummy", p
			.achievements_shower_element);
		p.hunger += Math.min(p.max_hunger - p.hunger, (Math.random() * 0.125 +
			0.125) * p.max_hunger);
		p.thirst += Math.min(p.max_thirst - p.thirst, (Math.random() * 0.03125 +
			0.03125) * p.max_thirst);
		inventory_clear_item(player_object.data.inventory_element, id, 1,
			item_i, item_j);
		audio_play("data/sfx/eating_1.mp3");
	}
}

function player_laser_hits_point(player_object, x, y, w, l, alpha) {
	let px = player_object.data.body.position.x;
	let py = player_object.data.body.position.y;
	x = x - px;
	y = y - py;
	let X = x * Math.cos(alpha) + y * Math.sin(alpha);
	let Y = -x * Math.sin(alpha) + y * Math.cos(alpha);
	return Math.pow(Math.abs(X / l - 1), 4) + Math.pow(Math.abs(Y / w), 4) < 1;
}

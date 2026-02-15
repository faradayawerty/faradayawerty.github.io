let DEBUG_PLAYER = false;

function player_create(g, x, y, respawn = false, ai_controlled = false) {
	let width = 60,
		height = 60;
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
		shield_blue_health_max: 250,
		shield_green_health: 0,
		shield_green_health_max: 500,
		shield_rainbow_health: 0,
		shield_rainbow_health_max: 1000,
		shield_shadow_health: 0,
		shield_shadow_health_max: 500,
		shield_anubis_health: 0,
		shield_anubis_health_max: 1000,
		shadow_jump_lock: false,
		shadow_jump_delay: 0,
		shadow_jump_time: 0,
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
		last_melee_angle_sound: 0,
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
	g.player_object = g.objects[iplayer];
	if (respawn) {
		p.health = 0.15 * p.max_health;
		p.hunger = 0.35 * p.max_hunger;
		p.thirst = 0.55 * p.max_thirst;
	}
	p.inventory_element.data.attached_to_object = g.objects[iplayer];
	p.hotbar_element.data.attached_to_object = g.objects[iplayer];
	p.story_note_element = g.gui_elements[story_note_create(g)];
	p.story_note_element.shown = false;
	return iplayer;
}

function player_destroy(player_object) {
	if (player_object.destroyed)
		return;
	let p = player_object.data;
	let g = player_object.game;
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
	let g = player_object.game;
	let p = player_object.data;
	console.log(p.hunger);
	if (p.hunger <= 0 && p.thirst <= 0) {
		DEATH_MESSAGE = "☠️ the player couldn't find anything to eat or drink";
		if (g.settings.language === "русский")
			DEATH_MESSAGE = "☠️ игрок не смог найти питьё и пропитание";
	}
	else if (p.hunger <= 0) {
		DEATH_MESSAGE = "☠️ the player starved to death";
		if (g.settings.language === "русский")
			DEATH_MESSAGE = "☠️ игрок погиб от голода";
	}
	else if (p.thirst <= 0) {
		DEATH_MESSAGE = "☠️ the player died of thirst";
		if (g.settings.language === "русский")
			DEATH_MESSAGE = "☠️ игрок умер от жажды";
	}
	player_object.game.input.mouse.leftButtonPressed = false;
	player_object.game.deaths += 1;
	if (player_object.data.ai_controlled || player_object.game.settings
		.lose_items_on_death) {
		inventory_drop_all_items(player_object.data.inventory_element);
	}
	else {
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
	if (p.shield_blue_health > 0) p.shield_blue_health -= 0.003 * dt;
	if (p.shield_green_health > 0) p.shield_green_health -= 0.003 * dt;
	if (p.shield_shadow_health > 0) p.shield_shadow_health -= 0.003 * dt;
	if (p.shield_rainbow_health > 0) p.shield_rainbow_health -= 0.003 * dt;
	if (p.shield_anubis_health > 0) p.shield_anubis_health -= 0.003 * dt;
	if (DEBUG_PLAYER && p.saved_health - p.health > 1) {
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
	if (player_object.game.godmode || p.shield_anubis_health > 0) {
		p.health = p.max_health;
		p.hunger = p.max_hunger;
		p.thirst = p.max_thirst;
	}
	let can_lose_hunger_or_thirst = false;
	if (achievement_get(p.achievements_element.data.achievements,
			"stay hydrated").done ||
		achievement_get(p.achievements_element.data.achievements, "yummy")
		.done ||
		achievement_get(p.achievements_element.data.achievements,
			"shoot 'em up").done)
		can_lose_hunger_or_thirst = true;
	if (p.thirst > 0 && !(p.achievements_element.shown && p.thirst < 0.33 * p
			.max_thirst) && !(p.story_note_element.shown && p.thirst < 0.33 * p
			.max_thirst) && !(p.inventory_element.shown && p.thirst < 0.33 * p
			.max_thirst) && !p.car_object && can_lose_hunger_or_thirst) {
		if (p.shield_green_health > 0)
			p.thirst = Math.max(0, p.thirst - 0.0005 * dt);
		else if (p.shield_rainbow_health > 0)
			p.thirst = Math.max(0, p.thirst - 0.00000025 * dt);
		else
			p.thirst = Math.max(0, p.thirst - 0.001 * dt);
	}
	if (p.thirst <= 0) p.health -= 0.01 * dt;
	if (p.hunger > 0 && !(p.story_note_element.shown && p.thirst < 0.33 * p
			.max_hunger) && !(p.achievements_element.shown && p.hunger < 0.11 *
			p
			.max_hunger) && !(p.inventory_element.shown && p.hunger < 0.11 * p
			.max_hunger) && !p.car_object && can_lose_hunger_or_thirst) {
		if (p.shield_green_health > 0)
			p.hunger = Math.max(0, p.hunger - 0.0005 * dt);
		else if (p.shield_rainbow_health > 0)
			p.hunger = Math.max(0, p.hunger - 0.00000025 * dt);
		else
			p.hunger = Math.max(0, p.hunger - 0.001 * dt);
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
	if (p.inventory_element.shown)
		p.achievements_element.shown = false;
	if (!p.inventory_element.shown) {
		p.inventory_element.data.imove = -1;
		p.inventory_element.data.jmove = -1;
	}
	if (p.inventory_element.shown || p.achievements_element.shown) {
		p.hotbar_element.shown = false;
		p.achievements_shower_element.shown = false;
		p.story_note_element.shown = false;
	}
	else {
		p.achievements_shower_element.shown = true;
	}
	if (!p.inventory_element.shown && !p.hotbar_element.shown && !p
		.achievements_element.shown) {
		p.hotbar_element.shown = true;
		p.achievements_shower_element.shown = true;
	}
	if (player_object.game.want_hide_inventory) {
		p.story_note_element.shown = false;
		p.inventory_element.shown = false;
		p.hotbar_element.shown = true;
		p.achievements_element.shown = false;
		player_object.game.want_hide_inventory = false;
	}
	SHOW_MOBILE_BUTTONS = true;
	if (p.inventory_element.shown || p.achievements_element.shown)
		SHOW_MOBILE_BUTTONS = false;
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
	if (use_triggered && !p.story_note_element.shown) {
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
		let wd = getWishDir(player_object.game.input);
		if (wd.x * wd.x + wd.y * wd.y > 0) {
			p.shadow_jump_lock = false;
		}
		let vel = Matter.Vector.mult(wd, p.speed);
		p.shadow_jump_time -= dt;
		if (p.shield_shadow_health > 0 && !(p.shadow_jump_delay > 0) && vel.x *
			vel.x + vel.y * vel.y > 0) {
			vel.x *= 5;
			vel.y *= 5;
			p.shadow_jump_delay = 1000;
			p.shadow_jump_time = 200;
		}
		else if (vel.x * vel.x + vel.y * vel.y === 0) {
			p.shadow_jump_delay -= dt;
		}
		else {
			if (p.shadow_jump_delay - dt > 0)
				p.shadow_jump_delay -= dt;
		}
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
					(ITEMS_BOSSIFIERS.includes(id) &&
						player_object.game.settings.auto_pickup[
							"automatically pickup bossifiers"]) ||
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
					if (ITEMS_GUNS.concat(ITEMS_MELEE).includes(id))
						achievement_do(p
							.achievements_element
							.data.achievements, "get a gun", p
							.achievements_shower_element);
					if (ITEMS_BOSSIFIERS.includes(id)) achievement_do(p
						.achievements_element
						.data.achievements, "bossifier", p
						.achievements_shower_element);
				}
			}
		}
		else if (f_down && p.mobile_delay <= 0) {
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
		if (p.auto_weapon_timer > 0) p.auto_weapon_timer -= dt;
		else p.last_auto_weapon = 0;
		let shooting = (!player_object.game.mobile && (player_object.game.input
				.mouse.leftButtonPressed || isKeyDown(player_object.game
					.input, 'е', false) || isKeyDown(player_object.game
					.input, 't', false)) && !is_clicking_hotbar) ||
			(player_object.game.mobile && (player_object.game.input.joystick
				.left.dx ** 2 + player_object.game.input.joystick.left.dy **
				2 > 0.01));
		let shootDir = getShootDir(player_object.game.input);
		let targetX = shootDir.x;
		let targetY = shootDir.y;
		if (player_object.game.settings.auto_aim || isKeyDown(player_object.game
				.input, 'е', false) || isKeyDown(player_object.game.input, 't',
				false)) {
			let nearest_enemy = game_object_find_closest(
				player_object.game,
				p.body.position.x,
				p.body.position.y,
				"rocket",
				800,
				(obj) => obj.data && obj.data.enemy === true
			);
			if (!nearest_enemy) {
				nearest_enemy = game_object_find_closest(
					player_object.game,
					p.body.position.x,
					p.body.position.y,
					"enemy",
					800
				);
			}
			if (nearest_enemy) {
				let dx = nearest_enemy.data.body.position.x - p.body.position.x;
				let dy = nearest_enemy.data.body.position.y - p.body.position.y;
				let item = hotbar_get_selected_item(p.hotbar_element);
				if (item == ITEM_RED_PISTOLS || item == ITEM_RAINBOW_PISTOLS ||
					item == ITEM_MUMMY_PISTOLS) {
					dx += p.w;
					dy += p.h;
				}
				let mag = Math.sqrt(dx * dx + dy * dy);
				if (mag > 0) {
					targetX = (dx / mag) * 1000;
					targetY = (dy / mag) * 1000;
				}
			}
		}
		let l_js = player_object.game.input.joystick.left;
		let leftStickActive = (l_js.dx ** 2 + l_js.dy ** 2 > 0.01);
		let currentSelectedItem = hb.row[hb.iselected];
		if (leftStickActive && !p.achievements_element.shown && !p
			.story_note_element.shown &&
			!ITEMS_GUNS.includes(currentSelectedItem) &&
			!ITEMS_MELEE.includes(currentSelectedItem)) {
			let bestWp = player_get_best_weapon_with_ammo(player_object);
			if (bestWp > 0) {
				hb.row[hb.iselected] = bestWp;
				player_shoot(player_object, dt, null, targetX, targetY);
				hb.row[hb.iselected] = currentSelectedItem;
				p.last_auto_weapon = bestWp;
				p.auto_weapon_timer = 100;
			}
		}
		if (shooting && !p.achievements_element.shown && !p.story_note_element
			.shown) {
			player_shoot(player_object, dt, null, targetX, targetY);
			if (!inventory_has_item(p.inventory_element, ITEM_AMMO) &&
				hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN)
				achievement_do(p.achievements_element.data.achievements,
					"need for ammo", p.achievements_shower_element);
		}
		else {
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
		let oldvel = Matter.Body.getVelocity(p.body);
		if (!(vel.x * vel.x + vel.y * vel.y < oldvel.x * oldvel.x + oldvel.y *
				oldvel.y && p.shadow_jump_time > 0 || p.shadow_jump_lock))
			Matter.Body.setVelocity(p.body, vel);
		if (p.shadow_jump_time > 0) {
			p.shadow_jump_lock = true && false;
		}
	}
	else {
		if (player_object.game.settings.auto_pickup[
				"automatically pickup fuel"]) {
			let cl_item = game_object_find_closest(player_object.game, p.body
				.position.x, p.body.position.y, "item", 200);
			if (cl_item && cl_item.data.id == ITEM_FUEL) item_pickup(p
				.inventory_element, cl_item);
		}
		let carBody = p.car_object.data.body;
		let carData = p.car_object.data;
		let inputDir = player_object.game.mobile ? {
				x: player_object.game.input.joystick.right.dx,
				y: player_object.game.input.joystick.right.dy
			} :
			getWishDir(player_object.game.input);
		player_object.game.camera_target_body = carBody;
		p.body.collisionFilter.mask = -3;
		let inputMag = Math.sqrt(inputDir.x ** 2 + inputDir.y ** 2);
		if (carData.fuel > 0 && inputMag > 0.1) {
			let targetAngle = Math.atan2(inputDir.y, inputDir.x);
			let angleDiff = targetAngle - carBody.angle;
			while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
			while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
			Matter.Body.setAngle(carBody, carBody.angle + angleDiff * 0.005 *
				dt);
			let moveMag = carData.speed * Math.min(inputMag, 1.0);
			Matter.Body.setVelocity(carBody, {
				x: moveMag * Math.cos(carBody.angle),
				y: moveMag * Math.sin(carBody.angle)
			});
			carData.fuel = Math.max(carData.fuel - 0.0025 * dt, 0);
		}
		else {
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
	if (p.immunity % 350 > 175) return;
	if (p.car_object) return;
	let g = player_object.game;
	let selected_item = (p.last_auto_weapon > 0) ? p.last_auto_weapon :
		hotbar_get_selected_item(p.hotbar_element);
	let cfg = WEAPON_DEFS[selected_item];
	let posX = p.body.position.x;
	let posY = p.body.position.y;
	let pw = p.w,
		ph = p.h;
	let t = Date.now() * 0.008;
	let speed = Math.sqrt(p.body.velocity.x ** 2 + p.body.velocity.y ** 2);
	let bob = (speed > 0.5) ? Math.abs(Math.cos(t)) * (ph * 0.08) : Math.sin(
		Date.now() * 0.002) * (ph * 0.03);
	if (p.last_draw_angle === undefined) p.last_draw_angle = 0;
	let angle = p.last_draw_angle;
	let mx, my, cx = 0,
		cy = 0;
	if (p.ai_controlled) {
		let target = game_object_find_closest(g, posX, posY, "enemy", 1000);
		mx = target ? target.data.body.position.x : posX + 1;
		my = target ? target.data.body.position.y : posY;
		cx = posX;
		cy = posY;
		let targetAngle = Math.atan2(my - cy, mx - cx);
		if (!isNaN(targetAngle)) angle = targetAngle;
	}
	else if (g.input.touch && g.input.touch.length > 0) {
		let jx = g.input.joystick.left.dx;
		let jy = g.input.joystick.left.dy;
		if ((jx !== 0 || jy !== 0) && !isNaN(jx) && !isNaN(jy)) {
			angle = Math.atan2(jy, jx);
			p.last_draw_angle = angle;
		}
	}
	else {
		mx = g.input.mouse.x;
		my = g.input.mouse.y;
		cx = 0.5 * window.innerWidth;
		cy = 0.5 * window.innerHeight;
		let mouseAngle = Math.atan2(my - cy, mx - cx);
		if (!isNaN(mouseAngle)) angle = mouseAngle;
		p.last_draw_angle = angle;
	}
	let dirX = Math.cos(angle),
		dirY = Math.sin(angle);
	let bodyY = posY - ph * 0.3 + bob;
	let headY = posY - ph * 0.65 + bob;
	ctx.save();
	ctx.save();
	ctx.strokeStyle = g.settings.player_color;
	ctx.lineWidth = pw * 0.015;
	for (let i = 0; i < 45; i++) {
		ctx.beginPath();
		let hX = posX - pw * 0.22 + (i * pw * 0.44 / 45);
		let seed = i * 543.21;
		let hLen = ph * 0.15 + Math.abs(Math.sin(seed)) * ph * 0.2;
		let hAngle = (i / 45) * Math.PI + Math.PI;
		ctx.moveTo(hX, headY + ph * 0.1);
		ctx.lineTo(hX + Math.cos(hAngle) * (pw * 0.2), headY - hLen);
		ctx.stroke();
	}
	ctx.restore();
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.fillStyle = "#111";
	let walk = (speed > 0.5) ? Math.sin(t) * (ph * 0.15) : 0;
	ctx.beginPath();
	ctx.roundRect(posX - pw * 0.25, posY + ph * 0.25 + walk, pw * 0.18, ph *
		0.35, pw * 0.05);
	ctx.roundRect(posX + pw * 0.07, posY + ph * 0.25 - walk, pw * 0.18, ph *
		0.35, pw * 0.05);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = g.settings.player_color;
	ctx.beginPath();
	ctx.roundRect(posX - pw * 0.35, bodyY, pw * 0.7, ph * 0.8, pw * 0.08);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(posX, bodyY);
	ctx.lineTo(posX, bodyY + ph * 0.8);
	ctx.stroke();
	ctx.fillStyle = "#d2b48c";
	ctx.beginPath();
	ctx.roundRect(posX - pw * 0.25, headY, pw * 0.5, ph * 0.4, pw * 0.12);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "white";
	let eyeX = posX + dirX * (pw * 0.05);
	let eyeY = headY + ph * 0.18 + dirY * (ph * 0.03);
	ctx.beginPath();
	ctx.arc(eyeX - pw * 0.1, eyeY, pw * 0.06, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(eyeX + pw * 0.1, eyeY, pw * 0.06, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "black";
	let irisOff = pw * 0.04;
	ctx.beginPath();
	ctx.arc(eyeX - pw * 0.1 + dirX * irisOff, eyeY + dirY * irisOff, pw * 0.03,
		0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(eyeX + pw * 0.1 + dirX * irisOff, eyeY + dirY * irisOff, pw * 0.03,
		0, Math.PI * 2);
	ctx.fill();
	const ARM_L = pw * 0.55;
	const drawRigidArm = (endX, endY, side) => {
		let shX = posX + (pw * 0.3 * side);
		let shY = bodyY + ph * 0.3;
		ctx.save();
		ctx.strokeStyle = "#222";
		ctx.lineWidth = pw * 0.11;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(shX, shY);
		ctx.lineTo(endX, endY);
		ctx.stroke();
		ctx.fillStyle = "#111";
		ctx.beginPath();
		ctx.arc(endX, endY, pw * 0.065, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.restore();
	};
	if (g.settings.player_draw_gun && cfg && !cfg.isMelee && !cfg
		.doNotDrawGun) {
		let gunW = (cfg.width || 1) * 0.18 * pw;
		let gl = (cfg.length || 0.8) * pw * 0.75;
		let col = cfg.dynamicColor ? cfg.dynamicColor(p) : (cfg.color ||
			"black");
		ctx.lineCap = "butt";
		if (cfg.hasSecondary) {
			let lx = (posX + pw * 0.3 * -1) + dirX * ARM_L;
			let ly = (bodyY + ph * 0.3) + dirY * ARM_L;
			ctx.strokeStyle = col;
			ctx.lineWidth = gunW;
			ctx.beginPath();
			ctx.moveTo(lx, ly);
			ctx.lineTo(lx + dirX * gl, ly + dirY * gl);
			ctx.stroke();
			drawRigidArm(lx, ly, -1);
			let rx = (posX + pw * 0.3 * 1) + dirX * ARM_L;
			let ry = (bodyY + ph * 0.3) + dirY * ARM_L;
			ctx.beginPath();
			ctx.moveTo(rx, ry);
			ctx.lineTo(rx + dirX * gl, ry + dirY * gl);
			ctx.stroke();
			drawRigidArm(rx, ry, 1);
		}
		else {
			let hx = posX + dirX * ARM_L,
				hy = (bodyY + ph * 0.3) + dirY * ARM_L;
			ctx.strokeStyle = col;
			ctx.lineWidth = gunW;
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.lineTo(hx + dirX * gl, hy + dirY * gl);
			ctx.stroke();
			drawRigidArm(hx, hy, -1);
			drawRigidArm(hx + dirX * (gl * 0.4), hy + dirY * (gl * 0.4), 1);
		}
	}
	else if (p.sword_visible) {
		let hx = posX + dirX * ARM_L,
			hy = (bodyY + ph * 0.3) + dirY * ARM_L;
		let swLen = 80,
			col = "#55aa11",
			swW = 0.18 * pw;
		if (selected_item === ITEM_HORN) col = "brown";
		if (selected_item === ITEM_STICK) {
			col = "brown";
			swLen = 50;
			swW = 0.1 * pw;
		}
		let sdx = Math.cos(p.sword_direction),
			sdy = Math.sin(p.sword_direction);
		ctx.strokeStyle = col;
		ctx.lineWidth = swW;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(hx, hy);
		ctx.lineTo(hx + sdx * swLen, hy + sdy * swLen);
		ctx.stroke();
		drawRigidArm(hx, hy, -1);
		drawRigidArm(hx, hy, 1);
		p.sword_visible = false;
	}
	else if (selected_item > 0) {
		let hx = posX + dirX * ARM_L,
			hy = (bodyY + ph * 0.3) + dirY * ARM_L;
		item_icon_draw(ctx, selected_item, hx - 0.2 * pw, hy - 0.2 * ph, 0.4 *
			pw, 0.4 * ph, p.item_animstate);
		drawRigidArm(hx, hy, -1);
		drawRigidArm(hx, hy, 1);
	}
	if (p.shooting_laser) {
		let r = Math.floor(Math.pow(Math.cos(0.1 * p.item_animstate) * 15, 2));
		let gre = Math.floor(Math.pow(0.7 * (Math.cos(0.1 * p.item_animstate) +
			Math.sin(0.1 * p.item_animstate)) * 15, 2));
		let b = Math.floor(Math.pow(Math.sin(0.1 * p.item_animstate) * 15, 2));
		let laserColor = "#" + r.toString(16).padStart(2, '0') + gre.toString(
			16).padStart(2, '0') + b.toString(16).padStart(2, '0');
		const drawLaserLine = (width, strokeCol) => {
			ctx.beginPath();
			ctx.lineWidth = width;
			ctx.strokeStyle = strokeCol;
			let lx = pw * 60 * Math.cos(p.laser_direction),
				ly = pw * 60 * Math.sin(p.laser_direction);
			let startX = posX + dirX * ARM_L,
				startY = bodyY + ph * 0.3 + dirY * ARM_L;
			ctx.moveTo(startX, startY);
			ctx.lineTo(startX + lx, startY + ly);
			ctx.stroke();
		};
		drawLaserLine(pw * 0.65, laserColor);
		drawLaserLine(pw * 0.45, "white");
		p.shooting_laser = false;
	}
	ctx.restore();
	const drawStat = (val, max, offset, color) => {
		ctx.fillStyle = "red";
		ctx.fillRect(posX - pw / 2, posY - offset * ph, pw, ph * 0.05);
		ctx.fillStyle = color;
		ctx.fillRect(posX - pw / 2, posY - offset * ph, pw * Math.max(val,
			0) / max, ph * 0.05);
	};
	if (g.settings.indicators["show player health"]) drawStat(p.health, p
		.max_health, 0.9, "lime");
	if (g.settings.indicators["show player thirst"]) drawStat(p.thirst, p
		.max_thirst, 0.8, "cyan");
	if (g.settings.indicators["show player hunger"]) drawStat(p.hunger, p
		.max_hunger, 0.7, "orange");
	const renderShield = (health, max, fill, stroke) => {
		if (health <= 0) return;
		ctx.fillStyle = "gray";
		ctx.fillRect(posX - 1.25 * pw, posY - 1.85 * ph, 2.5 * pw, ph *
			0.05);
		ctx.fillStyle = fill;
		ctx.fillRect(posX - 1.25 * pw, posY - 1.85 * ph, 2.5 * pw * health /
			max, ph * 0.05);
		ctx.globalAlpha = 0.25;
		drawCircle(ctx, posX, posY, 1.5 * pw, fill, stroke, 0.05 * pw);
		ctx.globalAlpha = 1.0;
	};
	renderShield(p.shield_blue_health, p.shield_blue_health_max, "#1177aa",
		"#113377");
	renderShield(p.shield_green_health, p.shield_green_health_max, "lime",
		"#117733");
	renderShield(p.shield_shadow_health, p.shield_shadow_health_max, "#1a0033",
		"#8800ff");
	renderShield(p.shield_anubis_health, p.shield_anubis_health_max, "#cc0000",
		"#FFD700");
	if (p.shield_rainbow_health > 0) {
		let r = Math.floor(Math.pow(Math.cos(0.1 * p.item_animstate) * 15, 2));
		let gre = Math.floor(Math.pow(0.7 * (Math.cos(0.1 * p.item_animstate) +
			Math.sin(0.1 * p.item_animstate)) * 15, 2));
		let b = Math.floor(Math.pow(Math.sin(0.1 * p.item_animstate) * 15, 2));
		let rCol = "#" + r.toString(16).padStart(2, '0') + gre.toString(16)
			.padStart(2, '0') + b.toString(16).padStart(2, '0');
		renderShield(p.shield_rainbow_health, p.shield_rainbow_health_max, rCol,
			"white");
	}
}

function player_shoot(player_object, dt, target_body = null, shoot_dir_x = null,
	shoot_dir_y = null) {
	let p = player_object.data;
	if (p.immunity > 0) return;
	let g = player_object.game;
	let item_id = hotbar_get_selected_item(p.hotbar_element);
	g.current_weapon = item_id;
	g.is_player_shooting = true;
	let cfg = WEAPON_DEFS[item_id];
	if (!cfg) return;
	let sx = 0,
		sy = 0,
		tx = 1,
		ty = 1;
	if (target_body) {
		sx = p.body.position.x;
		sy = p.body.position.y;
		tx = (target_body.position.x - sx) * 10 + sx;
		ty = (target_body.position.y - sy) * 10 + sy;
	}
	else if (!p.ai_controlled) {
		sx = 0.5 * window.innerWidth;
		sy = 0.5 * window.innerHeight;
		tx = (shoot_dir_x !== null) ? shoot_dir_x + sx : g.input.mouse.x;
		ty = (shoot_dir_y !== null) ? shoot_dir_y + sy : g.input.mouse.y;
	}
	const vectors = {
		sx,
		sy,
		tx,
		ty
	};
	const cd_field = cfg.cd_prop || 'shot_cooldown';
	if (!cfg.isMelee) {
		if (p[cd_field] > 0) return;
		if (cfg.ammo) {
			if (Array.isArray(cfg.ammo)) {
				const hasAnyJunk = cfg.ammo.some(id => inventory_has_item(p
					.inventory_element, id));
				if (!hasAnyJunk && NEED_AMMO) return;
			}
			else {
				if (!inventory_has_item(p.inventory_element, cfg.ammo) &&
					NEED_AMMO) return;
			}
		}
	}
	cfg.action(g, p, vectors, dt);
	if (!cfg.isMelee) {
		p[cd_field] = cfg.cooldown;
		if (cfg.ammo && Math.random() < (cfg.chance || 0)) {
			if (Array.isArray(cfg.ammo)) {
				const itemToClear = cfg.ammo.find(id => inventory_has_item(p
					.inventory_element, id));
				if (itemToClear) inventory_clear_item(p.inventory_element,
					itemToClear, 1);
			}
			else {
				inventory_clear_item(p.inventory_element, cfg.ammo, 1);
			}
		}
	}
	if (cfg.sound && !p.ai_controlled && !cfg.isMelee) {
		audio_play(cfg.sound, cfg.vol || 0.25);
	}
}

function player_laser_hits_point(px, py, x, y, w, l, alpha) {
	x = x - px;
	y = y - py;
	let X = x * Math.cos(alpha) + y * Math.sin(alpha);
	let Y = -x * Math.sin(alpha) + y * Math.cos(alpha);
	return Math.pow(Math.abs(X / l - 1), 4) + Math.pow(Math.abs(Y / w), 4) < 1;
}

function player_item_consume(player_object, id, anywhere = false) {
	const p = player_object.data;
	const behavior = ITEM_BEHAVIORS[id];
	if (!behavior) return;
	let item_i = -1;
	let item_j = -1;
	if (!anywhere) {
		if (p.hotbar_element.shown) {
			item_i = 0;
			item_j = p.hotbar_element.data.iselected;
		}
		else if (p.inventory_element.shown) {
			item_i = p.inventory_element.data.imove;
			item_j = p.inventory_element.data.jmove;
		}
	}
	const success = behavior.action(p, player_object);
	if (success) {
		inventory_clear_item(p.inventory_element, id, 1, item_i, item_j);
		if (behavior.sfx) {
			audio_play(behavior.sfx);
		}
		if (behavior.achievement) {
			achievement_do(
				p.achievements_element.data.achievements,
				behavior.achievement,
				p.achievements_shower_element
			);
		}
	}
}

function player_get_best_weapon_with_ammo(player_object) {
	const p = player_object.data;
	const inv = p.inventory_element;
	const weaponPriority = [
		ITEM_JUNK_CANNON,
		ITEM_HORN,
		ITEM_LASER_GUN,
		ITEM_RAINBOW_PISTOLS,
		ITEM_ROCKET_SHOTGUN,
		ITEM_ROCKET_LAUNCHER,
		ITEM_GREEN_GUN,
		ITEM_SWORD,
		ITEM_RED_SHOTGUN,
		ITEM_RED_PISTOLS,
		ITEM_PLASMA_PISTOL,
		ITEM_PLASMA_LAUNCHER,
		ITEM_MINIGUN,
		ITEM_SHOTGUN,
		ITEM_DESERT_EAGLE,
		ITEM_GUN
	];
	for (let id of weaponPriority) {
		if (inventory_has_item(inv, id)) {
			let cfg = WEAPON_DEFS[id];
			if (!cfg) continue;
			if (cfg.isMelee) return id;
			if (cfg.ammo) {
				let hasAmmo = false;
				if (Array.isArray(cfg.ammo)) {
					hasAmmo = cfg.ammo.some(aId => inventory_has_item(inv,
						aId));
				}
				else {
					hasAmmo = inventory_has_item(inv, cfg.ammo);
				}
				if (hasAmmo) return id;
			}
			else {
				return id;
			}
		}
	}
	return 0;
}

function player_handle_melee(g, p, v, dt, rotSpeed, dmgMax, dmgMin, angleLimit,
	rocketDmgMax, rocketDmgMin) {
	p.sword_direction += (v.tx > v.sx ? rotSpeed : -rotSpeed) * dt;
	if (Math.abs(p.sword_direction - p.last_melee_angle_sound) >= 2 * Math.PI) {
		audio_play("data/sfx/sword_1.mp3");
		p.last_melee_angle_sound = p.sword_direction;
	}
	const {
		x,
		y
	} = p.body.position;
	let renderAngle = Math.atan2(Math.sin(p.sword_direction), Math.cos(p
		.sword_direction));
	let target = ["enemy", "animal", "car", "trashcan"].reduce((found, name) =>
		found || game_object_find_closest(g, x, y, name, name === "car" ?
			300 : 200), null);
	if (target && !(target.name === "car" && target.data.is_tank)) {
		let tPos = target.data.body.position;
		let dir = Math.atan2(tPos.y - y, tPos.x - x);
		let diff = Math.abs(dir - renderAngle) % (2 * Math.PI);
		if (diff > Math.PI) diff = 2 * Math.PI - diff;
		if (diff < angleLimit) {
			let damage_dealt = (Math.random() * dmgMax + dmgMin) * dt;
			target.data.health -= damage_dealt;
			if (target.name === "enemy")
				target.data.hit_by_player = true;
			let w = g.current_weapon;
			if (!g.dps_history[w]) g.dps_history[w] = [];
			g.dps_history[w].push({
				dmg: damage_dealt,
				time: Date.now()
			});
			const knockbackForce = 0.01;
			const forceVector = {
				x: Math.cos(dir) * knockbackForce,
				y: Math.sin(dir) * knockbackForce
			};
			Matter.Body.applyForce(target.data.body, target.data.body.position,
				forceVector);
		}
	}
	let bullet = game_object_find_closest(g, x, y, "bullet", 200);
	if (bullet) {
		let bPos = bullet.data.body.position;
		let vx = bPos.x - x,
			vy = bPos.y - y;
		let dist = Math.sqrt(vx * vx + vy * vy);
		if (dist > 0) {
			Matter.Body.setVelocity(bullet.data.body, {
				x: 5 * vx / dist,
				y: 5 * vy / dist
			});
		}
	}
	let rocket = game_object_find_closest(g, x, y, "rocket", 200);
	if (rocket) {
		let rPos = rocket.data.body.position;
		let rDir = Math.atan2(rPos.y - y, rPos.x - x);
		let rDiff = Math.abs(rDir - renderAngle) % (2 * Math.PI);
		if (rDiff > Math.PI) rDiff = 2 * Math.PI - rDiff;
		if (rDiff < Math.PI / 8) {
			rocket.data.health -= (Math.random() * rocketDmgMax +
				rocketDmgMin) * dt;
			rocket.data.hit_by_player = true;
		}
	}
	p.sword_visible = p.sword_protection = true;
}

function player_show_note(p, title, content) {
	let noteElement = p.story_note_element;
	if (!noteElement) return false;
	if (!noteElement.shown) {
		let data = noteElement.data;
		data.title = title;
		data.content = content;
		data.pages = [];
		data.current_page = 0;
		data._ignore_first_click = true;
		noteElement.shown = true;
		p.inventory_element.shown = false;
		return true;
	}
}
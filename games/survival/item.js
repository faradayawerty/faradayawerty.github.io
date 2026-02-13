let DEBUG_ITEM = false;
let BOSSIFIER_GRAY_CACHE = null;

function item_spawn(g, x, y, enemy_type = null, tile = null, car_type = null) {
	let available_guns = [ITEM_GUN];
	let available_ammos = [ITEM_AMMO];
	let available_health = [ITEM_HEALTH];
	let available_shields = [];
	let available_food = [ITEM_CANNED_MEAT];
	let available_drinks = [ITEM_WATER];
	if (enemy_type == "shooting" || enemy_type == null && g.available_enemies
		.includes("shooting")) {
		available_guns.push(ITEM_SHOTGUN);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police")
			available_guns.push(ITEM_MINIGUN);
		if (enemy_type != null) {
			available_ammos.push(ITEM_PLASMA);
			available_shields.push(ITEM_SHIELD);
		}
	}
	if (enemy_type == "shooting red" || enemy_type == null && g
		.available_enemies.includes("shooting red")) {
		available_ammos.push(ITEM_PLASMA);
		available_guns.push(ITEM_PLASMA_LAUNCHER);
		available_shields.push(ITEM_SHIELD);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police")
			available_guns.push(ITEM_PLASMA_PISTOL);
		if (enemy_type != null)
			available_ammos.push(ITEM_RED_PLASMA);
	}
	if (enemy_type == "sword" || enemy_type == null && g.available_enemies
		.includes("sword")) {
		available_guns.push(ITEM_RED_PISTOLS);
		available_ammos.push(ITEM_RED_PLASMA);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police")
			available_guns.push(ITEM_RED_SHOTGUN);
		if (enemy_type != null) {
			available_health = [ITEM_HEALTH_GREEN];
			available_shields = [ITEM_SHIELD_GREEN];
		}
	}
	if (enemy_type == "shooting rocket" || enemy_type == null && g
		.available_enemies.includes("shooting rocket")) {
		available_guns.push(ITEM_SWORD);
		available_health.push(ITEM_SHIELD_GREEN);
		available_health.push(ITEM_HEALTH_GREEN);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police")
			available_guns.push(ITEM_GREEN_GUN);
		if (enemy_type != null)
			available_ammos = [ITEM_ROCKET];
	}
	if (enemy_type == "shooting laser" || enemy_type == null && g
		.available_enemies.includes("shooting laser")) {
		available_guns.push(ITEM_ROCKET_LAUNCHER);
		available_ammos.push(ITEM_ROCKET);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police")
			available_guns.push(ITEM_ROCKET_SHOTGUN);
		if (enemy_type != null) {
			available_ammos = [ITEM_ROCKET, ITEM_RAINBOW_AMMO];
			available_shields = [ITEM_SHIELD_RAINBOW];
		}
	}
	if (enemy_type == "mummy") {
		available_guns.push(ITEM_KALASHNIKOV);
		available_ammos.push(ITEM_PLASMA);
	}
	if (enemy_type == "shadow") {
		available_guns.push(ITEM_MUMMY_PISTOLS);
		available_ammos.push(ITEM_PLASMA);
		available_shields.push(ITEM_SHADOW_SHIELD);
	}
	if (enemy_type == "anubis") {
		available_guns.push(ITEM_SHADOW_STAFF);
		available_ammos.push(ITEM_RED_PLASMA);
		available_shields.push(ITEM_ANUBIS_REGEN_SHIELD);
	}
	let chance_ammo = 1;
	let chance_health = 1;
	let chance_shield = 1;
	let chance_gun = 1;
	let chance_food = 1;
	let chance_drink = 1;
	let chance_fuel = 1;
	if (enemy_type != null) {
		chance_fuel = 5;
		chance_ammo = 25;
		chance_health = 0;
		chance_shield = 15;
		chance_food = 10;
		chance_drink = 10;
		if (enemy_type == "shooting") {
			chance_health = 5;
		}
		if (enemy_type == "sword") {
			chance_health = 15;
			chance_food = 0;
			chance_drink = 0;
		}
		if (["desert", "mummy", "shadow", "anubis"].includes(enemy_type)) {
			chance_drink = 0;
		}
	}
	else if (car_type !== null) {
		chance_ammo = 0;
		chance_gun = 0;
		chance_fuel = 20;
		chance_health = 0;
		chance_shield = 0;
		chance_food = 0;
		chance_drink = 0;
		switch (car_type) {
			case "tank":
				chance_ammo = 80;
				chance_gun = 10;
				chance_fuel = 40;
				break;
			case "police":
				chance_ammo = 50;
				chance_gun = 15;
				if (Math.random() < 0.25)
					available_guns.push(ITEM_DESERT_EAGLE);
				break;
			case "fireman":
				chance_drink = 80;
				available_drinks = [ITEM_WATER];
				break;
			case "ambulance":
				chance_health = 100;
				chance_drink = 5;
				chance_food = 5;
				available_food = [ITEM_ORANGE];
				available_drinks = [ITEM_WATER];
				break;
			case "default":
				break;
		}
	}
	else {
		if (tile === LEVEL_TILE_CITY_POLICE) {
			chance_food = 1;
			chance_drink = 1;
			chance_ammo = 70;
			chance_gun = 40;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 0;
			available_drinks = [ITEM_COLA];
			available_food = [ITEM_CANNED_MEAT];
			if (Math.random() < 0.25)
				available_guns.push(ITEM_DESERT_EAGLE);
		}
		else if (tile === LEVEL_TILE_CITY_HOSPITAL) {
			chance_food = 10;
			chance_drink = 10;
			chance_ammo = 1;
			chance_gun = 0.1;
			chance_health = 50;
			chance_shield = 15;
			chance_fuel = 0;
			available_food = [ITEM_ORANGE];
			available_drinks = [ITEM_WATER];
		}
		else if (tile === LEVEL_TILE_CITY_FIRE_STATION) {
			chance_food = 10;
			chance_drink = 60;
			chance_ammo = 1;
			chance_gun = 1;
			chance_health = 1;
			chance_shield = 10;
			chance_fuel = 0;
			available_food = [ITEM_CANNED_MEAT];
			available_drinks = [ITEM_WATER];
		}
		else if (tile === LEVEL_TILE_CITY_GAS_STATION) {
			chance_food = 30;
			chance_drink = 20;
			chance_ammo = 5;
			chance_gun = 2.5;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 120;
			available_food = [ITEM_ORANGE, ITEM_CHICKEN_LEG, ITEM_CHOCOLATE];
			available_drinks = [ITEM_MILK, ITEM_COLA];
		}
		else if (LEVEL_TILES_SUBURBAN_ZONE.includes(tile)) {
			chance_food = 20;
			chance_drink = 20;
			chance_ammo = 5;
			chance_gun = 2.5;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 0;
			available_food = [ITEM_ORANGE, ITEM_CHICKEN_LEG, ITEM_CHOCOLATE];
			available_drinks = [ITEM_MILK, ITEM_COLA];
		}
		else if (tile === LEVEL_TILE_HUT_IN_FOREST) {
			chance_food = 40;
			chance_drink = 20;
			chance_ammo = 15;
			chance_gun = 10;
			chance_health = 0;
			chance_shield = 0;
			chance_fuel = 0;
			available_food = [ITEM_APPLE, ITEM_CANNED_MEAT, ITEM_CHICKEN_LEG];
			available_drinks = [ITEM_WATER, ITEM_MILK];
		}
		else if (LEVEL_TILES_FOREST_ZONE.includes(tile)) {
			chance_food = 30;
			chance_drink = 0;
			chance_gun = 1;
			chance_ammo = 2;
			chance_health = 0;
			chance_shield = 1;
			chance_fuel = 0;
			available_food = [ITEM_APPLE];
		}
	}
	chance_gun = chance_gun * Math.min(1, available_guns.length);
	chance_ammo = chance_ammo * Math.min(1, available_ammos.length);
	chance_food = chance_food * Math.min(1, available_food.length);
	chance_drink = chance_drink * Math.min(1, available_drinks.length);
	chance_ammo = chance_ammo * Math.min(1, available_ammos.length);
	chance_shield = chance_shield * Math.min(1, available_shields.length);
	let chance_sum = chance_gun + chance_ammo + chance_fuel + chance_food +
		chance_drink + chance_shield + chance_health;
	chance_gun = chance_gun / chance_sum;
	chance_ammo = chance_ammo / chance_sum;
	chance_fuel = chance_fuel / chance_sum;
	chance_food = chance_food / chance_sum;
	chance_drink = chance_drink / chance_sum;
	chance_health = chance_health / chance_sum;
	chance_shield = chance_shield / chance_sum;
	let item = ITEM_MONEY;
	let r = Math.random();
	let a = 0;
	if (a < r && r < a + chance_health)
		item = available_health[Math.floor(Math.random() * available_health
			.length)];
	a += chance_health;
	if (a < r && r < a + chance_shield)
		item = available_shields[Math.floor(Math.random() * available_shields
			.length)];
	a += chance_shield;
	if (a < r && r < a + chance_gun)
		item = available_guns[Math.floor(Math.random() * available_guns
			.length)];
	a += chance_gun;
	if (a < r && r < a + chance_fuel)
		item = ITEM_FUEL;
	a += chance_fuel;
	if (a < r && r < a + chance_food)
		item = available_food[Math.floor(Math.random() * available_food
			.length)];
	a += chance_food;
	if (a < r && r < a + chance_drink)
		item = available_drinks[Math.floor(Math.random() * available_drinks
			.length)];
	a += chance_drink;
	if (a < r && r < a + chance_ammo)
		item = available_ammos[Math.floor(Math.random() * available_ammos
			.length)];
	a += chance_ammo;
	if (DEBUG_ITEM)
		g.debug_console.unshift(
			"item_spawn" +
			" i:" + item +
			" r:" + Math.round(100 * r) + "%" +
			" H:" + Math.round(100 * chance_health) + "%" +
			" S:" + Math.round(100 * chance_shield) + "%" +
			" W:" + Math.round(100 * chance_gun) + "%" +
			" G:" + Math.round(100 * chance_fuel) + "%" +
			" F:" + Math.round(100 * chance_food) + "%" +
			" D:" + Math.round(100 * chance_drink) + "%" +
			" A:" + Math.round(100 * chance_ammo) + "%"
		);
	if (enemy_type == "deer")
		item = ITEM_CANNED_MEAT;
	if (enemy_type == "scorpion" || enemy_type == "snake")
		item = ITEM_VENOM;
	if (enemy_type == "raccoon")
		item = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK.length)];
	item_create(g, item, x, y);
}

function item_create(g, id_, x_, y_, dropped = false, despawn = true) {
	let items = g.objects.filter((obj) => obj.name == "item" && obj.data
		.despawn && !obj.data.dropped);
	if (items.length > 50) {
		for (let i = 0; i < items.length - 50; i++)
			items[i].destroy(items[i]);
	}
	if (id_ == 0)
		return;
	let item = {
		id: id_,
		body: Matter.Bodies.rectangle(x_, y_, 40, 40, {
			inertia: Infinity,
			mass: 1000.5
		}),
		dropped: dropped,
		animation_state: 0,
		despawn: despawn,
	};
	Matter.Composite.add(g.engine.world, item.body);
	return game_object_create(g, "item", item,
		item_update, item_draw, item_destroy);
}

function item_create_from_list(g, list, x, y) {
	let i = Math.floor(list.length * Math.random());
	if (i == list.length)
		i = 0;
	item_create(g, list[i], x, y);
}

function item_destroy(item_object) {
	if (item_object.destroyed)
		return;
	let g = item_object.game;
	Matter.Composite.remove(g.engine.world, item_object.data.body);
	item_object.data.body = null;
	item_object.destroyed = true;
}

function item_update(item_object, dt) {
	item_object.data.animation_state += 0.02 * dt;
}

function item_draw(item_object, ctx) {
	let item = item_object.data;
	item_icon_draw(ctx, item.id, item.body.position.x - 20, item.body.position
		.y - 20, 40, 40, item_object.data.animation_state);
}

function item_icon_draw(ctx, id, x, y, w, h, animstate = null) {
	if (id === 0)
		return;
	let item = ITEMS_DATA[id] || ITEMS_DATA.default;
	item.render(ctx, x, y, w, h, animstate);
}

function item_pickup(inventory_element, item_object, force = false) {
	if (!item_object)
		return false;
	let inv = inventory_element.data;
	let item = item_object.data;
	if (item_object.game.settings.ammo_pickup_last && ITEMS_AMMOS.concat(
			ITEMS_JUNK).includes(item_object.data.id) || force) {
		for (let i = inv.items.length - 1; i >= 0; i--)
			for (let j = inv.items[i].length - 1; j >= 0; j--)
				if (inv.items[i][j] == 0 || force) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
	}
	else {
		for (let i = 0; i < inv.items.length; i++)
			for (let j = 0; j < inv.items[i].length; j++) {
				if (inv.items[i][j] == 0) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
			}
	}
	return false;
}

function item_draw_bossifier_icon(ctx, x, y, w, h, animstate, enemyType) {
	if (animstate == null) return;
	let pulse = 1 + Math.pow(Math.sin(animstate * 0.1), 2);
	const typeCfg = ENEMY_TYPES[enemyType];
	ctx.fillStyle = "black";
	ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	let uiColor = typeCfg.outline;
	if (!uiColor || uiColor === "black" || uiColor === "#000000") {
		uiColor = "white";
	}
	if (enemyType === "shooting laser") {
		let rate = 0.05;
		let r = Math.floor(Math.pow(Math.cos(rate * animstate) * 15, 2));
		let g = Math.floor(Math.pow(0.7 * (Math.cos(rate * animstate) + Math
			.sin(rate * animstate)) * 15, 2));
		let b = Math.floor(Math.pow(Math.sin(rate * animstate) * 15, 2));
		uiColor = "#" + r.toString(16).padStart(2, '0') + g.toString(16)
			.padStart(2, '0') + b.toString(16).padStart(2, '0');
	}
	ctx.save();
	ctx.strokeStyle = uiColor;
	ctx.lineWidth = h * 0.03 * pulse;
	ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	ctx.fillStyle = uiColor;
	ctx.beginPath();
	ctx.moveTo(x + w * 0.5, y + h * 0.25);
	ctx.lineTo(x + w * 0.4, y + h * 0.35);
	ctx.lineTo(x + w * 0.6, y + h * 0.35);
	ctx.fill();
	ctx.restore();
	if (typeCfg && typeCfg.render_icon) {
		typeCfg.render_icon(ctx, x, y, w, h);
	}
}

function get_bossifier_gray_icon(ctx, w, h) {
	if (!BOSSIFIER_GRAY_CACHE) {
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = w;
		tempCanvas.height = h;
		const tempCtx = tempCanvas.getContext('2d');
		item_draw_bossifier_icon(tempCtx, 0, 0, w, h, 0, "regular");
		const grayCanvas = document.createElement('canvas');
		grayCanvas.width = w;
		grayCanvas.height = h;
		const gctx = grayCanvas.getContext('2d');
		gctx.filter = "grayscale(100%)";
		gctx.drawImage(tempCanvas, 0, 0);
		BOSSIFIER_GRAY_CACHE = grayCanvas;
	}
	return BOSSIFIER_GRAY_CACHE;
}
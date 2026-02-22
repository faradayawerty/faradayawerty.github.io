let DEBUG_ITEM = false;
let BOSSIFIER_GRAY_CACHE = null;
const _ITEM_TEXT_CACHE = {
	ru: "НАЖМИТЕ ",
	en: "PRESS ",
	lastLang: null,
	lastFull: ""
};

function item_spawn(g, x, y, enemy_type = null, tile = null, car_type = null,
	context = null) {
	let tile_theme = 200 * Math.floor(tile / 200);
	let available_guns = [ITEM_GUN];
	let available_ammos = [ITEM_AMMO];
	let available_health = [ITEM_HEALTH];
	let available_shields = [];
	let available_food = [ITEM_CANNED_MEAT];
	let available_drinks = [ITEM_WATER];
	const shootingAvail = (enemy_type == "shooting" || (enemy_type == null && g
		.available_enemies.includes("shooting")));
	const shootingRedAvail = (enemy_type == "shooting red" || (enemy_type ==
		null && g.available_enemies.includes("shooting red")));
	const swordAvail = (enemy_type == "sword" || (enemy_type == null && g
		.available_enemies.includes("sword")));
	const rocketAvail = (enemy_type == "shooting rocket" || (enemy_type ==
		null && g.available_enemies.includes("shooting rocket")));
	const laserAvail = (enemy_type == "shooting laser" || (enemy_type == null &&
		g.available_enemies.includes("shooting laser")));
	if (shootingAvail) {
		available_guns.push(ITEM_SHOTGUN);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police") {
			available_guns.push(ITEM_MINIGUN);
		}
		if (enemy_type != null) {
			available_ammos.push(ITEM_PLASMA);
			available_shields.push(ITEM_SHIELD);
		}
	}
	if (shootingRedAvail) {
		available_ammos.push(ITEM_PLASMA);
		available_guns.push(ITEM_PLASMA_LAUNCHER);
		available_shields.push(ITEM_SHIELD);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police") {
			available_guns.push(ITEM_PLASMA_PISTOL);
		}
		if (enemy_type != null) {
			available_ammos.push(ITEM_RED_PLASMA);
		}
	}
	if (swordAvail) {
		available_guns.push(ITEM_RED_PISTOLS);
		available_ammos.push(ITEM_RED_PLASMA);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police") {
			available_guns.push(ITEM_RED_SHOTGUN);
		}
		if (enemy_type != null) {
			available_health = [ITEM_HEALTH_GREEN];
			available_shields = [ITEM_SHIELD_GREEN];
		}
	}
	if (rocketAvail) {
		available_guns.push(ITEM_SWORD);
		available_health.push(ITEM_SHIELD_GREEN, ITEM_HEALTH_GREEN);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police") {
			available_guns.push(ITEM_GREEN_GUN);
		}
		if (enemy_type != null) {
			available_ammos = [ITEM_ROCKET];
		}
	}
	if (laserAvail) {
		available_guns.push(ITEM_ROCKET_LAUNCHER);
		available_ammos.push(ITEM_ROCKET);
		if (tile === LEVEL_TILE_CITY_POLICE || car_type === "police") {
			available_guns.push(ITEM_ROCKET_SHOTGUN);
		}
		if (enemy_type != null) {
			available_ammos = [ITEM_ROCKET, ITEM_RAINBOW_AMMO];
			available_shields.push(ITEM_SHIELD_RAINBOW);
		}
	}
	if (enemy_type == "mummy" || (enemy_type == null && g.available_enemies
			.includes("mummy") && tile_theme === THEME_DESERT)) {
		available_guns.push(ITEM_KALASHNIKOV);
		available_ammos.push(ITEM_PLASMA);
	}
	if (enemy_type == "shadow" || (enemy_type == null && g.available_enemies
			.includes("shadow") && tile_theme === THEME_DESERT)) {
		available_guns.push(ITEM_MUMMY_PISTOLS);
		available_ammos.push(ITEM_PLASMA);
		available_shields.push(ITEM_SHADOW_SHIELD);
	}
	if (enemy_type == "anubis") {
		available_guns.push(ITEM_SHADOW_STAFF);
		available_ammos.push(ITEM_RED_PLASMA);
		available_shields.push(ITEM_ANUBIS_REGEN_SHIELD);
	}
	if (enemy_type == "ushanka" || (enemy_type == null && g.available_enemies
			.includes("ushanka") && tile_theme === THEME_TAIGA)) {
		available_guns.push(ITEM_PP_SH);
		available_guns.push(ITEM_MOSIN_RIFLE);
		available_ammos.push(ITEM_PLASMA, ITEM_RED_PLASMA, ITEM_ROCKET);
	}
	if (enemy_type == "snowman" || (enemy_type == null && g.available_enemies
			.includes("snowman") && tile_theme === THEME_TAIGA)) {
		available_guns.push(ITEM_FLAMETHROWER, ITEM_TESLA_GUN,
			ITEM_ROCKET_PISTOL);
		available_ammos = [ITEM_PLASMA, ITEM_SNOWBALL];
	}
	if (enemy_type == "krampus" || (enemy_type == null && g.available_enemies
			.includes("krampus") && tile_theme === THEME_TAIGA)) {
		available_guns.push(ITEM_SNOWBALL_GUN, ITEM_FREEZE_GUN);
		available_ammos.push(ITEM_SNOWBALL, ITEM_PRESENT);
	}
	if (enemy_type == "blood" || (enemy_type == null && g.available_enemies
			.includes("blood") && tile_theme === THEME_BLOOD_FOREST)) {
		available_food = [ITEM_EYEBALL_SOUP];
		available_drinks = [ITEM_PUMPKIN_JUICE];
		available_ammos = [ITEM_RED_PLASMA];
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
		if (enemy_type == "blood") {
			chance_fuel = 1;
			chance_ammo = 20;
			chance_health = 0;
			chance_shield = 0;
			chance_food = 5;
			chance_drink = 5;
		}
		if (enemy_type == "snowman") {
			chance_fuel = 0;
			chance_ammo = 100;
			chance_health = 0;
			chance_shield = 0;
			chance_food = 0;
			chance_drink = 0;
		}
		if (enemy_type == "shooting") chance_health = 5;
		if (enemy_type == "sword") {
			chance_health = 15;
			chance_food = 0;
			chance_drink = 0;
		}
		if (enemy_type == "desert" || enemy_type == "mummy" || enemy_type ==
			"shadow" || enemy_type == "anubis") {
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
				if (Math.random() < 0.25) available_guns.push(
					ITEM_DESERT_EAGLE);
				break;
			case "fireman":
				chance_drink = 80;
				break;
			case "ambulance":
				chance_health = 100;
				chance_drink = 5;
				chance_food = 5;
				available_food = [ITEM_ORANGE];
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
			if (Math.random() < 0.25) available_guns.push(ITEM_DESERT_EAGLE);
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
		}
		else if (tile === LEVEL_TILE_CITY_FIRE_STATION) {
			chance_food = 10;
			chance_drink = 60;
			chance_ammo = 1;
			chance_gun = 1;
			chance_health = 1;
			chance_shield = 10;
			chance_fuel = 0;
		}
		else if (tile === LEVEL_TILE_CITY_GAS_STATION ||
			LEVEL_TILES_SUBURBAN_ZONE.includes(tile)) {
			chance_food = (tile === LEVEL_TILE_CITY_GAS_STATION) ? 30 : 20;
			chance_drink = 20;
			chance_ammo = 5;
			chance_gun = 2.5;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = (tile === LEVEL_TILE_CITY_GAS_STATION) ? 120 : 0;
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
		else if (THEME_DESERT <= tile && tile < THEME_DESERT + 200) {
			chance_food = 0;
			chance_drink = 20;
			chance_gun = 1;
			chance_ammo = 3;
			chance_health = 0;
			chance_shield = 0;
			chance_fuel = 0;
			available_drinks = [ITEM_CACTUS_JUICE];
		}
		else if (THEME_TAIGA <= tile && tile < THEME_TAIGA + 200) {
			chance_food = 20;
			chance_drink = 0;
			chance_gun = 1;
			chance_ammo = 3;
			chance_health = 0;
			chance_shield = 0;
			chance_fuel = 0;
			available_food = [ITEM_HONEY];
		}
		else if (THEME_BLOOD_FOREST <= tile && tile < THEME_BLOOD_FOREST +
			200) {
			chance_food = 20;
			chance_drink = 0;
			chance_gun = 1;
			chance_ammo = 3;
			chance_health = 0;
			chance_shield = 0;
			chance_fuel = 0;
			available_food = [ITEM_EYEBALL_SOUP];
		}
	}
	chance_gun *= (available_guns.length > 0 ? 1 : 0);
	chance_ammo *= (available_ammos.length > 0 ? 1 : 0);
	chance_food *= (available_food.length > 0 ? 1 : 0);
	chance_drink *= (available_drinks.length > 0 ? 1 : 0);
	chance_shield *= (available_shields.length > 0 ? 1 : 0);
	const chance_sum = chance_gun + chance_ammo + chance_fuel + chance_food +
		chance_drink + chance_shield + chance_health;
	let r = Math.random() * chance_sum;
	let item = ITEM_MONEY;
	let acc = 0;
	if (r < (acc += chance_health)) {
		item = available_health[Math.floor(Math.random() * available_health
			.length)];
	}
	else if (r < (acc += chance_shield)) {
		item = available_shields[Math.floor(Math.random() * available_shields
			.length)];
	}
	else if (r < (acc += chance_gun)) {
		item = available_guns[Math.floor(Math.random() * available_guns
			.length)];
	}
	else if (r < (acc += chance_fuel)) {
		item = ITEM_FUEL;
	}
	else if (r < (acc += chance_food)) {
		item = available_food[Math.floor(Math.random() * available_food
			.length)];
	}
	else if (r < (acc += chance_drink)) {
		item = available_drinks[Math.floor(Math.random() * available_drinks
			.length)];
	}
	else if (r < chance_sum) {
		item = available_ammos[Math.floor(Math.random() * available_ammos
			.length)];
	}
	if (DEBUG_ITEM) {
		g.debug_console.unshift("item_spawn i:" + item + " r:" + Math.round(
			100 * (r / chance_sum)) + "%");
	}
	if (enemy_type == "deer") item = ITEM_CANNED_MEAT;
	else if (enemy_type == "scorpion" || enemy_type == "snake") item =
		ITEM_VENOM;
	else if (enemy_type == "raccoon") item = ITEMS_JUNK[Math.floor(Math
		.random() * ITEMS_JUNK.length)];
	if (Math.random() < 0.25 && LEVEL_TILES_SUBURBAN_ZONE.includes(tile) && !g
		.important_items.includes(ITEM_DIARY) && context !== "trashcan") {
		item = ITEM_DIARY;
		g.important_items.push(ITEM_DIARY);
	}
	if (Math.random() < 0.25 && LEVEL_TILES_SUBURBAN_ZONE.includes(tile) && !g
		.important_items.includes(ITEM_MONEY)) {
		item = ITEM_MONEY;
		g.important_items.push(ITEM_MONEY);
	}
	item_create(g, item, x, y);
}

function item_create(g, id_, x_, y_, dropped = false, despawn = true) {
	if (id_ == 0) return;
	let item_count = 0;
	for (let i = 0; i < g.objects.length; i++) {
		const obj = g.objects[i];
		if (obj.name == "item" && obj.data.despawn && !obj.data.dropped) {
			item_count++;
		}
	}
	if (item_count > 50) {
		let to_remove = item_count - 50;
		for (let i = 0; i < g.objects.length && to_remove > 0; i++) {
			const obj = g.objects[i];
			if (obj.name == "item" && obj.data.despawn && !obj.data.dropped) {
				obj.destroy(obj);
				to_remove--;
			}
		}
	}
	const itemData = {
		id: id_,
		body: Matter.Bodies.rectangle(x_, y_, 40, 40, {
			inertia: Infinity,
			mass: 1000.5
		}),
		dropped: dropped,
		animation_state: 0,
		despawn: despawn,
	};
	Matter.Composite.add(g.engine.world, itemData.body);
	return game_object_create(g, "item", itemData, item_update, item_draw,
		item_destroy);
}

function item_create_from_list(g, list, x, y) {
	if (list.length === 0) return;
	item_create(g, list[Math.floor(list.length * Math.random())], x, y);
}

function item_destroy(item_object) {
	if (item_object.destroyed) return;
	item_object.destroyed = true;
	if (item_object.data.body) {
		Matter.Composite.remove(item_object.game.engine.world, item_object.data
			.body);
		item_object.data.body = null;
	}
}

function item_update(item_object, dt) {
	item_object.data.animation_state += 0.02 * dt;
}

function item_draw(item_object, ctx) {
	const item = item_object.data;
	const g = item_object.game;
	const px = item.body.position.x;
	const py = item.body.position.y;
	item_icon_draw(ctx, item.id, px - 20, py - 20, 40, 40, item
		.animation_state);
	const player = g.player_object || (g.collections && g.collections[
		"player"] ? g.collections["player"][0] : null);
	if (player && player.data && player.data.body && player.data.body
		.position && player.data.achievements_element) {
		const achvs = player.data.achievements_element.data.achievements;
		let hasPick = false;
		for (let i = 0; i < achvs.length; i++) {
			if (achvs[i].name === "pick an item") {
				hasPick = achvs[i].done;
				break;
			}
		}
		if (!hasPick) {
			const pPos = player.data.body.position;
			const dx = px - pPos.x;
			const dy = py - pPos.y;
			const distSq = dx * dx + dy * dy;
			if (distSq < 250000) {
				const dist = Math.sqrt(distSq);
				ctx.save();
				const distanceAlpha = Math.max(0, Math.min(1, 1 - (dist - 100) /
					400));
				const bounce = Math.sin(item.animation_state * 0.25) * 12;
				ctx.translate(px, py - 85 + bounce);
				ctx.globalAlpha = distanceAlpha;
				const lang = g.settings.language;
				if (_ITEM_TEXT_CACHE.lastLang !== lang) {
					_ITEM_TEXT_CACHE.lastLang = lang;
					const keyText = g.mobile ? "PICK UP" : "F";
					_ITEM_TEXT_CACHE.lastFull = (lang === "русский" ?
						_ITEM_TEXT_CACHE.ru : _ITEM_TEXT_CACHE.en) + keyText;
				}
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = "bold 34px Arial, sans-serif";
				ctx.strokeStyle = "black";
				ctx.lineWidth = 7;
				ctx.lineJoin = "round";
				ctx.strokeText(_ITEM_TEXT_CACHE.lastFull, 0, 0);
				ctx.fillStyle = "#FFDC00";
				ctx.fillText(_ITEM_TEXT_CACHE.lastFull, 0, 0);
				ctx.beginPath();
				ctx.moveTo(-12, 22);
				ctx.lineTo(0, 37);
				ctx.lineTo(12, 22);
				ctx.fill();
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.restore();
			}
		}
	}
}

function item_icon_draw(ctx, id, x, y, w, h, animstate = null) {
	if (id === 0) return;
	const icon = ITEMS_DATA[id] || ITEMS_DATA.default;
	icon.render(ctx, x, y, w, h, animstate);
}

function item_pickup(inventory_element, item_object, force = false) {
	if (!item_object) return false;
	const inv = inventory_element.data;
	const itemId = item_object.data.id;
	const items = inv.items;
	const isAmmoOrJunk = ITEMS_AMMOS.includes(itemId) || ITEMS_JUNK.includes(
		itemId);
	if ((item_object.game.settings.ammo_pickup_last && isAmmoOrJunk) || force) {
		for (let i = items.length - 1; i >= 0; i--) {
			const row = items[i];
			for (let j = row.length - 1; j >= 0; j--) {
				if (row[j] === 0 || force) {
					row[j] = itemId;
					item_destroy(item_object);
					return true;
				}
			}
		}
	}
	else {
		for (let i = 0; i < items.length; i++) {
			const row = items[i];
			for (let j = 0; j < row.length; j++) {
				if (row[j] === 0) {
					row[j] = itemId;
					item_destroy(item_object);
					return true;
				}
			}
		}
	}
	return false;
}

function item_draw_bossifier_icon(ctx, x, y, w, h, animstate, enemyType) {
	if (animstate == null) return;
	const pulse = 1 + Math.pow(Math.sin(animstate * 0.1), 2);
	const typeCfg = ENEMY_TYPES[enemyType];
	ctx.fillStyle = "black";
	ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	let uiColor = typeCfg.outline;
	if (!uiColor || uiColor === "black" || uiColor === "#000000") uiColor =
		"white";
	if (enemyType === "shooting laser") {
		const r = Math.floor(Math.pow(Math.cos(0.05 * animstate) * 15, 2));
		const g = Math.floor(Math.pow(0.7 * (Math.cos(0.05 * animstate) + Math
			.sin(0.05 * animstate)) * 15, 2));
		const b = Math.floor(Math.pow(Math.sin(0.05 * animstate) * 15, 2));
		uiColor = `rgb(${r},${g},${b})`;
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
	if (typeCfg && typeCfg.render_icon) typeCfg.render_icon(ctx, x, y, w, h);
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
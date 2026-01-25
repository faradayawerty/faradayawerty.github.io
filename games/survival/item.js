function item_spawn(g, x, y, enemy_type = null, tile = null, car_type = null) {
	let available_guns = [ITEM_GUN];
	let available_ammos = [ITEM_AMMO];
	let available_health = [ITEM_HEALTH];
	let available_shields = [];
	let available_food = [ITEM_CANNED_MEAT];
	let available_drinks = [ITEM_WATER];
	if (enemy_type == "shooting" || enemy_type == null && g.enemies[
			"shooting"]) {
		available_guns.push(ITEM_SHOTGUN);
		if (enemy_type != null) {
			available_ammos.push(ITEM_PLASMA);
			available_shields.push(ITEM_SHIELD);
		}
	}
	if (enemy_type == "shooting red" || enemy_type == null && g.enemies[
			"shooting red"]) {
		available_ammos.push(ITEM_PLASMA);
		available_guns.push(ITEM_PLASMA_LAUNCHER);
		available_shields.push(ITEM_SHIELD);
		if (enemy_type != null)
			available_ammos.push(ITEM_RED_PLASMA);
	}
	if (enemy_type == "sword" || enemy_type == null && g.enemies["sword"]) {
		available_guns.push(ITEM_RED_PISTOLS);
		available_ammos.push(ITEM_RED_PLASMA);
		if (enemy_type != null) {
			available_health = [ITEM_HEALTH_GREEN];
			available_shields = [ITEM_SHIELD_GREEN];
		}
	}
	if (enemy_type == "shooting rocket" || enemy_type == null && g.enemies[
			"shooting rocket"]) {
		available_guns.push(ITEM_SWORD);
		available_health.push(ITEM_SHIELD_GREEN);
		available_health.push(ITEM_HEALTH_GREEN);
		if (enemy_type != null)
			available_ammos = [ITEM_ROCKET];
	}
	if (enemy_type == "shooting laser" || enemy_type == null && g.enemies[
			"shooting laser"]) {
		available_guns.push(ITEM_ROCKET_LAUNCHER);
		available_ammos.push(ITEM_ROCKET);
		if (enemy_type != null) {
			available_ammos = [ITEM_ROCKET, ITEM_RAINBOW_AMMO];
			available_shields = [ITEM_SHIELD_RAINBOW];
		}
	}
	let chance_ammo = 1;
	let chance_health = 1;
	let chance_shield = 1;
	let chance_gun = 1;
	let chance_food = 1;
	let chance_drink = 1;
	let chance_fuel = 1;
	if (enemy_type != null) {
		chance_fuel = 10;
		chance_ammo = 50;
		chance_health = 0;
		chance_shield = 5;
		chance_food = 10;
		chance_drink = 10;
		if (enemy_type == "shooting") {
			chance_health = 25;
			chance_shield = 10;
		}
		if (enemy_type == "sword") {
			chance_health = 25;
			chance_shield = 10;
		}
	} else if (car_type !== null) {
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
				break;
			case "fireman":
				chance_drink = 80;
				available_drinks = [ITEM_WATER];
				break;
			case "ambulance":
				chance_health = 100;
				chance_drink = 20;
				chance_food = 5;
				break;
			case "default":
				break;
		}
	} else {
		if (tile === LEVEL_TILE_CITY_POLICE) {
			chance_food = 1;
			chance_drink = 1;
			chance_ammo = 70;
			chance_gun = 40;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 0;
			available_drinks = ITEMS_DRINKS;
		} else if (tile === LEVEL_TILE_CITY_HOSPITAL) {
			chance_food = 5;
			chance_drink = 30;
			chance_ammo = 1;
			chance_gun = 1;
			chance_health = 70;
			chance_shield = 10;
			chance_fuel = 0;
			available_food = [ITEM_APPLE, ITEM_ORANGE, ITEM_CHERRIES,
				ITEM_CANNED_MEAT
			];
		} else if (tile === LEVEL_TILE_CITY_FIRE_STATION) {
			chance_food = 10;
			chance_drink = 60;
			chance_ammo = 1;
			chance_gun = 1;
			chance_health = 1;
			chance_shield = 10;
			chance_fuel = 0;
			available_food = ITEMS_FOODS;
		} else if (tile === LEVEL_TILE_CITY_GAS_STATION) {
			chance_food = 30;
			chance_drink = 20;
			chance_ammo = 5;
			chance_gun = 2.5;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 120;
			available_food = ITEMS_FOODS;
			available_drinks = ITEMS_DRINKS;
		} else if (LEVEL_TILES_SUBURBAN_ZONE.includes(tile)) {
			chance_food = 20;
			chance_drink = 20;
			chance_ammo = 5;
			chance_gun = 2.5;
			chance_health = 0;
			chance_shield = 10;
			chance_fuel = 0;
			available_food = ITEMS_FOODS;
			available_drinks = ITEMS_DRINKS;
		} else if (LEVEL_TILES_FOREST_ZONE.includes(tile)) {
			chance_food = 20;
			chance_drink = 0;
			chance_gun = 0.5;
			chance_ammo = 2;
			chance_health = 0;
			chance_shield = 2;
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
	let renderer = ITEM_RENDERERS[id] || ITEM_RENDERERS.default;
	renderer(ctx, x, y, w, h, animstate);
}

function item_pickup(inventory_element, item_object, force = false) {
	if (!item_object)
		return false;
	let inv = inventory_element.data;
	let item = item_object.data;
	if (item_object.game.settings.ammo_pickup_last && ITEMS_AMMOS.includes(
			item_object.data.id) || force) {
		for (let i = inv.items.length - 1; i >= 0; i--)
			for (let j = inv.items[i].length - 1; j >= 0; j--)
				if (inv.items[i][j] == 0 || force) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
	} else {
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

function item_name_translate(language, text) {
	if (language == "русский") {
		if (text == "apple core")
			return "огрызок яблока";
		if (text == "fish bone")
			return "рыбья кость";
		if (text == "empty bottle")
			return "пустая бутылка";
		if (text == "tin can")
			return "консервная банка";
		if (text == "gun")
			return "пушка";
		if (text == "shotgun")
			return "дробовик";
		if (text == "item")
			return "неизвестный предмет";
		if (text == "ammo")
			return "патроны";
		if (text == "health")
			return "аптечка";
		if (text == "orange")
			return "апельсин";
		if (text == "water")
			return "вода";
		if (text == "milk")
			return "молоко";
		if (text == "cola")
			return "кола";
		if (text == "canned meat")
			return "тушонка";
		if (text == "money")
			return "деньги";
		if (text == "cherries")
			return "вишни";
		if (text == "chocolate")
			return "шоколад";
		if (text == "fuel")
			return "топливо";
		if (text == "minigun")
			return "миниган";
		if (text == "plasma")
			return "плазма";
		if (text == "plasmagun")
			return "плазменная пушка";
	}
	return text;
}
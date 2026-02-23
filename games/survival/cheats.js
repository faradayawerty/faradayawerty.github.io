let NEED_AMMO = true;
let DROP_ITEMS = true;

function cheat_all_weapons() {
	let targetX = 1250,
		targetY = 1250;
	let plr = game1.objects.find(obj => obj.name == "player" && !obj.destroyed);
	if (plr && plr.data.body) {
		targetX = plr.data.body.position.x;
		targetY = plr.data.body.position.y;
	}
	const weapons = ITEMS_GUNS;
	weapons.forEach(id => {
		item_create(game1, id, targetX, targetY, false, false);
	});
}

function cheat_all_ammo() {
	let targetX = 1250,
		targetY = 1250;
	let plr = game1.objects.find(obj => obj.name == "player" && !obj.destroyed);
	if (plr && plr.data.body) {
		targetX = plr.data.body.position.x;
		targetY = plr.data.body.position.y;
	}
	const ammo = ITEMS_AMMOS;
	ammo.forEach(id => {
		item_create(game1, id, targetX, targetY, false, false);
	});
}

function cheat_supplies() {
	let targetX = 1250,
		targetY = 1250;
	let plr = game1.objects.find(obj => obj.name == "player" && !obj.destroyed);
	if (plr && plr.data.body) {
		targetX = plr.data.body.position.x;
		targetY = plr.data.body.position.y;
	}
	const supplies = [
		ITEM_WATER, ITEM_CANNED_MEAT, ITEM_FUEL, ITEM_HEALTH,
		ITEM_HEALTH_GREEN, ITEM_SHIELD, ITEM_SHIELD_GREEN,
		ITEM_SHIELD_RAINBOW, ITEM_SHADOW_SHIELD, ITEM_ANUBIS_REGEN_SHIELD,
		ITEM_BOSSIFIER, ITEM_AMMO,
		ITEM_PLASMA, ITEM_RED_PLASMA, ITEM_ROCKET,
		ITEM_RAINBOW_AMMO, ITEM_FISH_BONE, ITEM_VENOM,
	];
	supplies.forEach(id => {
		item_create(game1, id, targetX, targetY, false, false);
	});
}

function cheat_godmode() {
	game1.godmode = !game1.godmode;
}

function cheat_all_bosses() {
	game1.all_enemies_are_bosses = !game1.all_enemies_are_bosses;
}

function cheat_no_enemy_loot() {
	DROP_ITEMS = !DROP_ITEMS;
}

function cheat_infinite_ammo() {
	NEED_AMMO = !NEED_AMMO;
}

function cheat_teleport(x, y) {
	let plr = game1.objects.find(obj => obj.name == "player" && !obj.destroyed);
	if (plr && plr.data.body) {
		Matter.Body.setPosition(plr.data.body, {
			x: x,
			y: y
		});
		Matter.Body.setVelocity(plr.data.body, {
			x: 0,
			y: 0
		});
	}
}
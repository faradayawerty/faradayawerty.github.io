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
	const weapons = [
		ITEM_GUN, ITEM_DESERT_EAGLE, ITEM_REVOLVER, ITEM_SHOTGUN,
		ITEM_MINIGUN,
		ITEM_PLASMA_LAUNCHER, ITEM_PLASMA_PISTOL, ITEM_RED_PISTOLS,
		ITEM_RED_SHOTGUN, ITEM_GREEN_GUN, ITEM_SWORD, ITEM_ROCKET_LAUNCHER,
		ITEM_ROCKET_SHOTGUN, ITEM_RAINBOW_PISTOLS, ITEM_LASER_GUN,
		ITEM_HORN, ITEM_JUNK_CANNON
	];
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
	const ammo = [
		ITEM_AMMO,
		ITEM_PLASMA,
		ITEM_RED_PLASMA,
		ITEM_ROCKET,
		ITEM_RAINBOW_AMMO,
		ITEM_FISH_BONE
	];
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
		ITEM_SHIELD_RAINBOW, ITEM_BOSSIFIER, ITEM_AMMO,
		ITEM_PLASMA, ITEM_RED_PLASMA, ITEM_ROCKET,
		ITEM_RAINBOW_AMMO, ITEM_FISH_BONE
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
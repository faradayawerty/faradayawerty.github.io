function cheat_all_weapons() {
	item_create(game1, ITEM_GUN, 1250, 1250, false, false);
	item_create(game1, ITEM_SHOTGUN, 1250, 1250, false, false);
	item_create(game1, ITEM_MINIGUN, 1250, 1250, false, false);
	item_create(game1, ITEM_PLASMA_LAUNCHER, 1250, 1250, false, false);
	item_create(game1, ITEM_PLASMA_PISTOL, 1250, 1250, false, false);
	item_create(game1, ITEM_RED_PISTOLS, 1250, 1250, false, false);
	item_create(game1, ITEM_RED_SHOTGUN, 1250, 1250, false, false);
	item_create(game1, ITEM_GREEN_GUN, 1250, 1250, false, false);
	item_create(game1, ITEM_SWORD, 1250, 1250, false, false);
	item_create(game1, ITEM_ROCKET_LAUNCHER, 1250, 1250, false, false);
	item_create(game1, ITEM_ROCKET_SHOTGUN, 1250, 1250, false, false);
	item_create(game1, ITEM_RAINBOW_PISTOLS, 1250, 1250, false, false);
	item_create(game1, ITEM_LASER_GUN, 1250, 1250, false, false);
	item_create(game1, ITEM_HORN, 1250, 1250, false, false);
	item_create(game1, ITEM_JUNK_CANNON, 1250, 1250, false, false);
}

function cheat_supplies() {
	item_create(game1, ITEM_WATER, 1250, 1250, false, false);
	item_create(game1, ITEM_CANNED_MEAT, 1250, 1250, false, false);
	item_create(game1, ITEM_FUEL, 1250, 1250, false, false);
	item_create(game1, ITEM_HEALTH, 1250, 1250, false, false);
	item_create(game1, ITEM_HEALTH_GREEN, 1250, 1250, false, false);
	item_create(game1, ITEM_SHIELD, 1250, 1250, false, false);
	item_create(game1, ITEM_SHIELD_GREEN, 1250, 1250, false, false);
	item_create(game1, ITEM_SHIELD_RAINBOW, 1250, 1250, false, false);
	item_create(game1, ITEM_BOSSIFIER, 1250, 1250, false, false);
	item_create(game1, ITEM_AMMO, 1250, 1250, false, false);
	item_create(game1, ITEM_PLASMA, 1250, 1250, false, false);
	item_create(game1, ITEM_RED_PLASMA, 1250, 1250, false, false);
	item_create(game1, ITEM_ROCKET, 1250, 1250, false, false);
	item_create(game1, ITEM_RAINBOW_AMMO, 1250, 1250, false, false);
	item_create(game1, ITEM_FISH_BONE, 1250, 1250, false, false);
}

function cheat_godmode() {
	game1.godmode = !game1.godmode;
}

function cheat_all_bosses() {
	game1.all_enemies_are_bosses = !game1.all_enemies_are_bosses;
}
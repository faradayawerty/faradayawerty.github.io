let DEBUG_LEVEL = false;

function levels_set(g, level, old_level = null) {
	let sepIdx = level.indexOf("x");
	let level_x = Number(level.substring(0, sepIdx));
	let level_y = Number(level.substring(sepIdx + 1));
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	let player_object = game_object_find_closest(g, Ox + 1250, Oy + 1250,
		"player", 3536);
	if (player_object && !player_object.data.ai_controlled) {
		g.respawn_level = level;
	}
	let level_visited = true;
	let vIdx = g.visited_levels.indexOf(level);
	if (vIdx === -1) {
		level_visited = false;
		let available_tiles = getAvailableTiles(g, level);
		if (available_tiles.length < 1) {
			available_tiles = [LEVEL_TILE_DEFAULT];
		}
		g.assigned_tiles.push(getRandomTileByWeight(g, level, available_tiles));
		if (DEBUG_LEVEL) {
			g.debug_console.unshift("new level: " + level);
			g.debug_console.unshift("available tiles: " + available_tiles);
		}
		g.visited_levels.push(level);
		vIdx = g.visited_levels.length - 1;
	}
	let tile = g.assigned_tiles[vIdx];
	if (player_object && !player_object.data.ai_controlled) {
		let tileTheme = Math.floor(tile / 200) * 200;
		if (tileTheme === THEME_DESERT) {
			achievement_do(player_object.data.achievements_element.data
				.achievements, "desert biome", player_object.data
				.achievements_shower_element);
		}
		else if (tileTheme === THEME_TAIGA) {
			achievement_do(player_object.data.achievements_element.data
				.achievements, "taiga biome", player_object.data
				.achievements_shower_element);
		}
		else if (tileTheme === THEME_BLOOD_FOREST) {
			achievement_do(player_object.data.achievements_element.data
				.achievements, "blood forest biome", player_object.data
				.achievements_shower_element);
		}
	}
	let config = TILES[tile] || TILES[LEVEL_TILE_DEFAULT];
	if (config.populate) {
		config.populate(g, Ox, Oy, level_visited);
	}
	if (!level_visited) {
		if (player_object) {
			let achievements = player_object.data.achievements_element.data
				.achievements;
			if (achievement_get(achievements, "pick an item").done && !
				achievement_get(
					achievements, "get a gun").done)
				item_create(g, ITEM_GUN, Ox + Math.random() * 2500, Oy + Math
					.random() * 2500, null, tile);
			if (!achievement_get(achievements, "pick an item").done ||
				achievement_get(
					achievements, "get a gun").done && !achievement_get(
					achievements, "shoot 'em up")
				.done)
				item_create(g, ITEM_AMMO, Ox + Math.random() * 2500, Oy + Math
					.random() * 2500, null, tile);
		}
		if (config.spawn_items !== false) {
			levels_spawn_items(g, Ox, Oy, tile, player_object);
		}
		if (config.spawn_enemies !== false) {
			levels_spawn_enemies(g, Ox, Oy, player_object, tile);
		}
		if (config.spawn_animals) {
			levels_spawn_animals(g, Ox, Oy, tile);
		}
	}
	let base_color = config.base_color || "gray";
	decorative_level_base_create(g, Ox, Oy, base_color);
	game_autosave(g);
}

function levels_spawn_animals(g, Ox, Oy, tile = LEVEL_TILE_DEFAULT) {
	let N = Math.random() * 80 - 77;
	if (LEVEL_TILES_FOREST_ZONE.includes(tile) || tile ===
		LEVEL_TILE_CITY_PARK) {
		N = Math.random() * 20 - 17;
	}
	let tileTheme = Math.floor(tile / 200) * 200;
	let possibleAnimals = ["deer", "raccoon"];
	if (tileTheme === THEME_DESERT) {
		possibleAnimals = ["snake", "scorpion"];
		N = Math.random() * 20 - 17;
	}
	else if (tile === LEVEL_TILE_CITY_PARK) {
		possibleAnimals = ["raccoon"];
	}
	for (let i = 0; i < N; i++) {
		let chosenType = possibleAnimals[Math.floor(Math.random() *
			possibleAnimals.length)];
		animal_create(
			g,
			Ox + 1250 + (0.5 - Math.random()) * 1500,
			Oy + 1250 + (0.5 - Math.random()) * 1500,
			chosenType
		);
	}
}

function levels_spawn_enemies(g, Ox, Oy, player_object, tile =
	LEVEL_TILE_DEFAULT) {
	if (!g.settings.enemies_spawn)
		return;
	if (player_object) {
		if (!achievement_get(player_object.data.achievements_element.data
				.achievements, "get a gun").done)
			return;
		let m = 0.33 * (
			player_object.data.health / player_object.data.max_health +
			player_object.data.thirst / player_object.data.max_thirst +
			player_object.data.hunger / player_object.data.max_hunger
		);
		let bd = enemy_boss_distance_to_player(g);
		if (-1 < bd && bd < 5000) m *= 0.45;
		for (let i = 0; i < Math.random() * 60 * m - 10; i++) {
			enemy_create(
				g,
				Ox + 1250 + (0.5 - Math.random()) * 1500,
				Oy + 1250 + (0.5 - Math.random()) * 1500,
				false,
				false,
				"random",
				tile
			);
		}
	}
}

function levels_spawn_items(g, Ox, Oy, tile = LEVEL_TILE_DEFAULT,
	player_object) {
	let tile_data = TILES[tile];
	if (tile_data && typeof tile_data.populate_with_items === "function") {
		tile_data.populate_with_items(g, Ox, Oy, tile);
	}
	else {
		let N = Math.random() * 5;
		if (LEVEL_TILES_CITY_ZONE.includes(tile) || LEVEL_TILES_SUBURBAN_ZONE
			.includes(tile)) {
			N = Math.random() * 7 + 3;
		}
		for (let i = 0; i < N; i++) {
			item_spawn(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500,
				null, tile);
		}
	}
}

function level_visible(g, level, exclude_player_object = null) {
	for (let i = 0; i < g.objects.length; i++) {
		if (g.objects[i].name == "player" && !g.objects[i].destroyed && g
			.objects[i].data.want_level == level && g.objects[i] !=
			exclude_player_object) {
			return true;
		}
	}
	return false;
}

function level_get_neighbour_west(level) {
	let sepIdx = level.indexOf("x");
	let level_x = Number(level.substring(0, sepIdx));
	return (level_x - 1) + "x" + level.substring(sepIdx + 1);
}

function level_get_neighbour_east(level) {
	let sepIdx = level.indexOf("x");
	let level_x = Number(level.substring(0, sepIdx));
	return (level_x + 1) + "x" + level.substring(sepIdx + 1);
}

function level_get_neighbour_north(level) {
	let sepIdx = level.indexOf("x");
	let level_y = Number(level.substring(sepIdx + 1));
	return level.substring(0, sepIdx) + "x" + (level_y - 1);
}

function level_get_neighbour_south(level) {
	let sepIdx = level.indexOf("x");
	let level_y = Number(level.substring(sepIdx + 1));
	return level.substring(0, sepIdx) + "x" + (level_y + 1);
}

function level_tile_get_neighbour_west(g, level) {
	let west_level = level_get_neighbour_west(level);
	let il = g.visited_levels.indexOf(west_level);
	return il > -1 ? g.assigned_tiles[il] : LEVEL_TILE_VOID;
}

function level_tile_get_neighbour_east(g, level) {
	let east_level = level_get_neighbour_east(level);
	let il = g.visited_levels.indexOf(east_level);
	return il > -1 ? g.assigned_tiles[il] : LEVEL_TILE_VOID;
}

function level_tile_get_neighbour_north(g, level) {
	let north_level = level_get_neighbour_north(level);
	let il = g.visited_levels.indexOf(north_level);
	return il > -1 ? g.assigned_tiles[il] : LEVEL_TILE_VOID;
}

function level_tile_get_neighbour_south(g, level) {
	let south_level = level_get_neighbour_south(level);
	let il = g.visited_levels.indexOf(south_level);
	return il > -1 ? g.assigned_tiles[il] : LEVEL_TILE_VOID;
}

function isCompatible(tile, neighbourTile, dir) {
	if (neighbourTile === LEVEL_TILE_VOID)
		return true;
	if (!TILES[tile] || !TILES[neighbourTile])
		return false;
	let opposite;
	if (dir === "N") opposite = "S";
	else if (dir === "S") opposite = "N";
	else if (dir === "E") opposite = "W";
	else opposite = "E";
	return (
		TILES[tile].connections[dir] ===
		TILES[neighbourTile].connections[opposite]
	);
}

function getAvailableTiles(g, level) {
	let nW = level_tile_get_neighbour_west(g, level);
	let nE = level_tile_get_neighbour_east(g, level);
	let nN = level_tile_get_neighbour_north(g, level);
	let nS = level_tile_get_neighbour_south(g, level);
	let isStartingPosition = (level === "0x0");
	let res = [];
	let keys = Object.keys(TILES);
	for (let i = 0; i < keys.length; i++) {
		let tile = Number(keys[i]);
		if (tile === LEVEL_TILE_START && !isStartingPosition) {
			continue;
		}
		if (isCompatible(tile, nW, "W") &&
			isCompatible(tile, nE, "E") &&
			isCompatible(tile, nN, "N") &&
			isCompatible(tile, nS, "S")) {
			res.push(tile);
		}
	}
	return res;
}

function getRandomTileByWeight(g, level, availableTiles) {
	if (availableTiles.length === 0) return LEVEL_TILE_DEFAULT;
	let sepIdx = level.indexOf("x");
	let lx = Number(level.substring(0, sepIdx));
	let ly = Number(level.substring(sepIdx + 1));
	let distance = Math.sqrt(lx * lx + ly * ly);
	let potentialThemes = [THEME_FOREST, THEME_DESERT, THEME_TAIGA,
		THEME_BLOOD_FOREST
	];
	let activeThemes = [];
	for (let i = 0; i < potentialThemes.length; i++) {
		let theme = potentialThemes[i];
		let available = false;
		if (theme === THEME_FOREST) available = true;
		else if (theme === THEME_DESERT) available = g.available_enemies
			.includes("shooting");
		else if (theme === THEME_TAIGA) available = g.available_enemies
			.includes("mummy");
		else if (theme === THEME_BLOOD_FOREST) available = g.available_enemies
			.includes("ushanka");
		if (available) {
			activeThemes.push(theme);
		}
	}
	if (activeThemes.length === 0) activeThemes = [THEME_FOREST];
	let cycleIndex = Math.floor(distance / 3) % activeThemes.length;
	let targetTheme = activeThemes[cycleIndex];
	let allowedTiles = [];
	for (let i = 0; i < availableTiles.length; i++) {
		let tileId = availableTiles[i];
		let tileTheme = Math.floor(tileId / 200) * 200;
		if (tileTheme === targetTheme) {
			allowedTiles.push(tileId);
		}
	}
	if (allowedTiles.length === 0) allowedTiles = availableTiles;
	let nW = level_tile_get_neighbour_west(g, level);
	let nE = level_tile_get_neighbour_east(g, level);
	let nN = level_tile_get_neighbour_north(g, level);
	let nS = level_tile_get_neighbour_south(g, level);
	let neighborThemes = [];
	if (nW > 0) neighborThemes.push(Math.floor(nW / 200) * 200);
	if (nE > 0) neighborThemes.push(Math.floor(nE / 200) * 200);
	if (nN > 0) neighborThemes.push(Math.floor(nN / 200) * 200);
	if (nS > 0) neighborThemes.push(Math.floor(nS / 200) * 200);
	let totalWeight = 0;
	let weights = [];
	for (let i = 0; i < allowedTiles.length; i++) {
		let tileId = allowedTiles[i];
		let baseWeight = TILES[tileId].weight || 1;
		let tileTheme = Math.floor(tileId / 200) * 200;
		let match = false;
		for (let j = 0; j < neighborThemes.length; j++) {
			if (neighborThemes[j] === tileTheme) {
				match = true;
				break;
			}
		}
		let finalWeight = match ? baseWeight * 8 : baseWeight;
		totalWeight += finalWeight;
		weights.push(finalWeight);
	}
	let random = Math.random() * totalWeight;
	let currentSum = 0;
	for (let i = 0; i < allowedTiles.length; i++) {
		currentSum += weights[i];
		if (random <= currentSum) {
			return allowedTiles[i];
		}
	}
	return allowedTiles[0];
}
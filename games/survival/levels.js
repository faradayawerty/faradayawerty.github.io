let DEBUG_LEVEL = false;

function levels_set(g, level, old_level = null) {
	let [level_x, level_y] = level.split("x").map(Number);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	let player_object = game_object_find_closest(g, Ox + 1250, Oy + 1250,
		"player", 3536);
	if (player_object && !player_object.data.ai_controlled) {
		g.respawn_level = level;
	}
	let level_visited = true;
	if (!g.visited_levels.includes(level)) {
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
	}
	let tile = g.assigned_tiles[g.visited_levels.indexOf(level)];
	let config = TILES[tile] || TILES[LEVEL_TILE_DEFAULT];
	if (config.populate) {
		config.populate(g, Ox, Oy, level_visited);
	}
	if (!level_visited) {
		if (config.spawn_items !== false) {
			levels_spawn_items(g, Ox, Oy, tile);
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
	if (LEVEL_TILES_FOREST_ZONE.includes(tile) || tile === LEVEL_TILE_CITY_PARK)
		N = Math.random() * 20 - 17;
	for (let i = 0; i < N; i++) {
		let animals = ["deer", "raccoon"];
		if (tile === LEVEL_TILE_CITY_PARK)
			animals = ["raccoon"];
		animal_create(
			g,
			Ox + 1250 + (0.5 - Math.random()) * 1500,
			Oy + 1250 + (0.5 - Math.random()) * 1500,
			animals[Math.floor(Math.random() * animals.length)]
		);
	}
}

function levels_spawn_enemies(g, Ox, Oy, player_object, tile =
	LEVEL_TILE_DEFAULT) {
	if (
		!g.settings.enemies_spawn ||
		(g.visited_levels.length < 05 && Math.random() < 1.00) ||
		(g.visited_levels.length < 10 && Math.random() < 0.75) ||
		(g.visited_levels.length < 15 && Math.random() < 0.50) ||
		(g.visited_levels.length < 20 && Math.random() < 0.25)
	)
		return;
	if (player_object) {
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

function levels_spawn_items(g, Ox, Oy, tile = LEVEL_TILE_DEFAULT) {
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
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	return (level_x - 1) + "x" + level_y;
}

function level_get_neighbour_east(level) {
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	return (level_x + 1) + "x" + level_y;
}

function level_get_neighbour_north(level) {
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	return level_x + "x" + (level_y - 1);
}

function level_get_neighbour_south(level) {
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	return level_x + "x" + (level_y + 1);
}

function level_tile_get_neighbour_west(g, level) {
	let res = LEVEL_TILE_VOID;
	let west_level = level_get_neighbour_west(level);
	let il = g.visited_levels.indexOf(west_level);
	if (il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_east(g, level) {
	let res = LEVEL_TILE_VOID;
	let east_level = level_get_neighbour_east(level);
	let il = g.visited_levels.indexOf(east_level);
	if (il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_north(g, level) {
	let res = LEVEL_TILE_VOID;
	let north_level = level_get_neighbour_north(level);
	let il = g.visited_levels.indexOf(north_level);
	if (il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_south(g, level) {
	let res = LEVEL_TILE_VOID;
	let south_level = level_get_neighbour_south(level);
	let il = g.visited_levels.indexOf(south_level);
	if (il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function isCompatible(tile, neighbourTile, dir) {
	if (neighbourTile === LEVEL_TILE_VOID)
		return true;
	if (!TILES[tile] || !TILES[neighbourTile])
		return false;
	const opposite = {
		N: "S",
		S: "N",
		E: "W",
		W: "E"
	};
	return (
		TILES[tile].connections[dir] ===
		TILES[neighbourTile].connections[opposite[dir]]
	);
}

function getAvailableTiles(g, level) {
	const neighbours = {
		W: level_tile_get_neighbour_west(g, level),
		E: level_tile_get_neighbour_east(g, level),
		N: level_tile_get_neighbour_north(g, level),
		S: level_tile_get_neighbour_south(g, level)
	};
	const isStartingPosition = (level === "0x0");
	return Object.keys(TILES)
		.map(Number)
		.filter(tile => {
			if (tile === LEVEL_TILE_START && !isStartingPosition) {
				return false;
			}
			return Object.entries(neighbours).every(
				([dir, nTile]) => isCompatible(tile, nTile, dir)
			);
		});
}

function getRandomTileByWeight(g, level, availableTiles) {
	if (availableTiles.length === 0) return LEVEL_TILE_DEFAULT;
	let allowedTiles = availableTiles.filter(tileId => {
		let tileTheme = Math.floor(tileId / 200) * 200;
		if (tileTheme === THEME_DESERT) {
			return g.available_enemies.includes("shooting");
		}
		return true;
	});
	if (allowedTiles.length === 0) allowedTiles = [LEVEL_TILE_DEFAULT];
	let neighborThemes = [
		level_tile_get_neighbour_west(g, level),
		level_tile_get_neighbour_east(g, level),
		level_tile_get_neighbour_north(g, level),
		level_tile_get_neighbour_south(g, level)
	].filter(id => id > 0).map(id => Math.floor(id / 200) * 200);
	let totalWeight = 0;
	let weights = allowedTiles.map(tileId => {
		let baseWeight = TILES[tileId].weight || 1;
		let tileTheme = Math.floor(tileId / 200) * 200;
		let finalWeight = neighborThemes.includes(tileTheme) ?
			baseWeight * 8 : baseWeight;
		totalWeight += finalWeight;
		return finalWeight;
	});
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
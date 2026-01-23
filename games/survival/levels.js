let LEVEL_TILE_VOID = 0;
let LEVEL_TILE_START = 1;

let LEVEL_TILE_ROAD_VERTICAL = 2;
let LEVEL_TILE_ROAD_HORIZONTAL = 3;
let LEVEL_TILE_DEFAULT = 4;
let LEVEL_TILE_ROAD_CROSSROAD = 5;
let LEVEL_TILE_ROAD_TURN_WN = 6;
let LEVEL_TILE_ROAD_TURN_WS = 7;
let LEVEL_TILE_ROAD_TURN_EN = 8;
let LEVEL_TILE_ROAD_TURN_ES = 9;

let LEVEL_TILE_CITY_POLICE = 10;
let LEVEL_TILE_CITY_HOSPITAL = 11;
let LEVEL_TILE_CITY_FIRE_STATION = 12;
let LEVEL_TILE_RESIDENTIAL_L = 13;
let LEVEL_TILE_CITY_GAS_STATION = 14; 

let LEVEL_TILES_FOREST_ZONE = [
	LEVEL_TILE_DEFAULT,
	LEVEL_TILE_ROAD_HORIZONTAL,
	LEVEL_TILE_ROAD_VERTICAL,
	LEVEL_TILE_ROAD_CROSSROAD,
	LEVEL_TILE_ROAD_TURN_WN,
	LEVEL_TILE_ROAD_TURN_WS,
	LEVEL_TILE_ROAD_TURN_EN,
	LEVEL_TILE_ROAD_TURN_ES
];

let LEVEL_TILES_CITY_ZONE = [
	LEVEL_TILE_CITY_POLICE,
	LEVEL_TILE_CITY_HOSPITAL,
	LEVEL_TILE_CITY_FIRE_STATION,
	LEVEL_TILE_RESIDENTIAL_L,
	LEVEL_TILE_CITY_GAS_STATION
];

let TILES = {

	[LEVEL_TILE_CITY_GAS_STATION]: {
		weight: 25, 
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		}
	},

	[LEVEL_TILE_CITY_POLICE]: {
		weight: 25,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		}
	}, 
	[LEVEL_TILE_CITY_HOSPITAL]: {
		weight: 25,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		}
	}, 
	[LEVEL_TILE_CITY_FIRE_STATION]: {
		weight: 25,
		connections: {
			N: 1,
			E: 0,
			S: 1,
			W: 0
		}
	}, 
	[LEVEL_TILE_RESIDENTIAL_L]: {
		weight: 50,
		connections: {
			N: 1,
			E: 1,
			S: 0,
			W: 0
		}
	},

	[LEVEL_TILE_DEFAULT]: {
		weight: 100,
		connections: {
			N: 0,
			E: 0,
			S: 0,
			W: 0
		}
	},

	[LEVEL_TILE_START]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		}
	},

	[LEVEL_TILE_ROAD_HORIZONTAL]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		}
	},

	[LEVEL_TILE_ROAD_VERTICAL]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 1,
			W: 0
		}
	},

	[LEVEL_TILE_ROAD_CROSSROAD]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		}
	},

	[LEVEL_TILE_ROAD_TURN_WN]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 0,
			W: 1
		}
	},

	[LEVEL_TILE_ROAD_TURN_WS]: {
		weight: 100,
		connections: {
			N: 0,
			E: 0,
			S: 1,
			W: 1
		}
	},

	[LEVEL_TILE_ROAD_TURN_EN]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 0,
			W: 0
		}
	},

	[LEVEL_TILE_ROAD_TURN_ES]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 1,
			W: 0
		}
	}
};

function levels_spawn_animals(g, Ox, Oy, tile = LEVEL_TILE_DEFAULT) {

	let N = Math.random() * 80 - 77;

	if (tile === LEVEL_TILE_DEFAULT)
		N = Math.max(0, Math.random() * 20 - 18) + 1;
	else if (LEVEL_TILES_FOREST_ZONE.includes())
		N = Math.random() * 20 - 17;

	for (let i = 0; i < N; i++) {
		let animals = ["deer", "raccoon"];
		animal_create(
			g,
			Ox + 1250 + (0.5 - Math.random()) * 1500,
			Oy + 1250 + (0.5 - Math.random()) * 1500,
			animals[Math.floor(Math.random() * animals.length)]
		);
	}

}

function levels_spawn_enemies(g, Ox, Oy, player_object, tile = LEVEL_TILE_DEFAULT) {
	if (player_object) {
		let m = 0.33 * (
			player_object.data.health / player_object.data.max_health +
			player_object.data.thirst / player_object.data.max_thirst +
			player_object.data.hunger / player_object.data.max_hunger
		);
		let bd = enemy_boss_distance_to_player(g);
		if (-1 < bd && bd < 5000) m *= 0.45;

		for (let i = 0; i < Math.random() * 60 * m - 10; i++)
			enemy_create(
				g,
				Ox + 1250 + (0.5 - Math.random()) * 1500,
				Oy + 1250 + (0.5 - Math.random()) * 1500
			);
	}
}

function levels_spawn_items(g, Ox, Oy, tile = LEVEL_TILE_DEFAULT) {
	let N = Math.random() * 5;
	if (LEVEL_TILES_CITY_ZONE.includes(tile))
		N = Math.random() * 7 + 3;
	for (let i = 0; i < N; i++)
		item_spawn(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, enemy_type = null, tile = tile);
}

function levels_set(g, level, old_level = null) {

	g.debug_console.unshift("time from previous level creation " + g.level_set_delay);
	g.level_set_delay = 0;

	let [level_x, level_y] = level.split("x").map(Number);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

	let player_object = game_object_find_closest(
		g, Ox + 1250, Oy + 1250, "player", 3536
	);

	if (player_object && !player_object.data.ai_controlled)
		g.respawn_level = level;
	level = level

	let level_visited = true;

	
	if (!g.visited_levels.includes(level)) {

		level_visited = false;

		let available_tiles = getAvailableTiles(g, level);

		if (available_tiles.length < 1)
			available_tiles = [LEVEL_TILE_DEFAULT];

		g.assigned_tiles.push(
			getRandomTileByWeight(available_tiles)
		);

		g.debug_console.unshift("new level: " + level);
		g.debug_console.unshift("available tiles: " + available_tiles);
		g.visited_levels.push(level);
	}

	let tile = g.assigned_tiles[g.visited_levels.indexOf(level)];

	let base_color = "gray";

	if (tile == LEVEL_TILE_START) {
		decorative_building_create(g, Ox + 40, Oy + 40, 900, 900);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050, 525);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 525);
		decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
		decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
		decorative_grass_create(g, Ox, Oy, 1090, 1090, false);
		decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
		decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");

	} else if (tile == LEVEL_TILE_CITY_GAS_STATION) {
		
		decorative_level_base_create(g, Ox, Oy, "gray");

		
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);

		
		
		
		decorative_gas_station_create(g, Ox + 250, Oy + 150, 2000, 900, level_visited);

		
		decorative_parkinglot_create(g, Ox + 250, Oy + 1400, 2000, 500, level_visited, ["default", "pickup"]);
		decorative_parkinglot_create(g, Ox + 250, Oy + 1950, 2000, 500, level_visited, ["default", "pickup"]);

		
		decorative_grass_create(g, Ox, Oy, 200, 2500, true); 
		decorative_grass_create(g, Ox + 2300, Oy, 200, 2500, true); 

		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_CITY_POLICE) {
		decorative_level_base_create(g, Ox, Oy);
		decorative_police_station_v3(g, Ox + 250, Oy + 50, 2000, 900);
		decorative_road_create(g, Ox, Oy + 1050, 2500, 200);
		decorative_parkinglot_create(g, Ox + 100, Oy + 1860, 2300, 625, level_visited = level_visited, car_types = ["default", "police"]);
		decorative_parkinglot_create(g, Ox + 100, Oy + 1310, 2300, 525, level_visited = level_visited, car_types = ["default", "police"]);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_CITY_HOSPITAL) {
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050, true);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050, true);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 1050, level_visited = level_visited, car_types = ["default", "ambulance"]);
		decorative_hospital_v3(g, Ox + 1440, Oy + 150, 950, 850);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_CITY_FIRE_STATION) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		decorative_fire_station_v3(g, Ox + 1400, Oy + 40, 1050, 1150);
		decorative_parkinglot_create(g, Ox + 1400, Oy + 1250, 1050, 1200, level_visited = level_visited, car_types = ["default", "fireman"]);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_RESIDENTIAL_L) {
		decorative_level_base_create(g, Ox, Oy);
		decorative_rectangle_create(g, Ox + 1130, Oy + 1130, 1370, 240, "#999999", "#999999");
		decorative_rectangle_create(g, Ox + 1130, Oy, 240, 1370, "#999999", "#999999");
		decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200); 
		decorative_road_create(g, Ox + 1150, Oy, 200, 1350); 
		decorative_house_v2(g, Ox + 150, Oy + 150, 850, 850, "right", "#d2b48c", "#8b4513");
		decorative_house_v2(g, Ox + 1500, Oy + 150, 850, 850, "down", "#e3dac9", "#5d2e0c");
		decorative_house_v2(g, Ox + 1500, Oy + 1500, 850, 850, "up", "#c2b280", "#4a2c2a");
		decorative_grass_create(g, Ox, Oy + 1000, 1400, 1450, true);
		decorative_rectangle_create(g, Ox + 1000, Oy + 500, 145, 150, "#999999", "#999999");
		decorative_rectangle_create(g, Ox + 1850, Oy + 1000, 150, 145, "#999999", "#999999");
		decorative_rectangle_create(g, Ox + 1850, Oy + 1355, 150, 145, "#999999", "#999999");
		base_color = DECORATIVE_COLOR_GRASS;
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_CROSSROAD) {
		decorative_grass_create(g, Ox, Oy, 1090, 1090);
		decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
		decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
		decorative_grass_create(g, Ox + 1410, Oy + 1410, 1090, 1090);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_TURN_WN) {
		decorative_grass_create(g, Ox, Oy, 1090, 1090);
		decorative_grass_create(g, Ox + 1410, Oy, 1090, 2500);
		decorative_grass_create(g, Ox, Oy + 1410, 1410, 1090);
		decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_TURN_WS) {
		decorative_grass_create(g, Ox, Oy, 2500, 1090);
		decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
		decorative_grass_create(g, Ox + 1410, Oy + 1090, 1090, 1410);
		decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_TURN_ES) {
		decorative_grass_create(g, Ox, Oy, 2500, 1090);
		decorative_grass_create(g, Ox, Oy + 1090, 1090, 1410);
		decorative_grass_create(g, Ox + 1410, Oy + 1410, 1090, 1090);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_TURN_EN) {
		decorative_grass_create(g, Ox, Oy, 1090, 1500);
		decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
		decorative_grass_create(g, Ox, Oy + 1410, 2500, 1090);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_HORIZONTAL) {
		decorative_grass_create(g, Ox, Oy, 2500, 1090);
		decorative_grass_create(g, Ox, Oy + 1410, 2500, 1090);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_ROAD_VERTICAL) {
		decorative_grass_create(g, Ox, Oy, 1090, 2500);
		decorative_grass_create(g, Ox + 1410, Oy, 1090, 2500);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	} else if (tile == LEVEL_TILE_DEFAULT) {
		decorative_grass_create(g, Ox, Oy, 2420, 2420);
		base_color = DECORATIVE_COLOR_GRASS;
		if (!level_visited) {
			levels_spawn_items(g, Ox, Oy, tile = tile);
			levels_spawn_animals(g, Ox, Oy, tile = tile);
			levels_spawn_enemies(g, Ox, Oy, player_object, tile = tile);
		}
	}
	decorative_level_base_create(g, Ox, Oy, base_color);
}



function level_visible(g, level, exclude_player_object = null) {
	for (let i = 0; i < g.objects.length; i++) {
		if (g.objects[i].name == "player" && !g.objects[i].destroyed && g.objects[i].data.want_level == level && g.objects[i] != exclude_player_object) {
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

function getRandomTileByWeight(availableTiles) {
	if (availableTiles.length === 0) return LEVEL_TILE_DEFAULT;

	
	let totalWeight = availableTiles.reduce((sum, tileId) => {
		return sum + (TILES[tileId].weight || 1); 
	}, 0);

	let random = Math.random() * totalWeight;
	let currentSum = 0;

	for (let tileId of availableTiles) {
		currentSum += (TILES[tileId].weight || 1);
		if (random <= currentSum) {
			return tileId;
		}
	}
	return availableTiles[0];
}

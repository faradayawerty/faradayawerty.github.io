let THEME_FOREST = 0;
let THEME_DESERT = 200;
let THEME_TAIGA = 400;
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
let LEVEL_TILE_CITY_GAS_STATION = 14;
let LEVEL_TILE_RESIDENTIAL_NW = 15;
let LEVEL_TILE_RESIDENTIAL_NE = 16;
let LEVEL_TILE_RESIDENTIAL_T_SOUTH = 17;
let LEVEL_TILE_CITY_PARK = 18;
let LEVEL_TILE_HUT_IN_FOREST = 19;
let LEVEL_TILE_ROAD_CROSSROAD_DESERT = THEME_DESERT + 5;
let LEVEL_TILE_ROAD_VERTICAL_DESERT = THEME_DESERT + LEVEL_TILE_ROAD_VERTICAL;
let LEVEL_TILE_ROAD_HORIZONTAL_DESERT = THEME_DESERT +
	LEVEL_TILE_ROAD_HORIZONTAL;
let LEVEL_TILE_DEFAULT_DESERT = THEME_DESERT + LEVEL_TILE_DEFAULT;
let LEVEL_TILE_ROAD_TURN_WN_DESERT = THEME_DESERT + LEVEL_TILE_ROAD_TURN_WN;
let LEVEL_TILE_ROAD_TURN_WS_DESERT = THEME_DESERT + LEVEL_TILE_ROAD_TURN_WS;
let LEVEL_TILE_ROAD_TURN_EN_DESERT = THEME_DESERT + LEVEL_TILE_ROAD_TURN_EN;
let LEVEL_TILE_ROAD_TURN_ES_DESERT = THEME_DESERT + LEVEL_TILE_ROAD_TURN_ES;
let LEVEL_TILES_FOREST_ZONE = [
	LEVEL_TILE_DEFAULT,
	LEVEL_TILE_ROAD_HORIZONTAL,
	LEVEL_TILE_ROAD_VERTICAL,
	LEVEL_TILE_ROAD_CROSSROAD,
	LEVEL_TILE_ROAD_TURN_WN,
	LEVEL_TILE_ROAD_TURN_WS,
	LEVEL_TILE_ROAD_TURN_EN,
	LEVEL_TILE_ROAD_TURN_ES,
	LEVEL_TILE_HUT_IN_FOREST
];
let LEVEL_TILES_CITY_ZONE = [
	LEVEL_TILE_CITY_POLICE,
	LEVEL_TILE_CITY_HOSPITAL,
	LEVEL_TILE_CITY_FIRE_STATION,
	LEVEL_TILE_CITY_GAS_STATION,
	LEVEL_TILE_CITY_PARK
];
let LEVEL_TILES_SUBURBAN_ZONE = [
	LEVEL_TILE_RESIDENTIAL_NW,
	LEVEL_TILE_RESIDENTIAL_NE,
	LEVEL_TILE_RESIDENTIAL_T_SOUTH
];
let TILES = {
	[LEVEL_TILE_HUT_IN_FOREST]: {
		weight: 25,
		connections: {
			N: 0,
			E: 0,
			S: 0,
			W: 0
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_no_tree_zone_create(g, Ox + 800, Oy + 800, 900,
				900);
			decorative_grass_create(g, Ox, Oy, 2500, 2500, true);
			decorative_rectangle_create(g, Ox + 1000, Oy + 1000, 500,
				500, "#554433", "transparent");
			decorative_house_v2(
				g,
				Ox + 1050, Oy + 1050,
				400, 400,
				"down",
				"#775533",
				"#442211"
			);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.floor(Math.random() * 5 + 3);
			for (let i = 0; i < N; i++) {
				item_spawn(
					g,
					Ox + 1100 + Math.random() * 300,
					Oy + 1100 + Math.random() * 300,
					null,
					tile
				);
			}
		}
	},
	[LEVEL_TILE_START]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: false,
		spawn_animals: false,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_building_create(g, Ox + 40, Oy + 40, 900, 900);
			decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050,
				525);
			decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050,
				525);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
			decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
			decorative_grass_create(g, Ox, Oy, 1090, 1090, false);
			decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200,
				"#222222", "#222222");
			decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500,
				"#222222", "#222222");
		}
	},
	[LEVEL_TILE_CITY_GAS_STATION]: {
		weight: 50,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy, visited) => {
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
			decorative_gas_station_create(g, Ox + 250, Oy + 150, 2000,
				900, visited);
			decorative_parkinglot_create(g, Ox + 250, Oy + 1400, 2000,
				500, visited, ["default", "pickup"]);
			decorative_parkinglot_create(g, Ox + 250, Oy + 1950, 2000,
				500, visited, ["default", "pickup"]);
			decorative_grass_create(g, Ox, Oy, 200, 2500, true);
			decorative_grass_create(g, Ox + 2300, Oy, 200, 2500, true);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.floor(Math.random() * 7 + 3);
			for (let i = 0; i < N; i++) {
				let rand = Math.random();
				if (rand < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else if (rand < 0.7) {
					item_create(g, ITEM_FUEL, Ox + 500 + Math.random() *
						1500, Oy + 300 + Math.random() * 500);
				}
				else {
					item_spawn(g, Ox + 280 + Math.random() * 400, Oy +
						200 + Math.random() * 600, null,
						LEVEL_TILE_RESIDENTIAL_T_SOUTH);
				}
			}
		}
	},
	[LEVEL_TILE_CITY_POLICE]: {
		weight: 50,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy, visited) => {
			decorative_police_station_v3(g, Ox + 250, Oy + 50, 2000,
				900);
			decorative_road_create(g, Ox, Oy + 1050, 2500, 200);
			decorative_parkinglot_create(g, Ox + 100, Oy + 1860, 2300,
				625, visited, ["default", "police"]);
			decorative_parkinglot_create(g, Ox + 100, Oy + 1310, 2300,
				525, visited, ["default", "police"]);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					item_spawn(g, Ox + 350 + Math.random() * 1800, Oy +
						150 + Math.random() * 700, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_CITY_HOSPITAL]: {
		weight: 50,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy, visited) => {
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
			decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050,
				true);
			decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050,
				true);
			decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050,
				1050, visited, ["default", "ambulance"]);
			decorative_hospital_v3(g, Ox + 1440, Oy + 150, 950, 850);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					item_spawn(g, Ox + 1540 + Math.random() * 750, Oy +
						250 + Math.random() * 650, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_CITY_FIRE_STATION]: {
		weight: 50,
		connections: {
			N: 1,
			E: 0,
			S: 1,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy, visited) => {
			decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
			decorative_fire_station_v3(g, Ox + 1400, Oy + 40, 1050,
				1150);
			decorative_parkinglot_create(g, Ox + 1400, Oy + 1250, 1050,
				1200, visited, ["default", "fireman"]);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					item_spawn(g, Ox + 1500 + Math.random() * 850, Oy +
						140 + Math.random() * 950, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_RESIDENTIAL_T_SOUTH]: {
		weight: 25,
		connections: {
			N: 0,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_rectangle_create(g, Ox, Oy + 1130, 2500, 240,
				"#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1130, Oy + 1130, 240,
				1370, "#999999", "#999999");
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
			decorative_house_v2(g, Ox + 150, Oy + 150, 850, 850, "down",
				"#d2b48c", "#8b4513");
			decorative_rectangle_create(g, Ox + 500, Oy + 1000, 150,
				145, "#999999", "#999999");
			decorative_house_v2(g, Ox + 1500, Oy + 150, 850, 850,
				"down", "#e3dac9", "#5d2e0c");
			decorative_rectangle_create(g, Ox + 1850, Oy + 1000, 150,
				145, "#999999", "#999999");
			decorative_house_v2(g, Ox + 150, Oy + 1500, 850, 850,
				"right", "#c2b280", "#4a2c2a");
			decorative_rectangle_create(g, Ox + 1000, Oy + 1850, 145,
				150, "#999999", "#999999");
			decorative_house_v2(g, Ox + 1500, Oy + 1500, 850, 850,
				"left", "#9fa9a3", "#4e5754");
			decorative_rectangle_create(g, Ox + 1355, Oy + 1850, 145,
				150, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
			decorative_grass_create(g, Ox, Oy + 1450, 100, 100, true);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			let houses = [
				[250, 250],
				[1600, 250],
				[250, 1600],
				[1600, 1600]
			];
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					let p = houses[Math.floor(Math.random() * houses
						.length)];
					item_spawn(g, Ox + p[0] + Math.random() * 600, Oy +
						p[1] + Math.random() * 600, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_RESIDENTIAL_NW]: {
		weight: 50,
		connections: {
			N: 1,
			E: 0,
			S: 0,
			W: 1
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_rectangle_create(g, Ox, Oy + 1130, 1370, 240,
				"#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1130, Oy, 240, 1370,
				"#999999", "#999999");
			decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_house_v2(g, Ox + 150, Oy + 150, 850, 850, "down",
				"#d2b48c", "#8b4513");
			decorative_house_v2(g, Ox + 150, Oy + 1500, 850, 850, "up",
				"#c2b280", "#4a2c2a");
			decorative_house_v2(g, Ox + 1500, Oy + 150, 850, 850,
				"left", "#e3dac9", "#5d2e0c");
			decorative_grass_create(g, Ox + 1200, Oy + 1000, 1295, 1450,
				true);
			decorative_rectangle_create(g, Ox + 1355, Oy + 500, 145,
				150, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 500, Oy + 1000, 150,
				145, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 500, Oy + 1355, 150,
				145, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			let houses = [
				[250, 250],
				[250, 1600],
				[1600, 250]
			];
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					let p = houses[Math.floor(Math.random() * houses
						.length)];
					item_spawn(g, Ox + p[0] + Math.random() * 600, Oy +
						p[1] + Math.random() * 600, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_RESIDENTIAL_NE]: {
		weight: 50,
		connections: {
			N: 1,
			E: 1,
			S: 0,
			W: 0
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: true,
		spawn_animals: false,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_rectangle_create(g, Ox + 1130, Oy + 1130, 1370,
				240, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1130, Oy, 240, 1370,
				"#999999", "#999999");
			decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_house_v2(g, Ox + 150, Oy + 150, 850, 850,
				"right", "#d2b48c", "#8b4513");
			decorative_house_v2(g, Ox + 1500, Oy + 150, 850, 850,
				"down", "#e3dac9", "#5d2e0c");
			decorative_house_v2(g, Ox + 1500, Oy + 1500, 850, 850, "up",
				"#c2b280", "#4a2c2a");
			decorative_grass_create(g, Ox, Oy + 1000, 1400, 1450, true);
			decorative_rectangle_create(g, Ox + 1000, Oy + 500, 145,
				150, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1850, Oy + 1000, 150,
				145, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1850, Oy + 1355, 150,
				145, "#999999", "#999999");
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 7 + 3;
			let houses = [
				[250, 250],
				[1600, 250],
				[1600, 1600]
			];
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					let p = houses[Math.floor(Math.random() * houses
						.length)];
					item_spawn(g, Ox + p[0] + Math.random() * 600, Oy +
						p[1] + Math.random() * 600, null, tile);
				}
			}
		}
	},
	[LEVEL_TILE_ROAD_TURN_WN_DESERT]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 1090, 1090);
			decorative_sand_create(g, Ox + 1410, Oy, 1090, 2500);
			decorative_sand_create(g, Ox, Oy + 1410, 1410, 1090);
			decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_WS_DESERT]: {
		weight: 100,
		connections: {
			N: 0,
			E: 0,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 2500, 1090);
			decorative_sand_create(g, Ox, Oy + 1410, 1090, 1090);
			decorative_sand_create(g, Ox + 1410, Oy + 1090, 1090, 1410);
			decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_ES_DESERT]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 1,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 2500, 1090);
			decorative_sand_create(g, Ox, Oy + 1090, 1090, 1410);
			decorative_sand_create(g, Ox + 1410, Oy + 1410, 1090, 1090);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_EN_DESERT]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 0,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 1090, 1500);
			decorative_sand_create(g, Ox + 1410, Oy, 1090, 1090);
			decorative_sand_create(g, Ox, Oy + 1410, 2500, 1090);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_HORIZONTAL_DESERT]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 2500, 1090);
			decorative_sand_create(g, Ox, Oy + 1410, 2500, 1090);
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		}
	},
	[LEVEL_TILE_ROAD_VERTICAL_DESERT]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 1,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 1090, 2500);
			decorative_sand_create(g, Ox + 1410, Oy, 1090, 2500);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		}
	},
	[LEVEL_TILE_DEFAULT_DESERT]: {
		weight: 50,
		connections: {
			N: 0,
			E: 0,
			S: 0,
			W: 0
		},
		base_color: "#E3C16F",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 2500, 2500);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 3 + 1;
			for (let i = 0; i < N; i++)
				item_spawn(g, Ox + Math.random() * 2500, Oy + Math
					.random() * 2500, null, tile);
		}
	},
	[LEVEL_TILE_ROAD_CROSSROAD_DESERT]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy) => {
			decorative_sand_create(g, Ox, Oy, 1090, 1090);
			decorative_sand_create(g, Ox + 1410, Oy, 1090, 1090);
			decorative_sand_create(g, Ox, Oy + 1410, 1090, 1090);
			decorative_sand_create(g, Ox + 1410, Oy + 1410, 1090,
				1090);
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		}
	},
	[LEVEL_TILE_ROAD_CROSSROAD]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 1090, 1090);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
			decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
			decorative_grass_create(g, Ox + 1410, Oy + 1410, 1090,
				1090);
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		}
	},
	[LEVEL_TILE_ROAD_TURN_WN]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 1090, 1090);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 2500);
			decorative_grass_create(g, Ox, Oy + 1410, 1410, 1090);
			decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_WS]: {
		weight: 100,
		connections: {
			N: 0,
			E: 0,
			S: 1,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 2500, 1090);
			decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090);
			decorative_grass_create(g, Ox + 1410, Oy + 1090, 1090,
				1410);
			decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_ES]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 1,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 2500, 1090);
			decorative_grass_create(g, Ox, Oy + 1090, 1090, 1410);
			decorative_grass_create(g, Ox + 1410, Oy + 1410, 1090,
				1090);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_TURN_EN]: {
		weight: 100,
		connections: {
			N: 1,
			E: 1,
			S: 0,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 1090, 1500);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090);
			decorative_grass_create(g, Ox, Oy + 1410, 2500, 1090);
			decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
			decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
			decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200,
				200, "#222222", "#222222");
		}
	},
	[LEVEL_TILE_ROAD_HORIZONTAL]: {
		weight: 100,
		connections: {
			N: 0,
			E: 1,
			S: 0,
			W: 1
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 2500, 1090);
			decorative_grass_create(g, Ox, Oy + 1410, 2500, 1090);
			decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		}
	},
	[LEVEL_TILE_ROAD_VERTICAL]: {
		weight: 100,
		connections: {
			N: 1,
			E: 0,
			S: 1,
			W: 0
		},
		base_color: "gray",
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 1090, 2500);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 2500);
			decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		}
	},
	[LEVEL_TILE_DEFAULT]: {
		weight: 100,
		connections: {
			N: 0,
			E: 0,
			S: 0,
			W: 0
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: true,
		spawn_animals: true,
		spawn_items: true,
		populate: (g, Ox, Oy) => {
			decorative_grass_create(g, Ox, Oy, 2420, 2420);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 5 + 2;
			for (let i = 0; i < N; i++)
				item_spawn(g, Ox + Math.random() * 2500, Oy + Math
					.random() * 2500, null, tile);
		}
	},
	[LEVEL_TILE_CITY_PARK]: {
		weight: 25,
		connections: {
			N: 1,
			E: 1,
			S: 1,
			W: 1
		},
		base_color: DECORATIVE_COLOR_GRASS,
		spawn_enemies: false,
		spawn_animals: true,
		spawn_items: false,
		populate: (g, Ox, Oy, visited) => {
			decorative_grass_create(g, Ox, Oy, 1090, 1090, true);
			decorative_grass_create(g, Ox + 1410, Oy, 1090, 1090, true);
			decorative_grass_create(g, Ox, Oy + 1410, 1090, 1090, true);
			decorative_grass_create(g, Ox + 1410, Oy + 1410, 1090, 1090,
				true);
			decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200,
				"#222222", "#222222");
			decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500,
				"#222222", "#222222");
			decorative_fountain_create(g, Ox + 1050, Oy + 1050, 400);
			decorative_bench_create(g, Ox + 200, Oy + 1090,
				"horizontal");
			decorative_bench_create(g, Ox + 600, Oy + 1090,
				"horizontal");
			decorative_bench_create(g, Ox + 200, Oy + 1380,
				"horizontal");
			decorative_bench_create(g, Ox + 600, Oy + 1380,
				"horizontal");
			decorative_bench_create(g, Ox + 1700, Oy + 1090,
				"horizontal");
			decorative_bench_create(g, Ox + 2100, Oy + 1090,
				"horizontal");
			decorative_bench_create(g, Ox + 1700, Oy + 1380,
				"horizontal");
			decorative_bench_create(g, Ox + 2100, Oy + 1380,
				"horizontal");
			decorative_bench_create(g, Ox + 1090, Oy + 200, "vertical");
			decorative_bench_create(g, Ox + 1090, Oy + 600, "vertical");
			decorative_bench_create(g, Ox + 1380, Oy + 200, "vertical");
			decorative_bench_create(g, Ox + 1380, Oy + 600, "vertical");
			decorative_bench_create(g, Ox + 1090, Oy + 1700,
				"vertical");
			decorative_bench_create(g, Ox + 1090, Oy + 2100,
				"vertical");
			decorative_bench_create(g, Ox + 1380, Oy + 1700,
				"vertical");
			decorative_bench_create(g, Ox + 1380, Oy + 2100,
				"vertical");
			if (!visited) {
				trashcan_create(g, Ox + 460, Oy + 1095);
				trashcan_create(g, Ox + 460, Oy + 1385);
				trashcan_create(g, Ox + 1960, Oy + 1095);
				trashcan_create(g, Ox + 1960, Oy + 1385);
				trashcan_create(g, Ox + 1095, Oy + 460);
				trashcan_create(g, Ox + 1385, Oy + 460);
				trashcan_create(g, Ox + 1095, Oy + 1960);
				trashcan_create(g, Ox + 1385, Oy + 1960);
			}
			let r = Math.random();
			if (r < 0.25) decorative_hotdog_stand_create(g, Ox + 850,
				Oy + 850);
			else if (r < 0.5) decorative_hotdog_stand_create(g, Ox +
				1470, Oy + 850);
			else if (r < 0.75) decorative_hotdog_stand_create(g, Ox +
				850, Oy + 1530);
			else decorative_hotdog_stand_create(g, Ox + 1470, Oy +
				1530);
		},
		populate_with_items: (g, Ox, Oy, tile) => {
			let N = Math.random() * 6 + 2;
			for (let i = 0; i < N; i++) {
				if (Math.random() < 0.2) {
					item_spawn(g, Ox + Math.random() * 2500, Oy + Math
						.random() * 2500, null, tile);
				}
				else {
					let rx = Math.random() > 0.5 ? 100 + Math.random() *
						800 : 1500 + Math.random() * 800;
					let ry = Math.random() > 0.5 ? 100 + Math.random() *
						800 : 1500 + Math.random() * 800;
					item_create(g, ITEM_APPLE, Ox + rx, Oy + ry);
				}
			}
		}
	}
};
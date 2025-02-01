
let TILE_VOID = 0;
let TILE_START = 1;
let TILE_DEFAULT = 4;

let TILE_ROAD_CROSSROAD = 5;
let TILE_ROAD_VERTICAL = 2;
let TILE_ROAD_HORIZONTAL = 3;
let TILE_ROAD_TURN_WN = 6;
let TILE_ROAD_TURN_WS = 7;
let TILE_ROAD_TURN_EN = 8;
let TILE_ROAD_TURN_ES = 9;

function levels_set(g, level, old_level=null) {

	g.debug_console.unshift("time from previous level creation " + g.level_set_delay);
	g.level_set_delay = 0;
	
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

	//if(g.visited_levels.length > 20 && false) {
	//	g.debug_console.unshift("starting level deletion");
	//	for(let i = 0; i < g.visited_levels.length; i++) {
	//		if(!level_visible(g, g.visited_levels[i])) {
	//			g.debug_console.unshift("destroying level " + g.visited_levels[i]);
	//			game_destroy_level(g, g.visited_levels[i]);
	//			g.debug_console.unshift("destroyed level " + g.visited_levels[i]);
	//		}
	//	}
	//	g.visited_levels = ["0x0"];
	//}

	let player_object = game_object_find_closest(g, Ox + 1250, Oy + 1250, "player", 3536);
	if(player_object && !player_object.data.ai_controlled)
		g.respawn_level = level;
	
	if(!g.visited_levels.includes(level)) {

		let available_tiles = [
			TILE_ROAD_CROSSROAD,
			TILE_ROAD_HORIZONTAL, TILE_ROAD_VERTICAL,
			TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES,
			TILE_DEFAULT
		];

		if(level_tile_get_neighbour_west(g, level) == TILE_DEFAULT)
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS
			].includes(tile)));
		if(level_tile_get_neighbour_east(g, level) == TILE_DEFAULT)
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES
			].includes(tile)));
		if(level_tile_get_neighbour_north(g, level) == TILE_DEFAULT)
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_WN
			].includes(tile)));
		if(level_tile_get_neighbour_south(g, level) == TILE_DEFAULT)
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_ES, TILE_ROAD_TURN_WS
			].includes(tile)));

		if([TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES].includes(level_tile_get_neighbour_west(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES
			].includes(tile)));
		if([TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS].includes(level_tile_get_neighbour_east(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS
			].includes(tile)));
		if([TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_EN].includes(level_tile_get_neighbour_north(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_EN
			].includes(tile)));
		if([TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_ES].includes(level_tile_get_neighbour_south(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_CROSSROAD, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_ES
			].includes(tile)));

		if([TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS].includes(level_tile_get_neighbour_west(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_HORIZONTAL, TILE_ROAD_CROSSROAD, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_WS
			].includes(tile)));
		if([TILE_ROAD_VERTICAL, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES].includes(level_tile_get_neighbour_east(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_HORIZONTAL, TILE_ROAD_CROSSROAD, TILE_ROAD_TURN_EN, TILE_ROAD_TURN_ES
			].includes(tile)));
		if([TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_ES].includes(level_tile_get_neighbour_north(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_HORIZONTAL, TILE_DEFAULT, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_ES
			].includes(tile)));
		if([TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_EN].includes(level_tile_get_neighbour_south(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_ROAD_HORIZONTAL, TILE_DEFAULT, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_EN
			].includes(tile)));

		if([TILE_ROAD_CROSSROAD, TILE_START].includes(level_tile_get_neighbour_west(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_ES, TILE_ROAD_TURN_EN
			].includes(tile)));
		if([TILE_ROAD_CROSSROAD, TILE_START].includes(level_tile_get_neighbour_east(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_VERTICAL, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_WN
			].includes(tile)));
		if([TILE_ROAD_CROSSROAD, TILE_START].includes(level_tile_get_neighbour_north(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WS, TILE_ROAD_TURN_ES
			].includes(tile)));
		if([TILE_ROAD_CROSSROAD, TILE_START].includes(level_tile_get_neighbour_south(g, level)))
			available_tiles = available_tiles.filter((tile) => !([
				TILE_DEFAULT, TILE_ROAD_HORIZONTAL, TILE_ROAD_TURN_WN, TILE_ROAD_TURN_EN
			].includes(tile)));

		if(available_tiles.length < 1)
			available_tiles.push(TILE_DEFAULT);

		g.debug_console.unshift("new level: " + level);
		g.debug_console.unshift("visited levels: ..." + g.visited_levels.slice(g.visited_levels.length - 10));
		g.debug_console.unshift("assigned levels: ..." + g.assigned_tiles.slice(g.assigned_tiles.length - 10));
		g.debug_console.unshift("available tiles: " + available_tiles);

		g.visited_levels.push(level);
		g.assigned_tiles.push(available_tiles[Math.floor(available_tiles.length * Math.random())]);

		if(player_object) {
			let m = 0.33 * (
				player_object.data.health / player_object.data.max_health
				+ player_object.data.thirst / player_object.data.max_thirst
				+ player_object.data.hunger / player_object.data.max_hunger
			);
			let bd = enemy_boss_distance_to_player(g);
			if(-1 < bd && bd < 5000)
				m *= 0.45;
			for(let i = 0; i < Math.random() * 60 * m - 10; i++)
				enemy_create(g, Ox + 1250 + (0.5 - Math.random()) * 1500, Oy + 1250 + (0.5 - Math.random()) * 1500);
		}

		for(let i = 0; i < Math.random() * 5; i++)
			item_spawn(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500);

		for(let i = 0; i < Math.random() * 40 - 35; i++)
			animal_create(g, Ox + 1250 + (0.5 - Math.random()) * 1500, Oy + 1250 + (0.5 - Math.random()) * 1500);

		if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#1177ff");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff7711");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff1177");
		else if(Math.random() > 0.999)
			player_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, false, true);
	}

	let tile = g.assigned_tiles[g.visited_levels.indexOf(level)];

	if(tile == TILE_START) {
		car_create(g, Ox + 1960, Oy + 2200, "#7711ff");
		decorative_building_create(g, Ox + 50, Oy + 50, 900, 900);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050, 525);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 525);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050, false);
		decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
		decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");
	} else if(tile == TILE_ROAD_CROSSROAD) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 1410, 1050, 1050);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
	} else if(tile == TILE_ROAD_TURN_WN) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 2420);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 1370, 1050);
		decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
	} else if(tile == TILE_ROAD_TURN_WS) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 1090, 1050, 1370);
		decorative_road_create(g, Ox, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
	} else if(tile == TILE_ROAD_TURN_ES) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1090, 1050, 1370);
		decorative_grass_create(g, Ox + 1410, Oy + 1410, 1050, 1050);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
	} else if(tile == TILE_ROAD_TURN_EN) {
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1370);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 2420, 1050);
		decorative_road_create(g, Ox + 1150, Oy + 1150, 1350, 200);
		decorative_road_create(g, Ox + 1150, Oy, 200, 1350);
		decorative_rectangle_create(g, Ox + 1150, Oy + 1150, 200, 200, "#222222", "#222222");
	} else if (tile == TILE_ROAD_HORIZONTAL) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 2420, 1050);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
	} else if (tile == TILE_ROAD_VERTICAL){
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 2420);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
	} else if (tile == TILE_DEFAULT) {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 2420);
	}
	decorative_level_base_create(g, Ox, Oy);
}


function level_visible(g, level, exclude_player_object=null) {
	for(let i = 0; i < g.objects.length; i++) {
		if(g.objects[i].name == "player" && !g.objects[i].destroyed && g.objects[i].data.want_level == level && g.objects[i] != exclude_player_object) {
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
	let res = TILE_VOID;
	let west_level = level_get_neighbour_west(level);
	let il = g.visited_levels.indexOf(west_level);
	if(il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_east(g, level) {
	let res = TILE_VOID;
	let east_level = level_get_neighbour_east(level);
	let il = g.visited_levels.indexOf(east_level);
	if(il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_north(g, level) {
	let res = TILE_VOID;
	let north_level = level_get_neighbour_north(level);
	let il = g.visited_levels.indexOf(north_level);
	if(il > -1)
		res = g.assigned_tiles[il];
	return res;
}

function level_tile_get_neighbour_south(g, level) {
	let res = TILE_VOID;
	let south_level = level_get_neighbour_south(level);
	let il = g.visited_levels.indexOf(south_level);
	if(il > -1)
		res = g.assigned_tiles[il];
	return res;
}

//function level_delete_invisible(g, levels) {
//	for() {
//		for(let i = 0; i < g.objects.length; i++) {
//			if(g.objects[i].name == "player"
//				&& g.objects[i].data.want_level == level
//				&& g.objects[i] != exclude_player_object
//				&& !g.objects[i].destroyed) {
//				
//			}
//		}
//	}
//}


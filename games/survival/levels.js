
function levels_set(g, level, old_level=null) {

	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

	//if(g.visited_levels.length > 40) {
	//	for(let i = 0; i < g.visited_levels.length; i++) {
	//		if(!level_visible(g, g.visited_levels[i]))
	//			game_destroy_level(g, g.visited_levels[i]);
	//	}
	//	g.visited_levels = ["0x0"];
	//}

	let player_object = game_object_find_closest(g, Ox + 1250, Oy + 1250, "player", 3536);
	if(player_object && !player_object.data.ai_controlled)
		g.respawn_level = level;
	
	if(!g.visited_levels.includes(level)) {
		g.visited_levels.push(level);

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

		if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#1177ff");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff7711");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff1177");
		else if(Math.random() > 0.999)
			player_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, false, true);
	}

	if(level == "0x0") {
		car_create(g, Ox + 1960, Oy + 2200, "#7711ff");
		decorative_building_create(g, Ox + 50, Oy + 50, 900, 900);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050, 525);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 525);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
		decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");
		decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
	} else if (level_y == "0") {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 2420, 1050);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
	} else if (level_x == "0"){
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 2420);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
	} else {
		N = 6;
		for(let i = 0; i < N; i++)
			for(let j = 0; j < N; j++) {
				decorative_tree_create(g, Ox + 100 + i * 2300 / N + Math.random() * 1150 / N, Oy + 100 + j * 2300 / N + Math.random() * 1150 / N);
				//decorative_tree_create(g, Ox + 100 + i * 2300 / N + 0.5 * 1150 / N, Oy + 100 + j * 2300 / N + 0.5 * 1150 / N);
			}
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

function level_get_type(g, x, y) {
	if(x == 0 && y == 0)
		return "parking";
	if(x == 0)
		return "road vertical";
	if(y == 0)
		return "road horizontal";
	return "forest"
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



function levels_set(g, level) {

	g.level = level;
	game_destroy_level(g);
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

	if(g.visited_levels.length > 40)
		g.visited_levels = ["0x0"];

	if(!g.visited_levels.includes(level)) {
		g.visited_levels.push(level);

		if(g.player_object) {
			let m = 0.33 * (
				g.player_object.data.health / g.player_object.data.max_health
				+ g.player_object.data.thirst / g.player_object.data.max_thirst
				+ g.player_object.data.hunger / g.player_object.data.max_hunger
			);
			let bd = enemy_boss_distance_to_player(g);
			if(-1 < bd && bd < 5000)
				m *= 0.45;
			for(let i = 0; i < Math.random() * 60 * m - 10; i++)
				enemy_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			for(let i = 0; i < Math.random() * (g.player_object.data.car_object ? 8 : 0) - 6; i++)
				item_create(g, ITEM_FUEL, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			for(let i = 0; i < Math.random() * 8 - 4 - 0.44 * inventory_count_item(g.player_object.data.inventory_element, ITEM_AMMO); i++)
				item_create(g, ITEM_AMMO, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			for(let i = 0; i < Math.random() * 2 - 3 + Math.min(g.player_object.data.max_health / g.player_object.data.health, 4); i++)
				item_create(g, ITEM_HEALTH, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			for(let i = 0; i < Math.random() * 2 - 3 + Math.min(g.player_object.data.max_hunger / g.player_object.data.hunger, 4); i++)
				item_create_from_list(g, ITEMS_FOODS, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			for(let i = 0; i < Math.random() * 2 - 3 + Math.min(g.player_object.data.max_thirst / g.player_object.data.thirst, 4); i++)
				item_create_from_list(g, ITEMS_DRINKS, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
			if(!inventory_has_item(g.player_object.data.inventory_element, ITEM_GUN) && Math.random() > 0.75)
				item_create(g, ITEM_GUN, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
		}

		if(Math.random() > 0.999)
			item_create(g, ITEM_MONEY, Ox + Math.random() * 2500, Oy + Math.random() * 2500);

		if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#1177ff");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff7711");
		else if(Math.random() > 0.995)
			car_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500, "#ff1177");
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
			for(let j = 0; j < N; j++)
				decorative_tree_create(g, Ox + 100 + i * 2300 / N + Math.random() * 1150 / N, Oy + 100 + j * 2300 / N + Math.random() * 1150 / N);
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 2420);
	}
	decorative_level_base_create(g, Ox, Oy);
}


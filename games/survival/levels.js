
function levels_set(g, level) {
	g.level = level;
	game_destroy_level(g);
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

	for(let i = 0; i < Math.random() * 50 - 25; i++)
		enemy_create(g, Ox + Math.random() * 2500, Oy + Math.random() * 2500);
	for(let i = 0; i < Math.random() * 50 - 25; i++)
		item_create(g, Math.round(2 + 1 * Math.random()), Ox + Math.random() * 2500, Oy + Math.random() * 2500);

	if(level == "0x0") {
		//car_create(g, Ox + 1500, Oy + 2200, "#1177ff");
		//car_create(g, Ox + 2000, Oy + 2000, "#7711ff");
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


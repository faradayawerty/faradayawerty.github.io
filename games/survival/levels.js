
function levels_set(g, level) {
	g.level = level;
	game_destroy_level(g);
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;

//	for(let i = 0; i < 25 * Math.random() - 0; i++)
//		enemy_create(g, Ox + 2500 * Math.random(), Oy + 2500 * Math.random());

	if(level == "0x0") {
		game_object_create_with_unique_name(g, "car_0x0_1", function() {
			let icar = car_create(g, Ox + 1500, Oy + 2200, "#7711ff")
			let car = g.objects[icar].data;
			car.max_speed = 20;
			return icar;
		});
		wall_create(g, Ox + 50, Oy + 50, 900, 900);
		decorative_building_create(g, Ox + 50, Oy + 50, 900, 900);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050, 525);
		decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 525);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
		decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");
		decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	} else if (level_y == "0") {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 2420, 1050);
		decorative_road_create(g, Ox, Oy + 1150, 2500, 200);
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	} else if (level_x == "0"){
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 2420);
		decorative_road_create(g, Ox + 1150, Oy, 200, 2500);
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	} else {
		N = 6;
		for(let i = 0; i < N; i++)
			for(let j = 0; j < N; j++)
				decorative_tree_create(g, Ox + 100 + i * 2300 / N + Math.random() * 1150 / N, Oy + 100 + j * 2300 / N + Math.random() * 1150 / N);
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 2420);
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	}
}


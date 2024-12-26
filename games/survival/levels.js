
function levels_set(g, level) {
	g.level = level;
	game_destroy_level(g);
	let level_x = Number(level.split("x")[0]);
	let level_y = Number(level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	if(level == "0x0") {
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
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 2420);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 2420);
		decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222"); // vertical
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	} else if (level_x == "0"){
		decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
		decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050);
		decorative_grass_create(g, Ox + 1410, Oy + 1410, 1050, 1050);
		decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222"); // horizontal
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	} else {
		decorative_grass_create(g, Ox + 40, Oy + 40, 2420, 2420);
		decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
	}
}


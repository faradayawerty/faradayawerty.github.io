
function levels_set(g, level) {
	g.level = level;
	game_destroy_level(g);
	let Ox = 2500 * Number(level.split("x")[0]);
	let Oy = 2500 * Number(level.split("x")[1]);
	switch(level) {
		case "0x0":
			wall_create(g, Ox + 50, Oy + 50, 900, 900);
			decorative_building_create(g, Ox + 50, Oy + 50, 900, 900);
			decorative_parkinglot_create(g, Ox + 1410, Oy + 1960, 1050, 525);
			decorative_parkinglot_create(g, Ox + 1410, Oy + 1410, 1050, 525);
			decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
			decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
			decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");
			decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
			decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
			break;
		default:
			decorative_grass_create(g, Ox + 40, Oy + 40, 1050, 1050);
			decorative_grass_create(g, Ox + 1410, Oy + 40, 1050, 1050);
			decorative_grass_create(g, Ox + 40, Oy + 1410, 1050, 1050);
			decorative_grass_create(g, Ox + 1410, Oy + 1410, 1050, 1050);
			decorative_rectangle_create(g, Ox + 1150, Oy, 200, 2500, "#222222", "#222222");
			decorative_rectangle_create(g, Ox, Oy + 1150, 2500, 200, "#222222", "#222222");
			decorative_rectangle_create(g, Ox, Oy, 2500, 2500, "gray", "white");
			break;
	}
}


function game_begin_level_test(g) {
	game_destroy_all_objects(g);
	g.ifollow = player_create(g, 3, 4);
	wall_create(g, 0, 16, 32, 1);
	wall_create(g, 0, -16, 32, 1);
	wall_create(g, -16, 0, 1, 32);
	wall_create(g, 16, 32, 1, 32);
	wall_create(g, 16, -32, 1, 32);
	wall_create(g, 64 + 16, 48, 128, 1);
	wall_create(g, 64 + 16, -48, 128, 1);
	wall_create(g, 128, 0, 1, 32);
	wall_create(g, 96, 0, 1, 16);
	wall_create(g, 64, 0, 1, 32);
	wall_create(g, 128 + 16, 0, 1, 128 - 32);
	box_create(g, 5, 6, 1, 1);
	box_create(g, 10, 7, 3, 20);
	box_create(g, 6, 13, 5, 5);
}
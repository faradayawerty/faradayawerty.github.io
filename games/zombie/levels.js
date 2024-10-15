
function levels_get() {
	let l = {
		test,
		lab1
	};
	return l;
}

let test = function(g) {
	game_destroy_all_objects(g);
	let iplayer = player_create(g, 3, 4);
	g.ifollow = iplayer;
	for(let i = 0; i < 12; i++)
		enemy_create(g, 10 + 2 * i, 3, iplayer);
	wall_create(g, 128, 0, 1, 32);
	wall_create(g, 96, 0, 1, 16);
	wall_create(g, 64, 0, 1, 32);
	box_create(g, 5, 6, 1, 1);
	box_create(g, 10, 7, 3, 20);
	box_create(g, 6, 13, 5, 5);
}

let lab1 = function(g) {
	game_destroy_all_objects(g);
	let iplayer = player_create(g, 3, 4);
	g.ifollow = iplayer;
	box_create(g, 5, 6, 1, 1);
}


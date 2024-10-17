
function levels_get() {
	let l = {
		test: function(g) {
			game_destroy_all_objects(g);
			let p = player_create(g, 3, 4);
			g.follow = p;
			for(let i = 0; i < 12; i++)
				enemy_create(g, 10 + 2 * i, 3, p);
			wall_create(g, 128, 0, 1, 32);
			wall_create(g, 96, 0, 1, 16);
			wall_create(g, 64, 0, 1, 32);
			box_create(g, 5, 6, 1, 1);
			box_create(g, 10, 7, 3, 20);
			box_create(g, 6, 13, 5, 5);
		},
		lab1: function(g) {
			let weapons1 = weapons_get(g);
			game_destroy_all_objects(g);
			let p = player_create(g, 3, 4);
			g.follow = p;
			p.data.weapon = weapons1.shotgun;
			wall_create(g, 128, 0, 4, 32);
			wall_create(g, 96, 0, 4, 16);
			wall_create(g, 64, 0, 4, 32);
			box_create(g, 5, 6, 1, 1);
			box_create(g, 10, 7, 3, 20);
			box_create(g, 6, 13, 5, 5);
		}
	};
	return l;
}

function level_start(g, l) {
	l(g);
}


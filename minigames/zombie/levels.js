function levels_get() {
	let l = {
		forest: function(g) {
			game_destroy_all_objects(g);
			let weapons1 = weapons_get(g);
			let p = player_create(g, 3, 4);
			g.follow = p;
			p.data.weapon = weapons1.shotgun;
			for (let i = 0; i < 256; i++) {
				let alpha = Math.random() * 314;
				enemy_create(g, 10 + Math.cos(alpha) * 400, 10 + Math.sin(alpha) * 400, p);
			}
			for (let i = -32; i < 32; i++)
				for (let j = -32; j < 32; j++) {
					let x_ = 15 * i + 10 * Math.random(), y_ = 15 * j + 10 * Math.random();
					g.decorative.trees.push({x: x_, y: y_})
					wall_create(g, x_, y_, 3, 3);
				}
			wall_create(g, 0, -480, 960, 1);
			wall_create(g, 0, 480, 960, 1);
			wall_create(g, -480, 0, 1, 960);
			wall_create(g, 480, 0, 1, 960);
		},
		lab: function(g) {},
		city: function(g) {}
	};
	return l;
}

function level_start(g, l) {
	l(g);
}

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
				enemy_create(g, 10 + Math.cos(alpha) * 512, 10 + Math.sin(alpha) * 512, p);
			}
			for (let i = -32; i < 32; i++)
				for (let j = -32; j < 32; j++) {
					let x_ = 15 * i + 10 * Math.random(), y_ = 15 * j + 10 * Math.random();
					g.decorative.trees.push({x: x_, y: y_})
					wall_create(g, x_, y_, 3, 3);
				}
			box_create(g, 5, 6, 1, 1);
			box_create(g, 10, 7, 3, 20);
			box_create(g, 6, 13, 5, 5);
		},
		lab: function(g) {},
		city: function(g) {}
	};
	return l;
}

function level_start(g, l) {
	l(g);
}

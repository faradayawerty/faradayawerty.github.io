

function create_game() {
	let game = {
		settings: {
			square_color: "red"
		},
		state: {
			scene: 0
		},
		objects: {
			player: create_player(100, 100),
			enemies: [
				create_enemy(50, 200)
			]
		}
	};
	return game;
}

function step(dt, g) {
	
	let plr = g.objects.player;
	plr.color = g.settings.square_color;
	plr.x += inputs.walk_dir.x * dt;
	plr.y += inputs.walk_dir.y * dt;

	let es = g.objects.enemies;
	for(let i = 0; i < es.length; i++) {
		es[i].x += 0.75 * dt;
	}
}

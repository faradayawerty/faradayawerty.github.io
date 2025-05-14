

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
	let os = g.objects;
	g.objects.player.color = g.settings.square_color;
	g.objects.player.x += inputs.walk_dir.x * dt;
	g.objects.player.y += inputs.walk_dir.y * dt;

	for(let i = 0; i < os.enemies[i]; i++) {
		os.enemies[i].x += 0.75 * dt;
	}
}



function create_game() {
	let game = {
		settings: {
			square_color: "red"
		},
		state: {
			scene: 0
		},
		objects: {
			player: create_spaceship(100, 100, 40), // player controlled; has to have x, y
			ai: {
				enemies: [ // has to have x, y
					create_spaceship(50, 200, 30),
					create_asteroid(50, 200, 30)
				],
				characters: []
			}
		}
	};
	return game;
}

function step(dt, g) {
	
	let plr = g.objects.player;
	plr.x += inputs.walk_dir.x * dt;
	plr.y += inputs.walk_dir.y * dt;

	let es = g.objects.ai.enemies;
	for(let i = 0; i < es.length; i++)
		es[i].x += 0.025 * dt;
}

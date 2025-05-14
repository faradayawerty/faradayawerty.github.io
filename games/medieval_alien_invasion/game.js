
function create_game() {
	let game = {
		settings: {
			square_color: "red"
		},
		state: {
			scene: 0,
			iplayer: 0
		},
		objects: {
			spaceships: [
				create_spaceship(100, 100, 40),
				create_spaceship(300, 200, 50)
			],
			asteroids: [
				create_asteroid(50, 210, 30),
				create_asteroid(150, 220, 30),
				create_asteroid(250, 230, 30),
			],
		}
	};
	return game;
}

function step(dt, g) {
	
	let plr = g.objects.spaceships[g.state.iplayer];
	plr.x += inputs.walk_dir.x * dt;
	plr.y += inputs.walk_dir.y * dt;

	let as = g.objects.asteroids;
	for(let i = 0; i < as.length; i++)
		as[i].x += 0.025 * dt;
}



function create_game() {
	let game = {
		settings: {
			square_color: "red"
		},
		objects: {
			player: create_player(100, 100),
			level: create_level(europe_tilegrid)
		}
	};
	return game;
}

function step(dt, g) {
	g.objects.player.color = g.settings.square_color;
	g.objects.player.x += inputs.walk_dir.x * dt;
	g.objects.player.y += inputs.walk_dir.y * dt;
}


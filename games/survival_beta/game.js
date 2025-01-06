
let GAME_STATE_PAUSED = 1;

function game_create() {
	let g = {

		// game state bitmask
		state: 0,

		// game data
		objects: [],

		// things happening in game
		events: []
	};
	return g;
}

function game_destroy(g) {
}

function game_update(g, dt) {
	if(g.paused)
		return;
	for(let i = 0; i < g.objects; i++)
		g.objects.update(g.objects[i]);
}

function game_draw(g, ctx) {
	for(let i = 0; i < g.objects; i++)
		g.objects.draw(g.objects[i]);
}


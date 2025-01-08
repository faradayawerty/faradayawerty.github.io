
/*
 * game event is an event that happens during gameplay like player wanting to
 * move right or enemy wanting to go towards the player
 */

function game_event_create(g, name) {
	let e = {
		name: name
	};
	g.events.push(e);
}


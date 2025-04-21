

let PLAYER_WIDTH = 40;
let PLAYER_HEIGHT = 40;

function create_player(x, y) {
	return {
		x: x,
		y: y,
		w: PLAYER_WIDTH,
		h: PLAYER_HEIGHT,
		color: "red"
	};
}

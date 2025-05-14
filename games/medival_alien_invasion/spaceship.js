
let TYPE_SPACESHIP = 1;

function create_spaceship(x, y, size) {
	return {
		type: TYPE_SPACESHIP,
		x: x,
		y: y,
		w: size,
		h: size,
	};
}

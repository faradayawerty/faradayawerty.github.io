
function get_PlayerState(x, y) {
	return {
		drawable: true,
		drawable_type: DRAWABLE_TYPE_RECTANGLE,
		x: x,
		y: y,
		w: 60,
		h: 60,
		color_fill: '#bb6666',
		color_outline: '#bb6666',

		object_type: OBJECT_TYPE_PLAYER
	};
}

function step_Player(ps, it) {
	if(it.walk_right)
		ps.x += 10;
	if(it.walk_left)
		ps.x -= 10;
	if(it.walk_down)
		ps.y += 10;
	if(it.walk_up)
		ps.y -= 10;
}


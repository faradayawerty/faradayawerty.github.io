
function player_update(g, p, dt) {
	p.x += p.speed * g.input.joystick.left.dx;
	p.y += p.speed * g.input.joystick.left.dy;
	if(g.input.keys['a'])
		p.x -= p.speed;
	else if(g.input.keys['d'])
		p.x += p.speed;
	if(g.input.keys['w'])
		p.y -= p.speed;
	else if(g.input.keys['s'])
		p.y += p.speed;
}

function player_draw(g, p, ctx) {
	ctx.fillStyle = 'red';
	ctx.fillRect(p.x, p.y, 2, 2);
}

function player_create(g, x_, y_) {
	let p = {
		speed: 0.3,
		x: x_,
		y: y_
	};
	return game_object_create(g, player_update, player_draw, p);
}


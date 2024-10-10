
function player_create(g, x, y) {
	let p = {
		speed: 1,
		body: Matter.Bodies.rectangle(x, y, 2, 2)
	};
	Matter.Composite.add(engine.world, p.body);
	return game_object_create(g, player_update, player_draw, p);
}

function player_update(g, p, dt) {
	let vel = Matter.Vector.create(0, 0);
	if(g.input.keys['a'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
	if(g.input.keys['d'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
	if(g.input.keys['w'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
	if(g.input.keys['s'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
	vel = Matter.Vector.create(p.speed * g.input.joystick.right.dx, p.speed * g.input.joystick.right.dy);
	Matter.Body.setVelocity(p.body, vel);
}

function player_draw(g, p, ctx) {
	drawMatterBody(ctx, p.body, 'red')
}


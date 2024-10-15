function player_create(g, x, y) {
	let w_ = 2, h_ = 2;
	let p = {
		w: w_,
		h: h_,
		speed: 0.3,
		body: Matter.Bodies.rectangle(x, y, w_, h_, {
			inertia: Infinity
		})
	};
	Matter.Composite.add(engine.world, p.body);
	return game_object_create(g, player_update, player_draw, p);
}

function player_update(g, p, dt) {
	let vel = Matter.Vector.create(0, 0);
	vel = Matter.Vector.create(p.speed * g.input.joystick.right.dx, p.speed * g.input.joystick.right.dy);
	if (g.input.keys['a'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
	if (g.input.keys['d'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
	if (g.input.keys['w'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
	if (g.input.keys['s'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
	if(g.input.mouse.leftButtonPressed) {
		bullet_create(g, p.body.vertices[0].x, p.body.vertices[0].y, g.input.mouse.x - window.innerWidth / 2, g.input.mouse.y - window.innerHeight / 2);
		console.log(g.input.mouse.x);
		console.log(g.input.mouse.y);
	}
	Matter.Body.setVelocity(p.body, vel);
}

function player_draw(g, p, ctx) {
	drawMatterBody(ctx, p.body, 'red')
}


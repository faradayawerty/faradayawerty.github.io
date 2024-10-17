
function player_create(g, x, y) {
	let w_ = 2, h_ = 2;
	let p = {
		shot_cooldown: 0,
		w: w_,
		h: h_,
		weapon: null,
		speed: 0.3,
		body: Matter.Bodies.rectangle(x, y, w_, h_, {
			inertia: Infinity
		})
	};
	Matter.Composite.add(g.engine.world, p.body);
	return game_object_create(g, player_update, player_draw, p);
}

function player_update(g, p, dt) {
	// can't control object if game camera doesn't follow it
	if(g.follow == null || g.follow.data != p)
		return;
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
	let dx = 0, dy = 0;
	if(g.input.mouse.leftButtonPressed) {
		dx = g.input.mouse.x - window.innerWidth / 2;
		dy = g.input.mouse.y - window.innerHeight / 2;
	}
	if (Math.abs(g.input.joystick.left.dx) > 0 || Math.abs(g.input.joystick.left.dy) > 0) {
		dx = g.input.joystick.left.dx;
		dy = g.input.joystick.left.dy;
	}
	if(p.weapon != null && dx*dx + dy*dy != 0) {
		p.shot_cooldown = weapons_shoot(g, p.weapon, p.body.position.x, p.body.position.y, dx, dy, p.shot_cooldown) - dt;
	}
	Matter.Body.setVelocity(p.body, vel);
}

function player_draw(g, p, ctx) {
	fillMatterBody(ctx, p.body, 'red')
}


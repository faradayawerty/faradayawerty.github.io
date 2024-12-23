
function player_create(g, x, y) {
	let p = {
		input: g.input,
		speed: 10,
		color: g.settings.player_color,
		want_level: g.level,
		body: Matter.Bodies.rectangle(x, y, 40, 40, {
			inertia: Infinity
		})
	};
	Matter.Composite.add(g.engine.world, p.body);
	return game_object_create(g, "player", p, player_update, player_draw);
}

function player_update(p, dt) {
	let vel = Matter.Vector.create(0, 0);
	if(p.input.keys['d'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
	if(p.input.keys['a'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
	if(p.input.keys['s'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
	if(p.input.keys['w'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
	Matter.Body.setVelocity(p.body, vel);
}

function player_draw(p, ctx) {
	drawMatterBody(ctx, p.body, p.color);
}


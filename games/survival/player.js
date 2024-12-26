
function player_create(g, x, y) {
	let p = {
		input: g.input,
		speed: 10,
		color: g.settings.player_color,
		want_level: g.level,
		in_car: true,
		car_angle: 0,
		body: Matter.Bodies.rectangle(x, y, 40, 40, {
			inertia: Infinity
		})
	};
	Matter.Composite.add(g.engine.world, p.body);
	return game_object_create(g, "player", p, player_update, player_draw);
}

function player_update(p, dt) {
	let level_x = Number(p.want_level.split("x")[0]);
	let level_y = Number(p.want_level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	if(p.body.position.x < Ox)
		p.want_level = (level_x - 1) + "x" + level_y;
	else if(p.body.position.x > Ox + 2500)
		p.want_level = (level_x + 1) + "x" + level_y;
	if(p.body.position.y < Oy)
		p.want_level = level_x + "x" + (level_y - 1);
	else if(p.body.position.y > Oy + 2500)
		p.want_level = level_x + "x" + (level_y + 1);
	let vel = Matter.Vector.create(0, 0);
	if (p.in_car) {
		if(p.input.keys['d'])
			p.car_angle += 2 * dt;
		if(p.input.keys['a'])
			p.car_angle -= 2 * dt;
		if(p.input.keys['w'])
			vel = p.speed * Matter.Vector.create(Math.cos(p.car_angle), Math.sin(p.car_angle));
		if(p.input.keys['s'])
			vel = -p.speed * Matter.Vector.create(Math.cos(p.car_angle), Math.sin(p.car_angle));
		console.log(vel);
	} else {
		if(p.input.keys['d'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
		if(p.input.keys['a'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
		if(p.input.keys['s'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
		if(p.input.keys['w'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
	}
	Matter.Body.setVelocity(p.body, vel);
}

function player_draw(p, ctx) {
	fillMatterBody(ctx, p.body, p.color);
	drawMatterBody(ctx, p.body, "white");
}


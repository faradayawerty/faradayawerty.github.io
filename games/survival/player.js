
function player_create(g, x, y) {
	let p = {
		game: g,
		speed: 10,
		want_level: g.level,
		car: null,
		car_cooldown: 200,
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
	if (p.car) {
		p.body.collisionFilter.mask = -3;
		if(p.game.input.keys['d'])
			Matter.Body.rotate(p.car.body, 0.0015 * dt);
		if(p.game.input.keys['a'])
			Matter.Body.rotate(p.car.body, -0.0015 * dt);
		if(p.game.input.keys['w'])
			vel = Matter.Vector.create(p.car.speed * Math.cos(p.car.body.angle), p.car.speed * Math.sin(p.car.body.angle));
		if(p.game.input.keys['s'])
			vel = Matter.Vector.create(-0.5 * p.car.speed * Math.cos(p.car.body.angle), -0.5 * p.car.speed * Math.sin(p.car.body.angle));
		Matter.Body.setVelocity(p.car.body, vel);
		Matter.Body.setPosition(p.body, Matter.Vector.add(p.car.body.position, Matter.Vector.create(0, 0)));
		if(p.game.input.keys['f'] && p.car_cooldown >= 200) {
			Matter.Body.setPosition(p.body, Matter.Vector.add(p.car.body.position, Matter.Vector.create(150, 0)));
			p.car = null;
			p.car_cooldown = 0;
		}
	} else {
		p.body.collisionFilter.mask = -1;
		if(p.game.input.keys['d'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
		if(p.game.input.keys['a'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
		if(p.game.input.keys['s'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
		if(p.game.input.keys['w'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
		if(p.game.input.keys['f'] && p.car_cooldown >= 200) {
			let car_closest = null;
			for(let i = 0; i < p.game.objects.length; i++) {
				let car = null;
				if(p.game.objects[i].name == "car")
					car = p.game.objects[i].data;
				else
					continue;
				if(!car_closest && car.ridable && dist(car.body.position, p.body.position) < 200)
					car_closest = car;
				if(car_closest && dist(car.body.position, p.body.position) < dist(car_closest.body.position, p.body.position))
					car_closest = car;
			}
			if(car_closest) {
				p.car = car_closest;
				p.car_cooldown = 0;
			}
		}
		Matter.Body.setVelocity(p.body, vel);
	}
	if(p.car_cooldown < 200)
		p.car_cooldown += dt;
}

function player_draw(p, ctx) {
	if(!p.car) {
		fillMatterBody(ctx, p.body, p.game.settings.player_color);
		drawMatterBody(ctx, p.body, "white");
	}
}



function car_create(g, x, y, color_, is_tank=false, unique=true) {
	let cars = g.objects.filter((obj) => obj.name == "car");
	if(cars.length > 10)
		for(let i = 0; i < 5 * Math.random() + 1; i++) {
			if(g.player_object && g.player_object.data.car_object == cars[i] && i < cars.length - 1)
				i++;
			cars[i].destroy(cars[i]);
		}
	let width = 200, height = 110;
	let c = {
		health: Math.random() * 1500 + 500,
		max_health: Math.random() * 1000 + 2000,
		fuel: Math.max(0, 500 * Math.random() - 400),
		max_fuel: 200,
		speed: 20,
		max_speed: 20,
		ridable: true,
		color: color_,
		w: width,
		h: height,
		is_tank: is_tank,
		body: Matter.Bodies.rectangle(x, y, width, height, {
				angle: 3 * Math.PI / 2,
				mass: 1000.5,
				inertia: Infinity,
				collisionFilter: {
					"group": 0,
					"mask": -1,
					"category": 2
				}
			}),
		shot_cooldown: 2000
  	};
	if(is_tank) {
		c.max_health *= 250;
		c.health = c.max_health;
		c.max_fuel *= 20;
		c.fuel = Math.random() * c.max_fuel;
		c.speed *= 0.75;
		c.max_speed *= 0.75;
	}
	let uname = null;
	if(unique)
		uname = "car_" + color_ + Math.round(x) + ":" + Math.round(y);
	let icar = game_object_create(g, "car", c, car_update, car_draw, car_destroy, uname);
	if(icar > -1)
		Matter.Composite.add(g.engine.world, c.body);
	return icar;
}

function car_destroy(car_object) {
	if(car_object.game.player_object && car_object.game.player_object.data.car_object == car_object)
		car_object.game.player_object.data.car_object = null;
	Matter.Composite.remove(car_object.game.engine.world, car_object.data.body);
	car_object.destroyed = true;
}

function car_update(car_object, dt) {
	if(car_object.data.shot_cooldown < 2000)
		car_object.data.shot_cooldown += dt;
	car_object.data.speed = car_object.data.max_speed;
	for(let i = 0; i < car_object.game.objects.length; i++) {
		let grass = null;
		if(car_object.game.objects[i].name == "decorative_grass")
			grass = car_object.game.objects[i].data;
		else
			continue;
		if(doRectsCollide(car_object.data.body.position.x, car_object.data.body.position.y, 0, 0, grass.x, grass.y, grass.w, grass.h)) {
			car_object.data.speed = 0.66 * car_object.data.max_speed;
			break;
		}
	}
	if(car_object.data.health < 0)
		car_destroy(car_object);
	let p = car_object.data;
	if(car_object.data.is_tank
		&& car_object.game.player_object
		&& car_object.game.player_object.data.car_object == car_object
		&& car_object.game.input.mouse.leftButtonPressed
		&& p.shot_cooldown >= 600) {
		let theta = Math.atan2(car_object.game.input.mouse.y - 0.5 * window.innerHeight, car_object.game.input.mouse.x - 0.5 * window.innerWidth);
		bullet_create(
			car_object.game,
			p.body.position.x + 0.5 * p.w * Math.cos(theta),
			p.body.position.y + 0.5 * p.w * Math.sin(theta),
			car_object.game.input.mouse.x - 0.5 * window.innerWidth,
			car_object.game.input.mouse.y - 0.5 * window.innerHeight,
			60,
			100000 + Math.random() * 200000,
			false,
			12.5,
			3500
		);
		p.shot_cooldown = 0;
	}
}

function car_draw(car_object, ctx) {
  	fillMatterBody(ctx, car_object.data.body, car_object.data.color);
	drawMatterBody(ctx, car_object.data.body, "white");
	if(car_object.data.is_tank) {
		let p = car_object.data;
		ctx.strokeStyle = "black";
		let lw = 0.05 * p.w;
		let gl = 0.75;
		ctx.beginPath();
		let px = p.body.position.x;
		let py = p.body.position.y;
		ctx.moveTo(px, py);
		let gx = 0, gy = 1;
		if(car_object.game.player_object && car_object.game.player_object.data.car_object == car_object) {
			gx = car_object.game.input.mouse.x - 0.5 * ctx.canvas.width;
			gy = car_object.game.input.mouse.y - 0.5 * ctx.canvas.height;
		}
		let g = Math.sqrt(gx * gx + gy * gy);
		ctx.lineTo(px + gl * p.w * gx / g, py + gl * p.w * gy / g);
		ctx.lineWidth = lw;
		ctx.stroke();
		drawCircle(ctx, px, py, 0.45 * p.h, p.color, "black", 0.01 * p.w);
	}
	if(car_object.game.settings.indicators["show car health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(car_object.data.body.position.x - 0.25 * car_object.data.h, car_object.data.body.position.y - 0.25 * car_object.data.h, 0.5 * car_object.data.h, 2);
		ctx.fillStyle = "lime";
		ctx.fillRect(car_object.data.body.position.x - 0.25 * car_object.data.h, car_object.data.body.position.y - 0.25 * car_object.data.h,
			0.5 * car_object.data.h * car_object.data.health / car_object.data.max_health, 2);
	}
	if(car_object.game.settings.indicators["show car fuel"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(car_object.data.body.position.x - 0.25 * car_object.data.h, car_object.data.body.position.y - 0.2 * car_object.data.h, 0.5 * car_object.data.h, 2);
		ctx.fillStyle = "gray";
		ctx.fillRect(car_object.data.body.position.x - 0.25 * car_object.data.h, car_object.data.body.position.y - 0.2 * car_object.data.h,
			0.5 * car_object.data.h * car_object.data.fuel / car_object.data.max_fuel, 2);
	}
}


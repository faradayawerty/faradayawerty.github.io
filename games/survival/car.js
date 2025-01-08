
function car_create(g, x, y, color_) {
	let cars = g.objects.filter((obj) => obj.name == "car");
	if(cars.length > 10)
		for(let i = 0; i < 5 * Math.random() + 1; i++) {
			if(g.player_object && g.player_object.data.car_object == cars[i] && i < cars.length)
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
		body: Matter.Bodies.rectangle(x, y, width, height, {
				angle: 3 * Math.PI / 2,
				mass: 1000.5,
				inertia: Infinity,
				collisionFilter: {
					"group": 0,
					"mask": -1,
					"category": 2
				}
			})
  	};
	let icar = game_object_create(g, "car", c, car_update, car_draw, car_destroy,
		"car_" + color_ + Math.round(x) + ":" + Math.round(y));
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
}

function car_draw(car_object, ctx) {
  	fillMatterBody(ctx, car_object.data.body, car_object.data.color);
	drawMatterBody(ctx, car_object.data.body, "white");
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


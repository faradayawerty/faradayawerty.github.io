
function car_create(g, x, y, color_) {
	let c = {
		health: 100,
		fuel: 100,
		speed: 20,
		max_speed: 20,
		ridable: true,
		color: color_,
		body: Matter.Bodies.rectangle(x, y, 200, 110, {
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
	Matter.Composite.add(g.engine.world, c.body);
	return game_object_create(g, "car", c, car_update, car_draw, car_destroy);
}

function car_destroy(car_object) {
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
}

function car_draw(car_object, ctx) {
  	fillMatterBody(ctx, car_object.data.body, c.color);
	drawMatterBody(ctx, car_object.data.body, "white");
}


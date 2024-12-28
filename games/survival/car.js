
function car_create(g, x, y, color_) {
  let c = {
	game: g,
	health: 100,
	fuel: 100,
	speed: 20,
	max_speed: 20,
	ridable: true,
	color: color_,
	body: Matter.Bodies.rectangle(x, y, 200, 110, {
			angle: 3 * Math.PI / 2,
			mass: 1000.5,
			collisionFilter: {
				"group": 0,
				"mask": -1,
				"category": 2
			}
		})
  	};
	Matter.Composite.add(g.engine.world, c.body);
	return game_object_make_last(g, game_object_create(g, "car", c, car_update, car_draw));
}

function car_update(c, dt) {
	c.speed = c.max_speed;
	for(let i = 0; i < c.game.objects.length; i++) {
		let grass = null;
		if(c.game.objects[i].name == "decorative_grass")
			grass = c.game.objects[i].data;
		else
			continue;
		if(doRectsCollide(c.body.position.x, c.body.position.y, 0, 0, grass.x, grass.y, grass.w, grass.h)) {
			c.speed = 0.33 * c.max_speed;
			break;
		}
	}
}

function car_draw(c, ctx) {
  	fillMatterBody(ctx, c.body, c.color);
	drawMatterBody(ctx, c.body, "white");
}


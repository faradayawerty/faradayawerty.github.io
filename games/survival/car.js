
function car_create(g, x, y, color_, ridable_) {
  let c = {
	color: color_,
	ridable: ridable_,
	speed: 20,
	body: Matter.Bodies.rectangle(x, y, 200, 110, {
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

function car_update(c, dt) {}

function car_draw(c, ctx) {
  	fillMatterBody(ctx, c.body, c.color);
	drawMatterBody(ctx, c.body, "white");
}

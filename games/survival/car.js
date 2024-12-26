
function car_create(g, x, y) {
  let c = {
    speed: 15,
    color: "#dd7722",
    body: Matter.Bodies.rectangle(x, y, 225, 400, {
			inertia: Infinity
		})
  };
	Matter.Composite.add(g.engine.world, c.body);
	return game_object_create(g, "car", c, car_update, car_draw);
}

function car_update(c, dt) {
}

function car_draw(c, ctx) {
  	fillMatterBody(ctx, c.body, c.color);
		drawMatterBody(ctx, c.body, "white");
}

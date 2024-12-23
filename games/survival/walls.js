
function wall_create(g, x, y, w, h) {
	let data = {
		body: Matter.Bodies.rectangle(x + w/2, y + h/2, w, h, {
			isStatic: true
		})
	};
	Matter.Composite.add(g.engine.world, data.body);
	return game_object_create(g, "wall", data, wall_update, wall_draw);
}

function wall_update(w, dt) {}

function wall_draw(w, ctx) {
	//drawMatterBody(ctx, w.body, 'orange')
}



function wall_create(g, x, y, w, h) {
	let data = {
		body: Matter.Bodies.rectangle(x + w/2, y + h/2, w, h, {
			isStatic: true
		})
	};
	Matter.Composite.add(g.engine.world, data.body);
	let iobj = game_object_create(g, "wall", data, wall_update, wall_draw);
	let obj = g.objects[iobj];
	obj.persistent = false;
	return iobj;
}

function wall_update(w, dt) {}

function wall_draw(w, ctx) {
	//drawMatterBody(ctx, w.body, 'orange')
}


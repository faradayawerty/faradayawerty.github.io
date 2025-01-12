
function bound_create(g, x, y, w, h) {
	let data = {
		body: Matter.Bodies.rectangle(x + w/2, y + h/2, w, h, {
			isStatic: true
		})
	};
	Matter.Composite.add(g.engine.world, data.body);
	let iobj = game_object_create(g, "bound", data, bound_update, bound_draw, bound_destroy);
	let obj = g.objects[iobj];
	obj.persistent = false;
	return iobj;
}

function bound_destroy(bound_object) {
	Matter.Composite.remove(bound_object.game.engine.world, bound_object.data.body);
	bound_object.data.body = null;
	bound_object.destroyed = true;
}

function bound_update(bound_object, dt) {}

function bound_draw(bound_object, ctx) {
	//drawMatterBody(ctx, bound_object.data.body, 'orange')
}


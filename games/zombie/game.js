
function game_create(input_, engine_) {
	let g = {
		unit: 12,
		shown: true,
		running: false,
		paused: false,
		follow: null,
		input: input_,
		engine: engine_,
		objects: []
	};
	return g;
}

function game_update(g, dt) {
	for (let i = 0; i < g.objects.length; i++)
		if(g.objects[i] != null && g.objects[i].data != null)
			g.objects[i].update(g, g.objects[i].data, dt);
	g.objects = g.objects.filter(function (x) {
		if(!x.data.destroy)
			return x;
	});
}

function game_draw(g, ctx) {
	ctx.save();
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
	ctx.scale(g.unit, g.unit);
	let ifollow = -1;
	if(g.follow != null)
		ifollow = g.objects.indexOf(g.follow);
	if (0 <= ifollow && ifollow < g.objects.length)
		ctx.translate(-g.objects[ifollow].data.body.position.x, -g.objects[ifollow].data.body.position.y);
	for (let i = g.objects.length - 1; i > -1; i--)
		if(g.objects[i] != null && g.objects[i].data != null)
			g.objects[i].draw(g, g.objects[i].data, ctx);
	ctx.restore();
}

function game_object_create(g, func_update, func_draw, obj_data) {
	let o = {
		data: obj_data,
		update: func_update, // update(game, data, dt)
		draw: func_draw // draw(game, data, ctx)
	};
	g.objects.push(o);
	return o;
}

function game_destroy_all_objects(g) {
	Matter.Composite.clear(g.engine.world);
	for (let i = 0; i < g.objects.length; i++)
		g.objects.pop();
}


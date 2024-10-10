function game_create(input_) {
	let g = {
		shown: true,
		running: false,
		paused: false,
		ifollow: -1,
		unit: 12,
		input: input_,
		objects: []
	};
	return g;
}

function game_update(g, dt) {
	for (let i = 0; i < g.objects.length; i++)
		g.objects[i].update(g, g.objects[i].data, dt);
}

function game_draw(g, ctx) {
	ctx.save();
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
	ctx.scale(g.unit, g.unit);
	if (0 <= g.ifollow && g.ifollow < g.objects.length)
		ctx.translate(-g.objects[g.ifollow].data.body.vertices[0].x, -g.objects[g.ifollow].data.body.vertices[0].y);
	for (let i = 0; i < g.objects.length; i++)
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
	return g.objects.length - 1;
}

function game_destroy_all_objects(g) {
	Matter.Composite.clear(engine.world);
	for (let i = 0; i < g.objects.length; i++)
		g.objects.pop();
}

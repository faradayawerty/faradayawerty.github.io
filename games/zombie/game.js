
function game_create(input_) {
	let g = {
		shown: true,
		running: false,
		paused: false,
		input: input_,
		objects: []
	};
	return g;
}

function game_update(g, dt) {
	for(let i = 0; i < g.objects.length; i++)
		g.objects[i].update(g, g.objects[i].data, dt);
}

function game_draw(g, ctx) {
	for(let i = 0; i < g.objects.length; i++)
		g.objects[i].draw(g, g.objects[i].data, ctx);
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


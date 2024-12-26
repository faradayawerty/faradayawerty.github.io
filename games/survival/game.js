
function game_create(input_, engine_) {
	let g = {	
		input: input_,
		engine: engine_,
		
		objects: [],
		settings: {
			player_color: "red"
		},
		
		level: "0x0",
		offset_x: 1250,
		offset_y: 1250
	};
	return g;
}

function game_new(g) {
	game_destroy_all_objects(g);
	player_create(g, 1250, 1250);
	levels_set(g, "0x0");
}

function game_object_create(g, name_, data_, func_update, func_draw) {
	let obj = {
		name: name_,
		data: data_,
		update: func_update,
		draw: func_draw
	};
	return 0;
}

function game_update(g, dt) {
	for(let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		obj.update(obj.data, dt);
		if(obj.name == "player") {
			if(obj.data.want_level != g.level)
				levels_set(g, obj.data.want_level);
			g.offset_x = obj.data.body.position.x;
			g.offset_y = obj.data.body.position.y;
		}
	}
}

function game_draw(g, ctx) {
	ctx.save();
	ctx.translate(ctx.canvas.width / 2 - g.offset_x, ctx.canvas.height / 2 - g.offset_y);
	for(let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		obj.draw(obj.data, ctx);
	}
	ctx.restore();
	drawText(ctx, 40, 40, Math.round(g.offset_x) + ":" + Math.round(g.offset_y));
	drawText(ctx, 40, 60, g.level);
}

function game_update_settings(g) {
	for(let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		if(obj.name == "player" && obj.data.color != g.settings.player_color)
			obj.data.color = g.settings.player_color;
	}
}

function game_destroy_all_objects(g) {
	Matter.Composite.clear(g.engine.world);
	g.objects = [];
}

function game_destroy_level(g) {
	for(let i = 0; i < g.objects.length; i++) {
		if(g.objects[i].name == "wall")
			Matter.Composite.remove(g.engine.world, g.objects[i].data.body);
	}
	g.objects = g.objects.filter((obj) => (obj.name != "decorative" && obj.name != "wall"));
}

function game_object_make_last(g, i) {
	let obj = g.objects[i];
	g.objects.splice(i, 1);
	return g.objects.push(obj) - 1;
}

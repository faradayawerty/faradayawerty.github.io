
function game_create(input_, engine_) {
	let g = {
		settings: {
			player_color: "red",
			scale: 64
		},
		level: null,
		objects: [],
		camera_target: null,
		input: input_,
		engine: engine_
	};
	return g;
}

function game_new(g) {
	game_destroy_all_objects(g);
	player_create(g, 1250, 1250);
}

function game_object_create(g, name_, data_, func_update, func_draw) {
	let obj = {
		name: name_,
		data: data_,
		update: func_update,
		draw: func_draw
	};
	return g.objects.unshift(obj) - 1;
}

function game_update(g, dt) {
	if(g.camera_target == null) {
		let target = g.objects.find((obj) => obj.name == "player").data;
		if(target != null
		   g.camera_target = target;
	} else {
		let level_x = Number(g.level.split("x")[0]);
		let level_y = Number(g.level.split("x")[1]);
		let Ox = 2500 * level_x;
		let Oy = 2500 * level_y;
		if(g.camera_target.body.position.x < Ox)
			g.camera_target.want_level = (level_x - 1) + "x" + level_y;
		else if(g.camera_target.body.position.x > Ox + 2500)
			g.camera_target.want_level = (level_x + 1) + "x" + level_y;
		if(g.camera_target.body.position.y < Oy)
			g.camera_target.want_level = level_x + "x" + (level_y - 1);
		else if(g.camera_target.body.position.y > Oy + 2500)
			g.camera_target.want_level = level_x + "x" + (level_y + 1);
		if(g.camera_target.want_level != g.level)
			levels_set(g, g.camera_target.want_level);
	}
	for(let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		obj.update(obj.data, dt);
	}
}

function game_draw(g, ctx) {
	ctx.save();
	if(g.camera_target != null) {
		ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.translate(-g.camera_target.body.position.x, -g.camera_target.body.position.y);
	}
	for(let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		obj.draw(obj.data, ctx);
	}
	ctx.restore();
	if(g.camera_target != null) {
		drawText(ctx, 40, 40,
			Math.round(g.camera_target.body.position.x)
			+ ":"
			+ Math.round(g.camera_target.body.position.y));
		drawText(ctx, 40, 60, g.level);
	}
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
	g.objects = g.objects.filter(
		(obj) => (obj.name != "decorative" && obj.name != "wall"));
}


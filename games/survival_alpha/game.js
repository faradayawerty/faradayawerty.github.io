
function game_create(input_, engine_) {
	let g = {	
		level: "0x0",
		visited_levels: ["0x0"],
		offset_x: 1250,
		offset_y: 1250,
		scale: 1,
		camera_target_body: null,
		player_object: null,
		objects: [],
		gui_elements: [],
		input: input_,
		engine: engine_,
		settings: {
			language: "english",
			player_color: "red",
			player_draw_gun: true,
			enemies_spawn: true,
			show_hints: false,
			indicators: {
				"show player health": true,
				"show player hunger": true,
				"show player thirst": true,
				"show enemy health": true,
				"show enemy hunger": false,
				"show car health": true,
				"show car fuel": true
			}
		},
		want_respawn_menu: false,
		want_hide_inventory: false
	};
	return g;
}

function game_new(g) {
	game_destroy_all_gui_elements(g);
	game_destroy_all_objects(g);
	let iplayer = player_create(g, 1250, 1250);
	levels_set(g, "0x0");
}

function game_object_create(g, name_, data_, func_update, func_draw, func_destroy, unique_name_=null) {
	if(unique_name_ && g.objects.find((obj) => obj.unique_name == unique_name_))
		return -1;
	let obj = {
		game: g,
		name: name_,
		unique_name: unique_name_,
		data: data_,
		update: func_update,
		draw: func_draw,
		destroy: func_destroy,
		persistent: true,
		destroyed: false
	};
	g.objects.push(obj);
	game_objects_arrange(g);
	let iobj = g.objects.indexOf(obj);
	return iobj;
}

function game_gui_element_create(g, name_, data_, func_update, func_draw, func_destroy) {
	let elem = {
		game: g,
		name: name_,
		data: data_,
		update: func_update,  
		draw: func_draw,      
		destroy: func_destroy,
		shown: false,
		destroyed: false
	};
	return g.gui_elements.push(elem) - 1;
}

function game_update(g, dt) {
	if(isKeyDown(g.input, '=', true))
		g.scale = g.scale / 0.9375;
	if(isKeyDown(g.input, '-', true))
		g.scale = g.scale * 0.9375;
	g.objects = g.objects.filter((obj) => !obj.destroyed);
	g.gui_elements = g.gui_elements.filter((elem) => !elem.destroyed);
	for(let i = 0; i < g.objects.length; i++) {
		if(!g.objects[i].destroyed)
			g.objects[i].update(g.objects[i], dt);
	}
	for(let i = 0; i < g.gui_elements.length; i++) {
		if(!g.gui_elements[i].destroyed && g.gui_elements[i].shown)
			g.gui_elements[i].update(g.gui_elements[i], dt);
	}
}

function game_draw(g, ctx) {
	ctx.save();
	if(g.camera_target_body) {
		g.offset_x = g.camera_target_body.position.x;
		g.offset_y = g.camera_target_body.position.y;
	}
	ctx.scale(g.scale, g.scale);
	ctx.translate(0.5 * ctx.canvas.width / g.scale - g.offset_x, 0.5 * ctx.canvas.height / g.scale - g.offset_y);
	for(let i = 0; i < g.objects.length; i++)
		if(!g.objects[i].destroyed)
			g.objects[i].draw(g.objects[i], ctx);
	ctx.restore();
	ctx.save()
	ctx.scale(window.innerWidth / 1800, window.innerWidth / 1800);
	for(let i = 0; i < g.gui_elements.length; i++) {
		if(!g.gui_elements[i].destroyed && g.gui_elements[i].shown)
			g.gui_elements[i].draw(g.gui_elements[i], ctx);
	}
	ctx.restore();
}

function game_destroy_all_objects(g) {
	for(let i = 0; i < g.objects.length; i++)
		g.objects[i].destroy(g.objects[i]);
	Matter.Composite.clear(g.engine.world);
	g.objects = [];
}

function game_destroy_all_gui_elements(g) {
	for(let i = 0; i < g.gui_elements.length; i++)
		g.gui_elements[i].destroy(g.gui_elements[i]);
	g.gui_elements = [];
}

function game_destroy_level(g) {
	for(let i = 0; i < g.objects.length; i++)
		if(!g.objects[i].persistent)
			g.objects[i].destroy(g.objects[i]);
}

function game_object_find_closest(g, x, y, name, radius) {
	let pos = Matter.Vector.create(x, y);
	let closest = null;
	for(let i = 0; i < g.objects.length; i++) {
		let obj = null;
		if(g.objects[i].name == name)
			obj = g.objects[i];
		else
			continue;
		if(radius >= 0 && !closest && dist(obj.data.body.position, pos) < radius)
			closest = obj;
		if(closest && dist(obj.data.body.position, pos) < dist(closest.data.body.position, pos))
			closest = obj;
	}
	return closest;
}

function game_objects_arrange(g) {
	let arrangement = [
		"decorative_roof",
		"decorative_leaves",
		"decorative_trunk",
		"player",
		"enemy",
		"item",
		"car",
		"bullet",
		"decorative_wall",
		"decorative",
		"decorative_grass",
		"decorative_level_base"
	];
	let objects_new = [];
	let leftover = g.objects.filter((obj) => !arrangement.includes(obj.name));
	for(let i = 0; i < arrangement.length; i++)
		objects_new = g.objects.filter((obj) => obj.name == arrangement[i]).concat(objects_new);
	objects_new = leftover.concat(objects_new);
	g.objects = objects_new;
}

function game_object_change_name(g, i, name) {
	g.objects[i].name = name;
	game_objects_arrange(g);
}


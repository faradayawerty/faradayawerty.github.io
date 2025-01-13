
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
			lose_items_on_death: true,
			trees: true,
			indicators: {
				"show player health": true,
				"show player hunger": true,
				"show player thirst": true,
				"show enemy health": true,
				"show enemy hunger": true,
				"show car health": true,
				"show car fuel": true,
				"show rocket health": false
			},
			auto_pickup: {
				"automatically pickup food and drinks": false,
				"automatically pickup fuel": false,
				"automatically pickup health": false,
				"automatically pickup ammo": false
			},
			ammo_pickup_last: true,
			respawn_on_current_level: true
		},
		want_respawn_menu: false,
		want_hide_inventory: false,
		kills: 0,
		kills_for_boss: 10,
		boss_kills: 0,
		show_gui: true,
		deaths: 0,
		saved_items: [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		enemies: {
			"regular": true,
			"shooting": false,
			"shooting red": false,
			"sword": false,
			"shooting rocket": false
		},
		enemies_default: {
			"regular": true,
			"shooting": false,
			"shooting red": false,
			"sword": false,
			"shooting rocket": false
		}
	};
	return g;
}

function game_new(g) {
	game_destroy_all_gui_elements(g);
	game_destroy_all_objects(g);
	g.enemies["regular"] = g.enemies_default["regular"];
	g.enemies["shooting"] = g.enemies_default["shooting"];
	g.enemies["shooting red"] = g.enemies_default["shooting red"];
	g.enemies["sword"] = g.enemies_default["sword"];
	g.enemies["shooting rocket"] = g.enemies_default["shooting rocket"];
	for(let i = 0; i < g.saved_items.length; i++)
		for(let j = 0; j < g.saved_items[i].length; j++)
			g.saved_items[i][j] = 0;
	let iplayer = player_create(g, 1250, 1250);
	g.kills = 0;
	g.boss_kills = 0;
	g.deaths = 0;
	g.kills_for_boss = 10;
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
	if(isKeyDown(g.input, '=', true) && (g.scale < 2 || !g.camera_target_body))
		g.scale = g.scale / 0.9375;
	if(isKeyDown(g.input, '-', true) && (g.scale > 0.5 || !g.camera_target_body))
		g.scale = g.scale * 0.9375;
	let plr = g.objects.find((obj) => obj.name == "player" && !obj.data.ai_controlled);
	if(plr) {
		if(isKeyDown(g.input, 'x', true)) {
			plr.data.ai_controlled = true;
			g.camera_target_body = null;
		}
	} else {
		if(isKeyDown(g.input, 'x', true)) {
			let plr = g.objects.find((obj) => obj.name == "player" && obj.data.ai_controlled);
			if(plr)
				plr.data.ai_controlled = false;
		}
		if(isKeyDown(g.input, 'd', false))
			g.offset_x += dt;
		if(isKeyDown(g.input, 'a', false))
			g.offset_x -= dt;
		if(isKeyDown(g.input, 'w', false))
			g.offset_y -= dt;
		if(isKeyDown(g.input, 's', false))
			g.offset_y += dt;
	}
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

	if(!g.show_gui)
		return;

	ctx.save()
	ctx.scale(window.innerWidth / 1800, window.innerWidth / 1800);
	drawText(ctx, 50, 110, game_translate(g.settings.language, "killed")
		+ ": " + Math.round(g.kills) + " " + game_translate(g.settings.language, "enemies"));
	drawText(ctx, 50, 140, game_translate(g.settings.language, "killed")
		+ ": " + Math.round(g.boss_kills) + " " + game_translate(g.settings.language, "bosses"));
	drawText(ctx, 50, 170, game_translate(g.settings.language, "player deaths") + ": " + Math.round(g.deaths));
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

function game_destroy_level(g, old_level=null) {
	if(!old_level)
		return;
	for(let i = 0; i < g.objects.length; i++)
		if(!g.objects[i].persistent) {
			if(old_level) {
				let level_x = Number(old_level.split("x")[0]);
				let level_y = Number(old_level.split("x")[1]);
				let Ox = 2500 * level_x;
				let Oy = 2500 * level_y;
				if(["decorative_roof",
					"decorative_leaves",
					"decorative_trunk",
					"decorative_wall",
					"decorative",
					"decorative_grass",
					"decorative_level_base"].includes(g.objects[i].name)) {
					if(g.objects[i].data.x < Ox || Ox + 2500 <= g.objects[i].data.x
						|| g.objects[i].data.y < Oy || Oy + 2500 <= g.objects[i].data.y)
						continue;
				}
				if(["bound"].includes(g.objects[i].name)) {
					if(!g.objects[i].data.body)
						continue;
					if(g.objects[i].data.body.position.x < Ox || Ox + 2500 < g.objects[i].data.body.position.x
						|| g.objects[i].data.body.position.y < Oy || Oy + 2500 < g.objects[i].data.body.position.y)
						continue;
				}
			}
			g.objects[i].destroy(g.objects[i]);
		}
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
		if(!obj.data.body)
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
		"bound",
		"decorative_roof",
		"decorative_leaves",
		"decorative_trunk",
		"shield",
		"rocket",
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

function game_translate(language, text) {
	if(language == "русский") {
		if(text == "survived")
			return "отсутствие смертей";
		if(text == "seconds")
			return "секунд";
		if(text == "max")
			return "рекордное";
		if(text == "killed")
			return "убито";
		if(text == "enemies")
			return "врагов";
		if(text == "bosses")
			return "боссов";
		if(text == "player deaths")
			return "смерти игрока";
	}
	return text;
}


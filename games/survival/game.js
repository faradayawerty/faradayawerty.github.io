function game_create(input_, engine_, audios_) {
	let g = {
		autosave_timer: 120001,
		want_levels: [],
		level_set_delay: 100,
		respawn_level: "0x0",
		visited_levels: ["0x0"],
		assigned_tiles: [LEVEL_TILE_START],
		offset_x: 1250,
		offset_y: 1250,
		scale: 0.6328125 / DPR,
		camera_target_body: null,
		player_object: null,
		objects: [],
		gui_elements: [],
		input: input_,
		audio: audios_,
		engine: engine_,
		settings: {
			language: "english",
			auto_aim: false,
			player_color: "red",
			player_draw_gun: true,
			enemies_spawn: true,
			show_hints: false,
			lose_items_on_death: true,
			lose_achievements_on_death: false,
			trees: true,
			volume: 1.0,
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
				"automatically pickup ammo": false,
				"automatically pickup weapons": false,
				"automatically pickup shields": false,
				"automatically pickup bossifiers": false,
			},
			ammo_pickup_last: true,
			respawn_on_current_level: true
		},
		want_respawn_menu: false,
		want_hide_inventory: false,
		kills: 0,
		kills_for_boss: 16,
		boss_kills: 0,
		show_gui: true,
		deaths: 0,
		saved_items: [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		saved_achievements: [],
		available_enemies: [],
		enemy_kills: {},
		debug: false,
		debug_console: [],
		godmode: false,
		all_enemies_are_bosses: false,
		mobile: false
	};
	return g;
}

function game_new(g, force_clean = false) {
	if (!force_clean) {
		let loaded = game_autoload(g);
		if (loaded) {
			console.log("Загружено предыдущее сохранение.");
			return;
		}
	}
	g.available_enemies = ["regular"];
	g.visited_levels = ["0x0"];
	g.assigned_tiles = [LEVEL_TILE_START];
	for (let i = 0; i < g.saved_items.length; i++)
		for (let j = 0; j < g.saved_items[i].length; j++)
			g.saved_items[i][j] = 0;
	game_destroy_all_gui_elements(g);
	game_destroy_all_objects(g);
	let iplayer = player_create(g, 1250, 1250);
	g.kills = 0;
	g.boss_kills = 0;
	g.deaths = 0;
	g.kills_for_boss = 10;
}

function game_object_create(g, name_, data_, func_update, func_draw,
	func_destroy, unique_name_ = null) {
	let debug_line = "creating " + name_;
	if (name_ != "item" && name_ != "bound" && name_ != "decorative" && name_ !=
		"bullet" && name_ != "rocket")
		g.debug_console.unshift(debug_line);
	if (g.debug_console.length > 50)
		g.debug_console.pop();
	if (unique_name_ && g.objects.find((obj) => obj.unique_name ==
			unique_name_))
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

function game_gui_element_create(g, name_, data_, func_update, func_draw,
	func_destroy) {
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
	g.level_set_delay += dt;
	if (!g.mobile && g.input.touch.length > 0) {
		g.mobile = true;
	}
	if (isKeyDown(g.input, '=', true) && (g.scale < 4 / DPR || !g
			.camera_target_body)) {
		if (g.mobile)
			g.scale = g.scale * Math.pow(4, dt / 1000);
		else
			g.scale = g.scale / 0.9375;
	}
	if (isKeyDown(g.input, '-', true) && (g.scale > 0.25 / DPR || !g
			.camera_target_body)) {
		if (g.mobile)
			g.scale = g.scale * Math.pow(4, -dt / 1000);
		else
			g.scale = g.scale * 0.9375;
	}
	let plr = g.objects.find((obj) => obj.name == "player" && !obj.data
		.ai_controlled);
	if (plr) {
		if (isKeyDown(g.input, ']', true)) {
			plr.data.ai_controlled = true;
			g.camera_target_body = null;
		}
	}
	else {
		if (isKeyDown(g.input, ']', true)) {
			let plr = g.objects.find((obj) => obj.name == "player" && obj.data
				.ai_controlled);
			if (plr)
				plr.data.ai_controlled = false;
		}
		if (isKeyDown(g.input, 'd', false))
			g.offset_x += dt;
		if (isKeyDown(g.input, 'a', false))
			g.offset_x -= dt;
		if (isKeyDown(g.input, 'w', false))
			g.offset_y -= dt;
		if (isKeyDown(g.input, 's', false))
			g.offset_y += dt;
	}
	g.objects = g.objects.filter((obj) => !obj.destroyed);
	g.gui_elements = g.gui_elements.filter((elem) => !elem.destroyed);
	for (let i = 0; i < g.objects.length; i++) {
		if (!g.objects[i].destroyed)
			g.objects[i].update(g.objects[i], dt);
	}
	for (let i = 0; i < g.gui_elements.length; i++) {
		if (!g.gui_elements[i].destroyed && g.gui_elements[i].shown)
			g.gui_elements[i].update(g.gui_elements[i], dt);
	}
	if (g.debug_console.length > 50)
		g.debug_console.pop();
	if (g.input.touch.length > 0) {
		g.input.mouse.x = g.input.touch[0].x;
		g.input.mouse.y = g.input.touch[0].y;
		g.input.mouse.leftButtonPressed = g.input.touch.length > 0;
	}
	else if (g.mobile) {
		g.input.mouse.x = undefined;
		g.input.mouse.y = undefined;
	}
	bindings_update();
	g.autosave_timer = (g.autosave_timer || 0) + dt;
	if (g.autosave_timer > 120000) {
		game_autosave(g);
		g.autosave_timer = 0;
	}
}

function game_draw(g, ctx) {
	ctx.save();
	if (g.camera_target_body) {
		g.offset_x = g.camera_target_body.position.x;
		g.offset_y = g.camera_target_body.position.y;
	}
	ctx.scale(g.scale, g.scale);
	ctx.translate(0.5 * window.innerWidth / g.scale - g.offset_x, 0.5 * window
		.innerHeight / g.scale - g.offset_y);
	for (let i = 0; i < g.objects.length; i++)
		if (!g.objects[i].destroyed)
			g.objects[i].draw(g.objects[i], ctx);
	ctx.restore();
	if (!g.show_gui)
		return;
	if (g.debug) {
		ctx.save();
		ctx.scale(get_scale(), get_scale());
		for (let i = 0; i < g.debug_console.length; i++)
			drawText(ctx, 50, 110 + i * 20, g.debug_console[i]);
		ctx.restore();
	}
	ctx.save()
	ctx.scale(get_scale(), get_scale());
	for (let i = 0; i < g.gui_elements.length; i++) {
		if (!g.gui_elements[i].destroyed && g.gui_elements[i].shown)
			g.gui_elements[i].draw(g.gui_elements[i], ctx);
	}
	ctx.restore();
	if (g.mobile) {
		drawJoysticks(ctx, g.input.joystick);
		drawMobileActionButtons(ctx, g.input);
	}
}

function game_destroy_all_objects(g) {
	for (let i = 0; i < g.objects.length; i++)
		g.objects[i].destroy(g.objects[i]);
	Matter.Composite.clear(g.engine.world);
	g.objects = [];
}

function game_destroy_all_gui_elements(g) {
	for (let i = 0; i < g.gui_elements.length; i++)
		g.gui_elements[i].destroy(g.gui_elements[i]);
	g.gui_elements = [];
}

function game_destroy_level(g, old_level = null) {
	if (!old_level)
		return;
	for (let i = 0; i < g.objects.length; i++)
		if (!g.objects[i].persistent) {
			if (old_level) {
				let level_x = Number(old_level.split("x")[0]);
				let level_y = Number(old_level.split("x")[1]);
				let Ox = 2500 * level_x;
				let Oy = 2500 * level_y;
				if (["decorative_roof",
						"decorative_leaves",
						"decorative_trunk",
						"decorative_hotdogs",
						"decorative_fuel_pump",
						"decorative_wall",
						"decorative",
						"decorative_grass",
						"decorative_level_base",
						"decorative_no_tree_zone"
					].includes(g.objects[i].name)) {
					if (g.objects[i].data.x < Ox || Ox + 2500 <= g.objects[i]
						.data.x ||
						g.objects[i].data.y < Oy || Oy + 2500 <= g.objects[i]
						.data.y)
						continue;
				}
				if (["bound"].includes(g.objects[i].name)) {
					if (!g.objects[i].data.body)
						continue;
					if (g.objects[i].data.body.position.x < Ox || Ox + 2500 < g
						.objects[i].data.body.position.x ||
						g.objects[i].data.body.position.y < Oy || Oy + 2500 < g
						.objects[i].data.body.position.y)
						continue;
				}
			}
			g.objects[i].destroy(g.objects[i]);
		}
}

function game_object_find_closest(g, x, y, name, radius, filter_func = null) {
	let pos = Matter.Vector.create(x, y);
	let closest = null;
	for (let i = 0; i < g.objects.length; i++) {
		if (g.objects[i].destroyed || !g.objects[i].data.body)
			continue;
		let obj = null;
		if (g.objects[i].name == name) {
			if (filter_func && !filter_func(g.objects[i]))
				continue;
			obj = g.objects[i];
		}
		else
			continue;
		if (radius >= 0 && !closest && dist(obj.data.body.position, pos) <
			radius)
			closest = obj;
		if (closest && dist(obj.data.body.position, pos) < dist(closest.data
				.body.position, pos))
			closest = obj;
	}
	return closest;
}

function game_objects_arrange(g) {
	const weights = {
		"bound": 1,
		"decorative_roof": 2,
		"decorative_leaves": 3,
		"decorative_trunk": 4,
		"decorative_hotdogs": 5,
		"decorative_fuel_pump": 6,
		"shield": 7,
		"rocket": 8,
		"player": 9,
		"animal": 10,
		"enemy": 11,
		"item": 12,
		"car": 13,
		"trashcan": 14,
		"bullet": 15,
		"trashbullet": 16,
		"decorative_wall": 17,
		"decorative": 18,
		"decorative_grass": 19,
		"decorative_level_base": 20,
		"decorative_no_tree_zone": 21
	};
	g.objects.sort((a, b) => {
		let weightA = weights[a.name] || 0;
		let weightB = weights[b.name] || 0;
		return weightB - weightA;
	});
}

function game_object_change_name(g, i, name) {
	g.objects[i].name = name;
	game_objects_arrange(g);
}

function game_translate(language, text) {
	if (language == "русский") {
		if (text == "survived")
			return "отсутствие смертей";
		if (text == "seconds")
			return "секунд";
		if (text == "max")
			return "рекордное";
		if (text == "killed")
			return "убито";
		if (text == "enemies")
			return "врагов";
		if (text == "bosses")
			return "боссов";
		if (text == "player deaths")
			return "смерти игрока";
	}
	return text;
}

function game_get_max_enemy(g) {
	let ans = "regular";
	if (g.objects["shooting"])
		ans = "shooting";
	if (g.objects["shooting red"])
		ans = "shooting red";
	if (g.objects["sword"])
		ans = "sword";
	if (g.objects["shooting rocket"])
		ans = "shooting rocket";
	if (g.objects["shooting laser"])
		ans = "shooting laser";
	return ans;
}

function game_object_make_savable(obj) {
	if (obj.destroyed)
		return null;
	if (obj.name == "item") {
		let saved_obj = {
			name: "item",
			data: {
				x: obj.data.body.position.x,
				y: obj.data.body.position.y,
				id: obj.data.id,
				dropped: obj.data.dropped,
				despawn: obj.data.despawn
			}
		};
		return saved_obj;
	}
	if (obj.name == "car") {
		let saved_obj = {
			name: "car",
			unique_name: obj.unique_name,
			data: {
				x: obj.data.body.position.x,
				y: obj.data.body.position.y,
				is_tank: obj.data.is_tank,
				color: obj.data.color,
				type: obj.data.type,
				health: obj.data.health,
				fuel: obj.data.fuel
			}
		};
		return saved_obj;
	}
	if (obj.name == "enemy") {
		let saved_obj = {
			name: "enemy",
			data: {
				x: obj.data.body.position.x,
				y: obj.data.body.position.y,
				type: obj.data.type,
				is_minion: obj.data.is_minion,
				boss: obj.data.boss
			}
		};
		return saved_obj;
	}
	if (obj.name == "player") {
		let saved_obj = {
			name: "player",
			data: {
				ai_controlled: obj.data.ai_controlled,
				x: obj.data.body.position.x,
				y: obj.data.body.position.y,
				items: [
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
				],
				achievements: []
			}
		};
		for (let i = 0; i < obj.data.inventory_element.data.items.length; i++) {
			for (let j = 0; j < obj.data.inventory_element.data.items[i]
				.length; j++)
				saved_obj.data.items[i][j] = obj.data.inventory_element.data
				.items[i][j];
		}
		saved_obj.data.achievements = obj.data.achievements_element.data
			.achievements.filter((ach) => ach.done);
		return saved_obj;
	}
	return null;
}

function game_save(g) {
	let objs = [];
	let state_object = {
		name: "state",
		enemies: {
			"regular": g.available_enemies.includes("regular"),
			"shooting": g.available_enemies.includes("shooting"),
			"shooting red": g.available_enemies.includes("shooting red"),
			"sword": g.available_enemies.includes("sword"),
			"shooting rocket": g.available_enemies.includes(
				"shooting rocket"),
			"shooting laser": g.available_enemies.includes(
				"shooting laser"),
		},
		available_enemies: g.available_enemies,
		kills: g.kills,
		boss_kills: g.boss_kills,
		deaths: g.deaths,
		visited_levels: g.visited_levels,
		assigned_tiles: g.assigned_tiles
	};
	objs.push(state_object);
	for (let i = 0; i < g.objects.length; i++) {
		let obj = game_object_make_savable(g.objects[i]);
		if (obj)
			objs.push(obj);
	}
	let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON
		.stringify(objs));
	let filename = "faw_survival_save_" + Math.floor(Math.random() * 1000) +
		".json";
	let dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", filename);
	dlAnchorElem.click();
}

function game_load(g) {
	let input = document.getElementById('file-input');
	input.onchange = e => {
		let file = e.target.files[0];
		let reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = readerEvent => {
			let content = readerEvent.target.result;
			let saved_objects = JSON.parse(content);
			game_destroy_all_gui_elements(g);
			game_destroy_all_objects(g);
			for (let i = 0; i < saved_objects.length; i++) {
				let obj = saved_objects[i];
				if (obj.name == "state") {
					if (obj.available_enemies) {
						g.available_enemies = obj.available_enemies;
					}
					else if (obj.enemies) {
						g.available_enemies = [];
						for (let key in obj.enemies) {
							if (obj.enemies[key] === true) {
								g.available_enemies.push(key);
							}
						}
						if (g.available_enemies.length === 0) g
							.available_enemies = ["regular"];
					}
					g.kills = obj.kills;
					g.boss_kills = obj.boss_kills;
					g.deaths = obj.deaths;
					g.visited_levels = obj.visited_levels;
					g.assigned_tiles = obj.assigned_tiles;
				}
				if (obj.name == "player") {
					let iplayer = player_create(g, obj.data.x, obj.data
						.y, false, obj.data.ai_controlled);
					let plr = g.objects[iplayer];
					for (let i = 0; i < plr.data.inventory_element.data
						.items.length; i++) {
						for (let j = 0; j < plr.data.inventory_element
							.data.items[i].length; j++)
							plr.data.inventory_element.data.items[i][
								j
							] = obj.data.items[i][j];
					}
					try {
						for (let i = 0; i < obj.data.achievements
							.length; i++)
							achievement_do(plr.data.achievements_element
								.data.achievements, obj.data
								.achievements[i].name, plr.data
								.achievements_shower_element, true);
					}
					catch (e) {
						g.debug_console.unshift(e);
					}
				}
				if (obj.name == "enemy")
					enemy_create(g, obj.data.x, obj.data.y, obj.data
						.boss, obj.data.is_minion, obj.data.type);
				if (obj.name == "item")
					item_create(g, obj.data.id, obj.data.x, obj.data.y,
						obj.data.dropped, obj.data.despawn);
				if (obj.name == "car")
					car_create(g, obj.data.x, obj.data.y, obj.data
						.color, obj.data.is_tank, true, obj.data.type,
						obj.data.health,
						obj.data.fuel
					);
			}
		}
		try {
			input.value = '';
			if (input.value) {
				input.type = "text";
				input.type = "file";
			}
		}
		catch (e) {}
	}
	input.click();
}

function game_autosave(g) {
	let objs = [];
	let state_object = {
		name: "state",
		available_enemies: g.available_enemies,
		kills: g.kills,
		boss_kills: g.boss_kills,
		deaths: g.deaths,
		visited_levels: g.visited_levels,
		assigned_tiles: g.assigned_tiles
	};
	objs.push(state_object);
	for (let i = 0; i < g.objects.length; i++) {
		let obj = game_object_make_savable(g.objects[i]);
		if (obj) objs.push(obj);
	}
	localStorage.setItem("faw_survival_autosave_1", JSON.stringify(objs));
	console.log("Игра автоматически сохранена");
}

function game_autoload(g) {
	let content = localStorage.getItem("faw_survival_autosave_1");
	if (!content) return false;
	try {
		let saved_objects = JSON.parse(content);
		game_destroy_all_gui_elements(g);
		game_destroy_all_objects(g);
		for (let i = 0; i < saved_objects.length; i++) {
			let obj = saved_objects[i];
			if (obj.name == "state") {
				g.available_enemies = obj.available_enemies || ["regular"];
				g.kills = obj.kills;
				g.boss_kills = obj.boss_kills;
				g.deaths = obj.deaths;
				g.visited_levels = obj.visited_levels;
				g.assigned_tiles = obj.assigned_tiles;
			}
			if (obj.name == "player") {
				let iplayer = player_create(g, obj.data.x, obj.data.y, false,
					obj.data.ai_controlled);
				let plr = g.objects[iplayer];
				for (let row = 0; row < plr.data.inventory_element.data.items
					.length; row++) {
					for (let col = 0; col < plr.data.inventory_element.data
						.items[row].length; col++) {
						plr.data.inventory_element.data.items[row][col] = obj
							.data.items[row][col];
					}
				}
				try {
					for (let j = 0; j < obj.data.achievements.length; j++) {
						achievement_do(plr.data.achievements_element.data
							.achievements,
							obj.data.achievements[j].name,
							plr.data.achievements_shower_element, true);
					}
				}
				catch (e) {
					g.debug_console.unshift(e);
				}
			}
			if (obj.name == "enemy") enemy_create(g, obj.data.x, obj.data.y, obj
				.data.boss, obj.data.is_minion, obj.data.type);
			if (obj.name == "item") item_create(g, obj.data.id, obj.data.x, obj
				.data.y, obj.data.dropped, obj.data.despawn);
			if (obj.name == "car") car_create(g, obj.data.x, obj.data.y, obj
				.data.color, obj.data.is_tank, true, obj.data.type, obj.data
				.health, obj.data.fuel);
		}
		return true;
	}
	catch (e) {
		console.error("Ошибка автозагрузки:", e);
		return false;
	}
}


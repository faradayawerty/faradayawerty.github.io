
function decorative_rectangle_create(g, x_, y_, w_, h_, color_fill_, color_outline_) {
	let r = {
		color_fill: color_fill_,
		color_outline: color_outline_,
		transparency: 1.0,
		x: x_,
		y: y_,
		w: w_,
		h: h_
	};
	let iobj = game_object_create(g, "decorative", r, function(){}, decorative_rectangle_draw, decorative_rectangle_destroy);
	let obj = g.objects[iobj];
	obj.persistent = false;
	return iobj;
}

function decorative_rectangle_destroy(decorative_rectangle_object) {
	decorative_rectangle_object.destroyed = true;
}

function decorative_text_create(g, text_, x_, y_, size_, color_) {
	let t = {
		text: text_,
		x: x_,
		y: y_,
		size: Math.floor(size_),
		color: color_
	};
	let iobj = game_object_create(g, "decorative", t, function(){}, decorative_text_draw, decorative_text_destroy);
	let obj = g.objects[iobj];
	obj.persistent = false;
	return iobj;
}

function decorative_text_destroy(decorative_text_object) {
	decorative_text_object.destroyed = true;
}

function decorative_rectangle_draw(rectangle_object, ctx) {
	let r = rectangle_object.data;
	ctx.globalAlpha = r.transparency;
	ctx.fillStyle = r.color_fill;
	ctx.fillRect(r.x, r.y, r.w, r.h);
	ctx.lineWidth = 2;
	ctx.strokeStyle = r.color_outline;
	ctx.strokeRect(r.x, r.y, r.w, r.h);
	ctx.globalAlpha = 1.0;
}

function decorative_text_draw(text_object, ctx) {
	let t = text_object.data;
	ctx.font = t.size + "px verdana";
	ctx.fillStyle = t.color;
	ctx.fillText(t.text, t.x, t.y);
}

function decorative_wall_create(g, x, y, w, h) {
	bound_create(g, x, y, w, h);
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, "#333333", "#555555"), "decorative_wall");
}

function decorative_building_create(g, x, y, w, h) {
	decorative_roof_create(g, x + 0.01 * w, y + 0.01 * h, w * 0.98, h * 0.98);
	decorative_wall_create(g, x, y, w, h * 0.05);
	decorative_wall_create(g, x, y + 0.95 * h, w, h * 0.05);
	decorative_wall_create(g, x, y, w * 0.05, h);
	decorative_wall_create(g, x + 0.95 * w, y, w * 0.05, 0.4 * h);
	decorative_wall_create(g, x + 0.95 * w, y + 0.55 * h, w * 0.05, 0.4 * h);
	decorative_wall_create(g, x + 0.5 * w, y, w * 0.05, 0.75 * h);
	decorative_wall_create(g, x, y + 0.4 * h, 0.4 * w, h * 0.05);
	decorative_rectangle_create(g, x, y, w, h, "#555555", "#333333");
}

function decorative_grass_create(g, x, y, w, h) {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, "#117711", "#005500"), "decorative_grass");
}

function decorative_parkinglot_create(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");
	let R = 205;
	decorative_rectangle_create(g, x + R/30, y + R/30, w - 2*R/30, h/161, "white", "white");
	for(let i = 0; (i+1)*R < w - R/30; i++) {
		decorative_rectangle_create(g, x + R/30 + i*R, y + R/30, w/161, h/2, "white", "white");
		decorative_text_create(g, Math.floor(50 + Math.random() * 50), x + 8*R/30 + i*R, y + 12*R/30, R/5, "white");
	}
}

function decorative_tree_create(g, x, y) {
	if(!g.settings.trees)
		return;
	bound_create(g, x, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x - 65, y, 160, 75, "lime", "#224400"), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 75, 30, 100, "brown", "#442200"), "decorative_trunk");
}

function decorative_road_create(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");
	N = 8.0;
	for(let i = 0; i < N && w > h; i++)
		decorative_rectangle_create(g, x + (i + 0.25) * w / N, y + h / 2 - 0.05 * h, 0.5 * w / N, 0.1 * h, "#ffffff", "#ffffff");
	for(let i = 0; i < N && h > w; i++)
		decorative_rectangle_create(g, x + w / 2 - 0.05 * w, y + (i + 0.25) * h / N, 0.1 * w, 0.5 * h / N, "#ffffff", "#ffffff");
}

function decorative_roof_create(g, x, y, w, h) {
	let iroof = decorative_rectangle_create(g, x, y, w, h, "#555555", "#555555")
	let roof = g.objects[iroof];
	roof.update = decorative_roof_update;
	game_object_change_name(g, iroof, "decorative_roof");
}

function decorative_roof_update(roof_object, dt) {
	let r = roof_object.data;
	let player_object = game_object_find_closest(roof_object.game, roof_object.data.x + 0.5 * r.w, roof_object.data.y + 0.5 * r.h, "player", Math.max(r.w, r.h));
	if(!player_object)
		return;
	let g = roof_object.game;
	let p = player_object.data;
	if(doRectsCollide(p.body.position.x, p.body.position.y, 0, 0, r.x, r.y, r.w, r.h))
		r.transparency = 0.1;
	else
		r.transparency = 1.0;
}

function decorative_level_base_create(g, x, y) {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, 2500, 2500, "gray", "white"), "decorative_level_base");
}


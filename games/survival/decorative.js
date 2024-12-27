
function decorative_rectangle_create(g, x_, y_, w_, h_, color_fill_, color_outline_) {
	let r = {
		color_fill: color_fill_,
		color_outline: color_outline_,
		x: x_,
		y: y_,
		w: w_,
		h: h_
	};
	return game_object_create(g, "decorative", r, function(){}, decorative_rectangle_draw);
}

function decorative_text_create(g, text_, x_, y_, size_, color_) {
	let t = {
		text: text_,
		x: x_,
		y: y_,
		size: Math.floor(size_),
		color: color_
	};
	return game_object_create(g, "decorative", t, function(){}, decorative_text_draw);
}

function decorative_rectangle_draw(r, ctx) {
	ctx.fillStyle = r.color_fill;
	ctx.fillRect(r.x, r.y, r.w, r.h);
	ctx.strokeStyle = r.color_outline;
	ctx.strokeRect(r.x, r.y, r.w, r.h);
}

function decorative_text_draw(t, ctx) {
	ctx.font = t.size + "px verdana";
	ctx.fillStyle = t.color;
	ctx.fillText(t.text, t.x, t.y);
}

function decorative_building_create(g, x, y, w, h) {
	let A = 64;
	decorative_rectangle_create(g, x + w/A, y + h/A, w - 2*w/A, h - 2*h/A, "#555555", "#555555");
	decorative_rectangle_create(g, x, y, w, h, "#333333", "#555555");
}

function decorative_grass_create(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#117711", "#005500");
}

function decorative_parkinglot_create(g, x, y, w, h) {
	let R = 205;
	for(let i = 0; (i+1)*R < w - R/30; i++) {
		decorative_rectangle_create(g, x + R/30 + i*R, y + R/30, w/161, h/2, "white", "white");
		decorative_text_create(g, Math.floor(50 + Math.random() * 50), x + 8*R/30 + i*R, y + 12*R/30, R/5, "white");
	}
	decorative_rectangle_create(g, x + R/30, y + R/30, w - 2*R/30, h/161, "white", "white");
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");
}

function decorative_tree_create(g, x, y) {
	wall_create(g, x, y + 145, 30, 30);
	game_object_make_last(g, decorative_rectangle_create(g, x - 65, y, 160, 75, "lime", "black"));
	game_object_make_last(g, decorative_rectangle_create(g, x, y + 75, 30, 100, "brown", "black"));
}

function decorative_road_create(g, x, y, w, h) {
	N = 8.0;
	for(let i = 0; i < N && w > h; i++)
		decorative_rectangle_create(g, x + (i + 0.25) * w / N, y + h / 2 - 0.05 * h, 0.5 * w / N, 0.1 * h, "#ffffff", "#ffffff");
	for(let i = 0; i < N && h > w; i++)
		decorative_rectangle_create(g, x + w / 2 - 0.05 * w, y + (i + 0.25) * h / N, 0.1 * w, 0.5 * h / N, "#ffffff", "#ffffff");
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");
}

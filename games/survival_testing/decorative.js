let DECORATIVE_POOL = [];
const MAX_POOL_SIZE = 2000;

function get_from_pool_or_create(g, type, data, init_fn, draw_fn, destroy_fn) {
	for (let i = 0; i < DECORATIVE_POOL.length; i++) {
		let o = DECORATIVE_POOL[i];
		if (o.destroyed && o.type === type) {
			o.destroyed = false;
			o.data = data;
			o.init = init_fn;
			o.draw = draw_fn;
			o.destroy = destroy_fn;
			o.init(o);
			if (g.objects.indexOf(o) === -1) {
				g.objects.push(o);
			}
			return g.objects.indexOf(o);
		}
	}
	let idx = game_object_create(g, type, data, init_fn, draw_fn, destroy_fn);
	if (idx !== -1 && DECORATIVE_POOL.length < MAX_POOL_SIZE) {
		DECORATIVE_POOL.push(g.objects[idx]);
	}
	return idx;
}

function roof_apply_transparency(g, bx, by, bw, bh) {
	let p = g.player_object;
	if (!p) {
		for (let i = 0; i < g.objects.length; i++) {
			let o = g.objects[i];
			if (o.name === "player" && !o.data.ai_controlled) {
				g.player_object = o;
				p = o;
				break;
			}
		}
	}
	if (p && p.data && p.data.body) {
		let px = p.data.body.position.x;
		let py = p.data.body.position.y;
		if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) {
			return 0.4;
		}
	}
	let enemies = g.collections["enemy"];
	if (enemies) {
		for (let i = 0; i < enemies.length; i++) {
			let obj = enemies[i];
			if (!obj.destroyed && obj.data.body) {
				let ex = obj.data.body.position.x;
				let ey = obj.data.body.position.y;
				if (ex >= bx && ex <= bx + bw && ey >= by && ey <= by + bh) {
					return 0.7;
				}
			}
		}
	}
	return 1.0;
}

function decorative_rectangle_draw(self, ctx) {
	let d = self.data;
	ctx.globalAlpha = d.alpha || 1.0;
	ctx.fillStyle = d.color_fill;
	ctx.fillRect(d.x, d.y, d.w, d.h);
	if (d.color_outline && d.color_outline !== "transparent") {
		ctx.lineWidth = 2;
		ctx.strokeStyle = d.color_outline;
		ctx.strokeRect(d.x, d.y, d.w, d.h);
	}
	ctx.globalAlpha = 1.0;
}

function decorative_roof_draw(self, ctx) {
	let d = self.data;
	ctx.globalAlpha = roof_apply_transparency(self.game, d.bx, d.by, d.bw, d
		.bh);
	if (d.text) {
		ctx.font = d.font_cache;
		ctx.fillStyle = d.color;
		ctx.textBaseline = "top";
		ctx.fillText(d.text, d.x, d.y);
	}
	else {
		ctx.fillStyle = d.color_fill;
		ctx.fillRect(d.x, d.y, d.w, d.h);
		if (d.color_outline && d.color_outline !== "transparent") {
			ctx.lineWidth = 2;
			ctx.strokeStyle = d.color_outline;
			ctx.strokeRect(d.x, d.y, d.w, d.h);
		}
	}
	ctx.globalAlpha = 1.0;
}

function eye_draw(self, ctx) {
	let d = self.data;
	let g = self.game;
	let p = g.player_object;
	if (!p) {
		for (let i = 0; i < g.objects.length; i++) {
			let o = g.objects[i];
			if (o.name === "player" && !o.data.ai_controlled) {
				g.player_object = o;
				p = o;
				break;
			}
		}
	}
	let centerX = d.x + d.w / 2;
	let centerY = d.y + d.h / 2;
	let pupilX = centerX;
	let pupilY = centerY;
	if (p && p.data && p.data.body) {
		let dx = p.data.body.position.x - centerX;
		let dy = p.data.body.position.y - centerY;
		let dist = Math.sqrt(dx * dx + dy * dy);
		if (dist > 1) {
			let maxMove = d.w * 0.2;
			pupilX += (dx / dist) * maxMove;
			pupilY += (dy / dist) * maxMove;
		}
	}
	ctx.fillStyle = "#ffffff";
	ctx.beginPath();
	ctx.arc(centerX, centerY, d.w / 2, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.fillStyle = d.pupil_color || "#ff0000";
	let irisSize = d.w * 0.25;
	ctx.beginPath();
	ctx.arc(pupilX, pupilY, irisSize, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.arc(pupilX, pupilY, irisSize * 0.5, 0, Math.PI * 2);
	ctx.fill();
}

function decorative_fuel_pump_draw(self, ctx) {
	let d = self.data;
	let c = COLORS_DEFAULT.decorations.objects;
	ctx.globalAlpha = d.transparency || 1.0;
	ctx.fillStyle = d.color_base;
	ctx.fillRect(d.x, d.y + d.h * 0.15, d.w, d.h * 0.85);
	ctx.fillStyle = d.accent_color;
	ctx.fillRect(d.x, d.y, d.w, d.h * 0.25);
	ctx.fillStyle = c.fuel_display;
	ctx.fillRect(d.x + d.w * 0.1, d.y + d.h * 0.3, d.w * 0.8, d.h * 0.2);
	ctx.font = d.font_cache;
	ctx.fillStyle = COLORS_DEFAULT.decorations.city.road_marking;
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	ctx.fillText(d.label, d.x + d.w / 2, d.y + d.h * 0.04);
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(d.x + d.w, d.y + d.h * 0.4);
	ctx.lineTo(d.x + d.w + 3, d.y + d.h * 0.8);
	ctx.stroke();
	ctx.globalAlpha = 1.0;
	ctx.textAlign = "left";
}

function decorative_rectangle_create(g, x, y, w, h, fill, outline =
	"transparent", alpha_ = 1.0) {
	let i = get_from_pool_or_create(g, "decorative", {
			x,
			y,
			w,
			h,
			color_fill: fill,
			color_outline: outline,
			alpha: alpha_
		},
		function() {}, decorative_rectangle_draw,
		function(o) {
			o.destroyed = true;
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function roof_rect_create(g, x, y, w, h, bx, by, bw, bh, fill, outline =
	"transparent") {
	let i = get_from_pool_or_create(g, "decorative_roof", {
			x,
			y,
			w,
			h,
			bx,
			by,
			bw,
			bh,
			color_fill: fill,
			color_outline: outline
		},
		function() {}, decorative_roof_draw,
		function(o) {
			o.destroyed = true;
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function roof_text_create(g, text, x, y, size, bx, by, bw, bh, color) {
	let s = Math.floor(size);
	let i = get_from_pool_or_create(g, "decorative_roof", {
			text,
			x,
			y,
			size: s,
			font_cache: "bold " + s + "px verdana",
			bx,
			by,
			bw,
			bh,
			color
		},
		function() {}, decorative_roof_draw,
		function(o) {
			o.destroyed = true;
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_text_create(g, text, x, y, size, color) {
	let s = Math.floor(size);
	let i = get_from_pool_or_create(g, "decorative", {
			text,
			x,
			y,
			size: s,
			font_cache: "bold " + s + "px verdana",
			color
		},
		function() {},
		function(self, ctx) {
			ctx.font = self.data.font_cache;
			ctx.fillStyle = self.data.color;
			ctx.textBaseline = "top";
			ctx.fillText(self.data.text, self.data.x, self.data.y);
		},
		function(o) {
			o.destroyed = true;
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_level_base_create(g, x, y, color = "gray") {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, 2500, 2500,
			color, COLORS_DEFAULT.decorations.city.road_marking),
		"decorative_level_base");
}

function eye_create(g, x, y, w, h, pupil_color = "#ff0000") {
	let i = get_from_pool_or_create(g, "decorative", {
		x,
		y,
		w,
		h,
		pupil_color
	}, function() {}, eye_draw, function(o) {
		o.destroyed = true;
	});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function eye_create_on_tree(g, x, y, w, h, pupil_color = "#ff0000") {
	let i = get_from_pool_or_create(g, "decorative_leaves", {
		x,
		y,
		w,
		h,
		pupil_color
	}, function() {}, eye_draw, function(o) {
		o.destroyed = true;
	});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_road_create(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.road, c.road);
	let N = 8.0;
	if (w > h) {
		for (let i = 0; i < N; i++)
			decorative_rectangle_create(g, x + (i + 0.25) * w / N, y + h / 2 -
				0.05 * h, 0.5 * w / N, 0.1 * h, c.road_marking, c.road_marking);
	}
	else {
		for (let i = 0; i < N; i++)
			decorative_rectangle_create(g, x + w / 2 - 0.05 * w, y + (i +
					0.25) * h / N, 0.1 * w, 0.5 * h / N, c.road_marking, c
				.road_marking);
	}
}

function decorative_wall_v2(g, x, y, w, h, color) {
	let c = COLORS_DEFAULT.decorations.city;
	bound_create(g, x, y, w, h);
	return game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h,
		color, c.wall_outline), "decorative_wall");
}

function decorative_wall_create(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	return decorative_wall_v2(g, x, y, w, h, c.wall_default);
}

function decorative_building_create(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_wall_create(g, x, y, w, h * 0.05);
	decorative_wall_create(g, x, y + 0.95 * h, w, h * 0.05);
	decorative_wall_create(g, x, y, w * 0.05, h);
	decorative_wall_create(g, x + 0.95 * w, y, w * 0.05, 0.4 * h);
	decorative_wall_create(g, x + 0.95 * w, y + 0.55 * h, w * 0.05, 0.4 * h);
	decorative_rectangle_create(g, x, y, w, h, c.building_fill, c.wall_default);
	roof_rect_create(g, x + 0.01 * w, y + 0.01 * h, w * 0.98, h * 0.98, x, y, w,
		h, c.building_fill, c.wall_default);
}

function decorative_house_v2(g, x, y, w, h, door_side, wall_color, roof_color) {
	let sw = 20;
	let dw = w * 0.2;
	decorative_rectangle_create(g, x, y, w, h, "#443322", "transparent");
	let draw_wall = (sx, sy, sw_, sh_, horizontal) => {
		if (horizontal) {
			decorative_wall_v2(g, sx, sy, (sw_ - dw) / 2, sh_, wall_color);
			decorative_wall_v2(g, sx + (sw_ + dw) / 2, sy, (sw_ - dw) / 2,
				sh_, wall_color);
		}
		else {
			decorative_wall_v2(g, sx, sy, sw_, (sh_ - dw) / 2, wall_color);
			decorative_wall_v2(g, sx, sy + (sh_ + dw) / 2, sw_, (sh_ - dw) /
				2, wall_color);
		}
	};
	if (door_side === "up") draw_wall(x, y, w, sw, true);
	else decorative_wall_v2(g, x, y, w, sw, wall_color);
	if (door_side === "down") draw_wall(x, y + h - sw, w, sw, true);
	else decorative_wall_v2(g, x, y + h - sw, w, sw, wall_color);
	if (door_side === "left") draw_wall(x, y, sw, h, false);
	else decorative_wall_v2(g, x, y, sw, h, wall_color);
	if (door_side === "right") draw_wall(x + w - sw, y, sw, h, false);
	else decorative_wall_v2(g, x + w - sw, y, sw, h, wall_color);
	roof_rect_create(g, x + 2, y + 2, w - 4, h - 4, x, y, w, h, roof_color,
		"#000000");
}

function decorative_hospital_v3(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, "#cccccc", "#999999");
	let sw = 30;
	decorative_wall_v2(g, x, y, w, sw, c.hospital_walls);
	decorative_wall_v2(g, x, y, sw, h, c.hospital_walls);
	decorative_wall_v2(g, x + w - sw, y, sw, h, c.hospital_walls);
	decorative_wall_v2(g, x, y + h - sw, w * 0.4, sw, c.hospital_walls);
	decorative_wall_v2(g, x + w * 0.6, y + h - sw, w * 0.4, sw, c
		.hospital_walls);
	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, c
		.hospital_roof, c.hospital_roof_outline);
	let cx = x + w / 2,
		cy = y + h / 2;
	roof_rect_create(g, cx - 80, cy - 20, 160, 40, x, y, w, h, c
		.hospital_accent, c.hospital_accent);
	roof_rect_create(g, cx - 20, cy - 80, 40, 160, x, y, w, h, c
		.hospital_accent, c.hospital_accent);
	let text = g.settings.language === "русский" ? "ПОЛИКЛИНИКА" :
		"CITY HOSPITAL";
	roof_text_create(g, text, x + (w / 2) - 200, y + h - 100, 50, x, y, w, h, c
		.hospital_accent);
}

function decorative_police_station_v3(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.wall_default, "#111111");
	let sw = 25;
	decorative_wall_v2(g, x, y, w, sw, c.police_accent);
	decorative_wall_v2(g, x, y, sw, h, c.police_accent);
	decorative_wall_v2(g, x + w - sw, y, sw, h, c.police_accent);
	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, c.police_roof,
		c.police_roof_outline);
	let text = g.settings.language === "русский" ? "ПОЛИЦЕЙСКИЙ УЧАСТОК" :
		"POLICE";
	let ofs = g.settings.language === "русский" ? 0.35 : 0.5;
	roof_text_create(g, text, x + (ofs * w) - 110, y + (h / 2) - 30, 60, x, y,
		w, h, c.road_marking);
}

function decorative_fire_station_v3(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.road, "#000000");
	let sw = 30;
	decorative_wall_v2(g, x, y, w, sw, c.fire_accent);
	decorative_wall_v2(g, x, y, sw, h, c.fire_accent);
	decorative_wall_v2(g, x + w - sw, y, sw, h, c.fire_accent);
	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, c.fire_roof, c
		.fire_roof_outline);
	let text = g.settings.language === "русский" ? "ПОЖАРНАЯ ЧАСТЬ" :
		"FIRE DEPT";
	let ofs = g.settings.language === "русский" ? 0.4 : 0.5;
	roof_text_create(g, text, x + (ofs * w) - 140, y + (h / 2) - 25, 50, x, y,
		w, h, c.road_marking);
}

function decorative_fuel_pump_create(g, x, y, w = 45, h = 65, label = "98") {
	let c = COLORS_DEFAULT.decorations.objects;
	let accent = label === "80" ? c.fuel_80 : (label === "92" ? c.fuel_92 : c
		.fuel_98);
	bound_create(g, x, y + h * 0.5, w, h * 0.5);
	let s = Math.floor(h * 0.18);
	let i = get_from_pool_or_create(g, "decorative_fuel_pump", {
			x,
			y,
			w,
			h,
			label,
			font_cache: "bold " + s + "px Arial",
			color_base: c.fuel_base,
			accent_color: accent
		},
		function() {}, decorative_fuel_pump_draw,
		function(o) {
			o.destroyed = true;
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_gas_station_create(g, x, y, w, h, level_visited = true) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.wall_default, "#111111");
	let shop_w = w * 0.25;
	decorative_building_create(g, x + w * 0.015, y + h * 0.1, shop_w, h * 0.8);
	let gas_x = x + shop_w,
		gas_w = w * 0.75,
		canopy_w = gas_w * 0.9,
		canopy_h = h * 0.85;
	let canopy_x = gas_x + (gas_w - canopy_w) / 2,
		canopy_y = y + (h - canopy_h) / 2;
	decorative_rectangle_create(g, canopy_x, canopy_y, canopy_w, canopy_h,
		"#444444", c.wall_outline);
	let rows = 2,
		cols = 3,
		pump_w = 45,
		pump_h = 65,
		island_h = 30,
		island_w = canopy_w * 0.8;
	for (let r = 0; r < rows; r++) {
		let iy = canopy_y + (canopy_h / (rows + 1)) * (r + 1) - (island_h / 2);
		let ix = canopy_x + (canopy_w - island_w) / 2;
		decorative_rectangle_create(g, ix, iy, island_w, island_h, "#888888",
			"#555555");
		for (let cl = 0; cl < cols; cl++) {
			let px = ix + (island_w / (cols + 1)) * (cl + 1) - (pump_w / 2);
			let py = iy - (pump_h * 0.7);
			let fuels = ["92", "98", "80"];
			decorative_fuel_pump_create(g, px, py, pump_w, pump_h, fuels[cl]);
		}
	}
}

function decorative_parkinglot_create(g, x, y, w, h, level_visited = true,
	car_types = ["default"]) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.road, c.road);
	const TARGET_R = 205,
		padding = w * 0.02,
		usableW = w - (padding * 2);
	let count = Math.max(1, Math.floor(usableW / TARGET_R));
	let actualR = usableW / count;
	for (let i = 0; i < count; i++) {
		let spotX = x + padding + (i * actualR);
		decorative_rectangle_create(g, spotX, y + h * 0.1, 4, h * 0.8, c
			.road_marking, c.road_marking);
		if (i === count - 1) decorative_rectangle_create(g, spotX + actualR, y +
			h * 0.1, 4, h * 0.8, c.road_marking, c.road_marking);
		let fontSize = Math.floor(actualR * 0.2);
		decorative_text_create(g, Math.floor(50 + Math.random() * 50), spotX + (
				actualR / 2) - (fontSize / 2), y + h * 0.15, fontSize, c
			.road_marking);
		let car_chance = (car_types.includes("fireman") || car_types.includes(
			"ambulance")) ? 0.0725 : 0.02125;
		if (!level_visited && Math.random() < car_chance) {
			let randomColor = "hsl(" + Math.floor(Math.random() * 360) + ", " +
				Math.floor(Math.random() * 40 + 50) + "%, " + Math.floor(Math
					.random() * 30 + 40) + "%)";
			car_create(g, spotX + (actualR / 2), y + h * 0.4, randomColor,
				false, false, car_types[Math.floor(Math.random() * car_types
					.length)]);
		}
	}
}

function decorative_fountain_create(g, x, y, size = 200) {
	let c = COLORS_DEFAULT.decorations.nature;
	decorative_rectangle_create(g, x, y, size, size, c.fountain_base,
		"#444444");
	decorative_rectangle_create(g, x + size * 0.1, y + size * 0.1, size * 0.8,
		size * 0.8, c.fountain_water, "#111111");
	decorative_rectangle_create(g, x + size * 0.4, y + size * 0.4, size * 0.2,
		size * 0.2, COLORS_DEFAULT.decorations.city.road_marking,
		"transparent");
	bound_create(g, x, y, size, size);
}

function decorative_bench_create(g, x, y, rotation = "horizontal") {
	let w = rotation === "horizontal" ? 120 : 30,
		h = rotation === "horizontal" ? 30 : 120;
	const colors = COLORS_DEFAULT.decorations.city.bench_options;
	let i = decorative_rectangle_create(g, x, y, w, h, colors[Math.floor(Math
		.random() * colors.length)], "#111111");
	bound_create(g, x, y, w, h);
	return i;
}

function decorative_hotdog_stand_create(g, x, y) {
	let w = 180,
		h = 120,
		c = COLORS_DEFAULT.decorations.objects;
	bound_create(g, x, y + 0.75 * h, w, h * 0.25);
	game_object_change_name(g, decorative_rectangle_create(g, x + 20, y + 30,
			w - 40, 40, c.hotdog_window, "transparent", 0.25),
		"decorative_hotdogs");
	let body = game_object_change_name(g, decorative_rectangle_create(g, x, y,
		w, h, c.hotdog_body, "#333333"), "decorative_hotdogs");
	for (let i = 0; i < 6; i++) {
		game_object_change_name(g, decorative_rectangle_create(g, x + (i * w /
					6), y - 20, w / 6, 25, i % 2 === 0 ? c
				.hotdog_stripe_red : c.hotdog_stripe_white, "transparent"),
			"decorative_hotdogs");
	}
	return body;
}

function decorative_tree_create(g, x, y) {
	if (!g.settings.trees) return;
	let c = COLORS_DEFAULT.decorations.nature;
	bound_create(g, x, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x - 65, y, 160,
		75, c.tree_leaves, c.tree_leaves_outline), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 75, 30,
		100, c.tree_trunk, c.tree_trunk_outline), "decorative_trunk");
}

function decorative_no_tree_zone_create(g, x, y, w, h) {
	let i = get_from_pool_or_create(g, "decorative_no_tree_zone", {
		x,
		y,
		w,
		h
	}, function() {}, function(self, ctx) {
		if (self.game.debug) {
			ctx.strokeStyle = "rgba(255,0,0,0.5)";
			ctx.lineWidth = 5;
			ctx.strokeRect(self.data.x, self.data.y, self.data.w, self
				.data.h);
		}
	}, function(o) {
		o.destroyed = true;
	});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_grass_create(g, x, y, w, h, trees = true) {
	let c = COLORS_DEFAULT.decorations.nature;
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, c
		.grass, c.grass), "decorative_grass");
	if (trees) {
		let zones = g.objects.filter(o => o.name ===
			"decorative_no_tree_zone" && !o.destroyed);
		let N = w / 300,
			M = h / 300;
		for (let i = 1; i < N - 1; i++) {
			for (let j = 0.75; j < M - 1; j++) {
				let tx = x + (i + 0.5 * (Math.random() - 0.5)) * w / N;
				let ty = y + (j + 0.5 * (Math.random() - 0.5)) * h / M;
				if (!zones.some(z => tx >= z.data.x && tx <= z.data.x + z.data
						.w && ty >= z.data.y && ty <= z.data.y + z.data.h))
					decorative_tree_create(g, tx, ty);
			}
		}
	}
}

function decorative_sand_create(g, x, y, w, h, cacti = true,
	cacti_chance_delta = 0.5) {
	let c = COLORS_DEFAULT.decorations.nature;
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, c
		.sand, c.sand), "decorative_grass");
	if (cacti) {
		let zones = g.objects.filter(o => o.name ===
			"decorative_no_tree_zone" && !o.destroyed);
		let N = w / 300,
			M = h / 300,
			chance = 1.0;
		for (let i = 1; i < N - 1; i++) {
			for (let j = 0; j < M - 1; j++) {
				let cx = x + (i + 0.5 * (Math.random() - 0.5)) * w / N;
				let cy = y + (j + 0.5 * (Math.random() - 0.5)) * h / M;
				if (Math.random() < chance && !zones.some(z => cx >= z.data.x &&
						cx <= z.data.x + z.data.w && cy >= z.data.y && cy <= z
						.data.y + z.data.h)) {
					decorative_cactus_create(g, cx, cy);
					chance *= cacti_chance_delta;
				}
			}
		}
	}
}

function decorative_cactus_create(g, x, y) {
	if (!g.settings.trees) return;
	let c = COLORS_DEFAULT.decorations.nature,
		type = Math.floor(Math.random() * 3);
	bound_create(g, x - 2, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 50, 25,
		125, c.cactus_body, c.cactus_outline), "decorative_trunk");
	if (type === 0) {
		game_object_change_name(g, decorative_rectangle_create(g, x - 25, y +
				100, 25, 15, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x - 25, y +
				70, 15, 30, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
				80, 25, 15, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 35, y +
				40, 15, 40, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
	}
	else if (type === 1) {
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
				110, 20, 15, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 30, y +
				80, 15, 30, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
	}
	else {
		game_object_change_name(g, decorative_rectangle_create(g, x - 20, y +
				120, 20, 15, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x - 20, y +
				95, 15, 25, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
				120, 20, 15, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 30, y +
				95, 15, 25, c.cactus_branch, c.cactus_outline),
			"decorative_leaves");
	}
	if (Math.random() < 0.1) decorative_rectangle_create(g, x + 5, y + 40, 15,
		10, c.cactus_flower, c.cactus_outline);
}

function decorative_blood_bush_variant(g, x, y) {
	let leaf_c = Math.random() > 0.5 ? "#c62828" : "#6a1b9a";
	decorative_rectangle_create(g, x + 23, y + 15, 6, 20, "#310000",
		"transparent");
	game_object_change_name(g, decorative_rectangle_create(g, x, y, 50, 25,
		leaf_c, "#1a0000"), "decorative");
	if (Math.random() < 0.5) eye_create(g, x + 19, y + 7, 12, 10, leaf_c ===
		"#c62828" ? "#6a1b9a" : "#c62828");
}

function decorative_ribcage_v3(g, x, y) {
	decorative_rectangle_create(g, x, y + 18, 50, 5, "#fcfaf5", "#999999");
	for (let i = 0; i < 4; i++) {
		let rx = x + 5 + (i * 12);
		if (Math.random() > 0.15) decorative_rectangle_create(g, rx, y, 4, 15,
			"#fcfaf5", "#999999");
		if (Math.random() > 0.15) decorative_rectangle_create(g, rx, y + 26, 4,
			15, "#fcfaf5", "#999999");
	}
}

function decorative_skull_v2(g, x, y) {
	decorative_rectangle_create(g, x, y, 20, 16, "#fcfaf5", "#999999");
	decorative_rectangle_create(g, x + 4, y + 16, 12, 5, "#fcfaf5", "#999999");
	decorative_rectangle_create(g, x + 3, y + 4, 5, 5, "#1a1a1a",
		"transparent");
	decorative_rectangle_create(g, x + 12, y + 4, 5, 5, "#1a1a1a",
		"transparent");
}

function decorative_blood_tree_variant(g, x, y) {
	if (!g.settings.trees) return;
	let leaf_c = Math.random() > 0.5 ? "#e53935" : "#4a148c";
	bound_create(g, x, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 75, 30,
		100, "#f5f5f5", "#999999"), "decorative_trunk");
	game_object_change_name(g, decorative_rectangle_create(g, x - 65, y, 160,
		75, leaf_c, "#210000"), "decorative_leaves");
	let pos = [{
		dx: -45,
		dy: 15
	}, {
		dx: 0,
		dy: 45
	}, {
		dx: 45,
		dy: 10
	}, {
		dx: 70,
		dy: 35
	}, {
		dx: 10,
		dy: 10
	}, {
		dx: -20,
		dy: 40
	}];
	let count = Math.random() > 0.2 ? (Math.random() > 0.6 ? 6 : 4) : 0;
	for (let i = 0; i < count; i++) eye_create_on_tree(g, x + pos[i].dx, y +
		pos[i].dy, 16, 14, leaf_c === "#e53935" ? "#4a148c" : "#e53935");
}

function decorative_spruce_create(g, x, y) {
	if (!g.settings.trees) return;
	let needles_c = "#388e5c",
		out = "#1b331a";
	bound_create(g, x, y + 185, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x + 8, y + 50, 14,
		150, "#5d4037", out), "decorative_trunk");
	game_object_change_name(g, decorative_rectangle_create(g, x - 35, y + 110,
		100, 30, needles_c, out), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x - 25, y + 75,
		80, 30, needles_c, out), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x - 15, y + 40,
		60, 30, needles_c, out), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x - 5, y + 10, 40,
		25, needles_c, out), "decorative_leaves");
}

function decorative_fallen_tree_straight(g, x, y) {
	let len = 100 + Math.random() * 60;
	bound_create(g, x, y, len, 25);
	game_object_change_name(g, decorative_rectangle_create(g, x, y, len, 25,
		"#5d4037", "#3e2723"), "decorative_trunk");
}

function decorative_taiga_bush_v3(g, x, y) {
	decorative_rectangle_create(g, x + 23, y + 15, 5, 15, "#4e342e",
		"transparent");
	game_object_change_name(g, decorative_rectangle_create(g, x, y - 5, 50, 25,
		"#2e7d52", "#1b331a"), "decorative");
}

function decorative_blood_grass_create(g, x, y, w, h, trees = true) {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h,
		"#7e2020", "#7e2020"), "decorative_grass");
	if (trees && g.settings.trees) {
		let step = 350;
		for (let i = 0; i < Math.floor(w / step); i++) {
			for (let j = 0; j < Math.floor(h / step); j++) {
				let tx = Math.max(x + 65, Math.min(x + w - 95, x + (i * step) +
					Math.random() * 200));
				let ty = Math.max(y, Math.min(y + h - 175, y + (j * step) + Math
					.random() * 200));
				let r = Math.random();
				if (r < 0.5) decorative_blood_tree_variant(g, tx, ty);
				else if (r < 0.75) decorative_blood_bush_variant(g, tx, ty);
				else if (r < 0.88) decorative_skull_v2(g, tx, ty);
				else decorative_ribcage_v3(g, tx, ty);
			}
		}
	}
}

function decorative_taiga_grass_create(g, x, y, w, h, trees = true) {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h,
		"#2d5a37", "#2d5a37"), "decorative_grass");
	if (trees && g.settings.trees) {
		let step = 350;
		for (let i = 0; i < Math.floor(w / step); i++) {
			for (let j = 0; j < Math.floor(h / step); j++) {
				let tx = Math.max(x + 35, Math.min(x + w - 65, x + (i * step) +
					Math.random() * 200));
				let ty = Math.max(y, Math.min(y + h - 200, y + (j * step) + Math
					.random() * 200));
				let r = Math.random();
				if (r < 0.6) decorative_spruce_create(g, tx, ty);
				else if (r < 0.85) decorative_taiga_bush_v3(g, tx, ty);
				else decorative_fallen_tree_straight(g, Math.min(tx, x + w -
					160), ty);
			}
		}
	}
}
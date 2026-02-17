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

function decorative_rectangle_create(g, x, y, w, h, fill, outline =
	"transparent", alpha_ = 1.0) {
	let i = game_object_create(g, "decorative", {
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
			o.destroyed = true
		});
	if (i !== -1)
		g.objects[i].persistent = false;
	return i;
}

function roof_rect_create(g, x, y, w, h, bx, by, bw, bh, fill, outline =
	"transparent") {
	let i = game_object_create(g, "decorative_roof", {
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
			o.destroyed = true
		});
	if (i !== -1)
		g.objects[i].persistent = false;
	return i;
}

function roof_text_create(g, text, x, y, size, bx, by, bw, bh, color) {
	let s = Math.floor(size);
	let i = game_object_create(g, "decorative_roof", {
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
			o.destroyed = true
		});
	if (i !== -1)
		g.objects[i].persistent = false;
	return i;
}

function decorative_text_create(g, text, x, y, size, color) {
	let s = Math.floor(size);
	let i = game_object_create(g, "decorative", {
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
			o.destroyed = true
		});
	if (i !== -1)
		g.objects[i].persistent = false;
	return i;
}

function decorative_level_base_create(g, x, y, color = "gray") {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, 2500, 2500,
			color, COLORS_DEFAULT.decorations.city.road_marking),
		"decorative_level_base");
}

function decorative_grass_create(g, x, y, w, h, trees = true) {
	let c = COLORS_DEFAULT.decorations.nature;
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h,
			c.grass, c.grass),
		"decorative_grass");
	if (trees) {
		let N = w / 300.0;
		let M = h / 300.0;
		let zones = [];
		for (let k = 0; k < g.objects.length; k++) {
			let o = g.objects[k];
			if (o.name === "decorative_no_tree_zone" && !o.destroyed) {
				zones.push(o);
			}
		}
		for (let i = 1; i < N - 1; i++) {
			for (let j = 0.75; j < M - 1; j++) {
				let treeX = x + (i + 0.5 * (Math.random() - 0.5)) * w / N;
				let treeY = y + (j + 0.5 * (Math.random() - 0.5)) * h / M;
				let skip = false;
				for (let z = 0; z < zones.length; z++) {
					let zd = zones[z].data;
					if (treeX >= zd.x && treeX <= zd.x + zd.w &&
						treeY >= zd.y && treeY <= zd.y + zd.h) {
						skip = true;
						break;
					}
				}
				if (!skip) {
					decorative_tree_create(g, treeX, treeY);
				}
			}
		}
	}
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

function decorative_road_create(g, x, y, w, h) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.road, c.road);
	let N = 8.0;
	for (let i = 0; i < N && w > h; i++)
		decorative_rectangle_create(g, x + (i + 0.25) * w / N, y + h / 2 -
			0.05 * h, 0.5 * w / N, 0.1 * h, c.road_marking, c.road_marking);
	for (let i = 0; i < N && h > w; i++)
		decorative_rectangle_create(g, x + w / 2 - 0.05 * w, y + (i + 0.25) *
			h / N, 0.1 * w, 0.5 * h / N, c.road_marking, c.road_marking);
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
	let draw_wall_with_door = (sx, sy, sw_, sh_, horizontal) => {
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
	if (door_side === "up") draw_wall_with_door(x, y, w, sw, true);
	else decorative_wall_v2(g, x, y, w, sw, wall_color);
	if (door_side === "down") draw_wall_with_door(x, y + h - sw, w, sw, true);
	else decorative_wall_v2(g, x, y + h - sw, w, sw, wall_color);
	if (door_side === "left") draw_wall_with_door(x, y, sw, h, false);
	else decorative_wall_v2(g, x, y, sw, h, wall_color);
	if (door_side === "right") draw_wall_with_door(x + w - sw, y, sw, h, false);
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
		.hospital_roof,
		c.hospital_roof_outline);
	let cx = x + w / 2;
	let cy = y + h / 2;
	roof_rect_create(g, cx - 80, cy - 20, 160, 40, x, y, w, h, c
		.hospital_accent,
		c.hospital_accent);
	roof_rect_create(g, cx - 20, cy - 80, 40, 160, x, y, w, h, c
		.hospital_accent,
		c.hospital_accent);
	let text = "CITY HOSPITAL";
	if (g.settings.language === "русский")
		text = "ПОЛИКЛИНИКА";
	roof_text_create(g, text, x + (w / 2) - 200, y + h - 100, 50, x,
		y, w, h, c.hospital_accent);
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
	let text = "POLICE";
	let ofs = 0.5
	if (g.settings.language === "русский") {
		text = "ПОЛИЦЕЙСКИЙ УЧАСТОК";
		ofs = 0.35;
	}
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
	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, c.fire_roof,
		c.fire_roof_outline);
	let text = "FIRE DEPT";
	let ofs = 0.5;
	if (g.settings.language === "русский") {
		text = "ПОЖАРНАЯ ЧАСТЬ";
		ofs = 0.4;
	}
	roof_text_create(g, text, x + (ofs * w) - 140, y + (h / 2) - 25, 50, x,
		y, w, h, c.road_marking);
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
	ctx.save();
	ctx.textAlign = "center";
	ctx.fillText(d.label, d.x + d.w / 2, d.y + d.h * 0.04);
	ctx.restore();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(d.x + d.w, d.y + d.h * 0.4);
	ctx.lineTo(d.x + d.w + 3, d.y + d.h * 0.8);
	ctx.stroke();
	ctx.globalAlpha = 1.0;
}

function decorative_fuel_pump_create(g, x, y, w = 45, h = 65, label = "98") {
	let c = COLORS_DEFAULT.decorations.objects;
	let accent = c.fuel_98;
	if (label === "80") accent = c.fuel_80;
	if (label === "92") accent = c.fuel_92;
	bound_create(g, x, y + h * 0.5, w, h * 0.5);
	let s = Math.floor(h * 0.18);
	let i = game_object_create(g, "decorative_fuel_pump", {
		x,
		y,
		w,
		h,
		label,
		font_cache: "bold " + s + "px Arial",
		color_base: c.fuel_base,
		accent_color: accent
	}, function() {}, decorative_fuel_pump_draw, function(o) {
		o.destroyed = true;
	});
	if (i !== -1)
		g.objects[i].persistent = false;
	return i;
}

function decorative_gas_station_create(g, x, y, w, h, level_visited = true) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.wall_default, "#111111");
	let shop_w = w * 0.25;
	decorative_building_create(g, x + w * 0.015, y + h * 0.1, shop_w, h * 0.8);
	let gas_x = x + shop_w;
	let gas_w = w * 0.75;
	let canopy_w = gas_w * 0.9;
	let canopy_h = h * 0.85;
	let canopy_x = gas_x + (gas_w - canopy_w) / 2;
	let canopy_y = y + (h - canopy_h) / 2;
	decorative_rectangle_create(g, canopy_x, canopy_y, canopy_w, canopy_h,
		"#444444", c.wall_outline);
	let rows = 2;
	let cols = 3;
	let pump_w = 45;
	let pump_h = 65;
	let island_h = 30;
	let island_w = canopy_w * 0.8;
	for (let r = 0; r < rows; r++) {
		let iy = canopy_y + (canopy_h / (rows + 1)) * (r + 1) - (island_h / 2);
		let ix = canopy_x + (canopy_w - island_w) / 2;
		decorative_rectangle_create(g, ix, iy, island_w, island_h, "#888888",
			"#555555");
		for (let c = 0; c < cols; c++) {
			let px = ix + (island_w / (cols + 1)) * (c + 1) - (pump_w / 2);
			let py = iy - (pump_h * 0.7);
			let fuels = ["92", "98", "80"];
			decorative_fuel_pump_create(g, px, py, pump_w, pump_h, fuels[c]);
		}
	}
}

function decorative_parkinglot_create(g, x, y, w, h, level_visited = true,
	car_types = ["default"]) {
	let c = COLORS_DEFAULT.decorations.city;
	decorative_rectangle_create(g, x, y, w, h, c.road, c.road);
	const TARGET_R = 205;
	const padding = w * 0.02;
	const usableW = w - (padding * 2);
	let count = Math.floor(usableW / TARGET_R);
	if (count < 1) count = 1;
	let actualR = usableW / count;
	for (let i = 0; i < count; i++) {
		let spotX = x + padding + (i * actualR);
		let spotY = y;
		decorative_rectangle_create(g, spotX, spotY + h * 0.1, 4, h * 0.8,
			c.road_marking, c.road_marking);
		if (i === count - 1) {
			decorative_rectangle_create(g, spotX + actualR, spotY + h * 0.1, 4,
				h * 0.8, c.road_marking, c.road_marking);
		}
		let fontSize = Math.floor(actualR * 0.2);
		let textVal = Math.floor(50 + Math.random() * 50);
		decorative_text_create(g, textVal, spotX + (actualR / 2) - (fontSize /
			2), spotY + h * 0.15, fontSize, c.road_marking);
		let car_chance = 0.02125;
		if (car_types.includes("fireman"))
			car_chance = 0.0725;
		if (car_types.includes("ambulance"))
			car_chance = 0.0725;
		if (!level_visited && Math.random() < car_chance) {
			let carX = spotX + (actualR / 2);
			let carY = spotY + h * 0.4;
			let color_h = Math.floor(Math.random() * 360);
			let color_s = Math.floor(Math.random() * 40 + 50);
			let color_l = Math.floor(Math.random() * 30 + 40);
			let randomColor = "hsl(" + color_h + ", " + color_s + "%, " +
				color_l + "%)";
			let type = car_types[Math.floor(Math.random() * car_types.length)];
			car_create(g, carX, carY, randomColor, false, false, type);
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
	let w = rotation === "horizontal" ? 120 : 30;
	let h = rotation === "horizontal" ? 30 : 120;
	const colors = COLORS_DEFAULT.decorations.city.bench_options;
	const randomColor = colors[Math.floor(Math.random() * colors.length)];
	let i = decorative_rectangle_create(g, x, y, w, h, randomColor, "#111111");
	game_object_change_name(g, i, "decorative");
	bound_create(g, x, y, w, h);
	return i;
}

function decorative_hotdog_stand_create(g, x, y) {
	let w = 180;
	let h = 120;
	let c = COLORS_DEFAULT.decorations.objects;
	bound_create(g, x, y + 0.75 * h, w, h * 0.25);
	let window = decorative_rectangle_create(g, x + 20, y + 30, w - 40, 40,
		c.hotdog_window, "transparent", 0.25);
	game_object_change_name(g, window, "decorative_hotdogs");
	let body = decorative_rectangle_create(g, x, y, w, h, c.hotdog_body,
		"#333333");
	game_object_change_name(g, body, "decorative_hotdogs");
	for (let i = 0; i < 6; i++) {
		let color = i % 2 === 0 ? c.hotdog_stripe_red : c.hotdog_stripe_white;
		let stripe = decorative_rectangle_create(g, x + (i * w / 6), y - 20, w /
			6, 25, color, "transparent");
		game_object_change_name(g, stripe, "decorative_hotdogs");
	}
	return body;
}

function decorative_no_tree_zone_create(g, x, y, w, h) {
	let i = game_object_create(g, "decorative_no_tree_zone", {
			x: x,
			y: y,
			w: w,
			h: h
		},
		function() {},
		function(self, ctx) {
			if (self.game.debug) {
				ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
				ctx.lineWidth = 5;
				ctx.strokeRect(self.data.x, self.data.y, self.data.w, self
					.data.h);
			}
		},
		function(o) {
			o.destroyed = true;
		}
	);
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_sand_create(g, x, y, w, h, cacti = true,
	cacti_chance_delta = 0.5) {
	let c = COLORS_DEFAULT.decorations.nature;
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h,
			c.sand, c.sand),
		"decorative_grass");
	if (cacti) {
		let N = w / 300.0;
		let M = h / 300.0;
		let zones = [];
		for (let k = 0; k < g.objects.length; k++) {
			let o = g.objects[k];
			if (o.name === "decorative_no_tree_zone" && !o.destroyed) {
				zones.push(o);
			}
		}
		let chance = 1.0;
		let gridPositions = [];
		for (let i = 1; i < N - 1; i++) {
			for (let j = 0; j < M - 1; j++) {
				gridPositions.push({
					i,
					j
				});
			}
		}
		for (let k = gridPositions.length - 1; k > 0; k--) {
			const r = Math.floor(Math.random() * (k + 1));
			let temp = gridPositions[k];
			gridPositions[k] = gridPositions[r];
			gridPositions[r] = temp;
		}
		for (let p = 0; p < gridPositions.length; p++) {
			let pos = gridPositions[p];
			let i = pos.i;
			let j = pos.j;
			let cactusX = x + (i + 0.5 * (Math.random() - 0.5)) * w / N;
			let cactusY = y + (j + 0.5 * (Math.random() - 0.5)) * h / M;
			let skip = false;
			for (let z = 0; z < zones.length; z++) {
				let zd = zones[z].data;
				if (cactusX >= zd.x && cactusX <= zd.x + zd.w &&
					cactusY >= zd.y && cactusY <= zd.y + zd.h) {
					skip = true;
					break;
				}
			}
			if (!skip && Math.random() < chance) {
				decorative_cactus_create(g, cactusX, cactusY);
				chance *= cacti_chance_delta;
			}
		}
	}
}

function decorative_cactus_create(g, x, y) {
	if (!g.settings.trees) return;
	let c = COLORS_DEFAULT.decorations.nature;
	let type = Math.floor(Math.random() * 3);
	let bodyColor = c.cactus_body;
	let outlineColor = c.cactus_outline;
	let branchColor = c.cactus_branch;
	let flowerColor = c.cactus_flower;
	bound_create(g, x - 2, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 50, 25,
		125,
		bodyColor, outlineColor), "decorative_trunk");
	if (type === 0) {
		game_object_change_name(g, decorative_rectangle_create(g, x - 25, y +
				100, 25, 15, branchColor, outlineColor),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x - 25, y +
			70, 15, 30, branchColor, outlineColor), "decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
			80, 25, 15, branchColor, outlineColor), "decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 35, y +
			40, 15, 40, branchColor, outlineColor), "decorative_leaves");
	}
	else if (type === 1) {
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
				110, 20, 15, branchColor, outlineColor),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 30, y +
			80, 15, 30, branchColor, outlineColor), "decorative_leaves");
	}
	else {
		game_object_change_name(g, decorative_rectangle_create(g, x - 20, y +
				120, 20, 15, branchColor, outlineColor),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x - 20, y +
			95, 15, 25, branchColor, outlineColor), "decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 25, y +
				120, 20, 15, branchColor, outlineColor),
			"decorative_leaves");
		game_object_change_name(g, decorative_rectangle_create(g, x + 30, y +
			95, 15, 25, branchColor, outlineColor), "decorative_leaves");
	}
	if (Math.random() < 0.1) {
		game_object_change_name(g, decorative_rectangle_create(g, x + 5, y + 40,
			15, 10, flowerColor, outlineColor), "decorative_leaves");
	}
}
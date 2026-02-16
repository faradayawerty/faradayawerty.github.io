let DEBUG_ACHIEVEMENTS = false;

function achievements_create(g) {
	const achievementsList = Object.keys(ACHIEVEMENT_REGISTRY).map(key => {
		const entry = ACHIEVEMENT_REGISTRY[key];
		let description = entry.desc;
		let descriptionRus = entry.desc;
		if (typeof entry.desc === 'object' && entry.desc.pc) {
			description = {
				mobile: entry.desc.mobile.en,
				pc: entry.desc.pc.en
			};
			descriptionRus = {
				mobile: entry.desc.mobile.ru,
				pc: entry.desc.pc.ru
			};
		}
		else {
			description = entry.desc.en;
			descriptionRus = entry.desc.ru;
		}
		return {
			name: key,
			name_rus: entry.name.ru,
			desc: description,
			desc_rus: descriptionRus,
			req: entry.req,
			done: false
		};
	});
	let ach = {
		width: 1000,
		height: 1000,
		offset_x: 40,
		offset_y: 40,
		x: 50,
		y: 50,
		xx: 0,
		yy: 0,
		mxx: 0,
		myy: 0,
		clicked: false,
		icon_size: 60,
		animstate: 0,
		cross_width: 40,
		_cross_held: false,
		_cross_pc_held: false,
		achievements: achievementsList
	};
	return game_gui_element_create(g, "achievements", ach, achievements_update,
		achievements_draw, achievements_destroy);
}

function achievements_destroy(ae) {
	if (!ae || ae.destroyed)
		return;
	ae.destroyed = true;
}

function achievements_update(ae, dt) {
	ae.data.animstate += 0.0075 * dt;
	let input = ae.game.input;
	let scale = get_scale();
	if (ae.data._cross_held === undefined) ae.data._cross_held = false;
	if (ae.data._cross_pc_held === undefined) ae.data._cross_pc_held = false;
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let freeTouch = null;
	if (ae.game.mobile) {
		freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
		}
	}
	let crossX = ae.data.offset_x + ae.data.width - ae.data.cross_width;
	let crossY = ae.data.offset_y;
	let is_over_cross = doRectsCollide(mx, my, 0, 0, crossX, crossY, ae.data
		.cross_width, ae.data.cross_width);
	if (ae.game.mobile) {
		if (is_over_cross && freeTouch) {
			ae.data._cross_held = true;
		}
		else if (freeTouch && !is_over_cross) {
			ae.data._cross_held = false;
		}
		else if (!freeTouch && ae.data._cross_held) {
			ae.data._cross_held = false;
			ae.shown = false;
			return;
		}
	}
	else {
		if (input.mouse.leftButtonPressed && is_over_cross) {
			ae.data._cross_pc_held = true;
		}
		if (!input.mouse.leftButtonPressed && ae.data._cross_pc_held) {
			ae.data._cross_pc_held = false;
			if (is_over_cross) {
				ae.shown = false;
				return;
			}
		}
	}
	ae.data.was_left_down = input.mouse.leftButtonPressed;
}

function achievements_draw(ae, ctx) {
	let drawTime = performance.now();
	let as = ae.data.achievements;
	let scale = get_scale();
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = COLORS_DEFAULT.ui.achievements.bg;
	ctx.fillRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data
		.height);
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
	ctx.lineWidth = 2;
	ctx.strokeRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data
		.height);
	ctx.globalAlpha = 1.0;
	let cross_width = ae.data.cross_width;
	let cx = ae.data.offset_x + ae.data.width - cross_width;
	let cy = ae.data.offset_y;
	let mx = ae.game.input.mouse.x / scale;
	let my = ae.game.input.mouse.y / scale;
	let is_over = doRectsCollide(mx, my, 0, 0, cx, cy, cross_width,
		cross_width);
	ctx.fillStyle = is_over ? COLORS_DEFAULT.ui.achievements.cross_hover :
		COLORS_DEFAULT.ui.achievements.cross_bg;
	ctx.fillRect(cx, cy, cross_width, cross_width);
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
	ctx.strokeRect(cx, cy, cross_width, cross_width);
	let p = 0.2 * cross_width;
	ctx.beginPath();
	ctx.strokeStyle = is_over ? COLORS_DEFAULT.ui.achievements
		.cross_icon_hover : COLORS_DEFAULT.ui.achievements.border;
	ctx.lineWidth = 3;
	ctx.moveTo(cx + p, cy + p);
	ctx.lineTo(cx + cross_width - p, cy + cross_width - p);
	ctx.moveTo(cx + p, cy + cross_width - p);
	ctx.lineTo(cx + cross_width - p, cy + p);
	ctx.stroke();
	let startX = ae.data.offset_x + 0.5 * ae.data.x;
	let startY = ae.data.offset_y + 0.5 * ae.data.y;
	let w = ae.data.icon_size;
	let h = ae.data.icon_size;
	let spacing = 2.0;
	let hoveredAchKey = null;
	if (DEBUG_ACHIEVEMENTS)
		ae.game.debug_console.unshift(
			'1st step in achievements draw completed in ' + (performance.now() -
				drawTime));
	drawTime = performance.now();
	for (let key in ACHIEVEMENT_REGISTRY) {
		let config = ACHIEVEMENT_REGISTRY[key];
		let ix = startX + config.grid.x * (w * spacing);
		let iy = startY + config.grid.y * (h * spacing);
		achievement_icon_draw(ctx, as, key, ix, iy, w, h,
			false, ae.data.offset_x, ae.data.offset_y,
			ae.data.offset_x + ae.data.width,
			ae.data.offset_y + ae.data.height,
			ae.data.animstate);
		if (mx > ix && mx < ix + w && my > iy && my < iy + h) {
			hoveredAchKey = key;
		}
	}
	if (DEBUG_ACHIEVEMENTS)
		ae.game.debug_console.unshift(
			'2st step in achievements draw completed in ' + (performance.now() -
				drawTime));
	if (hoveredAchKey) {
		achievement_draw_popup(ctx, ae, hoveredAchKey, mx, my, w, h);
	}
}

function achievement_get(as, name) {
	for (let i = 0; i < as.length; i++)
		if (as[i].name == name)
			return as[i];
	return null;
}

function achievement_do(as, name, ash = null, silent = false) {
	if (DEBUG_ACHIEVEMENTS && false)
		game1.debug_console.unshift("doing achievement " + name);
	let achData = achievement_get(as, name);
	if (!achData) {
		return;
	}
	if (achData.done) return;
	const config = ACHIEVEMENT_REGISTRY[name];
	if (!config) {
		achData.done = true;
		return;
	}
	if (config.req) {
		achievement_do(as, config.req, ash, silent);
		let reqAch = achievement_get(as, config.req);
		if (!reqAch || !reqAch.done) {
			return;
		}
	}
	achData.done = true;
	if (ash && !silent) {
		ash.data.achievements.unshift(name);
		try {
			audio_play("data/sfx/achievement_get_1.mp3", 0.1875);
		}
		catch (e) {
			console.error("Audio play failed:", e);
		}
	}
}

function achievements_shower_create(g, ae = null) {
	let ash = {
		x: 50,
		y: 135,
		w: 800,
		h: 50,
		achievements: [],
		attached_to: ae,
		time_since_last_deleted_achievement: 0,
		animstate: 0
	};
	return game_gui_element_create(g, "achievements shower", ash,
		achievements_shower_update, achievements_shower_draw,
		achievements_shower_destroy);
}

function achievements_shower_update(ashe, dt) {
	ashe.data.animstate += 0.005 * dt;
	ashe.data.time_since_last_deleted_achievement += dt * (achievement_get(ashe
			.data.attached_to.data.achievements, "achievements").done ? 1 :
		0);
	if (ashe.data.achievements.length < 1)
		ashe.data.time_since_last_deleted_achievement = 0;
	if (ashe.data.time_since_last_deleted_achievement > 10000 / ashe.data
		.achievements.length || ashe.data.achievements.length > (ashe.game
			.mobile ? 3 : 14)) {
		ashe.data.achievements.pop();
		ashe.data.time_since_last_deleted_achievement = 0;
	}
}

function achievements_shower_draw(ashe, ctx) {
	for (let i = 0; i < ashe.data.achievements.length; i++) {
		let ach = ashe.data.achievements[i];
		let isMob = ashe.game.mobile;
		let rowH = ashe.data.h;
		if (isMob) rowH *= 3.2;
		let x = ashe.data.x;
		let y = ashe.data.y + (isMob ? (rowH * 1.05 * i) : (ashe.data.h * 1.25 *
			i)) + (isMob ? 40 : 0);
		let w = ashe.data.w;
		let h = isMob ? rowH : ashe.data.h;
		let baseSize = Math.min(ashe.data.w, ashe.data.h);
		ctx.globalAlpha *= 0.5;
		ctx.fillStyle = COLORS_DEFAULT.ui.achievements.bg;
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.popup_border;
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 2;
		let helpText = isMob ? "tap the gold cup" : "press R or J";
		let helpTextRus = isMob ? "нажмите на кубок" : "нажмите R или J";
		let achData = achievement_get(ashe.data.attached_to.data.achievements,
			ach);
		if (isMob) {
			let fontSize = 36;
			let line1 = (ashe.game.settings.language == "русский") ?
				"Выполнено задание" : "Task finished";
			let line2 = (ashe.game.settings.language == "русский") ? achData
				.name_rus + "!" : ach + "!";
			let line3 = (ashe.game.settings.language == "русский") ?
				helpTextRus : helpText + " to view";
			let textX = x + 3.5 * baseSize;
			drawText(ctx, textX, y + h * 0.25, line1, fontSize, COLORS_DEFAULT
				.ui.achievements.text_main);
			drawText(ctx, textX, y + h * 0.55, line2, fontSize, COLORS_DEFAULT
				.ui.achievements.text_accent);
			drawText(ctx, textX, y + h * 0.85, line3, fontSize,
				COLORS_DEFAULT.ui.achievements.text_dim);
		}
		else {
			let text = "task finished: " + ach + "! " + helpText + " to view";
			if (ashe.game.settings.language == "русский") {
				text = "выполнено задание: " + achData.name_rus + "! " +
					helpTextRus;
			}
			drawText(ctx, x + 1.25 * baseSize, y + 0.6 * baseSize, text, 20,
				COLORS_DEFAULT.ui.achievements.text_main);
		}
		let iconSize = isMob ? h * 0.85 : baseSize * 0.75;
		let iconX = x + (isMob ? (h - iconSize) / 2 : 0.125 * baseSize);
		let iconY = y + (h - iconSize) / 2;
		achievement_icon_draw(ctx, ashe.data.attached_to.data.achievements, ach,
			iconX, iconY, iconSize, iconSize,
			false, 0, 0, 5000, 5000, ashe.data.animstate, false);
		ctx.globalAlpha = 1;
	}
}

function achievements_shower_destroy(ashe) {
	if (!ashe || ashe.destroyed)
		return;
	ashe.destroyed = true;
	achievements_destroy(ashe.data.attached_to);
}

function achievement_draw_popup(ctx, ae, ach, x, y, w, h, bbw = 1000, bbh =
	1100) {
	let as = ae.data.achievements;
	let W = bbw * 0.85;
	let H = bbh * 0.5;
	let scale = get_scale();
	let screenW = window.innerWidth / scale;
	let screenH = window.innerHeight / scale;
	if (ae.game.mobile) {
		x += 80;
		y += 80;
	}
	if (x + W > screenW) x = x - W;
	if (y + H > screenH) y = y - H;
	if (x < 5) x = 5;
	if (y < 5) y = 5;
	if (x + W > screenW) W = screenW - x - 10;
	if (y + H > screenH) H = screenH - y - 10;
	const config = ACHIEVEMENT_REGISTRY[ach];
	let isHidden = false;
	if (config.req) {
		const reqAch = achievement_get(as, config.req);
		if (!reqAch || !reqAch.done) isHidden = true;
	}
	let lines = [];
	let achData = achievement_get(as, ach);
	let name = "";
	let desc = "";
	if (isHidden) {
		name = (ae.game.settings.language == "русский") ? "Скрытая задача" :
			"Hidden task";
		desc = (ae.game.settings.language == "русский") ?
			"Новые задачи открываются по мере выполнения других задач. Используйте задачи как гайд в мир игры. Ваша цель - выполнить все задания." :
			"New tasks are unlocked as you earn others. Use tasks as a guide to the game world. Your goal is to do them all.";
	}
	else {
		name = (ae.game.settings.language == "русский") ? achData.name_rus :
			achData.name;
		let descRaw = (ae.game.settings.language == "русский") ? achData
			.desc_rus : achData.desc;
		desc = (typeof descRaw === 'object' && descRaw !== null) ? (ae.game
			.mobile ? descRaw.mobile : descRaw.pc) : descRaw;
	}
	lines.push(name[0].toUpperCase() + name.slice(1) + (isHidden ? "" : "!"));
	lines.push("");
	let fontsize = Math.floor(W / 24);
	let charlim = Math.floor(1.25 * W / fontsize);
	let words = desc.split(' ');
	let line = "";
	for (let i = 0; i < words.length; i++) {
		if ((line + words[i]).length > charlim && line.length > 0) {
			lines.push(line);
			line = "";
		}
		line += words[i] + " ";
		if (i === 0)
			line = line[0].toUpperCase() + line.slice(1);
	}
	lines.push(line);
	ctx.save();
	ctx.globalAlpha = 0.85;
	ctx.fillStyle = COLORS_DEFAULT.ui.achievements.popup_bg;
	ctx.fillRect(x, y, W, H);
	ctx.globalAlpha = 1.0;
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.popup_border;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, W, H);
	achievement_icon_draw(ctx, as, ach, x + 0.5 * w, y + 0.5 * h, 2 * w, 2 * h,
		false, 0, 0, screenW, screenH, ae.data.animstate);
	for (let i = 0; i < lines.length; i++) {
		if (i === 0) {
			drawText(ctx, x + 3 * h, y + h + i * fontsize * 1.25, lines[i],
				fontsize, COLORS_DEFAULT.ui.achievements.text_accent, true);
		}
		else {
			drawText(ctx, x + 3 * h, y + h + i * fontsize * 1.25, lines[i],
				fontsize, COLORS_DEFAULT.ui.achievements.text_main, false);
		}
	}
	ctx.restore();
}

function get_achievement_palette(done, animstate) {
	const pal = COLORS_DEFAULT.ui.achievements.palette;
	let p = {
		c0: COLORS_DEFAULT.player.red,
		c1: COLORS_DEFAULT.player.yellow,
		c2: COLORS_DEFAULT.player.lime,
		c3: COLORS_DEFAULT.player.blue,
		c4: pal.cyan,
		c5: pal.purple,
		c6: pal.orange,
		c7: COLORS_DEFAULT.enemies.regular.body,
		c8: COLORS_DEFAULT.decorations.city.road_marking,
		c9: COLORS_DEFAULT.ui.achievements.bg,
		c10: COLORS_DEFAULT.ui.achievements.popup_border,
		c11: COLORS_DEFAULT.decorations.city.fire_roof,
		c12: pal.blue_light,
		c13: pal.blue_bright,
		c14: pal.green_dark,
		c16: pal.red_bright,
		c15: COLORS_DEFAULT.ui.achievements.bg,
		c20: pal.gold,
		c21: pal.tan,
		c22: pal.brown_dark,
		c23: pal.brown_mid,
		c24: pal.brown_light,
		c25: pal.red_orange,
		c26: COLORS_DEFAULT.decorations.nature.tree_trunk_outline,
		c27: COLORS_DEFAULT.decorations.nature.grass,
	};
	if (!done) {
		p.c0 = COLORS_DEFAULT.ui.achievements.bg;
		p.c1 = COLORS_DEFAULT.ui.achievements.border;
		p.c2 = COLORS_DEFAULT.ui.achievements.border;
		p.c3 = COLORS_DEFAULT.ui.achievements.bg;
		p.c4 = pal.gray_mid;
		p.c5 = pal.gray_mid;
		p.c6 = pal.gray_mid;
		p.c7 = COLORS_DEFAULT.ui.achievements.bg;
		p.c8 = COLORS_DEFAULT.ui.achievements.border;
		p.c9 = COLORS_DEFAULT.ui.achievements.bg;
		p.c10 = COLORS_DEFAULT.ui.achievements.border;
		p.c11 = pal.gray_very_dark;
		p.c12 = pal.gray_text;
		p.c13 = pal.gray_text;
		p.c14 = pal.gray_dark;
		p.c16 = pal.gray_very_dark;
		p.c20 = pal.gray_very_dark;
		p.c21 = pal.gray_silver;
		p.c22 = pal.gray_mid;
		p.c23 = pal.gray_mid;
		p.c24 = pal.gray_light;
		p.c25 = pal.gray_dark;
		p.c26 = pal.gray_mid;
		p.c27 = pal.black_soft;
	}
	if (animstate !== null) {
		let r = Math.cos(0.1 * animstate) * 15;
		let g = 0.7 * (Math.cos(0.1 * animstate) + Math.sin(0.1 * animstate)) *
			15;
		let b = Math.sin(0.1 * animstate) * 15;
		let avg = Math.floor(0.11 * (r + g + b) * (r + g + b));
		r = Math.floor(r * r);
		g = Math.floor(g * g);
		b = Math.floor(b * b);
		if (done) p.c15 = "#" + r.toString(16).padStart(2, '0') + g.toString(16)
			.padStart(2, '0') + b.toString(16).padStart(2, '0');
		else p.c15 = "#" + avg.toString(16).padStart(2, '0').repeat(3);
	}
	return p;
}

function achievement_icon_draw_question_mark(ctx, x, y, w, h) {
	ctx.save();
	let cx = x + w / 2;
	let cy = y + h / 2;
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.question_mark;
	ctx.lineWidth = w * 0.12;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	ctx.arc(cx, cy - h * 0.15, w * 0.22, 0.9 * Math.PI, -0.2 * Math.PI, false);
	ctx.bezierCurveTo(cx + w * 0.2, cy - h * 0.1, cx - w * 0.1, cy, cx, cy + h *
		0.15);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy + h * 0.35, w * 0.05, 0, Math.PI * 2);
	ctx.fillStyle = COLORS_DEFAULT.ui.achievements.question_mark;
	ctx.fill();
	ctx.restore();
}

function achievement_icon_draw(ctx, as, name, x, y, w, h, done = false, bbx =
	50, bby = 50, bbw = 1000, bbh = 1000, animstate = null, back = true) {
	let drawTime = performance.now();
	if (x < bbx || x > bbw - 0.2 * w || y < bby || y > bbh - 0.2 * h || !name)
		return;
	const config = ACHIEVEMENT_REGISTRY[name];
	if (!config) return;
	const ach = achievement_get(as, name);
	if (config.req) {
		const reqAch = achievement_get(as, config.req);
		if (reqAch && !reqAch.done) {
			achievement_icon_draw_question_mark(ctx, x, y, w, h);
			return;
		}
	}
	if (!done && ach) {
		done = ach.done;
	}
	const p = get_achievement_palette(done, animstate);
	ctx.lineWidth = 0.025 * w;
	if (back) {
		ctx.globalAlpha *= 0.25;
		ctx.fillStyle = done ? COLORS_DEFAULT.enemies.regular.body :
			COLORS_DEFAULT.player.red;
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 4;
	}
	config.draw(ctx, x, y, w, h, p);
	if (DEBUG_ACHIEVEMENTS)
		game1.debug_console.unshift('drawn icon ' + name + ' in ' + (performance
			.now() - drawTime));
}
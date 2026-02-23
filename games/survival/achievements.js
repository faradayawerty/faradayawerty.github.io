let DEBUG_ACHIEVEMENTS = false;

function achievements_create(g) {
	const getDepth = (key) => {
		let depth = 0;
		let current = ACHIEVEMENT_REGISTRY[key];
		while (current && current.req) {
			depth++;
			current = ACHIEVEMENT_REGISTRY[current.req];
		}
		return depth;
	};
	const sortedKeys = Object.keys(ACHIEVEMENT_REGISTRY).sort((a, b) => {
		if (!ACHIEVEMENT_REGISTRY[a]) return 1;
		if (!ACHIEVEMENT_REGISTRY[b]) return -1;
		const depthA = getDepth(a);
		const depthB = getDepth(b);
		if (depthA !== depthB) return depthA - depthB;
		return a.localeCompare(b);
	});
	const achievementsList = sortedKeys.map(key => {
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
		offset_y: 120,
		x: 50,
		y: 50,
		xx: 0,
		yy: 0,
		mxx: 0,
		myy: 0,
		clicked: false,
		icon_size: 60,
		animstate: 0,
		cross_size: 40,
		view_mode: "list",
		_cross_held: false,
		_cross_pc_held: false,
		achievements: achievementsList,
		sorted_keys: sortedKeys,
		zoom: 1.4,
		page: 0,
		visual_page: 0,
		items_per_page: 24,
		close_button: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		zoom_in_btn: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		zoom_out_btn: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		view_mode_btn: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		prev_btn: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		next_btn: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		}
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
	let data = ae.data;
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = false;
	let freeTouch = null;
	if (ae.game.mobile) {
		freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
			if (data.active_touch_id !== freeTouch.id) {
				data.active_touch_id = freeTouch.id;
				is_clicked = true;
			}
		}
		else {
			data.active_touch_id = null;
		}
	}
	else {
		if (input.mouse.leftButtonPressed && !data.was_left_down) is_clicked =
			true;
		data.was_left_down = input.mouse.leftButtonPressed;
	}
	let lerpSpeed = 1 - Math.pow(0.001, dt / 400);
	data.visual_page += (data.page - data.visual_page) * lerpSpeed;
	if (Math.abs(data.page - data.visual_page) < 0.001) data.visual_page = data
		.page;
	let btn = data.close_button;
	btn.size = data.cross_size;
	btn.x = data.offset_x + data.width + 15;
	btn.y = data.offset_y;
	btn.is_hovered = doRectsCollide(mx, my, 0, 0, btn.x, btn.y, btn.size, btn
		.size);
	if (ae.game.mobile) {
		if (freeTouch && btn.is_hovered) {
			data._cross_held = true;
		}
		else if (freeTouch && !btn.is_hovered) {
			data._cross_held = false;
		}
		else if (!freeTouch && data._cross_held) {
			data._cross_held = false;
			ae.shown = false;
			return;
		}
	}
	else {
		if (input.mouse.leftButtonPressed && btn.is_hovered) {
			data._cross_pc_held = true;
		}
		if (!input.mouse.leftButtonPressed && data._cross_pc_held) {
			data._cross_pc_held = false;
			if (btn.is_hovered) {
				ae.shown = false;
				return;
			}
		}
	}
	let zi = data.zoom_in_btn;
	zi.size = data.cross_size;
	zi.x = btn.x;
	zi.y = btn.y + btn.size + 10;
	zi.is_hovered = doRectsCollide(mx, my, 0, 0, zi.x, zi.y, zi.size, zi.size);
	if (zi.is_hovered && is_clicked) {
		data.zoom = Math.min(1.8, data.zoom + 0.1);
		data.page = 0;
		data.visual_page = 0;
	}
	let zo = data.zoom_out_btn;
	zo.size = data.cross_size;
	zo.x = btn.x;
	zo.y = zi.y + zi.size + 10;
	zo.is_hovered = doRectsCollide(mx, my, 0, 0, zo.x, zo.y, zo.size, zo.size);
	if (zo.is_hovered && is_clicked) {
		data.zoom = Math.max(1.0, data.zoom - 0.1);
		data.page = 0;
		data.visual_page = 0;
	}
	let vmb = data.view_mode_btn;
	vmb.size = data.cross_size;
	vmb.x = btn.x;
	vmb.y = zo.y + zo.size + 10;
	vmb.is_hovered = doRectsCollide(mx, my, 0, 0, vmb.x, vmb.y, vmb.size, vmb
		.size);
	if (vmb.is_hovered && is_clicked) {
		data.view_mode = (data.view_mode === "grid") ? "list" : "grid";
		data.page = 0;
		data.visual_page = 0;
	}
	const padding = 60;
	const spacing = 2.0;
	const currentW = data.icon_size * data.zoom;
	const currentH = data.icon_size * data.zoom;
	const availableW = data.width - padding * 2;
	const availableH = data.height - padding * 2;
	if (data.view_mode === "grid") {
		const cols = Math.max(1, Math.floor((availableW + currentW * (spacing -
			1)) / (currentW * spacing)));
		const rows = Math.max(1, Math.floor((availableH + currentH * (spacing -
			1)) / (currentH * spacing)));
		data.items_per_page = cols * rows;
	}
	else {
		let estimatedRowH = Math.max(currentH + 40, 110 * data.zoom);
		data.items_per_page = Math.max(1, Math.floor(availableH /
			estimatedRowH));
	}
	let pb = data.prev_btn;
	pb.size = 40;
	pb.x = data.offset_x;
	pb.y = data.offset_y + data.height + 10;
	pb.is_hovered = doRectsCollide(mx, my, 0, 0, pb.x, pb.y, pb.size, pb.size);
	if (pb.is_hovered && is_clicked && data.page > 0) {
		data.page--;
	}
	let nb = data.next_btn;
	nb.size = 40;
	nb.x = data.offset_x + data.width - nb.size;
	nb.y = data.offset_y + data.height + 10;
	nb.is_hovered = doRectsCollide(mx, my, 0, 0, nb.x, nb.y, nb.size, nb.size);
	if (nb.is_hovered && is_clicked) {
		let maxPage = Math.floor((data.sorted_keys.length - 1) / data
			.items_per_page);
		if (data.page < maxPage) data.page++;
	}
}

function achievements_draw(ae, ctx) {
	let data = ae.data;
	let inv_cols = COLORS_DEFAULT.ui.inventory;
	let scale = get_scale();
	ctx.save();
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = COLORS_DEFAULT.ui.achievements.bg;
	ctx.fillRect(data.offset_x, data.offset_y, data.width, data.height);
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
	ctx.lineWidth = 2;
	ctx.strokeRect(data.offset_x, data.offset_y, data.width, data.height);
	ctx.restore();
	const drawStyledButton = (b, type) => {
		let cs = b.size;
		ctx.save();
		ctx.fillStyle = b.is_hovered ? inv_cols.close_hover : inv_cols
			.close_bg;
		ctx.fillRect(b.x, b.y, cs, cs);
		ctx.strokeStyle = inv_cols.close_icon;
		ctx.lineWidth = 2;
		ctx.strokeRect(b.x, b.y, cs, cs);
		ctx.beginPath();
		ctx.strokeStyle = b.is_hovered ? inv_cols.close_icon_hover :
			inv_cols.close_icon;
		if (type === "cross") {
			ctx.moveTo(b.x + cs * 0.25, b.y + cs * 0.25);
			ctx.lineTo(b.x + cs * 0.75, b.y + cs * 0.75);
			ctx.moveTo(b.x + cs * 0.75, b.y + cs * 0.25);
			ctx.lineTo(b.x + cs * 0.25, b.y + cs * 0.75);
		}
		else if (type === "plus") {
			ctx.moveTo(b.x + cs * 0.5, b.y + cs * 0.25);
			ctx.lineTo(b.x + cs * 0.5, b.y + cs * 0.75);
			ctx.moveTo(b.x + cs * 0.25, b.y + cs * 0.5);
			ctx.lineTo(b.x + cs * 0.75, b.y + cs * 0.5);
		}
		else if (type === "minus") {
			ctx.moveTo(b.x + cs * 0.25, b.y + cs * 0.5);
			ctx.lineTo(b.x + cs * 0.75, b.y + cs * 0.5);
		}
		else if (type === "view_toggle") {
			if (data.view_mode === "grid") {
				for (let m = 0; m < 3; m++) {
					ctx.moveTo(b.x + cs * 0.25, b.y + cs * (0.3 + m * 0.2));
					ctx.lineTo(b.x + cs * 0.75, b.y + cs * (0.3 + m * 0.2));
				}
			}
			else {
				let s = cs * 0.2;
				ctx.fillStyle = b.is_hovered ? inv_cols.close_icon_hover :
					inv_cols.close_icon;
				ctx.fillRect(b.x + cs * 0.25, b.y + cs * 0.25, s, s);
				ctx.fillRect(b.x + cs * 0.55, b.y + cs * 0.25, s, s);
				ctx.fillRect(b.x + cs * 0.25, b.y + cs * 0.55, s, s);
				ctx.fillRect(b.x + cs * 0.55, b.y + cs * 0.55, s, s);
			}
		}
		else if (type === "prev") {
			ctx.moveTo(b.x + cs * 0.65, b.y + cs * 0.25);
			ctx.lineTo(b.x + cs * 0.35, b.y + cs * 0.5);
			ctx.lineTo(b.x + cs * 0.65, b.y + cs * 0.75);
		}
		else if (type === "next") {
			ctx.moveTo(b.x + cs * 0.35, b.y + cs * 0.25);
			ctx.lineTo(b.x + cs * 0.65, b.y + cs * 0.5);
			ctx.lineTo(b.x + cs * 0.35, b.y + cs * 0.75);
		}
		ctx.stroke();
		ctx.restore();
	};
	drawStyledButton(data.close_button, "cross");
	drawStyledButton(data.zoom_in_btn, "plus");
	drawStyledButton(data.zoom_out_btn, "minus");
	drawStyledButton(data.view_mode_btn, "view_toggle");
	drawStyledButton(data.prev_btn, "prev");
	drawStyledButton(data.next_btn, "next");
	ctx.save();
	ctx.beginPath();
	ctx.rect(data.offset_x, data.offset_y, data.width, data.height);
	ctx.clip();
	const padding = 60;
	const w = data.icon_size * data.zoom;
	const h = data.icon_size * data.zoom;
	const spacing = 2.0;
	const availableW = data.width - padding * 2;
	const availableH = data.height - padding * 2;
	const cols = Math.max(1, Math.floor((availableW + w * (spacing - 1)) / (w *
		spacing)));
	let mx = ae.game.input.mouse.x / scale;
	let my = ae.game.input.mouse.y / scale;
	let hoveredAchKey = null;
	let startPage = Math.floor(data.visual_page);
	let endPage = Math.ceil(data.visual_page);
	let maxP = Math.floor((data.sorted_keys.length - 1) / data.items_per_page);
	for (let pIndex = startPage; pIndex <= endPage; pIndex++) {
		if (pIndex < 0 || pIndex > maxP) continue;
		let startIdx = pIndex * data.items_per_page;
		let endIdx = Math.min(startIdx + data.items_per_page, data.sorted_keys
			.length);
		let xShift = (pIndex - data.visual_page) * data.width;
		let startX = data.offset_x + padding + xShift;
		let startY = data.offset_y + padding;
		if (data.view_mode === "grid") {
			const currentCols = Math.min(cols, endIdx - startIdx);
			const totalGridW = (currentCols * w * spacing) - (w * (spacing -
				1));
			const gridCenteringX = (availableW - totalGridW) / 2;
			for (let i = startIdx; i < endIdx; i++) {
				let key = data.sorted_keys[i];
				let relIdx = i - startIdx;
				let col = relIdx % cols;
				let row = Math.floor(relIdx / cols);
				let ix = startX + gridCenteringX + col * (w * spacing);
				let iy = startY + row * (h * spacing);
				achievement_icon_draw(ctx, data.achievements, key, ix, iy, w, h,
					false, data.offset_x, data.offset_y,
					data.offset_x + data.width,
					data.offset_y + data.height,
					data.animstate);
				if (pIndex === data.page && mx > ix && mx < ix + w && my > iy &&
					my < iy + h) {
					hoveredAchKey = key;
				}
			}
		}
		else {
			let fontSize = Math.max(14, Math.floor(h * 0.45));
			let descFontSize = fontSize * 0.85;
			let textMaxWidth = availableW - (h + 30);
			let currentY = startY;
			for (let i = startIdx; i < endIdx; i++) {
				let key = data.sorted_keys[i];
				const config = ACHIEVEMENT_REGISTRY[key];
				if (!config) continue;
				let achData = achievement_get(data.achievements, key);
				let isHidden = false;
				if (config.req) {
					const reqAch = achievement_get(data.achievements, config
						.req);
					if (!reqAch || !reqAch.done) isHidden = true;
				}
				let name = isHidden ? "Скрытая задача" : (ae.game.settings
					.language == "русский" ? achData.name_rus : key);
				let desc = "";
				if (!isHidden) {
					let dRaw = ae.game.settings.language == "русский" ? achData
						.desc_rus : achData.desc;
					desc = (typeof dRaw === 'object') ? (ae.game.mobile ? dRaw
						.mobile : dRaw.pc) : dRaw;
				}
				else {
					desc =
						"Новые задачи открываются по мере выполнения других задач. Используйте задачи как гайд в мир игры. Ваша цель - выполнить все задания.";
				}
				ctx.font = descFontSize + "px sans-serif";
				let words = desc.split(' ');
				let lines = [];
				let line = "";
				for (let n = 0; n < words.length; n++) {
					let test = line + words[n] + " ";
					if (ctx.measureText(test).width > textMaxWidth) {
						lines.push(line);
						line = words[n] + " ";
					}
					else line = test;
				}
				lines.push(line);
				let rowH = Math.max(h + 20, (fontSize * 1.5) + (lines.length *
					descFontSize * 1.2) + 40);
				if (currentY + rowH - startY > availableH + 10) break;
				ctx.save();
				ctx.globalAlpha = 0.3;
				ctx.fillStyle = COLORS_DEFAULT.ui.achievements.bg;
				ctx.fillRect(startX - 10, currentY, availableW + 20, rowH - 10);
				ctx.restore();
				achievement_icon_draw(ctx, data.achievements, key, startX,
					currentY + (rowH - 10 - h) / 2, h, h, false, data
					.offset_x, data.offset_y, data.offset_x + data.width,
					data.offset_y + data.height, data.animstate);
				drawText(ctx, startX + h + 25, currentY + fontSize + 15, name,
					fontSize * 0.8, COLORS_DEFAULT.ui.achievements
					.text_accent, true);
				for (let l = 0; l < lines.length; l++) {
					drawText(ctx, startX + h + 25, currentY + (fontSize * 2) +
						25 + l * descFontSize * 1.2, lines[l], descFontSize,
						COLORS_DEFAULT.ui.achievements.text_main);
				}
				if (pIndex === data.page && mx > startX && mx < startX +
					availableW && my > currentY && my < currentY + rowH) {
					hoveredAchKey = key;
				}
				currentY += rowH;
			}
		}
	}
	ctx.restore();
	if (hoveredAchKey && data.view_mode === 'grid') {
		achievement_draw_popup(ctx, ae, hoveredAchKey, mx, my);
	}
}

function achievement_get(as, name) {
	for (let i = 0; i < as.length; i++)
		if (as[i].name == name)
			return as[i];
	return null;
}

function achievement_do(as, name, ash = null, silent = false) {
	let achData = achievement_get(as, name);
	if (!achData) return;
	if (achData.done) return;
	const config = ACHIEVEMENT_REGISTRY[name];
	if (!config) {
		achData.done = true;
		return;
	}
	if (config.req) {
		achievement_do(as, config.req, ash, silent);
		let reqAch = achievement_get(as, config.req);
		if (!reqAch || !reqAch.done) return;
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

function achievement_draw_popup(ctx, ae, ach, mx, my) {
	let as = ae.data.achievements;
	let scale = get_scale();
	let h = ae.data.icon_size * ae.data.zoom;
	let fontSize = Math.max(14, Math.floor(h * 0.45));
	let descFontSize = fontSize * 0.85;
	ctx.save();
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	const W = ae.data.width - 120;
	let screenW = window.innerWidth / scale;
	let screenH = window.innerHeight / scale;
	const config = ACHIEVEMENT_REGISTRY[ach];
	let isHidden = false;
	if (config.req) {
		const reqAch = achievement_get(as, config.req);
		if (!reqAch || !reqAch.done) isHidden = true;
	}
	let achData = achievement_get(as, ach);
	let name = "",
		desc = "";
	if (isHidden) {
		name = "Скрытая задача";
		desc =
			"Новые задачи открываются по мере выполнения других задач. Используйте задачи как гайд в мир игры. Ваша цель - выполнить все задания.";
	}
	else {
		name = (ae.game.settings.language == "русский") ? (achData.name_rus ||
			ach) : ach;
		let descRaw = (ae.game.settings.language == "русский") ? achData
			.desc_rus : achData.desc;
		desc = (typeof descRaw === 'object' && descRaw !== null) ? descRaw.pc :
			descRaw;
	}
	let textMaxWidth = W - (h + 35);
	ctx.font = descFontSize + "px sans-serif";
	let words = (desc || "").split(' ');
	let lines = [];
	let currentLine = "";
	for (let n = 0; n < words.length; n++) {
		let testLine = currentLine + words[n] + " ";
		if (ctx.measureText(testLine).width > textMaxWidth && n > 0) {
			lines.push(currentLine);
			currentLine = words[n] + " ";
		}
		else {
			currentLine = testLine;
		}
	}
	lines.push(currentLine);
	let H = Math.max(h + 20, (fontSize * 1.5) + (lines.length * descFontSize *
		1.2) + 40);
	let x = mx + 20;
	let y = my + 20;
	if (x + W > screenW) x = mx - W - 20;
	if (y + H > screenH) y = my - H - 20;
	if (x < 10) x = 10;
	if (y < 10) y = 10;
	ctx.globalAlpha = 0.95;
	ctx.fillStyle = COLORS_DEFAULT.ui.achievements.bg;
	ctx.fillRect(x, y, W, H);
	ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, W, H);
	achievement_icon_draw(ctx, as, ach, x + 10, y + (H - h) / 2, h, h, false, 0,
		0, screenW, screenH, ae.data.animstate);
	let textStartX = x + h + 25;
	const formattedName = name;
	drawText(ctx, textStartX, y + fontSize + 15, formattedName, fontSize * 0.8,
		COLORS_DEFAULT.ui.achievements.text_accent, true);
	for (let l = 0; l < lines.length; l++) {
		let lineY = y + (fontSize * 2) + 25 + l * descFontSize * 1.2;
		drawText(ctx, textStartX, lineY, lines[l], descFontSize, COLORS_DEFAULT
			.ui.achievements.text_main);
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
		c28: COLORS_DEFAULT.ui.achievements.palette.glass,
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
		p.c28 = pal.gray_silver;
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
	if (x + w < bbx || x > bbw || y + h < bby || y > bbh || !name) return;
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
	if (!done && ach) done = ach.done;
	const p = get_achievement_palette(done, animstate);
	ctx.lineWidth = 0.025 * w;
	if (back) {
		ctx.save();
		ctx.globalAlpha *= 0.25;
		ctx.fillStyle = done ? COLORS_DEFAULT.enemies.regular.body :
			COLORS_DEFAULT.player.red;
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = COLORS_DEFAULT.ui.achievements.border;
		ctx.strokeRect(x, y, w, h);
		ctx.restore();
	}
	config.draw(ctx, x, y, w, h, p);
}
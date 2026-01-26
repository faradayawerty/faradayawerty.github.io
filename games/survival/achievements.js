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
		} else {
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
		offset_x: 50,
		offset_y: 50,
		x: 150,
		y: 150,
		xx: 550,
		yy: 550,
		mxx: 0,
		myy: 0,
		clicked: false,
		icon_size: 60,
		animstate: 0,
		cross_width: 0,
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
	if (!ae.game.mobile && input.mouse.leftButtonPressed) {
		if (ae.data.offset_x < mx && mx < ae.data.offset_x + ae.data.width &&
			ae.data.offset_y < my && my < ae.data.offset_y + ae.data.height) {
			if (!ae.data.clicked) {
				ae.data.xx = ae.data.x;
				ae.data.yy = ae.data.y;
				ae.data.mxx = mx;
				ae.data.myy = my;
			}
			ae.data.x = ae.data.xx + (mx - ae.data.mxx);
			ae.data.y = ae.data.yy + (my - ae.data.myy);
			ae.data.clicked = true;
		}
	} else {
		ae.data.clicked = false;
	}
	let points = [];
	if (ae.game.mobile) {
		if (freeTouch) {
			points.push({
				x: mx,
				y: my
			});
		}
	} else if (input.mouse.leftButtonPressed) {
		points.push({
			x: mx,
			y: my
		});
	}
	let crossX = ae.data.offset_x + ae.data.width - ae.data.cross_width;
	let crossY = ae.data.offset_y;
	let is_over_cross = false;
	for (let pt of points) {
		if (doRectsCollide(pt.x, pt.y, 0, 0, crossX, crossY, ae.data
				.cross_width, ae.data.cross_width)) {
			is_over_cross = true;
			break;
		}
	}
	if (ae.game.mobile) {
		if (is_over_cross) {
			ae.data._cross_held = true;
			ae.data.clicked = false;
		} else if (freeTouch && !is_over_cross) {
			ae.data._cross_held = false;
		} else if (!freeTouch && ae.data._cross_held) {
			ae.data._cross_held = false;
			ae.shown = false;
			if (ae.game.debug_console) {
				ae.game.debug_console.unshift('hide achievements via release');
			}
			return;
		}
	} else {
		if (is_over_cross && !ae.data.was_left_down && input.mouse
			.leftButtonPressed) {
			ae.shown = false;
			return;
		}
	}
	ae.data.was_left_down = input.mouse.leftButtonPressed;
}

function achievements_draw(ae, ctx) {
	let as = ae.data.achievements;
	let scale = get_scale();
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = "black";
	ctx.fillRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data
		.height);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.strokeRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data
		.height);
	ctx.globalAlpha = 1.0;
	let cross_width = ae.data.width * 0.025;
	ae.data.cross_width = cross_width;
	let cx = ae.data.offset_x + ae.data.width - cross_width;
	let cy = ae.data.offset_y;
	ctx.fillStyle = "#444444";
	ctx.fillRect(cx, cy, cross_width, cross_width);
	ctx.strokeStyle = "white";
	ctx.strokeRect(cx, cy, cross_width, cross_width);
	drawLine(ctx, cx, cy, cx + cross_width, cy + cross_width, "white", 0.1 *
		cross_width);
	drawLine(ctx, cx, cy + cross_width, cx + cross_width, cy, "white", 0.1 *
		cross_width);
	let startX = ae.data.x;
	let startY = ae.data.y;
	let w = ae.data.icon_size;
	let h = ae.data.icon_size;
	let spacing = 2.0;
	let mx = ae.game.input.mouse.x / scale;
	let my = ae.game.input.mouse.y / scale;
	let hoveredAchKey = null;
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
			let canSee = true;
			if (config.req) {
				let reqAch = achievement_get(as, config.req);
				if (!reqAch || !reqAch.done) canSee = false;
			}
			if (canSee) {
				hoveredAchKey = key;
			}
		}
	}
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
	let achData = achievement_get(as, name);
	if (!achData || achData.done) return;
	const config = ACHIEVEMENT_REGISTRY[name];
	if (config && config.req) {
		achievement_do(as, config.req, ash, silent);
		let reqAch = achievement_get(as, config.req);
		if (reqAch && !reqAch.done) return;
	}
	if (ash && !silent) {
		audio_play("data/sfx/achievement_get_1.mp3", 0.1875);
		ash.data.achievements.unshift(name);
	}
	achData.done = true;
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
		.achievements.length || ashe.data.achievements.length > 14) {
		ashe.data.achievements.pop();
		ashe.data.time_since_last_deleted_achievement = 0;
	}
}

function achievements_shower_draw(ashe, ctx) {
	for (let i = 0; i < ashe.data.achievements.length; i++) {
		let ach = ashe.data.achievements[i];
		let x = ashe.data.x;
		let y = ashe.data.y + ashe.data.h * 1.25 * i;
		let w = ashe.data.w;
		let h = ashe.data.h;
		let size = Math.min(w, h);
		ctx.globalAlpha *= 0.5;
		ctx.fillStyle = "black";
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = "gray";
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 2;
		let isMob = ashe.game.mobile;
		let helpText = isMob ? "tap the gold cup" : "press R or J";
		let helpTextRus = isMob ? "нажмите на кубок" : "нажмите R или J";
		let achData = achievement_get(ashe.data.attached_to.data.achievements,
			ach);
		let text = "achievement get: " + ach + "! " + helpText + " to view";
		if (ashe.game.settings.language == "русский") {
			text = "получено достижение: " + achData.name_rus + "! " +
				helpTextRus;
		}
		drawText(ctx, x + 1.25 * size, y + 0.6 * size, text, 20);
		achievement_icon_draw(ctx, ashe.data.attached_to.data.achievements, ach,
			x + 0.125 * size, y + 0.125 * size, 0.75 * size, 0.75 * size,
			false, 50, 50, 1000, 1000, ashe.data.animstate, false);
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
	1000) {
	let as = ae.data.achievements;
	let W = bbw * 0.65;
	let H = bbh * 0.25;
	if (x + W > window.innerWidth / get_scale())
		x = x - W;
	if (y + H > window.innerHeight / get_scale())
		y = y - H;
	let lines = [];
	let achData = achievement_get(as, ach);
	let name = achData.name;
	if (ae.game.settings.language == "русский")
		name = achData.name_rus;
	lines.push("** " + name + " **");
	lines.push("");
	let descRaw = (ae.game.settings.language == "русский") ? achData.desc_rus :
		achData.desc;
	let desc = "";
	if (typeof descRaw === 'object' && descRaw !== null) {
		desc = ae.game.mobile ? descRaw.mobile : descRaw.pc;
	} else {
		desc = descRaw;
	}
	let fontsize = Math.floor(W / 27);
	let charlim = Math.floor(1.25 * W / fontsize);
	let words = desc.split(' ');
	let line = "";
	for (let i = 0; i < words.length; i++) {
		if ((line + words[i]).length > charlim && line.length > 0) {
			lines.push(line);
			line = "";
		}
		line += words[i] + " ";
	}
	lines.push(line);
	ctx.fillStyle = "black";
	ctx.fillRect(x, y, W, H);
	ctx.strokeStyle = "gray";
	ctx.strokeRect(x, y, W, H);
	achievement_icon_draw(ctx, as, ach, x + 0.5 * w, y + 0.5 * h, 2 * w, 2 * h,
		false, 0, 0, window.innerWidth / get_scale(), window.innerHeight /
		get_scale(), ae.data.animstate);
	for (let i = 0; i < lines.length; i++) {
		drawText(ctx, x + 3 * h, y + h + i * fontsize * 1.25, lines[i],
			fontsize);
	}
}

function get_achievement_palette(done, animstate) {
	let p = {
		c0: "red",
		c1: "yellow",
		c2: "lime",
		c3: "blue",
		c4: "cyan",
		c5: "purple",
		c6: "orange",
		c7: "green",
		c8: "white",
		c9: "black",
		c10: "gray",
		c11: "#771111",
		c12: "#1177dd",
		c13: "#1177ff",
		c14: "#335544",
		c16: "#cc1111",
		c15: "black"
	};
	if (!done) {
		p.c0 = "black";
		p.c1 = "white";
		p.c2 = "white";
		p.c3 = "black";
		p.c4 = "gray";
		p.c5 = "gray";
		p.c6 = "gray";
		p.c7 = "black";
		p.c8 = "white";
		p.c9 = "black";
		p.c10 = "white";
		p.c11 = "#111111";
		p.c12 = "#777777";
		p.c13 = "#777777";
		p.c14 = "#333333";
		p.c16 = "#111111";
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

function achievement_icon_draw(ctx, as, name, x, y, w, h, done = false, bbx =
	50, bby = 50, bbw = 1000, bbh = 1000, animstate = null, back = true) {
	if (x < bbx || x > bbw - 0.2 * w || y < bby || y > bbh - 0.2 * h || !name)
		return;
	const config = ACHIEVEMENT_REGISTRY[name];
	if (!config) return;
	const ach = achievement_get(as, name);
	if (config.req) {
		const reqAch = achievement_get(as, config.req);
		if (reqAch && !reqAch.done) return;
	}
	if (!done && ach) {
		done = ach.done;
	}
	const p = get_achievement_palette(done, animstate);
	ctx.lineWidth = 0.025 * w;
	if (back) {
		ctx.globalAlpha *= 0.25;
		ctx.fillStyle = done ? "green" : "red";
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 4;
	}
	config.draw(ctx, x, y, w, h, p);
}
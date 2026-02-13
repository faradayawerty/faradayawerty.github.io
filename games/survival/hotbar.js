function hotbar_create(g, inv, attached_to_object = null) {
	let hb = {
		iselected: 0,
		row: inv.items[0],
		slot_size: 70,
		attached_to_object: attached_to_object,
		animation_state: 0,
		mouse_over: false,
		has_shield_button: false,
		did_want_menu: false,
		leftButtonClickable: false,
		hovered_btn: null
	};
	let ihotbar = game_gui_element_create(g, "hotbar", hb, hotbar_update,
		hotbar_draw, hotbar_destroy);
	g.gui_elements[ihotbar].shown = true;
	return ihotbar;
}

function hotbar_destroy(hotbar_element) {
	hotbar_element.data.attached_to_object = null;
	hotbar_element.destroyed = true;
}

function hotbar_get_selected_item(hotbar_element) {
	let inv_el = hotbar_element.data.attached_to_object.data.inventory_element;
	if (inv_el.game.mobile && inv_el && inv_el.shown) return 0;
	if (!hotbar_element.shown) {
		if (hotbar_element.data.attached_to_object.name == "player" && !
			hotbar_element.data.attached_to_object.destroyed) {
			let inv = hotbar_element.data.attached_to_object.data
				.inventory_element.data;
			if (inv.jmove > -1 && inv.imove > -1) {
				if (inv.iselected == -1 && inv.jselected == -1)
					return inv.items[inv.imove][inv.jmove];
			}
		}
		return 0;
	}
	else if (hotbar_element.data.mouse_over) {
		return 0;
	}
	return hotbar_element.data.row[hotbar_element.data.iselected];
}

function hotbar_draw(hotbar_object, ctx) {
	let hb = hotbar_object.data;
	let s = hb.slot_size;
	let step = s * 1.05;
	let start_y = 40;
	let start_x = 40;
	if (hotbar_object.game.mobile) {
		hb.slot_size = 97;
		s = hb.slot_size;
		step = s * 1.05;
	}
	for (let i = 0; i < hb.row.length; i++) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = (hb.iselected == i) ? "cyan" : "blue";
		ctx.fillRect(start_x + step * i, start_y, s, s);
		ctx.globalAlpha = 1.0;
		item_icon_draw(ctx, hb.row[i], start_x + step * i, start_y, s, s, hb
			.animation_state);
	}
	const drawButtonBg = (x, y_off, type) => {
		if (!hotbar_object.game.mobile && hb.hovered_btn === type) {
			ctx.fillStyle = "#6699ff";
		}
		else {
			ctx.fillStyle = "#4477ff";
		}
		ctx.globalAlpha = 0.8;
		ctx.fillRect(x, y_off, s, s);
		ctx.globalAlpha = 1.0;
		if (!hotbar_object.game.mobile && hb.hovered_btn === type) {
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.strokeRect(x, y_off, s, s);
		}
	};
	let p = hb.attached_to_object.data;
	let isMobile = hotbar_object.game.mobile;
	let btn_menu_x, btn_menu_y, btn_inv_x, btn_inv_y, btn_ach_x, btn_ach_y;
	if (isMobile) {
		let col_res_x = start_x + step * hb.row.length;
		let col_sys_x = col_res_x + step;
		btn_menu_x = col_sys_x;
		btn_menu_y = start_y;
		btn_inv_x = col_sys_x;
		btn_inv_y = start_y + step;
		btn_ach_x = col_sys_x;
		btn_ach_y = start_y + step * 2;
		const drawIndicator = (ix, iy, val, max, colorEmpty, colorFull,
			itemKey) => {
			ctx.save();
			ctx.globalAlpha = 0.6;
			ctx.fillStyle = colorEmpty;
			ctx.fillRect(ix, iy, s, s);
			let ratio = Math.max(0, Math.min(1, val / max));
			ctx.fillStyle = colorFull;
			let fillH = s * ratio;
			ctx.fillRect(ix, iy + (s - fillH), s, fillH);
			ctx.strokeStyle = "rgba(255,255,255,0.4)";
			ctx.lineWidth = 2;
			ctx.strokeRect(ix, iy, s, s);
			let iconPadding = s * 0.2;
			let iconSize = s - iconPadding * 2;
			if (ITEMS_DATA[itemKey] && ITEMS_DATA[itemKey].render) {
				ctx.globalAlpha = 0.85;
				ITEMS_DATA[itemKey].render(ctx, ix + iconPadding, iy +
					iconPadding, iconSize, iconSize, 0.25 * hb
					.animation_state);
			}
			ctx.restore();
		};
		drawIndicator(col_res_x, start_y, p.hunger, p.max_hunger, "#331100",
			"#ff8800", ITEM_APPLE);
		drawIndicator(col_res_x, start_y + step, p.thirst, p.max_thirst,
			"#001144", "#1177dd", ITEM_WATER);
		drawIndicator(col_res_x, start_y + step * 2, p.health, p.max_health,
			"#880000", "#22ff22", ITEM_HEALTH);
		if (hb.has_shield_button) {
			let sVal = 0,
				sMax = 100,
				sIcon = ITEM_SHIELD_GRAY,
				sColor = "#00ffff";
			if (p.shield_rainbow_health > 0) {
				sVal = p.shield_rainbow_health;
				sMax = p.shield_rainbow_health_max;
				sIcon = ITEM_SHIELD_RAINBOW;
				let r = Math.floor(Math.pow(Math.cos(0.025 * hb
					.animation_state) * 15, 2));
				let g = Math.floor(Math.pow(0.7 * (Math.cos(0.025 * hb
					.animation_state) + Math.sin(0.025 * hb
					.animation_state)) * 15, 2));
				let b = Math.floor(Math.pow(Math.sin(0.025 * hb
					.animation_state) * 15, 2));
				sColor = "#" + r.toString(16).padStart(2, '0') + g.toString(16)
					.padStart(2, '0') + b.toString(16).padStart(2, '0');
			}
			else if (p.shield_green_health > 0) {
				sVal = p.shield_green_health;
				sMax = p.shield_green_health_max;
				sIcon = ITEM_SHIELD_GREEN;
				sColor = "lime";
			}
			else if (p.shield_blue_health > 0) {
				sVal = p.shield_blue_health;
				sMax = p.shield_blue_health_max;
				sIcon = ITEM_SHIELD;
				sColor = "#00ffff";
			}
			drawIndicator(col_res_x, start_y + step * 3, sVal, sMax, "#444444",
				sColor, sIcon);
		}
	}
	else {
		let offset_x = start_x + step * hb.row.length + (step * 0.5);
		btn_menu_x = offset_x;
		btn_menu_y = start_y;
		btn_inv_x = offset_x + step;
		btn_inv_y = start_y;
		btn_ach_x = offset_x + step * 2;
		btn_ach_y = start_y;
	}
	drawButtonBg(btn_menu_x, btn_menu_y, 'menu');
	ctx.save();
	if (isMobile) {
		ctx.fillStyle = "white";
		let barW = s * 0.5;
		let barH = s * 0.08;
		let barX = btn_menu_x + (s - barW) / 2;
		ctx.fillRect(barX, btn_menu_y + s * 0.3, barW, barH);
		ctx.fillRect(barX, btn_menu_y + s * 0.48, barW, barH);
		ctx.fillRect(barX, btn_menu_y + s * 0.66, barW, barH);
	}
	else {
		let centerX = btn_menu_x + s / 2;
		let centerY = btn_menu_y + s / 2;
		let coreRadius = s * 0.22;
		let toothDepth = s * 0.08;
		let toothWidth = s * 0.12;
		let innerRadius = s * 0.08;
		let teethCount = 8;
		ctx.fillStyle = "white";
		for (let i = 0; i < teethCount; i++) {
			let angle = (i * 2 * Math.PI) / teethCount;
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(angle);
			ctx.fillRect(-toothWidth / 2, -coreRadius - toothDepth, toothWidth,
				toothDepth + 2);
			ctx.restore();
		}
		ctx.beginPath();
		ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
		ctx.strokeStyle = "rgba(0,0,0,0.2)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.restore();
	drawButtonBg(btn_inv_x, btn_inv_y, 'inv');
	let pad = s * 0.2;
	let bw = s - pad * 2,
		bh = s - pad * 2;
	let bx = btn_inv_x + pad,
		by = btn_inv_y + pad;
	ctx.fillStyle = "#a52a2a";
	ctx.fillRect(bx, by + bh * 0.2, bw, bh * 0.8);
	ctx.fillStyle = "#8b4513";
	ctx.fillRect(bx, by + bh * 0.1, bw, bh * 0.4);
	ctx.strokeStyle = "#8b4513";
	ctx.lineWidth = s * 0.05;
	ctx.beginPath();
	ctx.arc(bx + bw / 2, by + bh * 0.1, bw * 0.2, Math.PI, 0);
	ctx.stroke();
	ctx.fillStyle = "yellow";
	ctx.fillRect(bx + bw * 0.2, by + bh * 0.4, bw * 0.1, bh * 0.2);
	ctx.fillRect(bx + bw * 0.7, by + bh * 0.4, bw * 0.1, bh * 0.2);
	ctx.strokeStyle = "black";
	ctx.lineWidth = s * 0.02;
	ctx.strokeRect(bx, by + bh * 0.2, bw, bh * 0.8);
	drawButtonBg(btn_ach_x, btn_ach_y, 'ach');
	let ax = btn_ach_x + s * 0.25,
		ay = btn_ach_y + s * 0.25;
	let aw = s * 0.5,
		ah = s * 0.5;
	ctx.fillStyle = "gold";
	ctx.beginPath();
	ctx.moveTo(ax, ay);
	ctx.lineTo(ax + aw, ay);
	ctx.lineTo(ax + aw * 0.8, ay + ah * 0.6);
	ctx.lineTo(ax + aw * 0.2, ay + ah * 0.6);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "orange";
	ctx.lineWidth = s * 0.03;
	ctx.stroke();
	ctx.fillRect(ax + aw * 0.4, ay + ah * 0.6, aw * 0.2, ah * 0.3);
	ctx.fillRect(ax + aw * 0.2, ay + ah * 0.8, aw * 0.6, ah * 0.2);
	ctx.beginPath();
	ctx.arc(ax, ay + ah * 0.3, s * 0.1, 0, Math.PI * 2);
	ctx.arc(ax + aw, ay + ah * 0.3, s * 0.1, 0, Math.PI * 2);
	ctx.stroke();
	if (!isMobile && hb.hovered_btn) {
		let lang = hotbar_object.game.settings.language;
		let title = "";
		let description = "";
		if (hb.hovered_btn === 'menu') {
			if (lang === "русский") {
				title = "Меню";
				description =
					"Здесь можно сохранить или загрузить игру, изменить настройки. Советую заглянуть в них, если хочешь адаптировать игру под себя.";
			}
			else {
				title = "Menu";
				description =
					"Here you can save or load the game and change settings. Check them out if you want to customize the game.";
			}
		}
		else if (hb.hovered_btn === 'inv') {
			if (lang === "русский") {
				title = "Инвентарь";
				description =
					"Сюда попадают подобранные предметы. Открыв инвентарь, нажмите на предмет, чтобы переместить его в другую ячейку или воспользоваться им. Нажмите Q или ПКМ, чтобы выбросить предмет.";
			}
			else {
				title = "Inventory";
				description =
					"All picked up items go here. Click an item to move it or use it. Press Q or Right-Click to drop an item.";
			}
		}
		else if (hb.hovered_btn === 'ach') {
			if (lang === "русский") {
				title = "Достижения";
				description =
					"Ваш гайд в мир игры. Почаще поглядывайте сюда, чтобы не запутаться.";
			}
			else {
				title = "Achievements";
				description =
					"Your guide to the game world. Take a look here if you ever feel lost.";
			}
		}
		if (title !== "") {
			ctx.save();
			let scale = get_scale();
			let mx = hotbar_object.game.input.mouse.x / scale;
			let my = hotbar_object.game.input.mouse.y / scale;
			let W = 750;
			let H = 400;
			let fontsize = 32;
			let screenW = window.innerWidth / scale;
			let screenH = window.innerHeight / scale;
			let x = mx + 20;
			let y = my + 20;
			if (x + W > screenW) x -= W;
			if (y + H > screenH) y -= H;
			if (x < 0) x = 10;
			if (y < 0) y = 10;
			ctx.globalAlpha = 0.9;
			ctx.fillStyle = "black";
			ctx.strokeStyle = "gray";
			ctx.lineWidth = 2;
			ctx.fillRect(x, y, W, H);
			ctx.strokeRect(x, y, W, H);
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = "yellow";
			ctx.font = `bold ${fontsize - 2}px Arial`;
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText(title, x + 10, y + 20);
			ctx.fillStyle = "white";
			ctx.font = `${fontsize}px Arial`;
			let words = description.split(' ');
			let line = "";
			let lineY = y + 75;
			let charlim = 40;
			for (let n = 0; n < words.length; n++) {
				let testLine = line + words[n] + " ";
				if (testLine.length > charlim) {
					ctx.fillText(line, x + 10, lineY);
					line = words[n] + " ";
					lineY += fontsize * 1.2;
				}
				else {
					line = testLine;
				}
			}
			ctx.fillText(line, x + 10, lineY);
			ctx.restore();
		}
	}
}

function hotbar_update(hotbar_element, dt) {
	let hb = hotbar_element.data;
	let input = hotbar_element.game.input;
	let scale = get_scale();
	hb.animation_state += 0.02 * dt;
	if (hb.attached_to_object.data.ai_controlled)
		hotbar_element.shown = false;
	for (let i = 0; i < 9; i++) {
		if (isKeyDown(input, (i + 1).toString(), true)) hb.iselected = i;
	}
	if (isMouseWheelUp(input)) hb.iselected = (hb.iselected + 1) % 9;
	if (isMouseWheelDown(input)) hb.iselected = (hb.iselected - 1 + 9) % 9;
	hb.mouse_over = false;
	hb.hovered_btn = null;
	let pointsToCheck = [];
	if (!isScreenTouched(input)) {
		pointsToCheck.push({
			x: input.mouse.x / scale,
			y: input.mouse.y / scale
		});
	}
	else {
		for (let t of input.touch) {
			pointsToCheck.push({
				x: t.x / scale,
				y: t.y / scale
			});
		}
	}
	let inv_el = hb.attached_to_object.data.inventory_element;
	let anyPointOverConsumeButtons = false;
	if (inv_el) {
		let hasShieldInInv = inventory_has_item_from_list(inv_el, [ITEM_SHIELD,
			ITEM_SHIELD_GREEN, ITEM_SHIELD_RAINBOW
		]) !== -1;
		if (hasShieldInInv) hb.has_shield_button = true;
	}
	let isMobile = hotbar_element.game.mobile;
	let pcActionTriggered = false;
	if (!isMobile) {
		if (input.mouse.leftButtonPressed) {
			hb.leftButtonClickable = true;
		}
		else if (hb.leftButtonClickable) {
			pcActionTriggered = true;
			hb.leftButtonClickable = false;
		}
	}
	for (let pt of pointsToCheck) {
		let s = hb.slot_size;
		let step = s * 1.05;
		let start_y = 40;
		let start_x = 40;
		for (let i = 0; i < hb.row.length; i++) {
			let sx = start_x + step * i;
			if ((isMobile || input.mouse.leftButtonPressed) &&
				doRectsCollide(pt.x, pt.y, 0, 0, sx, start_y, s, s)) {
				hb.mouse_over = true;
				hb.iselected = i;
			}
		}
		let b_menu_x, b_menu_y, b_inv_x, b_inv_y, b_ach_x, b_ach_y;
		if (isMobile) {
			let col_res_x = start_x + step * hb.row.length;
			let col_sys_x = col_res_x + step;
			b_menu_x = col_sys_x;
			b_menu_y = start_y;
			b_inv_x = col_sys_x;
			b_inv_y = start_y + step;
			b_ach_x = col_sys_x;
			b_ach_y = start_y + step * 2;
		}
		else {
			let offset_x = start_x + step * hb.row.length + (step * 0.5);
			b_menu_x = offset_x;
			b_menu_y = start_y;
			b_inv_x = offset_x + step;
			b_inv_y = start_y;
			b_ach_x = offset_x + step * 2;
			b_ach_y = start_y;
		}
		if (doRectsCollide(pt.x, pt.y, 0, 0, b_menu_x, b_menu_y, s, s) ||
			doRectsCollide(pt.x, pt.y, 0, 0, b_inv_x, b_inv_y, s, s) ||
			doRectsCollide(pt.x, pt.y, 0, 0, b_ach_x, b_ach_y, s, s)) {
			hb.mouse_over = true;
		}
		if (!isMobile) {
			if (doRectsCollide(pt.x, pt.y, 0, 0, b_menu_x, b_menu_y, s, s)) hb
				.hovered_btn = 'menu';
			if (doRectsCollide(pt.x, pt.y, 0, 0, b_inv_x, b_inv_y, s, s)) hb
				.hovered_btn = 'inv';
			if (doRectsCollide(pt.x, pt.y, 0, 0, b_ach_x, b_ach_y, s, s)) hb
				.hovered_btn = 'ach';
		}
		let isAction = isMobile ? isScreenTouched(input) : pcActionTriggered;
		if (isAction && doRectsCollide(pt.x, pt.y, 0, 0, b_menu_x, b_menu_y, s,
				s)) {
			if (isMobile) {
				if (!hb.did_want_menu) {
					hotbar_element.game.want_menu = true;
					hb.did_want_menu = true;
				}
			}
			else {
				hotbar_element.game.want_menu = true;
			}
		}
		else if (isMobile) {
			hb.did_want_menu = false;
		}
		if (isAction && doRectsCollide(pt.x, pt.y, 0, 0, b_inv_x, b_inv_y, s,
				s)) {
			if (inv_el && !inv_el._mob_toggle_lock) {
				let ash = hotbar_element.game.gui_elements.find(e => e.name ==
					"achievements shower");
				achievement_do(hb.attached_to_object.data.achievements_element
					.data.achievements, "discovering inventory", ash);
				inv_el.shown = !inv_el.shown;
				if (isMobile) inv_el._mob_toggle_lock = true;
			}
		}
		if (isAction && doRectsCollide(pt.x, pt.y, 0, 0, b_ach_x, b_ach_y, s,
				s)) {
			let ach_el = hb.attached_to_object.data.achievements_element;
			if (ach_el) {
				let ash = hotbar_element.game.gui_elements.find(e => e.name ==
					"achievements shower");
				achievement_do(ach_el.data.achievements, "achievements", ash);
				ach_el.shown = true;
			}
		}
		if (isMobile) {
			let col_res_x = start_x + step * hb.row.length;
			let player = hb.attached_to_object;
			let overFood = doRectsCollide(pt.x, pt.y, 0, 0, col_res_x, start_y,
				s, s);
			let overWater = doRectsCollide(pt.x, pt.y, 0, 0, col_res_x,
				start_y + step, s, s);
			let overHealth = doRectsCollide(pt.x, pt.y, 0, 0, col_res_x,
				start_y + step * 2, s, s);
			let overShield = hb.has_shield_button && doRectsCollide(pt.x, pt.y,
				0, 0, col_res_x, start_y + step * 3, s, s);
			if (overHealth || overWater || overFood || overShield) {
				hb.mouse_over = true;
				anyPointOverConsumeButtons = true;
				if (!hb._consume_lock) {
					if (overFood) {
						let item = inventory_has_item_from_list(inv_el,
							ITEMS_FOODS);
						if (item !== -1) player_item_consume(player, item,
							true);
					}
					else if (overWater) {
						let item = inventory_has_item_from_list(inv_el,
							ITEMS_DRINKS);
						if (item !== -1) player_item_consume(player, item,
							true);
					}
					else if (overHealth) {
						let item = inventory_has_item_from_list(inv_el, [
							ITEM_HEALTH_GREEN, ITEM_HEALTH
						]);
						if (item !== -1) player_item_consume(player, item,
							true);
					}
					else if (overShield) {
						let item = inventory_has_item_from_list(inv_el, [
							ITEM_SHIELD, ITEM_SHIELD_GREEN,
							ITEM_SHIELD_RAINBOW
						]);
						if (item !== -1) player_item_consume(player, item,
							true);
					}
					hb._consume_lock = true;
				}
			}
		}
	}
	if (inv_el && inv_el._mob_toggle_lock && isMobile) {
		let stillTouchingInv = false;
		let s = hb.slot_size;
		let step = s * 1.05;
		let start_x = 40;
		let check_x = start_x + step * (hb.row.length + 1);
		let check_y = 40 + step;
		for (let pt of pointsToCheck) {
			if (doRectsCollide(pt.x, pt.y, 0, 0, check_x, check_y, s, s))
				stillTouchingInv = true;
		}
		if (!stillTouchingInv) inv_el._mob_toggle_lock = false;
	}
	if (!anyPointOverConsumeButtons) {
		hb._consume_lock = false;
	}
}
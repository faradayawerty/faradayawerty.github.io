const HB_COLS = COLORS_DEFAULT.ui.hotbar;
const _HB_POINTS = [];
for (let i = 0; i < 10; i++) _HB_POINTS.push({
	x: 0,
	y: 0
});
const _HB_TEXT_CACHE = {
	words: [],
	lastDesc: ""
};

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
		hovered_btn: null,
		_consume_lock: false
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

function _hotbar_drawButtonBg(ctx, x, y_off, s, type, hb, isMobile) {
	ctx.save();
	if (!isMobile && hb.hovered_btn === type) {
		ctx.fillStyle = HB_COLS.button_hover;
	}
	else {
		ctx.fillStyle = HB_COLS.button_bg;
	}
	ctx.globalAlpha = 0.8;
	ctx.fillRect(x, y_off, s, s);
	ctx.globalAlpha = 1.0;
	if (!isMobile && hb.hovered_btn === type) {
		ctx.strokeStyle = HB_COLS.button_outline;
		ctx.lineWidth = 2;
		ctx.strokeRect(x, y_off, s, s);
	}
	ctx.restore();
}

function _hotbar_drawIndicator(ctx, ix, iy, s, val, max, colorEmpty, colorFull,
	itemKey, type, hb, isMobile) {
	ctx.save();
	if (!isMobile && hb.hovered_btn === type) {
		ctx.fillStyle = HB_COLS.button_hover;
		ctx.globalAlpha = 0.8;
		ctx.fillRect(ix, iy, s, s);
	}
	ctx.globalAlpha = 0.6;
	ctx.fillStyle = colorEmpty;
	ctx.fillRect(ix, iy, s, s);
	let ratio = Math.max(0, Math.min(1, val / max));
	ctx.fillStyle = colorFull;
	let fillH = s * ratio;
	ctx.fillRect(ix, iy + (s - fillH), s, fillH);
	ctx.strokeStyle = (hb.hovered_btn === type) ? HB_COLS.button_outline :
		HB_COLS.indicator_outline;
	ctx.lineWidth = 2;
	ctx.strokeRect(ix, iy, s, s);
	let iconPadding = s * 0.2;
	let iconSize = s - iconPadding * 2;
	if (ITEMS_DATA[itemKey] && ITEMS_DATA[itemKey].render) {
		ctx.globalAlpha = 0.85;
		ITEMS_DATA[itemKey].render(ctx, ix + iconPadding, iy + iconPadding,
			iconSize, iconSize, 0.25 * hb.animation_state);
	}
	ctx.restore();
}

function hotbar_draw(hotbar_object, ctx) {
	let hb = hotbar_object.data;
	let g = hotbar_object.game;
	let s = hb.slot_size;
	let step = s * 1.05;
	let start_y = 40;
	let start_x = 40;
	if (g.mobile) {
		hb.slot_size = 97;
		s = hb.slot_size;
		step = s * 1.05;
	}
	for (let i = 0; i < hb.row.length; i++) {
		ctx.save();
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = (hb.iselected == i) ? HB_COLS.cell_selected : HB_COLS
			.cell_bg;
		ctx.fillRect(start_x + step * i, start_y, s, s);
		ctx.globalAlpha = 1.0;
		item_icon_draw(ctx, hb.row[i], start_x + step * i, start_y, s, s, hb
			.animation_state);
		ctx.restore();
	}
	let p = hb.attached_to_object.data;
	let isMobile = g.mobile;
	let btn_menu_x, btn_menu_y, btn_inv_x, btn_inv_y, btn_ach_x, btn_ach_y;
	let res_x_base, res_y_base, res_step_x, res_step_y;
	if (isMobile) {
		let col_res_x = start_x + step * hb.row.length;
		let col_sys_x = col_res_x + step;
		btn_menu_x = col_sys_x;
		btn_menu_y = start_y;
		btn_inv_x = col_sys_x;
		btn_inv_y = start_y + step;
		btn_ach_x = col_sys_x;
		btn_ach_y = start_y + step * 2;
		res_x_base = col_res_x;
		res_y_base = start_y;
		res_step_x = 0;
		res_step_y = step;
	}
	else {
		let offset_x = start_x + step * hb.row.length + (step * 0.5);
		btn_menu_x = offset_x;
		btn_menu_y = start_y;
		btn_inv_x = offset_x + step;
		btn_inv_y = start_y;
		btn_ach_x = offset_x + step * 2;
		btn_ach_y = start_y;
		res_x_base = offset_x + step * 3.5;
		res_y_base = start_y;
		res_step_x = step;
		res_step_y = 0;
	}
	_hotbar_drawIndicator(ctx, res_x_base, res_y_base, s, p.hunger, p
		.max_hunger, HB_COLS.resources.hunger_empty, HB_COLS.resources
		.hunger_full, ITEM_APPLE, 'food', hb, isMobile);
	_hotbar_drawIndicator(ctx, res_x_base + res_step_x, res_y_base + res_step_y,
		s, p.thirst, p.max_thirst, HB_COLS.resources.thirst_empty, HB_COLS
		.resources.thirst_full, ITEM_WATER, 'water', hb, isMobile);
	_hotbar_drawIndicator(ctx, res_x_base + res_step_x * 2, res_y_base +
		res_step_y * 2, s, p.health, p.max_health, HB_COLS.resources
		.health_empty, HB_COLS.resources.health_full, ITEM_HEALTH, 'health',
		hb, isMobile);
	if (hb.has_shield_button) {
		let sVal = 0,
			sMax = 100,
			sIcon = ITEM_SHIELD_GRAY,
			sColor = HB_COLS.resources.shield_default;
		if (p.shield_rainbow_health > 0) {
			sVal = p.shield_rainbow_health;
			sMax = p.shield_rainbow_health_max;
			sIcon = ITEM_SHIELD_RAINBOW;
			let anim = 0.025 * hb.animation_state;
			let r = Math.floor(Math.pow(Math.cos(anim) * 15, 2));
			let g_val = Math.floor(Math.pow(0.7 * (Math.cos(anim) + Math.sin(
				anim)) * 15, 2));
			let b = Math.floor(Math.pow(Math.sin(anim) * 15, 2));
			sColor = "rgb(" + r + "," + g_val + "," + b + ")";
		}
		else if (p.shield_shadow_health > 0) {
			sVal = p.shield_shadow_health;
			sMax = p.shield_shadow_health_max;
			sIcon = ITEM_SHADOW_SHIELD;
			sColor = "#330066";
		}
		else if (p.shield_anubis_health > 0) {
			sVal = p.shield_anubis_health;
			sMax = p.shield_anubis_health_max;
			sIcon = ITEM_ANUBIS_REGEN_SHIELD;
			sColor = "#ffcc00";
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
			sColor = HB_COLS.resources.shield_default;
		}
		else if (p.shield_pumpkin_health > 0) {
			sVal = p.shield_pumpkin_health;
			sMax = p.shield_pumpkin_health_max;
			sIcon = ITEM_PUMPKIN_SHIELD;
			sColor = "orange";
		}
		_hotbar_drawIndicator(ctx, res_x_base + res_step_x * 3, res_y_base +
			res_step_y * 3, s, sVal, sMax, HB_COLS.resources.shield_empty,
			sColor, sIcon, 'shield', hb, isMobile);
	}
	if (p.car_object) {
		let fuelVal = p.car_object.data.fuel;
		let fuelMax = p.car_object.data.max_fuel || 100;
		let fuelIndex = hb.has_shield_button ? 4 : 3;
		_hotbar_drawIndicator(ctx, res_x_base + res_step_x * fuelIndex,
			res_y_base + res_step_y * fuelIndex, s, fuelVal, fuelMax,
			"#333333", "gray", ITEM_FUEL, 'fuel', hb, isMobile);
	}
	_hotbar_drawButtonBg(ctx, btn_menu_x, btn_menu_y, s, 'menu', hb, isMobile);
	ctx.save();
	ctx.fillStyle = HB_COLS.button_outline;
	if (isMobile) {
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
	_hotbar_drawButtonBg(ctx, btn_inv_x, btn_inv_y, s, 'inv', hb, isMobile);
	let pad = s * 0.2;
	let bw = s - pad * 2,
		bh = s - pad * 2;
	let bx = btn_inv_x + pad,
		by = btn_inv_y + pad;
	ctx.save();
	ctx.fillStyle = HB_COLS.icons.inv_bag;
	ctx.fillRect(bx, by + bh * 0.2, bw, bh * 0.8);
	ctx.fillStyle = HB_COLS.icons.inv_flap;
	ctx.fillRect(bx, by + bh * 0.1, bw, bh * 0.4);
	ctx.strokeStyle = HB_COLS.icons.inv_flap;
	ctx.lineWidth = s * 0.05;
	ctx.beginPath();
	ctx.arc(bx + bw / 2, by + bh * 0.1, bw * 0.2, Math.PI, 0);
	ctx.stroke();
	ctx.fillStyle = HB_COLS.icons.inv_buckle;
	ctx.fillRect(bx + bw * 0.2, by + bh * 0.4, bw * 0.1, bh * 0.2);
	ctx.fillRect(bx + bw * 0.7, by + bh * 0.4, bw * 0.1, bh * 0.2);
	ctx.strokeStyle = "black";
	ctx.lineWidth = s * 0.02;
	ctx.strokeRect(bx, by + bh * 0.2, bw, bh * 0.8);
	ctx.restore();
	_hotbar_drawButtonBg(ctx, btn_ach_x, btn_ach_y, s, 'ach', hb, isMobile);
	let ax = btn_ach_x + s * 0.25,
		ay = btn_ach_y + s * 0.25;
	let aw = s * 0.5,
		ah = s * 0.5;
	ctx.save();
	ctx.fillStyle = HB_COLS.icons.ach_cup;
	ctx.beginPath();
	ctx.moveTo(ax, ay);
	ctx.lineTo(ax + aw, ay);
	ctx.lineTo(ax + aw * 0.8, ay + ah * 0.6);
	ctx.lineTo(ax + aw * 0.2, ay + ah * 0.6);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = HB_COLS.icons.ach_outline;
	ctx.lineWidth = s * 0.03;
	ctx.stroke();
	ctx.fillRect(ax + aw * 0.4, ay + ah * 0.6, aw * 0.2, ah * 0.3);
	ctx.fillRect(ax + aw * 0.2, ay + ah * 0.8, aw * 0.6, ah * 0.2);
	ctx.beginPath();
	ctx.arc(ax, ay + ah * 0.3, s * 0.1, 0, Math.PI * 2);
	ctx.arc(ax + aw, ay + ah * 0.3, s * 0.1, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
	if (!isMobile && hb.hovered_btn) {
		let lang = g.settings.language;
		let title = "";
		let description = "";
		if (hb.hovered_btn === 'menu') {
			title = (lang === "русский") ? "Меню" : "Menu";
			description = (lang === "русский") ?
				"Здесь можно сохранить или загрузить игру, изменить настройки." :
				"Here you can save or load the game and change settings.";
		}
		else if (hb.hovered_btn === 'inv') {
			title = (lang === "русский") ? "Инвентарь" : "Inventory";
			description = (lang === "русский") ?
				"Сюда попадают подобранные предметы. Нажмите на предмет, чтобы переместить или использовать его." :
				"All picked up items go here. Click an item to move it or use it.";
		}
		else if (hb.hovered_btn === 'ach') {
			title = (lang === "русский") ? "Задания" : "Tasks";
			description = (lang === "русский") ?
				"Ваш гайд в мир игры. Почаще поглядывайте сюда, чтобы не запутаться." :
				"Your guide to the game world. Take a look here if you ever feel lost.";
		}
		else if (hb.hovered_btn === 'food') {
			title = (lang === "русский") ? "Еда" : "Food";
			description = (lang === "русский") ?
				"Нажмите, чтобы съесть что-нибудь из инвентаря." :
				"Click to eat something from your inventory.";
		}
		else if (hb.hovered_btn === 'water') {
			title = (lang === "русский") ? "Вода" : "Water";
			description = (lang === "русский") ? "Нажмите, чтобы выпить воды." :
				"Click to drink water.";
		}
		else if (hb.hovered_btn === 'health') {
			title = (lang === "русский") ? "Здоровье" : "Health";
			description = (lang === "русский") ?
				"Нажмите, чтобы использовать аптечку." :
				"Click to use a medkit.";
		}
		else if (hb.hovered_btn === 'shield') {
			title = (lang === "русский") ? "Щит" : "Shield";
			description = (lang === "русский") ?
				"Нажмите, чтобы использовать щит." : "Click to use a shield.";
		}
		else if (hb.hovered_btn === 'fuel') {
			title = (lang === "русский") ? "Топливо" : "Fuel";
			description = (lang === "русский") ?
				"Нажмите, чтобы заправить машину." : "Click to refuel the car.";
		}
		if (title !== "") {
			ctx.save();
			let scale = get_scale();
			let mx = g.input.mouse.x / scale;
			let my = g.input.mouse.y / scale;
			let W = 500,
				H = 200,
				fontsize = 24;
			let screenW = window.innerWidth / scale;
			let screenH = window.innerHeight / scale;
			let x = mx + 20,
				y = my + 20;
			if (x + W > screenW) x -= W;
			if (y + H > screenH) y -= H;
			ctx.globalAlpha = 0.9;
			ctx.fillStyle = HB_COLS.tooltip_bg;
			ctx.strokeStyle = HB_COLS.tooltip_border;
			ctx.lineWidth = 2;
			ctx.fillRect(x, y, W, H);
			ctx.strokeRect(x, y, W, H);
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = HB_COLS.tooltip_title;
			ctx.font = `bold ${fontsize}px Arial`;
			ctx.fillText(title, x + 10, y + 30);
			ctx.fillStyle = HB_COLS.tooltip_text;
			ctx.font = `${fontsize - 4}px Arial`;
			if (_HB_TEXT_CACHE.lastDesc !== description) {
				_HB_TEXT_CACHE.lastDesc = description;
				_HB_TEXT_CACHE.words = description.split(' ');
			}
			let line = "",
				lineY = y + 70;
			for (let n = 0; n < _HB_TEXT_CACHE.words.length; n++) {
				let testLine = line + _HB_TEXT_CACHE.words[n] + " ";
				if (testLine.length > 35) {
					ctx.fillText(line, x + 10, lineY);
					line = _HB_TEXT_CACHE.words[n] + " ";
					lineY += fontsize;
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
	let g = hotbar_element.game;
	let input = g.input;
	let scale = get_scale();
	hb.animation_state += 0.02 * dt;
	if (hb.attached_to_object.data.ai_controlled) hotbar_element.shown = false;
	for (let i = 0; i < 9; i++) {
		if (isKeyDown(input, (i + 1).toString(), true)) hb.iselected = i;
	}
	if (isMouseWheelUp(input)) hb.iselected = (hb.iselected + 1) % 9;
	if (isMouseWheelDown(input)) hb.iselected = (hb.iselected - 1 + 9) % 9;
	hb.mouse_over = false;
	hb.hovered_btn = null;
	let pointsCount = 0;
	if (!isScreenTouched(input)) {
		_HB_POINTS[0].x = input.mouse.x / scale;
		_HB_POINTS[0].y = input.mouse.y / scale;
		pointsCount = 1;
	}
	else {
		pointsCount = Math.min(input.touch.length, 10);
		for (let i = 0; i < pointsCount; i++) {
			_HB_POINTS[i].x = input.touch[i].x / scale;
			_HB_POINTS[i].y = input.touch[i].y / scale;
		}
	}
	let inv_el = hb.attached_to_object.data.inventory_element;
	if (inv_el && !hb.has_shield_button) {
		let hasShieldInInv = inventory_has_item_from_list(inv_el, [ITEM_SHIELD,
			ITEM_SHIELD_GREEN, ITEM_SHIELD_RAINBOW, ITEM_SHADOW_SHIELD,
			ITEM_ANUBIS_REGEN_SHIELD, ITEM_PUMPKIN_SHIELD
		]) !== -1;
		if (hasShieldInInv) hb.has_shield_button = true;
	}
	let isMobile = g.mobile;
	let pcActionTriggered = false;
	if (!isMobile) {
		if (input.mouse.leftButtonPressed) hb.leftButtonClickable = true;
		else if (hb.leftButtonClickable) {
			pcActionTriggered = true;
			hb.leftButtonClickable = false;
		}
	}
	let anyPointOverConsumeButtons = false;
	let s = isMobile ? 97 : hb.slot_size;
	let step = s * 1.05;
	let start_y = 40;
	let start_x = 40;
	for (let pIdx = 0; pIdx < pointsCount; pIdx++) {
		let pt = _HB_POINTS[pIdx];
		for (let i = 0; i < hb.row.length; i++) {
			let sx = start_x + step * i;
			if ((isMobile || input.mouse.leftButtonPressed) && doRectsCollide(pt
					.x, pt.y, 0, 0, sx, start_y, s, s)) {
				hb.mouse_over = true;
				hb.iselected = i;
			}
		}
		let b_menu_x, b_menu_y, b_inv_x, b_inv_y, b_ach_x, b_ach_y, r_x, r_y,
			r_sx, r_sy;
		if (isMobile) {
			let col_res_x = start_x + step * hb.row.length;
			let col_sys_x = col_res_x + step;
			b_menu_x = col_sys_x;
			b_menu_y = start_y;
			b_inv_x = col_sys_x;
			b_inv_y = start_y + step;
			b_ach_x = col_sys_x;
			b_ach_y = start_y + step * 2;
			r_x = col_res_x;
			r_y = start_y;
			r_sx = 0;
			r_sy = step;
		}
		else {
			let offset_x = start_x + step * hb.row.length + (step * 0.5);
			b_menu_x = offset_x;
			b_menu_y = start_y;
			b_inv_x = offset_x + step;
			b_inv_y = start_y;
			b_ach_x = offset_x + step * 2;
			b_ach_y = start_y;
			r_x = offset_x + step * 3.5;
			r_y = start_y;
			r_sx = step;
			r_sy = 0;
		}
		if (doRectsCollide(pt.x, pt.y, 0, 0, b_menu_x, b_menu_y, s, s)) {
			hb.mouse_over = true;
			hb.hovered_btn = 'menu';
		}
		if (doRectsCollide(pt.x, pt.y, 0, 0, b_inv_x, b_inv_y, s, s)) {
			hb.mouse_over = true;
			hb.hovered_btn = 'inv';
		}
		if (doRectsCollide(pt.x, pt.y, 0, 0, b_ach_x, b_ach_y, s, s)) {
			hb.mouse_over = true;
			hb.hovered_btn = 'ach';
		}
		let overFood = doRectsCollide(pt.x, pt.y, 0, 0, r_x, r_y, s, s);
		let overWater = doRectsCollide(pt.x, pt.y, 0, 0, r_x + r_sx, r_y + r_sy,
			s, s);
		let overHealth = doRectsCollide(pt.x, pt.y, 0, 0, r_x + r_sx * 2, r_y +
			r_sy * 2, s, s);
		let overShield = hb.has_shield_button && doRectsCollide(pt.x, pt.y, 0,
			0, r_x + r_sx * 3, r_y + r_sy * 3, s, s);
		let fuelIndex = hb.has_shield_button ? 4 : 3;
		let overFuel = hb.attached_to_object.data.car_object && doRectsCollide(
			pt.x, pt.y, 0, 0, r_x + r_sx * fuelIndex, r_y + r_sy *
			fuelIndex, s, s);
		if (overFood) {
			hb.mouse_over = true;
			hb.hovered_btn = 'food';
		}
		if (overWater) {
			hb.mouse_over = true;
			hb.hovered_btn = 'water';
		}
		if (overHealth) {
			hb.mouse_over = true;
			hb.hovered_btn = 'health';
		}
		if (overShield) {
			hb.mouse_over = true;
			hb.hovered_btn = 'shield';
		}
		if (overFuel) {
			hb.mouse_over = true;
			hb.hovered_btn = 'fuel';
		}
		let isAction = isMobile ? isScreenTouched(input) : pcActionTriggered;
		if (isAction && doRectsCollide(pt.x, pt.y, 0, 0, b_menu_x, b_menu_y, s,
				s)) {
			if (isMobile) {
				if (!hb.did_want_menu) {
					g.want_menu = true;
					hb.did_want_menu = true;
				}
			}
			else {
				g.want_menu = true;
			}
		}
		else if (isMobile) {
			hb.did_want_menu = false;
		}
		if (isAction && doRectsCollide(pt.x, pt.y, 0, 0, b_inv_x, b_inv_y, s,
				s)) {
			if (inv_el && !inv_el._mob_toggle_lock) {
				let ash = g.gui_elements.find(e => e.name ==
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
				let ash = g.gui_elements.find(e => e.name ==
					"achievements shower");
				achievement_do(ach_el.data.achievements, "achievements", ash);
				ach_el.shown = true;
			}
		}
		if (isAction && (overHealth || overWater || overFood || overShield ||
				overFuel)) {
			anyPointOverConsumeButtons = true;
			if (!hb._consume_lock) {
				let player = hb.attached_to_object;
				let itm = -1;
				if (overFood) itm = inventory_has_item_from_list(inv_el,
					ITEMS_FOODS);
				else if (overWater) itm = inventory_has_item_from_list(inv_el,
					ITEMS_DRINKS);
				else if (overHealth) itm = inventory_has_item_from_list(inv_el,
					[ITEM_HEALTH_GREEN, ITEM_HEALTH]);
				else if (overShield) itm = inventory_has_item_from_list(inv_el,
					[ITEM_SHIELD, ITEM_SHIELD_GREEN, ITEM_SHIELD_RAINBOW,
						ITEM_SHADOW_SHIELD, ITEM_ANUBIS_REGEN_SHIELD,
						ITEM_PUMPKIN_SHIELD
					]);
				else if (overFuel) itm = inventory_has_item_from_list(inv_el, [
					ITEM_FUEL
				]);
				if (itm !== -1) player_item_consume(player, itm, true);
				hb._consume_lock = true;
			}
		}
	}
	if (!anyPointOverConsumeButtons) hb._consume_lock = false;
	if (inv_el && inv_el._mob_toggle_lock && isMobile) {
		let stillTouchingInv = false;
		for (let i = 0; i < pointsCount; i++) {
			let pt = _HB_POINTS[i];
			let check_x = 40 + step * (hb.row.length + 1);
			let check_y = 40 + step;
			if (doRectsCollide(pt.x, pt.y, 0, 0, check_x, check_y, s, s))
				stillTouchingInv = true;
		}
		if (!stillTouchingInv) inv_el._mob_toggle_lock = false;
	}
}
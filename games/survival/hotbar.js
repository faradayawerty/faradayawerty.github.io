
function hotbar_create(g, inv, attached_to_object = null) {
	let hb = {
		iselected: 0,
		row: inv.items[0],
		slot_size: 50,
		attached_to_object: attached_to_object,
		animation_state: 0,
		mouse_over: false
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
	let pointsToCheck = [];
	if (!isScreenTouched(input)) {
		pointsToCheck.push({
			x: input.mouse.x / scale,
			y: input.mouse.y / scale
		});
	} else {
		for (let t of input.touch) {
			pointsToCheck.push({
				x: t.x / scale,
				y: t.y / scale
			});
		}
	}

	for (let pt of pointsToCheck) {
    // 1. Логика выбора ячеек хотбара (оставляем почти как было)
    for (let i = 0; i < hb.row.length; i++) {
        let sx = 40 + (hb.slot_size * 1.05) * i;
        let sy = 40;
        if ((hotbar_element.game.mobile || input.mouse.leftButtonPressed) &&
            doRectsCollide(pt.x, pt.y, 0, 0, sx, sy, hb.slot_size, hb.slot_size)) {
            hb.mouse_over = true;
            hb.iselected = i;
        }
    }

    // 2. Логика кнопок (Инвентарь, Ачивки, Меню)
    if (hotbar_element.game.mobile) {
        let step = hb.slot_size * 1.05;
        let x_inv = 60 + step * hb.row.length;
        let x_ach = x_inv + step;
        let x_menu = x_ach + step;

        // Кнопка ИНВЕНТАРЯ
        if (doRectsCollide(pt.x, pt.y, 0, 0, x_inv, 40, hb.slot_size, hb.slot_size)) {
            let inv_el = hb.attached_to_object.data.inventory_element;
            if (inv_el && !inv_el._mob_toggle_lock) {
                inv_el.shown = !inv_el.shown;
                inv_el._mob_toggle_lock = true;
            }
        }

        // Кнопка АЧИВОК (Добавляем проверку!)
        if (doRectsCollide(pt.x, pt.y, 0, 0, x_ach, 40, hb.slot_size, hb.slot_size)) {
            let ach_el = hb.attached_to_object.data.achievements_element;
            if (ach_el) {
                ach_el.shown = true;
            }
        }

        // Кнопка МЕНЮ (Добавляем проверку!)
        if (doRectsCollide(pt.x, pt.y, 0, 0, x_menu, 40, hb.slot_size, hb.slot_size)) {
            hotbar_element.game.want_menu = true;
        }
    }
}

	let inv_el = hb.attached_to_object.data.inventory_element;
	if (inv_el && inv_el._mob_toggle_lock) {
		let stillTouching = false;
		let step = hb.slot_size * 1.05;
		let x_inv = 60 + step * hb.row.length;
		for (let pt of pointsToCheck) {
			if (doRectsCollide(pt.x, pt.y, 0, 0, x_inv, 40, hb.slot_size, hb
					.slot_size)) stillTouching = true;
		}
		if (!stillTouching) inv_el._mob_toggle_lock = false;
	}
}

function hotbar_draw(hotbar_object, ctx) {
	let hb = hotbar_object.data;
	for (let i = 0; i < hb.row.length; i++) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = (hb.iselected == i) ? "cyan" : "blue";
		ctx.fillRect(40 + (hb.slot_size * 1.05) * i, 40, hb.slot_size, hb
			.slot_size);
		ctx.globalAlpha = 1.0;
		item_icon_draw(ctx, hb.row[i], 40 + (hb.slot_size * 1.05) * i, 40, hb
			.slot_size, hb.slot_size, hb.animation_state);
	}
	if (hotbar_object.game.mobile) {
		let s = hb.slot_size;
		let step = s * 1.05;
		let y = 40;
		const drawButtonBg = (x) => {
			ctx.fillStyle = "#4477ff";
			ctx.globalAlpha = 0.9;
			ctx.fillRect(x, y, s, s);
			ctx.globalAlpha = 1.0;
		};
		let x_inv = 60 + step * hb.row.length;
		drawButtonBg(x_inv);
		let pad = s * 0.2;
		let bw = s - pad * 2;
		let bh = s - pad * 2;
		let bx = x_inv + pad;
		let by = y + pad;
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
		let x_ach = x_inv + step;
		drawButtonBg(x_ach);
		let ax = x_ach + s * 0.25;
		let ay = y + s * 0.25;
		let aw = s * 0.5;
		let ah = s * 0.5;
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
		let x_menu = x_ach + step;
		drawButtonBg(x_menu);
		ctx.fillStyle = "white";
		let barW = s * 0.5;
		let barH = s * 0.08;
		let barX = x_menu + (s - barW) / 2;
		ctx.fillRect(barX, y + s * 0.3, barW, barH);
		ctx.fillRect(barX, y + s * 0.48, barW, barH);
		ctx.fillRect(barX, y + s * 0.66, barW, barH);
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fillRect(barX, y + s * 0.3 + barH, barW, barH * 0.3);
	}
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
	} else if (hotbar_element.data.mouse_over) {
		return 0;
	}
	return hotbar_element.data.row[hotbar_element.data.iselected];
}


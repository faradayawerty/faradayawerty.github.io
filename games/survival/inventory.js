function inventory_create(g, attached_to_object = null) {
	let inv = {
		slot_size: 80,
		cross_size: 40,
		iselected: -1,
		jselected: -1,
		items: [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		imove: -1,
		jmove: -1,
		attached_to_object: attached_to_object,
		animation_state: 0,
		_touch_lock: false
	};
	return game_gui_element_create(g, "inventory", inv, inventory_update,
		inventory_draw, inventory_destroy);
}

function inventory_destroy(inventory_element) {
	inventory_element.data.attached_to_object = null;
	inventory_element.destroyed = true;
}

function inventory_update(inventory_element, dt) {
	if (inventory_element.data.attached_to_object.data.ai_controlled)
		inventory_element.shown = false;
	if (!inventory_element.shown) return;
	let inv = inventory_element.data;
	let game = inventory_element.game;
	let input = game.input;
	let scale = get_scale();
	let player_object = inv.attached_to_object;
	if (inv.was_left_down === undefined) inv.was_left_down = false;
	if (inv.was_right_down === undefined) inv.was_right_down = false;
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = false;
	let is_clicked_right = false;
	if (game.mobile) {
		let freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
			if (inv.active_touch_id !== freeTouch.id) {
				inv.active_touch_id = freeTouch.id;
				is_clicked = true;
			}
		} else {
			inv.active_touch_id = null;
		}
	} else {
		let current_left = input.mouse.leftButtonPressed;
		let current_right = input.mouse.rightButtonPressed;
		if (current_left && !inv.was_left_down) is_clicked = true;
		if (current_right && !inv.was_right_down) is_clicked_right = true;
		inv.was_left_down = current_left;
		inv.was_right_down = current_right;
	}
	inv.last_active_mx = mx;
	inv.last_active_my = my;
	inv.animation_state += 0.02 * dt;
	let btnW = 120,
		btnH = 50,
		gap = 20;
	let startY = 60 + (inv.slot_size * 1.05) * inv.items.length;
	let startX = 40;
	if (!game.mobile && is_clicked_right) {
		if (inv.imove !== -1 && inv.jmove !== -1) {
			inventory_drop_item(inventory_element, inv.imove, inv.jmove);
			inv.imove = -1;
			inv.jmove = -1;
			return;
		}
	}
	if (game.mobile && inv.imove !== -1 && is_clicked) {
		if (doRectsCollide(mx, my, 0, 0, startX, startY, btnW, btnH)) {
			let id = inv.items[inv.imove][inv.jmove];
			if (id > 0) {
				player_item_consume(player_object, id, false);
				if (inv.imove !== -1 && inv.items[inv.imove][inv.jmove] === 0) {
					inv.imove = -1;
					inv.jmove = -1;
				}
			}
			return;
		}
		if (doRectsCollide(mx, my, 0, 0, startX + btnW + gap, startY, btnW,
				btnH)) {
			inventory_drop_item(inventory_element, inv.imove, inv.jmove);
			inv.imove = -1;
			inv.jmove = -1;
			return;
		}
	}
	let cross_x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	if (is_clicked && doRectsCollide(mx, my, 0, 0, cross_x, 40, inv.cross_size,
			inv.cross_size)) {
		inventory_element.shown = false;
		inv.imove = -1;
		inv.jmove = -1;
		return;
	}
	let slot_hit = false;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = 40 + (inv.slot_size * 1.05) * i;
			if (doRectsCollide(mx, my, 0, 0, sx, sy, inv.slot_size, inv
					.slot_size)) {
				slot_hit = true;
				inv.iselected = i;
				inv.jselected = j;
				if (is_clicked) {
					if (inv.imove === -1) {
						if (inv.items[i][j] > 0) {
							inv.imove = i;
							inv.jmove = j;
						}
					} else {
						if (inv.imove === i && inv.jmove === j) {
							inv.imove = -1;
							inv.jmove = -1;
						} else {
							let temp = inv.items[i][j];
							inv.items[i][j] = inv.items[inv.imove][inv.jmove];
							inv.items[inv.imove][inv.jmove] = temp;
							inv.imove = -1;
							inv.jmove = -1;
						}
					}
				}
				if (!game.mobile && is_clicked_right && inv.items[i][j] > 0) {
					inventory_drop_item(inventory_element, i, j);
					if (inv.imove === i && inv.jmove === j) {
						inv.imove = -1;
						inv.jmove = -1;
					}
				}
			}
		}
	}
	if (!slot_hit) {
		inv.iselected = -1;
		inv.jselected = -1;
	}
	if (isKeyDown(input, 'q', true) || isKeyDown(input, 'й', true)) {
		let dI = (inv.imove !== -1) ? inv.imove : inv.iselected;
		let dJ = (inv.jmove !== -1) ? inv.jmove : inv.jselected;
		if (dI !== -1 && dJ !== -1 && inv.items[dI][dJ] > 0) {
			inventory_drop_item(inventory_element, dI, dJ);
			if (dI === inv.imove) {
				inv.imove = -1;
				inv.jmove = -1;
			}
		}
	}
}

function inventory_draw(inventory_element, ctx) {
	if (inventory_element.game.want_hide_inventory || !inventory_element.shown)
		return;
	let inv = inventory_element.data;
	let game = inventory_element.game;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = 40 + (inv.slot_size * 1.05) * i;
			ctx.globalAlpha = 0.9;
			if (inv.imove === i && inv.jmove === j)
				ctx.fillStyle = "orange";
			else if (inv.iselected === i && inv.jselected === j)
				ctx.fillStyle = "cyan";
			else
				ctx.fillStyle = "blue";
			ctx.fillRect(sx, sy, inv.slot_size, inv.slot_size);
			ctx.globalAlpha = 1.0;
			if (game.mobile || !(inv.imove === i && inv.jmove === j)) {
				item_icon_draw(ctx, inv.items[i][j], sx, sy, inv.slot_size, inv
					.slot_size, inv.animation_state);
			}
		}
	}
	if (game.mobile && inv.imove !== -1) {
		let btnW = 120,
			btnH = 50,
			gap = 20;
		let startY = 60 + (inv.slot_size * 1.05) * inv.items.length;
		let startX = 40;
		const drawStyledBtn = (x, y, w, h, text, color) => {
			ctx.fillStyle = color;
			ctx.beginPath();
			if (ctx.roundRect) ctx.roundRect(x, y, w, h, 8);
			else ctx.fillRect(x, y, w, h);
			ctx.fill();
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = "white";
			ctx.font = "bold 18px Arial";
			ctx.fillText(text, x + w / 2, y + h / 2 + 6);
		};
		drawStyledBtn(startX, startY, btnW, btnH, "USE", "#228822");
		drawStyledBtn(startX + btnW + gap, startY, btnW, btnH, "DROP",
			"#882222");
	}
	let cross_x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	let cross_y = 40;
	let cs = inv.cross_size;
	ctx.fillStyle = "#444444";
	ctx.fillRect(cross_x, cross_y, cs, cs);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.strokeRect(cross_x, cross_y, cs, cs);
	ctx.beginPath();
	ctx.moveTo(cross_x + cs * 0.25, cross_y + cs * 0.25);
	ctx.lineTo(cross_x + cs * 0.75, cross_y + cs * 0.75);
	ctx.moveTo(cross_x + cs * 0.75, cross_y + cs * 0.25);
	ctx.lineTo(cross_x + cs * 0.25, cross_y + cs * 0.75);
	ctx.stroke();
	if (!game.mobile && inv.imove > -1 && inv.jmove > -1) {
		let curX = inv.last_active_mx || 0;
		let curY = inv.last_active_my || 0;
		let drag_size = inv.slot_size * 0.8;
		ctx.globalAlpha = 0.8;
		item_icon_draw(ctx, inv.items[inv.imove][inv.jmove], curX - drag_size /
			2, curY - drag_size / 2, drag_size, drag_size, inv
			.animation_state);
		ctx.globalAlpha = 1.0;
	}
	if (inv.iselected !== -1 && inv.jselected !== -1) {
		let item_id = inv.items[inv.iselected][inv.jselected];
		if (item_id > 0 && (game.mobile || inv.imove === -1)) {
			let tooltipX = inv.last_active_mx + 20;
			let tooltipY = inv.last_active_my + 20;
			if (game.mobile) {
				tooltipX += 80;
				tooltipY += 80;
			}
			inventory_draw_item_popup(ctx, game, item_id, tooltipX, tooltipY);
		}
	}
}

function inventory_drop_item(inventory_element, i, j, death = false) {
	if (!inventory_element.data.attached_to_object || !inventory_element.data
		.attached_to_object.data.body)
		return;
	if (i < 0 || j < 0)
		return;
	if (inventory_element.data.items[i][j] == 0)
		return;
	item_create(inventory_element.game, inventory_element.data.items[i][j],
		inventory_element.data.attached_to_object.data.body.position.x +
		100 * Math.cos(2 * Math.PI * Math.random()),
		inventory_element.data.attached_to_object.data.body.position.y +
		100 * Math.sin(2 * Math.PI * Math.random()), !death, !death);
	inventory_element.data.items[i][j] = 0;
}

function inventory_drop_all_items(inventory_element) {
	for (let i = 0; i < inventory_element.data.items.length; i++)
		for (let j = 0; j < inventory_element.data.items[i].length; j++)
			inventory_drop_item(inventory_element, i, j, true);
}

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
		for (let i = 0; i < hb.row.length; i++) {
			let sx = 40 + (hb.slot_size * 1.05) * i;
			let sy = 40;
			if ((hotbar_element.game.mobile || input.mouse.leftButtonPressed) &&
				doRectsCollide(pt.x, pt.y, 0, 0, sx, sy, hb.slot_size, hb
					.slot_size)) {
				hb.mouse_over = true;
				hb.iselected = i;
			}
		}
		if (hotbar_element.game.mobile) {
			let step = hb.slot_size * 1.05;
			let x_inv = 60 + step * hb.row.length;
			if (doRectsCollide(pt.x, pt.y, 0, 0, x_inv, 40, hb.slot_size, hb
					.slot_size)) {
				let inv_el = hb.attached_to_object.data.inventory_element;
				if (inv_el && !inv_el._mob_toggle_lock) {
					inv_el.shown = !inv_el.shown;
					inv_el._mob_toggle_lock = true;
				}
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

function inventory_has_item_from_list(inventory_element, item_ids) {
	for (let i = item_ids.length - 1; i >= 0; i--) {
		if (inventory_has_item(inventory_element, item_ids[i]))
			return item_ids[i];
	}
	return -1;
}

function inventory_has_item(inventory_element, id) {
	for (let i = 0; i < inventory_element.data.items.length; i++) {
		for (let j = 0; j < inventory_element.data.items[i].length; j++)
			if (inventory_element.data.items[i][j] == id)
				return true;
	}
	return false;
}

function inventory_count_item(inventory_element, id) {
	let ans = 0;
	for (let i = 0; i < inventory_element.data.items.length; i++) {
		for (let j = 0; j < inventory_element.data.items[i].length; j++)
			if (inventory_element.data.items[i][j] == id)
				ans++;
	}
	return ans;
}

function inventory_clear_item(inventory_element, id, count, item_i = -1,
	item_j = -1) {
	if (item_i == inventory_element.data.imove && item_j == inventory_element
		.data.jmove) {
		inventory_element.data.imove = -1;
		inventory_element.data.jmove = -1;
	}
	if (item_i > -1 && item_j > -1 && inventory_element.data.items[item_i][
			item_j
		] == id) {
		inventory_element.data.items[item_i][item_j] = 0;
		count--;
	}
	for (let i = 0; i < inventory_element.data.items.length && count > 0; i++)
		for (let j = 0; j < inventory_element.data.items[i].length && count >
			0; j++)
			if (inventory_element.data.items[i][j] == id) {
				inventory_element.data.items[i][j] = 0;
				count--;
			}
}

function inventory_draw_item_popup(ctx, game, item_id, x, y) {
	let data = ITEM_DATA[item_id] || {
		name: "???",
		desc: "Unknown item",
		name_rus: "???",
		desc_rus: "Неизвестный предмет"
	};
	let isRus = game.settings.language === "русский";
	let name = isRus ? data.name_rus : data.name;
	let desc = isRus ? data.desc_rus : data.desc;
	let W = 350;
	let H = 150;
	let fontsize = 16;
	let scale = get_scale();
	if (x + W > window.innerWidth / scale) x -= W;
	if (y + H > window.innerHeight / scale) y -= H;
	ctx.save();
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "black";
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 2;
	ctx.fillRect(x, y, W, H);
	ctx.strokeRect(x, y, W, H);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "yellow";
	ctx.font = `bold ${fontsize + 2}px Arial`;
	ctx.fillText(name, x + 10, y + 25);
	ctx.fillStyle = "white";
	ctx.font = `${fontsize}px Arial`;
	let words = desc.split(' ');
	let line = "";
	let lineY = y + 50;
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + " ";
		if (testLine.length > 30) {
			ctx.fillText(line, x + 10, lineY);
			line = words[n] + " ";
			lineY += fontsize * 1.2;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, x + 10, lineY);
	ctx.restore();
}
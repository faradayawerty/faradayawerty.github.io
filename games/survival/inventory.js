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
		_touch_lock: false,
		close_button: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
	};
	return game_gui_element_create(g, "inventory", inv, inventory_update,
		inventory_draw, inventory_destroy);
}

function inventory_destroy(inventory_element) {
	inventory_element.data.attached_to_object = null;
	inventory_element.destroyed = true;
}

function inventory_draw(inventory_element, ctx) {
	if (inventory_element.game.want_hide_inventory || !inventory_element.shown)
		return;
	let inv = inventory_element.data;
	let game = inventory_element.game;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = 120 + (inv.slot_size * 1.05) * i;
			ctx.save();
			ctx.globalAlpha = 0.9;
			if (inv.imove === i && inv.jmove === j)
				ctx.fillStyle = "orange";
			else if (inv.iselected === i && inv.jselected === j)
				ctx.fillStyle = "cyan";
			else
				ctx.fillStyle = "blue";
			ctx.fillRect(sx, sy, inv.slot_size, inv.slot_size);
			ctx.restore();
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
		let startY = 120 + (inv.slot_size * 1.05) * inv.items.length + 20;
		let startX = 40;
		const drawStyledBtn = (x, y, w, h, text, color) => {
			ctx.save();
			ctx.fillStyle = color;
			if (ctx.roundRect) {
				ctx.beginPath();
				ctx.roundRect(x, y, w, h, 8);
				ctx.fill();
			} else {
				ctx.fillRect(x, y, w, h);
			}
			ctx.strokeStyle = "white";
			ctx.lineWidth = 2;
			ctx.strokeRect(x, y, w, h);
			ctx.fillStyle = "white";
			ctx.font = "bold 18px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(text, x + w / 2, y + h / 2);
			ctx.restore();
		};
		drawStyledBtn(startX, startY, btnW, btnH, "USE", "#228822");
		drawStyledBtn(startX + btnW + gap, startY, btnW, btnH, "DROP",
			"#882222");
	}
	inventory_close_button_draw(inventory_element, ctx);
	if (!game.mobile && inv.imove > -1 && inv.jmove > -1) {
		let curX = inv.last_active_mx || 0;
		let curY = inv.last_active_my || 0;
		let drag_size = inv.slot_size * 0.8;
		ctx.save();
		ctx.globalAlpha = 0.8;
		item_icon_draw(ctx, inv.items[inv.imove][inv.jmove], curX - drag_size /
			2, curY - drag_size / 2, drag_size, drag_size, inv
			.animation_state);
		ctx.restore();
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

function inventory_close_button_update(inventory_element, mx, my, is_clicked) {
	let inv = inventory_element.data;
	let btn = inv.close_button;
	btn.x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	btn.y = 40;
	btn.is_hovered = doRectsCollide(mx, my, 0, 0, btn.x, btn.y, btn.size, btn
		.size);
	if (btn.is_hovered && is_clicked) {
		inventory_element.shown = false;
		inv.imove = -1;
		inv.jmove = -1;
		return true;
	}
	return false;
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
	if (inv._cross_held === undefined) inv._cross_held = false;
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = false;
	let is_clicked_right = false;
	let freeTouch = null;
	if (game.mobile) {
		freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
			if (inv.active_touch_id !== freeTouch.id) {
				inv.active_touch_id = freeTouch.id;
				is_clicked = true;
			}
		} else {
			if (inv._cross_held) {
				inv._cross_held = false;
				inventory_element.shown = false;
				inv.imove = -1;
				inv.jmove = -1;
				return;
			}
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
	if (inventory_closing_cross_update(inventory_element, mx, my, is_clicked,
			freeTouch)) {
		return;
	}
	if (inv._cross_held) return;
	if (!game.mobile && is_clicked_right) {
		if (inv.imove !== -1 && inv.jmove !== -1) {
			inventory_drop_item(inventory_element, inv.imove, inv.jmove);
			inv.imove = -1;
			inv.jmove = -1;
			return;
		}
	}
	let btnW = 120,
		btnH = 50,
		gap = 20;
	let startY = 120 + (inv.slot_size * 1.05) * inv.items.length + 20;
	let startX = 40;
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
	let slot_hit = false;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = 120 + (inv.slot_size * 1.05) * i;
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

function inventory_close_button_draw(inventory_element, ctx) {
	let inv = inventory_element.data;
	if (!inv.close_button) return;
	let btn = inv.close_button;
	let cs = btn.size;
	ctx.save();
	ctx.fillStyle = btn.is_hovered ? "#882222" : "#444444";
	ctx.fillRect(btn.x, btn.y, cs, cs);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.strokeRect(btn.x, btn.y, cs, cs);
	ctx.beginPath();
	ctx.strokeStyle = btn.is_hovered ? "#ffaaaa" : "white";
	ctx.moveTo(btn.x + cs * 0.25, btn.y + cs * 0.25);
	ctx.lineTo(btn.x + cs * 0.75, btn.y + cs * 0.75);
	ctx.moveTo(btn.x + cs * 0.75, btn.y + cs * 0.25);
	ctx.lineTo(btn.x + cs * 0.25, btn.y + cs * 0.75);
	ctx.stroke();
	ctx.restore();
}

function inventory_closing_cross_update(inventory_element, mx, my, is_clicked,
	freeTouch) {
	let inv = inventory_element.data;
	let game = inventory_element.game;
	if (!inv.close_button) inv.close_button = {
		x: 0,
		y: 0,
		size: inv.cross_size || 40,
		is_hovered: false
	};
	let btn = inv.close_button;
	btn.x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	btn.y = 120;
	btn.size = inv.cross_size;
	btn.is_hovered = doRectsCollide(mx, my, 0, 0, btn.x, btn.y, btn.size, btn
		.size);
	if (game.mobile) {
		if (freeTouch && btn.is_hovered) {
			inv._cross_held = true;
		} else if (freeTouch && !btn.is_hovered) {
			inv._cross_held = false;
		}
	} else {
		if (is_clicked && btn.is_hovered) {
			inventory_element.shown = false;
			inv.imove = -1;
			inv.jmove = -1;
			return true;
		}
	}
	return false;
}
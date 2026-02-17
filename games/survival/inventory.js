const INV_COLS = COLORS_DEFAULT.ui.inventory;
let INVENTORY_X = 40;
let INVENTORY_Y = 40;

function inventory_create(g, attached_to_object = null) {
	let inv = {
		slot_size: 85,
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
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		imove: -1,
		jmove: -1,
		attached_to_object: attached_to_object,
		animation_state: 0,
		_touch_lock: false,
		_cross_pc_held: false,
		close_button: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		},
		sort_button: {
			x: 0,
			y: 0,
			size: 40,
			is_hovered: false
		}
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
	if (game.mobile) {
		inv.slot_size = 110;
	}
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = INVENTORY_Y + (inv.slot_size * 1.05) * i;
			ctx.save();
			ctx.globalAlpha = 0.9;
			if (inv.imove === i && inv.jmove === j)
				ctx.fillStyle = INV_COLS.cell_move;
			else if (inv.iselected === i && inv.jselected === j)
				ctx.fillStyle = INV_COLS.cell_selected;
			else
				ctx.fillStyle = INV_COLS.cell_bg;
			ctx.fillRect(sx, sy, inv.slot_size, inv.slot_size);
			if (i === 0) {
				ctx.strokeStyle = INV_COLS.cell_hotbar_outline;
				ctx.lineWidth = inv.slot_size * 0.0125;
				ctx.strokeRect(sx, sy, inv.slot_size, inv.slot_size);
			}
			ctx.restore();
			if (game.mobile || !(inv.imove === i && inv.jmove === j)) {
				item_icon_draw(ctx, inv.items[i][j], sx, sy, inv.slot_size, inv
					.slot_size, inv.animation_state);
			}
		}
	}
	if (game.mobile && inv.imove !== -1) {
		let btnW = 180,
			btnH = 50,
			gap = 20;
		let startY = INVENTORY_Y + (inv.slot_size * 1.05) * inv.items.length +
			20;
		let startX = 40;
		const drawStyledBtn = (x, y, w, h, text, color) => {
			ctx.save();
			ctx.fillStyle = color;
			if (ctx.roundRect) {
				ctx.beginPath();
				ctx.roundRect(x, y, w, h, 8);
				ctx.fill();
			}
			else {
				ctx.fillRect(x, y, w, h);
			}
			ctx.strokeStyle = INV_COLS.btn_outline;
			ctx.lineWidth = 2;
			ctx.strokeRect(x, y, w, h);
			ctx.fillStyle = INV_COLS.btn_text;
			ctx.font = "bold 18px Arial";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(text, x + w / 2, y + h / 2);
			ctx.restore();
		};
		let isRus = game.settings.language === "русский";
		let useText = isRus ? "ИСПОЛЬЗОВАТЬ" : "USE";
		let dropText = isRus ? "ВЫБРОСИТЬ" : "DROP";
		drawStyledBtn(startX, startY, btnW, btnH, useText, INV_COLS.btn_use);
		drawStyledBtn(startX + btnW + gap, startY, btnW, btnH, dropText,
			INV_COLS.btn_drop);
	}
	inventory_close_button_draw(inventory_element, ctx);
	inventory_sort_button_draw(inventory_element, ctx);
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
	let data = ITEMS_DATA[item_id] || ITEMS_DATA.default;
	let isRus = game.settings.language === "русский";
	let name = isRus ? data.name_rus : data.name;
	let desc = isRus ? data.desc_rus : data.desc;
	let W = 750;
	let H = 400;
	let fontsize = 32;
	let scale = get_scale();
	let screenW = window.innerWidth / scale;
	let screenH = window.innerHeight / scale;
	if (x + W > screenW) x -= W;
	if (y + H > screenH) y -= H;
	if (x < 0) x = 10;
	if (y < 0) y = 10;
	ctx.save();
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = INV_COLS.popup_bg;
	ctx.strokeStyle = INV_COLS.popup_border;
	ctx.lineWidth = 2;
	ctx.fillRect(x, y, W, H);
	ctx.strokeRect(x, y, W, H);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = INV_COLS.popup_title;
	ctx.font = `bold ${fontsize - 2}px Arial`;
	ctx.fillText(name, x + 10, y + 30);
	ctx.fillStyle = INV_COLS.popup_text;
	ctx.font = `${fontsize}px Arial`;
	let words = desc.split(' ');
	let line = "";
	let lineY = y + 75;
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + " ";
		if (testLine.length > 30) {
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

function inventory_get_item_weight(id) {
	if (id === 0) return 999;
	if (ITEMS_GUNS.includes(id) || ITEMS_MELEE.includes(id)) return 1;
	if (ITEMS_BOSSIFIERS.includes(id)) return 2;
	if (id === ITEM_SHIELD || id === ITEM_SHIELD_GREEN || id ===
		ITEM_SHIELD_RAINBOW ||
		id === ITEM_SHIELD_GRAY || id === ITEM_SHADOW_SHIELD || id ===
		ITEM_ANUBIS_REGEN_SHIELD) return 3;
	if (id === ITEM_HEALTH || id === ITEM_HEALTH_GREEN) return 4;
	if (ITEMS_FOODS.includes(id)) return 5;
	if (ITEMS_DRINKS.includes(id)) return 6;
	if (id === ITEM_FUEL) return 7;
	if (ITEMS_AMMOS.includes(id)) return 1000;
	return 10;
}

function inventory_sort(inventory_element) {
	let inv = inventory_element.data;
	let all_slots = [];
	let group_counts = {
		health: 0,
		food: 0,
		drink: 0
	};
	let item_counts = {};
	let original_order_counter = 0;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let id = inv.items[i][j];
			if (id !== 0) {
				let is_weapon = ITEMS_GUNS.includes(id) || ITEMS_MELEE.includes(
					id);
				let is_health = (id === ITEM_HEALTH || id ===
					ITEM_HEALTH_GREEN);
				let is_food = ITEMS_FOODS.includes(id);
				let is_drink = ITEMS_DRINKS.includes(id);
				let is_shield = (id === ITEM_SHIELD || id ===
					ITEM_SHIELD_GREEN || id === ITEM_SHIELD_RAINBOW ||
					id === ITEM_SHIELD_GRAY || id === ITEM_SHADOW_SHIELD ||
					id === ITEM_ANUBIS_REGEN_SHIELD);
				let can_add = true;
				if (is_health) {
					if (group_counts.health >= 6) can_add = false;
					else group_counts.health++;
				}
				else if (is_food) {
					if (group_counts.food >= 6) can_add = false;
					else group_counts.food++;
				}
				else if (is_drink) {
					if (group_counts.drink >= 6) can_add = false;
					else group_counts.drink++;
				}
				else {
					if (!item_counts[id]) item_counts[id] = 0;
					if (is_weapon) {
						if (item_counts[id] >= 1) can_add = false;
						else item_counts[id]++;
					}
					else if (is_shield) {
						if (item_counts[id] >= 3) can_add = false;
						else item_counts[id]++;
					}
					else {
						if (item_counts[id] >= 6) can_add = false;
						else item_counts[id]++;
					}
				}
				if (can_add) {
					all_slots.push({
						id: id,
						original_index: original_order_counter++,
						is_weapon: is_weapon
					});
				}
				else {
					if (inv.attached_to_object && inv.attached_to_object.data
						.body) {
						item_create(inventory_element.game, id,
							inv.attached_to_object.data.body.position.x +
							100 * Math.cos(2 * Math.PI * Math.random()),
							inv.attached_to_object.data.body.position.y +
							100 * Math.sin(2 * Math.PI * Math.random()),
							true, true);
					}
				}
			}
		}
	}
	let total_capacity = inv.items.length * inv.items[0].length;
	while (all_slots.length < total_capacity) {
		all_slots.push({
			id: 0,
			original_index: original_order_counter++,
			is_weapon: false
		});
	}
	all_slots.sort((a, b) => {
		let wa = inventory_get_item_weight(a.id);
		let wb = inventory_get_item_weight(b.id);
		if (wa !== wb) return wa - wb;
		if (a.is_weapon && b.is_weapon) {
			return a.original_index - b.original_index;
		}
		if (wa === 2 && wb === 2) {
			let idxA = ITEMS_BOSSIFIERS.indexOf(a.id);
			let idxB = ITEMS_BOSSIFIERS.indexOf(b.id);
			if (idxA !== idxB) return idxB - idxA;
		}
		if (a.id !== b.id) return a.id - b.id;
		return a.original_index - b.original_index;
	});
	let idx = 0;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			inv.items[i][j] = all_slots[idx].id;
			idx++;
		}
	}
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
	if (inv._cross_pc_held === undefined) inv._cross_pc_held = false;
	if (inv._use_pressed === undefined) inv._use_pressed = false;
	if (inv._drop_pressed === undefined) inv._drop_pressed = false;
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = false;
	let is_clicked_right = false;
	let freeTouch = null;
	if (game.mobile) {
		INVENTORY_Y = 120;
		freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
			if (inv.active_touch_id !== freeTouch.id) {
				inv.active_touch_id = freeTouch.id;
				is_clicked = true;
			}
		}
		else {
			if (inv._cross_held) {
				inv._cross_held = false;
				inventory_element.shown = false;
				inv.imove = -1;
				inv.jmove = -1;
				inv.iselected = -1;
				inv.jselected = -1;
				return;
			}
			if (inv._use_pressed) {
				inv._use_pressed = false;
				if (inv.imove !== -1 && inv.jmove !== -1) {
					let id = inv.items[inv.imove][inv.jmove];
					if (id > 0) {
						player_item_consume(player_object, id, false);
						inv.imove = -1;
						inv.jmove = -1;
						inv.iselected = -1;
						inv.jselected = -1;
					}
				}
			}
			if (inv._drop_pressed) {
				inv._drop_pressed = false;
				if (inv.imove !== -1 && inv.jmove !== -1) {
					inventory_drop_item(inventory_element, inv.imove, inv
						.jmove);
					inv.imove = -1;
					inv.jmove = -1;
					inv.iselected = -1;
					inv.jselected = -1;
				}
			}
			inv.active_touch_id = null;
		}
	}
	else {
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
	if (inventory_sort_button_update(inventory_element, mx, my, is_clicked)) {
		return;
	}
	if (inv._cross_held || inv._cross_pc_held) return;
	if (!game.mobile && is_clicked_right) {
		if (inv.imove !== -1 && inv.jmove !== -1) {
			inventory_drop_item(inventory_element, inv.imove, inv.jmove);
			inv.imove = -1;
			inv.jmove = -1;
			inv.iselected = -1;
			inv.jselected = -1;
			return;
		}
	}
	let btnW = 180,
		btnH = 50,
		gap = 20;
	let startY = INVENTORY_Y + (inv.slot_size * 1.05) * inv.items.length + 20;
	let startX = 40;
	if (game.mobile && inv.imove !== -1) {
		if (freeTouch) {
			if (doRectsCollide(mx, my, 0, 0, startX, startY, btnW, btnH)) {
				inv._use_pressed = true;
				inv._drop_pressed = false;
			}
			else if (doRectsCollide(mx, my, 0, 0, startX + btnW + gap, startY,
					btnW, btnH)) {
				inv._drop_pressed = true;
				inv._use_pressed = false;
			}
			else {
				inv._use_pressed = false;
				inv._drop_pressed = false;
			}
		}
	}
	let slot_hit = false;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = INVENTORY_Y + (inv.slot_size * 1.05) * i;
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
					}
					else {
						if (inv.imove === i && inv.jmove === j) {
							inv.imove = -1;
							inv.jmove = -1;
							inv.iselected = -1;
							inv.jselected = -1;
						}
						else {
							let temp = inv.items[i][j];
							inv.items[i][j] = inv.items[inv.imove][inv.jmove];
							inv.items[inv.imove][inv.jmove] = temp;
							inv.imove = -1;
							inv.jmove = -1;
							inv.iselected = -1;
							inv.jselected = -1;
						}
					}
				}
				if (!game.mobile && is_clicked_right && inv.items[i][j] > 0) {
					inventory_drop_item(inventory_element, i, j);
					if (inv.imove === i && inv.jmove === j) {
						inv.imove = -1;
						inv.jmove = -1;
						inv.iselected = -1;
						inv.jselected = -1;
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
				inv.iselected = -1;
				inv.jselected = -1;
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
	ctx.fillStyle = btn.is_hovered ? INV_COLS.close_hover : INV_COLS.close_bg;
	ctx.fillRect(btn.x, btn.y, cs, cs);
	ctx.strokeStyle = INV_COLS.close_icon;
	ctx.lineWidth = 2;
	ctx.strokeRect(btn.x, btn.y, cs, cs);
	ctx.beginPath();
	ctx.strokeStyle = btn.is_hovered ? INV_COLS.close_icon_hover : INV_COLS
		.close_icon;
	ctx.moveTo(btn.x + cs * 0.25, btn.y + cs * 0.25);
	ctx.lineTo(btn.x + cs * 0.75, btn.y + cs * 0.75);
	ctx.moveTo(btn.x + cs * 0.75, btn.y + cs * 0.25);
	ctx.lineTo(btn.x + cs * 0.25, btn.y + cs * 0.75);
	ctx.stroke();
	ctx.restore();
}

function inventory_sort_button_draw(inventory_element, ctx) {
	let inv = inventory_element.data;
	if (!inv.sort_button) return;
	let btn = inv.sort_button;
	let cs = btn.size;
	ctx.save();
	ctx.fillStyle = btn.is_hovered ? INV_COLS.close_hover : INV_COLS.close_bg;
	ctx.fillRect(btn.x, btn.y, cs, cs);
	ctx.strokeStyle = INV_COLS.close_icon;
	ctx.lineWidth = 2;
	ctx.strokeRect(btn.x, btn.y, cs, cs);
	ctx.beginPath();
	ctx.strokeStyle = btn.is_hovered ? INV_COLS.close_icon_hover : INV_COLS
		.close_icon;
	ctx.moveTo(btn.x + cs * 0.2, btn.y + cs * 0.3);
	ctx.lineTo(btn.x + cs * 0.8, btn.y + cs * 0.3);
	ctx.moveTo(btn.x + cs * 0.2, btn.y + cs * 0.5);
	ctx.lineTo(btn.x + cs * 0.7, btn.y + cs * 0.5);
	ctx.moveTo(btn.x + cs * 0.2, btn.y + cs * 0.7);
	ctx.lineTo(btn.x + cs * 0.5, btn.y + cs * 0.7);
	ctx.stroke();
	ctx.restore();
}

function inventory_sort_button_update(inventory_element, mx, my, is_clicked) {
	let inv = inventory_element.data;
	if (!inv.sort_button) inv.sort_button = {
		x: 0,
		y: 0,
		size: inv.cross_size || 40,
		is_hovered: false
	};
	let btn = inv.sort_button;
	btn.x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	btn.y = INVENTORY_Y + btn.size + 10;
	btn.is_hovered = doRectsCollide(mx, my, 0, 0, btn.x, btn.y, btn.size, btn
		.size);
	if (btn.is_hovered && is_clicked) {
		inventory_sort(inventory_element);
		return true;
	}
	return false;
}

function inventory_closing_cross_update(inventory_element, mx, my, is_clicked,
	freeTouch) {
	let inv = inventory_element.data;
	let game = inventory_element.game;
	let input = game.input;
	if (!inv.close_button) inv.close_button = {
		x: 0,
		y: 0,
		size: inv.cross_size || 40,
		is_hovered: false
	};
	let btn = inv.close_button;
	btn.x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	btn.y = INVENTORY_Y;
	btn.size = inv.cross_size;
	btn.is_hovered = doRectsCollide(mx, my, 0, 0, btn.x, btn.y, btn.size, btn
		.size);
	if (game.mobile) {
		if (freeTouch && btn.is_hovered) {
			inv._cross_held = true;
		}
		else if (freeTouch && !btn.is_hovered) {
			inv._cross_held = false;
		}
	}
	else {
		if (input.mouse.leftButtonPressed && btn.is_hovered) {
			inv._cross_pc_held = true;
		}
		if (!input.mouse.leftButtonPressed && inv._cross_pc_held) {
			inv._cross_pc_held = false;
			if (btn.is_hovered) {
				inventory_element.shown = false;
				inv.imove = -1;
				inv.jmove = -1;
				inv.iselected = -1;
				inv.jselected = -1;
				return true;
			}
		}
	}
	return false;
}
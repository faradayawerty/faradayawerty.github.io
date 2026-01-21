// --- ИНВЕНТАРЬ ---

function inventory_create(g, attached_to_object = null) {
	let inv = {
		slot_size: 80,
		cross_size: 40, // Размер кнопки закрытия
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
		_touch_lock: false // Вспомогательный флаг для фиксации одного клика по тачу
	};
	return game_gui_element_create(g, "inventory", inv, inventory_update, inventory_draw, inventory_destroy);
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
	let input = inventory_element.game.input;
	let scale = get_scale();

	// 1. База для ПК
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = isMouseLeftButtonPressed(input);
	let is_clicked_right = isMouseRightButtonPressed(input);
	let is_released = false;

	// 2. ЛОГИКА ТАЧА (Исправленная)
	if (isScreenTouched(input)) {
		// Ищем палец, который НЕ джойстик
		let freeTouch = null;
		for (let t of input.touch) {
			if (t.id !== input.joystick.left.id && t.id !== input.joystick.right.id) {
				freeTouch = t;
				break;
			}
		}

		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;

			// Если это НОВЫЙ id (палец только что коснулся или сменился)
			if (inv.active_touch_id !== freeTouch.id) {
				inv.active_touch_id = freeTouch.id;
				is_clicked = true; // Считаем это нажатием
				inv._touch_lock = true;
			} else {
				// Палец тот же самый, удерживаем
				is_clicked = false;
			}
		} else {
			// Если свободных пальцев больше нет, но раньше был захвачен id
			if (inv.active_touch_id !== null) {
				is_released = true;
				inv.active_touch_id = null;
				inv._touch_lock = false;
			}
		}
	} else {
		// Тачей вообще нет
		if (inv.active_touch_id !== null) is_released = true;
		inv.active_touch_id = null;
		inv._touch_lock = false;
	}

	inv.last_active_mx = mx;
	inv.last_active_my = my;

	// --- КНОПКА ЗАКРЫТИЯ ---
	let cross_x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	let cross_y = 40;
	if (is_clicked && doRectsCollide(mx, my, 0, 0, cross_x, cross_y, inv.cross_size, inv.cross_size)) {
		inventory_element.shown = false;
		inv.imove = -1;
		inv.jmove = -1;
		inv.active_touch_id = null;
		return;
	}

	inv.animation_state += 0.02 * dt;

	let slot_selected = false;
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			let sx = 40 + (inv.slot_size * 1.05) * j;
			let sy = 40 + (inv.slot_size * 1.05) * i;

			if (doRectsCollide(mx, my, 0, 0, sx, sy, inv.slot_size, inv.slot_size)) {
				slot_selected = true;
				inv.iselected = i;
				inv.jselected = j;

				if (is_clicked) {
					if (inv.imove < 0 && inv.jmove < 0) {
						if (inv.items[i][j] > 0) {
							inv.imove = i;
							inv.jmove = j;
						}
					} else {
						// Обмен
						let temp = inv.items[i][j];
						inv.items[i][j] = inv.items[inv.imove][inv.jmove];
						inv.items[inv.imove][inv.jmove] = temp;
						inv.imove = -1;
						inv.jmove = -1;
					}
				}

				if (is_released && inv.imove >= 0) {
					let temp = inv.items[i][j];
					inv.items[i][j] = inv.items[inv.imove][inv.jmove];
					inv.items[inv.imove][inv.jmove] = temp;
					inv.imove = -1;
					inv.jmove = -1;
				}
			}
		}
	}

	// Выброс
	if ((is_clicked_right || is_released || (inventory_element.game.mobile && is_clicked)) && !slot_selected) {
		if (inv.imove !== -1 && inv.jmove !== -1) {
			inventory_drop_item(inventory_element, inv.imove, inv.jmove);
		}
		inv.imove = -1;
		inv.jmove = -1;
	}

	if (!slot_selected) {
		inv.iselected = -1;
		inv.jselected = -1;
	}

	// Хоткей Q
	if (isKeyDown(input, 'q', true) || isKeyDown(input, 'й', true)) {
		let dropI = (inv.imove !== -1) ? inv.imove : inv.iselected;
		let dropJ = (inv.jmove !== -1) ? inv.jmove : inv.jselected;
		if (dropI !== -1 && dropJ !== -1) {
			inventory_drop_item(inventory_element, dropI, dropJ);
			if (dropI === inv.imove) {
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
	let scale = get_scale();

	// 1. Отрисовка слотов
	for (let i = 0; i < inv.items.length; i++) {
		for (let j = 0; j < inv.items[i].length; j++) {
			ctx.globalAlpha = 0.9;

			if (inv.imove == i && inv.jmove == j)
				ctx.fillStyle = "orange";
			else if (inv.iselected == i && inv.jselected == j)
				ctx.fillStyle = "cyan";
			else
				ctx.fillStyle = "blue";

			ctx.fillRect(40 + (inv.slot_size * 1.05) * j, 40 + (inv.slot_size * 1.05) * i, inv.slot_size, inv.slot_size);
			ctx.globalAlpha = 1.0;

			if (!(inv.imove === i && inv.jmove === j)) {
				item_icon_draw(ctx, inv.items[i][j], 40 + (inv.slot_size * 1.05) * j, 40 + (inv.slot_size * 1.05) * i, inv.slot_size, inv.slot_size, inv.animation_state);
			}
		}
	}

	// 2. Отрисовка кнопки закрытия
	let cross_x = 40 + (inv.slot_size * 1.05) * inv.items[0].length + 15;
	let cross_y = 40;
	let cs = inv.cross_size;

	if (inventory_element.game.mobile) {
		ctx.fillStyle = "#444444";
		ctx.fillRect(cross_x, cross_y, cs, cs);
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.strokeRect(cross_x, cross_y, cs, cs);

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.moveTo(cross_x + cs * 0.25, cross_y + cs * 0.25);
		ctx.lineTo(cross_x + cs * 0.75, cross_y + cs * 0.75);
		ctx.moveTo(cross_x + cs * 0.75, cross_y + cs * 0.25);
		ctx.lineTo(cross_x + cs * 0.25, cross_y + cs * 0.75);
		ctx.stroke();
	}

	// 3. Предмет в руках (тянется за ПРАВИЛЬНЫМИ координатами)
	if (inv.imove > -1 && inv.jmove > -1) {
		let curX = inv.last_active_mx || 0;
		let curY = inv.last_active_my || 0;

		let drag_size = inv.slot_size * 0.8;
		ctx.globalAlpha = 0.8;
		item_icon_draw(ctx, inv.items[inv.imove][inv.jmove], curX - drag_size / 2, curY - drag_size / 2, drag_size, drag_size, inv.animation_state);
		ctx.globalAlpha = 1.0;
	}
}


function inventory_drop_item(inventory_element, i, j, death = false) {
	if (!inventory_element.data.attached_to_object || !inventory_element.data.attached_to_object.data.body)
		return;
	if (i < 0 || j < 0)
		return;
	if (inventory_element.data.items[i][j] == 0)
		return;
	item_create(inventory_element.game, inventory_element.data.items[i][j],
		inventory_element.data.attached_to_object.data.body.position.x + 100 * Math.cos(2 * Math.PI * Math.random()),
		inventory_element.data.attached_to_object.data.body.position.y + 100 * Math.sin(2 * Math.PI * Math.random()), !death, !death);
	inventory_element.data.items[i][j] = 0;
}

function inventory_drop_all_items(inventory_element) {
	for (let i = 0; i < inventory_element.data.items.length; i++)
		for (let j = 0; j < inventory_element.data.items[i].length; j++)
			inventory_drop_item(inventory_element, i, j, true);
}

// --- ХОТБАР ---

function hotbar_create(g, inv, attached_to_object = null) {
	let hb = {
		iselected: 0,
		row: inv.items[0],
		slot_size: 50,
		attached_to_object: attached_to_object,
		animation_state: 0,
		mouse_over: false
	};
	let ihotbar = game_gui_element_create(g, "hotbar", hb, hotbar_update, hotbar_draw, hotbar_destroy);
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

	// Клавиши 1-9 (оставляем как есть)
	for (let i = 0; i < 9; i++) {
		if (isKeyDown(input, (i + 1).toString(), true)) hb.iselected = i;
	}

	if (isMouseWheelUp(input)) hb.iselected = (hb.iselected + 1) % 9;
	if (isMouseWheelDown(input)) hb.iselected = (hb.iselected - 1 + 9) % 9;

	hb.mouse_over = false;

	// --- ИСПРАВЛЕНИЕ МУЛЬТИТАЧА ---
	// Создаем список координат для проверки (мышь + все пальцы)
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

	// Проверяем каждую точку (палец или мышь) на попадание в слоты
	for (let pt of pointsToCheck) {
		for (let i = 0; i < hb.row.length; i++) {
			let sx = 40 + (hb.slot_size * 1.05) * i;
			let sy = 40;
			if ((hotbar_element.game.mobile || input.mouse.leftButtonPressed) && doRectsCollide(pt.x, pt.y, 0, 0, sx, sy, hb.slot_size, hb.slot_size)) {
				hb.mouse_over = true;
				hb.iselected = i; // Выбираем слот
			}
		}

		// Проверка мобильных кнопок (Инвентарь, Ачивки, Меню)
		if (hotbar_element.game.mobile) {
			let step = hb.slot_size * 1.05;
			let x_inv = 60 + step * hb.row.length;

			// Проверка кнопки сумки
			if (doRectsCollide(pt.x, pt.y, 0, 0, x_inv, 40, hb.slot_size, hb.slot_size)) {
				let inv_el = hb.attached_to_object.data.inventory_element;
				if (inv_el && !inv_el._mob_toggle_lock) {
					inv_el.shown = !inv_el.shown;
					inv_el._mob_toggle_lock = true;
				}
			}
		}
	}

	// Сброс лока переключения, если ни один палец не касается кнопок
	let inv_el = hb.attached_to_object.data.inventory_element;
	if (inv_el && inv_el._mob_toggle_lock) {
		let stillTouching = false;
		let step = hb.slot_size * 1.05;
		let x_inv = 60 + step * hb.row.length;
		for (let pt of pointsToCheck) {
			if (doRectsCollide(pt.x, pt.y, 0, 0, x_inv, 40, hb.slot_size, hb.slot_size)) stillTouching = true;
		}
		if (!stillTouching) inv_el._mob_toggle_lock = false;
	}
}

function hotbar_draw(hotbar_object, ctx) {
	let hb = hotbar_object.data;
	for (let i = 0; i < hb.row.length; i++) {
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = (hb.iselected == i) ? "cyan" : "blue";
		ctx.fillRect(40 + (hb.slot_size * 1.05) * i, 40, hb.slot_size, hb.slot_size);
		ctx.globalAlpha = 1.0;
		item_icon_draw(ctx, hb.row[i], 40 + (hb.slot_size * 1.05) * i, 40, hb.slot_size, hb.slot_size, hb.animation_state);
	}

	if (hotbar_object.game.mobile) {
		let s = hb.slot_size;
		let step = s * 1.05;
		let y = 40;

		// Функция-помощник для отрисовки фона кнопки (внутри hotbar_draw)
		const drawButtonBg = (x) => {
			ctx.fillStyle = "#4477ff";
			ctx.globalAlpha = 0.9;
			ctx.fillRect(x, y, s, s);
			ctx.globalAlpha = 1.0;
		};

		// --- 1. КНОПКА ИНВЕНТАРЯ (Портфель) ---
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

		// --- 2. КНОПКА АЧИВОК (Кубок) ---
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

		// --- 3. КНОПКА МЕНЮ (Три полоски / Бургер) ---
		let x_menu = x_ach + step;
		drawButtonBg(x_menu);

		ctx.fillStyle = "white";
		let barW = s * 0.5; // Длина полоски
		let barH = s * 0.08; // Толщина полоски
		let barX = x_menu + (s - barW) / 2; // Центрируем по горизонтали

		// Рисуем три полоски
		ctx.fillRect(barX, y + s * 0.3, barW, barH);
		ctx.fillRect(barX, y + s * 0.48, barW, barH);
		ctx.fillRect(barX, y + s * 0.66, barW, barH);

		// Добавим легкую тень для объема
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fillRect(barX, y + s * 0.3 + barH, barW, barH * 0.3);
	}
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function hotbar_get_selected_item(hotbar_element) {
	// На телефоне если инвентарь открыт, мы НЕ должны использовать предметы из хотбара кликом в мире
	let inv_el = hotbar_element.data.attached_to_object.data.inventory_element;
	if (inv_el.game.mobile && inv_el && inv_el.shown) return 0;

	if (!hotbar_element.shown) {
		if (hotbar_element.data.attached_to_object.name == "player" && !hotbar_element.data.attached_to_object.destroyed) {
			let inv = hotbar_element.data.attached_to_object.data.inventory_element.data;
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

function inventory_clear_item(inventory_element, id, count, item_i = -1, item_j = -1) {
	if (item_i == inventory_element.data.imove && item_j == inventory_element.data.jmove) {
		inventory_element.data.imove = -1;
		inventory_element.data.jmove = -1;
	}

	if (item_i > -1 && item_j > -1 && inventory_element.data.items[item_i][item_j] == id) {
		inventory_element.data.items[item_i][item_j] = 0;
		count--;
	}

	for (let i = 0; i < inventory_element.data.items.length && count > 0; i++)
		for (let j = 0; j < inventory_element.data.items[i].length && count > 0; j++)
			if (inventory_element.data.items[i][j] == id) {
				inventory_element.data.items[i][j] = 0;
				count--;
			}
}

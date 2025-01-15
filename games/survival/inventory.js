
function inventory_create(g, attached_to_object=null) {
	let inv = {
		slot_size: 80,
		iselected: 0,
		jselected: 0,
		items: [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		],
		imove: -1,
		jmove: -1,
		attached_to_object: attached_to_object,
		animation_state: 0
	};
	return game_gui_element_create(g, "inventory", inv, inventory_update, inventory_draw, inventory_destroy);
}

function inventory_destroy(inventory_element) {
	inventory_element.data.attached_to_object = null;
	inventory_element.destroyed = true;
}

function inventory_update(inventory_element, dt) {

	if(inventory_element.data.attached_to_object.data.ai_controlled)
		inventory_element.shown = false;

	let inv = inventory_element.data;

	inv.animation_state += 0.02 * dt;

	for(let i = 0; i < inv.items.length; i++)
		for(let j = 0; j < inv.items[i].length; j++)
			if(doRectsCollide(inventory_element.game.input.mouse.x / window.innerWidth * 1800, inventory_element.game.input.mouse.y / window.innerWidth * 1800, 0, 0,
				40 + (inv.slot_size * 1.05) * j, 40 + (inv.slot_size * 1.05) * i, inv.slot_size, inv.slot_size)) {
				inv.iselected = i;
				inv.jselected = j;
				if(isMouseLeftButtonPressed(inventory_element.game.input))
					if(inv.imove < 0 && inv.jmove < 0) {
						inv.imove = inv.iselected;
						inv.jmove = inv.jselected;
					} else {
						let temp = inv.items[inv.iselected][inv.jselected];
						inv.items[inv.iselected][inv.jselected] = inv.items[inv.imove][inv.jmove];
						inv.items[inv.imove][inv.jmove] = temp;
						inv.imove = -1;
						inv.jmove = -1;
					}
			}

	if(isKeyDown(inventory_element.game.input, 's', true) && inv.iselected < inv.items.length - 1)
		inv.iselected++;
	if(isKeyDown(inventory_element.game.input, 'w', true) && inv.iselected > 0)
		inv.iselected--;
	if(isKeyDown(inventory_element.game.input, 'd', true) && inv.jselected < inv.items[inv.iselected].length - 1)
		inv.jselected++;
	if(isKeyDown(inventory_element.game.input, 'a', true) && inv.jselected > 0)
		inv.jselected--;
	if(isKeyDown(inventory_element.game.input, 'Enter', true))
		if(inv.imove < 0 && inv.jmove < 0) {
			inv.imove = inv.iselected;
			inv.jmove = inv.jselected;
		} else {
			let temp = inv.items[inv.iselected][inv.jselected];
			inv.items[inv.iselected][inv.jselected] = inv.items[inv.imove][inv.jmove];
			inv.items[inv.imove][inv.jmove] = temp;
			inv.imove = -1;
			inv.jmove = -1;
		}
	if(isKeyDown(inventory_element.game.input, 'q', true))
		inventory_drop_item(inventory_element, inv.iselected, inv.jselected);
}

function inventory_draw(inventory_element, ctx) {
	if(inventory_element.game.want_hide_inventory)
		return;
	let inv = inventory_element.data;
	for(let i = 0; i < inv.items.length; i++) {
		for(let j = 0; j < inv.items[i].length; j++) {
			ctx.globalAlpha = 0.9;
			if(inv.imove == i && inv.jmove == j && inv.iselected == i && inv.jselected == j)
				ctx.fillStyle = "yellow";
			else if(inv.iselected == i && inv.jselected == j)
				ctx.fillStyle = "cyan";
			else if(inv.imove == i && inv.jmove == j)
				ctx.fillStyle = "orange";
			else if(i == 0)
				ctx.fillStyle = "blue";
			else
				ctx.fillStyle = "blue";
			ctx.fillRect(40 + (inv.slot_size * 1.05) * j, 40 + (inv.slot_size * 1.05) * i, inv.slot_size, inv.slot_size);
			ctx.globalAlpha = 1.0;
			item_icon_draw(ctx, inv.items[i][j], 40 + (inv.slot_size * 1.05) * j, 40 + (inv.slot_size * 1.05) * i, inv.slot_size, inv.slot_size, inv.animation_state);
		}
	}
}

function inventory_drop_item(inventory_element, i, j, death=false) {
	if(!inventory_element.data.attached_to_object || !inventory_element.data.attached_to_object.data.body)
		return;
	if(inventory_element.data.items[i][j] == 0)
		return;
	item_create(inventory_element.game, inventory_element.data.items[i][j],
		inventory_element.data.attached_to_object.data.body.position.x + 100 * Math.cos(2 * Math.PI * Math.random()),
		inventory_element.data.attached_to_object.data.body.position.y + 100 * Math.sin(2 * Math.PI * Math.random()), !death, !death);
	inventory_element.data.items[i][j] = 0;
}

function inventory_drop_all_items(inventory_element) {
	for(let i = 0; i < inventory_element.data.items.length; i++)
		for(let j = 0; j < inventory_element.data.items[i].length; j++)
			inventory_drop_item(inventory_element, i, j, true);
}

function hotbar_create(g, inv, attached_to_object=null) {
	let hb = {
		iselected: 0,
		row: inv.items[0],
		slot_size: 30,
		attached_to_object: attached_to_object,
		animation_state: 0
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
	hotbar_element.data.animation_state += 0.02 * dt;
	if(hotbar_element.data.attached_to_object.data.ai_controlled)
		hotbar_element.shown = false;
	let hb = hotbar_element.data;
	if(isKeyDown(hotbar_element.game.input, '1', true))
		hb.iselected = 0;
	if(isKeyDown(hotbar_element.game.input, '2', true))
		hb.iselected = 1;
	if(isKeyDown(hotbar_element.game.input, '3', true))
		hb.iselected = 2;
	if(isKeyDown(hotbar_element.game.input, '4', true))
		hb.iselected = 3;
	if(isKeyDown(hotbar_element.game.input, '5', true))
		hb.iselected = 4;
	if(isKeyDown(hotbar_element.game.input, '6', true))
		hb.iselected = 5;
	if(isKeyDown(hotbar_element.game.input, '7', true))
		hb.iselected = 6;
	if(isKeyDown(hotbar_element.game.input, '8', true))
		hb.iselected = 7;
	if(isKeyDown(hotbar_element.game.input, '9', true))
		hb.iselected = 8;
	if(isMouseWheelUp(hotbar_element.game.input))
		hb.iselected = Math.min(8, hb.iselected + 1);
	if(isMouseWheelDown(hotbar_element.game.input))
		hb.iselected = Math.max(0, hb.iselected - 1);
}

function hotbar_draw(hotbar_object, ctx) {
	let hb = hotbar_object.data;
	for(let i = 0; i < hb.row.length; i++) {
		ctx.globalAlpha = 0.9;
		if(hb.iselected == i)
			ctx.fillStyle = "cyan";
		else
			ctx.fillStyle = "blue";
		ctx.fillRect(40 + (hb.slot_size * 1.05) * i, 40, hb.slot_size, hb.slot_size);
		ctx.globalAlpha = 1.0;
		item_icon_draw(ctx, hb.row[i], 40 + (hb.slot_size * 1.05) * i, 40, hb.slot_size, hb.slot_size, hb.animation_state);
	}
}

function hotbar_get_selected_item(hotbar_element) {
	return hotbar_element.data.row[hotbar_element.data.iselected];
}

function inventory_has_item_from_list(inventory_element, item_ids) {
	for(let i = item_ids.length - 1; i >= 0; i--) {
		if(inventory_has_item(inventory_element, item_ids[i]))
			return item_ids[i];
	}
	return -1;
}

function inventory_has_item(inventory_element, id) {
	for(let i = 0; i < inventory_element.data.items.length; i++) {
		for(let j = 0; j < inventory_element.data.items[i].length; j++)
			if(inventory_element.data.items[i][j] == id)
				return true;
	}
	return false;
}

function inventory_count_item(inventory_element, id) {
	let ans = 0;
	for(let i = 0; i < inventory_element.data.items.length; i++) {
		for(let j = 0; j < inventory_element.data.items[i].length; j++)
			if(inventory_element.data.items[i][j] == id)
				ans++;
	}
	return ans;
}

function inventory_clear_item(inventory_element, id, count, item_i=-1, item_j=-1) {

	if(item_i > -1 && item_j > -1 && inventory_element.data.items[item_i][item_j] == id) {
		inventory_element.data.items[item_i][item_j] = 0
		count--;
	}

	for(let i = 0; i < inventory_element.data.items.length && count > 0; i++)
		for(let j = 0; j < inventory_element.data.items[i].length && count > 0; j++)
			if(inventory_element.data.items[i][j] == id) {
				inventory_element.data.items[i][j] = 0;
				count--;
			}
}


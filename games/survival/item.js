
let ITEM_GUN = 1;
let ITEM_AMMO = 2;
let ITEM_HEALTH = 3;

function item_create(g, id_, x_, y_) {
	if(id_ == 0)
		return;
	let item = {
		id: id_,
		body: Matter.Bodies.rectangle(x_, y_, 40, 40, {
			inertia: Infinity,
			mass: 1000.5
		})
	};
	Matter.Composite.add(g.engine.world, item.body);
	return game_object_create(g, "item", item, item_update, item_draw, item_destroy);
}

function item_destroy(item_object) {
	let g = item_object.game;
	Matter.Composite.remove(g.engine.world, item_object.data.body);
	item_object.destroyed = true;
}

function item_update(item_object, dt) {}

function item_draw(item_object, ctx) {
	let item = item_object.data;
	item_icon_draw(ctx, item.id, item.body.position.x - 20, item.body.position.y - 20, 40, 40);
}

function item_icon_draw(ctx, id, x, y, w, h) {
	if(id == ITEM_GUN) {
		ctx.fillStyle = "black";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_AMMO) {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = "yellow";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "orange";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
		}
	} else if(id == ITEM_HEALTH) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "red";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
	}
}

function item_pickup(inventory_element, item_object) {
	if(!item_object)
		return false;
	let inv = inventory_element.data;
	let item = item_object.data;
	for(let i = 0; i < inv.items.length; i++)
		for(let j = 0; j < inv.items[i].length; j++)
			if(inv.items[i][j] == 0) {
				inv.items[i][j] = item.id;
				item_destroy(item_object);
				return true;
			}
	return false;
}


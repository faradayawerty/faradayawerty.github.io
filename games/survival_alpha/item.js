
let ITEM_GUN = 1;
let ITEM_AMMO = 2;
let ITEM_HEALTH = 3;
let ITEM_FUEL = 4;
let ITEM_MONEY = 5;
let ITEM_WATER = 6;
let ITEM_CANNED_MEAT = 7;

function item_create(g, id_, x_, y_) {
	let items = g.objects.filter((obj) => obj.name == "item");
	if(items.length > 50)
		for(let i = 0; i < 20 * Math.random() + 1; i++)
			items[i].destroy(items[i]);
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
	if(id == 0) {
		return
	} else if(id == ITEM_GUN) {
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
			ctx.lineWidth = 0.5;
			ctx.strokeStyle = "orange";
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(id == ITEM_HEALTH) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "red";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
	} else if(id == ITEM_FUEL) {
		ctx.fillStyle = "#ff1111";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = "black";
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "yellow";
		ctx.fillRect(x + w * 0.55, y + h * 0.15, w * 0.2, h * 0.05);
		drawLine(ctx, x + w * 0.3, y + h * 0.3, x + w * 0.7, y + h * 0.7, "#cc1111", 0.05 * w);
		drawLine(ctx, x + w * 0.7, y + h * 0.3, x + w * 0.3, y + h * 0.7, "#cc1111", 0.05 * w);
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.45, y + h * 0.45, w * 0.1, h * 0.1);
	} else if(id == ITEM_MONEY) {
		ctx.fillStyle = "#11ff55";
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.strokeStyle = "#007733";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		drawCircle(ctx, x + w * 0.5, y + h * 0.5, w * 0.1, "#007733", "#007733", w * 0.025);
	} else if(id == ITEM_CANNED_MEAT) {
		ctx.fillStyle = "gray";
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.fillStyle = "brown";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_WATER) {
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = "#1177dd";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else {
		ctx.fillStyle = "#000000";
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.fillStyle = "#ff00ff";
		ctx.fillRect(x + 0.5 * w, y + 0.1 * h, 0.4 * w, 0.4 * h);
		ctx.fillRect(x + 0.1 * w, y + 0.5 * h, 0.4 * w, 0.4 * h);
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


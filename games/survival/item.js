
let ITEM_GUN = 1;
let ITEM_SHOTGUN = 15;
let ITEM_MINIGUN = 16;
let ITEM_PLASMA_LAUNCHER = 17;
let ITEM_RED_PISTOLS = 20;
let ITEM_RED_SHOTGUN = 21;
let ITEM_SWORD = 23;
let ITEM_GREEN_GUN = 24;
let ITEM_ROCKET_LAUNCHER = 26;

let ITEM_AMMO = 2;
let ITEM_PLASMA = 18;
let ITEM_RED_PLASMA = 19;
let ITEM_GREEN_AMMO = 25;
let ITEM_ROCKET = 27;

let ITEM_HEALTH = 3;
let ITEM_FUEL = 4;
let ITEM_MONEY = 5;
let ITEM_SHIELD = 22;
let ITEM_HEALTH_GREEN = 28;

let ITEM_CANNED_MEAT = 7;
let ITEM_ORANGE = 8;
let ITEM_APPLE = 9;
let ITEM_CHERRIES = 10;
let ITEM_CHICKEN_LEG = 13;
let ITEM_CHOCOLATE = 14;

let ITEM_WATER = 6;
let ITEM_COLA = 11;
let ITEM_MILK = 12;

ITEMS_AMMOS = [
	ITEM_AMMO,
	ITEM_PLASMA,
	ITEM_RED_PLASMA,
	ITEM_ROCKET
];

ITEMS_GUNS = [
	ITEM_GUN,
	ITEM_SHOTGUN,
	ITEM_MINIGUN,
	ITEM_PLASMA_LAUNCHER,
	ITEM_RED_PISTOLS,
	ITEM_RED_SHOTGUN,
	ITEM_GREEN_GUN,
	ITEM_ROCKET_LAUNCHER
];

ITEMS_FOODS = [
	ITEM_CANNED_MEAT,
	ITEM_CANNED_MEAT,
	ITEM_CANNED_MEAT,
	ITEM_CANNED_MEAT,
	ITEM_CANNED_MEAT
];

ITEMS_DRINKS = [
	ITEM_WATER,
	ITEM_WATER,
	ITEM_WATER,
	ITEM_WATER,
	ITEM_MILK,
	ITEM_MILK,
	ITEM_COLA,
	ITEM_COLA
];

// TODO fix item limit
function item_create(g, id_, x_, y_, dropped=false) {
	let items = g.objects.filter((obj) => obj.name == "item");
	if(items.length > 50) {
		for(let i = 0; i < 20 * Math.random() + 1; i++) {
			items[i].destroy(items[i]);
		}
	}
	if(id_ == 0)
		return;
	let item = {
		id: id_,
		body: Matter.Bodies.rectangle(x_, y_, 40, 40, {
			inertia: Infinity,
			mass: 1000.5
		}),
		dropped: dropped
	};
	Matter.Composite.add(g.engine.world, item.body);
	return game_object_create(g, "item", item,
		item_update, item_draw, item_destroy);
}

function item_create_from_list(g, list, x, y) {
	let i = Math.floor(list.length * Math.random());
	if(i == list.length)
		i = 0;
	item_create(g, list[i], x, y);
}

function item_destroy(item_object) {
	if(item_object.destroyed)
		return;
	let g = item_object.game;
	Matter.Composite.remove(g.engine.world, item_object.data.body);
	item_object.data.body = null;
	item_object.destroyed = true;
}

function item_update(item_object, dt) {}

function item_draw(item_object, ctx) {
	let item = item_object.data;
	item_icon_draw(ctx, item.id, item.body.position.x - 20, item.body.position.y - 20, 40, 40);
	if(item_object.game.settings.show_hints) {
		let name = "item";
		if(item.id == ITEM_AMMO)
			name = "ammo";
		if(item.id == ITEM_HEALTH)
			name = "health";
		if(item.id == ITEM_GUN)
			name = "gun";
		if(item.id == ITEM_SHOTGUN)
			name = "shotgun";
		if(item.id == ITEM_MINIGUN)
			name = "minigun";
		if(item.id == ITEM_PLASMA_LAUNCHER)
			name = "plasmagun";
		if(item.id == ITEM_PLASMA)
			name = "plasma";
		if(item.id == ITEM_FUEL)
			name = "fuel";
		if(item.id == ITEM_MONEY)
			name = "money";
		if(item.id == ITEM_CANNED_MEAT)
			name = "canned meat";
		if(item.id == ITEM_ORANGE)
			name = "orange";
		if(item.id == ITEM_APPLE)
			name = "apple";
		if(item.id == ITEM_CHERRIES)
			name = "cherries";
		if(item.id == ITEM_CHICKEN_LEG)
			name = "chicken leg";
		if(item.id == ITEM_CHOCOLATE)
			name = "chocolate";
		if(item.id == ITEM_WATER)
			name = "water";
		if(item.id == ITEM_COLA)
			name = "cola";
		if(item.id == ITEM_MILK)
			name = "milk";
		drawHint(ctx, item.body.position.x - 20, item.body.position.y - 20, item_name_translate(item_object.game.settings.language, name));
	}
}

function item_icon_draw(ctx, id, x, y, w, h) {
	if(id == 0) {
		return
	} else if(id == ITEM_GUN) {
		ctx.fillStyle = "black";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_GREEN_GUN) {
		ctx.fillStyle = "#117733";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_SWORD) {
		ctx.fillStyle = "#55aa11";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "#bbaa11";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_RED_SHOTGUN) {
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_RED_PISTOLS) {
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.1, y + h * 0.25, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.025 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.25, w * 0.8, h * 0.2);
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.1, y + h * 0.55, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.025 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.55, w * 0.8, h * 0.2);
	} else if(id == ITEM_SHOTGUN) {
		ctx.fillStyle = "#773311";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_MINIGUN) {
		ctx.fillStyle = "#113377";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_PLASMA_LAUNCHER) {
		ctx.fillStyle = "#331133";
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
	} else if(id == ITEM_ROCKET_LAUNCHER) {
		ctx.fillStyle = "#111133";
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
	} else if(id == ITEM_CANNED_MEAT) {
		ctx.fillStyle = "gray";
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.fillStyle = "#771111";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(id == ITEM_AMMO) {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = "yellow";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "orange";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "orange";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(id == ITEM_GREEN_AMMO) {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = "lime";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "green";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "green";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(id == ITEM_PLASMA) {
		let N = 3;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = "cyan";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "blue";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "white";
			ctx.lineWidth = 0.025 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(id == ITEM_RED_PLASMA) {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = "pink";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "red";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "white";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(id == ITEM_HEALTH) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "#1177ff";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = "#1177ff";
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(id == ITEM_HEALTH_GREEN) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "#11ff77";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = "#11ff77";
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(id == ITEM_FUEL) {
		ctx.fillStyle = "#ff1111";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
		ctx.lineWidth = 0.01 * w;
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
	} else if(id == ITEM_WATER) {
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = "#1177dd";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(id == ITEM_CHOCOLATE) {
		ctx.fillStyle = "#553311";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.85);
		ctx.fillStyle = "#664422";
		ctx.fillRect(x + w * 0.225, y + h * 0.15, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.525, y + h * 0.15, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.225, y + h * 0.35, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.525, y + h * 0.35, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.225, y + h * 0.55, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.525, y + h * 0.55, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.225, y + h * 0.75, w * 0.25, h * 0.15);
		ctx.fillRect(x + w * 0.525, y + h * 0.75, w * 0.25, h * 0.15);
	} else if(id == ITEM_COLA) {
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(id == ITEM_ROCKET) {
		ctx.fillStyle = "red";
		ctx.fillRect(x + w * 0.25, y + h * 0.55, w * 0.5, h * 0.2);
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.35, y + h * 0.2, w * 0.3, h * 0.6);
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.2, h * 0.6);
	} else if(id == ITEM_MILK) {
		ctx.fillStyle = "#113377";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.4);
		ctx.fillStyle = "#dddddd";
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.6, h * 0.4);
		ctx.lineWidth = 0.05 * w;
		ctx.strokeStyle = "black";
		ctx.strokeRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
	} else if(id == ITEM_ORANGE) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "orange", "#773311", 0.05 * w);
	} else if(id == ITEM_SHIELD) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "cyan", "white", 0.05 * w);
	} else if(id == ITEM_APPLE) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "lime", "green", 0.05 * w);
	} else if(id == ITEM_CHICKEN_LEG) {
		drawLine(ctx, x + w * 0.5, y + 0.25 * h, x + 0.5 * w, y + 0.9 * h, "gray", 0.075 * w)
		ctx.fillStyle = "#aa7711";
		ctx.fillRect(x + w * 0.3, y + h * 0.1, w * 0.4, h * 0.6);
	} else if(id == ITEM_CHERRIES) {
		drawLine(ctx, x + w * 0.5, y + 0.25 * h, x + 0.35 * w, y + 0.75 * h, "#555511", 0.05 * w)
		drawLine(ctx, x + w * 0.5, y + 0.25 * h, x + 0.65 * w, y + 0.75 * h, "#555511", 0.05 * w)
		drawCircle(ctx, x + 0.65 * w, y + 0.75 * h, 0.125 * w, "red", "black", 0.025 * w);
		drawCircle(ctx, x + 0.35 * w, y + 0.75 * h, 0.125 * w, "red", "black", 0.025 * w);
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
	if(item_object.game.settings.ammo_pickup_last && ITEMS_AMMOS.includes(item_object.data.id)) {
		for(let i = inv.items.length - 1; i >= 0; i--)
			for(let j = inv.items[i].length - 1; j >= 0; j--)
				if(inv.items[i][j] == 0) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
	} else {
		for(let i = 0; i < inv.items.length; i++)
			for(let j = 0; j < inv.items[i].length; j++)
				if(inv.items[i][j] == 0) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
	}
	return false;
}

function item_name_translate(language, text) {
	if(language == "русский") {
		if(text == "gun")
			return "пушка";
		if(text == "shotgun")
			return "дробовик";
		if(text == "item")
			return "неизвестный предмет";
		if(text == "ammo")
			return "патроны";
		if(text == "health")
			return "аптечка";
		if(text == "orange")
			return "апельсин";
		if(text == "water")
			return "вода";
		if(text == "milk")
			return "молоко";
		if(text == "cola")
			return "кола";
		if(text == "canned meat")
			return "тушонка";
		if(text == "money")
			return "деньги";
		if(text == "cherries")
			return "вишни";
		if(text == "chocolate")
			return "шоколад";
		if(text == "fuel")
			return "топливо";
		if(text == "minigun")
			return "миниган";
		if(text == "plasma")
			return "плазма";
		if(text == "plasmagun")
			return "плазменная пушка";
	}
	return text;
}


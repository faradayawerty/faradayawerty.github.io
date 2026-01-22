let ITEM_GUN = 1;
let ITEM_SHOTGUN = 15;
let ITEM_MINIGUN = 16;
let ITEM_PLASMA_LAUNCHER = 17;
let ITEM_RED_PISTOLS = 20;
let ITEM_RED_SHOTGUN = 21;
let ITEM_GREEN_GUN = 23;
let ITEM_SWORD = 24;
let ITEM_ROCKET_LAUNCHER = 26;
let ITEM_RAINBOW_PISTOLS = 29;
let ITEM_LASER_GUN = 33;
let ITEM_PLASMA_PISTOL = 35;
let ITEM_ROCKET_SHOTGUN = 36;
let ITEM_HORN = 37;

let ITEM_AMMO = 2;
let ITEM_PLASMA = 18;
let ITEM_RED_PLASMA = 19;
let ITEM_GREEN_AMMO = 25;
let ITEM_ROCKET = 27;
let ITEM_RAINBOW_AMMO = 30;

let ITEM_HEALTH = 3;
let ITEM_FUEL = 4;
let ITEM_SHIELD = 22;
let ITEM_HEALTH_GREEN = 28;
let ITEM_SHIELD_GREEN = 31;
let ITEM_SHIELD_RAINBOW = 32;

let ITEM_CANNED_MEAT = 7;
let ITEM_ORANGE = 8;
let ITEM_APPLE = 9;
let ITEM_CHERRIES = 10;
let ITEM_CHICKEN_LEG = 13;
let ITEM_CHOCOLATE = 14;

let ITEM_WATER = 6;
let ITEM_COLA = 11;
let ITEM_MILK = 12;

let ITEM_MONEY = 5;
let ITEM_BOSSIFIER = 34;

let ITEM_APPLE_CORE = 100;
let ITEM_FISH_BONE = 101;
let ITEM_EMPTY_BOTTLE = 102;
let ITEM_TIN_CAN = 103;
let ITEM_OLD_SHOE = 104;
let ITEM_BENT_FORK = 105;
let ITEM_CRUMPLED_PAPER = 106;
let ITEM_DEAD_BATTERY = 107;

let ITEM_JUNK_CANNON = 108;

let ITEMS_JUNK = [
	ITEM_APPLE_CORE,
	ITEM_FISH_BONE,
	ITEM_EMPTY_BOTTLE,
	ITEM_TIN_CAN,
	ITEM_OLD_SHOE,
	ITEM_BENT_FORK,
	ITEM_CRUMPLED_PAPER,
	ITEM_DEAD_BATTERY
];

ITEMS_AMMOS = [
	ITEM_AMMO,
	ITEM_PLASMA,
	ITEM_RED_PLASMA,
	ITEM_ROCKET,
	ITEM_RAINBOW_AMMO
];

ITEMS_GUNS = [
	ITEM_GUN,
	ITEM_SHOTGUN,
	ITEM_MINIGUN,
	ITEM_PLASMA_LAUNCHER,
	ITEM_RED_PISTOLS,
	ITEM_RED_SHOTGUN,
	ITEM_GREEN_GUN,
	ITEM_ROCKET_LAUNCHER,
	ITEM_RAINBOW_PISTOLS,
	ITEM_LASER_GUN,
	ITEM_PLASMA_PISTOL,
	ITEM_ROCKET_SHOTGUN,
	ITEM_JUNK_CANNON
];

ITEMS_MELEE = [
	ITEM_SWORD,
	ITEM_HORN
];

ITEMS_FOODS = [
	ITEM_CANNED_MEAT,
	ITEM_ORANGE,
	ITEM_APPLE,
	ITEM_CHERRIES,
	ITEM_CHICKEN_LEG,
	ITEM_CHOCOLATE
];

ITEMS_DRINKS = [
	ITEM_WATER,
	ITEM_COLA,
	ITEM_MILK
];

// TODO fix item limit
function item_create(g, id_, x_, y_, dropped = false, despawn = true) {
	let items = g.objects.filter((obj) => obj.name == "item" && obj.data.despawn && !obj.data.dropped);
	if (items.length > 50) {
		for (let i = 0; i < items.length - 50; i++)
			items[i].destroy(items[i]);
	}
	if (id_ == 0)
		return;
	let item = {
		id: id_,
		body: Matter.Bodies.rectangle(x_, y_, 40, 40, {
			inertia: Infinity,
			mass: 1000.5
		}),
		dropped: dropped,
		animation_state: 0,
		despawn: despawn,
	};
	Matter.Composite.add(g.engine.world, item.body);
	return game_object_create(g, "item", item,
		item_update, item_draw, item_destroy);
}

function item_create_from_list(g, list, x, y) {
	let i = Math.floor(list.length * Math.random());
	if (i == list.length)
		i = 0;
	item_create(g, list[i], x, y);
}

function item_destroy(item_object) {
	if (item_object.destroyed)
		return;
	let g = item_object.game;
	//g.debug_console.unshift("destroying item");
	Matter.Composite.remove(g.engine.world, item_object.data.body);
	item_object.data.body = null;
	item_object.destroyed = true;
}

function item_update(item_object, dt) {
	item_object.data.animation_state += 0.02 * dt;
}

function item_draw(item_object, ctx) {
	let item = item_object.data;
	item_icon_draw(ctx, item.id, item.body.position.x - 20, item.body.position.y - 20, 40, 40, item_object.data.animation_state);
	if (item_object.game.settings.show_hints) {
		let name = "item";
		if (item.id == ITEM_AMMO)
			name = "ammo";
		if (item.id == ITEM_HEALTH)
			name = "health";
		if (item.id == ITEM_GUN)
			name = "gun";
		if (item.id == ITEM_SHOTGUN)
			name = "shotgun";
		if (item.id == ITEM_MINIGUN)
			name = "minigun";
		if (item.id == ITEM_PLASMA_LAUNCHER)
			name = "plasmagun";
		if (item.id == ITEM_PLASMA)
			name = "plasma";
		if (item.id == ITEM_FUEL)
			name = "fuel";
		if (item.id == ITEM_MONEY)
			name = "money";
		if (item.id == ITEM_CANNED_MEAT)
			name = "canned meat";
		if (item.id == ITEM_ORANGE)
			name = "orange";
		if (item.id == ITEM_APPLE)
			name = "apple";
		if (item.id == ITEM_CHERRIES)
			name = "cherries";
		if (item.id == ITEM_CHICKEN_LEG)
			name = "chicken leg";
		if (item.id == ITEM_CHOCOLATE)
			name = "chocolate";
		if (item.id == ITEM_WATER)
			name = "water";
		if (item.id == ITEM_COLA)
			name = "cola";
		if (item.id == ITEM_MILK)
			name = "milk";
		drawHint(ctx, item.body.position.x - 20, item.body.position.y - 20, item_name_translate(item_object.game.settings.language, name));
	}
}

function item_icon_draw(ctx, id, x, y, w, h, animstate = null) {
	if (id == 0) {
		return
	} else if (id == ITEM_ORANGE) {
		// Апельсин с бликом и текстурой
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "#ff8800", "#773311", 0.05 * w);
		drawCircle(ctx, x + 0.4 * w, y + 0.4 * h, 0.05 * w, "#ffaa44", "#ffaa44", 0); // Блик
		// Маленькая точка сверху (черешок)
		ctx.fillStyle = "#442200";
		ctx.fillRect(x + 0.48 * w, y + 0.25 * h, 0.04 * w, 0.04 * h);
	} else if (id == ITEM_GUN) {
		// Пистолет: Г-образная форма
		ctx.fillStyle = "#333";
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2); // Ствол
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3); // Рукоятка
		ctx.fillStyle = "#555";
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05); // Затвор

	} else if (id == ITEM_RED_PISTOLS || id == ITEM_RAINBOW_PISTOLS) {
		  // Общая функция для рисования одного пистолета
		  let drawSinglePistol = (px, py, scale, color) => {
			ctx.fillStyle = color;
			// Ствол
			ctx.fillRect(px, py, w * 0.35 * scale, h * 0.12 * scale);
			// Рукоятка (под углом или просто вертикально вниз)
			ctx.fillRect(px, py + h * 0.05 * scale, w * 0.1 * scale, h * 0.18 * scale);
			// Затвор (сверху чуть светлее для объема)
			ctx.fillStyle = "rgba(255,255,255,0.2)";
			ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 * scale, h * 0.04 * scale);
		  };

		  // Определяем основной цвет
		  let mainColor = "#dd1111"; // По умолчанию красный
		  if (id == ITEM_RAINBOW_PISTOLS && animstate != null) {
			// Динамический цвет для радужных пистолетов
			let hue = (animstate * 10) % 360;
			mainColor = `hsl(${hue}, 70%, 50%)`;
		  } else if (id == ITEM_RAINBOW_PISTOLS) {
			mainColor = "purple";
		  }

		  // Рисуем два пистолета со смещением
		  // Первый (чуть выше и левее)
		  drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2, mainColor);
		  
		  // Второй (чуть ниже и правее)
		  drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2, mainColor);

		  // Добавим контур для "вписывания" в мир, если нужно
		  ctx.strokeStyle = "rgba(0,0,0,0.5)";
		  ctx.lineWidth = 1;
		  // Опционально можно обвести оба пистолета

	} else if (id == ITEM_PLASMA_PISTOL) {
		// Плазменный пистолет: Фиолетовое свечение
		ctx.fillStyle = "#331133";
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.25);
		ctx.fillStyle = "#ff00ff";
		ctx.fillRect(x + w * 0.4, y + h * 0.45, w * 0.3, h * 0.1); // Энергоячейка
	} else if (id == ITEM_GREEN_GUN) {
		// Зеленая пушка: Длинная, с магазином
		ctx.fillStyle = "#117733";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.15); // Ствол
		ctx.fillStyle = "#0a441e";
		ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.1, h * 0.3); // Длинный магазин
	} else if (id == ITEM_RED_SHOTGUN || id == ITEM_SHOTGUN || id == ITEM_ROCKET_SHOTGUN) {
		// Дробовики: Толстое цевье и приклад
		let col = id == ITEM_RED_SHOTGUN ? "#dd1111" : (id == ITEM_ROCKET_SHOTGUN ? "#111133" : "#773311");
		ctx.fillStyle = col;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25); // Ствол
		ctx.fillStyle = "#333";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15); // Цевье
		if (id == ITEM_ROCKET_SHOTGUN) {
			ctx.fillStyle = "orange";
			ctx.fillRect(x + w * 0.7, y + h * 0.35, w * 0.1, h * 0.1); // Маленькая ракета сверху
		}
	} else if (id == ITEM_MINIGUN) {
		// Миниган: Три тонких ствола и блок
		ctx.fillStyle = "#113377";
		ctx.fillRect(x + w * 0.1, y + h * 0.35, w * 0.3, h * 0.4); // Задний блок
		ctx.fillStyle = "#555";
		ctx.fillRect(x + w * 0.4, y + h * 0.4, w * 0.5, h * 0.05); // Ствол 1
		ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.5, h * 0.05); // Ствол 2
		ctx.fillRect(x + w * 0.4, y + h * 0.6, w * 0.5, h * 0.05); // Ствол 3
	} else if (id == ITEM_LASER_GUN) {
		// Лазер: Футуристичная форма с линзой
		ctx.fillStyle = "purple";
		ctx.fillRect(x + w * 0.1, y + h * 0.35, w * 0.7, h * 0.3);
		ctx.fillStyle = "#ff00ff";
		ctx.fillRect(x + w * 0.8, y + h * 0.35, w * 0.1, h * 0.3); // Линза на конце
		ctx.strokeStyle = "white";
		ctx.strokeRect(x + w * 0.2, y + h * 0.45, w * 0.5, h * 0.1); // Провод
	} else if (id == ITEM_PLASMA_LAUNCHER || id == ITEM_ROCKET_LAUNCHER) {
		// Тяжелые пушки: Громоздкий корпус
		let col = id == ITEM_PLASMA_LAUNCHER ? "#331133" : "#111133";
		ctx.fillStyle = col;
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
		ctx.fillStyle = "#000";
		ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1); // Ручка сверху
		ctx.fillStyle = id == ITEM_PLASMA_LAUNCHER ? "cyan" : "red";
		ctx.beginPath();
		ctx.arc(x + w * 0.8, y + h * 0.52, w * 0.1, 0, Math.PI * 2); // Индикатор заряда
		ctx.fill();
	} else if (id == ITEM_OLD_SHOE) {
		// Старый ботинок
		ctx.fillStyle = "#553311";
		ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.6 * w, 0.2 * h); // Подошва
		ctx.fillRect(x + 0.2 * w, y + 0.3 * h, 0.3 * w, 0.4 * h); // Пятка/голенище
	} else if (id == ITEM_BENT_FORK) {
		// Гнутая вилка
		ctx.strokeStyle = "#aaa";
		ctx.lineWidth = 2;
		drawLine(ctx, x + 0.5 * w, y + 0.8 * h, x + 0.5 * w, y + 0.4 * h, "#aaa"); // Ручка
		drawLine(ctx, x + 0.4 * w, y + 0.2 * h, x + 0.4 * w, y + 0.4 * h, "#aaa"); // Зуб 1
		drawLine(ctx, x + 0.6 * w, y + 0.1 * h, x + 0.6 * w, y + 0.4 * h, "#aaa"); // Зуб 2 гнутый
	} else if (id == ITEM_JUNK_CANNON) {
		// МУСОРНАЯ ПУШКА (выглядит как труба с примотанным скотчем баком)
		ctx.fillStyle = "#444";
		ctx.fillRect(x + 0.1 * w, y + 0.4 * h, 0.8 * w, 0.25 * h); // Ствол
		ctx.fillStyle = "#222";
		ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.15 * w, 0.2 * h); // Рукоятка
		ctx.fillStyle = "#556677"; // Бак сверху
		ctx.beginPath();
		ctx.arc(x + 0.5 * w, y + 0.35 * h, 0.2 * w, 0, Math.PI, true);
		ctx.fill();
		// Синяя изолента
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 3;
		drawLine(ctx, x + 0.4 * w, y + 0.3 * h, x + 0.4 * w, y + 0.65 * h, "blue");
	} else if (id == ITEM_CRUMPLED_PAPER) {
		// Скомканная бумага
		ctx.fillStyle = "#ffffff";
		ctx.strokeStyle = "#cccccc";
		ctx.lineWidth = 1;
		ctx.beginPath();
		// Рисуем неровный многоугольник (эффект мятой бумаги)
		ctx.moveTo(x + 0.3 * w, y + 0.3 * h);
		ctx.lineTo(x + 0.5 * w, y + 0.25 * h);
		ctx.lineTo(x + 0.7 * w, y + 0.4 * h);
		ctx.lineTo(x + 0.65 * w, y + 0.7 * h);
		ctx.lineTo(x + 0.4 * w, y + 0.75 * h);
		ctx.lineTo(x + 0.25 * w, y + 0.5 * h);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		// Складки внутри
		drawLine(ctx, x + 0.4 * w, y + 0.4 * h, x + 0.6 * w, y + 0.5 * h, "#dddddd", 1);
	} else if (id == ITEM_DEAD_BATTERY) {
		// Серая севшая батарейка
		ctx.fillStyle = "#444444"; // Корпус
		ctx.fillRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
		ctx.fillStyle = "#222222"; // Ржавое дно
		ctx.fillRect(x + 0.35 * w, y + 0.7 * h, 0.3 * w, 0.1 * h);
		ctx.fillStyle = "#777777"; // Пипка сверху
		ctx.fillRect(x + 0.45 * w, y + 0.22 * h, 0.1 * w, 0.08 * h);
		// Значок "минус" или пустоты
		drawLine(ctx, x + 0.42 * w, y + 0.55 * h, x + 0.58 * w, y + 0.55 * h, "#333333", 2);
	} else if (id == ITEM_JUNK_CANNON) {
		// МУСОРНАЯ ПУШКА
		// Ствол (широкая ржавая труба)
		ctx.fillStyle = "#555555";
		ctx.fillRect(x + 0.1 * w, y + 0.4 * h, 0.7 * w, 0.3 * h);
		ctx.strokeStyle = "#333333";
		ctx.lineWidth = 2;
		ctx.strokeRect(x + 0.1 * w, y + 0.4 * h, 0.7 * w, 0.3 * h);

		// Воронка сзади (куда засыпать мусор)
		ctx.fillStyle = "#777777";
		ctx.beginPath();
		ctx.moveTo(x + 0.1 * w, y + 0.4 * h);
		ctx.lineTo(x + 0.05 * w, y + 0.25 * h);
		ctx.lineTo(x + 0.3 * w, y + 0.25 * h);
		ctx.lineTo(x + 0.25 * w, y + 0.4 * h);
		ctx.fill();
		ctx.stroke();

		// Синяя изолента (скрепляет детали)
		ctx.fillStyle = "#0033aa";
		ctx.fillRect(x + 0.35 * w, y + 0.38 * h, 0.1 * w, 0.34 * h);
		ctx.fillRect(x + 0.55 * w, y + 0.38 * h, 0.1 * w, 0.34 * h);

		// Рукоятка
		ctx.fillStyle = "#222222";
		ctx.fillRect(x + 0.2 * w, y + 0.7 * h, 0.1 * w, 0.15 * h);
	} else if (id == ITEM_APPLE) {
		// Основное тело яблока (один большой эллипс)
		ctx.fillStyle = "#ff4422"; // Цвет яблока
		ctx.beginPath();
		// Рисуем чуть приплюснутый круг
		ctx.ellipse(x + 0.5 * w, y + 0.6 * h, 0.22 * w, 0.25 * h, 0, 0, Math.PI * 2);
		ctx.fill();

		// Обводка только по внешнему контуру
		ctx.strokeStyle = "#440000";
		ctx.lineWidth = 0.03 * w;
		ctx.stroke();

		// Черешок (коричневая палочка)
		drawLine(ctx, x + 0.5 * w, y + 0.35 * h, x + 0.5 * w, y + 0.2 * h, "#442200", 0.04 * w);

		// Листик
		ctx.fillStyle = "#33aa11";
		ctx.beginPath();
		ctx.ellipse(x + 0.58 * w, y + 0.25 * h, 0.1 * w, 0.05 * w, -Math.PI / 4, 0, Math.PI * 2);
		ctx.fill();

		// Блик (белое пятнышко для объема), без обводки
		ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
		ctx.beginPath();
		ctx.ellipse(x + 0.42 * w, y + 0.5 * h, 0.06 * w, 0.09 * w, Math.PI / 6, 0, Math.PI * 2);
		ctx.fill();
	} else if (id == ITEM_APPLE_CORE) {
		// Огрызок яблока
		ctx.fillStyle = "#eeeecc";
		ctx.beginPath(); // Тонкая сердцевина
		ctx.ellipse(x + 0.5 * w, y + 0.5 * h, 0.08 * w, 0.2 * h, 0, 0, Math.PI * 2);
		ctx.fill();
		// Остатки кожухи сверху и снизу
		ctx.fillStyle = "#ff4422";
		ctx.fillRect(x + 0.4 * w, y + 0.3 * h, 0.2 * w, 0.05 * h);
		ctx.fillRect(x + 0.4 * w, y + 0.65 * h, 0.2 * w, 0.05 * h);
		drawLine(ctx, x + 0.5 * w, y + 0.3 * h, x + 0.5 * w, y + 0.15 * h, "#442200", 0.03 * w);
	} else if (id == ITEM_FISH_BONE) {
		// Рыбья кость
		ctx.strokeStyle = "#dddddd";
		ctx.lineWidth = 0.05 * w;
		drawLine(ctx, x + 0.2 * w, y + 0.5 * h, x + 0.8 * w, y + 0.5 * h, "#dddddd"); // Хребет
		for (let i = 0; i < 4; i++) { // Ребра
			drawLine(ctx, x + (0.3 + i * 0.15) * w, y + 0.35 * h, x + (0.3 + i * 0.15) * w, y + 0.65 * h, "#dddddd");
		}
		// Голова (треугольник)
		ctx.fillStyle = "#dddddd";
		ctx.beginPath();
		ctx.moveTo(x + 0.8 * w, y + 0.5 * h);
		ctx.lineTo(x + 0.95 * w, y + 0.35 * h);
		ctx.lineTo(x + 0.95 * w, y + 0.65 * h);
		ctx.fill();
	} else if (id == ITEM_EMPTY_BOTTLE) {
		// Пустая бутылка
		ctx.fillStyle = "rgba(150, 200, 255, 0.4)";
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.fillRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
		ctx.fillRect(x + 0.42 * w, y + 0.15 * h, 0.15 * w, 0.15 * h);
		ctx.strokeRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
	} else if (id == ITEM_TIN_CAN) {
		// Реалистичная пустая консервная банка
		let cx = x + 0.5 * w;
		let cy = y + 0.5 * h;

		// Основное тело (цилиндр)
		ctx.fillStyle = "#999999";
		ctx.fillRect(x + 0.3 * w, y + 0.35 * h, 0.4 * w, 0.4 * h);

		// Кольца жесткости на банке
		ctx.strokeStyle = "#777777";
		ctx.lineWidth = 1;
		drawLine(ctx, x + 0.3 * w, y + 0.45 * h, x + 0.7 * w, y + 0.45 * h, "#777777");
		drawLine(ctx, x + 0.3 * w, y + 0.55 * h, x + 0.7 * w, y + 0.55 * h, "#777777");
		drawLine(ctx, x + 0.3 * w, y + 0.65 * h, x + 0.7 * w, y + 0.65 * h, "#777777");

		// Нижний эллипс (дно)
		ctx.fillStyle = "#999999";
		ctx.beginPath();
		ctx.ellipse(cx, y + 0.75 * h, 0.2 * w, 0.05 * h, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Верхний эллипс (открытая часть)
		ctx.fillStyle = "#444444"; // Темное нутро
		ctx.beginPath();
		ctx.ellipse(cx, y + 0.35 * h, 0.2 * w, 0.05 * h, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "#bbbbbb";
		ctx.stroke();

		// Приоткрытая крышка
		ctx.fillStyle = "#888888";
		ctx.beginPath();
		// Крышка торчит вверх и вбок
		ctx.ellipse(x + 0.35 * w, y + 0.25 * h, 0.15 * w, 0.04 * h, -Math.PI / 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	} else if (id == ITEM_CHERRIES) {
		// Две вишни с изогнутыми веточками
		drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.35 * w, y + 0.65 * h, "#224400", 0.04 * w);
		drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.65 * w, y + 0.65 * h, "#224400", 0.04 * w);
		drawCircle(ctx, x + 0.35 * w, y + 0.7 * h, 0.12 * w, "#cc0000", "#660000", 0.02 * w);
		drawCircle(ctx, x + 0.65 * w, y + 0.7 * h, 0.12 * w, "#ee0000", "#660000", 0.02 * w);
		// Маленькие блики
		drawCircle(ctx, x + 0.32 * w, y + 0.65 * h, 0.03 * w, "white", "none", 0);
		drawCircle(ctx, x + 0.62 * w, y + 0.65 * h, 0.03 * w, "white", "none", 0);
	} else if (id == ITEM_CHICKEN_LEG) {
		// Куриная ножка с эффектом зажаристой корочки
		drawLine(ctx, x + 0.5 * w, y + 0.6 * h, x + 0.5 * w, y + 0.85 * h, "#eeeeee", 0.08 * w); // Кость
		drawCircle(ctx, x + 0.45 * w, y + 0.85 * h, 0.05 * w, "#eeeeee", "#cccccc", 0.01 * w); // Сустав
		drawCircle(ctx, x + 0.55 * w, y + 0.85 * h, 0.05 * w, "#eeeeee", "#cccccc", 0.01 * w); // Сустав
		// Мясо
		ctx.fillStyle = "#884411";
		ctx.beginPath();
		ctx.ellipse(x + 0.5 * w, y + 0.4 * h, 0.2 * w, 0.28 * h, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#aa6622"; // Светлая часть сверху
		ctx.beginPath();
		ctx.ellipse(x + 0.45 * w, y + 0.35 * h, 0.12 * w, 0.18 * h, 0, 0, Math.PI * 2);
		ctx.fill();
	} else if (id == ITEM_CHOCOLATE) {
		// Шоколадка в обертке
		ctx.fillStyle = "#331100"; // Сам шоколад
		ctx.fillRect(x + w * 0.2, y + h * 0.15, w * 0.6, h * 0.7);
		// Красная обертка, закрывающая нижнюю часть
		ctx.fillStyle = "#aa0000";
		ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.6, h * 0.45);
		// Детали шоколадных долек
		ctx.strokeStyle = "#220800";
		ctx.lineWidth = 1;
		ctx.strokeRect(x + w * 0.25, y + h * 0.2, w * 0.2, h * 0.2);
		ctx.strokeRect(x + w * 0.55, y + h * 0.2, w * 0.2, h * 0.2);
		// Золотистая полоска на обертке
		ctx.fillStyle = "#d4af37";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.6, h * 0.05);
	} else if (id == ITEM_GUN) {
		ctx.fillStyle = "black";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_PLASMA_PISTOL) {
		ctx.fillStyle = "#331133";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_GREEN_GUN) {
		ctx.fillStyle = "#117733";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_SWORD) {
		ctx.fillStyle = "#55aa11";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "#bbaa11";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_HORN) {
		ctx.fillStyle = "brown";
		ctx.fillRect(x + w * 0.1, y + h * 0.425, w * 0.8, h * 0.15);
		//ctx.strokeStyle = "black";
		//ctx.lineWidth = 0.05 * w;
		//ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		//drawLine(ctx, x + w * 0.5, y + h * 0.5, x + w * 0.8, y + h * 0.8, "black", w * 0.15);
		drawLine(ctx, x + w * 0.5, y + h * 0.5, x + w * 0.8, y + h * 0.8, "brown", w * 0.1);
		drawLine(ctx, x + w * 0.4, y + h * 0.5, x + w * 0.7, y + h * 0.2, "brown", w * 0.1);
	} else if (id == ITEM_RED_SHOTGUN) {
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_RED_PISTOLS) {
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
	} else if (id == ITEM_RAINBOW_PISTOLS) {
		ctx.fillStyle = "purple";
		ctx.fillRect(x + w * 0.1, y + h * 0.25, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.025 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.25, w * 0.8, h * 0.2);
		ctx.fillStyle = "purple";
		ctx.fillRect(x + w * 0.1, y + h * 0.55, w * 0.8, h * 0.2);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 0.025 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.55, w * 0.8, h * 0.2);
	} else if (id == ITEM_SHOTGUN) {
		ctx.fillStyle = "#773311";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_ROCKET_SHOTGUN) {
		ctx.fillStyle = "#111133";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_MINIGUN) {
		ctx.fillStyle = "#113377";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_LASER_GUN) {
		ctx.fillStyle = "purple";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "pink";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_PLASMA_LAUNCHER) {
		ctx.fillStyle = "#331133";
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
	} else if (id == ITEM_ROCKET_LAUNCHER) {
		ctx.fillStyle = "#111133";
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.4);
	} else if (id == ITEM_CANNED_MEAT) {
		ctx.fillStyle = "gray";
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.fillStyle = "#771111";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if (id == ITEM_AMMO) {
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = "yellow";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "orange";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "orange";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_SHIELD_RAINBOW && animstate != null) {
		let r = Math.cos(0.1 * animstate) * 15;
		let g = 0.7 * (Math.cos(0.1 * animstate) + Math.sin(0.1 * animstate)) * 15;
		let b = Math.sin(0.1 * animstate) * 15;
		r = Math.floor(r * r);
		g = Math.floor(g * g);
		b = Math.floor(b * b);
		let color = "#" + (r).toString(16).padStart(2, '0') + (g).toString(16).padStart(2, '0') + (b).toString(16).padStart(2, '0');
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, color, "white", 0.05 * w);
	} else if (id == ITEM_RAINBOW_AMMO && animstate != null) {
		let colors = ["pink", "yellow", "lime", "cyan"];
		let colors1 = ["red", "orange", "green", "blue"];
		let colors2 = ["white", "white", "white", "white"];
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = colors[(i + Math.floor(animstate)) % 4];
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = colors1[(i + Math.floor(animstate)) % 4];
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = colors2[(i + Math.floor(animstate)) % 4];
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_GREEN_AMMO) {
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = "lime";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "green";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "green";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_PLASMA) {
		let N = 3;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = "cyan";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "blue";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "white";
			ctx.lineWidth = 0.025 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_RED_PLASMA) {
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = "pink";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "red";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_HEALTH) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "#1177ff";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = "#1177ff";
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if (id == ITEM_BOSSIFIER && animstate != null) {
		let rate = 0.05;
		let r = Math.cos(rate * animstate) * 15;
		let g = 0.7 * (Math.cos(rate * animstate) + Math.sin(rate * animstate)) * 15;
		let b = Math.sin(rate * animstate) * 15;
		r = Math.floor(r * r);
		g = Math.floor(g * g);
		b = Math.floor(b * b);
		let color = "#" + (r).toString(16).padStart(2, '0') + (g).toString(16).padStart(2, '0') + (b).toString(16).padStart(2, '0');
		ctx.fillStyle = "black";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		drawLine(ctx, x + w * 0.5, y + h * 0.7, x + w * 0.5, y + h * 0.28375, color, w * 0.05);
		drawLine(ctx, x + w * 0.5, y + h * 0.3, x + w * 0.65, y + h * 0.5, color, w * 0.05);
		drawLine(ctx, x + w * 0.5, y + h * 0.3, x + w * 0.35, y + h * 0.5, color, w * 0.05);
		ctx.strokeStyle = color;
		ctx.lineWidth = h * 0.025;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if (id == ITEM_HEALTH_GREEN) {
		ctx.fillStyle = "white";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = "#11ff77";
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = "#11ff77";
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if (id == ITEM_FUEL) {
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
	} else if (id == ITEM_MONEY) {
		ctx.fillStyle = "#11ff55";
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.strokeStyle = "#007733";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		drawCircle(ctx, x + w * 0.5, y + h * 0.5, w * 0.1, "#007733", "#007733", w * 0.025);
	} else if (id == ITEM_WATER) {
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = "#1177dd";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if (id == ITEM_CHOCOLATE) {
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
	} else if (id == ITEM_COLA) {
		ctx.fillStyle = "#777777";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = "#dd1111";
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if (id == ITEM_ROCKET) {
		//ctx.fillStyle = "red";
		//ctx.fillRect(x + w * 0.25, y + h * 0.55, w * 0.5, h * 0.2);
		//ctx.fillStyle = "#777777";
		//ctx.fillRect(x + w * 0.35, y + h * 0.2, w * 0.3, h * 0.6);
		//ctx.fillStyle = "#777777";
		//ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.2, h * 0.6);
		let N = 3;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = "#666666";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = "#bb3311";
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = "#111111";
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if (id == ITEM_MILK) {
		ctx.fillStyle = "#113377";
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.4);
		ctx.fillStyle = "#dddddd";
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.6, h * 0.4);
		ctx.lineWidth = 0.05 * w;
		ctx.strokeStyle = "black";
		ctx.strokeRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
	} else if (id == ITEM_ORANGE) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "orange", "#773311", 0.05 * w);
	} else if (id == ITEM_SHIELD) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "cyan", "white", 0.05 * w);
	} else if (id == ITEM_SHIELD_GREEN) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "lime", "white", 0.05 * w);
	} else if (id == ITEM_APPLE) {
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "lime", "green", 0.05 * w);
	} else if (id == ITEM_CHICKEN_LEG) {
		drawLine(ctx, x + w * 0.5, y + 0.25 * h, x + 0.5 * w, y + 0.9 * h, "gray", 0.075 * w)
		ctx.fillStyle = "#aa7711";
		ctx.fillRect(x + w * 0.3, y + h * 0.1, w * 0.4, h * 0.6);
	} else if (id == ITEM_CHERRIES) {
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

function item_pickup(inventory_element, item_object, force = false) {
	if (!item_object)
		return false;
	let inv = inventory_element.data;
	let item = item_object.data;
	if (item_object.game.settings.ammo_pickup_last && ITEMS_AMMOS.includes(item_object.data.id) || force) {
		for (let i = inv.items.length - 1; i >= 0; i--)
			for (let j = inv.items[i].length - 1; j >= 0; j--)
				if (inv.items[i][j] == 0 || force) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
	} else {
		for (let i = 0; i < inv.items.length; i++)
			for (let j = 0; j < inv.items[i].length; j++) {
				if (inv.items[i][j] == 0) {
					inv.items[i][j] = item.id;
					item_destroy(item_object);
					return true;
				}
			}
	}
	return false;
}

function item_name_translate(language, text) {
	if (language == "русский") {
		if (text == "apple core")
			return "огрызок яблока";
		if (text == "fish bone")
			return "рыбья кость";
		if (text == "empty bottle")
			return "пустая бутылка";
		if (text == "tin can")
			return "консервная банка";
		if (text == "gun")
			return "пушка";
		if (text == "shotgun")
			return "дробовик";
		if (text == "item")
			return "неизвестный предмет";
		if (text == "ammo")
			return "патроны";
		if (text == "health")
			return "аптечка";
		if (text == "orange")
			return "апельсин";
		if (text == "water")
			return "вода";
		if (text == "milk")
			return "молоко";
		if (text == "cola")
			return "кола";
		if (text == "canned meat")
			return "тушонка";
		if (text == "money")
			return "деньги";
		if (text == "cherries")
			return "вишни";
		if (text == "chocolate")
			return "шоколад";
		if (text == "fuel")
			return "топливо";
		if (text == "minigun")
			return "миниган";
		if (text == "plasma")
			return "плазма";
		if (text == "plasmagun")
			return "плазменная пушка";
	}
	return text;
}

function item_spawn(g, x, y, enemy_type = null) {

	let available_guns = [ITEM_GUN];
	let available_ammos = [ITEM_AMMO];
	let available_misc = [ITEM_HEALTH];

	if (enemy_type == "shooting" || enemy_type == null && g.enemies["shooting"]) {
		available_guns.push(ITEM_SHOTGUN);
		if (enemy_type != null) {
			available_ammos.push(ITEM_PLASMA);
			available_misc.push(ITEM_SHIELD);
		}
	}

	if (enemy_type == "shooting red" || enemy_type == null && g.enemies["shooting red"]) {
		available_ammos.push(ITEM_PLASMA);
		available_guns.push(ITEM_PLASMA_LAUNCHER);
		available_misc.push(ITEM_SHIELD);
		if (enemy_type != null)
			available_ammos.push(ITEM_RED_PLASMA);
	}

	if (enemy_type == "sword" || enemy_type == null && g.enemies["sword"]) {
		available_guns.push(ITEM_RED_PISTOLS);
		available_ammos.push(ITEM_RED_PLASMA);
		if (enemy_type != null)
			available_misc = [ITEM_HEALTH_GREEN, ITEM_SHIELD_GREEN]
	}

	if (enemy_type == "shooting rocket" || enemy_type == null && g.enemies["shooting rocket"]) {
		available_guns.push(ITEM_SWORD);
		available_misc.push(ITEM_SHIELD_GREEN);
		available_misc.push(ITEM_HEALTH_GREEN);
		if (enemy_type != null)
			available_ammos = [ITEM_ROCKET];
	}

	if (enemy_type == "shooting laser" || enemy_type == null && g.enemies["shooting laser"]) {
		available_guns.push(ITEM_ROCKET_LAUNCHER);
		available_ammos.push(ITEM_ROCKET);
		if (enemy_type != null) {
			available_ammos = [ITEM_ROCKET, ITEM_RAINBOW_AMMO];
			available_misc = [ITEM_SHIELD_RAINBOW];
		}
	}

	let chance_ammo = 0.2;
	let chance_misc = 0.2;
	let chance_gun = 0.1;
	let chance_food = 0.2;
	let chance_drink = 0.2;
	let chance_fuel = 0;

	if (enemy_type != null) {
		chance_fuel = 0.1;
		chance_ammo = 0.5;
		chance_misc = 0.4;
		if (enemy_type == "sword")
			chance_misc = 0.7;
	}

	let player_closest = game_object_find_closest(g, x, y, "player", 5000);
	if (player_closest) {
		chance_drink = Math.max(chance_drink, 0.8 - player_closest.data.thirst / player_closest.data.max_thirst);
		chance_food = Math.max(chance_food, 0.8 - player_closest.data.hunger / player_closest.data.max_hunger);
		if (player_closest.data.car_object)
			chance_fuel = Math.max(chance_fuel, 0.6 - player_closest.data.car_object.data.fuel / player_closest.data.car_object.data.max_fuel);
	}

	let chance_sum = chance_gun + chance_ammo + chance_fuel + chance_food + chance_drink + chance_misc;

	chance_gun = chance_gun / chance_sum;
	chance_ammo = chance_ammo / chance_sum;
	chance_fuel = chance_fuel / chance_sum;
	chance_food = chance_food / chance_sum;
	chance_drink = chance_drink / chance_sum;
	chance_misc = chance_misc / chance_sum;

	let item = 0;
	let r = Math.random();
	let a = 0;

	if (a < r && r < a + chance_misc)
		item = available_misc[Math.floor(Math.random() * available_misc.length)];
	a += chance_misc;

	if (a < r && r < a + chance_gun)
		item = available_guns[Math.floor(Math.random() * available_guns.length)];
	a += chance_gun;

	if (a < r && r < a + chance_fuel)
		item = ITEM_FUEL;
	a += chance_fuel;

	if (a < r && r < a + chance_food)
		item = ITEMS_FOODS[Math.floor(Math.random() * ITEMS_FOODS.length)];
	a += chance_food;

	if (a < r && r < a + chance_drink)
		item = ITEMS_DRINKS[Math.floor(Math.random() * ITEMS_DRINKS.length)];
	a += chance_drink;

	if (a < r && r < a + chance_ammo)
		item = available_ammos[Math.floor(Math.random() * available_ammos.length)];
	a += chance_ammo;

	g.debug_console.unshift(
		"item_spawn" +
		" i:" + item +
		" r:" + Math.round(100 * r) + "%" +
		" M:" + Math.round(100 * chance_misc) + "%" +
		" W:" + Math.round(100 * chance_gun) + "%" +
		" G:" + Math.round(100 * chance_fuel) + "%" +
		" F:" + Math.round(100 * chance_food) + "%" +
		" D:" + Math.round(100 * chance_drink) + "%" +
		" A:" + Math.round(100 * chance_ammo) + "%"
	);

	if (enemy_type == "deer")
		item = ITEM_CANNED_MEAT;

	if (enemy_type == "raccoon")
		item = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK.length)];

	item_create(g, item, x, y);
}

let DECORATIVE_COLOR_GRASS = "#117711";

// --- ЛОГИКА ПРОЗРАЧНОСТИ ---

function roof_apply_transparency(g, bx, by, bw, bh) {
	// 1. Проверка игрока (самый высокий приоритет прозрачности)
	let p = g.player_object;
	if (!p) p = g.objects.find(o => o.name === "player" && !o.data.ai_controlled);

	if (p && p.data.body) {
		let px = p.data.body.position.x;
		let py = p.data.body.position.y;
		if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) {
			return 0.4; // Сильная прозрачность для игрока
		}
	}

	// 2. Проверка врагов (средний приоритет)
	// Фильтруем объекты, ища тех, чье имя "enemy"
	for (let i = 0; i < g.objects.length; i++) {
		let obj = g.objects[i];
		if (obj.name === "enemy" && !obj.destroyed && obj.data.body) {
			let ex = obj.data.body.position.x;
			let ey = obj.data.body.position.y;

			// Если хотя бы один враг внутри баундинг-бокса
			if (ex >= bx && ex <= bx + bw && ey >= by && ey <= by + bh) {
				return 0.7; // "Чуть менее прозрачная", чем для игрока
			}
		}
	}

	return 1.0; // Полная непрозрачность, если никого нет
}

// --- ОТРИСОВЩИКИ ---

function decorative_rectangle_draw(self, ctx) {
	let d = self.data;
	ctx.globalAlpha = d.transparency || 1.0;
	ctx.fillStyle = d.color_fill;
	ctx.fillRect(d.x, d.y, d.w, d.h);
	if (d.color_outline && d.color_outline !== "transparent") {
		ctx.lineWidth = 2;
		ctx.strokeStyle = d.color_outline;
		ctx.strokeRect(d.x, d.y, d.w, d.h);
	}
	ctx.globalAlpha = 1.0;
}

function decorative_roof_draw(self, ctx) {
	let d = self.data;
	ctx.globalAlpha = roof_apply_transparency(self.game, d.bx, d.by, d.bw, d.bh);

	if (d.text) {
		ctx.font = "bold " + d.size + "px verdana";
		ctx.fillStyle = d.color;
		ctx.textBaseline = "top";
		ctx.fillText(d.text, d.x, d.y);
	} else {
		ctx.fillStyle = d.color_fill;
		ctx.fillRect(d.x, d.y, d.w, d.h);
		if (d.color_outline && d.color_outline !== "transparent") {
			ctx.lineWidth = 2;
			ctx.strokeStyle = d.color_outline;
			ctx.strokeRect(d.x, d.y, d.w, d.h);
		}
	}
	ctx.globalAlpha = 1.0;
}

// --- ФУНКЦИИ СОЗДАНИЯ ---

function decorative_rectangle_create(g, x, y, w, h, fill, outline = "transparent") {
	let i = game_object_create(g, "decorative", {
			x,
			y,
			w,
			h,
			color_fill: fill,
			color_outline: outline
		},
		function() {}, decorative_rectangle_draw,
		function(o) {
			o.destroyed = true
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function roof_rect_create(g, x, y, w, h, bx, by, bw, bh, fill, outline = "transparent") {
	let i = game_object_create(g, "decorative_roof", {
			x,
			y,
			w,
			h,
			bx,
			by,
			bw,
			bh,
			color_fill: fill,
			color_outline: outline
		},
		function() {}, decorative_roof_draw,
		function(o) {
			o.destroyed = true
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function roof_text_create(g, text, x, y, size, bx, by, bw, bh, color) {
	let i = game_object_create(g, "decorative_roof", {
			text,
			x,
			y,
			size: Math.floor(size),
			bx,
			by,
			bw,
			bh,
			color
		},
		function() {}, decorative_roof_draw,
		function(o) {
			o.destroyed = true
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

function decorative_text_create(g, text, x, y, size, color) {
	let i = game_object_create(g, "decorative", {
			text,
			x,
			y,
			size: Math.floor(size),
			color
		},
		function() {},
		function(self, ctx) {
			ctx.font = "bold " + self.data.size + "px verdana";
			ctx.fillStyle = self.data.color;
			ctx.textBaseline = "top";
			ctx.fillText(self.data.text, self.data.x, self.data.y);
		},
		function(o) {
			o.destroyed = true
		});
	if (i !== -1) g.objects[i].persistent = false;
	return i;
}

// --- ОКРУЖЕНИЕ ---

function decorative_level_base_create(g, x, y, color = "gray") {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, 2500, 2500, color, "white"), "decorative_level_base");
}

function decorative_grass_create(g, x, y, w, h, trees = true) {
	game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, DECORATIVE_COLOR_GRASS, DECORATIVE_COLOR_GRASS), "decorative_grass");
	if (trees) {
		let N = w / 300.0;
		let M = h / 300.0;
		for (let i = 1; i < N - 1; i++) {
			for (let j = 0.75; j < M - 1; j++) {
				decorative_tree_create(g, x + (i + 0.5 * (Math.random() - 0.5)) * w / N, y + (j + 0.5 * (Math.random() - 0.5)) * h / M);
			}
		}
	}
}

function decorative_tree_create(g, x, y) {
	if (!g.settings.trees) return;
	bound_create(g, x, y + 145, 30, 30);
	game_object_change_name(g, decorative_rectangle_create(g, x - 65, y, 160, 75, "lime", "#224400"), "decorative_leaves");
	game_object_change_name(g, decorative_rectangle_create(g, x, y + 75, 30, 100, "brown", "#442200"), "decorative_trunk");
}

function decorative_road_create(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");
	let N = 8.0;
	for (let i = 0; i < N && w > h; i++)
		decorative_rectangle_create(g, x + (i + 0.25) * w / N, y + h / 2 - 0.05 * h, 0.5 * w / N, 0.1 * h, "#ffffff", "#ffffff");
	for (let i = 0; i < N && h > w; i++)
		decorative_rectangle_create(g, x + w / 2 - 0.05 * w, y + (i + 0.25) * h / N, 0.1 * w, 0.5 * h / N, "#ffffff", "#ffffff");
}

// --- ЗДАНИЯ ---

function decorative_wall_v2(g, x, y, w, h, color) {
	bound_create(g, x, y, w, h);
	return game_object_change_name(g, decorative_rectangle_create(g, x, y, w, h, color, "#222222"), "decorative_wall");
}

function decorative_wall_create(g, x, y, w, h) {
	return decorative_wall_v2(g, x, y, w, h, "#333333");
}

function decorative_building_create(g, x, y, w, h) {
	decorative_wall_create(g, x, y, w, h * 0.05);
	decorative_wall_create(g, x, y + 0.95 * h, w, h * 0.05);
	decorative_wall_create(g, x, y, w * 0.05, h);
	decorative_wall_create(g, x + 0.95 * w, y, w * 0.05, 0.4 * h);
	decorative_wall_create(g, x + 0.95 * w, y + 0.55 * h, w * 0.05, 0.4 * h);
	decorative_rectangle_create(g, x, y, w, h, "#555555", "#333333");
	// Крыша
	roof_rect_create(g, x + 0.01 * w, y + 0.01 * h, w * 0.98, h * 0.98, x, y, w, h, "#555555", "#333333");
}

function decorative_house_v2(g, x, y, w, h, door_side, wall_color, roof_color) {
	let sw = 20; // Толщина стен
	let dw = w * 0.2; // Ширина дверного проема (20% от стены)

	// Пол
	decorative_rectangle_create(g, x, y, w, h, "#443322", "transparent");

	// Функция для отрисовки стены с дверью
	let draw_wall_with_door = (sx, sy, sw_, sh_, horizontal) => {
		if (horizontal) {
			// Рисуем два сегмента стены, оставляя дырку dw посередине
			decorative_wall_v2(g, sx, sy, (sw_ - dw) / 2, sh_, wall_color);
			decorative_wall_v2(g, sx + (sw_ + dw) / 2, sy, (sw_ - dw) / 2, sh_, wall_color);
		} else {
			decorative_wall_v2(g, sx, sy, sw_, (sh_ - dw) / 2, wall_color);
			decorative_wall_v2(g, sx, sy + (sh_ + dw) / 2, sw_, (sh_ - dw) / 2, wall_color);
		}
	};

	// Стены: если это сторона с дверью — вызываем спец. функцию, если нет — рисуем сплошную
	// ВЕРХНЯЯ
	if (door_side === "up") draw_wall_with_door(x, y, w, sw, true);
	else decorative_wall_v2(g, x, y, w, sw, wall_color);

	// НИЖНЯЯ
	if (door_side === "down") draw_wall_with_door(x, y + h - sw, w, sw, true);
	else decorative_wall_v2(g, x, y + h - sw, w, sw, wall_color);

	// ЛЕВАЯ
	if (door_side === "left") draw_wall_with_door(x, y, sw, h, false);
	else decorative_wall_v2(g, x, y, sw, h, wall_color);

	// ПРАВАЯ
	if (door_side === "right") draw_wall_with_door(x + w - sw, y, sw, h, false);
	else decorative_wall_v2(g, x + w - sw, y, sw, h, wall_color);

	// Крыша
	roof_rect_create(g, x + 2, y + 2, w - 4, h - 4, x, y, w, h, roof_color, "#000000");
}

function decorative_hospital_v3(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#cccccc", "#999999");
	let sw = 30;
	decorative_wall_v2(g, x, y, w, sw, "#ffffff");
	decorative_wall_v2(g, x, y, sw, h, "#ffffff");
	decorative_wall_v2(g, x + w - sw, y, sw, h, "#ffffff");
	decorative_wall_v2(g, x, y + h - sw, w * 0.4, sw, "#ffffff");
	decorative_wall_v2(g, x + w * 0.6, y + h - sw, w * 0.4, sw, "#ffffff");

	// Плита крыши
	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, "#eeeeee", "#bbbbbb");
	// Декор на крыше
	let cx = x + w / 2;
	let cy = y + h / 2;
	roof_rect_create(g, cx - 80, cy - 20, 160, 40, x, y, w, h, "#1177ff", "#1177ff");
	roof_rect_create(g, cx - 20, cy - 80, 40, 160, x, y, w, h, "#1177ff", "#1177ff");
	roof_text_create(g, "CITY HOSPITAL", x + (w / 2) - 200, y + h - 100, 50, x, y, w, h, "#1177ff");
}

function decorative_police_station_v3(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#333333", "#111111");
	let sw = 25;
	decorative_wall_v2(g, x, y, w, sw, "#222266");
	decorative_wall_v2(g, x, y, sw, h, "#222266");
	decorative_wall_v2(g, x + w - sw, y, sw, h, "#222266");

	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, "#111144", "#000022");
	roof_text_create(g, "POLICE STATION", x + (w / 2) - 110, y + (h / 2) - 30, 60, x, y, w, h, "white");
}

function decorative_fire_station_v3(g, x, y, w, h) {
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#000000");
	let sw = 30;
	decorative_wall_v2(g, x, y, w, sw, "#992222");
	decorative_wall_v2(g, x, y, sw, h, "#992222");
	decorative_wall_v2(g, x + w - sw, y, sw, h, "#992222");

	roof_rect_create(g, x + 5, y + 5, w - 10, h - 10, x, y, w, h, "#771111", "#440000");
	roof_text_create(g, "FIRE DEPT", x + (w / 2) - 140, y + (h / 2) - 25, 50, x, y, w, h, "white");
}

function decorative_fuel_pump_draw(self, ctx) {
	let d = self.data;
	ctx.globalAlpha = d.transparency || 1.0;

	// 1. Основной корпус
	ctx.fillStyle = d.color_base;
	ctx.fillRect(d.x, d.y + d.h * 0.15, d.w, d.h * 0.85);

	// 2. Акцентная панель сверху (Цветная плашка)
	ctx.fillStyle = d.accent_color;
	ctx.fillRect(d.x, d.y, d.w, d.h * 0.25); // Немного увеличили высоту плашки

	// 3. Экран (под панелью)
	ctx.fillStyle = "#111111";
	ctx.fillRect(d.x + d.w * 0.1, d.y + d.h * 0.3, d.w * 0.8, d.h * 0.2);

	// 4. Текст ТЕПЕРЬ ВЫШЕ (на цветной плашке)
	ctx.font = "bold " + Math.floor(d.h * 0.18) + "px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillText(d.label, d.x + d.w / 2, d.y + d.h * 0.04);

	// 5. Шланг
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(d.x + d.w, d.y + d.h * 0.4);
	ctx.lineTo(d.x + d.w + 3, d.y + d.h * 0.8);
	ctx.stroke();

	ctx.globalAlpha = 1.0;
}

function decorative_fuel_pump_create(g, x, y, w = 45, h = 65, label = "95") {
	// Определяем цвет в зависимости от топлива
	let accent = "#00FF00"; // Зеленый для 95
	if (label === "98") accent = "#0088FF"; // Синий для 98
	if (label === "DT") accent = "#FFCC00"; // Желтый для дизеля

	bound_create(g, x, y + h * 0.5, w, h * 0.5);

	return game_object_create(g, "decorative_fuel_pump", {
		x,
		y,
		w,
		h,
		label,
		color_base: "#DDDDDD",
		accent_color: accent
	}, function() {}, decorative_fuel_pump_draw, function(o) {
		o.destroyed = true;
	});
}

function decorative_gas_station_create(g, x, y, w, h, level_visited = true) {
	// 1. Асфальт
	decorative_rectangle_create(g, x, y, w, h, "#333333", "#111111");

	// --- МАГАЗИН (25%) ---
	let shop_w = w * 0.25;
	decorative_building_create(g, x + w * 0.015, y + h * 0.1, shop_w, h * 0.8);

	// --- ЗАПРАВКА (75%) ---
	let gas_x = x + shop_w;
	let gas_w = w * 0.75;

	// Увеличенный навес
	let canopy_w = gas_w * 0.9;
	let canopy_h = h * 0.85;
	let canopy_x = gas_x + (gas_w - canopy_w) / 2;
	let canopy_y = y + (h - canopy_h) / 2;

	decorative_rectangle_create(g, canopy_x, canopy_y, canopy_w, canopy_h, "#444444", "#222222");

	// --- ТРК (Схема # # # / # # #) ---
	let rows = 2;
	let cols = 3;
	let pump_w = 45; // Сделали больше
	let pump_h = 65; // Сделали больше

	// Островки теперь горизонтальные и длинные
	let island_h = 30;
	let island_w = canopy_w * 0.8;

	for (let r = 0; r < rows; r++) {
		let iy = canopy_y + (canopy_h / (rows + 1)) * (r + 1) - (island_h / 2);
		let ix = canopy_x + (canopy_w - island_w) / 2;

		// Рисуем бетонный островок под ряд
		decorative_rectangle_create(g, ix, iy, island_w, island_h, "#888888", "#555555");

		for (let c = 0; c < cols; c++) {
			let px = ix + (island_w / (cols + 1)) * (c + 1) - (pump_w / 2);
			let py = iy - (pump_h * 0.7); // Ставим колонку "на" островок

			// Разные типы топлива для вариативности
			let fuels = ["95", "98", "DT"];
			decorative_fuel_pump_create(g, px, py, pump_w, pump_h, fuels[c]);
		}
	}
}

function decorative_parkinglot_create(g, x, y, w, h, level_visited = true, car_types = ["default"]) {
	// 1. Отрисовка асфальта
	decorative_rectangle_create(g, x, y, w, h, "#222222", "#222222");

	const TARGET_R = 205; // Желаемая ширина места
	const padding = w * 0.02; // Небольшой отступ по краям парковки
	const usableW = w - (padding * 2);

	// Вычисляем, сколько целых мест влезет
	let count = Math.floor(usableW / TARGET_R);
	if (count < 1) count = 1; // Минимум одно место

	// Расчитываем финальную ширину места, чтобы они заполнили пространство равномерно
	let actualR = usableW / count;

	for (let i = 0; i < count; i++) {
		// Координаты текущего парковочного места
		let spotX = x + padding + (i * actualR);
		let spotY = y;

		// 2. Рисуем разметку (левая линия каждого места)
		decorative_rectangle_create(g, spotX, spotY + h * 0.1, 4, h * 0.8, "white", "white");

		// Рисуем правую линию только для самого последнего места, чтобы закрыть контур
		if (i === count - 1) {
			decorative_rectangle_create(g, spotX + actualR, spotY + h * 0.1, 4, h * 0.8, "white", "white");
		}

		// 3. Номер парковочного места (центрируем по actualR)
		let fontSize = Math.floor(actualR * 0.2);
		let textVal = Math.floor(50 + Math.random() * 50);
		// Смещение текста: spotX + половина ширины - (примерная ширина текста / 2)
		decorative_text_create(g, textVal, spotX + (actualR / 2) - (fontSize / 2), spotY + h * 0.15, fontSize, "white");

		// 4. Логика создания машины
		if (!level_visited && Math.random() < 0.01) {
			// Центрируем машину: spotX + половина ширины места
			let carX = spotX + (actualR / 2);
			// Смещаем машину вглубь парковки
			let carY = spotY + h * 0.4;

			let color_h = Math.floor(Math.random() * 360);
			let color_s = Math.floor(Math.random() * 40 + 50);
			let color_l = Math.floor(Math.random() * 30 + 40);
			let randomColor = `hsl(${color_h}, ${color_s}%, ${color_l}%)`;

			let type = car_types[Math.floor(Math.random() * car_types.length)];
			car_create(g, carX, carY, randomColor, false, false, type);
		}
	}
}
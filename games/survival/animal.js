function animal_create(g, x, y, type = "deer") {
	// Разные размеры для разных животных
	let width = (type === "raccoon") ? 20 : 27.5;
	let height = (type === "raccoon") ? 20 : 27.5;

	// Оптимизация: ограничение количества животных
	let animals = g.objects.filter((obj) => obj.name == "animal");
	if (animals.length > 20) {
		for (let i = 0; i < animals.length - 20; i++)
			animals[i].destroy(animals[i]);
	}

	let a = {
		health: (type === "raccoon") ? 30 : 50,
		max_health: (type === "raccoon") ? 30 : 50,
		speed: (type === "raccoon") ? 8.5 : 6.25, // Еноты быстрее и суетливее
		w: width,
		h: height,
		type: type,
		body: Matter.Bodies.rectangle(x, y, width, height),
		movement_change_delay: 1000,
		moving_duration: 0
	};

	Matter.Composite.add(g.engine.world, a.body);
	return game_object_create(g, "animal", a, animal_update, animal_draw, animal_destroy);
}

function animal_destroy(ao) {
	if (ao.destroyed) return;
	Matter.Composite.remove(ao.game.engine.world, ao.data.body);
	ao.data.body = null;
	ao.destroyed = true;
}

function animal_update(ao, dt) {
	if (ao.destroyed || !ao.data.body) return;
	let a = ao.data;

	// Логика смерти
	if (a.health <= 0) {
		if (a.type === "raccoon") {
			if (Math.random() < 0.75) {
				let junk_id = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK.length)];
				item_create(ao.game, junk_id, a.body.position.x, a.body.position.y);
			}
			audio_play("data/sfx/raccoon_dies.mp3", 1.0);
		} else {
			if (Math.random() < 0.75) item_create(ao.game, ITEM_CANNED_MEAT, a.body.position.x, a.body.position.y);
			audio_play("data/sfx/deer_dies_1.mp3");
		}

		// Общий редкий дроп
		if (Math.random() < 0.0025) item_create(ao.game, ITEM_AMMO, a.body.position.x, a.body.position.y);

		animal_destroy(ao);
		return;
	}

	if (a.moving_duration > 0) a.moving_duration -= dt;
	if (a.movement_change_delay > 0) a.movement_change_delay -= Math.random() * dt;

	let dx = 0,
		dy = 0;

	// Поиск угроз
	let ho = game_object_find_closest(ao.game, a.body.position.x, a.body.position.y, "rocket", 500);
	if (!ho) ho = game_object_find_closest(ao.game, a.body.position.x, a.body.position.y, "enemy", 400);
	if (!ho) ho = game_object_find_closest(ao.game, a.body.position.x, a.body.position.y, "player", 300);

	if (ho) {
		// Убегаем от угрозы
		dx = a.body.position.x - ho.data.body.position.x;
		dy = a.body.position.y - ho.data.body.position.y;
		let d = Math.sqrt(dx * dx + dy * dy);
		dx = (dx / d) * a.speed;
		dy = (dy / d) * a.speed;
	} else if (a.movement_change_delay < 0) {
		// Случайное блуждание
		dx = 2 * Math.random() - 1;
		dy = 2 * Math.random() - 1;
		let d = Math.sqrt(dx * dx + dy * dy);
		if (d > 0) {
			dx = (dx / d) * a.speed;
			dy = (dy / d) * a.speed;
		}
	}

	if (dx !== 0 || dy !== 0) {
		Matter.Body.setVelocity(a.body, Matter.Vector.create(dx, dy));
		a.moving_duration = Math.random() * (a.type === "raccoon" ? 3000 : 10000);
		a.movement_change_delay = (a.type === "raccoon" ? 400 : 1000); // Енот чаще меняет решение
	}
}

function animal_draw(ao, ctx) {
	let a = ao.data;
	if (a.type === "piginator") return;

	let x = a.body.position.x;
	let y = a.body.position.y;

	if (a.type === "raccoon") {
		animal_raccoon_draw(ctx, x, y, a.w, a.h, a);
	} else {
		// Рисуем Оленя
		animal_deer_draw_horns(ctx, x, y, a.w);
		fillMatterBody(ctx, a.body, "#aa8844");
		drawMatterBody(ctx, a.body, "white", 0.05 * a.w);
	}

	// Индикаторы здоровья
	if (ao.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(x - a.w / 2, y - 0.75 * a.h, a.w, a.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(x - a.w / 2, y - 0.75 * a.h, a.w * Math.max(0, a.health) / a.max_health, a.h * 0.05);
	}
}

function animal_deer_draw_horns(ctx, x, y, w) {
	ctx.strokeStyle = "brown";
	ctx.lineWidth = 0.1 * w;
	// Левый рог
	drawLine(ctx, x - 0.5 * w, y - 0.5 * w, x - 0.525 * w, y - 0.75 * w, "brown", 0.1 * w);
	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.95 * w, y - 1 * w, "brown", 0.1 * w);
	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.475 * w, y - 1.05 * w, "brown", 0.1 * w);
	// Правый рог
	drawLine(ctx, x + 0.5 * w, y - 0.5 * w, x + 0.525 * w, y - 0.75 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.95 * w, y - 1 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.475 * w, y - 1.05 * w, "brown", 0.1 * w);
}

function animal_raccoon_draw(ctx, x, y, w, h, a) {
	// 1. Ушки (треугольники сверху)
	ctx.fillStyle = "#555555";
	// Левое ухо
	ctx.beginPath();
	ctx.moveTo(x - w * 0.4, y - h * 0.5);
	ctx.lineTo(x - w * 0.5, y - h * 0.8);
	ctx.lineTo(x - w * 0.2, y - h * 0.5);
	ctx.fill();
	// Правое ухо
	ctx.beginPath();
	ctx.moveTo(x + w * 0.4, y - h * 0.5);
	ctx.lineTo(x + w * 0.5, y - h * 0.8);
	ctx.lineTo(x + w * 0.2, y - h * 0.5);
	ctx.fill();

	// 2. Тело (основной квадрат)
	fillMatterBody(ctx, a.body, "#777777");
	drawMatterBody(ctx, a.body, "#444444", 2);

	// 3. Маска (черная полоса посередине)
	ctx.fillStyle = "#222222";
	ctx.fillRect(x - w * 0.5, y - h * 0.2, w, h * 0.35);

	// 4. Глаза
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(x - w * 0.22, y - h * 0.05, w * 0.08, 0, Math.PI * 2); // Левый
	ctx.arc(x + w * 0.22, y - h * 0.05, w * 0.08, 0, Math.PI * 2); // Правый
	ctx.fill();

	// Зрачки
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(x - w * 0.22, y - h * 0.05, w * 0.03, 0, Math.PI * 2);
	ctx.arc(x + w * 0.22, y - h * 0.05, w * 0.03, 0, Math.PI * 2);
	ctx.fill();

	// 5. Носик
	ctx.fillStyle = "#111111";
	ctx.beginPath();
	ctx.arc(x, y + h * 0.15, w * 0.05, 0, Math.PI * 2);
	ctx.fill();

	// 6. Полосатый хвост (горизонтальный сзади)
	let tailX = x - w * 0.5;
	let tailY = y + h * 0.2;
	ctx.lineWidth = h * 0.2;

	for (let i = 0; i < 5; i++) {
		ctx.strokeStyle = (i % 2 === 0) ? "#333333" : "#999999";
		ctx.beginPath();
		ctx.moveTo(tailX - (i * w * 0.15), tailY);
		ctx.lineTo(tailX - ((i + 1) * w * 0.15), tailY);
		ctx.stroke();
	}
}

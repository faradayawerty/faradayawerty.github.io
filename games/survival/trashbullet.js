/**
 * trashbullet.js
 * Снаряды-мусор для Енота-босса.
 * Использует систему отрисовки из item.js
 */

function trash_bullet_create(g, x, y, dx, dy, speed = 15, damage = 0.5, enemy = true, size = 20) {
	// Ограничение количества мусора на экране для оптимизации
	let trash_bullets = g.objects.filter((obj) => obj.name == "trash_bullet");
	if (trash_bullets.length > 150) {
		for (let i = 0; i < trash_bullets.length - 150; i++)
			trash_bullets[i].destroy(trash_bullets[i]);
	}

	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) d = 1;

	// Выбираем случайный хлам из твоего списка ITEMS_JUNK
	let trash_id = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK.length)];

	let b = {
		lifetime: 2000,
		damage: damage,
		speed: speed,
		w: size,
		h: size,
		id: trash_id, // Храним ID предмета для отрисовки
		angle: Math.random() * Math.PI * 2,
		rotation_speed: (Math.random() - 0.5) * 0.2, // Скорость вращения
		body: Matter.Bodies.rectangle(x + 30 * dx / d, y + 30 * dy / d, size, size),
		enemy: enemy
	};

	if (b.enemy) {
		b.body.collisionFilter.category = 4;
	} else {
		b.body.collisionFilter.mask = -5;
	}

	Matter.Composite.add(g.engine.world, b.body);

	let vel = Matter.Vector.create(speed * dx / d, speed * dy / d);
	Matter.Body.setVelocity(b.body, vel);

	return game_object_create(g, "trashbullet", b, trash_bullet_update, trash_bullet_draw, trash_bullet_destroy);
}

function trash_bullet_destroy(bullet_object) {
	if (bullet_object.destroyed) return;
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data.body);
	bullet_object.data.body = null;
	bullet_object.destroyed = true;
}

function trash_bullet_update(bullet_object, dt) {
	if (bullet_object.destroyed) return;

	let b = bullet_object.data;
	let g = bullet_object.game;

	// Вращение и время жизни
	b.angle += b.rotation_speed * dt;
	b.lifetime -= dt;
	if (b.lifetime < 0) {
		trash_bullet_destroy(bullet_object);
		return;
	}

	// --- ЛОГИКА ВЗАИМОДЕЙСТВИЯ (на основе bullet.js) ---

	// 1. Проверка попадания по врагам/объектам (если пуля игрока)
	for (let i = 0; i < g.objects.length; i++) {
		let target = g.objects[i];
		if (!target.data.body || target.destroyed) continue;

		if ((target.name == "enemy" || target.name == "car" || target.name == "animal") &&
			Matter.Collision.collides(b.body, target.data.body) != null) {

			// Наносим урон
			if (target.name == "enemy" && !b.enemy) {
				target.data.health -= b.damage * dt;
				target.data.hit_by_player = true;
			} else {
				target.data.health -= b.damage * dt;
			}
			// Мусор исчезает при попадании (можно закомментировать, если хочешь, чтобы он пролетал насквозь)
			// trash_bullet_destroy(bullet_object);
		}
	}

	// 2. Проверка попадания по ИГРОКУ (если пуля вражеская)
	if (b.enemy) {
		let player = game_object_find_closest(g, b.body.position.x, b.body.position.y, "player", 100);
		if (player && Matter.Collision.collides(b.body, player.data.body) != null) {
			let pd = player.data;

			// Логика щитов
			if (pd.shield_blue_health > 0) {
				pd.shield_blue_health -= 0.95 * b.damage * dt;
			} else if (pd.shield_green_health > 0) {
				pd.shield_green_health -= 0.75 * b.damage * dt;
			} else if (pd.shield_rainbow_health > 0) {
				pd.shield_rainbow_health -= 0.55 * b.damage * dt;
			} else if (pd.immunity <= 0) {
				// Защита мечом/рогом
				let k = 1.0;
				if (pd.sword_protection) {
					k = 0.05; // Меч
					if (hotbar_get_selected_item(pd.hotbar_element) == ITEM_HORN)
						k = 0.001; // Рог (почти полный иммунитет)
				}
				pd.health -= k * b.damage * dt;
			}
			// trash_bullet_destroy(bullet_object);
		}
	}
}

function trash_bullet_draw(bullet_object, ctx) {
	let b = bullet_object.data;
	let x = b.body.position.x;
	let y = b.body.position.y;

	ctx.save();

	// Переносим центр координат в пулю и вращаем контекст
	ctx.translate(x, y);
	ctx.rotate(b.angle);

	// Вызываем твою функцию из item.js. 
	// Рисуем от центра (-w/2, -h/2), чтобы вращение было правильным
	item_icon_draw(ctx, b.id, -b.w / 2, -b.h / 2, b.w, b.h, 0);

	ctx.restore();
}
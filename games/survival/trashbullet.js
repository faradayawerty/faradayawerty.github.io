const TRASH_BULLET_POOL = [];

function trash_bullet_create(g, x, y, dx, dy, speed = 15, damage = 0.5, enemy =
	true, size = 20, items = ITEMS_JUNK) {
	let trash_bullets = g.collections["trashbullet"];
	if (trash_bullets && trash_bullets.length > 150) {
		let to_remove = trash_bullets.length - 150;
		for (let i = 0; i < to_remove; i++) {
			if (trash_bullets[i]) trash_bullets[i].destroy(trash_bullets[i]);
		}
	}
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) d = 1;
	let trash_id = items[Math.floor(Math.random() * items.length)];
	let bullet_object;
	let b;
	let spawnX = x + 30 * dx / d;
	let spawnY = y + 30 * dy / d;
	if (TRASH_BULLET_POOL.length > 0) {
		bullet_object = TRASH_BULLET_POOL.pop();
		b = bullet_object.data;
		b.lifetime = 2000;
		b.damage = damage;
		b.speed = speed;
		b.w = size;
		b.h = size;
		b.id = trash_id;
		b.angle = Math.random() * Math.PI * 2;
		b.rotation_speed = (Math.random() - 0.5) * 0.1;
		b.enemy = enemy;
		b.damaged = false;
		let body = b.body;
		Matter.Body.setPosition(body, {
			x: spawnX,
			y: spawnY
		});
		Matter.Body.setAngle(body, b.angle);
		Matter.Body.setVelocity(body, {
			x: 0,
			y: 0
		});
		bullet_object.prevX = spawnX;
		bullet_object.prevY = spawnY;
		bullet_object.destroyed = false;
	}
	else {
		b = {
			lifetime: 2000,
			damage: damage,
			speed: speed,
			w: size,
			h: size,
			id: trash_id,
			angle: Math.random() * Math.PI * 2,
			rotation_speed: (Math.random() - 0.5) * 0.1,
			body: Matter.Bodies.rectangle(spawnX, spawnY, size, size),
			enemy: enemy,
			damaged: false
		};
		bullet_object = null;
	}
	let body = b.body;
	body.collisionFilter.group = 0;
	body.collisionFilter.category = 1;
	body.collisionFilter.mask = 0xFFFFFFFF;
	if (b.enemy) {
		body.collisionFilter.category = 4;
		if (typeof ownerId !== 'undefined' && ownerId !== 0) {
			body.collisionFilter.group = -ownerId;
		}
	}
	else {
		body.collisionFilter.group = -1;
		body.collisionFilter.mask = 0xFFFFFFFF;
	}
	Matter.Composite.add(g.engine.world, body);
	Matter.Body.setVelocity(body, {
		x: speed * dx / d,
		y: speed * dy / d
	});
	if (bullet_object) {
		bullet_object.game = g;
		if (!g.collections["trashbullet"]) g.collections["trashbullet"] = [];
		g.collections["trashbullet"].push(bullet_object);
		const newWeight = GAME_OBJECT_WEIGHTS["trashbullet"] || 0;
		let insertIndex = g.objects.length;
		for (let i = 0; i < g.objects.length; i++) {
			let currentWeight = GAME_OBJECT_WEIGHTS[g.objects[i].name] || 0;
			if (newWeight > currentWeight) {
				insertIndex = i;
				break;
			}
		}
		g.objects.splice(insertIndex, 0, bullet_object);
		return insertIndex;
	}
	else {
		let idx = game_object_create(g, "trashbullet", b, trash_bullet_update,
			trash_bullet_draw, trash_bullet_destroy);
		let createdObj = g.objects[idx];
		b.body.gameObject = createdObj;
		createdObj.prevX = spawnX;
		createdObj.prevY = spawnY;
		return idx;
	}
}

function trash_bullet_destroy(bullet_object) {
	if (bullet_object.destroyed) return;
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data
		.body);
	bullet_object.destroyed = true;
	TRASH_BULLET_POOL.push(bullet_object);
}

function trash_bullet_update(bullet_object, dt) {
	if (bullet_object.destroyed) return;
	let b = bullet_object.data;
	if (b.damaged) {
		trash_bullet_destroy(bullet_object);
		return;
	}
	b.angle += b.rotation_speed * dt;
	b.lifetime -= dt;
	if (b.lifetime < 0) {
		trash_bullet_destroy(bullet_object);
		return;
	}
}

function trash_bullet_draw(bullet_object, ctx) {
	let b = bullet_object.data;
	let x = b.body.position.x;
	let y = b.body.position.y;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(b.angle);
	item_icon_draw(ctx, b.id, -b.w / 2, -b.h / 2, b.w, b.h, 0);
	ctx.restore();
}
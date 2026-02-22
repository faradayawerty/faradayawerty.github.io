function trash_bullet_create(g, x, y, dx, dy, speed = 15, damage = 0.5, enemy =
	true, size = 20, items = ITEMS_JUNK) {
	let trash_bullets = g.objects.filter((obj) => obj.name == "trash_bullet");
	if (trash_bullets.length > 150) {
		for (let i = 0; i < trash_bullets.length - 150; i++)
			trash_bullets[i].destroy(trash_bullets[i]);
	}
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) d = 1;
	let trash_id = items[Math.floor(Math.random() * items.length)];
	let b = {
		lifetime: 2000,
		damage: damage,
		speed: speed,
		w: size,
		h: size,
		id: trash_id,
		angle: Math.random() * Math.PI * 2,
		rotation_speed: (Math.random() - 0.5) * 0.1,
		body: Matter.Bodies.rectangle(x + 30 * dx / d, y + 30 * dy / d,
			size, size),
		enemy: enemy
	};
	b.body.gameObject = {
		name: "trashbullet",
		data: b
	};
	if (b.enemy) {
		b.body.collisionFilter.category = 4;
	}
	else {
		b.body.collisionFilter.mask = -5;
	}
	Matter.Composite.add(g.engine.world, b.body);
	let vel = Matter.Vector.create(speed * dx / d, speed * dy / d);
	Matter.Body.setVelocity(b.body, vel);
	return game_object_create(g, "trashbullet", b, trash_bullet_update,
		trash_bullet_draw, trash_bullet_destroy);
}

function trash_bullet_destroy(bullet_object) {
	if (bullet_object.destroyed) return;
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data
		.body);
	bullet_object.data.body = null;
	bullet_object.destroyed = true;
}

function trash_bullet_update(bullet_object, dt) {
	if (bullet_object.destroyed) return;
	let b = bullet_object.data;
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
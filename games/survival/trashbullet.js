function trash_bullet_create(g, x, y, dx, dy, speed = 15, damage = 0.5, enemy = true, size = 20) {
	let trash_bullets = g.objects.filter((obj) => obj.name == "trash_bullet");
	if (trash_bullets.length > 150) {
		for (let i = 0; i < trash_bullets.length - 150; i++)
			trash_bullets[i].destroy(trash_bullets[i]);
	}
	let d = Math.sqrt(dx * dx + dy * dy);
	if (d === 0) d = 1;
	let trash_id = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK.length)];
	let b = {
		lifetime: 2000,
		damage: damage,
		speed: speed,
		w: size,
		h: size,
		id: trash_id,
		angle: Math.random() * Math.PI * 2,
		rotation_speed: (Math.random() - 0.5) * 0.2,
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
	b.angle += b.rotation_speed * dt;
	b.lifetime -= dt;
	if (b.lifetime < 0) {
		trash_bullet_destroy(bullet_object);
		return;
	}
	for (let i = 0; i < g.objects.length; i++) {
		let target = g.objects[i];
		if (!target.data.body || target.destroyed) continue;
		if ((target.name == "enemy" || target.name == "car" || target.name == "animal") &&
			Matter.Collision.collides(b.body, target.data.body) != null) {
			if (target.name == "enemy" && !b.enemy) {
				target.data.health -= b.damage * dt;
				target.data.hit_by_player = true;
			} else {
				target.data.health -= b.damage * dt;
			}
		}
	}
	if (b.enemy) {
		let player = game_object_find_closest(g, b.body.position.x, b.body.position.y, "player", 100);
		if (player && Matter.Collision.collides(b.body, player.data.body) != null) {
			let pd = player.data;
			if (pd.shield_blue_health > 0) {
				pd.shield_blue_health -= 0.95 * b.damage * dt;
			} else if (pd.shield_green_health > 0) {
				pd.shield_green_health -= 0.75 * b.damage * dt;
			} else if (pd.shield_rainbow_health > 0) {
				pd.shield_rainbow_health -= 0.55 * b.damage * dt;
			} else if (pd.immunity <= 0) {
				let k = 1.0;
				if (pd.sword_protection) {
					k = 0.05;
					if (hotbar_get_selected_item(pd.hotbar_element) == ITEM_HORN)
						k = 0.001;
				}
				pd.health -= k * b.damage * dt;
			}
		}
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
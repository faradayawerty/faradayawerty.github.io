function bullet_create(g, x, y, dx, dy, speed = 20, damage = 0.5, enemy = false,
	size = 6, lifetime = 1500, color_fill = "yellow", color_outline = "orange",
	invisible = false, poisoned = false, glowColor = null) {
	let width = size,
		height = size;
	let d = Math.sqrt(dx * dx + dy * dy);
	let b = {
		lifetime: lifetime,
		damage: damage,
		speed: speed,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x + 25 * dx / d, y + 25 * dy / d,
			width, height),
		enemy: enemy,
		color_fill: color_fill,
		color_outline: color_outline,
		invisible: invisible,
		can_hit: true,
		poisoned: poisoned,
		color_glow: glowColor,
	};
	if (b.enemy)
		b.body.collisionFilter.category = 4;
	else
		b.body.collisionFilter.mask = 0xFFFFFFFF;
	Matter.Composite.add(g.engine.world, b.body);
	let vel = Matter.Vector.create(b.speed * dx / d, b.speed * dy / d);
	Matter.Body.setVelocity(b.body, vel);
	return game_object_create(g, "bullet", b, bullet_update, bullet_draw,
		bullet_destroy);
}

function bullet_destroy(bullet_object) {
	if (bullet_object.destroyed)
		return;
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data
		.body);
	bullet_object.data.body = null;
	bullet_object.destroyed = true;
}

function bullet_update(bullet_object, dt) {
	if (bullet_object.destroyed)
		return;
	let b = bullet_object.data;
	if (b.lifetime < 0) {
		bullet_destroy(bullet_object);
		return;
	}
	else {
		b.lifetime -= dt;
	}
	if (bullet_object.bullet_num < bullet_object.game.last_bullet_num -
		BULLET_LIMIT) {
		bullet_destroy(bullet_object);
		return;
	}
	if (!b.enemy && bullet_object.name === "bullet") {
		let start = b.body.positionPrev;
		let end = b.body.position;
		let bodies = Matter.Composite.allBodies(bullet_object.game.engine
			.world);
		let collisions = Matter.Query.ray(bodies, start, end);
		for (let i = 0; i < collisions.length; i++) {
			let target = collisions[i].body.gameObject;
			if (target && target.name === "rocket" && target.data.enemy) {
				target.data.health -= 10;
				bullet_destroy(bullet_object);
				return;
			}
		}
	}
}

function bullet_draw(bullet_object, ctx) {
	if (bullet_object.data.invisible) return;
	let b = bullet_object.data;
	ctx.save();
	if (b.color_glow) {
		ctx.shadowBlur = 10;
		ctx.shadowColor = b.color_glow;
	}
	fillMatterBody(ctx, b.body, b.color_fill);
	drawMatterBody(ctx, b.body, b.color_outline, 1);
	ctx.restore();
}
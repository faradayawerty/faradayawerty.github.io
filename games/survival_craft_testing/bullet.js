function bullet_create(g, x, y, dx, dy, speed = 20, damage = 0.5, enemy = false,
	size = 6, lifetime = 1500, color_fill = COLORS_DEFAULT.bullets.default_fill,
	color_outline = COLORS_DEFAULT.bullets.default_outline,
	invisible = false, poisoned = false, glowColor = null, fire = false, ice =
	false, electric = false, fired_by = null, gives_regen = false) {
	let width = size,
		height = size;
	let d = Math.sqrt(dx * dx + dy * dy);
	let invD = 1.0 / d;
	let chance = Math.random();
	let hasGlow = false;
	if (enemy) {
		if (chance < 0.25) hasGlow = true;
	}
	else {
		if (chance < 0.5) hasGlow = true;
	}
	let b = {
		lifetime: lifetime,
		damage: damage,
		speed: speed,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x + 25 * dx * invD, y + 25 * dy *
			invD,
			width, height),
		enemy: enemy,
		color_fill: color_fill,
		color_outline: color_outline,
		invisible: invisible,
		can_hit: true,
		poisoned: poisoned,
		color_glow: glowColor,
		has_glow_effect: hasGlow,
		damaged: false,
		fire: fire,
		ice: ice,
		electric: electric
	};
	if (b.enemy) {
		b.body.collisionFilter.category = 4;
		b.body.collisionFilter.mask = 1;
	}
	else {
		b.body.collisionFilter.category = 2;
		b.body.collisionFilter.mask = 0xFFFFFFFF;
	}
	Matter.Composite.add(g.engine.world, b.body);
	let vel = Matter.Vector.create(b.speed * dx * invD, b.speed * dy * invD);
	Matter.Body.setVelocity(b.body, vel);
	return game_object_create(g, "bullet", b, bullet_update, bullet_draw,
		bullet_destroy);
}

function bullet_destroy(bullet_object) {
	if (bullet_object.destroyed)
		return;
	if (bullet_object.data.body) {
		Matter.Composite.remove(bullet_object.game.engine.world, bullet_object
			.data.body);
		bullet_object.data.body.gameObject = null;
		bullet_object.data.body = null;
	}
	bullet_object.destroyed = true;
}

function bullet_update(bullet_object, dt) {
	if (bullet_object.destroyed)
		return;
	let b = bullet_object.data;
	let g = bullet_object.game;
	if (b.damaged) {
		bullet_destroy(bullet_object);
		return;
	}
	if (b.lifetime < 0) {
		bullet_destroy(bullet_object);
		return;
	}
	else {
		b.lifetime -= dt;
	}
	if (bullet_object.bullet_num < g.last_bullet_num - BULLET_LIMIT) {
		bullet_destroy(bullet_object);
		return;
	}
}

function bullet_draw(bullet_object, ctx) {
	if (bullet_object.data.invisible || !bullet_object.data.body) return;
	let b = bullet_object.data;
	ctx.save();
	if (b.color_glow && b.has_glow_effect) {
		ctx.shadowBlur = 10;
		ctx.shadowColor = b.color_glow;
	}
	fillMatterBody(ctx, b.body, b.color_fill);
	drawMatterBody(ctx, b.body, b.color_outline, 1);
	ctx.restore();
}
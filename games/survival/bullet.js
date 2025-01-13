
function bullet_create(g, x, y, dx, dy, speed=20, damage=0.5, enemy=false, size=6, lifetime=1500, color_fill="yellow", color_outline="orange") {
	let bullets = g.objects.filter((obj) => obj.name == "bullet");
	if(bullets.length > 500)
		for(let i = 0; i < 50 * Math.random() + 50; i++) {
			if(!bullets[i].destroyed)
				bullets[i].destroy(bullets[i]);
		}
	let width = size, height = size;
	let d = Math.sqrt(dx*dx + dy*dy);
	let b = {
		lifetime: lifetime,
		damage: damage,
		speed: speed,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x + 25 * dx/d, y + 25 * dy/d, width, height),
		enemy: enemy,
		color_fill: color_fill,
		color_outline: color_outline
	};
	if(b.enemy)
		b.body.collisionFilter.category = 4;
	else
		b.body.collisionFilter.mask = -5;
	Matter.Composite.add(g.engine.world, b.body);
	let vel = Matter.Vector.create(b.speed * dx/d, b.speed * dy/d);
	Matter.Body.setVelocity(b.body, vel);
	return game_object_create(g, "bullet", b, bullet_update, bullet_draw, bullet_destroy);
}

function bullet_destroy(bullet_object) {
	if(bullet_object.destroyed)
		return;
	Matter.Composite.remove(bullet_object.game.engine.world, bullet_object.data.body);
	bullet_object.data.body = null;
	bullet_object.destroyed = true;
}

function bullet_update(bullet_object, dt) {
	if(bullet_object.destroyed)
		return;
	if(bullet_object.data.lifetime < 0) {
		bullet_destroy(bullet_object);
		return;
	} else {
		bullet_object.data.lifetime -= dt;
	}
	for(let i = 0; i < bullet_object.game.objects.length; i++) {
		if(!bullet_object.game.objects[i].data.body)
			continue;
		if((bullet_object.game.objects[i].name == "enemy"
			|| bullet_object.game.objects[i].name == "car"
			|| bullet_object.game.objects[i].name == "rocket")
			&& Matter.Collision.collides(bullet_object.data.body, bullet_object.game.objects[i].data.body) != null) {
			if(bullet_object.game.objects[i].name == "car" && bullet_object.game.objects[i].data.is_tank && !bullet_object.game.objects[i].data.enemy) {
				continue;
			} else if(bullet_object.game.objects[i].name == "enemy" && !bullet_object.data.enemy) {
				bullet_object.game.objects[i].data.health -= bullet_object.data.damage * dt;
				bullet_object.game.objects[i].data.hit_by_player = true;
			} else if(bullet_object.game.objects[i].name != "enemy") {
				bullet_object.game.objects[i].data.health -= bullet_object.data.damage * dt;
			}
		}
	}
	bullet_object.game.player_object = game_object_find_closest(bullet_object.game,
		bullet_object.data.body.position.x, bullet_object.data.body.position.y, "player", 100);
	if(bullet_object.data.enemy && bullet_object.game.player_object
		&& Matter.Collision.collides(bullet_object.data.body, bullet_object.game.player_object.data.body) != null) {
		if(bullet_object.game.player_object.data.shield_blue_health > 0) {
				bullet_object.game.player_object.data.shield_blue_health -= 0.25 * bullet_object.data.damage * dt;
		} else if(bullet_object.game.player_object.data.immunity <= 0) {
			let k = 1.0;
			if(bullet_object.game.player_object.data.sword_visible)
				k = 0.05;
			bullet_object.game.player_object.data.health -= k * bullet_object.data.damage * dt;
		}
	}
}

function bullet_draw(bullet_object, ctx) {
	fillMatterBody(ctx, bullet_object.data.body, bullet_object.data.color_fill);
	drawMatterBody(ctx, bullet_object.data.body, bullet_object.data.color_outline, 1);
}


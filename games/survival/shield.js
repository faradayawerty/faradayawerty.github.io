
function shield_create(g, attachement_object, r, health) {
	let sh = {
		health: health,
		max_health: health,
		r: r,
		attachement_object: attachement_object,
		body: Matter.Bodies.circle(attachement_object.data.body.position.x, attachement_object.data.body.position.x, r)
	};
	sh.body.collisionFilter.category = 8;
	Matter.Composite.add(g.engine.world, sh.body);
	return game_object_create(g, "shield", sh, shield_update, shield_draw, shield_destroy);
}

function shield_destroy(shield_object) {
	if(!shield_object || shield_object.destroyed)
		return;
	console.log(shield_object);
	Matter.Composite.remove(shield_object.game.engine.world, shield_object.data.body);
	shield_object.destroyed = true;
}

function shield_update(shield_object, dt) {
	if(!shield_object)
		return;
	if(shield_object.data.health <= 0
		|| !shield_object.data.attachement_object
		|| shield_object.data.attachement_object.destroyed)
		shield_destroy(shield_object);
	shield_object.data.health -= 0.01 * dt;
	shield_object.data.body.position.x = shield_object.data.attachement_object.data.body.position.x;
	shield_object.data.body.position.y = shield_object.data.attachement_object.data.body.position.y;
}

function shield_draw(shield_object, ctx) {
	ctx.globalAlpha = 0.25;
	fillMatterBody(ctx, shield_object.data.body, "#115577");
	ctx.globalAlpha = 1.0;
	drawMatterBody(ctx, shield_object.data.body, "#115577");
	let e = shield_object.data;
	let r = shield_object.data.r;
	ctx.fillStyle = "gray";
	ctx.fillRect(e.body.position.x - e.r, e.body.position.y - 1.25 * r, 2 * r, r * 0.05);
	ctx.fillStyle = "cyan";
	ctx.fillRect(e.body.position.x - e.r, e.body.position.y - 1.25 * r, 2 * r * e.health / e.max_health, r * 0.05);
}


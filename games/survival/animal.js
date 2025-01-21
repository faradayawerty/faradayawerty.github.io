
function animal_create(g, x, y, type="deer") {
	let width = 27.5, height = 27.5;
	let animals = g.objects.filter((obj) => obj.name == "animal");
	if(animals.length > 20) {
		for(let i = 0; i < animals.length - 20; i++)
			animals[i].destroy(animals[i]);
	}
	let a = {
		health: 50,
		max_health: 50,
		speed: 6.25,
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
	if(ao.destroyed)
		return;
	Matter.Composite.remove(ao.game.engine.world, ao.data.body);
	ao.data.body = null;
	ao.destroyed = true;
}

function animal_update(ao, dt) {

	if(ao.destroyed || !ao.data.body)
		return;

	let a = ao.data;

	if(a.health <= 0) {
		if(Math.random() < 0.75)
			item_create(ao.game, ITEM_CANNED_MEAT, a.body.position.x, a.body.position.y);
		if(Math.random() < 0.075)
			item_create(ao.game, ITEM_AMMO, a.body.position.x, a.body.position.y);
		if(Math.random() < 0.0075)
			item_create(ao.game, ITEM_HEALTH_GREEN, a.body.position.x, a.body.position.y);
		audio_play("data/sfx/deer_dies_1.mp3");
		animal_destroy(ao);
		return;
	}

	if(a.moving_duration > 0)
		a.moving_duration -= dt;
	if(a.movement_change_delay > 0)
		a.movement_change_delay -= Math.random() * dt;

	let dx = 0, dy = 0;

 	if(a.movement_change_delay < 0) {
		dx = Math.random();
		dy = Math.random();
		let d = Math.sqrt(dx*dx + dy*dy);
		dx = -a.speed * dx / d;
		dy = -a.speed * dy / d;
	}

	let ho = game_object_find_closest(ao.game, ao.data.body.position.x, ao.data.body.position.y, "rocket", 500);
	if(!ho)
		ho = game_object_find_closest(ao.game, ao.data.body.position.x, ao.data.body.position.y, "enemy", 400);
	if(!ho)
		ho = game_object_find_closest(ao.game, ao.data.body.position.x, ao.data.body.position.y, "player", 300);
	if(ho) {
		dx = ho.data.body.position.x - a.body.position.x;
		dy = ho.data.body.position.y - a.body.position.y;
		let d = Math.sqrt(dx*dx + dy*dy);
		dx = -a.speed * dx / d;
		dy = -a.speed * dy / d;
	}

	if(dx*dx + dy*dy > 0.5 || a.movement_change_delay < 0) {
		Matter.Body.setVelocity(a.body, Matter.Vector.create(dx, dy));
		a.moving_duration = Math.random() * 10000;
		a.movement_change_delay = 1000;
	}
}

function animal_draw(ao, ctx) {

	let e = ao.data;

	if(ao.data.type == "piginator")
		return;
	else {
		animal_deer_draw_horns(ctx, ao.data.body.position.x, ao.data.body.position.y, ao.data.w);
		drawMatterBody(ctx, ao.data.body, "white", 0.05 * ao.data.w);
		fillMatterBody(ctx, ao.data.body, "#aa8844");
	}

	if(ao.game.settings.indicators["show enemy health"] && e.health >= 0) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.65 * e.h, e.w, e.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.65 * e.h, e.w * e.health / e.max_health, e.h * 0.05);
	}

}

function animal_deer_draw_horns(ctx, x, y, w) {

	drawLine(ctx, x - 0.5 * w, y - 0.5 * w, x - 0.525 * w, y - 0.75 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.5 * w, y - 0.5 * w, x + 0.525 * w, y - 0.75 * w, "brown", 0.1 * w);

	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.95 * w, y - 1 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.95 * w, y - 1 * w, "brown", 0.1 * w);

	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.475 * w, y - 1.05 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.475 * w, y - 1.05 * w, "brown", 0.1 * w);

	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.75 * w, y - 1.15 * w, "brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.75 * w, y - 1.15 * w, "brown", 0.1 * w);

}


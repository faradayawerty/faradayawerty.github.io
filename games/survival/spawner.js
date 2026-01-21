function spawner_create(g, x_, y_, w_, h_, func_spawn, limit, overall_limit, delay, color = 'orange') {
	let s = {
		spawn: func_spawn, // (g, x, y)
		x: x_,
		y: y_,
		w: w_,
		h: h_,
		color: color,
		limit: limit,
		overall_limit: overall_limit,
		delay: delay,
		max_delay: delay
	};
	return game_object_create(g, "spawner", s,
		spawner_update, spawner_draw, spawner_destroy,
		"spawner_" + x_ + ":" + y_ + ":" + w_ + ":" + h_);
}

function spawner_destroy(spawner_object) {
	spawner_object.destroyed = true;
}

function spawner_update(spawner_object, dt) {
	if (spawner_object.data.delay < 0) {
		spawner_object.spawn(spawner_object.game,
			spawner_object.data.x + Math.random() * spawner_object.data.w,
			spawner_object.data.y + Math.random() * spawner_object.data.h);
		spawner_object.data.delay = spawner_object.data.max_delay;
		spawner_object.data.overall_limit -= 1;
	} else {
		spawner_object.data.delay -= dt;
	}
}

function spawner_draw(spawner_object, ctx) {
	ctx.strokeColor = spawner_object.data.color;
	ctx.strokeRect(spawner_object.data.x, spawner_object.data.y, spawner_object.data.w, spawner_object.data.h);
}

/* preset spawn functions */

function spawn_item(g, x, y) {
	let items = [
		ITEM_AMMO,
		ITEM_GUN,
		ITEM_HEALTH
	].concat(ITEMS_FOODS).concat(ITEMS_DRINKS);
	item_create(g, items[Math.floor(items.length * Math.random())], x, y);
}
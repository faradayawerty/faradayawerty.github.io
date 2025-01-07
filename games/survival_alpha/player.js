
function player_create(g, x, y, respawn=false) {
	let width = 40, height = 40;
	let p = {
		health: 100,
		max_health: 100,
		thirst: 150,
		max_thirst: 150,
		hunger: 150,
		max_hunger: 150,
		speed: 10,
		max_speed: 10,
		shot_cooldown: 0,
		want_level: g.level,
		w: width,
		h: height,
		infobox_element: null,
		inventory_element: null,
		hotbar_element: null,
		car_object: null,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			inertia: Infinity
		})
	};
	p.infobox_element = g.gui_elements[infobox_create(g, 40, 100, 4)];
	p.inventory_element = g.gui_elements[inventory_create(g)];
	p.hotbar_element = g.gui_elements[hotbar_create(g, p.inventory_element.data)];
	Matter.Composite.add(g.engine.world, p.body);
	let iplayer = game_object_create(g, "player", p, player_update, player_draw, player_destroy);
	g.player_object = g.objects[iplayer];
	//if(respawn) {
	//	p.inventory_element.data.items[1][0] = Math.max(0, Math.floor(Math.random() * 7 - 5)) * ITEM_GUN;
	//	p.inventory_element.data.items[1][1] = Math.max(0, Math.floor(Math.random() * 7 - 5)) * ITEM_AMMO;
	//	p.inventory_element.data.items[1][2] = Math.max(0, Math.floor(Math.random() * 7 - 5)) * ITEM_WATER;
	//	p.inventory_element.data.items[1][3] = Math.max(0, Math.floor(Math.random() * 7 - 5)) * ITEM_CANNED_MEAT;
	//}
	return iplayer;
}

function player_destroy(player_object) {
	Matter.Composite.remove(player_object.game.engine.world, player_object.data.body);
	infobox_destroy(player_object.data.infobox_element);
	inventory_destroy(player_object.data.inventory_element);
	hotbar_destroy(player_object.data.hotbar_element);
	player_object.destroyed = true;
	player_object.game.player_object = null;
	if(player_object.game.camera_target_body == player_object.data.body)
		player_object.game.camera_target_body = null;
}

function player_die(player_object) {
	inventory_drop_all_items(player_object.data.inventory_element);
	player_object.game.want_respawn_menu = true;
	player_destroy(player_object);
}

function player_update(player_object, dt) {

	let p = player_object.data;
	if(p.shot_cooldown > 0)
		p.shot_cooldown -= dt;

	if(player_object.data.health <= 0)
		player_die(player_object);

	if(p.thirst > 0)
		p.thirst = Math.max(0, p.thirst - 0.001 * dt)
	if(p.thirst <= 0)
		p.health -= 0.05 * dt;
	if(p.hunger > 0)
		p.hunger = Math.max(0, p.hunger - 0.001 * dt)
	if(p.hunger <= 0)
		p.health -= 0.05 * dt;

	p.speed = p.max_speed;
	if(p.thirst < 0.5 * p.max_thirst)
		p.speed = 0.75 * p.speed;
	if(p.hunger < 0.25 * p.max_hunger)
		p.speed = 0.5 * p.speed;

	// choose level based on coordinates
	let level_x = Number(p.want_level.split("x")[0]);
	let level_y = Number(p.want_level.split("x")[1]);
	let Ox = 2500 * level_x;
	let Oy = 2500 * level_y;
	if(p.body.position.x < Ox)
		p.want_level = (level_x - 1) + "x" + level_y;
	else if(p.body.position.x > Ox + 2500)
		p.want_level = (level_x + 1) + "x" + level_y;
	if(p.body.position.y < Oy)
		p.want_level = level_x + "x" + (level_y - 1);
	else if(p.body.position.y > Oy + 2500)
		p.want_level = level_x + "x" + (level_y + 1);
	if(p.want_level != player_object.game.level)
		levels_set(player_object.game, p.want_level);

	p.infobox_element.data.lines.unshift(Math.round(player_object.game.input.mouse.x) + ":" + Math.round(player_object.game.input.mouse.y));
	p.infobox_element.data.lines.unshift(player_object.game.level);
	p.infobox_element.data.lines.unshift(Math.round(player_object.data.health));
	p.infobox_element.data.lines.unshift(Math.round(p.body.position.x) + ":" + Math.round(p.body.position.y));

	if(isKeyDown(player_object.game.input, 'o', true))
		p.infobox_element.shown = !p.infobox_element.shown;

	if(isKeyDown(player_object.game.input, 'e', true) || isKeyDown(player_object.game.input, 'i', true)) {
		p.inventory_element.shown = !p.inventory_element.shown;
		p.hotbar_element.shown = !p.hotbar_element.shown;
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_FUEL
		&& player_object.game.input.mouse.leftButtonPressed) {
		let c = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "car", 200);
		if(c) {
			c.data.fuel += Math.min(c.data.max_fuel - c.data.fuel, Math.random() * 40 + 10);
			p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
		}
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_HEALTH
		&& player_object.game.input.mouse.leftButtonPressed) {
		p.health += Math.min(p.max_health - p.health, Math.random() * 20 + 5);
		p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_CANNED_MEAT
		&& player_object.game.input.mouse.leftButtonPressed) {
		p.hunger += Math.min(p.max_hunger - p.hunger, Math.random() * 20 + 5);
		p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
	}

	if(hotbar_get_selected_item(p.hotbar_element) == ITEM_WATER
		&& player_object.game.input.mouse.leftButtonPressed) {
		p.thirst += Math.min(p.max_thirst - p.thirst, Math.random() * 20 + 5);
		p.hotbar_element.data.row[p.hotbar_element.data.iselected] = 0;
	}

	let vel = Matter.Vector.create(0, 0);

	if(!p.inventory_element.shown && !p.car_object) {
		player_object.game.camera_target_body = p.body;
		p.body.collisionFilter.mask = -1;
		if(player_object.game.input.keys.down['d'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(p.speed, 0));
		if(player_object.game.input.keys.down['a'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(-p.speed, 0));
		if(player_object.game.input.keys.down['s'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, p.speed));
		if(player_object.game.input.keys.down['w'])
			vel = Matter.Vector.add(vel, Matter.Vector.create(0, -p.speed));
		if(isKeyDown(player_object.game.input, 'f', true) || isKeyDown(player_object.game.input, ' ', true)) {
			if(!item_pickup(p.inventory_element, game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "item", 100)))
				p.car_object = game_object_find_closest(player_object.game, p.body.position.x, p.body.position.y, "car", 200);
		}
		if(hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN
			&& player_object.game.input.mouse.leftButtonPressed
			&& p.shot_cooldown <= 0
			&& inventory_has_item(p.inventory_element, ITEM_AMMO)) {
			bullet_create(
				player_object.game,
				p.body.position.x,
				p.body.position.y,
				player_object.game.input.mouse.x - 0.5 * window.innerWidth,
				player_object.game.input.mouse.y - 0.5 * window.innerHeight
			);
			p.shot_cooldown = 200;
			if(Math.random() > 0.99)
				inventory_clear_item(p.inventory_element, ITEM_AMMO, 1);
		}
			if(isKeyDown(player_object.game.input, 'q', true))
				inventory_drop_item(p.inventory_element, 0, p.hotbar_element.data.iselected);
			Matter.Body.setVelocity(p.body, vel);
		}

	if(!p.inventory_element.shown && p.car_object) {
		let rotatedir = 0;
		player_object.game.camera_target_body = p.car_object.data.body;
		p.body.collisionFilter.mask = -3;
		if(player_object.game.input.keys.down['w'] && p.car_object.data.fuel > 0) {
			vel = Matter.Vector.create(p.car_object.data.speed * Math.cos(p.car_object.data.body.angle), p.car_object.data.speed * Math.sin(p.car_object.data.body.angle));
			p.car_object.data.fuel = Math.max(p.car_object.data.fuel - 0.005 * dt, 0);
			rotatedir = 1;
		}
		if(player_object.game.input.keys.down['s'] && p.car_object.data.fuel > 0) {
			vel = Matter.Vector.create(-0.5 * p.car_object.data.speed * Math.cos(p.car_object.data.body.angle), -0.5 * p.car_object.data.speed * Math.sin(p.car_object.data.body.angle));
			p.car_object.data.fuel = Math.max(p.car_object.data.fuel - 0.005 * dt, 0);
			rotatedir = -1;
		}
		if(player_object.game.input.keys.down['d'])
			Matter.Body.rotate(p.car_object.data.body, rotatedir * 0.0015 * dt);
		if(player_object.game.input.keys.down['a'])
			Matter.Body.rotate(p.car_object.data.body, -rotatedir * 0.0015 * dt);
		Matter.Body.setVelocity(p.car_object.data.body, vel);
		Matter.Body.setPosition(p.body, Matter.Vector.add(p.car_object.data.body.position, Matter.Vector.create(0, 0)));
		if(isKeyDown(player_object.game.input, 'f', true) || isKeyDown(player_object.game.input, ' ', true)) {
			Matter.Body.setPosition(p.body, Matter.Vector.add(p.car_object.data.body.position, Matter.Vector.create(150, 0)));
			p.car_object = null;
		}
	} 
}

function player_draw(player_object, ctx) {
	let p = player_object.data;
	if(!p.car_object) {
		fillMatterBody(ctx, p.body, player_object.game.settings.player_color);
		drawMatterBody(ctx, p.body, "white");
		ctx.fillStyle = "red";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 * p.h, p.w, 2);
		ctx.fillStyle = "lime";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.9 * p.h, p.w * p.health / p.max_health, 2);
		ctx.fillStyle = "red";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 * p.h, p.w, 2);
		ctx.fillStyle = "cyan";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.8 * p.h, p.w * p.thirst / p.max_thirst, 2);
		ctx.fillStyle = "red";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 * p.h, p.w, 2);
		ctx.fillStyle = "orange";
		ctx.fillRect(p.body.position.x - p.w / 2, p.body.position.y - 0.7 * p.h, p.w * p.hunger / p.max_hunger, 2);
		if(player_object.game.settings.player_draw_gun && hotbar_get_selected_item(p.hotbar_element) == ITEM_GUN) {
			ctx.strokeStyle = "black";
			ctx.beginPath();
			let px = p.body.position.x - 0.45 * p.w;
			let py = p.body.position.y - 0.45 * p.h;
			ctx.moveTo(px, py);
			let gx = 1, gy = 1;
			gx = player_object.game.input.mouse.x - 0.5 * ctx.canvas.width;
			gy = player_object.game.input.mouse.y - 0.5 * ctx.canvas.height;
			let g = Math.sqrt(gx * gx + gy * gy);
			ctx.lineTo(px + p.w * gx / g, py + p.h * gy / g);
			ctx.lineWidth = 0.25 * p.w;
			ctx.stroke();
			ctx.lineWidth = 2;
		} else if(hotbar_get_selected_item(p.hotbar_element) > 0) {
			let px = p.body.position.x - 0.25 * p.w,
				py = p.body.position.y - 0.25 * p.h;
			item_icon_draw(ctx, hotbar_get_selected_item(p.hotbar_element), px, py, 0.5 * p.w, 0.5 * p.h);
		}
	}
}


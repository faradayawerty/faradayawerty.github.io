function animal_create(g, x, y, type = "deer") {
	let config = {
		"raccoon": {
			w: 20,
			h: 20,
			hp: 30,
			speed: 8.5
		},
		"deer": {
			w: 27.5,
			h: 27.5,
			hp: 50,
			speed: 6.25
		},
		"snake": {
			w: 75,
			h: 7,
			hp: 20,
			speed: 4.5
		},
		"scorpion": {
			w: 22.5,
			h: 10,
			hp: 60,
			speed: 5.0
		}
	};
	let settings = config[type] || config["deer"];
	let width = settings.w;
	let height = settings.h;
	let animals = g.objects.filter((obj) => obj.name == "animal");
	if (animals.length > 20) {
		for (let i = 0; i < animals.length - 20; i++) {
			if (animals[i] && animals[i].destroy) animals[i].destroy(animals[
				i]);
		}
	}
	let a = {
		health: settings.hp,
		max_health: settings.hp,
		speed: settings.speed,
		w: width,
		h: height,
		type: type,
		body: Matter.Bodies.rectangle(x, y, width, height),
		movement_change_delay: 1000,
		moving_duration: 0,
		current_vel: {
			x: 0,
			y: 0
		},
		target_vel: {
			x: 0,
			y: 0
		}
	};
	Matter.Composite.add(g.engine.world, a.body);
	return game_object_create(
		g,
		"animal",
		a,
		animal_update,
		animal_draw,
		animal_destroy
	);
}

function animal_destroy(ao) {
	if (ao.destroyed) return;
	Matter.Composite.remove(ao.game.engine.world, ao.data.body);
	ao.data.body = null;
	ao.destroyed = true;
}

function animal_update(ao, dt) {
	if (ao.destroyed || !ao.data.body) return;
	let a = ao.data;
	if (a.health <= 0) {
		if (a.type === "raccoon") {
			if (Math.random() < 0.75) {
				if (Math.random() < 0.25)
					item_spawn(ao.game, a.body.position.x, a.body.position.y,
						null, LEVEL_TILE_RESIDENTIAL_T_SOUTH, null);
				else {
					let junk_id = ITEMS_JUNK[Math.floor(Math.random() *
						ITEMS_JUNK.length)];
					item_create(ao.game, junk_id, a.body.position.x, a.body
						.position.y);
				}
			}
			audio_play("data/sfx/raccoon_dies.mp3", 1.0);
		}
		else if (a.type === "deer") {
			if (Math.random() < 0.75)
				item_create(ao.game, ITEM_CANNED_MEAT, a.body.position.x, a.body
					.position.y);
			audio_play("data/sfx/deer_dies_1.mp3");
		}
		if (Math.random() < 0.0025) item_create(ao.game, ITEM_AMMO, a.body
			.position.x, a.body.position.y);
		animal_destroy(ao);
		return;
	}
	if (a.moving_duration > 0) a.moving_duration -= dt;
	if (a.movement_change_delay > 0) a.movement_change_delay -= Math.random() *
		dt;
	let ho = game_object_find_closest(ao.game, a.body.position.x, a.body
		.position.y, "rocket", 500);
	if (!ho) ho = game_object_find_closest(ao.game, a.body.position.x, a.body
		.position.y, "enemy", 400);
	if (!ho) ho = game_object_find_closest(ao.game, a.body.position.x, a.body
		.position.y, "player", 300);
	if (ho) {
		let dx = a.body.position.x - ho.data.body.position.x;
		let dy = a.body.position.y - ho.data.body.position.y;
		let d = Math.sqrt(dx * dx + dy * dy);
		a.target_vel.x = (dx / d) * a.speed;
		a.target_vel.y = (dy / d) * a.speed;
	}
	else if (a.movement_change_delay < 0) {
		let rx = 2 * Math.random() - 1;
		let ry = 2 * Math.random() - 1;
		let d = Math.sqrt(rx * rx + ry * ry);
		if (d > 0) {
			a.target_vel.x = (rx / d) * a.speed;
			a.target_vel.y = (ry / d) * a.speed;
		}
		a.moving_duration = Math.random() * (a.type === "raccoon" ? 3000 :
			10000);
		a.movement_change_delay = (a.type === "raccoon" ? 400 : 1000);
	}
	if (a.type === "deer" || a.type === "raccoon") {
		a.current_vel.x = a.target_vel.x;
		a.current_vel.y = a.target_vel.y;
	}
	else {
		let lerpFactor = 0.05;
		a.current_vel.x += (a.target_vel.x - a.current_vel.x) * lerpFactor;
		a.current_vel.y += (a.target_vel.y - a.current_vel.y) * lerpFactor;
	}
	if (Math.abs(a.current_vel.x) > 0.1 || Math.abs(a.current_vel.y) > 0.1) {
		Matter.Body.setVelocity(a.body, Matter.Vector.create(a.current_vel.x, a
			.current_vel.y));
		if (a.type === "snake" || a.type === "scorpion") {
			Matter.Body.setAngle(a.body, Math.atan2(a.current_vel.y, a
				.current_vel.x));
		}
	}
}

function animal_deer_draw_horns(ctx, x, y, w) {
	ctx.strokeStyle = "brown";
	ctx.lineWidth = 0.1 * w;
	drawLine(ctx, x - 0.5 * w, y - 0.5 * w, x - 0.525 * w, y - 0.75 * w,
		"brown", 0.1 * w);
	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.95 * w, y - 1 * w, "brown",
		0.1 * w);
	drawLine(ctx, x - 0.525 * w, y - 0.75 * w, x - 0.475 * w, y - 1.05 * w,
		"brown", 0.1 * w);
	drawLine(ctx, x + 0.5 * w, y - 0.5 * w, x + 0.525 * w, y - 0.75 * w,
		"brown", 0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.95 * w, y - 1 * w, "brown",
		0.1 * w);
	drawLine(ctx, x + 0.525 * w, y - 0.75 * w, x + 0.475 * w, y - 1.05 * w,
		"brown", 0.1 * w);
}

function animal_raccoon_draw(ctx, x, y, w, h, a) {
	ctx.fillStyle = "#555555";
	ctx.beginPath();
	ctx.moveTo(x - w * 0.4, y - h * 0.5);
	ctx.lineTo(x - w * 0.5, y - h * 0.8);
	ctx.lineTo(x - w * 0.2, y - h * 0.5);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x + w * 0.4, y - h * 0.5);
	ctx.lineTo(x + w * 0.5, y - h * 0.8);
	ctx.lineTo(x + w * 0.2, y - h * 0.5);
	ctx.fill();
	fillMatterBody(ctx, a.body, "#777777");
	drawMatterBody(ctx, a.body, "#444444", 2);
	ctx.fillStyle = "#222222";
	ctx.fillRect(x - w * 0.5, y - h * 0.2, w, h * 0.35);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(x - w * 0.22, y - h * 0.05, w * 0.08, 0, Math.PI * 2);
	ctx.arc(x + w * 0.22, y - h * 0.05, w * 0.08, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(x - w * 0.22, y - h * 0.05, w * 0.03, 0, Math.PI * 2);
	ctx.arc(x + w * 0.22, y - h * 0.05, w * 0.03, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#111111";
	ctx.beginPath();
	ctx.arc(x, y + h * 0.15, w * 0.05, 0, Math.PI * 2);
	ctx.fill();
	let tailX = x - w * 0.5;
	let tailY = y + h * 0.2;
	ctx.lineWidth = h * 0.2;
	for (let i = 0; i < 5; i++) {
		ctx.strokeStyle = (i % 2 === 0) ? "#333333" : "#999999";
		ctx.beginPath();
		ctx.moveTo(tailX - (i * w * 0.15), tailY);
		ctx.lineTo(tailX - ((i + 1) * w * 0.15), tailY);
		ctx.stroke();
	}
}

function animal_draw(ao, ctx) {
	let a = ao.data;
	if (a.type === "piginator") return;
	let x = a.body.position.x;
	let y = a.body.position.y;
	let angle = a.body.angle;
	if (a.type === "raccoon") {
		animal_raccoon_draw(ctx, x, y, a.w, a.h, a);
	}
	else if (a.type === "snake") {
		animal_snake_draw(ctx, x, y, a.w, a.h, angle);
	}
	else if (a.type === "scorpion") {
		animal_scorpion_draw(ctx, x, y, a.w, a.h, angle);
	}
	else {
		animal_deer_draw_horns(ctx, x, y, a.w);
		fillMatterBody(ctx, a.body, "#aa8844");
		drawMatterBody(ctx, a.body, "white", 0.05 * a.w);
	}
	if (ao.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(x - a.w / 2, y - 0.75 * a.h, a.w, a.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(x - a.w / 2, y - 0.75 * a.h, a.w * Math.max(0, a.health) /
			a.max_health, a.h * 0.05);
	}
}

function animal_snake_draw(ctx, x, y, w, h, angle) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	let segments = 22;
	let segmentSize = w / (segments - 5);
	ctx.fillStyle = "black";
	for (let i = 0; i < segments; i++) {
		let wave = Math.sin(Date.now() * 0.006 - i * 0.3) * (h * 0.9);
		let posX = (segments / 2 - i) * segmentSize * 0.8;
		let s = segmentSize * 1.8;
		if (i === 0) {
			s *= 1.5;
		}
		else if (i > segments - 6) {
			s *= (1 - (i - (segments - 6)) / 6);
		}
		ctx.fillRect(posX - s / 2, wave - s / 2, s, s);
		if (i === 0) {
			ctx.fillStyle = "red";
			let eyeSize = 1.2;
			ctx.fillRect(posX + s / 6, wave - s / 4, eyeSize, eyeSize);
			ctx.fillRect(posX + s / 6, wave + s / 4 - eyeSize, eyeSize,
				eyeSize);
			ctx.fillStyle = "black";
		}
	}
	ctx.restore();
}

function animal_scorpion_draw(ctx, x, y, w, h, angle) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.fillStyle = "black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = Math.max(1, w * 0.06);
	let time = Date.now() * 0.002;
	for (let i = 0; i < 5; i++) {
		let segmentX = (0.3 - i * 0.15) * w;
		ctx.beginPath();
		ctx.ellipse(segmentX, 0, w * 0.12, h * 0.4 - i * (h * 0.08), 0, 0, Math
			.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = "red";
	let headX = 0.3 * w;
	let eyeSize = w * 0.035;
	ctx.beginPath();
	ctx.arc(headX + w * 0.02, -h * 0.15, eyeSize, 0, Math.PI * 2);
	ctx.arc(headX + w * 0.02, h * 0.15, eyeSize, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "black";
	for (let side = -1; side <= 1; side += 2) {
		for (let j = 0; j < 3; j++) {
			let legPhase = (Date.now() * 0.008) + j * 0.8;
			let moveX = Math.cos(legPhase) * (w * 0.1);
			let moveY = Math.sin(legPhase) * (h * 0.15);
			ctx.beginPath();
			ctx.moveTo(w * (0.1 - j * 0.1), side * h * 0.2);
			ctx.lineTo(w * (0.1 - j * 0.1) + moveX, side * (h * 0.7) + moveY);
			ctx.lineTo(w * (-0.1 - j * 0.1) + moveX, side * (h * 0.9) + moveY);
			ctx.stroke();
		}
		ctx.save();
		ctx.translate(w * 0.35, side * h * 0.2);
		let armAngle = side * (0.6 + Math.sin(time * 5) * 0.15);
		ctx.rotate(armAngle);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w * 0.2, 0);
		ctx.stroke();
		ctx.translate(w * 0.2, 0);
		ctx.rotate(side * -0.4 + Math.sin(time * 8) * 0.1);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w * 0.15, 0);
		ctx.stroke();
		ctx.translate(w * 0.15, 0);
		let pinch = Math.sin(time * 15) * 0.3 + 0.3;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w * 0.15, -side * pinch * (h * 0.5));
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(w * 0.15, side * pinch * (h * 0.1));
		ctx.stroke();
		ctx.restore();
	}
	let tailBaseX = -w * 0.3;
	let tailWave = Math.sin(time * 4);
	ctx.beginPath();
	ctx.moveTo(tailBaseX, 0);
	let cp1x = tailBaseX - w * 0.5,
		cp1y = tailWave * (h * 1.25);
	let cp2x = tailBaseX - w * 0.7 + tailWave * (w * 0.3),
		cp2y = -h * 1.8;
	let endX = tailBaseX + w * 0.1 + tailWave * (w * 0.4),
		endY = -h * 2.2;
	ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
	ctx.stroke();
	ctx.beginPath();
	ctx.ellipse(endX, endY, w * 0.15, h * 0.25, Math.atan2(endY - cp2y, endX -
		cp2x), 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(endX, endY);
	ctx.lineTo(endX + w * 0.2, endY - h * 0.3);
	ctx.stroke();
	ctx.restore();
}

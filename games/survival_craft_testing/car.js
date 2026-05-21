let COLORS_CARS = COLORS_DEFAULT.cars;

function car_create(g, x, y, color_, is_tank = false, unique = true, type =
	"default", health = null, fuel = null) {
	if (type === "default" && Math.random() < 0.01)
		type = "taxi";
	if (g.objects["shooting laser"] && Math.random() < 0.25) is_tank = true;
	if (is_tank) type = "tank";
	if (type === "police") color_ = COLORS_CARS.types.police.body;
	if (type === "fireman") color_ = COLORS_CARS.types.fireman.body;
	if (type === "ambulance") color_ = COLORS_CARS.types.ambulance.body;
	if (type === "taxi") color_ = COLORS_CARS.types.taxi.body;
	let width = 200,
		height = 110;
	let c = {
		type: type,
		health: 750,
		max_health: 1000,
		fuel: (fuel !== null) ? fuel : Math.max(0, 200 * Math.random() -
			150),
		max_fuel: 300,
		speed: 20,
		max_speed: 20,
		ridable: true,
		color: color_,
		w: width,
		h: height,
		is_tank: (type === "tank"),
		shot_cooldown: 2000,
		siren_timer: 0,
		heal_timer: 0,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			angle: 3 * Math.PI / 2,
			mass: 1000.5,
			inertia: Infinity,
			collisionFilter: {
				"group": 0,
				"mask": -1,
				"category": 2
			}
		})
	};
	switch (type) {
		case "tank":
			c.max_health = 10000;
			c.max_fuel = 1000;
			c.speed = 15;
			c.max_speed = 15;
			break;
		case "police":
			c.max_health = 5000;
			c.max_speed = 32;
			c.speed = 32;
			break;
		case "fireman":
			c.max_health = 3000;
			c.w = 240;
			break;
		case "ambulance":
			c.max_health = 2000;
			break;
		case "taxi":
			c.max_speed = 28;
			c.speed = 28;
			break;
	}
	if (health !== null) {
		c.health = health;
	}
	else {
		let variability = 0.75 + (Math.random() * 0.25);
		c.health = Math.round(c.max_health * variability);
	}
	if (c.health > c.max_health)
		c.max_health = c.health;
	if (fuel !== null && fuel > c.max_fuel) c.max_fuel = fuel;
	let uname = unique ? "car_" + type + "_" + Math.round(x) + ":" + Math.round(
		y) : null;
	let icar = game_object_create(g, "car", c, car_update, car_draw,
		car_destroy, uname);
	if (icar > -1) Matter.Composite.add(g.engine.world, c.body);
	return icar;
}

function car_destroy(car_object) {
	if (car_object.destroyed) return;
	let player_object = game_object_find_closest(car_object.game, car_object
		.data.body.position.x, car_object.data.body.position.y, "player",
		100);
	if (player_object && player_object.data.car_object == car_object)
		player_object.data.car_object = null;
	Matter.Composite.remove(car_object.game.engine.world, car_object.data.body);
	car_object.data.body = null;
	car_object.destroyed = true;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}

function drawIndicators(car_object, ctx, p) {
	let px = p.body.position.x;
	let py = p.body.position.y;
	let barWidth = 0.5 * p.h;
	const fontSize = p.w * 0.08;
	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `bold ${fontSize}px Arial`;
	ctx.lineWidth = fontSize * 0.25;
	ctx.strokeStyle = "black";
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	if (car_object.game.settings.indicators["show car health"] && p.health >
		0) {
		const hPerc = Math.max(0, p.health / p.max_health);
		const yHealth = py - p.h * 0.35;
		const r = Math.floor(255 * (1 - hPerc));
		const g = Math.floor(255 * hPerc);
		const text = `${Math.ceil(p.health)}/${Math.ceil(p.max_health)}`;
		ctx.strokeText(text, px, yHealth);
		ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
		ctx.fillText(text, px, yHealth);
	}
	if (car_object.game.settings.indicators["show car fuel"]) {
		const fPerc = Math.max(0, p.fuel / p.max_fuel);
		const hasHealth = car_object.game.settings.indicators[
			"show car health"] && p.health > 0;
		const yFuel = py - p.h * (hasHealth ? 0.20 : 0.35);
		const r = Math.floor(255 - (127 * fPerc));
		const gb = Math.floor(128 * fPerc);
		const color = `rgb(${r}, ${gb}, ${gb})`;
		const text = `${Math.ceil(p.fuel)}/${Math.ceil(p.max_fuel)}`;
		ctx.strokeText(text, px, yFuel);
		ctx.fillStyle = color;
		ctx.fillText(text, px, yFuel);
	}
	ctx.restore();
}

function car_update(car_object, dt) {
	if (car_object.destroyed || !car_object.data.body) return;
	let p = car_object.data;
	let player_object = game_object_find_closest(car_object.game, p.body
		.position.x, p.body.position.y, "player", 100);
	if (["police", "fireman", "ambulance", "taxi"].includes(p.type)) {
		p.siren_timer += dt;
	}
	if (p.shot_cooldown < 2000) p.shot_cooldown += dt;
	p.speed = p.max_speed;
	for (let i = 0; i < car_object.game.objects.length; i++) {
		let grass = null;
		if (car_object.game.objects[i].name == "decorative_grass")
			grass = car_object.game.objects[i].data;
		else continue;
		if (doRectsCollide(p.body.position.x, p.body.position.y, 0, 0, grass.x,
				grass.y, grass.w, grass.h)) {
			p.speed = 0.66 * p.max_speed;
			break;
		}
	}
	let is_shooting = car_object.game.input.mouse.leftButtonPressed;
	let dx = car_object.game.input.mouse.x - 0.5 * window.innerWidth;
	let dy = car_object.game.input.mouse.y - 0.5 * window.innerHeight;
	if (car_object.game.mobile) {
		dx = car_object.game.input.joystick.left.dx;
		dy = car_object.game.input.joystick.left.dy;
		is_shooting = (dx !== 0 || dy !== 0);
	}
	if (p.is_tank && player_object && player_object.data.car_object ==
		car_object) {
		if (car_object.game.settings.auto_aim) {
			let nearest_enemy = game_object_find_closest(
				car_object.game,
				p.body.position.x,
				p.body.position.y,
				"rocket",
				800,
				(obj) => obj.data && obj.data.enemy === true
			);
			if (!nearest_enemy) {
				nearest_enemy = game_object_find_closest(
					car_object.game,
					p.body.position.x,
					p.body.position.y,
					"enemy",
					800
				);
			}
			if (nearest_enemy) {
				dx = nearest_enemy.data.body.position.x - p.body.position.x;
				dy = nearest_enemy.data.body.position.y - p.body.position.y;
			}
		}
	}
	let g_test = Math.sqrt(dx * dx + dy * dy);
	if (p.is_tank && player_object && player_object.data.car_object ==
		car_object && is_shooting && p.shot_cooldown >= 600 && g_test > 0.01) {
		let theta = Math.atan2(dy, dx);
		bullet_create(
			car_object.game,
			p.body.position.x + 0.5 * p.w * Math.cos(theta),
			p.body.position.y + 0.5 * p.w * Math.sin(theta),
			dx, dy, 60,
			(15 + 10 * Math.random()) * BALANCE_FACTOR *
			weapon_damage_from_tier(ENEMY_TIER_SHOOTING_ROCKET), false, 12.5, 3500
		);
		p.shot_cooldown = 0;
		audio_play("data/sfx/revolver_1.mp3", 0.1);
	}
	if (p.health <= 0) {
		let N = Math.random() * 4 - 1;
		for (let i = 0; i < N; i++) {
			let theta = 2 * Math.PI * Math.random();
			item_spawn(car_object.game, p.body.position.x + 50 * Math.cos(
					theta), p.body.position.y + 50 * Math.sin(theta), null,
				null, car_object.data.type);
		}
		car_destroy(car_object);
	}
}

function car_draw(car_object, ctx) {
	let p = car_object.data;
	let player_object = game_object_find_closest(car_object.game, p.body
		.position.x, p.body.position.y, "player", 100);
	ctx.save();
	ctx.translate(p.body.position.x, p.body.position.y);
	ctx.rotate(p.body.angle);
	let w = p.w;
	let h = p.h;
	ctx.fillStyle = p.color;
	ctx.strokeStyle = COLORS_CARS.common.outline;
	ctx.lineWidth = 2;
	roundRect(ctx, -w / 2, -h / 2, w, h, 15, true, true);
	if (p.type === "police") {
		ctx.fillStyle = COLORS_CARS.types.police.stripe;
		ctx.fillRect(-w / 2, -h * 0.15, w, h * 0.3);
		ctx.fillStyle = COLORS_CARS.types.police.line;
		ctx.fillRect(-w / 2, -h * 0.02, w, h * 0.04);
	}
	if (p.type === "ambulance") {
		ctx.fillStyle = COLORS_CARS.types.ambulance.stripe;
		ctx.fillRect(-w / 2, -h * 0.1, w, h * 0.2);
	}
	if (p.type === "taxi") {
		ctx.fillStyle = COLORS_CARS.types.taxi.checkers;
		let checkerSize = 12;
		for (let i = 0; i < 5; i++) {
			ctx.fillRect(-w / 2 + 30 + (i * checkerSize * 2), -h / 2 + 2,
				checkerSize, 5);
			ctx.fillRect(-w / 2 + 30 + checkerSize + (i * checkerSize * 2), -h /
				2 + 7, checkerSize, 5);
			ctx.fillRect(-w / 2 + 30 + (i * checkerSize * 2), h / 2 - 7,
				checkerSize, 5);
			ctx.fillRect(-w / 2 + 30 + checkerSize + (i * checkerSize * 2), h /
				2 - 12, checkerSize, 5);
		}
	}
	if (!p.is_tank) {
		ctx.fillStyle = COLORS_CARS.common.shadow;
		ctx.fillRect(-w / 2, -h / 2, w * 0.1, h);
		ctx.fillStyle = COLORS_CARS.common.glass;
		ctx.strokeStyle = COLORS_CARS.common.glass_outline;
		ctx.lineWidth = 1;
		ctx.fillRect(w * 0.1, -h * 0.4, w * 0.15, h * 0.8);
		ctx.strokeRect(w * 0.1, -h * 0.4, w * 0.15, h * 0.8);
		ctx.fillStyle = COLORS_CARS.common.glass_reflection;
		ctx.fillRect(w * 0.12, -h * 0.3, w * 0.03, h * 0.2);
	}
	if (p.is_tank) {
		ctx.fillStyle = COLORS_CARS.tank.tracks;
		let trackW = w * 1.05;
		let trackH = h * 0.25;
		ctx.fillRect(-trackW / 2, -h / 2 - trackH * 0.5, trackW, trackH);
		ctx.fillRect(-trackW / 2, h / 2 - trackH * 0.5, trackW, trackH);
		ctx.strokeStyle = COLORS_CARS.tank.track_lines;
		ctx.lineWidth = 2;
		for (let i = 0; i < 10; i++) {
			let tx = -trackW / 2 + (i * (trackW / 9));
			drawLine(ctx, tx, -h / 2 - trackH * 0.5, tx, -h / 2 + trackH * 0.5,
				COLORS_CARS.tank.track_lines, 2);
			drawLine(ctx, tx, h / 2 - trackH * 0.5, tx, h / 2 + trackH * 0.5,
				COLORS_CARS.tank.track_lines, 2);
		}
	}
	else {
		ctx.fillStyle = COLORS_CARS.common.wheels;
		let wheelW = w * 0.2,
			wheelH = h * 0.15;
		ctx.fillRect(w * 0.2, -h / 2 - wheelH, wheelW, wheelH);
		ctx.fillRect(w * 0.2, h / 2, wheelW, wheelH);
		ctx.fillRect(-w * 0.4, -h / 2 - wheelH, wheelW, wheelH);
		ctx.fillRect(-w * 0.4, h / 2, wheelW, wheelH);
	}
	if (p.is_tank) {
		let gx = 0,
			gy = -1;
		if (player_object && player_object.data.car_object == car_object) {
			let dx = (car_object.game.mobile) ? car_object.game.input.joystick
				.left
				.dx : (car_object.game.input.mouse.x - window.innerWidth / 2);
			let dy = (car_object.game.mobile) ? car_object.game.input.joystick
				.left
				.dy : (car_object.game.input.mouse.y - window.innerHeight / 2);
			if (car_object.game.settings.auto_aim) {
				let nearest_enemy = game_object_find_closest(
					car_object.game,
					p.body.position.x,
					p.body.position.y,
					"rocket",
					800,
					(obj) => obj.data && obj.data.enemy === true
				);
				if (!nearest_enemy) {
					nearest_enemy = game_object_find_closest(
						car_object.game,
						p.body.position.x,
						p.body.position.y,
						"enemy",
						800
					);
				}
				if (nearest_enemy) {
					dx = nearest_enemy.data.body.position.x - p.body.position.x;
					dy = nearest_enemy.data.body.position.y - p.body.position.y;
				}
			}
			gx = dx;
			gy = dy;
		}
		let towerAngle = (Math.abs(gx) < 0.01 && Math.abs(gy) < 0.01) ? 0 : Math
			.atan2(gy, gx) - p.body.angle;
		ctx.save();
		ctx.rotate(towerAngle);
		ctx.fillStyle = COLORS_CARS.tank.barrel;
		ctx.strokeStyle = COLORS_CARS.common.outline;
		ctx.fillRect(0, -8, w * 0.7, 16);
		ctx.strokeRect(0, -8, w * 0.7, 16);
		ctx.fillStyle = COLORS_CARS.tank.muzzle;
		ctx.fillRect(w * 0.6, -12, w * 0.12, 24);
		ctx.fillStyle = p.color;
		ctx.beginPath();
		ctx.arc(0, 0, h * 0.45, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	if (p.type === "fireman") {
		ctx.strokeStyle = COLORS_CARS.types.fireman.ladder;
		ctx.lineWidth = 3;
		let ladderStep = 18;
		for (let i = 0; i < 6; i++) {
			let lx = -w * 0.35 + (i * ladderStep);
			ctx.beginPath();
			ctx.moveTo(lx, -h * 0.25);
			ctx.lineTo(lx, h * 0.25);
			ctx.stroke();
		}
		ctx.strokeRect(-w * 0.35, -h * 0.25, ladderStep * 5, h * 0.5);
	}
	if (["police", "fireman", "ambulance"].includes(p.type)) {
		let is_alt = Math.floor(p.siren_timer / 200) % 2 === 0;
		let s_color = is_alt ? COLORS_CARS.common.siren_red : COLORS_CARS.types[
			p.type].siren_alt;
		ctx.fillStyle = s_color;
		ctx.beginPath();
		ctx.arc(0, 0, 12, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.3;
		drawCircle(ctx, 0, 0, 50, s_color, "transparent", 0);
		ctx.globalAlpha = 1.0;
	}
	else if (p.type === "taxi") {
		ctx.fillStyle = COLORS_CARS.types.taxi.sign_bg;
		ctx.fillRect(-15, -25, 30, 50);
		ctx.fillStyle = COLORS_CARS.types.taxi.sign_text;
		ctx.fillRect(-10, -20, 20, 40);
	}
	ctx.restore();
	drawIndicators(car_object, ctx, p);
}

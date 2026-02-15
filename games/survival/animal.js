function animal_create(g, x, y, type = "deer") {
	let config = {
		"raccoon": {
			w: 30,
			h: 30,
			hp: 30,
			speed: 8.5
		},
		"deer": {
			w: 45,
			h: 45,
			hp: 60,
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
		},
		is_minion: true
	};
	if (type === "deer") {
		Matter.Body.setInertia(a.body, Infinity);
	}
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
		else if (a.type === "scorpion" || a.type === "snake") {
			if (Math.random() < 0.75)
				item_create(ao.game, ITEM_VENOM, a.body.position.x, a.body
					.position.y);
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

function drawLine(ctx, x1, y1, x2, y2, color, width) {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.strokeStyle = "rgba(0,0,0,0.3)";
	ctx.lineWidth = 1;
	ctx.stroke();
}

function animal_deer_draw(ctx, x, y, w, h, body) {
	const time = Date.now() * 0.005;
	const isMoving = Math.abs(body.velocity.x) > 0.1 || Math.abs(body.velocity
		.y) > 0.1;
	const flip = body.velocity.x < 0 ? -1 : 1;
	const cMain = "#3d2511";
	const cDark = "#1a0f07";
	const cLight = "#8b6b4d";
	const cHorn = "#f2d291";
	const cHoof = "#000000";
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(flip, 1);
	const legWalk = isMoving ? Math.sin(time * 1.5) : 0;
	const legDist = w * 0.3;
	drawComplexLeg(ctx, -legDist, h * 0.1, legWalk, cDark, cHoof, w, h);
	drawComplexLeg(ctx, legDist * 0.6, h * 0.1, -legWalk, cDark, cHoof, w, h);
	ctx.fillStyle = cMain;
	ctx.strokeStyle = cDark;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.rect(-w * 0.5, -h * 0.35, w, h * 0.65);
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	ctx.beginPath();
	ctx.moveTo(-w * 0.1, -h * 0.2);
	ctx.lineTo(-w * 0.1, h * 0.15);
	ctx.stroke();
	ctx.save();
	ctx.translate(w * 0.45, -h * 0.25);
	const neckShake = isMoving ? Math.sin(time * 2.5) * 0.05 : 0;
	ctx.rotate(neckShake);
	ctx.fillStyle = cMain;
	ctx.beginPath();
	ctx.moveTo(-w * 0.2, h * 0.5);
	ctx.lineTo(w * 0.1, h * 0.5);
	ctx.lineTo(w * 0.15, -h * 0.1);
	ctx.lineTo(-w * 0.15, -h * 0.1);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.translate(w * 0.05, -h * 0.1);
	ctx.save();
	ctx.translate(0, -h * 0.1);
	drawHorns(ctx, cHorn, w, h);
	ctx.restore();
	ctx.fillStyle = cMain;
	ctx.beginPath();
	ctx.moveTo(-w * 0.15, -h * 0.15);
	ctx.lineTo(w * 0.05, -h * 0.12);
	ctx.lineTo(w * 0.3, h * 0.05);
	ctx.lineTo(w * 0.3, h * 0.15);
	ctx.lineTo(w * 0.05, h * 0.2);
	ctx.lineTo(-w * 0.15, h * 0.1);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = cDark;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(w * 0.02, h * -0.02);
	ctx.lineTo(w * 0.15, h * 0.03);
	ctx.stroke();
	ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo(w * 0.05, h * 0.03);
	ctx.lineTo(w * 0.14, h * 0.06);
	ctx.lineTo(w * 0.06, h * 0.08);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.arc(w * 0.09, h * 0.05, 1.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = cDark;
	ctx.beginPath();
	ctx.arc(w * 0.26, h * 0.1, 1.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	drawComplexLeg(ctx, -legDist * 0.5, h * 0.15, -legWalk, cMain, cHoof, w, h);
	drawComplexLeg(ctx, legDist * 0.6, h * 0.15, legWalk, cMain, cHoof, w, h);
	ctx.restore();
}

function drawComplexLeg(ctx, x, y, phase, color, hoofColor, w, h) {
	ctx.save();
	ctx.translate(x, y);
	const knee = Math.sin(phase) * 0.4;
	const foot = Math.cos(phase) * 0.2;
	ctx.strokeStyle = color;
	ctx.lineWidth = w * 0.15;
	ctx.lineCap = "square";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	const kX = knee * w * 0.3;
	const kY = h * 0.35;
	ctx.lineTo(kX, kY);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = w * 0.11;
	ctx.moveTo(kX, kY);
	const fX = kX + foot * w * 0.2;
	const fY = h * 0.6;
	ctx.lineTo(fX, fY);
	ctx.stroke();
	ctx.fillStyle = hoofColor;
	ctx.fillRect(fX - w * 0.07, fY, w * 0.14, h * 0.1);
	ctx.restore();
}

function drawHorns(ctx, color, w, h) {
	ctx.strokeStyle = color;
	ctx.lineWidth = w * 0.06;
	ctx.lineCap = "round";
	[-1, 1].forEach(side => {
		ctx.beginPath();
		ctx.moveTo(side * w * 0.05, 0);
		ctx.quadraticCurveTo(side * w * 0.4, -h * 0.5, side * w * 0.2, -
			h * 0.8);
		ctx.stroke();
		ctx.lineWidth = w * 0.035;
		ctx.beginPath();
		ctx.moveTo(side * w * 0.25, -h * 0.4);
		ctx.lineTo(side * w * 0.5, -h * 0.55);
		ctx.stroke();
	});
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
	else if (a.type === "deer") {
		animal_deer_draw(ctx, x, y, a.w, a.h, a.body);
	}
	else {
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
			let eyeSize = 0.03 * w;
			ctx.fillRect(posX + s / 6, wave - s / 4, eyeSize, eyeSize);
			ctx.fillRect(posX + s / 6, wave + s / 4 - eyeSize, eyeSize,
				eyeSize);
			ctx.fillStyle = "black";
		}
	}
	ctx.restore();
}

function animal_scorpion_draw(ctx, x, y, w, h, angle) {
	h = w * 0.45;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	let time = Date.now();
	let t = time * 0.001;
	const clrDark = "#0a0a0a";
	const clrMid = "#222222";
	const clrLight = "#3d3d3d";
	for (let side = -1; side <= 1; side += 2) {
		for (let i = 0; i < 4; i++) {
			let phase = (t * 7) + (i * 0.8) + (side === 1 ? Math.PI : 0);
			let legX = (0.2 - i * 0.18) * w;
			let lift = Math.max(0, Math.sin(phase)) * (h * 0.3);
			let stretch = Math.cos(phase) * (w * 0.12);
			ctx.strokeStyle = clrDark;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.beginPath();
			ctx.lineWidth = w * 0.06;
			ctx.moveTo(legX, side * h * 0.1);
			let kneeX = legX + stretch;
			let kneeY = side * (h * 0.7) + (side * lift * 0.5);
			ctx.lineTo(kneeX, kneeY);
			ctx.stroke();
			ctx.beginPath();
			ctx.lineWidth = w * 0.04;
			ctx.moveTo(kneeX, kneeY);
			let footX = kneeX + stretch * 0.5;
			let footY = side * (h * 1.1);
			ctx.lineTo(footX, footY);
			ctx.lineWidth = w * 0.02;
			ctx.lineTo(footX + (side * w * 0.04), footY + (side * h * 0.05));
			ctx.stroke();
			ctx.fillStyle = clrLight;
			ctx.beginPath();
			ctx.arc(kneeX, kneeY, w * 0.02, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	let tailX = -w * 0.25;
	let tailY = 0;
	let tailSegments = 7;
	for (let i = 0; i < tailSegments; i++) {
		let isLast = (i === tailSegments - 1);
		let segScale = 1 - (i / tailSegments) * 0.5;
		let segW = w * (isLast ? 0.14 : 0.12) * segScale;
		let segH = h * (isLast ? 0.32 : 0.25) * segScale;
		let wave = Math.sin(t * 4 - i * 0.5) * (h * 0.08);
		tailX -= segW * 1.3;
		tailY += wave;
		let g = ctx.createRadialGradient(tailX, tailY - segH * 0.2, 1, tailX,
			tailY, segH);
		g.addColorStop(0, clrLight);
		g.addColorStop(1, "black");
		ctx.fillStyle = g;
		ctx.beginPath();
		if (isLast) ctx.ellipse(tailX, tailY, segW * 1.3, segH * 1.1, 0, 0, Math
			.PI * 2);
		else ctx.ellipse(tailX, tailY, segW, segH, 0, 0, Math.PI * 2);
		ctx.fill();
		if (isLast) {
			ctx.strokeStyle = "black";
			ctx.lineWidth = 0.05 * w;
			ctx.beginPath();
			ctx.moveTo(tailX - segW * 0.8, tailY);
			ctx.quadraticCurveTo(tailX - w * 0.25, tailY, tailX - w * 0.18,
				tailY - h * 0.35);
			ctx.stroke();
		}
	}
	for (let side = -1; side <= 1; side += 2) {
		ctx.save();
		ctx.translate(w * 0.25, side * h * 0.15);
		ctx.rotate(side * 0.4 + Math.sin(t * 2) * 0.1);
		ctx.fillStyle = "black";
		ctx.fillRect(0, -h * 0.04, w * 0.25, h * 0.08);
		ctx.translate(w * 0.25, 0);
		ctx.rotate(side * -0.2);
		let clawG = ctx.createRadialGradient(w * 0.15, 0, 1, w * 0.15, 0, w *
			0.3);
		clawG.addColorStop(0, clrMid);
		clawG.addColorStop(1, "black");
		ctx.fillStyle = clawG;
		ctx.beginPath();
		ctx.ellipse(w * 0.15, 0, w * 0.22, h * 0.22, 0, 0, Math.PI * 2);
		ctx.fill();
		let pinch = (Math.sin(t * 8) * 0.5 + 0.5) * -0.6;
		ctx.strokeStyle = "black";
		ctx.lineWidth = w * 0.05;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(w * 0.3, side * -h * 0.05);
		ctx.quadraticCurveTo(w * 0.45, side * -h * 0.4, w * 0.5, side * -h *
			0.05);
		ctx.stroke();
		ctx.save();
		ctx.translate(w * 0.3, side * h * 0.05);
		ctx.rotate(side * pinch * -1);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.quadraticCurveTo(w * 0.1, side * h * 0.35, w * 0.25, 0);
		ctx.stroke();
		ctx.restore();
		ctx.restore();
	}
	for (let i = 0; i < 6; i++) {
		let segX = (0.35 - i * 0.15) * w;
		let segW = w * 0.16;
		let segH = h * 0.45 - (i * i * 0.01);
		let g = ctx.createLinearGradient(segX, -segH, segX, segH);
		g.addColorStop(0, "black");
		g.addColorStop(0.5, clrMid);
		g.addColorStop(1, "black");
		ctx.fillStyle = g;
		ctx.beginPath();
		if (i === 0) {
			if (ctx.roundRect) ctx.roundRect(segX - segW * 0.8, -segH, segW * 2,
				segH * 2, 10);
			else ctx.rect(segX - segW * 0.8, -segH, segW * 2, segH * 2);
		}
		else {
			ctx.ellipse(segX, 0, segW, segH, 0, 0, Math.PI * 2);
		}
		ctx.fill();
	}
	ctx.fillStyle = "#ff0000";
	ctx.shadowBlur = 5;
	ctx.shadowColor = "red";
	ctx.beginPath();
	ctx.arc(w * 0.42, -h * 0.07, w * 0.025, 0, Math.PI * 2);
	ctx.arc(w * 0.42, h * 0.07, w * 0.025, 0, Math.PI * 2);
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.restore();
}

function enemy_raccoon_boss_draw(ctx, x, y, w, h, e) {
	ctx.fillStyle = "#333333";
	ctx.beginPath();
	ctx.moveTo(x - w * 0.4, y - h * 0.5);
	ctx.lineTo(x - w * 0.6, y - h * 0.9);
	ctx.lineTo(x - w * 0.1, y - h * 0.5);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x + w * 0.4, y - h * 0.5);
	ctx.lineTo(x + w * 0.6, y - h * 0.85);
	ctx.lineTo(x + w * 0.1, y - h * 0.5);
	ctx.fill();
	fillMatterBody(ctx, e.body, "#555555");
	drawMatterBody(ctx, e.body, e.color_outline, 2);
	ctx.fillStyle = "#111111";
	ctx.fillRect(x - w * 0.5, y - h * 0.25, w, h * 0.4);
	let eyeSize = w * 0.12;
	ctx.fillStyle = "#ff0000";
	ctx.shadowBlur = 15;
	ctx.shadowColor = "red";
	ctx.beginPath();
	ctx.arc(x - w * 0.25, y - h * 0.05, eyeSize, 0, Math.PI * 2);
	ctx.arc(x + w * 0.25, y - h * 0.05, eyeSize, 0, Math.PI * 2);
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.fillStyle = "black";
	ctx.fillRect(x - w * 0.26, y - h * 0.15, w * 0.02, h * 0.2);
	ctx.fillRect(x + w * 0.24, y - h * 0.15, w * 0.02, h * 0.2);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x - w * 0.2, y + h * 0.2);
	ctx.lineTo(x - w * 0.1, y + h * 0.3);
	ctx.lineTo(x, y + h * 0.2);
	ctx.lineTo(x + w * 0.1, y + h * 0.3);
	ctx.lineTo(x + w * 0.2, y + h * 0.2);
	ctx.stroke();
	let tailX = x - w * 0.5;
	let tailY = y + h * 0.3;
	for (let i = 0; i < 6; i++) {
		ctx.strokeStyle = (i % 2 === 0) ? "#222222" : "#666666";
		ctx.lineWidth = h * 0.25;
		ctx.beginPath();
		ctx.moveTo(tailX - (i * w * 0.12), tailY + Math.sin(e.color_gradient +
			i) * 5);
		ctx.lineTo(tailX - ((i + 1) * w * 0.12), tailY + Math.sin(e
			.color_gradient + i + 1) * 5);
		ctx.stroke();
	}
}

function animal_deer_boss_render(ctx, x, y, w, h, e) {
	const flip = e.body.velocity.x < 0 ? -1 : 1;
	const isMoving = Math.abs(e.body.velocity.x) > 0.1 || Math.abs(e.body
		.velocity.y) > 0.1;
	const time = Date.now() * 0.005;
	const cMain = e.color || "#3d2511";
	const cDark = "#1a0f07";
	const cHorn = "#f2d291";
	const cEye = e.eye_color || "red";
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(flip, 1);
	const legW = w * 0.15;
	const legH = h * 0.5;
	const walkCycle = isMoving ? Math.sin(time * 2) * 0.3 : 0;
	ctx.fillStyle = cMain;
	ctx.strokeStyle = cDark;
	ctx.lineWidth = 2;
	[-0.3, 0.3].forEach((pos, i) => {
		ctx.save();
		ctx.translate(pos * w, h * 0.2);
		ctx.rotate(i % 2 === 0 ? walkCycle : -walkCycle);
		ctx.beginPath();
		ctx.rect(-legW / 2, 0, legW, legH);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fillRect(-legW / 2, legH, legW, h * 0.1);
		ctx.restore();
	});
	ctx.fillStyle = cMain;
	ctx.beginPath();
	ctx.rect(-w * 0.5, -h * 0.35, w, h * 0.7);
	ctx.fill();
	ctx.stroke();
	ctx.save();
	ctx.translate(w * 0.4, -h * 0.2);
	ctx.rotate(-Math.PI / 4 + (isMoving ? Math.sin(time * 3) * 0.05 : 0));
	ctx.beginPath();
	ctx.rect(0, -h * 0.15, w * 0.4, h * 0.3);
	ctx.fill();
	ctx.stroke();
	ctx.translate(w * 0.4, 0);
	ctx.rotate(Math.PI / 4);
	ctx.beginPath();
	ctx.moveTo(-w * 0.15, -h * 0.15);
	ctx.lineTo(w * 0.2, -h * 0.1);
	ctx.lineTo(w * 0.3, h * 0.05);
	ctx.lineTo(w * 0.25, h * 0.15);
	ctx.lineTo(-w * 0.15, h * 0.2);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.strokeStyle = cHorn;
	ctx.lineWidth = w * 0.05;
	[-1, 1].forEach(side => {
		ctx.save();
		ctx.translate(0, -h * 0.1);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.quadraticCurveTo(side * w * 0.4, -h * 0.6, side * w * 0.2, -
			h * 0.9);
		ctx.stroke();
		ctx.lineWidth = w * 0.02;
		ctx.beginPath();
		ctx.moveTo(side * w * 0.2, -h * 0.4);
		ctx.lineTo(side * w * 0.5, -h * 0.6);
		ctx.moveTo(side * w * 0.15, -h * 0.6);
		ctx.lineTo(side * w * 0.4, -h * 0.8);
		ctx.stroke();
		ctx.restore();
	});
	ctx.fillStyle = cEye;
	ctx.shadowBlur = 10;
	ctx.shadowColor = cEye;
	ctx.beginPath();
	ctx.moveTo(w * 0.05, 0);
	ctx.lineTo(w * 0.18, h * 0.05);
	ctx.lineTo(w * 0.05, h * 0.08);
	ctx.closePath();
	ctx.fill();
	ctx.shadowBlur = 0;
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(w * 0.25, h * 0.08, w * 0.02, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.restore();
}
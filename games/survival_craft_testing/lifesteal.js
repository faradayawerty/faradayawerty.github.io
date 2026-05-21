const LIFESTEAL_DATA_POOL = [];
const MAX_LIFESTEAL_POOL_SIZE = 50;

function lifesteal_particle_create(g, startX, startY, targetObject) {
	let particle_data;
	if (LIFESTEAL_DATA_POOL.length > 0) {
		particle_data = LIFESTEAL_DATA_POOL.pop();
	}
	else {
		particle_data = {
			x: 0,
			y: 0,
			target: null,
			life: 0,
			t: 0,
			speed: 0,
			seed: 0,
			trail: []
		};
	}
	particle_data.x = startX;
	particle_data.y = startY;
	particle_data.target = targetObject;
	particle_data.life = 1.0;
	particle_data.t = 0;
	particle_data.speed = 0.0025 + Math.random() * 0.002;
	particle_data.seed = Math.random() * 10;
	particle_data.trail = [];
	for (let i = 0; i < 12; i++) {
		particle_data.trail.push({
			x: startX,
			y: startY
		});
	}
	game_object_create(
		g,
		"lifesteal_particle",
		particle_data,
		lifesteal_particle_update,
		lifesteal_particle_draw,
		lifesteal_particle_destroy
	);
}

function lifesteal_particle_update(obj, dt) {
	let d = obj.data;
	if (!d.target || d.target.destroyed) {
		obj.destroyed = true;
		return;
	}
	for (let i = d.trail.length - 1; i > 0; i--) {
		d.trail[i].x = d.trail[i - 1].x;
		d.trail[i].y = d.trail[i - 1].y;
	}
	d.trail[0].x = d.x;
	d.trail[0].y = d.y;
	d.t += d.speed * dt;
	d.life -= 0.0004 * dt;
	let targetPos = d.target.data.body.position;
	let wave = Math.sin(d.t * 12 + d.seed) * (1 - d.t) * 45;
	let angleToTarget = Math.atan2(targetPos.y - d.y, targetPos.x - d.x);
	d.x += (targetPos.x - d.x) * d.t;
	d.y += (targetPos.y - d.y) * d.t;
	d.x += Math.cos(angleToTarget + 1.5708) * wave * 0.12;
	d.y += Math.sin(angleToTarget + 1.5708) * wave * 0.12;
	if (d.t >= 1.0 || d.life <= 0) {
		if (d.t >= 1.0) {
			let p = d.target.data;
			p.health = Math.min(p.max_health, p.health + 0.25);
			p.hunger = Math.min(p.max_hunger, p.hunger + 0.15);
			p.thirst = Math.min(p.max_thirst, p.thirst + 0.15);
			if (p.shield_blue_health > 0) p.shield_blue_health = Math.min(p
				.shield_blue_health_max, p.shield_blue_health + 0.2);
			if (p.shield_green_health > 0) p.shield_green_health = Math.min(p
				.shield_green_health_max, p.shield_green_health + 0.2);
			if (p.shield_shadow_health > 0) p.shield_shadow_health = Math.min(p
				.shield_shadow_health_max, p.shield_shadow_health + 0.2);
			if (p.shield_pumpkin_health > 0) p.shield_pumpkin_health = Math.min(
				p.shield_pumpkin_health_max, p.shield_pumpkin_health + 0.2);
			if (p.shield_anubis_health > 0) p.shield_anubis_health = Math.min(p
				.shield_anubis_health_max, p.shield_anubis_health + 0.2);
			if (p.shield_rainbow_health > 0) p.shield_rainbow_health = Math.min(
				p.shield_rainbow_health_max, p.shield_rainbow_health + 0.2);
		}
		obj.destroyed = true;
	}
}

function lifesteal_particle_draw(obj, ctx) {
	let d = obj.data;
	ctx.save();
	for (let i = 0; i < d.trail.length - 1; i++) {
		let p1 = d.trail[i];
		let p2 = d.trail[i + 1];
		let ratio = 1 - (i / d.trail.length);
		let width = (4 + (1 - d.t) * 4) * ratio;
		ctx.globalAlpha = ratio * d.life * 0.6;
		ctx.fillStyle = i % 2 === 0 ? "#ff0000" : "#880000";
		let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		let s = Math.sin(angle + 1.5708);
		let c = Math.cos(angle + 1.5708);
		ctx.beginPath();
		ctx.moveTo(p1.x + c * width, p1.y + s * width);
		ctx.lineTo(p1.x - c * width, p1.y - s * width);
		ctx.lineTo(p2.x - c * width * 0.5, p2.y - s * width * 0.5);
		ctx.lineTo(p2.x + c * width * 0.5, p2.y + s * width * 0.5);
		ctx.closePath();
		ctx.fill();
	}
	ctx.globalAlpha = d.life;
	ctx.fillStyle = "#ff0000";
	let headSize = 5 + (1 - d.t) * 3;
	ctx.translate(d.x, d.y);
	ctx.rotate(d.t * 8);
	ctx.beginPath();
	ctx.moveTo(0, -headSize);
	ctx.lineTo(headSize, 0);
	ctx.lineTo(0, headSize);
	ctx.lineTo(-headSize, 0);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#ffffff";
	let innerSize = headSize * 0.5;
	ctx.beginPath();
	ctx.rect(-innerSize / 2, -innerSize / 2, innerSize, innerSize);
	ctx.fill();
	ctx.restore();
}

function lifesteal_particle_destroy(obj) {
	if (obj.data && LIFESTEAL_DATA_POOL.length < MAX_LIFESTEAL_POOL_SIZE) {
		obj.data.target = null;
		LIFESTEAL_DATA_POOL.push(obj.data);
	}
	obj.data = null;
	obj.destroyed = true;
}
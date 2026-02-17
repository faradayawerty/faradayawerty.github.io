const BLOOD_DATA_POOL = [];
const MAX_BLOOD_POOL_SIZE = 25;

function blood_splash_create(g, x, y, count = 8, size = 4, color = "#bc0000",
	speed_mult = 1.0) {
	for (let i = 0; i < count; i++) {
		let angle = Math.random() * 6.283185307179586;
		let force = (Math.random() * 5 + 2) * speed_mult;
		let particle_data;
		if (BLOOD_DATA_POOL.length > 0) {
			particle_data = BLOOD_DATA_POOL.pop();
			particle_data.x = x;
			particle_data.y = y;
			particle_data.vx = Math.cos(angle) * force;
			particle_data.vy = Math.sin(angle) * force;
			particle_data.size = Math.random() * size + 2;
			particle_data.lifetime = Math.random() * 500 + 300;
			particle_data.initial_lifetime = particle_data.lifetime;
			particle_data.color = color;
			particle_data.friction = 0.92;
		}
		else {
			particle_data = {
				x: x,
				y: y,
				vx: Math.cos(angle) * force,
				vy: Math.sin(angle) * force,
				size: Math.random() * size + 2,
				lifetime: Math.random() * 500 + 300,
				initial_lifetime: 0,
				color: color,
				friction: 0.92
			};
			particle_data.initial_lifetime = particle_data.lifetime;
		}
		game_object_create(
			g,
			"bloodsplash",
			particle_data,
			blood_particle_update,
			blood_particle_draw,
			blood_particle_destroy
		);
	}
}

function blood_particle_update(obj, dt) {
	let d = obj.data;
	let step = dt / 16.6;
	d.x += d.vx * step;
	d.y += d.vy * step;
	d.vx *= d.friction;
	d.vy *= d.friction;
	d.lifetime -= dt;
	if (d.lifetime <= 0) {
		obj.destroyed = true;
	}
}

function blood_particle_draw(obj, ctx) {
	let d = obj.data;
	let alpha = d.lifetime / d.initial_lifetime;
	if (alpha <= 0) return;
	ctx.globalAlpha = alpha;
	ctx.fillStyle = d.color;
	ctx.beginPath();
	ctx.arc(d.x, d.y, d.size, 0, 6.283185307179586);
	ctx.fill();
	ctx.globalAlpha = 1.0;
}

function blood_particle_destroy(obj) {
	if (obj.data && BLOOD_DATA_POOL.length < MAX_BLOOD_POOL_SIZE) {
		BLOOD_DATA_POOL.push(obj.data);
	}
	obj.data = null;
	obj.destroyed = true;
}
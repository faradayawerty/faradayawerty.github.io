function blood_splash_create(g, x, y, count = 8, size = 4, color = "#bc0000",
	speed_mult = 1.0) {
	for (let i = 0; i < count; i++) {
		let angle = Math.random() * Math.PI * 2;
		let force = (Math.random() * 5 + 2) * speed_mult;
		let dx = Math.cos(angle);
		let dy = Math.sin(angle);
		let particle_data = {
			x: x,
			y: y,
			vx: dx * force,
			vy: dy * force,
			size: Math.random() * size + 2,
			lifetime: Math.random() * 500 + 300,
			initial_lifetime: 0,
			color: color,
			friction: 0.92
		};
		particle_data.initial_lifetime = particle_data.lifetime;
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
	d.x += d.vx * (dt / 16.6);
	d.y += d.vy * (dt / 16.6);
	d.vx *= d.friction;
	d.vy *= d.friction;
	d.lifetime -= dt;
	if (d.lifetime <= 0) {
		obj.destroyed = true;
	}
}

function blood_particle_draw(obj, ctx) {
	let d = obj.data;
	let alpha = Math.max(0, d.lifetime / d.initial_lifetime);
	ctx.globalAlpha = alpha;
	ctx.fillStyle = d.color;
	ctx.beginPath();
	ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 1.0;
}

function blood_particle_destroy(obj) {
	obj.destroyed = true;
}
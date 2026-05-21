const SMOKE_DATA_POOL = [];
const MAX_SMOKE_POOL_SIZE = 50;

function smoke_create(g, x, y, count = 5, mode = "gray", speed_mult = 1.0) {
	const palettes = {
		gray: {
			colors: ["#7f8c8d", "#95a5a6", "#bdc3c7"],
			fade: "#dcdde1"
		},
		blue: {
			colors: ["#2980b9", "#3498db", "#5dade2"],
			fade: "#aed6f1"
		},
		red: {
			colors: ["#c0392b", "#e74c3c", "#d98880"],
			fade: "#f2d7d5"
		},
		purple: {
			colors: ["#8e44ad", "#9b59b6", "#af7ac5"],
			fade: "#ebdef0"
		},
		orange: {
			colors: ["#d35400", "#e67e22", "#f39c12"],
			fade: "#fbe5c8"
		}
	};
	const p = palettes[mode] || palettes.gray;
	for (let i = 0; i < count; i++) {
		let angle = Math.random() * Math.PI * 2;
		let force = (Math.random() * 1.5 + 0.5) * speed_mult;
		let d;
		if (SMOKE_DATA_POOL.length > 0) {
			d = SMOKE_DATA_POOL.pop();
		}
		else {
			d = {};
		}
		d.x = x;
		d.y = y;
		d.vx = Math.cos(angle) * force;
		d.vy = Math.sin(angle) * force - 0.8;
		d.size = Math.random() * 6 + 4;
		d.lifetime = Math.random() * 1000 + 600;
		d.initial_lifetime = d.lifetime;
		d.color = p.colors[Math.floor(Math.random() * p.colors.length)];
		d.fade_color = p.fade;
		d.grow = 0.2;
		d.friction = 0.96;
		d.turbulence = Math.random() * 0.4 - 0.2;
		d.wobble = Math.random() * Math.PI * 2;
		game_object_create(
			g,
			"bloodsplash",
			d,
			smoke_particle_update,
			smoke_particle_draw,
			smoke_particle_destroy
		);
	}
}

function smoke_particle_update(obj, dt) {
	let d = obj.data;
	let step = dt / 16.6;
	d.wobble += 0.1 * step;
	d.vx += Math.sin(d.wobble) * d.turbulence * step;
	d.x += d.vx * step;
	d.y += d.vy * step;
	d.vx *= d.friction;
	d.vy *= d.friction;
	d.size += d.grow * step;
	d.lifetime -= dt;
	if (d.lifetime <= 0) obj.destroyed = true;
}

function smoke_particle_draw(obj, ctx) {
	let d = obj.data;
	let alpha = d.lifetime / d.initial_lifetime;
	if (alpha <= 0) return;
	ctx.save();
	ctx.globalAlpha = alpha * 0.5;
	ctx.fillStyle = alpha > 0.4 ? d.color : d.fade_color;
	ctx.beginPath();
	ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

function smoke_particle_destroy(obj) {
	if (obj.data && SMOKE_DATA_POOL.length < MAX_SMOKE_POOL_SIZE) {
		SMOKE_DATA_POOL.push(obj.data);
	}
	obj.data = null;
	obj.destroyed = true;
}
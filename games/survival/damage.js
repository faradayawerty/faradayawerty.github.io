const DAMAGE_TEXT_POOL = [];
const MAX_DAMAGE_POOL_SIZE = 100;

function damage_text_create(g, x, y, amount, color = "#ff0000", heal = false) {
	let text_data;
	const offsetX = (Math.random() - 0.5) * 20;
	const offsetY = (Math.random() - 0.5) * 20;
	const finalX = x + offsetX;
	const finalY = y + offsetY;
	const displayText = (heal ? "+" : "-") + Math.ceil(amount);
	if (DAMAGE_TEXT_POOL.length > 0) {
		text_data = DAMAGE_TEXT_POOL.pop();
		text_data.x = finalX;
		text_data.y = finalY;
		text_data.vx = (Math.random() - 0.5) * 3;
		text_data.vy = -3 - Math.random() * 3;
		text_data.lifetime = 1000;
		text_data.text = displayText;
		text_data.color = color;
	}
	else {
		text_data = {
			x: finalX,
			y: finalY,
			vx: (Math.random() - 0.5) * 3,
			vy: -3 - Math.random() * 3,
			lifetime: 1000,
			text: displayText,
			color: color
		};
	}
	game_object_create(g, "damage_text", text_data, damage_text_update,
		damage_text_draw, damage_text_destroy);
}

function damage_text_update(obj, dt) {
	let d = obj.data;
	const speedFactor = dt / 16.66;
	d.x += d.vx * speedFactor;
	d.y += d.vy * speedFactor;
	d.vy += 0.15 * speedFactor;
	d.lifetime -= dt;
	if (d.lifetime <= 0) obj.destroyed = true;
}

function damage_text_draw(obj, ctx) {
	let d = obj.data;
	let alpha = d.lifetime / 1000;
	if (alpha <= 0) return;
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.fillStyle = d.color;
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	ctx.font = "bold 22px Arial";
	ctx.textAlign = "center";
	ctx.strokeText(d.text, d.x, d.y);
	ctx.fillText(d.text, d.x, d.y);
	ctx.restore();
}

function damage_text_destroy(obj) {
	if (obj.data && DAMAGE_TEXT_POOL.length < MAX_DAMAGE_POOL_SIZE) {
		DAMAGE_TEXT_POOL.push(obj.data);
	}
	obj.data = null;
	obj.destroyed = true;
}
function getBullets() {
	return {
		size: 4,
		number: 0,
		speed: 12,
		damage: 17,
		lifetime: 1000,
		xs: [],
		ys: [],
		vxs: [],
		vys: [],
		lts: [],
		cls: []
	};
}

function createBullet(b, p, input) {
	if (p == null)
		return;
	if (p.ammo < 1)
		return;
	b.xs.push(p.x);
	b.ys.push(p.y);
	let dirx = input.mouse.leftButtonPressed ? input.mouse.x : p.x + 256 * input.joystick.right.dx;
	let diry = input.mouse.leftButtonPressed ? input.mouse.y : p.y + 256 * input.joystick.right.dy;
	let vx = dirx - p.x + 32 * (Math.random() * 2 - 1);
	let vy = diry - p.y + 32 * (Math.random() * 2 - 1);
	let v = Math.sqrt(vx * vx + vy * vy);
	b.vxs.push(b.speed * vx / v);
	b.vys.push(b.speed * vy / v);
	b.lts.push(0);
	b.cls.push('yellow');
	b.number++;
	p.ammo--;
}

function destroyBullet(b, i) {
	b.xs.splice(i, 1);
	b.ys.splice(i, 1);
	b.vxs.splice(i, 1);
	b.vys.splice(i, 1);
	b.lts.splice(i, 1);
	b.cls.splice(i, 1);
	b.number--;
}

function updateBullets(dt, b) {
	for (let i = 0; i < b.number; i++) {
		b.xs[i] += b.vxs[i];
		b.ys[i] += b.vys[i];
		b.lts[i] += dt;
		if (b.lts[i] > b.lifetime)
			destroyBullet(b, i);
	}
}

function drawBullets(ctx, b) {
	for (let i = 0; i < b.number; i++) {
		ctx.fillStyle = b.cls[i];
		ctx.fillRect(b.xs[i], b.ys[i], b.size, b.size);
	}
}

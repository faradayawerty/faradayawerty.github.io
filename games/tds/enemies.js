function getEnemies() {
	// could do an array of enemies but want to try data oriented design
	return {
		size: 12,
		number: 0,
		speed: 3,
		max_hp: 200,
		damage: 2,
		xs: [],
		ys: [],
		vxs: [],
		vys: [],
		cls: [],
		hps: [],
		sps: [] // index of spawner the enemy came from
	};
}

function createEnemy(e, x, y, is) {
	e.xs.push(x);
	e.ys.push(y);
	e.vxs.push(0);
	e.vys.push(0);
	e.cls.push('green');
	e.hps.push(e.max_hp);
	e.sps.push(is);
	e.number++;
}

function destroyEnemy(e, i) {
	e.xs.splice(i, 1);
	e.ys.splice(i, 1);
	e.vxs.splice(i, 1);
	e.vys.splice(i, 1);
	e.hps.splice(i, 1);
	e.cls.splice(i, 1);
	e.sps.splice(i, 1);
	e.number--;
}

function updateEnemies(dt, e, p, s) {
	if (p == null)
		return;
	for (let i = 0; i < e.number; i++) {
		let vx = p.x - e.xs[i];
		let vy = p.y - e.ys[i];
		let v = Math.sqrt(vx * vx + vy * vy);
		e.vxs[i] = e.speed * vx / v;
		e.vys[i] = e.speed * vy / v;
		e.xs[i] += e.vxs[i];
		e.ys[i] += e.vys[i];
		if (e.hps[i] < 0) {
			s.zs[e.sps[i]]--;
			destroyEnemy(e, i);
		}
	}
}

function drawEnemies(ctx, e) {
	for (let i = 0; i < e.number; i++) {
		ctx.fillStyle = e.cls[i];
		ctx.fillRect(e.xs[i], e.ys[i], e.size, e.size);
		ctx.fillStyle = 'red';
		ctx.fillRect(e.xs[i], e.ys[i] - 4, e.size, 2);
		ctx.fillStyle = 'lime';
		ctx.fillRect(e.xs[i], e.ys[i] - 4, (e.hps[i] / e.max_hp) * e.size, 2);
	}
}
function doRectsCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
	return Math.abs(x1 + 0.5 * w1 - x2 - 0.5 * w2) < 0.5 * (w1 + w2) && Math.abs(y1 + 0.5 * h1 - y2 - 0.5 * h2) < 0.5 * (h1 + h2);
}

function updateCollisionsPlayerEnemy(dt, p, e) {
	if (p == null)
		return;
	for (let i = 0; i < e.number; i++) {
		if (doRectsCollide(p.x, p.y, p.size, p.size, e.xs[i], e.ys[i], e.size, e.size)) {
			p.hp -= e.damage;
		}
	}
}

function updateCollisionsEnemyWall(dt, e, w) {
	for (let j = 0; j < e.number; j++) {
		for (let i = 0; i < w.number; i++) {
			while (doRectsCollide(e.xs[j], e.ys[j], e.size, e.size, w.xs[i], w.ys[i], w.ws[i], w.hs[i])) {
				e.xs[j] += -e.vxs[j] * 1.1;
				e.ys[j] += -e.vys[j] * 1.1;
			}
		}
	}
}

function updateCollisionsPlayerWall(dt, p, w) {
	if (p == null)
		return;
	for (let i = 0; i < w.number; i++) {
		while (doRectsCollide(p.x, p.y, p.size, p.size, w.xs[i], w.ys[i], w.ws[i], w.hs[i])) {
			p.x += -p.vx * 1.05;
			p.y += -p.vy * 1.05;
		}
	}
}

function updateCollisionsBulletWall(dt, b, w) {
	for (let i = 0; i < b.number; i++) {
		for (let j = 0; j < w.number; j++) {
			if (doRectsCollide(b.xs[i], b.ys[i], b.size, b.size, w.xs[j], w.ys[j], w.ws[j], w.hs[j])) {
				b.cls[i] = 'orange';
				b.lts[i] += b.lifetime;
			}
		}
	}
}

function updateCollisionsHealthkitPlayer(dt, p, hk) {
	if (p == null)
		return;
	for (let i = 0; i < hk.number; i++) {
		if (doRectsCollide(p.x, p.y, p.size, p.size, hk.xs[i], hk.ys[i], hk.width, hk.height)) {
			p.hp = Math.min(p.hp + hk.ams[i], p.max_hp);
			destroyHealthkit(hk, i);
		}
	}
}

function updateCollisionsAmmoPlayer(dt, p, ab) {
	if (p == null)
		return;
	for (let i = 0; i < ab.number; i++) {
		if (doRectsCollide(p.x, p.y, p.size, p.size, ab.xs[i], ab.ys[i], ab.width, ab.height)) {
			p.ammo += ab.ams[i];
			destroyAmmobox(ab, i);
		}
	}
}

function updateCollisionsBulletEnemy(dt, b, e) {
	for (let i = 0; i < b.number; i++) {
		for (let j = 0; j < e.number; j++) {
			if (doRectsCollide(b.xs[i], b.ys[i], b.size, b.size, e.xs[j], e.ys[j], e.size, e.size)) {
				b.cls[i] = 'orange';
				b.lts[i] += b.lifetime;
				e.hps[j] -= b.damage;
			}
		}
	}
}
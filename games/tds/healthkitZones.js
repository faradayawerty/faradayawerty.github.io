function getHealthkitZones(show_) {
	return {
		number: 0,
		show: show_,
		xs: [],
		ys: [],
		ws: [],
		hs: [],
		cds: [],
		rts: [],
		lts: []
	};
}

function createHealthkitZone(z, x, y, w, h, rate, lifetime_of_each_healthkit) {
	z.xs.push(x);
	z.ys.push(y);
	z.ws.push(w);
	z.hs.push(h);
	z.rts.push(rate);
	z.cds.push(rate);
	z.lts.push(lifetime_of_each_healthkit);
	z.number++;
}

function destroyHealthkitZone(z, i) {
	z.xs.splice(i, 1);
	z.ys.splice(i, 1);
	z.ws.splice(i, 1);
	z.hs.splice(i, 1);
	z.rts.splice(i, 1);
	z.cds.splice(i, 1);
	z.lts.splice(i, 1);
	z.number--;
}

function updateHealthkitZones(dt, z, hk) {
	for (let i = 0; i < z.number; i++) {
		z.cds[i] -= dt;
		if (z.cds[i] < 0) {
			createHealthkit(hk, z.xs[i] + z.ws[i] * Math.random(), z.ys[i] + z.hs[i] * Math.random(), Math.round(50 + 150 * Math.random()), z.lts[i]);
			z.cds[i] = z.rts[i];
		}
	}
}

function drawHealthkitZones(ctx, z) {
	if (!z.show)
		return;
	for (let i = 0; i < z.number; i++) {
		ctx.strokeStyle = 'pink';
		ctx.strokeRect(z.xs[i], z.ys[i], z.ws[i], z.hs[i]);
	}
}
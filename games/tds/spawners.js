function getSpawners(show_) {
	return {
		number: 0,
		show: show_,
		xs: [],
		ys: [],
		cds: [],
		rts: [],
		rgs: [],
		ms: [],
		zs: []
	};
}

function createSpawner(s, x, y, rate, range, max_zombies) {
	s.xs.push(x);
	s.ys.push(y);
	s.cds.push(rate);
	s.rts.push(rate);
	s.rgs.push(range);
	s.ms.push(max_zombies);
	s.zs.push(0);
	s.number++;
}

function destroySpawner(s, i) {
	s.xs.splice(i, 1);
	s.ys.splice(i, 1);
	s.cds.splice(i, 1);
	s.rts.splice(i, 1);
	s.rgs.splice(i, 1);
	s.ms.splice(i, 1);
	s.zs.splice(i, 1);
	s.number--;
}

function updateSpawners(dt, s, e) {
	for (let i = 0; i < s.number; i++) {
		if (s.zs[i] < s.ms[i])
			s.cds[i] -= dt;
		else {
			j = 0;
			while (e.sps[j] != i)
				j++;
			e.hps[j] -= dt / 128.0;
		}
		if (s.cds[i] < 0) {
			createEnemy(e, s.xs[i] + s.rgs[i] * Math.random(), s.ys[i] + s.rgs[i] * Math.random(), i);
			s.zs[i]++;
			s.cds[i] = s.rts[i];
		}
	}
}

function drawSpawners(ctx, s) {
	if (!s.show)
		return;
	for (let i = 0; i < s.number; i++) {
		ctx.strokeStyle = 'lime';
		ctx.strokeRect(s.xs[i], s.ys[i], s.rgs[i], s.rgs[i]);
	}
}
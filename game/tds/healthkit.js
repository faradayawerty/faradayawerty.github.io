
function getHealthkits() {
  return {
    number: 0,
    width: 20,
    height: 15,
    xs: [],
    ys: [],
    ams: [],
    lts: [],
    cds: []
  };
}

function createHealthkit(hk, x, y, health, lifetime) {
  hk.xs.push(x);
  hk.ys.push(y);
  hk.ams.push(health);
  hk.lts.push(0);
  hk.cds.push(lifetime);
  hk.number++;
}

function destroyHealthkit(hk, i) {
  hk.xs.splice(i, 1);
  hk.ys.splice(i, 1);
  hk.lts.splice(i, 1);
  hk.ams.splice(i, 1);
  hk.cds.splice(i, 1);
  hk.number--;
}

function updateHealthkits(dt, hk) {
  for(let i = 0; i < hk.number; i++) {
	  hk.lts[i] += dt;
  	if(hk.lts[i] > hk.cds[i])
  	  destroyHealthkit(hk, i);
  }
}

function drawHealthkits(ctx, hk) {
	for(let i = 0; i < hk.number; i++) {
	  ctx.fillStyle = 'white';
	  ctx.fillRect(hk.xs[i], hk.ys[i], hk.width, hk.height);
	  ctx.fillStyle = 'red';
	  ctx.fillRect(hk.xs[i] + hk.width * 0.4, hk.ys[i] + hk.height * 0.2, hk.width * 0.2, hk.height * 0.6);
	  ctx.fillRect(hk.xs[i] + hk.width * 0.2, hk.ys[i] + hk.height * 0.4, hk.width * 0.6, hk.height * 0.2);
	  ctx.fillStyle = 'red';
	  ctx.fillRect(hk.xs[i], hk.ys[i] - 4, hk.width, 2);
	  ctx.fillStyle = 'lime';
	  ctx.fillRect(hk.xs[i], hk.ys[i] - 4, (1 - hk.lts[i] / hk.cds[i]) * hk.width, 2);
	}
}

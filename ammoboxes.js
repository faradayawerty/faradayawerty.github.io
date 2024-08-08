
function getAmmoboxes() {
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

function createAmmobox(ab, x, y, ammo_amount, lifetime) {
  ab.xs.push(x);
  ab.ys.push(y);
  ab.ams.push(ammo_amount);
  ab.lts.push(0);
  ab.cds.push(lifetime);
  ab.number++;
}

function destroyAmmobox(ab, i) {
  ab.xs.splice(i, 1);
  ab.ys.splice(i, 1);
  ab.lts.splice(i, 1);
  ab.ams.splice(i, 1);
  ab.cds.splice(i, 1);
  ab.number--;
}

function updateAmmoboxes(dt, ab) {
  for(let i = 0; i < ab.number; i++) {
	  ab.lts[i] += dt;
  	if(ab.lts[i] > ab.cds[i])
  	  destroyAmmobox(ab, i);
  }
}

function drawAmmoboxes(ctx, ab) {
	for(let i = 0; i < ab.number; i++) {
	  ctx.fillStyle = 'yellow';
	  ctx.fillRect(ab.xs[i] + 0 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height);
	  ctx.fillRect(ab.xs[i] + 1 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height);
	  ctx.fillRect(ab.xs[i] + 2 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height);
	  ctx.fillRect(ab.xs[i] + 3 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height);
	  ctx.fillStyle = 'orange';
	  ctx.fillRect(ab.xs[i] + 0 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height * 0.2);
	  ctx.fillRect(ab.xs[i] + 1 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height * 0.2);
	  ctx.fillRect(ab.xs[i] + 2 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height * 0.2);
	  ctx.fillRect(ab.xs[i] + 3 * (0.2 + 0.2/4) * ab.width, ab.ys[i], 0.2 * ab.width, ab.height * 0.2);
	  ctx.fillStyle = 'red';
	  ctx.fillRect(ab.xs[i], ab.ys[i] - 4, ab.width, 2);
	  ctx.fillStyle = 'lime';
	  ctx.fillRect(ab.xs[i], ab.ys[i] - 4, (1 - ab.lts[i] / ab.cds[i]) * ab.width, 2);
	}
}

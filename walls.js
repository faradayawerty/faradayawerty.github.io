
function getWalls(show_) {
  return {
    number: 0,
    show: show_,
    xs: [],
    ys: [],
    ws: [],
    hs: []
  };
}

function createWall(ws, x, y, w, h) {
  ws.xs.push(x);
  ws.ys.push(y);
  ws.ws.push(w);
  ws.hs.push(h);
  ws.number++;
}

function destroyWall(ws, i) {
  ws.xs.splice(i, 1);
  ws.ys.splice(i, 1);
  ws.ws.splice(i, 1);
  ws.hs.splice(i, 1);
  ws.number--;
}

function drawWalls(ctx, w) {
  if(!w.show)
    return;
	for(let i = 0; i < w.number; i++) {
    ctx.strokeStyle = 'magenta';
    ctx.strokeRect(w.xs[i], w.ys[i], w.ws[i], w.hs[i]);
	}
}

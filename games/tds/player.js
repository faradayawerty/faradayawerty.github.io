
function newPlayer(x_, y_) {
  return {
  	x: x_,
  	y: y_,
  	vx: 0,
  	vy: 0,
  	vsx: 1, //velocity scaler
  	vsy: 1,
    speed: 4,
    jump_speed: 10,
    size: 16,
    facing: -1,
    gun_length: 16,
    ammo: 1000,
    hp: 1000,
    max_hp: 1000,
    survivalTime: 0
  };
}

function setPlayerPosition(p, x, y) {
  p.x = x;
  p.y = y;
}

function updatePlayer(dt, p, input) {
  if(p == null)
    return;
	if(input.keys['a'] || input.joystick.left.dx < -0.1)
		p.vx = -p.speed;
	else if(input.keys['d'] || input.joystick.left.dx > 0.1)
		p.vx = p.speed;
  else
		p.vx = 0;
  if(input.keys['w'] || input.joystick.left.dy < -0.1)
		p.vy = -p.speed;
	else if(input.keys['s'] || input.joystick.left.dy > 0.1)
		p.vy = p.speed;
  else
		p.vy = 0;
	p.x += p.vx * p.vsx;
	p.y += p.vy * p.vsy;
	p.survivalTime += dt;
}

function drawPlayer(ctx, p, input) {
  if(p == null)
    return;
	ctx.fillStyle = 'red';
	ctx.fillRect(p.x, p.y, p.size, p.size);
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	let gx = input.mouse.x - p.x + (input.mouse.leftButtonPressed ? 1 : 0) * 64 * (Math.random() * 2 - 1);
	let gy = input.mouse.y - p.y + (input.mouse.leftButtonPressed ? 1 : 0) * 64 * (Math.random() * 2 - 1);
	let g = Math.sqrt(gx*gx + gy*gy);
  ctx.lineTo(p.x + p.gun_length * gx/g, p.y + p.gun_length * gy/g);
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = 'red';
	ctx.fillRect(p.x, p.y - 4, p.size, 2);
	ctx.fillStyle = 'lime';
	ctx.fillRect(p.x, p.y - 4, (p.hp / p.max_hp) * p.size, 2);
}

function drawHUD(ctx, p) {
  if(p == null)
    return;
  drawText(ctx, 15, 20, 'ammo: ' + p.ammo);
  drawText(ctx, 15, 40, 'survived: ' + Math.round(p.survivalTime / 1000.0) + ' seconds');
}

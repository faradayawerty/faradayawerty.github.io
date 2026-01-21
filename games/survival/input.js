
function input_create() {
	return {
		keys: { down: [] },
		mouse: { leftButtonPressed: false, rightButtonPressed: false, wheelUp: false, wheelDown: false, x: 0, y: 0 },
		joystick: {
			left: { dx: 0, dy: 0, x: 0, y: 0, id: -1 },
			right: { dx: 0, dy: 0, x: 0, y: 0, id: -1 },
			radius: 50
		},
		touch: []
	};
}

// Вспомогательная функция для определения зон кнопок (чтобы джойстики их игнорировали)
function getButtonRegions(ctx) {
	let w = ctx.canvas.width;
	let h = ctx.canvas.height;
	let s = Math.min(w, h) * 0.12; 
	let r = s / 2;
	let h_btn = r * 0.8;
	let w_use = r * 1.6;
	let w_pick = r * 3.8; 
	let gap = 16;
	let totalWidth = w_use + gap + w_pick;
	let startX = (w - totalWidth) / 2;
	let uy = h - h_btn * 1.2;

	return {
		use: { x1: startX, x2: startX + w_use, y1: uy - h_btn/2, y2: uy + h_btn/2 },
		pick: { x1: startX + w_use + gap, x2: startX + w_use + gap + w_pick, y1: uy - h_btn/2, y2: uy + h_btn/2 }
	};
}

function getShootDir(input) {
	let R = 600;
	let x = input.mouse.x - 0.5 * window.innerWidth;
	let y = input.mouse.y - 0.5 * window.innerHeight;
	if(input.touch.length > 0) {
		x = input.joystick.left.dx;
		y = input.joystick.left.dy;
	}
	let r = Math.sqrt(x*x + y*y);
	if (r === 0) return {x: 0, y: 0};
	return {x: R * x / r, y: R * y / r};
}

function getWishDir(input) {
	if(input.touch.length > 0)
		return {x: Math.sqrt(Math.sqrt(2)) * input.joystick.right.dx, y: Math.sqrt(Math.sqrt(2)) * input.joystick.right.dy}
	
	let vel = Matter.Vector.create(0, 0);
	if(input.keys.down['d'] || input.keys.down['в']) vel = Matter.Vector.add(vel, Matter.Vector.create(1, 0));
	if(input.keys.down['a'] || input.keys.down['ф']) vel = Matter.Vector.add(vel, Matter.Vector.create(-1, 0));
	if(input.keys.down['s'] || input.keys.down['ы']) vel = Matter.Vector.add(vel, Matter.Vector.create(0, 1));
	if(input.keys.down['w'] || input.keys.down['ц']) vel = Matter.Vector.add(vel, Matter.Vector.create(0, -1));
	return vel;
}

// --- ВОССТАНОВЛЕННЫЕ ФУНКЦИИ МЫШИ ---
function isMouseWheelUp(input) { let val = input.mouse.wheelUp; input.mouse.wheelUp = false; return val; }
function isMouseWheelDown(input) { let val = input.mouse.wheelDown; input.mouse.wheelDown = false; return val; }
function isMouseRightButtonPressed(input) { let val = input.mouse.rightButtonPressed; input.mouse.rightButtonPressed = false; return val; }
function isMouseLeftButtonPressed(input) { let val = input.mouse.leftButtonPressed; input.mouse.leftButtonPressed = false; return val; }
function isScreenTouched(input) { return input.touch.length > 0; }

function isKeyDown(input, key, read_once=false) {
	let val = input.keys.down[key];
	if(read_once) input.keys.down[key] = false;
	return val;
}

function keyHandler(keys, e) {
	let k = e.key.toLowerCase();
	keys.down[k] = (e.type !== 'keyup');
}

function initializeKeyboardInput(keys) {
	window.addEventListener('keydown', e => keyHandler(keys, e));
	window.addEventListener('keyup', e => keyHandler(keys, e));
}

function mouseMoveHandler(mouse, ctx, e) {
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
	mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
}

function mouseHandler(mouse, ctx, e) {
	if(e.type === 'mousedown' || e.type === 'mouseup') {
		mouse.leftButtonPressed = (e.buttons === 1 || (e.type === 'mousedown' && e.button === 0));
		mouse.rightButtonPressed = (e.buttons === 2 || (e.type === 'mousedown' && e.button === 2));
	}
	if(e.deltaY) { 
		mouse.wheelUp = e.deltaY < 0; 
		mouse.wheelDown = e.deltaY > 0; 
	}
}

function initializeMouseInput(mouse, ctx) {
	window.addEventListener('mousemove', e => mouseMoveHandler(mouse, ctx, e));
	window.addEventListener('mousedown', e => mouseHandler(mouse, ctx, e));
	window.addEventListener('mouseup', e => mouseHandler(mouse, ctx, e));
	window.addEventListener("wheel", e => mouseHandler(mouse, ctx, e));
}

function touchHandler(touch, joystick, ctx, e) {
	e.preventDefault();
	touch.length = 0;
	for (let i = 0; i < e.touches.length; i++) {
		let et = e.touches[i];
		touch.push({
			id: et.identifier,
			x: (et.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth,
			y: (et.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight
		});
	}

	let w = ctx.canvas.width;
	let h = ctx.canvas.height;
	joystick.radius = Math.min(w / 16, h / 16);
	joystick.left.x = w / 6;
	joystick.left.y = 5 * h / 6;
	joystick.right.x = 5 * w / 6;
	joystick.right.y = 5 * h / 6;

	for (let t of touch) {
		if (t.id === joystick.left.id) {
			let dx = t.x - joystick.left.x;
			let dy = t.y - joystick.left.y;
			let offset = Math.sqrt(dx * dx + dy * dy);
			joystick.left.dx = dx / (offset || 1);
			joystick.left.dy = dy / (offset || 1);
		}
		if (t.id === joystick.right.id) {
			let dx = t.x - joystick.right.x;
			let dy = t.y - joystick.right.y;
			let offset = Math.sqrt(dx * dx + dy * dy);
			joystick.right.dx = dx / (offset || 1);
			joystick.right.dy = dy / (offset || 1);
		}
	}
}

function initializeTouchInput(touch, joystick, ctx) {
	window.addEventListener('touchstart', function(e) {
		let regions = getButtonRegions(ctx);
		let deadZoneHeight = ctx.canvas.height * 0.5;

		for (let i = 0; i < e.changedTouches.length; i++) {
			let t = e.changedTouches[i];
			let tx = (t.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
			let ty = (t.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;

			// 1. ИГНОРИРОВАТЬ, если нажатие в верхних 25% экрана
			if (ty < deadZoneHeight) continue;

			// 2. ИГНОРИРОВАТЬ, если нажатие попало в кнопки действий
			let hitButton = (tx > regions.use.x1 && tx < regions.use.x2 && ty > regions.use.y1 && ty < regions.use.y2) ||
							(tx > regions.pick.x1 && tx < regions.pick.x2 && ty > regions.pick.y1 && ty < regions.pick.y2);

			if (hitButton) continue; 

			// 3. Активация джойстиков
			if (tx < ctx.canvas.width / 2 && joystick.left.id === -1) joystick.left.id = t.identifier;
			else if (tx >= ctx.canvas.width / 2 && joystick.right.id === -1) joystick.right.id = t.identifier;
		}
		touchHandler(touch, joystick, ctx, e);
	}, {passive: false});

	window.addEventListener('touchmove', e => touchHandler(touch, joystick, ctx, e), {passive: false});

	const stopTouch = (e) => {
		for (let i = 0; i < e.changedTouches.length; i++) {
			let id = e.changedTouches[i].identifier;
			if (id === joystick.left.id) { joystick.left.id = -1; joystick.left.dx = 0; joystick.left.dy = 0; }
			if (id === joystick.right.id) { joystick.right.id = -1; joystick.right.id = -1; joystick.right.dx = 0; joystick.right.dy = 0; }
		}
		touchHandler(touch, joystick, ctx, e);
	};
	window.addEventListener('touchcancel', stopTouch);
	window.addEventListener('touchend', stopTouch);
}

function touch_drawCircle(ctx, x, y, r, fill_color, stroke_color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = fill_color;
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = stroke_color;
	ctx.stroke();
}

function drawJoysticks(ctx, joystick) {
	if (joystick.left && joystick.left.id !== -1) {
		ctx.globalAlpha = 0.5;
		touch_drawCircle(ctx, joystick.left.x, joystick.left.y, joystick.radius, 'gray', 'black');
		ctx.globalAlpha = 1.0;
		touch_drawCircle(ctx, joystick.left.x + joystick.radius * joystick.left.dx, joystick.left.y + joystick.radius * joystick.left.dy, joystick.radius / 4, 'black', 'white');
	}
	if (joystick.right && joystick.right.id !== -1) {
		ctx.globalAlpha = 0.5;
		touch_drawCircle(ctx, joystick.right.x, joystick.right.y, joystick.radius, 'gray', 'black');
		ctx.globalAlpha = 1.0;
		touch_drawCircle(ctx, joystick.right.x + joystick.radius * joystick.right.dx, joystick.right.y + joystick.radius * joystick.right.dy, joystick.radius / 4, 'black', 'white');
	}
}

function drawMobileActionButtons(ctx, input) {
	if (!input || input.touch === undefined) return;
	
	let regions = getButtonRegions(ctx);
	let ux = (regions.use.x1 + regions.use.x2) / 2;
	let uy = (regions.use.y1 + regions.use.y2) / 2;
	let fx = (regions.pick.x1 + regions.pick.x2) / 2;
	let fy = (regions.pick.y1 + regions.pick.y2) / 2;
	
	let w_use = regions.use.x2 - regions.use.x1;
	let w_pick = regions.pick.x2 - regions.pick.x1;
	let h_btn = regions.use.y2 - regions.use.y1;

	let isUsePressed = false;
	let isPickPressed = false;
	for (let t of input.touch) {
		if (t.x > regions.use.x1 && t.x < regions.use.x2 && t.y > regions.use.y1 && t.y < regions.use.y2) isUsePressed = true;
		if (t.x > regions.pick.x1 && t.x < regions.pick.x2 && t.y > regions.pick.y1 && t.y < regions.pick.y2) isPickPressed = true;
	}
	
	input.keys.down['c'] = isUsePressed;
	input.keys.down['f'] = isPickPressed;

	const drawFlatBase = (x, y, bw, bh, active) => {
		ctx.globalAlpha = active ? 0.8 : 0.35;
		ctx.fillStyle = "#4477ff";
		ctx.beginPath();
		ctx.roundRect(x - bw/2, y - bh/2, bw, bh, 4);
		ctx.fill();
		ctx.strokeStyle = "rgba(255,255,255,0.5)";
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.globalAlpha = 1.0;
	};

	let p = 2.2; 
	let th = p * 5;

	// USE
	drawFlatBase(ux, uy, w_use, h_btn, isUsePressed);
	ctx.fillStyle = "white";
	const renderLet = (data, ox, oy) => {
		data.forEach((row, i) => {
			row.split('').forEach((col, j) => {
				if(col === '#') ctx.fillRect(ox + j*p, oy + i*p, p, p);
			});
		});
	};
	renderLet(["# #","# #","# #","# #","###"], ux - p*5.5, uy - th/2);
	renderLet(["###","#  ","###","  #","###"], ux - p*1.5, uy - th/2);
	renderLet(["###","#  ","###","#  ","###"], ux + p*2.5, uy - th/2);

	// PICK UP / CAR
	drawFlatBase(fx, fy, w_pick, h_btn, isPickPressed);
	ctx.fillStyle = "white";
	let curX = fx - (p * 34) / 2;
	let curY = fy - th / 2;
	renderLet(["###","# #","###","#  ","#  "], curX, curY); curX += 4*p;
	renderLet([" # "," # "," # "," # "," # "], curX, curY); curX += 3*p;
	renderLet(["###","#  ","#  ","#  ","###"], curX, curY); curX += 4*p;
	renderLet(["# #","# #","## ","# #","# #"], curX, curY); curX += 4*p;
	curX += 2*p;
	ctx.strokeStyle = "white";
	ctx.lineWidth = p;
	ctx.beginPath(); ctx.moveTo(curX, curY + th); ctx.lineTo(curX + p*2, curY); ctx.stroke();
	curX += 4*p;
	renderLet(["###","#  ","#  ","#  ","###"], curX, curY); curX += 4*p;
	renderLet(["###","# #","###","# #","# #"], curX, curY); curX += 4*p;
	renderLet(["###","# #","###","## ","# #"], curX, curY);
}

function input_create() {
	return {
		keys: {
			down: []
		},
		mouse: {
			leftButtonPressed: false,
			rightButtonPressed: false,
			wheelUp: false,
			wheelDown: false,
			x: 0,
			y: 0
		},
		joystick: {
			left: {
				dx: 0,
				dy: 0,
				x: 0,
				y: 0,
				id: -1
			},
			right: {
				dx: 0,
				dy: 0,
				x: 0,
				y: 0,
				id: -1
			},
			radius: 50
		},
		touch: [],
		prevTouchButtons: {
			use: false,
			pick: false,
			plus: false,
			minus: false
		}
	};
}

function getButtonRegions(ctx) {
	let w = ctx.canvas.width;
	let h = ctx.canvas.height;
	let btnSize = Math.min(w, h) * 0.15;
	let gap = 15;
	let leftJoyX = w / 6;
	let rightJoyX = 5 * w / 6;
	let joyY = 5 * h / 6;
	let bottomY = joyY - (btnSize * 2) - 100;
	return {
		use: {
			x1: leftJoyX - btnSize / 2,
			x2: leftJoyX + btnSize / 2,
			y1: bottomY,
			y2: bottomY + btnSize
		},
		pick: {
			x1: leftJoyX - btnSize / 2,
			x2: leftJoyX + btnSize / 2,
			y1: bottomY + btnSize + gap,
			y2: bottomY + btnSize * 2 + gap
		},
		plus: {
			x1: rightJoyX - btnSize / 2,
			x2: rightJoyX + btnSize / 2,
			y1: bottomY,
			y2: bottomY + btnSize
		},
		minus: {
			x1: rightJoyX - btnSize / 2,
			x2: rightJoyX + btnSize / 2,
			y1: bottomY + btnSize + gap,
			y2: bottomY + btnSize * 2 + gap
		}
	};
}

function getShootDir(input) {
	let R = 600;
	let x = input.mouse.x - 0.5 * window.innerWidth;
	let y = input.mouse.y - 0.5 * window.innerHeight;
	if (input.touch.length > 0) {
		x = input.joystick.left.dx;
		y = input.joystick.left.dy;
	}
	let r = Math.sqrt(x * x + y * y);
	if (r === 0) return {
		x: 0,
		y: 0
	};
	return {
		x: R * x / r,
		y: R * y / r
	};
}

function getWishDir(input) {
	if (input.touch.length > 0)
		return {
			x: Math.sqrt(Math.sqrt(2)) * input.joystick.right.dx,
			y: Math.sqrt(Math.sqrt(2)) * input.joystick.right.dy
		}
	let vel = Matter.Vector.create(0, 0);
	if (input.keys.down['d'] || input.keys.down['в']) vel = Matter.Vector.add(
		vel, Matter.Vector.create(1, 0));
	if (input.keys.down['a'] || input.keys.down['ф']) vel = Matter.Vector.add(
		vel, Matter.Vector.create(-1, 0));
	if (input.keys.down['s'] || input.keys.down['ы']) vel = Matter.Vector.add(
		vel, Matter.Vector.create(0, 1));
	if (input.keys.down['w'] || input.keys.down['ц']) vel = Matter.Vector.add(
		vel, Matter.Vector.create(0, -1));
	return vel;
}

function isMouseWheelUp(input) {
	let val = input.mouse.wheelUp;
	input.mouse.wheelUp = false;
	return val;
}

function isMouseWheelDown(input) {
	let val = input.mouse.wheelDown;
	input.mouse.wheelDown = false;
	return val;
}

function isMouseRightButtonPressed(input) {
	let val = input.mouse.rightButtonPressed;
	input.mouse.rightButtonPressed = false;
	return val;
}

function isMouseLeftButtonPressed(input) {
	let val = input.mouse.leftButtonPressed;
	input.mouse.leftButtonPressed = false;
	return val;
}

function isScreenTouched(input) {
	return input.touch.length > 0;
}

function isKeyDown(input, key, read_once = false) {
	let val = input.keys.down[key];
	if (read_once) input.keys.down[key] = false;
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
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx
		.canvas.clientWidth;
	mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx
		.canvas.clientHeight;
}

function mouseHandler(mouse, ctx, e) {
	if (e.type === 'mousedown' || e.type === 'mouseup') {
		mouse.leftButtonPressed = (e.buttons === 1 || (e.type === 'mousedown' &&
			e.button === 0));
		mouse.rightButtonPressed = (e.buttons === 2 || (e.type ===
			'mousedown' && e.button === 2));
	}
	if (e.deltaY) {
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
	if (e) e.preventDefault();
	touch.length = 0;
	for (let i = 0; i < e.touches.length; i++) {
		let et = e.touches[i];
		touch.push({
			id: et.identifier,
			x: (et.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width /
				ctx.canvas.clientWidth,
			y: (et.clientY - ctx.canvas.offsetTop) * ctx.canvas.height /
				ctx.canvas.clientHeight
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
		let deadZoneHeight = ctx.canvas.height * 0.2;
		for (let i = 0; i < e.changedTouches.length; i++) {
			let t = e.changedTouches[i];
			let tx = (t.clientX - ctx.canvas.offsetLeft) * ctx.canvas
				.width / ctx.canvas.clientWidth;
			let ty = (t.clientY - ctx.canvas.offsetTop) * ctx.canvas
				.height / ctx.canvas.clientHeight;
			if (ty < deadZoneHeight) continue;
			let hitButton =
				(tx > regions.use.x1 && tx < regions.use.x2 && ty >
					regions.use.y1 && ty < regions.use.y2) ||
				(tx > regions.pick.x1 && tx < regions.pick.x2 && ty >
					regions.pick.y1 && ty < regions.pick.y2) ||
				(tx > regions.plus.x1 && tx < regions.plus.x2 && ty >
					regions.plus.y1 && ty < regions.plus.y2) ||
				(tx > regions.minus.x1 && tx < regions.minus.x2 && ty >
					regions.minus.y1 && ty < regions.minus.y2);
			if (hitButton) continue;
			if (tx < ctx.canvas.width / 2 && joystick.left.id === -1)
				joystick.left.id = t.identifier;
			else if (tx >= ctx.canvas.width / 2 && joystick.right.id ===
				-1)
				joystick.right.id = t.identifier;
		}
		touchHandler(touch, joystick, ctx, e);
	}, {
		passive: false
	});
	window.addEventListener('touchmove', e => touchHandler(touch, joystick, ctx,
		e), {
		passive: false
	});
	const stopTouch = (e) => {
		for (let i = 0; i < e.changedTouches.length; i++) {
			let id = e.changedTouches[i].identifier;
			if (id === joystick.left.id) {
				joystick.left.id = -1;
				joystick.left.dx = 0;
				joystick.left.dy = 0;
			}
			if (id === joystick.right.id) {
				joystick.right.id = -1;
				joystick.right.dx = 0;
				joystick.right.dy = 0;
			}
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
		touch_drawCircle(ctx, joystick.left.x, joystick.left.y, joystick.radius,
			'gray', 'black');
		ctx.globalAlpha = 1.0;
		touch_drawCircle(ctx, joystick.left.x + joystick.radius * joystick.left
			.dx, joystick.left.y + joystick.radius * joystick.left.dy,
			joystick.radius / 4, 'black', 'white');
	}
	if (joystick.right && joystick.right.id !== -1) {
		ctx.globalAlpha = 0.5;
		touch_drawCircle(ctx, joystick.right.x, joystick.right.y, joystick
			.radius, 'gray', 'black');
		ctx.globalAlpha = 1.0;
		touch_drawCircle(ctx, joystick.right.x + joystick.radius * joystick
			.right.dx, joystick.right.y + joystick.radius * joystick.right
			.dy, joystick.radius / 4, 'black', 'white');
	}
}

function drawMobileActionButtons(ctx, input) {
	if (!input || input.touch === undefined) return;
	let regions = getButtonRegions(ctx);
	const drawButton = (region, lines, isActive) => {
		let bw = region.x2 - region.x1;
		let bh = region.y2 - region.y1;
		let cx = (region.x1 + region.x2) / 2;
		let cy = (region.y1 + region.y2) / 2;
		ctx.globalAlpha = isActive ? 0.8 : 0.4;
		ctx.fillStyle = "#4477ff";
		ctx.beginPath();
		ctx.roundRect(region.x1, region.y1, bw, bh, 10);
		ctx.fill();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "white";
		let fontSize = lines.length > 1 ? bh * 0.22 : bh * 0.4;
		ctx.font = `bold ${fontSize}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		if (lines.length === 1) {
			ctx.fillText(lines[0], cx, cy);
		}
		else {
			ctx.fillText(lines[0], cx, cy - fontSize * 0.6);
			ctx.fillText(lines[1], cx, cy + fontSize * 0.6);
		}
	};
	const isPressed = (r) => input.touch.some(t =>
		t.x > r.x1 && t.x < r.x2 && t.y > r.y1 && t.y < r.y2 &&
		t.id !== input.joystick.left.id && t.id !== input.joystick.right.id
	);
	let currentUse = isPressed(regions.use);
	let currentPick = isPressed(regions.pick);
	let currentPlus = isPressed(regions.plus);
	let currentMinus = isPressed(regions.minus);
	input.keys.down['c'] = currentUse;
	input.keys.down['f'] = currentPick;
	input.keys.down['='] = currentPlus && !input.prevTouchButtons.plus;
	input.keys.down['-'] = currentMinus && !input.prevTouchButtons.minus;
	input.prevTouchButtons.use = currentUse;
	input.prevTouchButtons.pick = currentPick;
	input.prevTouchButtons.plus = currentPlus;
	input.prevTouchButtons.minus = currentMinus;
	drawButton(regions.use, ['USE'], currentUse);
	drawButton(regions.pick, ['PICK UP', 'CAR'], currentPick);
	drawButton(regions.plus, ['+'], currentPlus);
	drawButton(regions.minus, ['-'], currentMinus);
}
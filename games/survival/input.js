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
		touch: []
	};
}

function getButtonRegions(ctx) {
	let w = ctx.canvas.width;
	let h = ctx.canvas.height;
	let btnSize = Math.min(w, h) * 0.15;
	let gap = 20;
	let totalWidth = (btnSize * 2) + gap;
	let startX = (w - totalWidth) / 2;
	let uy = 5 * h / 6;
	return {
		use: {
			x1: startX,
			x2: startX + btnSize,
			y1: uy - btnSize / 2,
			y2: uy + btnSize / 2
		},
		pick: {
			x1: startX + btnSize + gap,
			x2: startX + (btnSize * 2) + gap,
			y1: uy - btnSize / 2,
			y2: uy + btnSize / 2
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
	e.preventDefault();
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
		let deadZoneHeight = ctx.canvas.height * 0.5;
		for (let i = 0; i < e.changedTouches.length; i++) {
			let t = e.changedTouches[i];
			let tx = (t.clientX - ctx.canvas.offsetLeft) * ctx.canvas
				.width / ctx.canvas.clientWidth;
			let ty = (t.clientY - ctx.canvas.offsetTop) * ctx.canvas
				.height / ctx.canvas.clientHeight;
			if (ty < deadZoneHeight) continue;
			let hitButton = (tx > regions.use.x1 && tx < regions.use
					.x2 && ty > regions.use.y1 && ty < regions.use.y2
				) ||
				(tx > regions.pick.x1 && tx < regions.pick.x2 && ty >
					regions.pick.y1 && ty < regions.pick.y2);
			if (hitButton) continue;
			if (tx < ctx.canvas.width / 2 && joystick.left.id === -1)
				joystick.left.id = t.identifier;
			else if (tx >= ctx.canvas.width / 2 && joystick.right.id ===
				-1) joystick.right.id = t.identifier;
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
	const renderLet = (data, ox, oy, p) => {
		data.forEach((row, i) => {
			row.split('').forEach((col, j) => {
				if (col === '#') ctx.fillRect(ox + j * p,
					oy + i * p, p, p);
			});
		});
	};
	const drawButton = (region, type, isActive) => {
		let bw = region.x2 - region.x1;
		let bh = region.y2 - region.y1;
		let cx = (region.x1 + region.x2) / 2;
		let cy = (region.y1 + region.y2) / 2;
		ctx.globalAlpha = isActive ? 0.8 : 0.35;
		ctx.fillStyle = "#4477ff";
		ctx.beginPath();
		ctx.roundRect(region.x1, region.y1, bw, bh, bw * 0.15);
		ctx.fill();
		ctx.strokeStyle = "rgba(255,255,255,0.5)";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "white";
		if (type === 'USE') {
			let p = bw * 0.05;
			let tw = p * 11;
			let th = p * 5;
			renderLet(["# #", "# #", "# #", "# #", "###"], cx - tw / 2, cy -
				th / 2, p);
			renderLet(["###", "#  ", "###", "  #", "###"], cx - tw / 2 + p *
				4, cy - th / 2, p);
			renderLet(["###", "#  ", "###", "#  ", "###"], cx - tw / 2 + p *
				8, cy - th / 2, p);
		} else {
			let p = bw * 0.038;
			let th = p * 5;
			let gap = p * 3;
			let totalH = (th * 2) + gap;
			let startY = cy - totalH / 2;
			let pickUpWords = [{
					m: ["###", "# #", "###", "#  ", "#  "],
					w: 3
				},
				{
					m: ["#", "#", "#", "#", "#"],
					w: 1
				},
				{
					m: ["###", "#  ", "#  ", "#  ", "###"],
					w: 3
				},
				{
					m: ["# #", "# #", "## ", "# #", "# #"],
					w: 3
				},
				{
					m: [],
					w: 2
				},
				{
					m: ["# #", "# #", "# #", "# #", "###"],
					w: 3
				},
				{
					m: ["###", "# #", "###", "#  ", "#  "],
					w: 3
				}
			];
			let tw1 = pickUpWords.reduce((acc, curr) => acc + curr.w + 1,
				0) * p;
			let visualOffset = p * 0.8;
			let curX1 = (cx - tw1 / 2) + visualOffset;
			pickUpWords.forEach(letter => {
				if (letter.m.length > 0) renderLet(letter.m, curX1,
					startY, p);
				curX1 += (letter.w + 1) * p;
			});
			let carWords = [{
					m: ["###", "#  ", "#  ", "#  ", "###"],
					w: 3
				},
				{
					m: ["###", "# #", "###", "# #", "# #"],
					w: 3
				},
				{
					m: ["###", "# #", "###", "## ", "# #"],
					w: 3
				}
			];
			let tw2 = carWords.reduce((acc, curr) => acc + curr.w + 1, 0) *
				p;
			let curX2 = cx - tw2 / 2;
			let line2Y = startY + th + gap;
			carWords.forEach(letter => {
				renderLet(letter.m, curX2, line2Y, p);
				curX2 += (letter.w + 1) * p;
			});
		}
	};
	let isUsePressed = input.touch.some(t => t.x > regions.use.x1 && t.x <
		regions.use.x2 && t.y > regions.use.y1 && t.y < regions.use.y2);
	let isPickPressed = input.touch.some(t => t.x > regions.pick.x1 && t.x <
		regions.pick.x2 && t.y > regions.pick.y1 && t.y < regions.pick.y2);
	input.keys.down['c'] = isUsePressed;
	input.keys.down['f'] = isPickPressed;
	drawButton(regions.use, 'USE', isUsePressed);
	drawButton(regions.pick, 'PICK_CAR', isPickPressed);
}
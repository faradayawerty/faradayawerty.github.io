function getInput() {
	return {
		keys: {},
		mouse: {},
		joystick: {},
		touch: []
	};
}

function keyHandler(keys, e) {
	keys[e.key] = e.type === 'keyup' ? false : true;
}

function mouseHandler(mouse, ctx, e) {
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
	mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
	mouse.leftButtonPressed = e.buttons === 1 ? true : false;
}

function touchHandler(touch, joystick, ctx, e) {
	e.preventDefault();
	while (touch.length > 0)
		touch.pop();
	for (let i = 0; i < e.touches.length; i++) {
		t = {}
		t.x = (e.touches[i].clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
		t.y = (e.touches[i].clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
		touch.push(t);
	}

	let w = ctx.canvas.width;
	let h = ctx.canvas.height;

	joystick.radius = Math.min(w / 16, h / 16);

	joystick.left.x = w / 6;
	joystick.left.y = 5 * h / 6;
	joystick.right.x = 5 * w / 6;
	joystick.right.y = 5 * h / 6;

	joystick.left.dx = 0;
	joystick.left.dy = 0;
	joystick.right.dx = 0;
	joystick.right.dy = 0;

	if (!joystick.enabled)
		return;

	for (let i = 0; i < touch.length; i++) {
		if (touch[i].x < w / 2 && touch[i].y > h / 2) {
			joystick.left.dx = -joystick.left.x + touch[i].x;
			joystick.left.dy = -joystick.left.y + touch[i].y;
			offset = Math.sqrt(joystick.left.dx * joystick.left.dx + joystick.left.dy * joystick.left.dy);
			if (offset <= 0)
				continue;
			joystick.left.dx = joystick.left.dx / offset;
			joystick.left.dy = joystick.left.dy / offset;
		}
		if (touch[i].x > w / 2 && touch[i].y > h / 2) {
			joystick.right.dx = -joystick.right.x + touch[i].x;
			joystick.right.dy = -joystick.right.y + touch[i].y;
			offset = Math.sqrt(joystick.right.dx * joystick.right.dx + joystick.right.dy * joystick.right.dy);
			if (offset <= 0)
				continue;
			joystick.right.dx = joystick.right.dx / offset;
			joystick.right.dy = joystick.right.dy / offset;
		}
	}
}

function initializeTouchInput(touch, joystick, ctx) {

	joystick.left = {}
	joystick.right = {}

	joystick.left.dx = 0;
	joystick.left.dy = 0;
	joystick.right.dx = 0;
	joystick.right.dy = 0;

	joystick.enabled = true;

	window.addEventListener('touchstart', function(e) {
		touchHandler(touch, joystick, ctx, e);
	});
	window.addEventListener('touchmove', function(e) {
		touchHandler(touch, joystick, ctx, e);
	});
	window.addEventListener('touchcancel', function(e) {
		touchHandler(touch, joystick, ctx, e);
	});
	window.addEventListener('touchend', function(e) {
		touchHandler(touch, joystick, ctx, e);
	});
}

function initializeKeyboardInput(keys) {
	window.addEventListener('keydown', function(e) {
		keyHandler(keys, e);
	});
	window.addEventListener('keyup', function(e) {
		keyHandler(keys, e);
	});
}

function initializeMouseInput(mouse, ctx) {
	window.addEventListener('mousemove', function(e) {
		mouseHandler(mouse, ctx, e);
	});
	window.addEventListener('mousedown', function(e) {
		mouseHandler(mouse, ctx, e);
	});
	window.addEventListener('mouseup', function(e) {
		mouseHandler(mouse, ctx, e);
	});
}

function drawJoysticks(ctx, joystick) {
	if (!joystick.enabled)
		return;
	if (Math.abs(joystick.left.dx) > 0 || Math.abs(joystick.left.dy) > 0) {
		drawCircle(ctx, joystick.left.x, joystick.left.y, joystick.radius, 'gray', 'black');
		drawCircle(ctx, joystick.left.x + joystick.radius * joystick.left.dx,
			joystick.left.y + joystick.radius * joystick.left.dy, joystick.radius / 4, 'black', 'white');
	}
	if (Math.abs(joystick.right.dx) > 0 || Math.abs(joystick.right.dy) > 0) {
		drawCircle(ctx, joystick.right.x, joystick.right.y, joystick.radius, 'gray', 'black');
		drawCircle(ctx, joystick.right.x + joystick.radius * joystick.right.dx,
			joystick.right.y + joystick.radius * joystick.right.dy, joystick.radius / 4, 'black', 'white');
	}
}
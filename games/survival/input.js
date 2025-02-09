
function input_create() {
	return {
		keys: {
			down: []
		},
		mouse: {
			leftButtonPressed: false,
			wheelUp: false,
			wheelDown: false
		},
		joystick: {},
		touch: []
	};
}

function getWishDir(input) {
	if(input.touch.length > 0)
		return {x: input.joystick.right.dx, y: input.joystick.right.dy}

	let vel = Matter.Vector.create(0, 0);

	if(input.keys.down['d'] || input.keys.down['в'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(1, 0));
	if(input.keys.down['a'] || input.keys.down['ф'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(-1, 0));
	if(input.keys.down['s'] || input.keys.down['ы'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, 1));
	if(input.keys.down['w'] || input.keys.down['ц'])
		vel = Matter.Vector.add(vel, Matter.Vector.create(0, -1));

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

function isMouseLeftButtonPressed(input) {
	let val = input.mouse.leftButtonPressed;
	input.mouse.leftButtonPressed = false;
	return val;
}

function isKeyDown(input, key, read_once=false) {
	let val = input.keys.down[key];
	if(read_once)
		input.keys.down[key] = false;
	return val;
}

function keyHandler(keys, e) {
	if(e.type === 'keyup')
		keys.down[e.key.toLowerCase()] = false;
	else
		keys.down[e.key.toLowerCase()] = true;
}

function mouseHandler(mouse, ctx, e) {
	mouse.leftButtonPressed = e.buttons === 1 ? true : false;
	if(e.deltaY && e.deltaY > 0)
		mouse.wheelUp = true;
	else
		mouse.wheelUp = false;
	if(e.deltaY && e.deltaY < 0)
		mouse.wheelDown = true;
	else
		mouse.wheelDown = false;
}

function mouseMoveHandler(mouse, ctx, e) {
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
	mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
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
		mouseMoveHandler(mouse, ctx, e);
	});
	window.addEventListener('mousedown', function(e) {
		mouseHandler(mouse, ctx, e);
	});
	window.addEventListener('mouseup', function(e) {
		mouseHandler(mouse, ctx, e);
	});
	window.addEventListener("wheel", function(e) {
		mouseHandler(mouse, ctx, e);
	});
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

function touch_drawCircle(ctx, x, y, r, fill_color, stroke_color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = fill_color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = stroke_color;
	ctx.stroke();
}

function drawJoysticks(ctx, joystick) {
	if (Math.abs(joystick.left.dx) > 0 || Math.abs(joystick.left.dy) > 0) {
		touch_drawCircle(ctx, joystick.left.x, joystick.left.y, joystick.radius, 'gray', 'black');
		touch_drawCircle(ctx, joystick.left.x + joystick.radius * joystick.left.dx, joystick.left.y + joystick.radius * joystick.left.dy, joystick.radius / 4, 'black', 'white');
	}
	if (Math.abs(joystick.right.dx) > 0 || Math.abs(joystick.right.dy) > 0) {
		touch_drawCircle(ctx, joystick.right.x, joystick.right.y, joystick.radius, 'gray', 'black');
		touch_drawCircle(ctx, joystick.right.x + joystick.radius * joystick.right.dx, joystick.right.y + joystick.radius * joystick.right.dy, joystick.radius / 4, 'black', 'white');
	}
}

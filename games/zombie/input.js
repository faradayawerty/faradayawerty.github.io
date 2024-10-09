
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
	while(touch.length > 0)
		touch.pop();
	for(let i = 0; i < e.touches.length; i++) {
		t = {}
		t.x = (e.touches[i].clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
		t.y = (e.touches[i].clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
		touch.push(t);
	}

	let w = window.innerWidth;
	let h = window.innerHeight;

	joystick.radius = Math.min(w/16, h/16);

	joystick.left = {}
	joystick.right = {}

	joystick.left.x = w / 4;
	joystick.left.y = 5 * h / 6;
	joystick.right.x = 3 * w / 4;
	joystick.right.y = 5 * h / 6;

	joystick.left.dx = 0;
	joystick.left.dy = 0;
	joystick.left.offset = 0;
	joystick.right.dx = 0;
	joystick.right.dy = 0;
	joystick.right.offset = 0;

	for(let i = 0; i < touch.length; i++) {
		if(touch[i].x < w / 2 && touch[i].y > h / 2) {
			joystick.left.dx = -joystick.left.x + touch[i].x;
			joystick.left.dy = -joystick.left.y + touch[i].y;
			joystick.left.offset = Math.sqrt(joystick.left.dx*joystick.left.dx + joystick.left.dy*joystick.left.dy);
		}
		if(input.touch[i].x > w / 2 && touch[i].y > h / 2) {
			joystick.right.dx = -joystick.right.x + touch[i].x;
			joystick.right.dy = -joystick.right.y + touch[i].y;
			joystick.right.offset = Math.sqrt(joystick.right.dx*joystick.right.dx + joystick.right.dy*joystick.right.dy);
		}
	}
}

function initializeTouchInput(touch, joystick, ctx) {
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


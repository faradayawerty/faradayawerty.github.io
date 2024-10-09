
function getInput() {
	return {
		keys: {},
		mouse: {},
		joystick: {}
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

function touchHandler(touch, ctx, e) {
	e.preventDefault();
	while(touch.length > 0)
		touch.pop();
	for(let i = 0; i < e.touches.length; i++) {
		t = {}
		t.x = (e.touches[i].clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
		t.y = (e.touches[i].clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
		touch.push(t);
	}
}

function initializeTouchInput(touch, ctx) {
	window.addEventListener('touchstart', function(e) {
		touchHandler(touch, ctx, e);
	});
	window.addEventListener('touchmove', function(e) {
		touchHandler(touch, ctx, e);
	});
	window.addEventListener('touchcancel', function(e) {
		touchHandler(touch, ctx, e);
	});
	window.addEventListener('touchend', function(e) {
		touchHandler(touch, ctx, e);
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



function getInput() {
	return {
		keys: {},
		mouse: {},
		touch: {}
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
	touch.exists = e.touches.length > 0 ? true : false;
	touch.x = (e.touches[0].clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
	touch.y = (e.touches[0].clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
	e.preventDefault();
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


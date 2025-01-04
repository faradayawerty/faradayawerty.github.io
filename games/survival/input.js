
function input_create() {
	return {
		keys: {
			down: []
		},
		mouse: {
			leftButtonPressed: false,
			wheelUp: false,
			wheelDown: false
		}
	};
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

function isKeyDown(input, key, read_once=false) {
	let val = input.keys.down[key];
	if(read_once)
		input.keys.down[key] = false;
	return val;
}

function keyHandler(keys, e) {
	if(e.type === 'keyup')
		keys.down[e.key] = false;
	else
		keys.down[e.key] = true;
}

function mouseHandler(mouse, ctx, e) {
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
	mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
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
	window.addEventListener("wheel", function(e) {
		mouseHandler(mouse, ctx, e);
	});
}


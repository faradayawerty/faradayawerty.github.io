
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

	let w = window.innerWidth;
	let h = window.innerHeight;
	let left_joystick_x = w / 4;
	let left_joystick_y = 5 * h / 6;
	let right_joystick_x = 3 * w / 4;
	let right_joystick_y = 5 * h / 6;
	let joystick_radius = Math.min(w/16, h/16);
	let left_joystick_dx = 0, left_joystick_dy = 0, left_joystick_offset = 0;
	let right_joystick_dx = 0, right_joystick_dy = 0, right_joystick_offset = 0;;

	for(let i = 0; i < input.touch.length; i++) {
		if(input.touch[i].x < w / 2 && input.touch[i].y > h / 2) {
			left_joystick_dx = -left_joystick_x + input.touch[i].x;
			left_joystick_dy = -left_joystick_y + input.touch[i].y;
			left_joystick_offset = Math.sqrt(left_joystick_dx*left_joystick_dx + left_joystick_dy*left_joystick_dy);
			drawCircle(ctx, left_joystick_x, left_joystick_y , joystick_radius, 'gray', 'black');
			drawCircle(ctx, left_joystick_x + joystick_radius * left_joystick_dx / left_joystick_offset, left_joystick_y + joystick_radius * left_joystick_dy / left_joystick_offset, joystick_radius / 4, 'red', 'blue');
		}
		if(input.touch[i].x > w / 2 && input.touch[i].y > h / 2) {
			right_joystick_dx = -right_joystick_x + input.touch[i].x;
			right_joystick_dy = -right_joystick_y + input.touch[i].y;
			right_joystick_offset = Math.sqrt(right_joystick_dx*right_joystick_dx + right_joystick_dy*right_joystick_dy);
			drawCircle(ctx, right_joystick_x, right_joystick_y, joystick_radius, 'gray', 'black');
			drawCircle(ctx, right_joystick_x + joystick_radius * right_joystick_dx / right_joystick_offset, right_joystick_y + joystick_radius * right_joystick_dy / right_joystick_offset, joystick_radius / 4, 'purple', 'cyan');
		}
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

function drawCircle(ctx, x, y, r, fill_color, stroke_color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = fill_color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = stroke_color;
	ctx.stroke();
}


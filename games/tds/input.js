
function getInput() {
	return {
		keys: {},
		mouse: { x: 0, y: 0, leftButtonPressed: false },
		joystick: {
			left: { x: 0, y: 0, dx: 0, dy: 0 },
			right: { x: 0, y: 0, dx: 0, dy: 0 },
			radius: 0
		},
		touch: []
	};
}

function keyHandler(keys, e) {
	keys[e.key] = e.type === 'keyup' ? false : true;
}

function mouseHandler(mouse, canvas, e) {
	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	mouse.x = (e.clientX - rect.left) * scaleX;
	mouse.y = (e.clientY - rect.top) * scaleY;

	// В некоторых движках используется e.buttons, в других проверка события
	if (e.type === 'mousedown') mouse.leftButtonPressed = true;
	if (e.type === 'mouseup') mouse.leftButtonPressed = false;
	
	// На всякий случай обновляем состояние, если кнопка зажата при движении
	if (e.type === 'mousemove') {
		mouse.leftButtonPressed = (e.buttons === 1);
	}
}

function touchHandler(touch, joystick, canvas, e) {
	if (e.cancelable) e.preventDefault();

	const rect = canvas.getBoundingClientRect();
	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	while (touch.length > 0) touch.pop();

	for (let i = 0; i < e.touches.length; i++) {
		let t = {};
		t.x = (e.touches[i].clientX - rect.left) * scaleX;
		t.y = (e.touches[i].clientY - rect.top) * scaleY;
		touch.push(t);
	}

	let w = canvas.width;
	let h = canvas.height;

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
			let dx = touch[i].x - joystick.left.x;
			let dy = touch[i].y - joystick.left.y;
			let offset = Math.sqrt(dx * dx + dy * dy);
			if (offset > 0) {
				joystick.left.dx = dx / offset;
				joystick.left.dy = dy / offset;
			}
		}
		if (touch[i].x > w / 2 && touch[i].y > h / 2) {
			let dx = touch[i].x - joystick.right.x;
			let dy = touch[i].y - joystick.right.y;
			let offset = Math.sqrt(dx * dx + dy * dy);
			if (offset > 0) {
				joystick.right.dx = dx / offset;
				joystick.right.dy = dy / offset;
			}
		}
	}
}

function initializeTouchInput(touch, joystick, cvs) {
	const canvas = cvs.canvas || cvs; // защита если передали ctx вместо canvas
	window.addEventListener('touchstart', function(e) { touchHandler(touch, joystick, canvas, e); }, {passive: false});
	window.addEventListener('touchmove', function(e) { touchHandler(touch, joystick, canvas, e); }, {passive: false});
	window.addEventListener('touchcancel', function(e) { touchHandler(touch, joystick, canvas, e); }, {passive: false});
	window.addEventListener('touchend', function(e) { touchHandler(touch, joystick, canvas, e); }, {passive: false});
}

function initializeKeyboardInput(keys) {
	window.addEventListener('keydown', function(e) { keyHandler(keys, e); });
	window.addEventListener('keyup', function(e) { keyHandler(keys, e); });
}

function initializeMouseInput(mouse, cvs) {
	const canvas = cvs.canvas || cvs;
	window.addEventListener('mousemove', function(e) { mouseHandler(mouse, canvas, e); });
	window.addEventListener('mousedown', function(e) { mouseHandler(mouse, canvas, e); });
	window.addEventListener('mouseup', function(e) { mouseHandler(mouse, canvas, e); });
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

function drawJoysticks(ctx, joystick) {
	if (Math.abs(joystick.left.dx) > 0 || Math.abs(joystick.left.dy) > 0) {
		drawCircle(ctx, joystick.left.x, joystick.left.y, joystick.radius, 'rgba(128,128,128,0.5)', 'black');
		drawCircle(ctx, joystick.left.x + joystick.radius * joystick.left.dx, joystick.left.y + joystick.radius * joystick.left.dy, joystick.radius / 4, 'black', 'white');
	}
	if (Math.abs(joystick.right.dx) > 0 || Math.abs(joystick.right.dy) > 0) {
		drawCircle(ctx, joystick.right.x, joystick.right.y, joystick.radius, 'rgba(128,128,128,0.5)', 'black');
		drawCircle(ctx, joystick.right.x + joystick.radius * joystick.right.dx, joystick.right.y + joystick.radius * joystick.right.dy, joystick.radius / 4, 'black', 'white');
	}
}

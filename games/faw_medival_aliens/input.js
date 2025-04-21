

const inputs = {
	walk_dir: { x: 0, y: 0 },
	shoot_dir: { x: 0, y: 0 },
	use: false,
	open_inventory: false,
	open_menu: false,
};

const keysPressed = {};
let mouseDown = false;
let mousePos = { x: 0, y: 0 };

function updateWalkDir() {
	inputs.walk_dir.x = 0;
	inputs.walk_dir.y = 0;

	if (keysPressed['w'])
		inputs.walk_dir.y -= 1;
	if (keysPressed['s'])
		inputs.walk_dir.y += 1;
	if (keysPressed['a'])
		inputs.walk_dir.x -= 1;
	if (keysPressed['d'])
		inputs.walk_dir.x += 1;
}

function updateShootDir() {
	if (mouseDown) {
		const dx = mousePos.x;
		const dy = mousePos.y;
		const length = Math.hypot(dx, dy) || 1;
		inputs.shoot_dir.x = dx / length;
		inputs.shoot_dir.y = dy / length;
	} else {
		inputs.shoot_dir.x = 0;
		inputs.shoot_dir.y = 0;
	}
}

window.addEventListener('keydown', (e) => {
	keysPressed[e.key.toLowerCase()] = true;
	if (e.key.toLowerCase() === 'f')
		inputs.use = true;
	if (e.key.toLowerCase() === 'e')
		inputs.open_inventory = true;
	if (e.key.toLowerCase() === 'escape')
		inputs.open_menu = true;
	updateWalkDir();
});

window.addEventListener('keyup', (e) => {
	keysPressed[e.key.toLowerCase()] = false;
	if (e.key.toLowerCase() === 'f')
		inputs.use = false;
	if (e.key.toLowerCase() === 'e')
		inputs.open_inventory = false;
	if (e.key.toLowerCase() === 'escape')
		inputs.open_menu = false;
	updateWalkDir();
});

// Слушатели мыши
window.addEventListener('mousedown', (e) => {
	if (e.button === 0) {
		mouseDown = true;
		updateShootDir();
	}
});

window.addEventListener('mouseup', (e) => {
	if (e.button === 0) {
		mouseDown = false;
		updateShootDir();
	}
});

window.addEventListener('mousemove', (e) => {
	mousePos.x = e.clientX;
	mousePos.y = e.clientY;
	updateShootDir();
});


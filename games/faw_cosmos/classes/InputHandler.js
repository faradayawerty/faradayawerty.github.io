
class InputHandler {

	constructor(target) {
		if (!target)
			target = window;

		this.keys = {};
		this.mouseButtons = {};
		this.mousePos = { x: 0, y: 0 };
		this.touches = [];
		this.lastTouch = null;

		target.addEventListener("keydown", (e) => {
			this.keys[e.key] = true;
		});

		target.addEventListener("keyup", (e) => {
			this.keys[e.key] = false;
		});

		target.addEventListener("mousedown", (e) => {
			this.mouseButtons[e.button] = true;
		});

		target.addEventListener("mouseup", (e) => {
			this.mouseButtons[e.button] = false;
		});

		target.addEventListener("mousemove", (e) => {
			this.mousePos.x = e.clientX;
			this.mousePos.y = e.clientY;
		});

		target.addEventListener("touchstart", (e) => {
			this.touches.length = 0;

			for (let i = 0; i < e.touches.length; i++) {
				let t = e.touches[i];
				this.touches.push({
					x: t.clientX,
					y: t.clientY,
					id: t.identifier
				});
			}

			if (e.changedTouches.length > 0) {
				let t = e.changedTouches[e.changedTouches.length - 1];
				this.lastTouch = {
					x: t.clientX,
					y: t.clientY,
					id: t.identifier
				};
			}
		});

		target.addEventListener("touchmove", (e) => {
			this.touches.length = 0;

			for (let i = 0; i < e.touches.length; i++) {
				let t = e.touches[i];
				this.touches.push({
					x: t.clientX,
					y: t.clientY,
					id: t.identifier
				});
			}
		});

		target.addEventListener("touchend", (e) => {
			this.touches.length = 0;

			for (let i = 0; i < e.touches.length; i++) {
				let t = e.touches[i];
				this.touches.push({
					x: t.clientX,
					y: t.clientY,
					id: t.identifier
				});
			}

			if (e.changedTouches.length > 0) {
				let t = e.changedTouches[e.changedTouches.length - 1];
				this.lastTouch = {
					x: t.clientX,
					y: t.clientY,
					id: t.identifier
				};
			}
		});
	}

	isKeyDown(code) {
		return !!this.keys[code];
	}

	isMouseKeyDown(button) {
		if (button === undefined)
			button = 0;
		return !!this.mouseButtons[button];
	}

	getMousePos() {
		return {
			x: this.mousePos.x,
			y: this.mousePos.y
		};
	}

	getTouches() {
		return this.touches;
	}

	getLastTouch() {
		return this.lastTouch;
	}
}


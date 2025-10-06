
class InputHandler {

	keys = {};
	pointer = {
		x: 0,
		y: 0,
		down: false
	};

	constructor() {
		window.addEventListener("keydown", (e) => {
			this.keys[e.key] = true;
		});
		window.addEventListener("keyup", (e) => {
			this.keys[e.key] = false;
		});
		window.addEventListener("mousedown", (e) => {
			this.pointer.down = true;
			this.pointer.x = e.clientX;
			this.pointer.y = e.clientY;
		});
		window.addEventListener("mouseup", (e) => {
			this.pointer.down = false;
			this.pointer.x = e.clientX;
			this.pointer.y = e.clientY;
		});
		window.addEventListener("mousemove", (e) => {
			this.pointer.x = e.clientX;
			this.pointer.y = e.clientY;
		});
		window.addEventListener("touchstart", (e) => {
			this.pointer.down = true;
			this.pointer.x = e.touches[0].clientX;
			this.pointer.y = e.touches[0].clientY;
		});
		window.addEventListener("touchend", (e) => {
			this.pointer.down = false;
			if (e.changedTouches.length > 0) {
				this.pointer.x = e.changedTouches[0].clientX;
				this.pointer.y = e.changedTouches[0].clientY;
			}
		});
		window.addEventListener("touchmove", (e) => {
			this.pointer.x = e.touches[0].clientX;
			this.pointer.y = e.touches[0].clientY;
			e.preventDefault();
		}, { passive: false });
	}

	isKeyDown(key) {
		return this.keys[key] === true;
	}

	isPointerDown() {
		return this.pointer.down;
	}

	getPointerX() {
		return this.pointer.x;
	}

	getPointerY() {
		return this.pointer.y;
	}
}


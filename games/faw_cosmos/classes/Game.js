
class Game { 
	constructor(gameCanvas, gameInputHandler) {
		this.canvas = gameCanvas;
		this.canvasContext = gameCanvas.getContext("2d");
		this.inputHandler = gameInputHandler;
		this.isInitialized = false;
		this.isRunning = false;
		this.gameLoopLastEntryTime = 0;
		this.gameLoopAccumulatedUnprocessedTime = 0;
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
		this.canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";
		this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
		this.canvasContext.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
	}

	init() {
		if(this.isInitialized)
			return;
		window.addEventListener("resize", () => this.resizeCanvas());
		this.resizeCanvas();
		this.isInitialized = true;
	}

	update(dt) {
		if(!this.isInitialized)
			return;
	}

	draw() {
		if(!this.isInitialized)
			return;
	}

	gameLoop() {
		if (!this.isRunning)
			return;
		let step = 20; // milliseconds, 50 updates per second
		let currentTime = performance.now();
		let elapsedTime = currentTime - this.gameLoopLastEntryTime;
		this.gameLoopLastEntryTime = currentTime;
		this.gameLoopAccumulatedUnprocessedTime += elapsedTime;
		this.gameLoopAccumulatedUnprocessedTime = Math.min(this.gameLoopAccumulatedUnprocessedTime, 1000);
		while (this.gameLoopAccumulatedUnprocessedTime > step) {
			this.update(step);
			this.gameLoopAccumulatedUnprocessedTime -= step;
		}
		this.draw();
		requestAnimationFrame(() => this.gameLoop());
	}

	run() {
		if(this.isRunning)
			return;
		this.init();
		this.isRunning = true;
		this.gameLoopLastEntryTime = performance.now();
		this.gameLoop();
	}
}


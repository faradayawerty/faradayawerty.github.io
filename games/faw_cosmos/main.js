
function prepareContext(ctx) {
	if(ctx.canvas !== undefined) {
		ctx.canvas.width = ctx.canvas.clientWidth;
		ctx.canvas.height = ctx.canvas.clientHeight;
		ctx.fillStyle = "#ff00ff";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
}

function animate(ctx, game, ui, lastFrameTime)
{
	let currentFrameTime = Date.now();

	/* do calculations */
	game.update(currentFrameTime - lastFrameTime);
	ui.update();
 
	/* show things on screen*/
	prepareContext(ctx);

	ctx.save();
	{
		ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
		let scale = Math.min(1/2000.0 * ctx.canvas.width, 1/2000.0 * ctx.canvas.height);
		ctx.scale(scale, -scale);

		ctx.fillStyle = "#111111";
		ctx.fillRect(-1000, -1000, 2000, 2000);
		game.draw(ctx);
	}
	ctx.restore();

	ui.draw(ctx);

	requestAnimationFrame(function() {
		animate(ctx, game, ui, currentFrameTime)
	});
}

function main()
{
	let ctx1 = document.getElementById("faw_space__game_canvas").getContext("2d");

	let input1 = new InputHandler();
	let game1 = new Game(input1);
	let ui1  = new UserInterface(input1);

	window.addEventListener('resize', function() { prepareContext(ctx1.canvas) });

	animate(ctx1, game1, ui1, Date.now());
}


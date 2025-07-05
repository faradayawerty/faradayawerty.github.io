
function game_state_create() {
	return {
		current_scene: null
	};
}

function main() {
	let canvas1 = document.getElementById("game-canvas");
	let context1 = canvas1.getContext("2d");

	game_state1 = game_state_create();
	game_state1.current_scene = scene_create();

	scene_add_cube(game_state1.current_scene, 0, 0, 0, 100, 100, 100);
	scene_add_cube(game_state1.current_scene, -200, 0, 0, 100, 150, 100);
	scene_add_cube(game_state1.current_scene, -200, 300, 0, 100, 50, 100);
	scene_add_cube(game_state1.current_scene, -200, 300, 400, 150, 50, 100);

	gameloop(game_state1, canvas1, context1);
}

function gameloop(game_state, canvas, context) {

	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.save();

	context.translate(0.5 * canvas.width, 0.5 * canvas.height);

	scene_render(context, game_state.current_scene);

	context.restore();

	requestAnimationFrame(function() {
		gameloop(game_state, canvas, context);
	});
}


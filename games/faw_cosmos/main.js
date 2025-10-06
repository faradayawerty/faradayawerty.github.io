
function main()
{
	let canvas1 = document.getElementById("canvas__FAW_COSMOS");
	let input1 = new InputHandler();
	let game1 = new Game(canvas1, input1);
	game1.run();
}

window.addEventListener("DOMContentLoaded", main);


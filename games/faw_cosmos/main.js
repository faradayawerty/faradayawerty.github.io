
function resizeCanvas(canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function main()
{
	const canvas1 = document.getElementById("canvas__FAW_COSMOS");
	const context1 = canvas1.getContext("2d");

	resizeCanvas(canvas1);
	window.addEventListener("resize", () => resizeCanvas(canvas1));

	context1.fillStyle = "green";
	context1.fillRect(10, 10, 150, 100);
}

main()


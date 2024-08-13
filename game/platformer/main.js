
function getData(url) {
	let data = null;
	fetch(url).then(res => res.json).then(res => data = res);
	return data;
}

function newScene() {
	return {
		objects: []
	};
}

function clearScene(scene) {
	while (scene.objects.length > 0) {
		scene.objects.pop();
	}
}

function setScene(scene, file_url) {

	scene.objects.push(Matter.Bodies.rectangle(300, 200, 80, 80));
	scene.objects.push(Matter.Bodies.rectangle(400, 200, 80, 80));
	scene.objects.push(Matter.Bodies.rectangle(250, 300, 100, 30, {
		isStatic: true
	}));
	scene.objects.push(Matter.Bodies.rectangle(400, 800, 700, 30, {
		isStatic: true
	}));

	//for (let i = 0; i < level.rectangle_bodies.length; i++)
	//scene.objects.push(Matter.Bodies.rectangle(...level.rectangle_bodies[i]));
}

function resizeCanvas(cvs) {
	cvs.width = window.innerWidth;
	cvs.height = window.innerHeight;
}

function drawBody(ctx, body, color) {
	ctx.beginPath();
	ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
	for (let i = 1; i < body.vertices.length; i += 1)
		ctx.lineTo(body.vertices[i].x, body.vertices[i].y);
	ctx.lineTo(body.vertices[0].x, body.vertices[0].y);
	ctx.fillStyle = color;
	ctx.closePath();
	ctx.fill();
}

function render(ctx, phys_engine) {
	let bodies = Matter.Composite.allBodies(phys_engine.world);
	ctx.fillStyle = '#111a22';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (let i = 0; i < bodies.length; i += 1)
		if (bodies[i].isStatic)
			drawBody(ctx, bodies[i], '#771155');
		else
			drawBody(ctx, bodies[i], '#117755');
}

function update(dt, input, phys_engine) {
	let bodies = Matter.Composite.allBodies(phys_engine.world);
	let player = bodies[0];
	if (input.keys.a)
		Matter.Body.setVelocity(player, {
			x: -10,
			y: 0
		});
	else if (input.keys.d)
		Matter.Body.setVelocity(player, {
			x: 10,
			y: 0
		});
	if (input.keys.w && Math.abs(Matter.Body.getVelocity(player).y) < 1)
		Matter.Body.setVelocity(player, {
			x: 0,
			y: -10
		});
	Matter.Engine.update(phys_engine, dt);
}

function animate(ctx, input, phys_engine) {
	window.requestAnimationFrame(function() {
		animate(ctx, input, phys_engine);
	});
	update(1000.0 / 60.0, input, phys_engine);
	render(ctx, phys_engine);
}

function main() {

	console.log(getData('./data/scenes/test.json'));

	let phys_engine1 = Matter.Engine.create();
	let cvs1 = document.createElement('canvas');
	let ctx1 = cvs1.getContext('2d');
	let input1 = getInputHandler();
	initializeKeyboardInput(input1.keys);
	initializeMouseInput(input1.mouse, ctx1);
	document.body.appendChild(cvs1);
	resizeCanvas(cvs1);
	window.onresize = (function() {
		resizeCanvas(cvs1)
	});
	scene1 = newScene();
	setScene(scene1, 'test.json');
	Matter.Composite.add(phys_engine1.world, scene1.objects);
	animate(ctx1, input1, phys_engine1);
}

main();



function enemy_create(g, x, y) {
	let e = {
		target: g.objects.find((obj) => obj.name == "player").data,
		speed: 7,
		body: Matter.Bodies.rectangle(x, y, 30, 30)
	};
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw);
}

function enemy_update(e, dt) {
	if(e.target != null) {
		let dx = e.target.body.position.x - e.body.position.x;
		let dy = e.target.body.position.y - e.body.position.y;
		let v = Math.sqrt(dx*dx + dy*dy);
		dx = e.speed * dx / v;
		dy = e.speed * dy / v;
		let vel = Matter.Vector.create(dx, dy);
		Matter.Body.setVelocity(e.body, vel);
	}
}

function enemy_draw(e, ctx) {
	fillMatterBody(ctx, e.body, 'green');
	drawMatterBody(ctx, e.body, 'white');
}


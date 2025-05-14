

function draw(ctx, g) {

	ctx.fillStyle = "#000011";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draw enemies
	let es = g.objects.enemies;
	for(let i = 0; i < es.length; i++) {
		ctx.fillStyle = es[i].color;
		ctx.fillRect(es[i].x, es[i].y, es[i].w, es[i].h);
	}
	
	let plr = g.objects.player;
	let camera_x = 0.5 * ctx.canvas.width - plr.x - 0.5 * plr.w;
	let camera_y = 0.5 * ctx.canvas.height - plr.y - 0.5 * plr.h;
	
	//ctx.save();
	//ctx.translate(camera_x, camera_y);

	// draw player
	ctx.fillStyle = plr.color;
	ctx.fillRect(plr.x, plr.y, plr.w, plr.h);

	//ctx.restore();
}


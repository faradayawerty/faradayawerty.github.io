
function draw(ctx, g) {

	ctx.fillStyle = "#000011";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	let plr = g.objects.spaceships[g.state.iplayer];
	let camera_x = 0.5 * ctx.canvas.width - plr.x - 0.5 * plr.w;
	let camera_y = 0.5 * ctx.canvas.height - plr.y - 0.5 * plr.h;
	
	ctx.save();
	ctx.translate(camera_x, camera_y);
	
	let as = g.objects.asteroids;
	for(let i = 0; i < as.length; i++)
		draw_type(ctx, as[i]);
	let ss = g.objects.spaceships;
	for(let i = 0; i < ss.length; i++)
		draw_type(ctx, ss[i]);
	
	draw_type(ctx, plr);
	
	ctx.restore();
}

function draw_type(ctx, obj) {
	if(!obj.type)
		return;
	switch(obj.type) {
		case TYPE_SPACESHIP:
			ctx.fillStyle = "gray";
			ctx.strokeStyle = "white";
			ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
			ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
			break;
		case TYPE_ASTEROID:
			ctx.fillStyle = "brown";
			ctx.strokeStyle = "white";
			ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
			ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
			break;
		default:
			return;
			break;
	}
}


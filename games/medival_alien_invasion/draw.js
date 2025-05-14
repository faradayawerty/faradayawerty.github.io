
function draw(ctx, g) {

	ctx.fillStyle = "#000011";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	let plr = g.objects.player; // has to have x, y
	let camera_x = 0.5 * ctx.canvas.width - plr.x - 0.5 * plr.w;
	let camera_y = 0.5 * ctx.canvas.height - plr.y - 0.5 * plr.h;
	
	ctx.save();
	ctx.translate(camera_x, camera_y);
	
	let es = g.objects.enemies;
	for(let i = 0; i < es.length; i++)
		draw_type(ctx, es[i]);
	let of = g.objects.functional;
	for(let i = 0; i < of.length; i++)
		draw_type(ctx, of[i]);
	
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


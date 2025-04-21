
let DRAWABLE_TYPE_GAME = 1; // подразумевает наличие массива 'objects'
let DRAWABLE_TYPE_RECTANGLE = 2; // has x, y, w, h, outline color and fill color

// doesn't change any state
function draw(ctx, obj) {

	if(!obj.drawable)
		return;

	if(obj.drawable_type == DRAWABLE_TYPE_GAME) {
		ctx.fillStyle = "#001122";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for(let i = 0; i < obj.objects.length; i++)
			draw(ctx, obj.objects[i]);
	}

	if(obj.drawable_type == DRAWABLE_TYPE_RECTANGLE) {
		ctx.fillStyle = obj.color_fill;
		ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
		ctx.strokeStyle = obj.color_outline;
		ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
	}
}


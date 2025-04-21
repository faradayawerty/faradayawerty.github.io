
/*
 * game object is a thing in the game that can be created, destroyed, updated
 * and drawn
 *
 * func_update is a function taking the object to be updated and delta time
 * func_draw is a function taking the object to be drawn and canvas context
 * func_destroy is a function taking the object to be destroyed
 *
 * z is 'the third coordinate' needed to decide which object is updated and
 * drawn first
 *
 */

function game_object_create(g,
	name, data, func_update, func_draw, func_destroy, z) {

	let obj = {
		game: g,
		name: name,
		data: data,
		update: func_update,
		draw: func_draw,
		destroy: func_destroy,
		z: z
	};
	let i = 0;
	while(i < g.objects.length && g.objects[i].z < obj.z)
		i++;
	g.objects.splice(i, 0, obj);

}


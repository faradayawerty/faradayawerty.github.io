
let OBJECT_TYPE_GAME = 1; // подразумевает наличие массива 'objects'
let OBJECT_TYPE_PLAYER = 2;

function get_initial_GameState() {
	return {
		drawable: true,
		drawable_type: DRAWABLE_TYPE_GAME,
		object_type: OBJECT_TYPE_GAME,
		objects: []
	};
}

function step(obj, it) {

	if(obj.object_type == OBJECT_TYPE_GAME) {
		for(let i = 0; i < obj.objects.length; i++)
			step(obj.objects[i], it);
	}

	if(obj.object_type == OBJECT_TYPE_PLAYER)
		step_Player(obj, it);
}


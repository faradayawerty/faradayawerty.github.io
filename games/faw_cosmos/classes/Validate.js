
class Validate {

	static isGameObject(target) {
		if(!target || !target.game || !(target.game instanceof Game))
			throw new TypeError((typeof target) + " " + "must be a game object");
	}

	static canDie(target) {
		if(!target || typeof target.die !== "function")
			throw new TypeError((typeof target) + " " + "must have a die() method");
	}

	static assert(condition, message) {
		if(!condition)
			throw new Error(message);
	}

}


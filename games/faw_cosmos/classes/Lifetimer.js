
class Lifetimer {

	constructor(target, lifetime) {
		Validate.canDie(target);
		this.target = target;
		this.time = 0;
		this.lifetime = lifetime;
	}

	update(dt) {
		this.time += dt;
		if(this.time > this.lifetime)
			this.target.die();
	}

}


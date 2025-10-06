
class ECS
{
	constructor(systems) {
		this.systems = systems;
		this.components = {};
	}

	addEntity(entity) {
	}

	removeEntity(id) {
	}

	getEntityByID(id) {
	}

	runSystems(dt) {
		for(let i = 0; i < this.systems.length; i++)
			this.systems[i](dt, this);
	}
}


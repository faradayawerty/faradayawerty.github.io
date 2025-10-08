
class BaseECS
{
	constructor(numberOfComponents) {
		this.numberOfComponents = numberOfComponents;
		this.data = [];
		for(let i = 0; i < 1 + numberOfComponents; i++)
			data.push([]);
		this.idToIndex = new Map();
		this.nextId = 0;
	}

	addEntity(entityData) {
		this.idToIndex.set(this.nextId, this.data[0].length);
		this.data[0].push(this.nextId);
		this.nextId++;
		for(let i = 0; i < entityData.length && i < this.numberOfComponents; i++)
			this.data[i + 1].push(entityData[i]);
		for(let i = entityData.length; i < this.numberOfComponents; i++)
			this.data[i + 1].push(null);
	}

	removeEntity(id) {
		let index = this.idToIndex(id);
		let indexLast = this.data[0].length - 1;
	}

	getEntityByID(id) {
	}

	runSystems() {
	}
}


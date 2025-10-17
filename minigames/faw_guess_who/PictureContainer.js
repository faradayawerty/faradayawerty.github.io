
class PictureContainer{

	constructor() {
		let container = document.createElement('div');
		container.className = 'picture-container';
		container.id = 'pictureContainer';
		document.body.appendChild(container);
		this.element = container;
	}

	clear() {
		this.element.innerHTML = '';
	}

	addPictureFromPath(path) {
	    let wrapper = document.createElement('div');
	    wrapper.style.position = 'relative'; // контейнер для картинки + креста
	    wrapper.className = 'image-wrapper';

	    let newPicture = document.createElement('div');
	    newPicture.className = 'image-button';
	    newPicture.style.backgroundImage = "url('" + path + "')";
	    wrapper.appendChild(newPicture);

	    let crossElement = this.createRedCross(wrapper); // крест поверх картинки
	    crossElement.style.position = 'absolute';
	    crossElement.style.top = '0';
	    crossElement.style.left = '0';
	    crossElement.style.width = '100%';
	    crossElement.style.height = '100%';
	    crossElement.style.pointerEvents = 'none';
	    crossElement.style.display = 'none';

	    newPicture.addEventListener('click', () => {
		   newPicture.style.filter = newPicture.style.filter === 'grayscale(100%)' ? 'none' : 'grayscale(100%)';
		   crossElement.style.display = crossElement.style.display === 'none' ? 'block' : 'none';
	    });

	    this.element.appendChild(wrapper);
	}

	setFlags() {
		this.clear();
		for (let i = 0; i < countryFlagsPaths.length; i++)
		   this.addPictureFromPath("picture_sets/default_countries/" + countryFlagsPaths[i]);
	}

	createRedCross(pictureElement) {
		let cross = document.createElement('div');
		cross.style.position = 'absolute';
		cross.style.top = '0';
		cross.style.left = '0';
		cross.style.width = '100%';
		cross.style.height = '100%';
		cross.style.pointerEvents = 'none'; // чтобы клик проходил на картинку
		cross.style.display = 'none'; // изначально скрыт

		let line1 = document.createElement('div');
		line1.style.position = 'absolute';
		line1.style.width = '2px';
		line1.style.height = '100%';
		line1.style.backgroundColor = 'red';
		line1.style.left = '50%';
		line1.style.top = '0';
		line1.style.transform = 'rotate(45deg)';
		line1.style.transformOrigin = 'center';

		let line2 = document.createElement('div');
		line2.style.position = 'absolute';
		line2.style.width = '2px';
		line2.style.height = '100%';
		line2.style.backgroundColor = 'red';
		line2.style.left = '50%';
		line2.style.top = '0';
		line2.style.transform = 'rotate(-45deg)';
		line2.style.transformOrigin = 'center';

		cross.appendChild(line1);
		cross.appendChild(line2);

		pictureElement.appendChild(cross);
		return cross;
	}
}


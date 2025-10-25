
class PictureContainer {
	htmlContainer = null;

	constructor() {
		this.htmlContainer = document.createElement('div');
		this.htmlContainer.id = 'picture-container';
		this.htmlContainer.style.width = '49%';
		this.htmlContainer.style.height = '98%';
		this.htmlContainer.style.background= '#aa1111';
		this.htmlContainer.style.margin = '0.5%'
		document.body.appendChild(this.htmlContainer);
	}

	updateLayout(container) {
		if(window.innerWidth > window.innerHeight) {
			container.style.width = '49%';
			container.style.height = '98%';
		} else {
			container.style.width = '98%';
			container.style.height = '49%';
		}
	}
}


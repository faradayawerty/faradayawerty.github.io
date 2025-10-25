
class PictureContainer {
	htmlContainer = null;
	htmlButtonsContainer = null;
	htmlPicturesContainer = null;

	constructor() {
		this.htmlContainer = document.createElement('div');
		this.htmlContainer.id = 'picture-container';
		this.htmlContainer.style.width = '49%';
		this.htmlContainer.style.height = '98%';
		this.htmlContainer.style.background= '#aa1111';
		this.htmlContainer.style.margin = '0.5%'
		this.htmlContainer.style.padding = '0.5%'
		this.htmlContainer.style.boxSizing = 'border-box';
		document.body.appendChild(this.htmlContainer);

		this.htmlContainer.style.display = 'grid';
		this.htmlContainer.style.gridTemplateRows = '19fr 1fr';
		this.htmlContainer.style.gap = '1%';

		this.htmlPicturesContainer = document.createElement('div');
		this.htmlPicturesContainer.id = 'buttons-container';
		this.htmlPicturesContainer.style.background= '#aa4411';
		this.htmlPicturesContainer.style.width = '100%';
		this.htmlPicturesContainer.style.height = '100%';
		this.htmlContainer.appendChild(this.htmlPicturesContainer);

		this.htmlButtonsContainer = document.createElement('div');
		this.htmlButtonsContainer.id = 'buttons-container';
		this.htmlButtonsContainer.style.background= '#aaaa11';
		this.htmlButtonsContainer.style.width = '100%';
		this.htmlButtonsContainer.style.height = '100%';
		this.htmlButtonsContainer.style.display = 'flex';
		this.htmlButtonsContainer.style.flexDirection = 'row';
		this.htmlButtonsContainer.style.justifyContent = 'space-between';
		this.htmlButtonsContainer.style.alignItems = 'stretch';
		this.htmlButtonsContainer.style.gap = '1%';
		this.htmlButtonsContainer.style.flexWrap = 'wrap';
		this.htmlContainer.appendChild(this.htmlButtonsContainer);
	}

	addButton(text, action) {
		let button = document.createElement("button");
		button.textContent = text;
		button.onclick = action;
		button.style.flex = '1';
		button.style.margin = '1% 1%';
		button.style.background = '#11aa11';
		button.style.fontSize = '100%';
		this.htmlButtonsContainer.appendChild(button);
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


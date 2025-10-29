
class PictureContainer {
	htmlContainer = null;
	htmlButtonsContainer = null;
	htmlPicturesContainer = null;

	current_default_opacity = '0.1';

	chosenPicture = null;

	constructor() {
		this.htmlContainer = document.createElement('div');
		this.htmlContainer.id = 'picture-container';
		this.htmlContainer.style.width = '49%';
		this.htmlContainer.style.height = '98%';
		this.htmlContainer.style.background = Config.colors.pictureContainer.background;
		this.htmlContainer.style.margin = '0.5%'
		this.htmlContainer.style.padding = '0.5%'
		this.htmlContainer.style.boxSizing = 'border-box';
		document.body.appendChild(this.htmlContainer);

		this.htmlContainer.style.display = 'grid';
		this.htmlContainer.style.gridTemplateRows = '19fr 1fr';
		this.htmlContainer.style.gap = '1%';

		this.htmlPicturesContainer = document.createElement('div');
		this.htmlPicturesContainer.id = 'buttons-container';
		this.htmlPicturesContainer.style.background = Config.colors.pictureContainer.pictureContainerBackground ;
		this.htmlPicturesContainer.style.width = '100%';
		this.htmlPicturesContainer.style.height = '100%';
		this.htmlPicturesContainer.style.overflowY = 'auto';
		this.htmlPicturesContainer.style.display = 'flex';
		this.htmlPicturesContainer.style.flexWrap = 'wrap';
		this.htmlPicturesContainer.style.justifyContent = 'flex-start';
		this.htmlPicturesContainer.style.alignItems = 'flex-start';
		this.htmlPicturesContainer.style.gap = '1%';
		this.htmlContainer.appendChild(this.htmlPicturesContainer);

		this.htmlButtonsContainer = document.createElement('div');
		this.htmlButtonsContainer.id = 'buttons-container';
		this.htmlButtonsContainer.style.background = Config.colors.pictureContainer.buttonContainerBackground;
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

	clearPictures() {
		this.htmlPicturesContainer.innerHTML = '';
	}

	updateLayout(container) {
		let defaultOpacity = '0.1';
		if(window.innerWidth > window.innerHeight) {
			container.style.width = '49%';
			container.style.height = '98%';
		} else {
			container.style.width = '98%';
			container.style.height = '49%';
			defaultOpacity = '0.75';
		}
		this.current_default_opacity = defaultOpacity;
		let elements = document.querySelectorAll('[id="delete-cross"]');
		elements.forEach(el => {
			el.style.opacity = defaultOpacity;
		});
	}

	addButton(text, action, fontSize='1.5vh') {
		let button = document.createElement("button");
		button.textContent = text;
		button.onclick = action;
		button.style.flex = '1';
		button.style.margin = '1% 1%';
		button.style.background = Config.colors.pictureContainer.buttonColor;
		button.style.color = Config.colors.chatContainer.textColorDark;
		button.style.fontSize = fontSize;
		button.style.border = '1px solid #000';

		button.addEventListener('mouseenter', () => {
			button.style.background = Config.colors.pictureContainer.buttonColorHover;
		});

		button.addEventListener('mouseleave', () => {
			button.style.background = Config.colors.pictureContainer.buttonColor;
		});

		this.htmlButtonsContainer.appendChild(button);
	}

	addImagesInput() {
		let input = document.createElement('input');
		input.type = 'file';
		input.multiple = true;
		input.accept = 'image/*';
		input.style.display = 'none';

		let button = document.createElement("button");
		button.textContent = "add images";
		button.style.flex = '1';
		button.style.margin = '1% 1%';
		button.style.background = Config.colors.pictureContainer.buttonColor;
		button.style.fontSize = '1.5vh';
		button.style.cursor = 'pointer';
		button.style.color = '#fff';
		button.style.borderRadius = '1%';
		button.style.padding = '1%';
		button.style.color = '#000';
		button.style.border = '1px solid #000';

		button.addEventListener('mouseenter', () => {
			button.style.background = Config.colors.pictureContainer.buttonColorHover;
		});

		button.addEventListener('mouseleave', () => {
			button.style.background = Config.colors.pictureContainer.buttonColor;
		});

		button.addEventListener('click', () => {
			input.click();
		});

		input.addEventListener('change', (event) => {
			let files = event.target.files;
			Array.from(files).forEach(file => {
				if (file.type.startsWith('image/')) {
					let reader = new FileReader();
					reader.onload = (e) => {
						this.addPicture(e.target.result);
					};
					reader.readAsDataURL(file);
				}
			});
		});

		this.htmlButtonsContainer.appendChild(input);
		this.htmlButtonsContainer.appendChild(button);
	}



	
excludePicture(pictureWrapper) {
    const img = pictureWrapper.querySelector('img');
    if (!img) return;

    let cross = pictureWrapper.querySelector('.excluded-cross');

    if (cross) {
        // Снимаем исключение
        img.style.filter = '';
        cross.remove();
    } else {
        // Добавляем исключение
        img.style.filter = 'grayscale(100%)';
        cross = document.createElement('div');
        cross.classList.add('excluded-cross');
        cross.textContent = 'No';
        cross.style.position = 'absolute';
        cross.style.top = '50%';
        cross.style.left = '50%';
        cross.style.transform = 'translate(-50%, -50%)';
        cross.style.fontSize = '24px'; // фиксированный размер
        cross.style.color = Config.colors.pictureContainer.noColor;
        cross.style.fontWeight = 'bold';
        cross.style.pointerEvents = 'none';
        cross.style.whiteSpace = 'nowrap';
        pictureWrapper.appendChild(cross);
    }

    // Перемещаем картинку сразу после последнего No
    const pictures = Array.from(this.htmlPicturesContainer.children);
    const lastExcluded = [...pictures].reverse().find(p => p.querySelector('.excluded-cross') && p !== pictureWrapper);
    
    if (lastExcluded) {
        if (lastExcluded.nextSibling) {
            this.htmlPicturesContainer.insertBefore(pictureWrapper, lastExcluded.nextSibling);
        } else {
            this.htmlPicturesContainer.appendChild(pictureWrapper);
        }
    } else {
        // Если исключённых нет, вставляем в начало
        this.htmlPicturesContainer.insertBefore(pictureWrapper, this.htmlPicturesContainer.firstChild);
    }
}






	addPicture(source) {
		let pictureWrapper = document.createElement('div');
		pictureWrapper.style.background = Config.colors.pictureContainer.pictureWrapper;
		pictureWrapper.style.width = '22%';
		pictureWrapper.style.height = '25%';
		pictureWrapper.style.margin = '1%';
		pictureWrapper.style.position = 'relative';
		pictureWrapper.style.overflow = 'hidden';
		pictureWrapper.style.transition = 'transform 0.3s ease';
		this.htmlPicturesContainer.appendChild(pictureWrapper);

		let picture = document.createElement('img');
		pictureWrapper.appendChild(picture);

		if (typeof source === 'string') {
			picture.src = source;
		} else if (source instanceof Blob) {
			let reader = new FileReader();
			reader.onload = (e) => {
				picture.src = e.target.result;
			};
			reader.readAsDataURL(source);
		}

		picture.style.width = '100%';
		picture.style.height = '100%';
		picture.style.objectFit = 'contain';
		picture.style.objectPosition = 'center';

		let deleteBtn = document.createElement('button');
		deleteBtn.id = 'delete-cross';
		deleteBtn.textContent = 'X';
		deleteBtn.style.position = 'absolute';
		deleteBtn.style.top = '3%';
		deleteBtn.style.right = '3%';
		deleteBtn.style.background = Config.colors.pictureContainer.deleteButton;
		deleteBtn.style.border = 'none';
		deleteBtn.style.color = '#000';
		deleteBtn.style.cursor = 'pointer';
		deleteBtn.style.padding = '1%';
		deleteBtn.style.fontSize = '2vh';
		deleteBtn.style.opacity = this.current_default_opacity;
		deleteBtn.style.transition = 'opacity 0.3s ease';
		deleteBtn.addEventListener('click', () => pictureWrapper.remove());
		pictureWrapper.appendChild(deleteBtn);

		pictureWrapper.addEventListener('mouseenter', () => {
			pictureWrapper.style.transform = 'scale(1.025)';
			this.current_default_opacity = deleteBtn.style.opacity;
			deleteBtn.style.opacity = '1';
		});
		pictureWrapper.addEventListener('mouseleave', () => {
			pictureWrapper.style.transform = 'scale(1)';
			deleteBtn.style.opacity = this.current_default_opacity;
		});
		pictureWrapper.addEventListener('click', () => this.excludePicture(pictureWrapper));
	}


	getAllImagesData() {
		let images = this.htmlPicturesContainer.querySelectorAll('img');
		let dataURLs = [];
		images.forEach(img => {
			let canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			dataURLs.push(canvas.toDataURL());
		});
		return dataURLs;
	}


	biggerPics(step = 5) {
		let wrappers = this.htmlPicturesContainer.querySelectorAll('div');
		wrappers.forEach(wrapper => {
			let width = parseFloat(wrapper.style.width);
			let height = parseFloat(wrapper.style.height);
			wrapper.style.width = (width + step) + '%';
			wrapper.style.height = (height + step) + '%';
		});
	}

	smallerPics(step = 5) {
		let wrappers = this.htmlPicturesContainer.querySelectorAll('div');
		wrappers.forEach(wrapper => {
			let width = parseFloat(wrapper.style.width);
			let height = parseFloat(wrapper.style.height);
			wrapper.style.width = Math.max(5, width - step) + '%';  // минимальный размер 5%
			wrapper.style.height = Math.max(5, height - step) + '%';
		});
	}



}


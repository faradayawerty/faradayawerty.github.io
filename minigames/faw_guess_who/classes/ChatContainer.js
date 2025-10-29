class ChatContainer {
	pictureContainer = null;
	htmlContainer = null;
	htmlHistory = null;
	htmlInputBox = null;
	htmlInfoBox = null;
	name = 'NoName';
	connectionURL = '';
	peerJSConnection = null;
	peerJSId = '';
	commands = {
		'/clear': (args) => {
			this.htmlHistory.innerHTML = '';
		},
		'/help': (args) => {
			printHelp();
		},
		'/sync': (args) => {
			if (this.peerJSConnection != null) {
				let allImages = this.pictureContainer
			.getAllImagesData();
				this.peerJSConnection.send({
					type: 'start-sync'
				});
				allImages.forEach(dataURL => {
					this.peerJSConnection.send({
						type: 'image',
						data: dataURL
					});
				});
				this.htmlHistory.innerHTML +=
					'<div>Images synced to the other player</div>';
			} else {
				this.htmlHistory.innerHTML +=
					'<div>No connection to sync images</div>';
			}
		},
		'/name': (args) => {
			this.name = args;
			this.htmlHistory.innerHTML += '<div> your name is set to ' +
				this.name + '</div>';
		},
		'/id': (args) => {
			this.htmlHistory.innerHTML += '<div> your id is ' + this
				.peerJSId + '</div>';
		},
		'/bigger': (args) => {
			if (this.pictureContainer != null) {
				this.pictureContainer.biggerPics(1);
			}
		},
		'/smaller': (args) => {
			if (this.pictureContainer != null) {
				this.pictureContainer.smallerPics(1);
			}
		},
	};
	constructor() {
		this.htmlContainer = document.createElement('div');
		this.htmlContainer.id = 'chat-container';
		this.htmlContainer.style.background = Config.colors.chatContainer
			.background;
		this.htmlContainer.style.width = '49%';
		this.htmlContainer.style.height = '98%';
		this.htmlContainer.style.margin = '0.5%'
		this.htmlContainer.style.padding = '0.5%'
		this.htmlContainer.style.boxSizing = 'border-box';
		document.body.appendChild(this.htmlContainer);
		this.htmlContainer.style.display = 'grid';
		this.htmlContainer.style.gridTemplateRows = '1fr 18fr 1fr';
		this.htmlContainer.style.gap = '1%';
		this.htmlInfoBox = document.createElement('div');
		this.htmlInfoBox.id = 'chat-info';
		this.htmlInfoBox.style.fontSize = '100%';
		this.htmlInfoBox.style.background = Config.colors.chatContainer
			.infoBox;
		this.htmlInfoBox.style.color = Config.colors.chatContainer
		.textColor;
		this.htmlInfoBox.style.width = '100%';
		this.htmlInfoBox.style.height = '100%';
		this.htmlInfoBox.style.display = 'flex';
		this.htmlInfoBox.style.alignItems = 'center';
		this.htmlInfoBox.style.justifyContent = 'flex-start';
		this.htmlInfoBox.style.textAlign = 'center';
		this.htmlContainer.appendChild(this.htmlInfoBox);
		this.htmlHistory = document.createElement('div');
		this.htmlHistory.style.fontSize = '100%';
		this.htmlHistory.style.color = Config.colors.chatContainer
		.textColor;
		this.htmlHistory.id = 'chat-history';
		this.htmlHistory.style.background = Config.colors.chatContainer
			.history;
		this.htmlHistory.style.width = '100%';
		this.htmlHistory.style.height = '100%';
		this.htmlHistory.style.overflowX = 'auto';
		this.htmlHistory.style.overflowY = 'auto';
		this.htmlContainer.appendChild(this.htmlHistory);
		this.htmlInputBox = document.createElement('input');
		this.htmlInputBox.type = 'text';
		this.htmlInputBox.id = 'chat-input';
		this.htmlInputBox.style.color = Config.colors.chatContainer
			.textColor;
		this.htmlInputBox.style.fontSize = '100%';
		this.htmlInputBox.style.background = Config.colors.chatContainer
			.input;
		this.htmlInputBox.style.width = '100%';
		this.htmlInputBox.style.height = '100%';
		this.htmlContainer.appendChild(this.htmlInputBox);
		let zoomOut = document.createElement('button');
		zoomOut.textContent = '-';
		zoomOut.style.fontSize = '1.5vh';
		zoomOut.style.width = '6%';
		zoomOut.style.margin = '1%';
		zoomOut.style.padding = '1%';
		zoomOut.style.background = Config.colors.pictureContainer
			.buttonColor;
		zoomOut.style.color = Config.colors.chatContainer.textColorDark;
		zoomOut.onclick = () => {
			if (this.pictureContainer != null) this.pictureContainer
				.smallerPics();
		};
		this.htmlInfoBox.appendChild(zoomOut);
		let zoomIn = document.createElement('button');
		zoomIn.textContent = '+';
		zoomIn.style.fontSize = '1.5vh';
		zoomIn.style.width = '6%';
		zoomIn.style.margin = '1%';
		zoomIn.style.padding = '1%';
		zoomIn.style.background = Config.colors.pictureContainer
		.buttonColor;
		zoomIn.style.color = Config.colors.chatContainer.textColorDark;
		zoomIn.onclick = () => {
			if (this.pictureContainer != null) this.pictureContainer
				.biggerPics();
		};
		this.htmlInfoBox.appendChild(zoomIn);
		this.htmlInputBox.addEventListener('keydown', (event) => {
			if (event.key == 'Enter') {
				let messageText = this.htmlInputBox.value;
				if (messageText != '') {
					if (messageText[0] == '/') {
						this.handleCommand(messageText.split(' ')[
							0], messageText.split(' ').slice(1)
							.join(' '));
					} else {
						let name = this.name;
						if (this.peerJSId != '' && this.name ==
							'NoName') name = this.peerJSId;
						this.htmlHistory.innerHTML += '<div> [' +
							name + '] ' + messageText + '</div>';
						if (this.peerJSConnection != null) {
							this.peerJSConnection.send('[' + name +
								'] ' + messageText);
						}
					}
					this.htmlInputBox.value = '';
					this.htmlHistory.scrollTop = this.htmlHistory
						.scrollHeight;
				}
			}
		});
	}
	handleCommand(command, args) {
		try {
			this.commands[command](args);
		} catch (e) {
			this.htmlHistory.innerHTML +=
				`<div>${"failed to execute the command: " + command}</div>`;
		}
	}
	updateLayout(container) {
		if (window.innerWidth > window.innerHeight) {
			this.htmlInfoBox.style.fontSize = '100%';
			container.style.width = '49%';
			container.style.height = '98%';
		} else {
			this.htmlInfoBox.style.fontSize = '50%';
			container.style.width = '98%';
			container.style.height = '49%';
		}
	}
	printHelp() {
		this.htmlHistory.innerHTML += `<div>
			Привет!<br>
			Перед тобой моя версия популярной настолки, Guess Who!<br>
			Это игра для двоих игроков, так что тебе придётся позвать друга.
			Чтобы он мог подключиться, воспользуйся кнопкой [📋️URL].
			Она скопирует ссылку для подключения, которую нужно отправить твоему другу каким-либо из способов.<br>
			Пока что не все функции реализованы как элементы графического интерфейса.
			Например, чтобы выбрать себе имя, нужно использовать команду /name Имя в чате.<br>
			Вот список некоторых других команд: /sync - синхронизировать изображения друга со своими.
			Команда очистит его картинки и заменит их твоими. /clear - очистить чат.<br>
			Если понадобится снова вывести это сообщение, напиши /help.<br>
			Игра находится в ранней-ранней alpha, поэтому некоторые функции ещё не реализованы,
			а подключение между игроками может сильно барахлить (хотя что-то мне подсказывает,
			что корень проблемы в текущих реалиях РФ).<br> Так или иначе, в игру уже можно играть
			и получать удовольствие. Надеюсь, тебе и твоему другу она понравится!
		</div>`;
	}
}

let peer = null;

async function benchmarkStunServers(servers, limit = 10) {
	console.log("[ICE Benchmark] testing STUN servers...");
	let shuffled = servers .sort(() => Math.random() - 0.5);
	async function testServer(server) {
		const start = performance.now();
		return new Promise(resolve => {
			const pc = new RTCPeerConnection({ iceServers: [server] });
			pc.createDataChannel("t");
			let timeout = setTimeout(() => {
				pc.close();
				resolve({ server, time: Infinity });
			}, 2000);
			pc.onicecandidate = e => {
				if (e.candidate) {
					clearTimeout(timeout);
					pc.close();
					resolve({ server, time: performance.now() - start });
				}
			};
			pc.createOffer()
				.then(o => pc.setLocalDescription(o))
				.catch(() => resolve({ server, time: Infinity }));
		});
	}
	const results = await Promise.all(shuffled.map(testServer));
	const valid = results.filter(r => r.time < Infinity);
	const sorted = valid.sort((a, b) => a.time - b.time);
	const top = sorted.slice(0, limit).map(r => r.server);
	console.log("[ICE Benchmark] fastest servers:", top.map(s => s.urls));
	return top.length ? top : servers.slice(0, limit);
}
function setupConnection(chatContainer, pictureContainer, connection) {
	chatContainer.peerJSConnection = connection;
	connection.on('data', (data) => {
		if (data.type === 'image') {
			pictureContainer.addPicture(data.data);
		} else if (data.type === 'start-sync') {
			pictureContainer.clearPictures();
		} else {
			chatContainer.htmlHistory.innerHTML += `<div>${data}</div>`;
			chatContainer.htmlHistory.scrollTop = chatContainer
				.htmlHistory.scrollHeight;
		}
	});
	connection.on('open', () => {
		chatContainer.htmlHistory.innerHTML +=
			`<div> connection with ${chatContainer.peerJSId} established </div>`;
		let allImages = pictureContainer.getAllImagesData();
		allImages.forEach(dataURL => {
			connection.send({
				type: 'image',
				data: dataURL
			});
		});
	});
	connection.on('close', () => {
		chatContainer.htmlHistory.innerHTML +=
			'<div>Connection closed. Attempting to reconnect...</div>';
		setTimeout(() => {
			let newConnection = peer.connect(connection.peer);
			setupConnection(chatContainer, pictureContainer,
				newConnection);
		}, 60000);
	});
}

function updateLayout(layoutElements) {
	if (window.innerWidth > window.innerHeight) document.body.style
		.flexDirection = "row";
	else document.body.style.flexDirection = "column";
	for (let i = 0; i < layoutElements.length; i++) layoutElements[i]
		.updateLayout(layoutElements[i].htmlContainer);
}

function main() {
	document.title = "Guess Who!";
	document.body.style.backgroundColor = Config.colors.page.background;
	document.body.style.fontFamily = "Arial, sans-serif";
	document.body.style.margin = "0";
	document.body.style.padding = "0";
	document.body.style.display = 'flex';
	let pc = new PictureContainer();
	let cc = new ChatContainer();
	cc.pictureContainer = pc;
	updateLayout([pc, cc]);
	window.addEventListener('resize', function() {
		updateLayout([pc, cc]);
	});
	document.addEventListener('paste', (event) => {
		let items = event.clipboardData.items;
		for (let item of items) {
			if (item.type.startsWith('image/')) {
				let file = item.getAsFile();
				pc.addPicture(file);
			}
		}
	});
	cc.commands['/picset'] = (args) => {
		if (args == 'flags') {
			pc.clearPictures();
			for (let i = 0; i < Config.defaultPictureSets.countryFlags
				.length; i++) pc.addPicture(
				'data/picture_sets/default_countries/' + Config
				.defaultPictureSets.countryFlags[i]);
		} else if (args == 'es') {
			pc.clearPictures();
			for (let i = 0; i < Config.defaultPictureSets
				.everlastingSummerCharacters.length; i++) pc.addPicture(
				'data/picture_sets/default_everlasting_summer/' + Config
				.defaultPictureSets.everlastingSummerCharacters[i]);
		} else if (args == 'zoomers') {
			pc.clearPictures();
			for (let i = 0; i < Config.defaultPictureSets.zoomers
				.length; i++) pc.addPicture(
				'data/picture_sets/default_zoomers/' + Config
				.defaultPictureSets.zoomers[i]);
		} else if (args == 'clear') {
			pc.clearPictures();
		} else {
			cc.htmlHistory.innerHTML +=
				`<div> picture set ${args} doesn't exist </div>`;
		}
	};
	pc.addImagesInput();
	pc.addButton("удалить всё", function() {
		pc.clearPictures();
	});
	pc.addButton("выбрать набор", () => {
		let selectorColors = Config.colors.pictureContainer
			.pictureSetSelector;
		let overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = selectorColors
		.overlayBackground;
		overlay.style.display = 'flex';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		overlay.style.zIndex = '1000';
		let modal = document.createElement('div');
		modal.style.backgroundColor = selectorColors.modalBackground;
		modal.style.padding = '20px';
		modal.style.borderRadius = '10px';
		modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
		modal.style.display = 'flex';
		modal.style.flexDirection = 'column';
		modal.style.gap = '10px';
		overlay.appendChild(modal);
		let title = document.createElement('h3');
		title.textContent = 'Выберите набор картинок';
		title.style.color = selectorColors.titleColor;
		title.style.margin = '0 0 10px 0';
		modal.appendChild(title);
		let sets = ['Флаги стран', 'Бесконечное лето', 'Зумеры'];
		for (let setName of sets) {
			let btn = document.createElement('button');
			btn.textContent = setName;
			btn.style.padding = '5px 10px';
			btn.style.backgroundColor = selectorColors.buttonBackground;
			btn.style.color = selectorColors.buttonText;
			btn.style.border = 'none';
			btn.style.borderRadius = '5px';
			btn.style.cursor = 'pointer';
			btn.onmouseenter = () => btn.style.backgroundColor =
				selectorColors.buttonHover;
			btn.onmouseleave = () => btn.style.backgroundColor =
				selectorColors.buttonBackground;
			btn.onclick = () => {
				pc.clearPictures();
				let folder = '';
				let images = [];
				if (setName === 'Флаги стран') {
					folder = 'default_countries';
					images = Config.defaultPictureSets.countryFlags;
				} else if (setName === 'Бесконечное лето') {
					folder = 'default_everlasting_summer';
					images = Config.defaultPictureSets
						.everlastingSummerCharacters;
				} else if (setName === 'Зумеры') {
					folder = 'default_zoomers';
					images = Config.defaultPictureSets.zoomers;
				}
				for (let img of images) {
					pc.addPicture('data/picture_sets/' + folder +
						'/' + img);
				}
				document.body.removeChild(overlay);
			};
			modal.appendChild(btn);
		}
		let closeBtn = document.createElement('button');
		closeBtn.textContent = 'Назад';
		closeBtn.style.padding = '5px 10px';
		closeBtn.style.marginTop = '10px';
		closeBtn.style.backgroundColor = selectorColors
			.cancelButtonBackground;
		closeBtn.style.color = selectorColors.buttonText;
		closeBtn.style.border = 'none';
		closeBtn.style.borderRadius = '5px';
		closeBtn.style.cursor = 'pointer';
		closeBtn.onmouseenter = () => closeBtn.style.backgroundColor =
			selectorColors.cancelButtonHover;
		closeBtn.onmouseleave = () => closeBtn.style.backgroundColor =
			selectorColors.cancelButtonBackground;
		closeBtn.onclick = () => document.body.removeChild(overlay);
		modal.appendChild(closeBtn);
		document.body.appendChild(overlay);
	});
	pc.addButton("[wip] загадать", () => {});
	pc.addButton("[wip] угадать", () => {});

	(async () => {
		let fastestServers = await benchmarkStunServers(Config.iceServers, 15, 30);
		console.log("[Peer] Creating peer with", fastestServers.length, "fast servers");
		peer = new Peer(undefined, {
			host: '0.peerjs.com',
			port: 443,
			path: '/',
			secure: true,
			config: {
				iceServers: fastestServers
			}
		});
		peer.on('open', (id) => {
			cc.peerJSId = id;
			cc.connectionURL =
				'https://faradayawerty.github.io/minigames/faw_guess_who?connection=' +
				id;
			if (!cc.htmlInfoBox.querySelector('button[data-copy-url]')) {
				let infoBoxCopy = document.createElement('button');
				infoBoxCopy.textContent = '📋️ URL ';
				infoBoxCopy.style.fontSize = '1.5vh';
				infoBoxCopy.style.margin = '1%';
				infoBoxCopy.style.padding = '1%';
				infoBoxCopy.style.background = Config.colors
					.pictureContainer.buttonColor;
				infoBoxCopy.style.color = Config.colors.chatContainer
					.textColorDark;
				infoBoxCopy.setAttribute('data-copy-url', 'true');
				infoBoxCopy.onclick = () => {
					navigator.clipboard.writeText(cc.connectionURL)
						.then(() => {
							alert('The URL is copied to clipboard');
						}).catch(err => {
							console.error(
								"Не удалось скопировать текст: ",
								err);
						});
				};
				cc.htmlInfoBox.appendChild(infoBoxCopy);
			}
			if (!cc.htmlInfoBox.querySelector('div[data-peer-id]')) {
				let div = document.createElement('div');
				div.textContent = id;
				div.setAttribute('data-peer-id', 'true');
				cc.htmlInfoBox.appendChild(div);
			}
			cc.htmlHistory.innerHTML += `<div>
				Привет!<br>
				Перед тобой моя версия популярной настолки, Guess Who!<br>
				Это игра для двоих игроков, так что тебе придётся позвать друга.
				Чтобы он мог подключиться, воспользуйся кнопкой [📋️URL].
				Она скопирует ссылку для подключения, которую нужно отправить твоему другу
				каким-либо из способов.<br>
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
			let urlParams = new URLSearchParams(window.location.search);
			let connectionFromURL = urlParams.get('connection');
			if (connectionFromURL != null && connectionFromURL != undefined)
				setupConnection(cc, pc, peer.connect(connectionFromURL));
		});
		peer.on('error', (err) => {
			console.error("Peer error:", err)
		});
		peer.on('connection', (connection) => {
			setupConnection(cc, pc, connection);
		});
		peer.on('disconnected', () => {
			cc.htmlHistory.innerHTML +=
				'<div>Peer disconnected. Reconnecting...</div>';
			peer.reconnect();
		});
	})();
	cc.commands['/connect'] = (args) => {
		setupConnection(cc, pc, peer.connect(args));
	};
}
window.addEventListener("DOMContentLoaded", main);

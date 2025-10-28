
function setupConnection(chatContainer, pictureContainer, connection) {
	chatContainer.peerJSConnection = connection;

	connection.on('data', (data) => {
		if(data.type === 'image') {
			pictureContainer.addPicture(data.data);
		} else {
			chatContainer.htmlHistory.innerHTML += `<div> ${data} </div>`;
		}
	});

	connection.on('open', () => {
		chatContainer.htmlHistory.innerHTML += `<div> connection with ${chatContainer.peerJSId} established </div>`;
		let allImages = pictureContainer.getAllImagesData();
		allImages.forEach(dataURL => {
			connection.send({ type: 'image', data: dataURL });
		});
	});

	connection.on('close', () => {
		chatContainer.htmlHistory.innerHTML += '<div>Connection closed. Trying to reconnect...</div>';
		setTimeout(() => {
			let newConnection = peer.connect(connection.peer);
			setupConnection(chatContainer, pictureContainer, newConnection);
		}, 300000);
	});
}

function updateLayout(layoutElements) {
	if(window.innerWidth > window.innerHeight)
		document.body.style.flexDirection = "row";
	else
		document.body.style.flexDirection = "column";
	for(let i = 0; i < layoutElements.length; i++)
		layoutElements[i].updateLayout(layoutElements[i].htmlContainer);
}

function main() {
	document.title = "Guess Who!";
	document.body.style.backgroundColor = "#aabbcc";
	document.body.style.fontFamily = "Arial, sans-serif";
	document.body.style.margin = "0";
	document.body.style.padding = "0";
	document.body.style.display = 'flex';

	let pc = new PictureContainer();
	let cc = new ChatContainer();

	updateLayout([pc, cc]);
	window.addEventListener('resize', function() { updateLayout([pc, cc]); });

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
		if(args == 'flags') {
			pc.clearPictures();
			for(let i = 0; i < Config.defaultPictureSets.countryFlags.length; i++)
				pc.addPicture('data/picture_sets/default_countries/' + Config.defaultPictureSets.countryFlags[i]);
		} else if(args == 'es') {
			pc.clearPictures();
			for(let i = 0; i < Config.defaultPictureSets.everlastingSummerCharacters.length; i++)
				pc.addPicture('data/picture_sets/default_everlasting_summer/' + Config.defaultPictureSets.everlastingSummerCharacters[i]);
		} else if(args == 'clear') {
			pc.clearPictures();
		} else {
			cc.htmlHistory.innerHTML += `<div> picture set ${args} doesn't exist </div>`;
		}
	};

	pc.addImagesInput();
	pc.addButton("remove all images", function() {
		pc.clearPictures();
	});
	pc.addButton("image set", null);

	let peer = new Peer(undefined, {
		host: '0.peerjs.com',
		port: 443,
		path: '/',
		secure: true,
		config: {
			iceServers: Config.iceServers
		}
	});

	peer.on('open', (id) => {
		cc.peerJSId = id;
		cc.connectionURL = 'https://faradayawerty.github.io/minigames/faw_guess_who?connection=' + id;

		let infoBoxCopy = document.createElement('button');
		infoBoxCopy.textContent = '📋️ Copy URL ';
		infoBoxCopy.style.fontSize = '1.5vh';
		infoBoxCopy.style.margin = '1%';
		infoBoxCopy.style.padding = '1%';
		infoBoxCopy.style.background = '#11aa11';
		infoBoxCopy.onclick = () => {
			navigator.clipboard.writeText(cc.connectionURL).then(() => {
				alert('The URL is copied to clipboard');
			}).catch(err => {
				console.error("Не удалось скопировать текст: ", err);
		    });
		};
		cc.htmlInfoBox.appendChild(infoBoxCopy);

		let div = document.createElement('div');
		div.textContent = id;
		cc.htmlInfoBox.appendChild(div);

		let urlParams = new URLSearchParams(window.location.search);
		let connectionFromURL = urlParams.get('connection');
		if(connectionFromURL != null && connectionFromURL != undefined)
			setupConnection(cc, pc, peer.connect(connectionFromURL));
	});

	peer.on('connection', (connection) => {
		setupConnection(cc, pc, connection);
	});

	peer.on('disconnected', () => {
		cc.htmlHistory.innerHTML += '<div>Peer disconnected. Reconnecting...</div>';
		peer.reconnect();
	});

	cc.commands['/connect'] = (args) => {
		setupConnection(cc, pc, peer.connect(args));
	};
}


window.addEventListener("DOMContentLoaded", main);


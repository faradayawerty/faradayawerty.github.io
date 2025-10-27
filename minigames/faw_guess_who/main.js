
function setupConnection(chatContainer, connection) {
    chatContainer.peerJSConnection = connection;

    connection.on('data', (data) => {
        chatContainer.htmlHistory.innerHTML += `<div> ${data} </div>`;
    });

    connection.on('open', () => {
        chatContainer.htmlHistory.innerHTML += `<div> connection with ${chatContainer.peerJSId} established </div>`;
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

	cc.commands['/picset'] = (args) => {
		if(args == 'flags') {
			pc.clearPictures();
			for(let i = 0; i < Config.defaultPictureSets.countryFlags.length; i++)
				pc.addPicture('data/picture_sets/default_countries/' + Config.defaultPictureSets.countryFlags[i]);
		} else if(args == 'clear') {
			pc.clearPictures();
		} else {
			cc.htmlHistory.innerHTML += `<div> picture set ${args} doesn't exist </div>`;
		}
	};

	pc.addButton("dummy", null);
	pc.addButton("dummy", null);
	pc.addButton("dummy", null);
	pc.addButton("dummy", null);

	let peer = new Peer(undefined, {
		host: '0.peerjs.com',
		port: 443,
		path: '/',
		secure: true,
		config: {
			iceServers: [
				{ urls: 'stun:stun.l.google.com:19302' },
			]
		}
	});

	peer.on('open', (id) => {
		cc.peerJSId = id;
		cc.connectionURL = 'https://faradayawerty.github.io/minigames/faw_guess_who?connection=' + id;

		let div = document.createElement('div');
		div.textContent = 'Copy URL for connecting to ' + id;
		cc.htmlInfoBox.appendChild(div);

		let urlParams = new URLSearchParams(window.location.search);
		let connectionFromURL = urlParams.get('connection');
		//if(connectionFromURL != null && connectionFromURL != undefined)
		setupConnection(cc, peer.connect(connectionFromURL));
	});

	peer.on('connection', (connection) => {
		setupConnection(cc, connection);
	});

	cc.commands['/connect'] = (args) => {
		setupConnection(cc, peer.connect(args));
	};
}


window.addEventListener("DOMContentLoaded", main);


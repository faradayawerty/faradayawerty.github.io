
function setupConnection(connection) {
    cc.peerJSConnection = connection;

    connection.on('data', (data) => {
        cc.htmlHistory.innerHTML += `<div>${data}</div>`;
    });

    connection.on('open', () => {
        connection.send('Привет от меня!');
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

	let peer = new Peer();

	peer.on('open', id => {
		cc.htmlInfoBox.innerHTML = '<div>' + id + '</div>';
	});

	peer.on('connection', setupConnection);
	cc.commands['/connect'] = (args) => {
		setupConnection(peer.connect(args));
	};
}


window.addEventListener("DOMContentLoaded", main);


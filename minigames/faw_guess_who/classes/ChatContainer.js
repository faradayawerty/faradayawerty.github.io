
class ChatContainer {
	htmlContainer = null;
	htmlHistory = null;
	htmlInputBox = null;
	htmlInfoBox = null;

	name = 'NoName';
	connectionURL = '';
	
	peerJSConnection = null;
	peerJSId = '';

	commands = {
		'/clear': (args) => { this.htmlHistory.innerHTML = ''; },
		'/test1': function(args) { alert('TEST'); },
		'/test2': function(args) { alert(args); },
		'/name': (args) => {
			this.name = args;
			this.htmlHistory.innerHTML += '<div> your name is set to ' + this.name + '</div>';
		},
		'/id': (args) => { this.htmlHistory.innerHTML += '<div>' + this.peerJSId + '</div>'; },
	};

	constructor() {
		this.htmlContainer = document.createElement('div');
		this.htmlContainer.id = 'chat-container';
		this.htmlContainer.style.background= '#1111aa';
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
		this.htmlInfoBox.style.fontSize= '75%';
		this.htmlInfoBox.style.background= '#aa4444';
		this.htmlInfoBox.style.width = '100%';
		this.htmlInfoBox.style.height = '100%';
		this.htmlInfoBox.style.display = 'flex';
		this.htmlInfoBox.style.alignItems = 'center';
		this.htmlInfoBox.style.justifyContent = 'flex-start';
		this.htmlInfoBox.style.textAlign = 'center';
		this.htmlContainer.appendChild(this.htmlInfoBox);

		let infoBoxCopy = document.createElement('button');
		infoBoxCopy.textContent = '📋️';
		infoBoxCopy.style.margin = '1%';
		infoBoxCopy.style.background = '#11aa11';
		infoBoxCopy.onclick = () => {
			navigator.clipboard.writeText(this.connectionURL).then(() => {
				if(this.connectionURL != '')
					alert('The URL is copied to clipboard');
			}).catch(err => {
				console.error("Не удалось скопировать текст: ", err);
		    });
		};
		this.htmlInfoBox.appendChild(infoBoxCopy);

		this.htmlHistory = document.createElement('div');
		this.htmlHistory.style.fontSize= '100%';
		this.htmlHistory.id = 'chat-history';
		this.htmlHistory.style.background= '#11aaaa';
		this.htmlHistory.style.width = '100%';
		this.htmlHistory.style.height = '100%';
		this.htmlHistory.style.overflowX = 'auto';
		this.htmlHistory.style.overflowY = 'auto';
		this.htmlContainer.appendChild(this.htmlHistory);

		this.htmlInputBox = document.createElement('input');
		this.htmlInputBox.type = 'text';
		this.htmlInputBox.id = 'chat-input';
		this.htmlInputBox.style.fontSize= '100%';
		this.htmlInputBox.style.background= '#aa11aa';
		this.htmlInputBox.style.width = '100%';
		this.htmlInputBox.style.height = '100%';
		this.htmlContainer.appendChild(this.htmlInputBox);

		this.htmlInputBox.addEventListener('keydown', (event) => {
			if(event.key == 'Enter') {
				let messageText = this.htmlInputBox.value;
				if(messageText != '') {
					if(messageText[0] == '/') {
						this.handleCommand(messageText.split(' ')[0],
							messageText.split(' ').slice(1).join(' '));
					} else {
						let name = this.name;
						if(this.peerJSId != '' && this.name == 'NoName')
							name = this.peerJSId;
						this.htmlHistory.innerHTML
							+= '<div> [' + name + '] ' + messageText + '</div>';
						if(this.peerJSConnection != null)
							this.peerJSConnection.send('[' + name + '] ' + messageText);
					}
					this.htmlInputBox.value = '';
					this.htmlHistory.scrollTop
						= this.htmlHistory.scrollHeight;
				}
			}
		});
	}

	handleCommand(command, args) {
		try {
			this.commands[command](args);
		} catch(e) {
			this.htmlHistory.innerHTML
				+= `<div>${"failed to execute the command: " + command}</div>`;
		}
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


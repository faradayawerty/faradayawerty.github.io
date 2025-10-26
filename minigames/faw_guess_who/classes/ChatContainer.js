
class ChatContainer {
	htmlContainer = null;
	htmlHistory = null;
	htmlInputBox = null;
	htmlInfoBox = null;
	
	peerJSConnection = null;

	commands = {
		'/clear': (args) => { this.htmlHistory.innerHTML = ''; },
		'/test1': function(args) { alert('TEST'); },
		'/test2': function(args) { alert(args); }
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
		this.htmlInfoBox.style.fontSize= '100%';
		this.htmlInfoBox.style.background= '#aa4444';
		this.htmlInfoBox.style.width = '100%';
		this.htmlInfoBox.style.height = '100%';
		this.htmlInfoBox.style.display = 'flex';
		this.htmlInfoBox.style.alignItems = 'center';
		this.htmlInfoBox.style.justifyContent = 'center';
		this.htmlInfoBox.style.textAlign = 'center';
		this.htmlInfoBox.innerHTML = '<div>loading your id...</div>';
		this.htmlContainer.appendChild(this.htmlInfoBox);

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
						this.htmlHistory.innerHTML
							+= `<div>${messageText}</div>`;
						if(this.peerJSConnection != null)
							this.peerJSConnection.send(messageText);
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


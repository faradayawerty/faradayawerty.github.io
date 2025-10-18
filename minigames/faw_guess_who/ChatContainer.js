
class ChatContainer {

	constructor() {
		const container = document.createElement('div');
		container.className = 'chat-container';
		container.id = 'chatContainer';
		const messages = document.createElement('div');
		messages.className = 'chat-messages';
		messages.id = 'chatMessages';
		container.appendChild(messages);
		const inputWrapper = document.createElement('div');
		inputWrapper.className = 'chat-input';
		const input = document.createElement('input');
		input.type = 'text';
		input.id = 'chat-text';
		input.placeholder = 'Введите сообщение...';
		inputWrapper.appendChild(input);
		const button = document.createElement('button');
		button.id = 'chat-send';
		button.textContent = 'Отправить';
		inputWrapper.appendChild(button);
		container.appendChild(inputWrapper);
		document.body.appendChild(container);
		this.element = container;
		this.messages = messages;
		this.input = input;
		this.sendButton = button;
		this.messageHistory = [];
	}
}


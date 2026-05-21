let BINDINGS = [{
	key: "[",
	command: function() {
		enemy_create(game1, 1250, 1250, false, false, "regular");
	}
}]

function bindings_update() {
	for (let i = 0; i < BINDINGS.length; i++) {
		if (isKeyDown(input1, BINDINGS[i].key, true))
			BINDINGS[i].command();
	}
}

function bind(key, command) {
	BINDINGS.push({
		key: key,
		command: command
	});
}
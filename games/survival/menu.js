
function menu_create() {
	let m = {
		press_delay: 200,
		press_delay_max: 200,
		shown: true,
		want_new_game: false,
		want_player_color: "red",
		iselected: 0,
		main_menu_buttons: ["continue game", "start new game", "settings"],
		settings_buttons: ["player color", "main menu"],
		player_color_selection_menu: ["set player color to red",
			"set player color to lime",
			"set player color to blue",
			"set player color to yellow",
			"back to settings"],
		buttons: null
	};
	m.buttons = m.main_menu_buttons;
	return m;
}

function menu_draw(ctx, m) {
	let s = "";
	for(let i = 0; i < m.buttons.length; i++) {
		if(m.iselected == i)
			drawButton(ctx, 60, 40 + 60 * i, "[" + m.buttons[i] + "]");
		else
			drawButton(ctx, 40, 40 + 60 * i, m.buttons[i]);
	}
}

function menu_update(m, dt, input) {
	if(m.press_delay < m.press_delay_max) {
		m.press_delay += dt;
	} else if((input.keys['s'] || input.keys['ArrowDown'])
		&& m.iselected < m.buttons.length - 1) {
		m.iselected += 1;
		m.press_delay = 0;
	} else if((input.keys['w'] || input.keys['ArrowUp'])
		&& m.iselected > 0) {
		m.iselected -= 1;
		m.press_delay = 0;
	} else if(m.buttons[m.iselected] == "continue game"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.shown = false;
	} else if(m.buttons[m.iselected] == "start new game"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.shown = false;
		m.want_new_game = true;
	} else if((m.buttons[m.iselected] == "settings" || m.buttons[m.iselected] == "back to settings")
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.settings_buttons;
		m.press_delay = 0;
		m.iselected = 0;
	} else if(m.buttons[m.iselected] == "main menu"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.main_menu_buttons;
		m.press_delay = 0;
		m.iselected = 0;
	} else if(m.buttons[m.iselected] == "player color"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.player_color_selection_menu;
		m.press_delay = 0;
		m.iselected = 0;
	} else if(m.buttons[m.iselected] == "set player color to red"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.settings_buttons;
		m.press_delay = 0;
		m.iselected = 0;
		m.want_player_color = "red";
	} else if(m.buttons[m.iselected] == "set player color to lime"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.settings_buttons;
		m.press_delay = 0;
		m.iselected = 0;
		m.want_player_color = "lime";
	} else if(m.buttons[m.iselected] == "set player color to yellow"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.settings_buttons;
		m.press_delay = 0;
		m.iselected = 0;
		m.want_player_color = "yellow";
	} else if(m.buttons[m.iselected] == "set player color to blue"
		&& (input.keys[' '] || input.keys['Enter'])) {
		m.buttons = m.settings_buttons;
		m.press_delay = 0;
		m.iselected = 0;
		m.want_player_color = "blue";
	}
}


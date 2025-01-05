
function menu_create() {
	let m = {
		shown: true,
		want_new_game: false,
		want_player_respawn: false,
		want_player_color: "red",
		want_player_draw_gun: true,
		want_enemies_spawn: true,
		iselected: 0,
		main_menu_buttons: [
			"continue game",
			"start new game",
			"settings"
		],
		settings_buttons: [
			"player color",
			"player draw gun",
			"enemies spawn",
			"main menu"
		],
		player_color_selection_menu: [
			"set player color to red",
			"set player color to lime",
			"set player color to blue",
			"set player color to yellow",
			"back to settings"
		],
		buttons: null
	};
	m.buttons = m.main_menu_buttons;
	return m;
}

function menu_draw(ctx, m) {
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, cvs1.width, cvs1.height);
	ctx.globalAlpha = 1.0;
	let s = "";
	for(let i = 0; i < m.buttons.length; i++) {
		let text = m.buttons[i];
		if(m.buttons[i] == "player color")
			text = text + ": " + m.want_player_color;
		if(m.buttons[i] == "player draw gun")
			text = text + ": " + m.want_player_draw_gun;
		if(m.buttons[i] == "enemies spawn")
			text = text + ": " + m.want_enemies_spawn;
		if(m.iselected == i)
			drawButton(ctx, 160, 140 + 60 * i, "[" + text + "]");
		else
			drawButton(ctx, 140, 140 + 60 * i, text);
	}
}

function menu_update(m, dt, input) {

	for(let i = 0; i < m.buttons.length; i++)
		if(doRectsCollide(input.mouse.x, input.mouse.y, 0, 0, 140, 110 + 60 * i, 20 * m.buttons[i].length, 60))
			m.iselected = i;

	if((isKeyDown(input, 's', true) || isKeyDown(input, 'ArrowDown', true)) && m.iselected < m.buttons.length - 1) {
		m.iselected += 1;
	} else if((isKeyDown(input, 'w', true) || isKeyDown(input, 'ArrowUp', true)) && m.iselected > 0) {
		m.iselected -= 1;
	} else if((isKeyDown(input, ' ', true) || isKeyDown(input, 'Enter', true) || isMouseLeftButtonPressed(input))) {
		if(m.buttons[m.iselected] == "continue game") {
			m.shown = false;
		} else if(m.buttons[m.iselected] == "respawn and continue game") {
			m.shown = false;
			m.main_menu_buttons[m.iselected] = "continue game";
			m.want_player_respawn = true;
		} else if(m.buttons[m.iselected] == "start new game") {
			m.shown = false;
			m.want_new_game = true;
		} else if(m.buttons[m.iselected] == "settings" || m.buttons[m.iselected] == "back to settings") {
			m.buttons = m.settings_buttons;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "main menu") {
			m.buttons = m.main_menu_buttons;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "enemies spawn") {
			m.want_enemies_spawn = !m.want_enemies_spawn;
		} else if(m.buttons[m.iselected] == "player color") {
			m.buttons = m.player_color_selection_menu;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "player draw gun") {
			m.want_player_draw_gun = !m.want_player_draw_gun;
		} else if(m.buttons[m.iselected] == "set player color to red") {
			m.want_player_color = "red";
		} else if(m.buttons[m.iselected] == "set player color to lime") {
			m.want_player_color = "lime";
		} else if(m.buttons[m.iselected] == "set player color to yellow") {
			m.want_player_color = "yellow";
		} else if(m.buttons[m.iselected] == "set player color to blue") {
			m.want_player_color = "blue";
		}
	}
}


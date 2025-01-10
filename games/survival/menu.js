
function menu_create() {
	let m = {
		shown: true,
		want_new_game: false,
		want_player_respawn: false,
		want_player_color: "red",
		want_player_draw_gun: true,
		want_enemies_spawn: true,
		want_language: "english",
		want_hints: false,
		want_ammo_pickup_last: true,
		want_lose_items: true,
		want_respawn_here: true,
		want_indicators: {
			"show player health": true,
			"show player hunger": true,
			"show player thirst": true,
			"show enemy health": true,
			"show enemy hunger": true,
			"show car health": true,
			"show car fuel": true
		},
		want_auto_pickup: {
			"automatically pickup food and drinks": false,
			"automatically pickup fuel": false,
			"automatically pickup health": false,
			"automatically pickup ammo": false
		},
		iselected: 0,
		language_selection_buttons: [
			"english",
			"русский"
		],
		main_menu_buttons: [
			"continue game",
			"start new game",
			"settings",
		],
		settings_buttons: [
			"player color",
			"player draw gun",
			"enemies spawn",
			"show hints",
			"ammo pickup in last slot",
			"lose items on death",
			"respawn on current level",
			"indicators",
			"auto pickup",
			"language",
			"main menu"
		],
		player_color_selection_menu: [
			"set player color to red",
			"set player color to lime",
			"set player color to blue",
			"set player color to yellow",
			"back to settings"
		],
		indicators_settings: [
			"show player health",
			"show player hunger",
			"show player thirst",
			"show enemy health",
			"show enemy hunger",
			"show car health",
			"show car fuel",
			"back to settings"
		],
		auto_pickup_settings: [
			"automatically pickup food and drinks",
			"automatically pickup fuel",
			"automatically pickup health",
			"automatically pickup ammo",
			"back to settings"
		],
		buttons: null
	};
	m.buttons = m.language_selection_buttons;
	return m;
}

function menu_draw(ctx, m) {
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, cvs1.width, cvs1.height);
	ctx.globalAlpha = 1.0;
	ctx.save();
	ctx.scale(window.innerWidth / 1800, window.innerWidth / 1800);
	let s = "";
	for(let i = 0; i < m.buttons.length; i++) {
		let text = m.buttons[i];
		if(m.buttons[i] == "player color")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_player_color);
		else if(m.buttons[i] == "player draw gun")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_player_draw_gun);
		else if(m.buttons[i] == "ammo pickup in last slot")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_ammo_pickup_last);
		else if(m.buttons[i] == "show hints")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_hints);
		else if(m.buttons[i] == "lose items on death")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_lose_items);
		else if(m.buttons[i] == "respawn on current level")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_respawn_here);
		else if(m.buttons[i] == "enemies spawn")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_enemies_spawn);
		else if(m.buttons[i] != "back to settings" && m.indicators_settings.includes(m.buttons[i]))
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_indicators[m.buttons[i]]);
		else if(m.buttons[i] != "back to settings" && m.auto_pickup_settings.includes(m.buttons[i]))
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_auto_pickup[m.buttons[i]]);
		else if(m.buttons[i] == "language")
			text = menu_translate(m.want_language, text) + ": " + menu_translate(m.want_language, m.want_language);
		else
			text = menu_translate(m.want_language, text);
		if(m.iselected == i)
			drawButton(ctx, 100, 80 + 60 * i, "[" + text + "]");
		else
			drawButton(ctx, 80, 80 + 60 * i, text);
	}
	ctx.restore();
}

function menu_update(m, dt, input) {

	for(let i = 0; i < m.buttons.length; i++)
		if(doRectsCollide(input.mouse.x / window.innerWidth * 1800, input.mouse.y / window.innerWidth * 1800, 0, 0,
			80, 40 + 60 * i, 30 * menu_translate(m.want_language, m.buttons[i].length), 60))
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
			let icontinue = menu1.main_menu_buttons.indexOf("respawn and continue game");
			if(icontinue > -1)
				menu1.main_menu_buttons[icontinue] = "continue game";
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
		} else if(m.buttons[m.iselected] == "indicators") {
			m.buttons = m.indicators_settings;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "auto pickup") {
			m.buttons = m.auto_pickup_settings;
			m.iselected = 0;
		} else if(m.indicators_settings.includes(m.buttons[m.iselected])) {
			m.want_indicators[m.buttons[m.iselected]] = !m.want_indicators[m.buttons[m.iselected]];
		} else if(m.auto_pickup_settings.includes(m.buttons[m.iselected])) {
			m.want_auto_pickup[m.buttons[m.iselected]] = !m.want_auto_pickup[m.buttons[m.iselected]];
		} else if(m.buttons[m.iselected] == "player draw gun") {
			m.want_player_draw_gun = !m.want_player_draw_gun;
		} else if(m.buttons[m.iselected] == "ammo pickup in last slot") {
			m.want_ammo_pickup_last = !m.want_ammo_pickup_last;
		} else if(m.buttons[m.iselected] == "show hints") {
			m.want_hints = !m.want_hints;
		} else if(m.buttons[m.iselected] == "lose items on death") {
			m.want_lose_items = !m.want_lose_items;
		} else if(m.buttons[m.iselected] == "respawn on current level") {
			m.want_respawn_here = !m.want_respawn_here;
		} else if(m.buttons[m.iselected] == "set player color to red") {
			m.want_player_color = "red";
		} else if(m.buttons[m.iselected] == "set player color to lime") {
			m.want_player_color = "lime";
		} else if(m.buttons[m.iselected] == "set player color to yellow") {
			m.want_player_color = "yellow";
		} else if(m.buttons[m.iselected] == "set player color to blue") {
			m.want_player_color = "blue";
		} else if(m.buttons[m.iselected] == "english") {
			m.want_language = "english";
			m.buttons = m.main_menu_buttons;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "русский") {
			m.want_language = "русский";
			m.buttons = m.main_menu_buttons;
			m.iselected = 0;
		} else if(m.buttons[m.iselected] == "language") {
			if(m.want_language == "русский")
				m.want_language = "english";
			else if(m.want_language == "english")
				m.want_language = "русский";
		}
	}
}

function menu_translate(lang, str) {
	if(lang == "русский") {
		if(str == "start new game")
			return "начать новую игру";
		else if(str == "settings")
			return "настройки";
		else if(str == "language")
			return "язык";
		else if(str == "continue game")
			return "продолжить игру";
		else if(str == "respawn and continue game")
			return "возродиться и продолжить игру";
		else if(String(str) == "true")
			return "да";
		else if(String(str) == "false")
			return "нет";
		else if(str == "player color")
			return "цвет игрока";
		else if(str == "red")
			return "красный";
		else if(str == "lime")
			return "светло-зелёный";
		else if(str == "yellow")
			return "жёлтый";
		else if(str == "blue")
			return "синий";
		else if(str == "set player color to red")
			return "сделать игрока красным";
		else if(str == "set player color to blue")
			return "сделать игрока синим";
		else if(str == "set player color to lime")
			return "сделать игрока светло-зелёным";
		else if(str == "set player color to yellow")
			return "сделать игрока жёлтым";
		else if(str == "indicators")
			return "индикаторы";
		else if(str == "back to settings")
			return "назад к настройкам";
		else if(str == "enemies spawn")
			return "появление противников";
		else if(str == "player draw gun")
			return "показывать оружие у игрока";
		else if(str == "main menu")
			return "главное меню";
		else if(str == "show player health")
			return "показывать здоровье игрока";
		else if(str == "show player hunger")
			return "показывать значение сытости игрока";
		else if(str == "show player thirst")
			return "показывать значение жажды игрока";
		else if(str == "show enemy health")
			return "показывать здоровье противников";
		else if(str == "show enemy hunger")
			return "показывать значение сытости зомби";
		else if(str == "show car health")
			return "показывать значение сломанности автомобилей"
		else if(str == "show car fuel")
			return "показывать значение топлива автомобиля";
		else if(str == "show hints")
			return "подсказки";
		else if(str == "ammo pickup in last slot")
			return "собирать патроны в последний слот";
		else if(str == "automatically pickup food and drinks")
			return "автоматически подбирать еду и напитки";
		else if(str == "automatically pickup fuel")
			return "автоматически подбирать топливо";
		else if(str == "automatically pickup health")
			return "автоматически подбирать аптечки";
		else if(str == "automatically pickup ammo")
			return "автоматически подбирать патроны";
		else if(str == "auto pickup")
			return "автоматически подбирать предметы";
		else if(str == "lose items on death")
			return "терять вещи при смерти";
		else if(str == "respawn on current level")
			return "возрождение на текущем уровнe";
	}
	return str;
}


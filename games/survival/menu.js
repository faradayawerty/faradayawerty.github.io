function menu_create() {
	let m = {
		shown: true,
		want_new_game: false,
		want_spawn_ai: false,
		want_player_respawn: false,
		want_autorespawn: false,
		want_auto_aim: false,
		want_player_color: "red",
		want_player_draw_gun: true,
		want_enemies_spawn: true,
		want_trees: true,
		want_language: "english",
		want_hints: false,
		want_ammo_pickup_last: true,
		want_lose_items: true,
		want_respawn_here: true,
		want_debug: false,
		want_save: false,
		want_load: false,
		want_indicators: {
			"show player health": true,
			"show player hunger": true,
			"show player thirst": true,
			"show enemy health": true,
			"show enemy hunger": true,
			"show car health": true,
			"show car fuel": true,
			"show rocket health": false
		},
		want_auto_pickup: {
			"automatically pickup food and drinks": false,
			"automatically pickup fuel": false,
			"automatically pickup health": false,
			"automatically pickup ammo": false,
			"automatically pickup weapons": false,
			"automatically pickup shields": false,
			"automatically pickup bossifiers": false
		},
		iselected: 0,
		iselected_last_frame: 0,
		pressed_previous_frame: false,
		language_selection_buttons: [
			"english",
			"русский"
		],
		menu_new_game: [
			"start new game",
			"back to settings"
		],
		main_menu_buttons: [
			"continue game",
			"settings",
			"save game",
			"load game",
		],
		menu_respawn_buttons: [
			"respawn and continue game",
		],
		settings_buttons: [
			"player color",
			"player draw gun",
			"automatic aim",
			"enemies spawn",
			"automatic respawn",
			"language",
			"ammo pickup in last slot",
			"lose items on death",
			"new game",
			"debug",
			"enable trees",
			"respawn on current level",
			"indicators",
			"auto pickup",
			"volume",
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
			"show rocket health",
			"back to settings"
		],
		auto_pickup_settings: [
			"automatically pickup food and drinks",
			"automatically pickup fuel",
			"automatically pickup health",
			"automatically pickup ammo",
			"automatically pickup weapons",
			"automatically pickup shields",
			"automatically pickup bossifiers",
			"back to settings"
		],
		buttons: null,
		can_touch_button: false,
		touched_button_previus_frame: false,
		mobile: false
	};
	let saved = localStorage.getItem("game_settings");
	if (saved) {
		try {
			let data = JSON.parse(saved);
			Object.assign(m, data);
			if (m.want_auto_pickup["automatically pickup bossifiers"] ===
				undefined) {
				m.want_auto_pickup["automatically pickup bossifiers"] = false;
				console.log(
					"Добавлено отсутствующее поле: automatically pickup bossifiers"
				);
			}
			if (data.volume !== undefined)
				GLOBAL_VOLUME = data.volume;
			console.log("Загруженные настройки:", data);
		}
		catch (e) {
			console.error("Ошибка загрузки настроек", e);
		}
	}
	m.buttons = m.language_selection_buttons;
	return m;
}

function menu_draw(ctx, m) {
	ctx.globalAlpha = 0.75;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	ctx.globalAlpha = 1.0;
	ctx.save();
	ctx.scale(get_scale(), get_scale());
	let s = "";
	for (let i = 0; i < m.buttons.length; i++) {
		let text = m.buttons[i];
		if (m.buttons[i] == "player color")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_player_color);
		else if (m.buttons[i] == "player draw gun")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_player_draw_gun);
		else if (m.buttons[i] == "automatic aim")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_auto_aim);
		else if (m.buttons[i] == "ammo pickup in last slot")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_ammo_pickup_last);
		else if (m.buttons[i] == "show hints")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_hints);
		else if (m.buttons[i] == "lose items on death")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_lose_items);
		else if (m.buttons[i] == "respawn on current level")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_respawn_here);
		else if (m.buttons[i] == "enemies spawn")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_enemies_spawn);
		else if (m.buttons[i] == "debug")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_debug);
		else if (m.buttons[i] == "enable trees")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_trees);
		else if (m.buttons[i] == "automatic respawn")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_autorespawn);
		else if (m.buttons[i] != "back to settings" && m.indicators_settings
			.includes(m.buttons[i]))
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_indicators[m.buttons[i]]);
		else if (m.buttons[i] != "back to settings" && m.auto_pickup_settings
			.includes(m.buttons[i]))
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_auto_pickup[m.buttons[i]]);
		else if (m.buttons[i] == "language")
			text = menu_translate(m.want_language, text) + ": " +
			menu_translate(m.want_language, m.want_language);
		else if (m.buttons[i] == "volume")
			text = menu_translate(m.want_language, text) + ": " +
			GLOBAL_VOLUME + "%";
		else
			text = menu_translate(m.want_language, text);
		if (text.length > 0 && text[0] == "~")
			drawButton(ctx, 80, 80 + 60 * i, text.substring(1));
		else if (m.iselected == i)
			drawButton(ctx, 100, 80 + 60 * i, "[" + text + "]");
		else
			drawButton(ctx, 80, 80 + 60 * i, text);
	}
	ctx.restore();
}

function menu_update(m, dt, input) {
	let changed = false;
	if (!m.mobile && input.touch.length > 0)
		m.mobile = true;
	let would_be_able_to_touch_button = false;
	for (let i = 0; i < m.buttons.length; i++)
		if ((!m.mobile && doRectsCollide(input.mouse.x / get_scale(), input
				.mouse.y / get_scale(), 0, 0,
				80, 40 + 60 * i, 1000 + 30 * menu_translate(m.want_language,
					m.buttons[i]).length, 60)) ||
			(input.touch && input.touch.length > 0 && doRectsCollide(input
				.touch[0].x / get_scale(), input.touch[0].y / get_scale(),
				0, 0,
				80, 40 + 60 * i, 80 + 30 * menu_translate(m.want_language, m
					.buttons[i]).length, 60))
		) {
			m.iselected = i;
			would_be_able_to_touch_button = true;
		}
	if (m.buttons == m.menu_respawn_buttons && m.want_autorespawn) {
		m.shown = false;
		m.main_menu_buttons[0] = "continue game";
		m.want_player_respawn = true;
		menu1.buttons = menu1.main_menu_buttons;
	}
	m.pressed_this_frame = (isKeyDown(input, ' ', true) || isKeyDown(input,
		'enter', true) || isMouseLeftButtonPressed(input) || (
		isScreenTouched(input)));
	if ((isKeyDown(input, 's', true) || isKeyDown(input, 'ArrowDown', true)) &&
		m.iselected < m.buttons.length - 1) {
		m.iselected += 1;
	}
	else if ((isKeyDown(input, 'w', true) || isKeyDown(input, 'ArrowUp',
			true)) && m.iselected > 0) {
		m.iselected -= 1;
	}
	else if (isMouseRightButtonPressed(input) && m.buttons[m.iselected] ==
		"volume") {
		GLOBAL_VOLUME = GLOBAL_VOLUME - 10;
		if (GLOBAL_VOLUME < 0)
			GLOBAL_VOLUME = 100;
	}
	else if (m.pressed_previous_frame && !m.pressed_this_frame) {
		m.iselected = m.iselected_last_frame;
		changed = true;
		if (m.buttons[m.iselected] == "continue game") {
			m.shown = false;
		}
		else if (m.buttons[m.iselected] == "respawn and continue game") {
			m.shown = false;
			m.main_menu_buttons[0] = "continue game";
			m.want_player_respawn = true;
			menu1.buttons = menu1.main_menu_buttons;
		}
		else if (m.buttons[m.iselected] == "start new game") {
			m.shown = false;
			m.want_new_game = true;
			menu1.main_menu_buttons[0] = "continue game";
			menu1.buttons = menu1.main_menu_buttons;
		}
		else if (m.buttons[m.iselected] == "settings" || m.buttons[m
				.iselected] == "back to settings") {
			m.buttons = m.settings_buttons;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "main menu") {
			m.buttons = m.main_menu_buttons;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "enemies spawn") {
			m.want_enemies_spawn = !m.want_enemies_spawn;
		}
		else if (m.buttons[m.iselected] == "debug") {
			m.want_debug = !m.want_debug;
		}
		else if (m.buttons[m.iselected] == "automatic respawn") {
			m.want_autorespawn = !m.want_autorespawn;
		}
		else if (m.buttons[m.iselected] == "player color") {
			m.buttons = m.player_color_selection_menu;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "save game") {
			m.want_save = true;
		}
		else if (m.buttons[m.iselected] == "load game") {
			m.want_load = true;
		}
		else if (m.buttons[m.iselected] == "volume") {
			GLOBAL_VOLUME = GLOBAL_VOLUME + 10;
			if (GLOBAL_VOLUME > 100)
				GLOBAL_VOLUME = 0;
		}
		else if (m.buttons[m.iselected] == "indicators") {
			m.buttons = m.indicators_settings;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "new game") {
			m.buttons = m.menu_new_game;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "auto pickup") {
			m.buttons = m.auto_pickup_settings;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.indicators_settings.includes(m.buttons[m.iselected])) {
			m.want_indicators[m.buttons[m.iselected]] = !m.want_indicators[m
				.buttons[m.iselected]];
		}
		else if (m.auto_pickup_settings.includes(m.buttons[m.iselected])) {
			m.want_auto_pickup[m.buttons[m.iselected]] = !m.want_auto_pickup[m
				.buttons[m.iselected]];
		}
		else if (m.buttons[m.iselected] == "player draw gun") {
			m.want_player_draw_gun = !m.want_player_draw_gun;
		}
		else if (m.buttons[m.iselected] == "ammo pickup in last slot") {
			m.want_ammo_pickup_last = !m.want_ammo_pickup_last;
		}
		else if (m.buttons[m.iselected] == "show hints") {
			m.want_hints = !m.want_hints;
		}
		else if (m.buttons[m.iselected] == "lose items on death") {
			m.want_lose_items = !m.want_lose_items;
		}
		else if (m.buttons[m.iselected] == "respawn on current level") {
			m.want_respawn_here = !m.want_respawn_here;
		}
		else if (m.buttons[m.iselected] == "set player color to red") {
			m.want_player_color = "red";
		}
		else if (m.buttons[m.iselected] == "set player color to lime") {
			m.want_player_color = "lime";
		}
		else if (m.buttons[m.iselected] == "set player color to yellow") {
			m.want_player_color = "yellow";
		}
		else if (m.buttons[m.iselected] == "set player color to blue") {
			m.want_player_color = "blue";
		}
		else if (m.buttons[m.iselected] == "enable trees") {
			m.want_trees = !m.want_trees;
		}
		else if (m.buttons[m.iselected] == "english") {
			m.want_language = "english";
			m.buttons = m.main_menu_buttons;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "русский") {
			m.want_language = "русский";
			m.buttons = m.main_menu_buttons;
			if (!isScreenTouched(input))
				m.iselected = 0;
		}
		else if (m.buttons[m.iselected] == "language") {
			if (m.want_language == "русский")
				m.want_language = "english";
			else if (m.want_language == "english")
				m.want_language = "русский";
		}
		else if (m.buttons[m.iselected] == "automatic aim") {
			m.want_auto_aim = !m.want_auto_aim;
		}
	}
	m.pressed_previous_frame = m.pressed_this_frame;
	m.iselected_last_frame = m.iselected;
	if (would_be_able_to_touch_button && !m.touched_button_previus_frame)
		m.can_touch_button = true;
	else
		m.can_touch_button = false;
	if (isScreenTouched(input))
		m.touched_button_previus_frame = true;
	else
		m.touched_button_previus_frame = false;
	if (changed) {
		menu_save_settings(m);
	}
}

function menu_translate(lang, str) {
	let prefix = "";
	if (str.length > 0 && str[0] == "~") {
		str = str.substring(1);
		prefix = "~";
	}
	if (lang == "русский") {
		if (str == "start new game")
			str = "начать новую игру";
		else if (str == "settings")
			str = "настройки";
		else if (str == "language")
			str = "язык";
		else if (str == "continue game")
			str = "продолжить игру";
		else if (str == "respawn and continue game")
			str = "возродиться и продолжить игру";
		else if (String(str) == "true")
			str = "да";
		else if (String(str) == "false")
			str = "нет";
		else if (str == "automatically pickup bossifiers")
			str = "автоматически подбирать боссификаторы";
		else if (str == "player color")
			str = "цвет игрока";
		else if (str == "red")
			str = "красный";
		else if (str == "lime")
			str = "светло-зелёный";
		else if (str == "yellow")
			str = "жёлтый";
		else if (str == "blue")
			str = "синий";
		else if (str == "set player color to red")
			str = "сделать игрока красным";
		else if (str == "set player color to blue")
			str = "сделать игрока синим";
		else if (str == "set player color to lime")
			str = "сделать игрока светло-зелёным";
		else if (str == "set player color to yellow")
			str = "сделать игрока жёлтым";
		else if (str == "indicators")
			str = "индикаторы";
		else if (str == "volume")
			str = "громкость";
		else if (str == "back to settings")
			str = "назад к настройкам";
		else if (str == "enemies spawn")
			str = "появление противников";
		else if (str == "player draw gun")
			str = "показывать оружие у игрока";
		else if (str == "main menu")
			str = "главное меню";
		else if (str == "show player health")
			str = "показывать здоровье игрока";
		else if (str == "show player hunger")
			str = "показывать значение сытости игрока";
		else if (str == "show player thirst")
			str = "показывать значение жажды игрока";
		else if (str == "show enemy health")
			str = "показывать здоровье противников";
		else if (str == "show rocket health")
			str = "показывать прочность ракеты";
		else if (str == "show enemy hunger")
			str = "показывать значение сытости зомби";
		else if (str == "show car health")
			str = "показывать значение сломанности автомобилей"
		else if (str == "show car fuel")
			str = "показывать значение топлива автомобиля";
		else if (str == "show hints")
			str = "подсказки";
		else if (str == "ammo pickup in last slot")
			str = "собирать патроны в последний слот";
		else if (str == "automatically pickup food and drinks")
			str = "автоматически подбирать еду и напитки";
		else if (str == "automatically pickup fuel")
			str = "автоматически подбирать топливо";
		else if (str == "automatically pickup health")
			str = "автоматически подбирать аптечки";
		else if (str == "automatically pickup ammo")
			str = "автоматически подбирать патроны";
		else if (str == "auto pickup")
			str = "автоматически подбирать предметы";
		else if (str == "lose items on death")
			str = "терять вещи при смерти";
		else if (str == "respawn on current level")
			str = "возрождение на текущем уровнe";
		else if (str == "new game")
			str = "новая игра";
		else if (str == "enable trees")
			str = "деревья";
		else if (str == "automatic respawn")
			str = "автоматическое возрождение";
		else if (str == "debug")
			str = "техническая информация для разработчика";
		else if (str == "save game")
			str = "сохранить игру";
		else if (str == "load game")
			str = "загрузить игру";
		else if (str == "MAIN MENU")
			str = "ГЛАВНОЕ МЕНЮ";
		else if (str == "YOU DIED")
			str = "СМЕРТЬ";
		else if (str == "SETTINGS")
			str = "НАСТРОЙКИ";
		else if (str == "automatically pickup weapons")
			str = "автоматически подбирать оружие";
		else if (str == "automatically pickup shields")
			str = "автоматически подбирать защитные поля";
		else if (str == "automatic aim")
			str = "автоматическое прицеливание";
	}
	return prefix + str;
}

function menu_save_settings(m) {
	const settings = {
		want_player_color: m.want_player_color,
		want_player_draw_gun: m.want_player_draw_gun,
		want_enemies_spawn: m.want_enemies_spawn,
		want_trees: m.want_trees,
		want_language: m.want_language,
		want_hints: m.want_hints,
		want_ammo_pickup_last: m.want_ammo_pickup_last,
		want_lose_items: m.want_lose_items,
		want_respawn_here: m.want_respawn_here,
		want_autorespawn: m.want_autorespawn,
		want_auto_aim: m.want_auto_aim,
		want_indicators: m.want_indicators,
		want_auto_pickup: m.want_auto_pickup,
		volume: GLOBAL_VOLUME
	};
	localStorage.setItem("game_settings", JSON.stringify(settings));
}

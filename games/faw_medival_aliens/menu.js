

// menu is done separately from the game but drawn on the same canvas

let MENU_BUTTON_WIDTH = 407;
let MENU_BUTTON_HEIGHT = 40;
let MENU_BUTTON_SPACING = 20;

let MENU_LANGUAGE_ENG = 1;
let MENU_LANGUAGE_RUS = 2;

function create_settings_menu(canvas, main_menu) {
	let menu = {
		lang: MENU_LANGUAGE_ENG,
		buttons: null,
		settings: {
			square_color: "red"
		}
	};

	let color_button = create_button(11,
		0.1 * MENU_BUTTON_WIDTH,
		MENU_BUTTON_HEIGHT * 2 + MENU_BUTTON_SPACING,
		MENU_BUTTON_WIDTH,
		MENU_BUTTON_HEIGHT, "square color", "цвет квадратика", null, false, canvas);
	color_button.metadata = "red";
	color_button.action = function() {
		if(color_button.metadata == "red")
			color_button.metadata = "lime";
		else if(color_button.metadata == "lime")
			color_button.metadata = "yellow";
		else if(color_button.metadata == "yellow")
			color_button.metadata = "red";
		menu.settings.square_color = color_button.metadata;
	};

	buttons = [
		color_button,
		create_button(0,
			0.1 * MENU_BUTTON_WIDTH,
			MENU_BUTTON_HEIGHT * 3 + MENU_BUTTON_SPACING * 2,
			MENU_BUTTON_WIDTH,
			MENU_BUTTON_HEIGHT,
			"back to main menu", "назад в главное меню",
			function() {
				menu_hide(menu);
				menu_show(main_menu);
			},
			false, canvas),
	]
	menu.buttons = buttons;
	return menu;
}

function create_main_menu(canvas) {
	let menu = {
		lang: MENU_LANGUAGE_ENG,
		buttons: null,
		settings_menu: null
	};
	menu.settings_menu = create_settings_menu(canvas, menu);
	buttons = [
		create_button(1, 0.1 * MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT * 2 + MENU_BUTTON_SPACING, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT, "start game", "начать игру", function() {
			menu_hide(menu);
		}, true, canvas),

		create_button(2, 0.1 * MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT * 3 + MENU_BUTTON_SPACING * 2, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT, "settings", "настройки", function() {
			menu_hide(menu);
			menu_show(menu.settings_menu);
		}, true, canvas),

		create_button(3, 0.1 * MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT * 4 + MENU_BUTTON_SPACING * 3, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT, "load game", "загрузить сохранение", function() {
			// ...load game
		}, true, canvas),

		create_button(4, 0.1 * MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT * 5 + MENU_BUTTON_SPACING * 4, MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT, "переключить на русский", "set language to english", function() {
			menu.lang = MENU_LANGUAGE_ENG + MENU_LANGUAGE_RUS - menu.lang;
			menu.settings_menu.lang = menu.lang;
		}, true, canvas)
	]
	menu.buttons = buttons;
	return menu;
}

function menu_hide(menu) {
	for(let i = 0; i < menu.buttons.length; i++)
		menu.buttons[i].shown = false;
}

function menu_show(menu) {
	for(let i = 0; i < menu.buttons.length; i++)
		menu.buttons[i].shown = true;
}

function is_menu_shown(menu) {
	for(let i = 0; i < menu.buttons.length; i++) {
		if(menu.buttons[i].shown)
			return true;
	}
	return false;
}

function draw_menu(ctx, menu) {
	ctx.fillStyle = "#111111";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	drawStr(ctx, "medieval alien invasion", 0.1 * MENU_BUTTON_WIDTH, MENU_BUTTON_HEIGHT + MENU_BUTTON_SPACING, 3);
	for(let i = 0; i < menu.buttons.length; i++) {
		if(menu.buttons[i].shown)
			draw_button(ctx, menu.buttons[i], menu.lang);
	}
}

function draw_button(ctx, button, lang = MENU_LANGUAGE_ENG) {
	const borderColor = "black";
	let fillColor = "#eee"; // стандарт

	if (button.pressed) {
		fillColor = "#ff1"; // нажата
	} else if (button.hovered) {
		fillColor = "#bbb"; // наведена
	}

	const textColor = "black";
	const pixelSize = 2;
	const spacing = 1;
	const spaceWidth = 2;

	// фон и рамка
	ctx.fillStyle = fillColor;
	ctx.fillRect(button.x, button.y, button.w, button.h);
	ctx.strokeStyle = borderColor;
	ctx.strokeRect(button.x, button.y, button.w, button.h);

	// текст
	let text = lang === MENU_LANGUAGE_ENG ? button.text_eng : button.text_rus;
	const textWidth = text.length * (5 * pixelSize + spacing) - spacing + text.split(" ").length * spaceWidth * pixelSize;
	const textHeight = 5 * pixelSize;

	if(button.metadata.length > 0)
		text += ": " + translate(button.metadata, lang);

	const textX = button.x + 0.1 * button.w;
	const textY = button.y + (button.h - textHeight) / 2;

	ctx.fillStyle = textColor;
	drawStr(ctx, text, textX, textY, pixelSize, spacing, spaceWidth);
}

function create_button(id, x, y, w, h, text_eng, text_rus, action, shown, canvas) {
	const button = {
		id: id,
		x: x,
		y: y,
		w: w,
		h: h,
		text_eng: text_eng,
		text_rus: text_rus,
		hovered: false,
		pressed: false,
		action: action,
		shown: shown,
		metadata: ""
	};

	// Наведение мыши
	canvas.addEventListener("mousemove", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (!button.shown) {
			button.hovered = false;
			return;
		}

		button.hovered =
			mouseX >= button.x &&
			mouseX <= button.x + button.w &&
			mouseY >= button.y &&
			mouseY <= button.y + button.h;
	});

	// Нажатие мыши
	canvas.addEventListener("mousedown", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (
			button.shown &&
			mouseX >= button.x &&
			mouseX <= button.x + button.w &&
			mouseY >= button.y &&
			mouseY <= button.y + button.h
		) {
			button.pressed = true;
		}
	});

	// Отпускание мыши — и выполнение действия
	canvas.addEventListener("mouseup", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (
			button.pressed &&
			button.shown &&
			mouseX >= button.x &&
			mouseX <= button.x + button.w &&
			mouseY >= button.y &&
			mouseY <= button.y + button.h
		) {
			if (typeof button.action === "function") {
				button.action();
			}
		}

		button.pressed = false;
	});

	return button;
}

function translate(text, lang) {
	const COLOR_TRANSLATIONS = {
		"red": "красный",
		"blue": "синий",
		"green": "зелёный",
		"yellow": "жёлтый",
		"orange": "оранжевый",
		"black": "черный",
		"white": "белый",
		"purple": "пурпурный",
		"pink": "розовый",
		"brown": "коричневый",
		"gray": "серый",
		"cyan": "голубой",
		"magenta": "пурпурный",
		"lime": "лаймовый"
	};
	if (lang === MENU_LANGUAGE_RUS) {
		return COLOR_TRANSLATIONS[text.toLowerCase()] || text;
	}
	return text;
}

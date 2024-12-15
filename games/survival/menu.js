
function menu_create(b) {
	let m = {
		shown: true,
		iselected: 0,
		buttons: b // array of strings
	};
	return m;
}

function menu_hide(m) {
	m.shown = false;
}

function menu_show(m) {
	m.shown = true;
}

function menu_draw(ctx, m) {
	let s = "";
	for(let i = 0; i < m.buttons.length; i++)
		if(m.iselected == i)
			drawButton(ctx, 60, 40 + 60 * i, "[" + m.buttons[i] + "]");
		else
			drawButton(ctx, 40, 40 + 60 * i, m.buttons[i]);
}


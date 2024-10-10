
function menu_create(input_) {
	let m = {
		input: input_,
		buttons: []
	};
	return m;
}

function menu_destroy_all_buttons(m) {
	for(let i = 0; i < m.buttons.length; i++)
		m.buttons.pop();
}

function menu_button_create(m, x_, y_, w_, h_, text_, func_action) {
	let b = {
		x: x_,
		y: y_,
		w: w_,
		h: h_,
		text: text_,
		action: func_action
	};
	m.buttons.push(b);
	return m.buttons.length - 1;
}

function menu_update(m, dt) {
}

function menu_draw(m, ctx) {
	for(let i = 0; i < m.buttons.length; i++)
		menu_draw_button(m.buttons[i], ctx);
}

function menu_draw_button(b, ctx) {
	ctx.fillStyle = 'green';
	ctx.fillRect(b.x, b.y, b.w, b.h);
	drawText(ctx, b.x + b.w / 4, b.y + b.h / 2, b.text);
}


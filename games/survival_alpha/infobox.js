
function infobox_create(g, x_, y_, max_lines_) {
	ib = {
		x: x_,
		y: y_,
		lines: [],
		max_lines: max_lines_
	};
	return game_gui_element_create(g, "infobox", ib, infobox_update, infobox_draw, infobox_destroy);
}

function infobox_destroy(infobox_element) {
	infobox_element.destroyed = true;
}

function infobox_update(infobox_element, dt) {
	let ib = infobox_element.data;
	if(ib.lines.length > ib.max_lines)
		ib.lines.splice(ib.max_lines, ib.lines.length - ib.max_lines);
}

function infobox_draw(infobox_object, ctx) {
	let ib = infobox_object.data;
	for(let i = 0; i < ib.lines.length; i++)
		drawText(ctx, ib.x, ib.y + 20 * i, ib.lines[i]);
}


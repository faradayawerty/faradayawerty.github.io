
function achievements_create(g) {
	let ach = {
		width: 1000,
		height: 1000,
		offset_x: 50,
		offset_y: 50,
		x: 50 + 500,
		y: 50 + 100,
		icon_size: 40,
		achievements: [
			{
				name: "getting in",
				desc: "launch the game",
				req: null,
				done: false
			},
			{
				name: "first steps",
				desc: "make first steps using WASD",
				req: "getting in",
				done: false
			},
			{
				name: "discovering inventory",
				desc: "discover inventory by pressing E or I",
				req: "getting in",
				done: false
			},
			{
				name: "achievements",
				desc: "open achievements menu using J",
				req: "getting in",
				done: false
			},
			{
				name: "outside the box",
				desc: "go outside the current level",
				req: "first steps",
				done: false
			},
			{
				name: "get a ride",
				desc: "get a ride in the car by standing close to it and pressing F or SPACE",
				req: "first steps",
				done: false
			},
		]
	};
	return game_gui_element_create(g, "achievements", ach, achievements_update, achievements_draw, achievements_destroy);
}

function achievements_destroy(ae) {
	ae.destroyed = true;
}

function achievements_update(ae, dt) {
	if(ae.game.input.mouse.leftButtonPressed) {

		let mx = ae.game.input.mouse.x / get_scale();
		let my = ae.game.input.mouse.y / get_scale();

		if(ae.data.offset_x < mx && mx < ae.data.offset_x + ae.data.width)
			ae.data.x = mx;
		if(ae.data.offset_y < my && my < ae.data.offset_y + ae.data.width)
			ae.data.y = my;
	}
}

function achievements_draw(ae, ctx) {

	ctx.fillStyle = "#000810";
	ctx.fillRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data.height);
	ctx.strokeStyle = "white";
	ctx.strokeRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data.height);

	let x = ae.data.x;
	let y = ae.data.y;
	let w = ae.data.icon_size;
	let h = ae.data.icon_size;
	achievement_icon_draw(ctx, "getting in", x, y, w, h);

	achievement_icon_draw(ctx, "discovering inventory", x + w * 2, y + h * 2, w, h);
	achievement_icon_draw(ctx, "first steps", x, y + h * 2, w, h);
	achievement_icon_draw(ctx, "achievements", x - w * 2, y + h * 2, w, h);

	achievement_icon_draw(ctx, "outside the box", x, y + h * 4, w, h);
	achievement_icon_draw(ctx, "get a ride", x - w * 2, y + h * 4, w, h);
}

function achievements_translate(lang, text) {
	return text;
}

function achievement_icon_draw(ctx, name, x, y, w, h, done=false, bbx=50, bby=50, bbw=1000, bbh=1000) {

	if(x < bbx || x > bbw || y < bby || y > bbh)
		return;

	let c0 = "red";
	let c1 = "yellow";
	let c2 = "lime";
	let c3 = "blue";
	let c4 = "cyan";
	let c5 = "purple";
	let c6 = "orange";
	let c7 = "green";
	if(!done) {
		c0 = "black";
		c1 = "white";
		c2 = "white";
		c3 = "black";
		c4 = "gray";
		c5 = "gray";
		c6 = "gray";
		c7 = "black";
	}

	if(name == "getting in") {
		ctx.fillStyle = c1;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else {
		ctx.fillStyle = "#000000";
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.fillStyle = c5;
		ctx.fillRect(x + 0.5 * w, y + 0.1 * h, 0.4 * w, 0.4 * h);
		ctx.fillRect(x + 0.1 * w, y + 0.5 * h, 0.4 * w, 0.4 * h);
	}
}


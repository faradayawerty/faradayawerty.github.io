
function achievements_create(g) {
	let ach = {
		width: 1000,
		height: 1000,
		x: 0,
		y: 0,
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
		]
	};
	return game_gui_element_create(g, "achievements", ach, achievements_update, achievements_draw, achievements_destroy);
}

function achievements_destroy(ae) {
}

function achievements_update(ae, dt) {
}

function achievements_draw(ae, ctx) {
	ctx.fillStyle = "black";
	ctx.fillRect(ae.data.width * 0.0625, ae.data.height * 0.0625, ae.data.width, ae.data.height);
	ctx.strokeStyle = "white";
	ctx.strokeRect(ae.data.width * 0.0625, ae.data.height * 0.0625, ae.data.width, ae.data.height);
}

function achievements_translate(lang, text) {
	return text;
}


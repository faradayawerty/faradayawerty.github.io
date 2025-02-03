
function achievements_create(g) {
	let ach = {
		width: 1000,
		height: 1000,
		offset_x: 50,
		offset_y: 50,
		x: 50 + 100,
		y: 50 + 100,
		xx: 50 + 500, // x before mouse click
		yy: 50 + 500, // y before mouse click
		mxx: 0,
		myy: 0,
		clicked: false,
		icon_size: 40,
		achievements: [
			{
				name: "joining in",
				desc: "launch the game",
				name_rus: "к бою",
				desc_rus: "зайти в игру",
				req: null,
				done: false
			},
			{
				name: "first steps",
				desc: "make first steps using WASD",
				name_rus: "первые шаги",
				desc_rus: "совершите первые шаги, используя WASD",
				req: "joining in",
				done: false
			},
			{
				name: "discovering inventory",
				desc: "discover inventory by pressing E or I",
				name_rus: "открытие инвентаря",
				desc_rus: "откройте инвентарь, нажав E или I",
				req: "joining in",
				done: false
			},
			{
				name: "achievements",
				desc: "open achievements menu using J or R",
				name_rus: "достижения",
				desc_rus: "откройте меню достижений, нажав J или R",
				req: "joining in",
				done: false
			},
			{
				name: "outside the box",
				desc: "leave the current level",
				name_rus: "по ту сторону",
				desc_rus: "покиньте текущий уровень, выйдя за его пределы",
				req: "first steps",
				done: false
			},
			{
				name: "get a ride",
				desc: "get a ride in the car by standing close to it and pressing F or SPACE",
				name_rus: "поехали",
				desc_rus: "сядьте в автомобиль, подойдя к нему близко и нажав F или SPACE",
				req: "first steps",
				done: false
			},
			{
				name: "pick an item",
				desc: "pick up an item by standing close to it and pressing F or SPACE",
				name_rus: "подобрать предмет",
				desc_rus: "подберите предмет, подойдя к нему близко и нажав F или SPACE",
				req: "outside the box",
				done: false
			},
			{
				name: "get a gun",
				desc: "find a gun and pick it up",
				name_rus: "получить оружие",
				desc_rus: "найдите и подберите оружие",
				req: "pick an item",
				done: false
			},
			{
				name: "need for ammo",
				desc: "try shooting a gun without having any ammo for it",
				name_rus: "нужны патроны",
				desc_rus: "попробуйте выстрелить из оружия, не имея подходящих патронов",
				req: "get a gun",
				done: false
			},
			{
				name: "shoot 'em up",
				desc: "kill an enemy by shooting at it",
				name_rus: "зомби шутер",
				desc_rus: "убейте врага, выстрелив по нему",
				req: "get a gun",
				done: false
			},
			{
				name: "yummy",
				desc: "eat canned meat to reduce the feeling of hunger",
				name_rus: "вкусняшка",
				desc_rus: "съешьте тушенку для снижения чувства голода",
				req: "pick an item",
				done: false
			},
			{
				name: "stay hydrated",
				desc: "drink a can of water to quench your thirst",
				name_rus: "поддержка водного баланса",
				desc_rus: "выпейте воду, чтобы утолить жажду",
				req: "pick an item",
				done: false
			},
			{
				name: "healthy lifestyle",
				desc: "use a health pack to heal",
				name_rus: "здоровый образ жизни",
				desc_rus: "воспользуйтесь аптечкой, чтобы восстановить здоровье",
				req: "pick an item",
				done: false
			},
		]
	};
	return game_gui_element_create(g, "achievements", ach, achievements_update, achievements_draw, achievements_destroy);
}

function achievements_destroy(ae) {
	if(!ae || ae.destroyed)
		return;
	ae.destroyed = true;
}

function achievements_update(ae, dt) {

	let as = ae.data.achievements;

	if(ae.game.input.mouse.leftButtonPressed) {

		let mx = ae.game.input.mouse.x / get_scale();
		let my = ae.game.input.mouse.y / get_scale();
		if(ae.data.offset_x < mx && mx < ae.data.offset_x + ae.data.width
			&& ae.data.offset_y < my && my < ae.data.offset_y + ae.data.height) {

			if(!ae.data.clicked) {
				ae.data.xx = ae.data.x;
				ae.data.yy = ae.data.y;
				ae.data.mxx = mx;
				ae.data.myy = my;
			}

			let dx = mx - ae.data.mxx;
			let dy = my - ae.data.myy;

				ae.data.x = ae.data.xx + dx;
				ae.data.y = ae.data.yy + dy;

			ae.data.clicked = true;
		}
	} else if(ae.data.clicked) {
		ae.data.xx = ae.game.input.mouse.x / get_scale();
		ae.data.yy = ae.game.input.mouse.y / get_scale();
		ae.data.clicked = false;
	}
}

function achievements_draw(ae, ctx) {

	let as = ae.data.achievements;

	ctx.globalAlpha = 0.75;

	//ctx.fillStyle = "#000810";
	ctx.fillStyle = "black";
	ctx.fillRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data.height);
	ctx.strokeStyle = "white";
	ctx.strokeRect(ae.data.offset_x, ae.data.offset_y, ae.data.width, ae.data.height);

	ctx.globalAlpha = 1.0;

	let x = ae.data.x;
	let y = ae.data.y;
	let w = ae.data.icon_size;
	let h = ae.data.icon_size;

	let achs = [
		[
			"joining in",
			"achievements",
			"discovering inventory",
		],
		[
			"first steps",
			"get a ride",
		],
		[
			"outside the box",
			"pick an item",
			"yummy",
			"stay hydrated",
			"healthy lifestyle",
		],
		[
			"get a gun",
			"need for ammo",
		],
		[
			"shoot 'em up",
		]
	]

	let mx = ae.game.input.mouse.x / get_scale();
	let my = ae.game.input.mouse.y / get_scale();

	for(let i = 0; i < achs.length; i++) {
		for(let j = 0; j < achs[i].length; j++)
			achievement_icon_draw(ctx, as, achs[i][j], x + 2 * i * w, y + 2 * j * h, w, h);
	}

	for(let i = 0; i < achs.length; i++) {
		for(let j = 0; j < achs[i].length; j++)
			if(x + 2 * i * w < mx && mx < x + 2 * i * w + w && y + 2 * j * h < my && my < y + 2 * j * h + h && achs[i][j]) {
				if(!achievement_get(as, achs[i][j]).req || achievement_get(as, achievement_get(as, achs[i][j]).req).done) {
					let text = achievement_get(as, achs[i][j]).name + ": " + achievement_get(as, achs[i][j]).desc;
					if(ae.game.settings.language == "русский")
						text = achievement_get(as, achs[i][j]).name_rus + ": " + achievement_get(as, achs[i][j]).desc_rus;
					drawText(ctx, mx + w, my + h * 1.125, text, 24);
				}
			}
	}
}

function achievements_translate(lang, text) {
	return text;
}

function achievement_icon_draw(ctx, as, name, x, y, w, h, done=false, bbx=50, bby=50, bbw=1000, bbh=1000) {

	if(x < bbx || x > bbw + 0.25 * bbx || y < bby || y > bbh + 0.25 * bby || !name)
		return;

	let ach = achievement_get(as, name);
	if(achievement_get(as, name).req && !achievement_get(as, achievement_get(as, name).req).done)
		return;
	if(!done) {
		if(ach)
			done = ach.done;
	}

	let c0 = "red";
	let c1 = "yellow";
	let c2 = "lime";
	let c3 = "blue";
	let c4 = "cyan";
	let c5 = "purple";
	let c6 = "orange";
	let c7 = "green";
	let c8 = "white";
	let c9 = "black";
	let c10 = "gray";
	let c11 = "#771111";
	let c12 = "#1177dd";
	let c13 = "#1177ff";
	if(!done) {
		c0 = "black";
		c1 = "white";
		c2 = "white";
		c3 = "black";
		c4 = "gray";
		c5 = "gray";
		c6 = "gray";
		c7 = "black";
		c8 = "white";
		c9 = "black";
		c10 = "white";
		c11 = "#111111";
		c12 = "#777777";
		c13 = "#777777";
	}

	ctx.lineWidth = 0.025 * w;

	ctx.globalAlpha *= 0.25;
	ctx.fillStyle = "blue";
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x, y, w, h);
	ctx.globalAlpha *= 4;

	if(name == "joining in") {
		ctx.fillStyle = c0;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "shoot 'em up") {
		ctx.fillStyle = c7;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "get a gun") {
		ctx.fillStyle = c9;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = c10;
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(name == "yummy") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.fillStyle = c11;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(name == "stay hydrated") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = c12;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(name == "healthy lifestyle") {
		ctx.fillStyle = c8;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = c13;
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = c13;
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	} else if(name == "need for ammo") {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = c1;
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c6;
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c6;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
		ctx.fillStyle = "black";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = "gray";
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(name == "pick an item") {
		let N = 4;
		for(let i = 0; i < N; i++) {
			ctx.fillStyle = c1;
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c6;
			ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c6;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y + 0.25 * h, 0.5 * w / N, 0.5 * h);
		}
	} else if(name == "first steps") {
		drawLine(ctx, x + w * 0.05, y + h * 0.35, x + w * 0.5, y + h * 0.35, c4, w * 0.05);
		drawLine(ctx, x + w * 0.05, y + h * 0.5, x + w * 0.5, y + h * 0.5, c4, w * 0.05);
		drawLine(ctx, x + w * 0.05, y + h * 0.65, x + w * 0.5, y + h * 0.65, c4, w * 0.05);
		ctx.fillStyle = c0;
		ctx.fillRect(x + 0.3 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.3 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		//drawText(ctx, x + 0.3 * w, y + 0.45 * h, "WA", 10);
		//drawText(ctx, x + 0.325 * w, y + 0.65 * h, "SD", 10);
	} else if(name == "get a ride") {
		ctx.fillStyle = c5;
		ctx.fillRect(x + 0.3 * w, y + 0.1 * h, 0.4 * w, 0.8 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.3 * w, y + 0.1 * h, 0.4 * w, 0.8 * h);
	} else if(name == "outside the box") {
		ctx.fillStyle = c7;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.fillStyle = c0;
		ctx.fillRect(x + 0.7 * w, y + 0.3 * h, 0.2 * w, 0.2 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.7 * w, y + 0.3 * h, 0.2 * w, 0.2 * h);
	} else if(name == "discovering inventory") {
		for(let i = 0; i < 5; i++) {
			for(let j = 0; j < 4; j++) {
				ctx.fillStyle = c3;
				ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 * h * j + 0.1 * h, 0.1 * w, 0.1 * h);
			}
		}
	} else if(name == "achievements") {
		let cols = [c0, c1, c2, c3, c7];
		for(let i = 0; i < 6; i++) {
			for(let j = 0; j < 6; j++) {
				ctx.fillStyle = cols[(2*i + j) % cols.length];
				ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 * h * j + 0.1 * h, 0.1 * w, 0.1 * h);
			}
		}
	} else {
		ctx.fillStyle = "#000000";
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.fillStyle = c5;
		ctx.fillRect(x + 0.5 * w, y + 0.1 * h, 0.4 * w, 0.4 * h);
		ctx.fillRect(x + 0.1 * w, y + 0.5 * h, 0.4 * w, 0.4 * h);
	}
}

function achievement_get(as, name) {
	for(let i = 0; i < as.length; i++)
		if(as[i].name == name)
			return as[i];
	return null;
}

function achievement_do(as, name, ash=null, silent=false) {
	for(let i = 0; i < as.length; i++) {
		if(as[i].name == name && !as[i].done && !(achievement_get(as, name).req && !achievement_get(as, achievement_get(as, name).req).done)) {
			as[i].done = true;
			if(ash && !silent)
				ash.data.achievements.unshift(name);
		}
	}
}

function achievements_shower_create(g, ae=null) {
	let ash = {
		x: 50,
		y: 120,
		w: 700,
		h: 50,
		achievements: [],
		attached_to: ae,
		time_since_last_deleted_achievement: 0
	};
	return game_gui_element_create(g, "achievements shower", ash, achievements_shower_update, achievements_shower_draw, achievements_shower_destroy);
}

function achievements_shower_update(ashe, dt) {
	ashe.data.time_since_last_deleted_achievement += dt * (achievement_get(ashe.data.attached_to.data.achievements, "achievements").done ? 1 : 0);
	if(ashe.data.achievements.length < 1)
		ashe.data.time_since_last_deleted_achievement = 0;
	if(ashe.data.time_since_last_deleted_achievement > 4000 || ashe.data.achievements.length > 4) {
		ashe.data.achievements.pop();
		ashe.data.time_since_last_deleted_achievement = 0;
	}
}

function achievements_shower_draw(ashe, ctx) {
	for(let i = 0; i < ashe.data.achievements.length; i++) {

		let ach = ashe.data.achievements[i];

		let x = ashe.data.x;
		let y = ashe.data.y + ashe.data.h * 1.25 * i;
		let w = ashe.data.w;
		let h = ashe.data.h;
		let size = Math.min(w, h);

		ctx.globalAlpha *= 0.5;
		ctx.fillStyle = "black";
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = "gray";
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 2;

		let text = "achivement get: " + ach + "! press R or J to view";
		if(ashe.game.settings.language == "русский")
			text = "получено достижение: " + achievement_get(ashe.data.attached_to.data.achievements, ach).name_rus + "! нажмите R или J";
		drawText(ctx, x + 1.25 * size, y + 0.6 * size, text, 20);
		achievement_icon_draw(ctx, ashe.data.attached_to.data.achievements, ach, x + 0.125 * size, y + 0.125 * size, 0.75 * size, 0.75 * size);
		ctx.globalAlpha = 1;
	}
}

function achievements_shower_destroy(ashe) {
	if(!ashe || ashe.destroyed)
		return;
	ashe.destroyed = true;
	achievements_destroy(ashe.data.attached_to);
}


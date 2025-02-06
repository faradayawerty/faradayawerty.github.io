
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
		icon_size: 60,
		animstate: 0,
		achievements: [

			// game machanics achievements
			{
				name: "joining in",
				desc: "launch the game",
				name_rus: "к бою",
				desc_rus: "зайти в игру",
				req: null,
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
				name: "full inventory",
				desc: "fill up the inventory with items fully",
				name_rus: "полный инвентарь",
				desc_rus: "полностью заполните инвентарь предметами",
				req: "discovering inventory",
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

			// movement achievements
			{
				name: "first steps",
				desc: "make first steps using WASD",
				name_rus: "первые шаги",
				desc_rus: "совершите первые шаги, используя WASD",
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

			// item achievements,
			{
				name: "pick an item",
				desc: "pick up an item by standing close to it and pressing F or SPACE",
				name_rus: "подобрать предмет",
				desc_rus: "подберите предмет, подойдя к нему близко и нажав F или SPACE",
				req: "outside the box",
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
			{
				name: "fuel up",
				desc: "use gasoline to refuel a car",
				name_rus: "заправка",
				desc_rus: "воспользуйтесь бензином, чтобы заправить автомобиль",
				req: "pick an item",
				done: false
			},

			// weapon achievements
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

			// enemy achievements
			{
				name: "shoot 'em up",
				desc: "kill an enemy by shooting at it",
				name_rus: "зомби шутер",
				desc_rus: "убейте врага, выстрелив по нему",
				req: "get a gun",
				done: false
			},
			{
				name: "big guy",
				desc: "kill the boss; it is able to spawn when enough enemies are killed",
				name_rus: "большой парень",
				desc_rus: "убейте босса; босс появляется, если игрок убивает достаточное количество врагов",
				req: "shoot 'em up",
				done: false
			},
			{
				name: "they can shoot?",
				desc: "kill the first shooting enemy",
				name_rus: "они умеют стрелять?",
				desc_rus: "убейте первого стрелка",
				req: "big guy",
				done: false
			},
			{
				name: "big shooting guy",
				desc: "kill a shooting boss; it is able to spawn when enough shooting enemies are killed",
				name_rus: "большой стрелок",
				desc_rus: "убейте босса стрелка; стреляющий босс появляется, если игрок убивает достаточное количество стрелков",
				req: "big guy",
				done: false
			},
			{
				name: "red shooter",
				desc: "kill one red shooter",
				name_rus: "красный стрелок",
				desc_rus: "убейте одного красного стрелка",
				req: "big shooting guy",
				done: false
			},
			{
				name: "big red guy",
				desc: "kill red boss; it is able to spawn when enough red shooting enemies are killed",
				name_rus: "большой красный парень",
				desc_rus: "убейте красного босса; красный босс появляется, если игрок убивает достаточное количество красных стрелков",
				req: "big shooting guy",
				done: false
			},
			{
				name: "he has a sword?",
				desc: "kill one yellow enemy",
				name_rus: "у него меч?",
				desc_rus: "убейте одного желтого врага",
				req: "big red guy",
				done: false
			},
			{
				name: "big guy with a sword",
				desc: "kill yellow boss; it is able to spawn when enough yellow enemies are killed",
				name_rus: "большой парень с мечом",
				desc_rus: "убейте желтого босса; желтый босс появляется, если игрок убивает достаточное количество желтых врагов",
				req: "big red guy",
				done: false
			},
			{
				name: "rocket shooter",
				desc: "kill one rocket shooting enemy",
				name_rus: "стрелок с ракетницей",
				desc_rus: "убейте одного стрелка с ракетницей",
				req: "big guy with a sword",
				done: false
			},
			{
				name: "big military guy",
				desc: "kill the boss with a rocket launcher; it is able to spawn when enough rocket shooting enemies are killed",
				name_rus: "большой военный парень",
				desc_rus: "убейте босса с ракетницей; босс с ракетницей появляется, если игрок убивает достаточное количество противников с ракетницей",
				req: "big guy with a sword",
				done: false
			},
			{
				name: "rainbow",
				desc: "kill one rainbow enemy",
				name_rus: "радуга",
				desc_rus: "убейте одного радужного противника",
				req: "big military guy",
				done: false
			},
			{
				name: "huge rainbow guy",
				desc: "kill the rainbow boss; it is able to spawn when enough rainbow enemies are killed",
				name_rus: "гигантский радужный парень",
				desc_rus: "убейте радужного босса; радужный босс появляется, если игрок убивает достаточное количество радужных врагов",
				req: "big military guy",
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

	ae.data.animstate += 0.0075 * dt;

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
			"full inventory",
		],
		[
			"first steps",
			"outside the box",
			"get a ride",
			"fuel up",
		],
		[
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
			"they can shoot?",
			"red shooter",
			"he has a sword?",
			"rocket shooter",
			"rainbow",
		],
		[
			"big guy",
			"big shooting guy",
			"big red guy",
			"big guy with a sword",
			"big military guy",
			"huge rainbow guy",
		],
	]

	let mx = ae.game.input.mouse.x / get_scale();
	let my = ae.game.input.mouse.y / get_scale();

	for(let i = 0; i < achs.length; i++) {
		for(let j = 0; j < achs[i].length; j++)
			achievement_icon_draw(ctx, as, achs[i][j], x + 2 * i * w, y + 2 * j * h, w, h,
				false, 50, 50, 1000, 1000, ae.data.animstate);
	}

	for(let i = 0; i < achs.length; i++) {
		for(let j = 0; j < achs[i].length; j++)
			if(x + 2 * i * w < mx && mx < x + 2 * i * w + w && y + 2 * j * h < my && my < y + 2 * j * h + h && achs[i][j]) {
				if(!achievement_get(as, achs[i][j]).req || achievement_get(as, achievement_get(as, achs[i][j]).req).done)
					achievement_draw_popup(ctx, ae, achs[i][j], mx, my, w, h);
			}
	}
}

function achievements_translate(lang, text) {
	return text;
}

function achievement_icon_draw(ctx, as, name, x, y, w, h, done=false, bbx=50, bby=50, bbw=1000, bbh=1000, animstate=null, back=true) {

	if(x < bbx || x > bbw - 0.2 * w || y < bby || y > bbh - 0.2 * h || !name)
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
	let c14 = "#335544";
	let c16 = "#cc1111";
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
		c14 = "#333333";
		c16 = "#111111";
	}

	let c15 = "black";
	if(animstate != null) {
		let r = Math.cos(0.1 * animstate) * 15;
		let g = 0.7 * (Math.cos(0.1 * animstate) + Math.sin(0.1 * animstate)) * 15;
		let b = Math.sin(0.1 * animstate) * 15;
		let avg = Math.floor(0.11 * (r+g+b) * (r+g+b));
		r = Math.floor(r*r);
		g = Math.floor(g*g);
		b = Math.floor(b*b);
		if(done)
			c15 = "#"+(r).toString(16).padStart(2,'0') + (g).toString(16).padStart(2,'0') + (b).toString(16).padStart(2,'0');
		if(!done)
			c15 = "#"+(avg).toString(16).padStart(2,'0') + (avg).toString(16).padStart(2,'0') + (avg).toString(16).padStart(2,'0');
	}

	ctx.lineWidth = 0.025 * w;

	if(back || true) {
		ctx.globalAlpha *= 0.25;
		ctx.fillStyle = done ? "green" : "red";
		ctx.fillRect(x, y, w, h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x, y, w, h);
		ctx.globalAlpha *= 4;
	}

	if(name == "joining in") {
		ctx.fillStyle = c0;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "huge rainbow guy") {
		ctx.fillStyle = c15;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "rainbow") {
		ctx.fillStyle = c15;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "rainbow boss") {
		ctx.fillStyle = c15;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "big military guy") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c3;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "rocket shooter") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c3;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "boss with a rocket launcher") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c3;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "big shooting guy") {
		ctx.fillStyle = c14;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "they can shoot?") {
		ctx.fillStyle = c14;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "time to boss, round II") {
		ctx.fillStyle = c14;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "big guy with a sword") {
		ctx.fillStyle = c1;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c2;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "he has a sword?") {
		ctx.fillStyle = c1;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c2;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "boss with a sword") {
		ctx.fillStyle = c1;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c2;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "big red guy") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c0;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "red shooter") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c0;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "red boss") {
		ctx.fillStyle = c10;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c0;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "big guy") {
		ctx.fillStyle = c7;
		ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
	} else if(name == "shoot 'em up") {
		ctx.fillStyle = c7;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
	} else if(name == "time to boss") {
		ctx.fillStyle = c7;
		ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		ctx.strokeStyle = c8;
		ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		drawText(ctx, x + 0.3 * w, y + 0.45 * h, "16", Math.floor(0.2 * w));
	} else if(name == "get a gun") {
		ctx.fillStyle = c9;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		ctx.strokeStyle = c10;
		ctx.lineWidth = 0.05 * w;
		ctx.strokeRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	} else if(name == "fuel up") {
		ctx.fillStyle = c0;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
		ctx.lineWidth = 0.01 * w;
		ctx.strokeStyle = c9;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = c1;
		ctx.fillRect(x + w * 0.55, y + h * 0.15, w * 0.2, h * 0.05);
		drawLine(ctx, x + w * 0.3, y + h * 0.3, x + w * 0.7, y + h * 0.7, c16, 0.05 * w);
		drawLine(ctx, x + w * 0.7, y + h * 0.3, x + w * 0.3, y + h * 0.7, c16, 0.05 * w);
		ctx.fillStyle = c16;
		ctx.fillRect(x + w * 0.45, y + h * 0.45, w * 0.1, h * 0.1);
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
		ctx.fillStyle = c10;
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
	} else if(name == "full inventory") {
		let cols = [c9, c8, c14, c11, c1];
		for(let i = 0; i < 5; i++) {
			for(let j = 0; j < 4; j++) {
				ctx.fillStyle = c3;
				ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 * h * j + 0.1 * h, 0.1 * w, 0.1 * h);
				ctx.fillStyle = cols[(3 * i + 2 * j + i*j) % cols.length];
				ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 * h * j + 0.1 * h, 0.075 * w, 0.075 * h);
			}
		}
	} else if(name == "achievements") {
		let cols = [c0, c1, c2, c3, c7];
		for(let i = 0; i < 5; i++) {
			for(let j = 0; j < 5; j++) {
				ctx.fillStyle = cols[(2*i + j) % cols.length];
				ctx.fillRect(x + 0.15 * w * i + 0.05 * w, y + 0.15 * h * j + 0.05 * h, 0.1 * w, 0.1 * h);
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
			if(ash && !silent) {
				audio_play("data/sfx/achievement_get_1.mp3", 0.1875);
				ash.data.achievements.unshift(name);
			}
			as[i].done = true;
		}
	}
}

function achievements_shower_create(g, ae=null) {
	let ash = {
		x: 50,
		y: 120,
		w: 800,
		h: 50,
		achievements: [],
		attached_to: ae,
		time_since_last_deleted_achievement: 0,
		animstate: 0
	};
	return game_gui_element_create(g, "achievements shower", ash, achievements_shower_update, achievements_shower_draw, achievements_shower_destroy);
}

function achievements_shower_update(ashe, dt) {
	ashe.data.animstate += 0.005 * dt;
	ashe.data.time_since_last_deleted_achievement += dt * (achievement_get(ashe.data.attached_to.data.achievements, "achievements").done ? 1 : 0);
	if(ashe.data.achievements.length < 1)
		ashe.data.time_since_last_deleted_achievement = 0;
	if(ashe.data.time_since_last_deleted_achievement > 10000 / ashe.data.achievements.length || ashe.data.achievements.length > 14) {
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
		achievement_icon_draw(ctx, ashe.data.attached_to.data.achievements, ach, x + 0.125 * size, y + 0.125 * size, 0.75 * size, 0.75 * size,
				false, 50, 50, 1000, 1000, ashe.data.animstate, false);
		ctx.globalAlpha = 1;
	}
}

function achievements_shower_destroy(ashe) {
	if(!ashe || ashe.destroyed)
		return;
	ashe.destroyed = true;
	achievements_destroy(ashe.data.attached_to);
}

function achievement_draw_popup(ctx, ae, ach, x, y, w, h, bbw=1000, bbh=1000) {
	let as = ae.data.achievements;

	let W = bbw * 0.75;
	let H = bbh * 0.35;

	if(x + W > window.innerWidth / get_scale())
		x = x - W;
	if(y + H > window.innerHeight / get_scale())
		y = y - H;

	let lines = [];

	let name = achievement_get(as, ach).name;
	if(ae.game.settings.language == "русский")
		name = achievement_get(as, ach).name_rus;
	lines.push("** " + name + " **");
	lines.push("");

	let desc = achievement_get(as, ach).desc;
	if(ae.game.settings.language == "русский")
		desc = achievement_get(as, ach).desc_rus;

	let fontsize = Math.floor(W / 26);
	let charlim = Math.floor(1.25 * W / fontsize);

	let words = desc.split(' ');
	let line = "";
	for(let i = 0; i < words.length; i++) {
		if((line + words[i]).length > charlim && line.length > 0) {
			lines.push(line);
			line = "";
		}
		line += words[i] + " ";
	}
	lines.push(line);

	ctx.fillStyle = "black";
	ctx.fillRect(x, y, W, H);
	ctx.strokeStyle = "gray";
	ctx.strokeRect(x, y, W, H);

	achievement_icon_draw(ctx, as, ach, x + 0.5 * w, y + 0.5 * h, 2 * w, 2 * h,
		false, 0, 0, window.innerWidth / get_scale(), window.innerHeight / get_scale(), ae.data.animstate);


	for(let i = 0; i < lines.length; i++) {
		drawText(ctx, x + 3 * h, y + h + i * fontsize * 1.25, lines[i], fontsize);
	}
}


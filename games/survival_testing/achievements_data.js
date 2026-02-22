let DEBUG_ACHIEVEMENTS_REGISTRY = true;
let ACHIEVEMENT_REGISTRY = {
	"zoom": {
		grid: {
			x: 0,
			y: 4
		},
		name: {
			en: "zoom",
			ru: "приближение"
		},
		desc: {
			en: "use [+] or [-] to change scale",
			ru: "воспользуйтесь кнопками [+] или [-] для изменения масштаба",
		},
		req: "joining in",
		draw: (ctx, x, y, w, h, p) => {
			ctx.strokeStyle = p.c8;
			ctx.lineWidth = 0.05 * w;
			ctx.beginPath();
			ctx.arc(x + 0.45 * w, y + 0.45 * h, 0.25 * w, 0, Math.PI *
				2);
			ctx.stroke();
			ctx.fillStyle = "rgba(170, 221, 255, 0.3)";
			ctx.fill();
			ctx.strokeStyle = p.c4;
			ctx.lineWidth = 0.08 * w;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(x + 0.65 * w, y + 0.65 * h);
			ctx.lineTo(x + 0.85 * w, y + 0.85 * h);
			ctx.stroke();
			ctx.strokeStyle = p.c0;
			ctx.lineWidth = 0.04 * w;
			ctx.beginPath();
			ctx.moveTo(x + 0.35 * w, y + 0.45 * h);
			ctx.lineTo(x + 0.55 * w, y + 0.45 * h);
			ctx.moveTo(x + 0.45 * w, y + 0.35 * h);
			ctx.lineTo(x + 0.45 * w, y + 0.55 * h);
			ctx.stroke();
		}
	},
	"bossifier": {
		grid: {
			x: 3,
			y: 2
		},
		name: {
			en: "bossifier",
			ru: "боссификатор"
		},
		desc: {
			en: "find a bossifier to bossify the enemies; it drops from the respective enemy type",
			ru: "найдите боссификатор; он позволяет превращать врагов в боссов и выпадает с противников соответствующего типа"
		},
		req: "shoot 'em up",
		draw: (ctx, x, y, w, h, p) => {
			if (p.c0 === "black") {
				const grayIcon = get_bossifier_gray_icon(ctx, w, h);
				ctx.drawImage(grayIcon, x, y, w, h);
			}
			else {
				item_draw_bossifier_icon(ctx, x, y, w, h, p.animstate ||
					0, "regular");
			}
		}
	},
	"joining in": {
		grid: {
			x: 0,
			y: 0
		},
		name: {
			en: "joining in",
			ru: "к бою"
		},
		desc: {
			en: "launch the game",
			ru: "запустите игру"
		},
		req: null,
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c0;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"achievements": {
		grid: {
			x: 0,
			y: 1
		},
		name: {
			en: "what should I do?",
			ru: "что мне делать?"
		},
		desc: {
			mobile: {
				en: "open tasks menu using the gold cup button",
				ru: "откройте меню заданий, нажав на кнопку с кубком"
			},
			pc: {
				en: "open tasks menu using J or R",
				ru: "откройте меню заданий, нажав J или R"
			}
		},
		req: "joining in",
		draw: (ctx, x, y, w, h, p) => {
			let cols = [p.c0, p.c1, p.c2, p.c3, p.c7];
			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 5; j++) {
					ctx.fillStyle = cols[(2 * i + j) % cols.length];
					ctx.fillRect(x + 0.15 * w * i + 0.05 * w, y + 0.15 *
						h * j + 0.05 * h, 0.1 * w, 0.1 * h);
				}
			}
		}
	},
	"discovering inventory": {
		grid: {
			x: 0,
			y: 2
		},
		name: {
			en: "discovering inventory",
			ru: "открытие инвентаря"
		},
		desc: {
			mobile: {
				en: "open inventory by tapping the backpack icon",
				ru: "откройте инвентарь, нажав на иконку рюкзака"
			},
			pc: {
				en: "discover inventory by pressing E or I",
				ru: "откройте инвентарь, нажав E или I"
			}
		},
		req: "joining in",
		draw: (ctx, x, y, w, h, p) => {
			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 4; j++) {
					ctx.fillStyle = p.c3;
					ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 *
						h * j + 0.1 * h, 0.1 * w, 0.1 * h);
				}
			}
		}
	},
	"full inventory": {
		grid: {
			x: 0,
			y: 3
		},
		name: {
			en: "full inventory",
			ru: "полный инвентарь"
		},
		desc: {
			mobile: {
				en: "fill up the inventory with items fully; hint: press item in the inventory then press DROP to drop it",
				ru: "полностью заполните инвентарь предметами; подсказка: нажмите на предмет в инвентаре, а затем на кнопку DROP, чтобы выбросить его"
			},
			pc: {
				en: "fill up the inventory with items fully; hint: use Q to drop an item from the inventory",
				ru: "полностью заполните инвентарь предметами; подсказка: используйте Q, чтобы выбросить предмет из инвентаря"
			}
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			let cols = [p.c9, p.c8, p.c14, p.c11, p.c1];
			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 4; j++) {
					ctx.fillStyle = p.c3;
					ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 *
						h * j + 0.1 * h, 0.1 * w, 0.1 * h);
					ctx.fillStyle = cols[(3 * i + 2 * j + i * j) % cols
						.length];
					ctx.fillRect(x + 0.15 * w * i + 0.1 * w, y + 0.15 *
						h * j + 0.1 * h, 0.075 * w, 0.075 * h);
				}
			}
		}
	},
	"first steps": {
		grid: {
			x: 1,
			y: 0
		},
		name: {
			en: "first steps",
			ru: "первые шаги"
		},
		desc: {
			mobile: {
				en: "make first steps using the left joystick",
				ru: "совершите первые шаги, используя левый джойстик"
			},
			pc: {
				en: "make first steps using WASD",
				ru: "совершите первые шаги, используя WASD"
			}
		},
		req: "joining in",
		draw: (ctx, x, y, w, h, p) => {
			drawLine(ctx, x + w * 0.05, y + h * 0.35, x + w * 0.5, y +
				h * 0.35, p.c4, w * 0.05);
			drawLine(ctx, x + w * 0.05, y + h * 0.5, x + w * 0.5, y +
				h * 0.5, p.c4, w * 0.05);
			drawLine(ctx, x + w * 0.05, y + h * 0.65, x + w * 0.5, y +
				h * 0.65, p.c4, w * 0.05);
			ctx.fillStyle = p.c0;
			ctx.fillRect(x + 0.3 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.3 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"outside the box": {
		grid: {
			x: 1,
			y: 1
		},
		name: {
			en: "outside the box",
			ru: "по ту сторону"
		},
		desc: {
			en: "leave the current level",
			ru: "покиньте текущий уровень, выйдя за его пределы"
		},
		req: "first steps",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.fillStyle = p.c0;
			ctx.fillRect(x + 0.7 * w, y + 0.3 * h, 0.2 * w, 0.2 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.7 * w, y + 0.3 * h, 0.2 * w, 0.2 * h);
		}
	},
	"get a ride": {
		grid: {
			x: 1,
			y: 2
		},
		name: {
			en: "get a ride",
			ru: "поехали"
		},
		desc: {
			mobile: {
				en: "get a ride in the car by standing close to it and pressing PICK UP / CAR",
				ru: "сядьте в автомобиль, подойдя к нему и нажав кнопку PICK UP / CAR"
			},
			pc: {
				en: "get a ride in the car by standing close to it and pressing F or SPACE",
				ru: "сядьте в автомобиль, подойдя к нему и нажав F или SPACE"
			}
		},
		req: "outside the box",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c5;
			ctx.fillRect(x + 0.3 * w, y + 0.1 * h, 0.4 * w, 0.8 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.3 * w, y + 0.1 * h, 0.4 * w, 0.8 * h);
		}
	},
	"pick an item": {
		grid: {
			x: 2,
			y: 0
		},
		name: {
			en: "pick an item",
			ru: "подобрать предмет"
		},
		desc: {
			mobile: {
				en: "pick up an item by standing close to it and pressing PICK UP",
				ru: "подберите предмет, подойдя к нему и нажав кнопку PICK UP"
			},
			pc: {
				en: "pick up an item by standing close to it and pressing F or SPACE",
				ru: "подберите предмет, подойдя к нему и нажав F или SPACE"
			}
		},
		req: "outside the box",
		draw: (ctx, x, y, w, h, p) => {
			let N = 4;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = p.c1;
				ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y +
					0.25 * h, 0.5 * w / N, 0.5 * h);
				ctx.fillStyle = p.c6;
				ctx.fillRect(x + i * w / N + 0.5 * 0.5 * w / N, y +
					0.25 * h, 0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = p.c6;
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.5 * 0.5 * w / N, y +
					0.25 * h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	"yummy": {
		grid: {
			x: 2,
			y: 1
		},
		name: {
			en: "yummy",
			ru: "вкусняшка"
		},
		desc: {
			mobile: {
				en: "eat any food by selecting it and pressing USE",
				ru: "употребите в пищу любую еду, выбрав её и нажав USE"
			},
			pc: {
				en: "eat any food: select it in inventory and left-click on your character",
				ru: "съешьте любую еду: выберите её в инвентаре, переместите к персонажу и нажмите ЛКМ"
			}
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			ctx.fillStyle = p.c11;
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		}
	},
	"stay hydrated": {
		grid: {
			x: 2,
			y: 2
		},
		name: {
			en: "stay hydrated",
			ru: "водный баланс"
		},
		desc: {
			mobile: {
				en: "drink any liquid by selecting it and pressing USE",
				ru: "выпейте любую жидкость, выбрав её и нажав USE"
			},
			pc: {
				en: "drink any liquid: select it in inventory and left-click on your character",
				ru: "выпейте любую жидкость: выберите её в инвентаре, поднесите курсор к игроку и нажмите ЛКМ"
			}
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
			ctx.fillStyle = p.c12;
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	"healthy lifestyle": {
		grid: {
			x: 2,
			y: 3
		},
		name: {
			en: "healthy lifestyle",
			ru: "здоровый образ жизни"
		},
		desc: {
			mobile: {
				en: "use a health pack by selecting it and pressing USE",
				ru: "используйте аптечку, выбрав её и нажав USE"
			},
			pc: {
				en: "use health pack: select it in inventory and left-click on your character",
				ru: "используйте аптечку: выберите её в инвентаре, поднесите курсор к игроку и нажмите ЛКМ"
			}
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c8;
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillStyle = p.c13;
			ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
			ctx.strokeStyle = p.c13;
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	"fuel up": {
		grid: {
			x: 1,
			y: 3
		},
		name: {
			en: "fuel up",
			ru: "заправка"
		},
		desc: {
			mobile: {
				en: "use gasoline to refuel a car by standing close to it pressing USE",
				ru: "используйте канистру, чтобы заправить автомобиль через кнопку USE, стоя рядом с ним"
			},
			pc: {
				en: "use gasoline to refuel a car by standing close to it and pressing left mouse button",
				ru: "воспользуйтесь бензином, чтобы заправить автомобиль; для этого подойдите к нему с топливом в руках и нажмите ЛКМ"
			}
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c0;
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
			ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
			ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
			ctx.lineWidth = 0.01 * w;
			ctx.strokeStyle = p.c9;
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillStyle = p.c1;
			ctx.fillRect(x + w * 0.55, y + h * 0.15, w * 0.2, h * 0.05);
			drawLine(ctx, x + w * 0.3, y + h * 0.3, x + w * 0.7, y + h *
				0.7, p.c16, 0.05 * w);
			drawLine(ctx, x + w * 0.7, y + h * 0.3, x + w * 0.3, y + h *
				0.7, p.c16, 0.05 * w);
			ctx.fillStyle = p.c16;
			ctx.fillRect(x + w * 0.45, y + h * 0.45, w * 0.1, h * 0.1);
		}
	},
	"get a gun": {
		grid: {
			x: 3,
			y: 0
		},
		name: {
			en: "get a gun",
			ru: "получить оружие"
		},
		desc: {
			en: "find a gun and pick it up",
			ru: "найдите и подберите любое огнестрельное оружие"
		},
		req: "pick an item",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = "#000";
			ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
			ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05);
		}
	},
	"need for ammo": {
		grid: {
			x: 3,
			y: 1
		},
		name: {
			en: "need for ammo",
			ru: "нужны патроны"
		},
		desc: {
			mobile: {
				en: "try shooting with the right joystick without having any ammo",
				ru: "попробуйте выстрелить, используя правый джойстик, при отсутствии патронов"
			},
			pc: {
				en: "try shooting a gun without having any ammo for it",
				ru: "попробуйте выстрелить из оружия, не имея к нему подходящих патронов"
			}
		},
		req: "get a gun",
		draw: (ctx, x, y, w, h, p) => {
			let N = 4;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = p.c1;
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = p.c6;
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = p.c6;
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
			ctx.fillStyle = "#000";
			ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
			ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05);
		}
	},
	"shoot 'em up": {
		grid: {
			x: 4,
			y: 0
		},
		name: {
			en: "shoot 'em up",
			ru: "зомби-шутер"
		},
		desc: {
			en: "kill an enemy by shooting at it",
			ru: "убейте врага, выстрелив в него"
		},
		req: "get a gun",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c7;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"they can shoot?": {
		grid: {
			x: 4,
			y: 1
		},
		name: {
			en: "they can shoot?",
			ru: "они умеют стрелять?"
		},
		desc: {
			en: "kill the first shooting enemy",
			ru: "убейте первого стреляющего врага"
		},
		req: "big guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c14;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"red shooter": {
		grid: {
			x: 4,
			y: 2
		},
		name: {
			en: "red shooter",
			ru: "красный стрелок"
		},
		desc: {
			en: "kill one red shooter",
			ru: "убейте одного красного стрелка"
		},
		req: "big shooting guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c0;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"he has a sword?": {
		grid: {
			x: 4,
			y: 3
		},
		name: {
			en: "he has a sword?",
			ru: "у него меч?"
		},
		desc: {
			en: "kill one yellow enemy",
			ru: "убейте одного противника с мечом"
		},
		req: "big red guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c1;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c2;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"rocket shooter": {
		grid: {
			x: 4,
			y: 4
		},
		name: {
			en: "rocket shooter",
			ru: "стрелок с ракетницей"
		},
		desc: {
			en: "kill one rocket shooting enemy",
			ru: "убейте одного врага, стреляющего ракетами"
		},
		req: "big guy with a sword",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c3;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"rainbow": {
		grid: {
			x: 4,
			y: 5
		},
		name: {
			en: "rainbow",
			ru: "радуга"
		},
		desc: {
			en: "kill one rainbow enemy",
			ru: "убейте одного радужного противника"
		},
		req: "big military guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c15;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"big guy": {
		grid: {
			x: 5,
			y: 0
		},
		name: {
			en: "big guy",
			ru: "большой парень"
		},
		desc: {
			en: "kill the boss",
			ru: "убейте босса"
		},
		req: "shoot 'em up",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c7;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big shooting guy": {
		grid: {
			x: 5,
			y: 1
		},
		name: {
			en: "big shooting guy",
			ru: "большой стрелок"
		},
		desc: {
			en: "kill a shooting boss",
			ru: "убейте стреляющего босса"
		},
		req: "big guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c14;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big red guy": {
		grid: {
			x: 5,
			y: 2
		},
		name: {
			en: "big red guy",
			ru: "большой красный парень"
		},
		desc: {
			en: "kill red boss",
			ru: "убейте красного босса"
		},
		req: "big shooting guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c0;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big guy with a sword": {
		grid: {
			x: 5,
			y: 3
		},
		name: {
			en: "big guy with a sword",
			ru: "большой парень с мечом"
		},
		desc: {
			en: "kill yellow boss",
			ru: "убейте желтого босса"
		},
		req: "big red guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c1;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c2;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big military guy": {
		grid: {
			x: 5,
			y: 4
		},
		name: {
			en: "big military guy",
			ru: "большой военный парень"
		},
		desc: {
			en: "kill the boss with a rocket launcher",
			ru: "убейте босса с ракетницей"
		},
		req: "big guy with a sword",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c10;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"huge rainbow guy": {
		grid: {
			x: 5,
			y: 5
		},
		name: {
			en: "huge rainbow guy",
			ru: "гигантский радужный парень"
		},
		desc: {
			en: "kill the rainbow boss",
			ru: "убейте радужного босса"
		},
		req: "big military guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c15;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c8;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"desert heat": {
		grid: {
			x: 6,
			y: 0
		},
		name: {
			en: "desert heat",
			ru: "пустынная жара"
		},
		desc: {
			en: "kill one desert dweller",
			ru: "убейте одного пустынного жителя"
		},
		req: "desert biome",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c21;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c22;
			ctx.lineWidth = 2;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"sand lord": {
		grid: {
			x: 7,
			y: 0
		},
		name: {
			en: "sand lord",
			ru: "повелитель песков"
		},
		desc: {
			en: "kill the desert boss",
			ru: "убейте пустынного босса"
		},
		req: "desert heat",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c21;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c20;
			ctx.lineWidth = 3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"desert biome": {
		grid: {
			x: 1,
			y: 4
		},
		name: {
			en: "desert",
			ru: "пустыня"
		},
		desc: {
			en: "discover the desert biome",
			ru: "найдите биом пустыни"
		},
		req: "big guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c6;
			ctx.beginPath();
			ctx.moveTo(x + 0.1 * w, y + 0.8 * h);
			ctx.quadraticCurveTo(x + 0.3 * w, y + 0.4 * h, x + 0.5 * w,
				y + 0.7 * h);
			ctx.quadraticCurveTo(x + 0.7 * w, y + 0.3 * h, x + 0.9 * w,
				y + 0.8 * h);
			ctx.lineTo(x + 0.1 * w, y + 0.8 * h);
			ctx.fill();
			ctx.strokeStyle = p.c8;
			ctx.stroke();
			ctx.fillStyle = p.c1;
			ctx.arc(x + 0.8 * w, y + 0.2 * h, 0.1 * w, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	"ancient mummy": {
		grid: {
			x: 6,
			y: 1
		},
		name: {
			en: "ancient curse",
			ru: "древнее проклятие"
		},
		desc: {
			en: "kill one ancient mummy",
			ru: "убейте одну древнюю мумию"
		},
		req: "sand lord",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c21;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c22;
			ctx.lineWidth = 2;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.beginPath();
			ctx.strokeStyle = p.c10;
			for (let i = 1; i < 4; i++) {
				ctx.moveTo(x + 0.2 * w, y + (0.2 + i * 0.15) * h);
				ctx.lineTo(x + 0.8 * w, y + (0.2 + i * 0.15) * h);
			}
			ctx.stroke();
		}
	},
	"desert shadow": {
		grid: {
			x: 6,
			y: 2
		},
		name: {
			en: "elusive shadow",
			ru: "неуловимая тень"
		},
		desc: {
			en: "kill one desert shadow",
			ru: "убейте одну пустынную тень"
		},
		req: "big mummy guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c9;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c8;
			ctx.setLineDash([w * 0.05, w * 0.05]);
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.setLineDash([]);
		}
	},
	"anubis kill": {
		grid: {
			x: 6,
			y: 3
		},
		name: {
			en: "trial of anubis",
			ru: "испытание Анубиса"
		},
		desc: {
			en: "defeat the guardian of the sands",
			ru: "победите стража песков"
		},
		req: "big shadow guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c9;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c20;
			ctx.lineWidth = 2;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"big mummy guy": {
		grid: {
			x: 7,
			y: 1
		},
		name: {
			en: "pharaoh's wrath",
			ru: "гнев фараона"
		},
		desc: {
			en: "kill the boss mummy",
			ru: "убейте босса-мумию"
		},
		req: "ancient mummy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c21;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c4;
			ctx.lineWidth = 3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big shadow guy": {
		grid: {
			x: 7,
			y: 2
		},
		name: {
			en: "nightmare stalker",
			ru: "кошмарный преследователь"
		},
		desc: {
			en: "kill the boss shadow",
			ru: "убейте босса-тень"
		},
		req: "desert shadow",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c9;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c5;
			ctx.lineWidth = 3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"big anubis guy": {
		grid: {
			x: 7,
			y: 3
		},
		name: {
			en: "god of death",
			ru: "бог смерти"
		},
		desc: {
			en: "kill the boss Anubis",
			ru: "убейте босса Анубиса"
		},
		req: "anubis kill",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c9;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c20;
			ctx.lineWidth = 4;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"christmas is cancelled": {
		grid: {
			x: 9,
			y: 3
		},
		name: {
			en: "christmas is cancelled",
			ru: "рождество отменяется"
		},
		desc: {
			en: "kill the boss Krampus",
			ru: "убейте истинного Крампуса"
		},
		req: "naughty list",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = "#1a0f0a";
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = "#8b0000";
			ctx.lineWidth = 4;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"taiga biome": {
		grid: {
			x: 1,
			y: 5
		},
		name: {
			en: "taiga",
			ru: "тайга"
		},
		desc: {
			en: "discover the taiga biome",
			ru: "найдите биом тайги"
		},
		req: "sand lord",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c28;
			ctx.fillRect(x + 0.1 * w, y + 0.7 * h, 0.8 * w, 0.1 * h);
			ctx.fillStyle = p.c14;
			const drawTree = (tx, ty, ts) => {
				ctx.beginPath();
				ctx.moveTo(tx, ty);
				ctx.lineTo(tx - 0.15 * w * ts, ty + 0.3 * h * ts);
				ctx.lineTo(tx + 0.15 * w * ts, ty + 0.3 * h * ts);
				ctx.closePath();
				ctx.fill();
			};
			drawTree(x + 0.35 * w, y + 0.35 * h, 1.2);
			drawTree(x + 0.65 * w, y + 0.45 * h, 0.9);
			ctx.strokeStyle = p.c12;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x + 0.3 * w, y + 0.55 * h);
			ctx.lineTo(x + 0.4 * w, y + 0.55 * h);
			ctx.stroke();
			ctx.fillStyle = p.c13;
			ctx.beginPath();
			ctx.arc(x + 0.2 * w, y + 0.25 * h, 0.08 * w, 0, Math.PI *
				2);
			ctx.fill();
		}
	},
	"cold welcome": {
		grid: {
			x: 8,
			y: 0
		},
		name: {
			en: "cold welcome",
			ru: "снежный гость"
		},
		desc: {
			en: "kill one snow infected",
			ru: "убейте одного снежного заражённого"
		},
		req: "taiga biome",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c12;
			ctx.fillRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
			ctx.strokeStyle = p.c13;
			ctx.lineWidth = 2;
			ctx.strokeRect(x + 0.2 * w, y + 0.2 * h, 0.6 * w, 0.6 * h);
		}
	},
	"big snow guy": {
		grid: {
			x: 9,
			y: 0
		},
		name: {
			en: "big snow guy",
			ru: "большой сугроб"
		},
		desc: {
			en: "kill the snow boss",
			ru: "убейте босса снежных заражённых"
		},
		req: "cold welcome",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c12;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c22;
			ctx.lineWidth = 3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"ear protection": {
		grid: {
			x: 8,
			y: 1
		},
		name: {
			en: "ear protection",
			ru: "уши в тепле"
		},
		desc: {
			en: "kill one infected in ushanka",
			ru: "убейте одного заражённого в ушанке"
		},
		req: "big snow guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c5;
			ctx.fillRect(x + 0.2 * w, y + 0.3 * h, 0.6 * w, 0.3 * h);
			ctx.fillRect(x + 0.15 * w, y + 0.3 * h, 0.15 * w, 0.4 * h);
			ctx.fillRect(x + 0.7 * w, y + 0.3 * h, 0.15 * w, 0.4 * h);
			ctx.fillStyle = p.c0;
			ctx.fillRect(x + 0.45 * w, y + 0.4 * h, 0.1 * w, 0.1 * h);
		}
	},
	"general ushanka": {
		grid: {
			x: 9,
			y: 1
		},
		name: {
			en: "general ushanka",
			ru: "генерал ушанка"
		},
		desc: {
			en: "kill the boss in ushanka",
			ru: "убейте элитного заражённого в ушанке"
		},
		req: "ear protection",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c12;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c5;
			ctx.lineWidth = 4;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"meltdown": {
		grid: {
			x: 8,
			y: 2
		},
		name: {
			en: "meltdown",
			ru: "оттепель"
		},
		desc: {
			en: "kill one evil snowman",
			ru: "убейте одного проклятого снеговика"
		},
		req: "general ushanka",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c28;
			ctx.fillRect(x + 0.35 * w, y + 0.5 * h, 0.3 * w, 0.3 * h);
			ctx.fillRect(x + 0.4 * w, y + 0.3 * h, 0.2 * w, 0.2 * h);
			ctx.fillStyle = p.c6;
			ctx.fillRect(x + 0.55 * w, y + 0.35 * h, 0.2 * w, 0.05 * h);
		}
	},
	"true winter": {
		grid: {
			x: 9,
			y: 2
		},
		name: {
			en: "true winter",
			ru: "настоящая зима"
		},
		desc: {
			en: "kill the boss snowman",
			ru: "убейте снеговика-босса"
		},
		req: "meltdown",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c28;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c4;
			ctx.lineWidth = 3;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
	"naughty list": {
		grid: {
			x: 8,
			y: 3
		},
		name: {
			en: "naughty list",
			ru: "список плохишей"
		},
		desc: {
			en: "defeat Krampus",
			ru: "одолейте Крампуса"
		},
		req: "true winter",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c16;
			ctx.fillRect(x + 0.2 * w, y + 0.3 * h, 0.6 * w, 0.5 * h);
			ctx.fillStyle = p.c11;
			ctx.fillRect(x + 0.3 * w, y + 0.2 * h, 0.4 * w, 0.2 * h);
			ctx.strokeStyle = p.c11;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x + 0.3 * w, y + 0.2 * h);
			ctx.lineTo(x + 0.2 * w, y + 0.1 * h);
			ctx.moveTo(x + 0.7 * w, y + 0.2 * h);
			ctx.lineTo(x + 0.8 * w, y + 0.1 * h);
			ctx.stroke();
		}
	},
	"blood forest biome": {
		grid: {
			x: 1,
			y: 6
		},
		name: {
			en: "blood forest",
			ru: "кровавый лес"
		},
		desc: {
			en: "discover the blood forest biome",
			ru: "найдите биом кровавого леса"
		},
		req: "big snow guy",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c22;
			ctx.fillRect(x + 0.1 * w, y + 0.75 * h, 0.8 * w, 0.15 * h);
			const drawDeadTree = (tx, ty, height) => {
				ctx.strokeStyle = p.c25;
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(tx, ty);
				ctx.lineTo(tx, ty - height);
				ctx.lineTo(tx - 0.1 * w, ty - height - 0.1 * h);
				ctx.moveTo(tx, ty - height);
				ctx.lineTo(tx + 0.1 * w, ty - height - 0.05 * h);
				ctx.stroke();
			};
			drawDeadTree(x + 0.4 * w, y + 0.8 * h, 0.4 * h);
			drawDeadTree(x + 0.7 * w, y + 0.8 * h, 0.3 * h);
			ctx.fillStyle = p.c0;
			ctx.beginPath();
			ctx.arc(x + 0.3 * w, y + 0.3 * h, 0.12 * w, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	"christmas is cancelled": {
		grid: {
			x: 9,
			y: 3
		},
		name: {
			en: "christmas is cancelled",
			ru: "рождество отменяется"
		},
		desc: {
			en: "kill the boss Krampus",
			ru: "убейте истинного Крампуса"
		},
		req: "naughty list",
		draw: (ctx, x, y, w, h, p) => {
			ctx.fillStyle = p.c11;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.strokeStyle = p.c16;
			ctx.lineWidth = 4;
			ctx.strokeRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
		}
	},
};
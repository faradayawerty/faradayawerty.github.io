let ITEMS_DATA = {
	[ITEM_PUMPKIN]: {
		name: "Pumpkin",
		name_rus: "Тыква",
		desc: "The grin is wider than any human's, and the stench of rotting soul lingers within.",
		desc_rus: "Ухмылка шире человеческой, а изнутри доносится тяжелый запах тлеющей души.",
		render: (ctx, x, y, w, h) => {
			const pumpkinBody = "#E67E22";
			const pumpkinStroke = "#A04000";
			const pumpkinBlack = "#1a1a1a";
			const stemGreen = "#2E7D32";
			const stemStroke = "#1B5E20";
			const strokeWidth = w * 0.04;
			ctx.save();
			ctx.fillStyle = stemGreen;
			ctx.strokeStyle = stemStroke;
			ctx.lineWidth = strokeWidth;
			ctx.beginPath();
			ctx.rect(x + w * 0.45, y + h * 0.1, w * 0.1, h * 0.15);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = pumpkinBody;
			ctx.strokeStyle = pumpkinStroke;
			ctx.beginPath();
			ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.35, h * 0.3, 0,
				0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(x + w * 0.5, y + h * 0.55, w * 0.15, h * 0.3, 0,
				0, Math.PI * 2);
			ctx.stroke();
			ctx.fillStyle = pumpkinBlack;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.3, y + h * 0.35);
			ctx.lineTo(x + w * 0.48, y + h * 0.45);
			ctx.lineTo(x + w * 0.32, y + h * 0.5);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(x + w * 0.7, y + h * 0.35);
			ctx.lineTo(x + w * 0.52, y + h * 0.45);
			ctx.lineTo(x + w * 0.68, y + h * 0.5);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(x + w * 0.5, y + h * 0.48);
			ctx.lineTo(x + w * 0.46, y + h * 0.55);
			ctx.lineTo(x + w * 0.54, y + h * 0.55);
			ctx.fill();
			y = y - 0.1 * h;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.25, y + h * 0.65);
			ctx.lineTo(x + w * 0.35, y + h * 0.75);
			ctx.lineTo(x + w * 0.42, y + h * 0.67);
			ctx.lineTo(x + w * 0.5, y + h * 0.77);
			ctx.lineTo(x + w * 0.58, y + h * 0.67);
			ctx.lineTo(x + w * 0.65, y + h * 0.75);
			ctx.lineTo(x + w * 0.75, y + h * 0.65);
			ctx.lineTo(x + w * 0.65, y + h * 0.83);
			ctx.lineTo(x + w * 0.58, y + h * 0.73);
			ctx.lineTo(x + w * 0.5, y + h * 0.9);
			ctx.lineTo(x + w * 0.42, y + h * 0.73);
			ctx.lineTo(x + w * 0.35, y + h * 0.83);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	},
	[ITEM_SHIELD_GRAY]: {
		name: "Gray shield",
		desc: "technical item. not in the game",
		name_rus: "Серый щит",
		desc_rus: "Технический предмет. Не в игре",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.ui.achievements.palette;
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, c
				.gray_mid,
				"white", 0.05 * w);
		}
	},
	[ITEM_MONEY]: {
		name: "Money",
		desc: "Useless paper scraps in a world without shops.",
		name_rus: "Деньги",
		desc_rus: "Просто крашеная бумага. Зомби не дают сдачи.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.money;
			ctx.fillStyle = c.fill;
			ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			ctx.strokeStyle = c.stroke;
			ctx.lineWidth = 0.05 * w;
			ctx.strokeRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			drawCircle(ctx, x + w * 0.5, y + h * 0.5, w * 0.1,
				c.icon, c.icon, w * 0.025);
		}
	},
	[ITEM_APPLE_CORE]: {
		name: "Apple Core",
		desc: "Someone already ate the good part.",
		name_rus: "Огрызок",
		desc_rus: "Кто-то уже съел все вкусное.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.apple_core;
			ctx.fillStyle = c.body;
			ctx.beginPath();
			ctx.ellipse(x + 0.5 * w, y + 0.5 * h, 0.08 * w, 0.2 * h, 0,
				0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = c.bit;
			ctx.fillRect(x + 0.4 * w, y + 0.3 * h, 0.2 * w, 0.05 * h);
			ctx.fillRect(x + 0.4 * w, y + 0.65 * h, 0.2 * w, 0.05 * h);
			drawLine(ctx, x + 0.5 * w, y + 0.3 * h, x + 0.5 * w, y +
				0.15 * h, c.stick, 0.03 * w);
		}
	},
	[ITEM_FISH_BONE]: {
		name: "Fish Bone",
		desc: "Leftovers from a meal.",
		name_rus: "Рыбья кость",
		desc_rus: "Остатки чьего-то обеда.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.fish_bone;
			ctx.strokeStyle = c.color;
			ctx.lineWidth = 0.05 * w;
			drawLine(ctx, x + 0.2 * w, y + 0.5 * h, x + 0.8 * w, y +
				0.5 * h, c.color);
			for (let i = 0; i < 4; i++) {
				drawLine(ctx, x + (0.3 + i * 0.15) * w, y + 0.35 * h,
					x + (0.3 + i * 0.15) * w, y + 0.65 * h,
					c.color);
			}
			ctx.fillStyle = c.color;
			ctx.beginPath();
			ctx.moveTo(x + 0.8 * w, y + 0.5 * h);
			ctx.lineTo(x + 0.95 * w, y + 0.35 * h);
			ctx.lineTo(x + 0.95 * w, y + 0.65 * h);
			ctx.fill();
		}
	},
	[ITEM_EMPTY_BOTTLE]: {
		name: "Empty Bottle",
		desc: "Could be recycled or filled.",
		name_rus: "Пустая бутылка",
		desc_rus: "Можно переработать или наполнить.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.bottle;
			ctx.fillStyle = c.body;
			ctx.strokeStyle = c.stroke;
			ctx.lineWidth = 1;
			ctx.fillRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
			ctx.fillRect(x + 0.42 * w, y + 0.15 * h, 0.15 * w, 0.15 *
				h);
			ctx.strokeRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
		}
	},
	[ITEM_TIN_CAN]: {
		name: "Tin Can",
		desc: "Sharp edges, be careful.",
		name_rus: "Консервная банка",
		desc_rus: "Острые края, будь осторожен.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.can;
			let cx = x + 0.5 * w,
				cy = y + 0.5 * h;
			ctx.fillStyle = c.body;
			ctx.fillRect(x + 0.3 * w, y + 0.35 * h, 0.4 * w, 0.4 * h);
			ctx.strokeStyle = c.stripe;
			ctx.lineWidth = 1;
			drawLine(ctx, x + 0.3 * w, y + 0.45 * h, x + 0.7 * w, y +
				0.45 * h, c.stripe);
			drawLine(ctx, x + 0.3 * w, y + 0.55 * h, x + 0.7 * w, y +
				0.55 * h, c.stripe);
			drawLine(ctx, x + 0.3 * w, y + 0.65 * h, x + 0.7 * w, y +
				0.65 * h, c.stripe);
			ctx.fillStyle = c.body;
			ctx.beginPath();
			ctx.ellipse(cx, y + 0.75 * h, 0.2 * w, 0.05 * h, 0, 0, Math
				.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = c.inside;
			ctx.beginPath();
			ctx.ellipse(cx, y + 0.35 * h, 0.2 * w, 0.05 * h, 0, 0, Math
				.PI * 2);
			ctx.fill();
			ctx.strokeStyle = c.reflection;
			ctx.stroke();
			ctx.fillStyle = c.lid;
			ctx.beginPath();
			ctx.ellipse(x + 0.35 * w, y + 0.25 * h, 0.15 * w, 0.04 * h,
				-Math.PI / 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		}
	},
	[ITEM_OLD_SHOE]: {
		name: "Old Shoe",
		desc: "The sole is falling off.",
		name_rus: "Старый ботинок",
		desc_rus: "Подошва вот-вот отвалится.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.shoe;
			ctx.fillStyle = c.body;
			ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.6 * w, 0.2 * h);
			ctx.fillRect(x + 0.2 * w, y + 0.3 * h, 0.3 * w, 0.4 * h);
		}
	},
	[ITEM_BENT_FORK]: {
		name: "Bent Fork",
		desc: "Useless for eating.",
		name_rus: "Гнутая вилка",
		desc_rus: "Бесполезна для еды.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.fork;
			ctx.strokeStyle = c.color;
			ctx.lineWidth = 2;
			drawLine(ctx, x + 0.5 * w, y + 0.8 * h, x + 0.5 * w, y +
				0.4 * h, c.color);
			drawLine(ctx, x + 0.4 * w, y + 0.2 * h, x + 0.4 * w, y +
				0.4 * h, c.color);
			drawLine(ctx, x + 0.6 * w, y + 0.1 * h, x + 0.6 * w, y +
				0.4 * h, c.color);
		}
	},
	[ITEM_CRUMPLED_PAPER]: {
		name: "Crumpled Paper",
		desc: "Indecipherable scribbles.",
		name_rus: "Ком мятой бумаги",
		desc_rus: "Неразборчивые каракули.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.crumpled_paper;
			ctx.fillStyle = c.body;
			ctx.strokeStyle = c.stroke;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x + 0.3 * w, y + 0.3 * h);
			ctx.lineTo(x + 0.5 * w, y + 0.25 * h);
			ctx.lineTo(x + 0.7 * w, y + 0.4 * h);
			ctx.lineTo(x + 0.65 * w, y + 0.7 * h);
			ctx.lineTo(x + 0.4 * w, y + 0.75 * h);
			ctx.lineTo(x + 0.25 * w, y + 0.5 * h);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			drawLine(ctx, x + 0.4 * w, y + 0.4 * h, x + 0.6 * w, y +
				0.5 * h, c.line, 1);
		}
	},
	[ITEM_DEAD_BATTERY]: {
		name: "Dead Battery",
		desc: "No power left in this one.",
		name_rus: "Севшая батарейка",
		desc_rus: "В ней не осталось энергии.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.battery;
			ctx.fillStyle = c.body;
			ctx.fillRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
			ctx.fillStyle = c.bottom;
			ctx.fillRect(x + 0.35 * w, y + 0.7 * h, 0.3 * w, 0.1 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + 0.45 * w, y + 0.22 * h, 0.1 * w, 0.08 * h);
			drawLine(ctx, x + 0.42 * w, y + 0.55 * h, x + 0.58 * w, y +
				0.55 * h, c.minus, 2);
		}
	},
	default: {
		name: "Unknown",
		desc: "???",
		name_rus: "Неизвестно",
		desc_rus: "???",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.unknown;
			ctx.fillStyle = c.bg;
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.fillStyle = c.accent;
			ctx.fillRect(x + 0.5 * w, y + 0.1 * h, 0.4 * w, 0.4 * h);
			ctx.fillRect(x + 0.1 * w, y + 0.5 * h, 0.4 * w, 0.4 * h);
		}
	},
	[ITEM_DIARY]: {
		name: "Survivor's Diary",
		desc: "A tattered notebook filled with sketches and observations.",
		name_rus: "Дневник выжившего",
		desc_rus: "Потрепанная тетрадь, полная набросков и наблюдений.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.diary;
			ctx.fillStyle = c.cover;
			ctx.fillRect(x + 0.2 * w, y + 0.15 * h, 0.6 * w, 0.7 * h);
			ctx.fillStyle = c.spine;
			ctx.fillRect(x + 0.2 * w, y + 0.15 * h, 0.1 * w, 0.7 * h);
			ctx.strokeStyle = c.lines;
			ctx.lineWidth = 1;
			for (let i = 0; i < 3; i++) {
				drawLine(ctx, x + 0.35 * w, y + (0.3 + i * 0.15) * h,
					x + 0.7 * w, y + (0.3 + i * 0.15) * h, c.lines
				);
			}
		}
	},
	[ITEM_SURVIVOR_NOTE]: {
		name: "Survivor's Note",
		desc: "A crumpled piece of paper with shaky handwriting.",
		name_rus: "Записка выжившего",
		desc_rus: "Скомканный клочок бумаги с неразборчивым почерком.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.note;
			ctx.fillStyle = c.paper;
			ctx.fillRect(x + 0.15 * w, y + 0.1 * h, 0.7 * w, 0.8 * h);
			ctx.strokeStyle = c.border;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x + 0.15 * w, y + 0.5 * h);
			ctx.lineTo(x + 0.85 * w, y + 0.4 * h);
			ctx.stroke();
			for (let i = 0; i < 4; i++) {
				drawLine(ctx, x + 0.25 * w, y + (0.25 + i * 0.15) * h,
					x + 0.75 * w, y + (0.25 + i * 0.15) * h,
					c.text
				);
			}
		},
	},
	[ITEM_TEDDY_BEAR]: {
		name: "Teddy Bear",
		desc: "Lost its eye, but still gives great hugs.",
		name_rus: "Плюшевый мишка",
		desc_rus: "Потерял глаз, но всё ещё отлично обнимается.",
		render: (ctx, x, y, w, h) => {
			let c = COLORS_DEFAULT.items.teddy || {
				body: "#a67c52",
				ear: "#8b5a2b",
				eye: "#000",
				muzzle: "#d2b48c",
				stitch: "#444"
			};
			drawCircle(ctx, x + 0.35 * w, y + 0.85 * h, 0.1 * w, c.ear);
			drawCircle(ctx, x + 0.65 * w, y + 0.85 * h, 0.1 * w, c.ear);
			drawCircle(ctx, x + 0.3 * w, y + 0.3 * h, 0.1 * w, c.ear);
			drawCircle(ctx, x + 0.7 * w, y + 0.3 * h, 0.1 * w, c.ear);
			drawCircle(ctx, x + 0.5 * w, y + 0.7 * h, 0.25 * w, c.body);
			drawCircle(ctx, x + 0.5 * w, y + 0.45 * h, 0.22 * w, c
				.body);
			drawCircle(ctx, x + 0.28 * w, y + 0.6 * h, 0.08 * w, c.ear);
			drawCircle(ctx, x + 0.72 * w, y + 0.6 * h, 0.08 * w, c.ear);
			drawCircle(ctx, x + 0.5 * w, y + 0.52 * h, 0.08 * w, c
				.muzzle);
			drawCircle(ctx, x + 0.5 * w, y + 0.48 * h, 0.03 * w,
				"#332211");
			drawCircle(ctx, x + 0.42 * w, y + 0.42 * h, 0.03 * w, c
				.eye);
			ctx.strokeStyle = c.stitch;
			ctx.lineWidth = 2;
			let ex = x + 0.58 * w,
				ey = y + 0.42 * h,
				es = 0.02 * w;
			drawLine(ctx, ex - es, ey - es, ex + es, ey + es, c.stitch);
			drawLine(ctx, ex + es, ey - es, ex - es, ey + es, c.stitch);
			drawLine(ctx, x + 0.5 * w, y + 0.6 * h, x + 0.5 * w, y +
				0.8 * h, c.stitch, 1);
		}
	},
	[ITEM_TOY_TRAIN]: {
		name: "Toy Train",
		desc: "Choo-choo! It doesn't move anymore.",
		name_rus: "Игрушечный паровозик",
		desc_rus: "Чу-чу! Он больше никуда не едет.",
		render: (ctx, x, y, w, h) => {
			let c = {
				body: "#cc3333",
				cabin: "#3333cc",
				wheel: "#222"
			};
			ctx.fillStyle = c.body;
			ctx.fillRect(x + 0.2 * w, y + 0.5 * h, 0.5 * w, 0.25 * h);
			ctx.fillStyle = c.cabin;
			ctx.fillRect(x + 0.55 * w, y + 0.35 * h, 0.25 * w, 0.4 * h);
			ctx.fillStyle = "#555";
			ctx.fillRect(x + 0.25 * w, y + 0.3 * h, 0.15 * w, 0.2 * h);
			drawCircle(ctx, x + 0.3 * w, y + 0.8 * h, 0.08 * w, c
				.wheel);
			drawCircle(ctx, x + 0.5 * w, y + 0.8 * h, 0.08 * w, c
				.wheel);
			drawCircle(ctx, x + 0.7 * w, y + 0.8 * h, 0.08 * w, c
				.wheel);
		}
	},
	[ITEM_BALL]: {
		name: "Rubber Ball",
		desc: "Bouncy and bright.",
		name_rus: "Мячик",
		desc_rus: "Прыгучий и яркий.",
		render: (ctx, x, y, w, h) => {
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.3 * w,
				"#ff6600");
			ctx.strokeStyle = "#fff";
			ctx.lineWidth = 0.05 * w;
			ctx.beginPath();
			ctx.arc(x + 0.5 * w, y + 0.5 * h, 0.3 * w, Math.PI * 0.2,
				Math.PI * 0.8);
			ctx.stroke();
		}
	},
	[ITEM_RUBBER_DUCK]: {
		name: "Rubber Duck",
		desc: "The ultimate survival companion.",
		name_rus: "Резиновая уточка",
		desc_rus: "Лучший спутник в выживании.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#ffd700";
			drawCircle(ctx, x + 0.4 * w, y + 0.7 * h, 0.25 * w,
				"#ffd700");
			drawCircle(ctx, x + 0.6 * w, y + 0.4 * h, 0.15 * w,
				"#ffd700");
			ctx.fillStyle = "#ff4500";
			ctx.fillRect(x + 0.7 * w, y + 0.4 * h, 0.15 * w, 0.08 * h);
		}
	},
	[ITEM_TOY_SOLDIER]: {
		name: "Toy Soldier",
		desc: "Stands firm despite the apocalypse.",
		name_rus: "Солдатик",
		desc_rus: "Стойко держится, несмотря на апокалипсис.",
		render: (ctx, x, y, w, h) => {
			let green = "#2d5a27";
			ctx.fillStyle = green;
			ctx.fillRect(x + 0.45 * w, y + 0.3 * h, 0.1 * w, 0.4 * h);
			drawCircle(ctx, x + 0.5 * w, y + 0.25 * h, 0.08 * w, green);
			ctx.fillRect(x + 0.3 * w, y + 0.7 * h, 0.4 * w, 0.1 * h);
			ctx.lineWidth = 0.04 * w;
			drawLine(ctx, x + 0.55 * w, y + 0.4 * h, x + 0.7 * w, y +
				0.2 * h, green);
		}
	},
	[ITEM_SNOW_GLOBE]: {
		name: "Snow Globe",
		desc: "A tiny winter wonderland in your hands.",
		name_rus: "Снежный шар",
		desc_rus: "Маленькая зимняя сказка прямо в твоих руках.",
		render: (ctx, x, y, w, h) => {
			let c = {
				glass: "rgba(173, 216, 230, 0.4)",
				base: "#5d4037",
				snow: "#ffffff"
			};
			ctx.fillStyle = c.base;
			ctx.fillRect(x + 0.3 * w, y + 0.75 * h, 0.4 * w, 0.15 * h);
			drawCircle(ctx, x + 0.5 * w, y + 0.45 * h, 0.35 * w, c
				.glass, "#ffffff", 0.02 * w);
			ctx.fillStyle = "#2e7d32";
			ctx.beginPath();
			ctx.moveTo(x + 0.5 * w, y + 0.3 * h);
			ctx.lineTo(x + 0.4 * w, y + 0.65 * h);
			ctx.lineTo(x + 0.6 * w, y + 0.65 * h);
			ctx.fill();
			ctx.fillStyle = c.snow;
			for (let i = 0; i < 5; i++) {
				let sx = x + (0.35 + (i * 0.07)) * w;
				let sy = y + (0.4 + (Math.sin(i) * 0.1)) * h;
				drawCircle(ctx, sx, sy, 0.015 * w, c.snow);
			}
		}
	},
};
const renderCandy = (color1, color2) => (ctx, x, y, w, h) => {
	ctx.fillStyle = color1;
	ctx.beginPath();
	ctx.moveTo(x + 0.2 * w, y + 0.4 * h);
	ctx.lineTo(x + 0.8 * w, y + 0.6 * h);
	ctx.lineTo(x + 0.8 * w, y + 0.4 * h);
	ctx.lineTo(x + 0.2 * w, y + 0.6 * h);
	ctx.fill();
	drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.15 * w, color2);
};
Object.assign(ITEMS_DATA, {
	[ITEM_CANDY]: {
		name: "Candy",
		desc: "Sugar rush or a dental nightmare?",
		name_rus: "Конфета",
		desc_rus: "Сахарный бум или кошмар стоматолога?",
		render: renderCandy("#8e44ad", "#d291ff")
	},
	[ITEM_CANDY_RED]: {
		name: "Red Candy",
		desc: "Strawberry flavored chaos.",
		name_rus: "Красная конфета",
		desc_rus: "Клубничный хаос.",
		render: renderCandy("#c0392b", "#ff7675")
	},
	[ITEM_CANDY_GREEN]: {
		name: "Green Candy",
		desc: "Sour apple shock.",
		name_rus: "Зеленая конфета",
		desc_rus: "Кислое яблочное потрясение.",
		render: renderCandy("#27ae60", "#a2e08e")
	},
	[ITEM_CANDY_BLUE]: {
		name: "Blue Candy",
		desc: "Cool mint refreshment.",
		name_rus: "Синяя конфета",
		desc_rus: "Ледяная мятная свежесть.",
		render: renderCandy("#2980b9", "#81ecec")
	},
	[ITEM_CANDY_CYAN]: {
		name: "Cyan Candy",
		desc: "Electric blueberry blast.",
		name_rus: "Голубая конфета",
		desc_rus: "Электрический черничный взрыв.",
		render: renderCandy("#16a085", "#55efc4")
	},
	[ITEM_CANDY_MAGENTA]: {
		name: "Magenta Candy",
		desc: "Grape-infused magic.",
		name_rus: "Пурпурная конфета",
		desc_rus: "Виноградная магия.",
		render: renderCandy("#9b59b6", "#fd79ae")
	}
});
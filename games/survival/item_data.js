let ITEMS_DATA = {
	[ITEM_SHIELD_GRAY]: {
		name: "Gray shield",
		desc: "technical item. not in the game",
		name_rus: "Серый щит",
		desc_rus: "Технический предмет. Не в игре",
		render: (ctx, x, y, w, h) => {
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "gray",
				"white", 0.05 * w);
		}
	},
	[ITEM_MONEY]: {
		name: "Money",
		desc: "Useless paper scraps in a world without shops.",
		name_rus: "Деньги",
		desc_rus: "Просто крашеная бумага. Зомби не дают сдачи.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#11ff55";
			ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			ctx.strokeStyle = "#007733";
			ctx.lineWidth = 0.05 * w;
			ctx.strokeRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			drawCircle(ctx, x + w * 0.5, y + h * 0.5, w * 0.1,
				"#007733", "#007733", w * 0.025);
		}
	},
	[ITEM_APPLE_CORE]: {
		name: "Apple Core",
		desc: "Someone already ate the good part.",
		name_rus: "Огрызок",
		desc_rus: "Кто-то уже съел все вкусное.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#eeeecc";
			ctx.beginPath();
			ctx.ellipse(x + 0.5 * w, y + 0.5 * h, 0.08 * w, 0.2 * h, 0,
				0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ff4422";
			ctx.fillRect(x + 0.4 * w, y + 0.3 * h, 0.2 * w, 0.05 * h);
			ctx.fillRect(x + 0.4 * w, y + 0.65 * h, 0.2 * w, 0.05 * h);
			drawLine(ctx, x + 0.5 * w, y + 0.3 * h, x + 0.5 * w, y +
				0.15 * h, "#442200", 0.03 * w);
		}
	},
	[ITEM_FISH_BONE]: {
		name: "Fish Bone",
		desc: "Leftovers from a meal.",
		name_rus: "Рыбья кость",
		desc_rus: "Остатки чьего-то обеда.",
		render: (ctx, x, y, w, h) => {
			ctx.strokeStyle = "#dddddd";
			ctx.lineWidth = 0.05 * w;
			drawLine(ctx, x + 0.2 * w, y + 0.5 * h, x + 0.8 * w, y +
				0.5 * h, "#dddddd");
			for (let i = 0; i < 4; i++) {
				drawLine(ctx, x + (0.3 + i * 0.15) * w, y + 0.35 * h,
					x + (0.3 + i * 0.15) * w, y + 0.65 * h,
					"#dddddd");
			}
			ctx.fillStyle = "#dddddd";
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
			ctx.fillStyle = "rgba(150, 200, 255, 0.4)";
			ctx.strokeStyle = "white";
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
			let cx = x + 0.5 * w,
				cy = y + 0.5 * h;
			ctx.fillStyle = "#999999";
			ctx.fillRect(x + 0.3 * w, y + 0.35 * h, 0.4 * w, 0.4 * h);
			ctx.strokeStyle = "#777777";
			ctx.lineWidth = 1;
			drawLine(ctx, x + 0.3 * w, y + 0.45 * h, x + 0.7 * w, y +
				0.45 * h, "#777777");
			drawLine(ctx, x + 0.3 * w, y + 0.55 * h, x + 0.7 * w, y +
				0.55 * h, "#777777");
			drawLine(ctx, x + 0.3 * w, y + 0.65 * h, x + 0.7 * w, y +
				0.65 * h, "#777777");
			ctx.fillStyle = "#999999";
			ctx.beginPath();
			ctx.ellipse(cx, y + 0.75 * h, 0.2 * w, 0.05 * h, 0, 0, Math
				.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = "#444444";
			ctx.beginPath();
			ctx.ellipse(cx, y + 0.35 * h, 0.2 * w, 0.05 * h, 0, 0, Math
				.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "#bbbbbb";
			ctx.stroke();
			ctx.fillStyle = "#888888";
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
			ctx.fillStyle = "#553311";
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
			ctx.strokeStyle = "#aaa";
			ctx.lineWidth = 2;
			drawLine(ctx, x + 0.5 * w, y + 0.8 * h, x + 0.5 * w, y +
				0.4 * h, "#aaa");
			drawLine(ctx, x + 0.4 * w, y + 0.2 * h, x + 0.4 * w, y +
				0.4 * h, "#aaa");
			drawLine(ctx, x + 0.6 * w, y + 0.1 * h, x + 0.6 * w, y +
				0.4 * h, "#aaa");
		}
	},
	[ITEM_CRUMPLED_PAPER]: {
		name: "Crumpled Paper",
		desc: "Indecipherable scribbles.",
		name_rus: "Ком мятой бумаги",
		desc_rus: "Неразборчивые каракули.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#ffffff";
			ctx.strokeStyle = "#cccccc";
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
				0.5 * h, "#dddddd", 1);
		}
	},
	[ITEM_DEAD_BATTERY]: {
		name: "Dead Battery",
		desc: "No power left in this one.",
		name_rus: "Севшая батарейка",
		desc_rus: "В ней не осталось энергии.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#444444";
			ctx.fillRect(x + 0.35 * w, y + 0.3 * h, 0.3 * w, 0.5 * h);
			ctx.fillStyle = "#222222";
			ctx.fillRect(x + 0.35 * w, y + 0.7 * h, 0.3 * w, 0.1 * h);
			ctx.fillStyle = "#777777";
			ctx.fillRect(x + 0.45 * w, y + 0.22 * h, 0.1 * w, 0.08 * h);
			drawLine(ctx, x + 0.42 * w, y + 0.55 * h, x + 0.58 * w, y +
				0.55 * h, "#333333", 2);
		}
	},
	default: {
		name: "Unknown",
		desc: "???",
		name_rus: "Неизвестно",
		desc_rus: "???",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#000000";
			ctx.fillRect(x + 0.1 * w, y + 0.1 * h, 0.8 * w, 0.8 * h);
			ctx.fillStyle = "#ff00ff";
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
			ctx.fillStyle = "#5d4037";
			ctx.fillRect(x + 0.2 * w, y + 0.15 * h, 0.6 * w, 0.7 * h);
			ctx.fillStyle = "#3e2723";
			ctx.fillRect(x + 0.2 * w, y + 0.15 * h, 0.1 * w, 0.7 * h);
			ctx.strokeStyle = "#d7ccc8";
			ctx.lineWidth = 1;
			for (let i = 0; i < 3; i++) {
				drawLine(ctx, x + 0.35 * w, y + (0.3 + i * 0.15) * h,
					x + 0.7 * w, y + (0.3 + i * 0.15) * h, "#d7ccc8"
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
			ctx.fillStyle = "#f5f5f5";
			ctx.fillRect(x + 0.15 * w, y + 0.1 * h, 0.7 * w, 0.8 * h);
			ctx.strokeStyle = "#bdbdbd";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x + 0.15 * w, y + 0.5 * h);
			ctx.lineTo(x + 0.85 * w, y + 0.4 * h);
			ctx.stroke();
			for (let i = 0; i < 4; i++) {
				drawLine(ctx, x + 0.25 * w, y + (0.25 + i * 0.15) * h,
					x + 0.75 * w, y + (0.25 + i * 0.15) * h,
					"#424242"
				);
			}
		},
	}
};
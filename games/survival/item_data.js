let ITEM_GUN = 1;
let ITEM_DESERT_EAGLE = 110;
let ITEM_SHOTGUN = 15;
let ITEM_MINIGUN = 16;
let ITEM_PLASMA_LAUNCHER = 17;
let ITEM_RED_PISTOLS = 20;
let ITEM_RED_SHOTGUN = 21;
let ITEM_GREEN_GUN = 23;
let ITEM_SWORD = 24;
let ITEM_ROCKET_LAUNCHER = 26;
let ITEM_RAINBOW_PISTOLS = 29;
let ITEM_LASER_GUN = 33;
let ITEM_PLASMA_PISTOL = 35;
let ITEM_ROCKET_SHOTGUN = 36;
let ITEM_HORN = 37;
let ITEM_AMMO = 2;
let ITEM_PLASMA = 18;
let ITEM_RED_PLASMA = 19;
let ITEM_GREEN_AMMO = 25;
let ITEM_ROCKET = 27;
let ITEM_RAINBOW_AMMO = 30;
let ITEM_HEALTH = 3;
let ITEM_FUEL = 4;
let ITEM_SHIELD = 22;
let ITEM_HEALTH_GREEN = 28;
let ITEM_SHIELD_GREEN = 31;
let ITEM_SHIELD_RAINBOW = 32;
let ITEM_CANNED_MEAT = 7;
let ITEM_ORANGE = 8;
let ITEM_APPLE = 9;
let ITEM_CHERRIES = 10;
let ITEM_CHICKEN_LEG = 13;
let ITEM_CHOCOLATE = 14;
let ITEM_WATER = 6;
let ITEM_COLA = 11;
let ITEM_MILK = 12;
let ITEM_MONEY = 5;
let ITEM_BOSSIFIER = 34;
let ITEM_APPLE_CORE = 100;
let ITEM_FISH_BONE = 101;
let ITEM_EMPTY_BOTTLE = 102;
let ITEM_TIN_CAN = 103;
let ITEM_OLD_SHOE = 104;
let ITEM_BENT_FORK = 105;
let ITEM_CRUMPLED_PAPER = 106;
let ITEM_DEAD_BATTERY = 107;
let ITEM_JUNK_CANNON = 108;
let ITEM_REVOLVER = 111;
let ITEM_STICK = 112;
let ITEM_STONE = 113;
let ITEM_BOSSIFIER_REGULAR = 120;
let ITEM_BOSSIFIER_SHOOTING = 121;
let ITEM_BOSSIFIER_RED = 122;
let ITEM_BOSSIFIER_SWORD = 123;
let ITEM_BOSSIFIER_ROCKET = 124;
let ITEM_BOSSIFIER_LASER = 125;
let ITEM_SHIELD_GRAY = 126;
let ITEMS_BOSSIFIERS = [
	ITEM_BOSSIFIER_REGULAR,
	ITEM_BOSSIFIER_SHOOTING,
	ITEM_BOSSIFIER_RED,
	ITEM_BOSSIFIER_SWORD,
	ITEM_BOSSIFIER_ROCKET,
	ITEM_BOSSIFIER_LASER
];
let ITEMS_JUNK = [
	ITEM_APPLE_CORE,
	ITEM_FISH_BONE,
	ITEM_EMPTY_BOTTLE,
	ITEM_TIN_CAN,
	ITEM_OLD_SHOE,
	ITEM_CRUMPLED_PAPER,
	ITEM_DEAD_BATTERY
];
ITEMS_AMMOS = [
	ITEM_AMMO,
	ITEM_PLASMA,
	ITEM_RED_PLASMA,
	ITEM_ROCKET,
	ITEM_RAINBOW_AMMO
];
ITEMS_GUNS = [
	ITEM_GUN,
	ITEM_REVOLVER,
	ITEM_DESERT_EAGLE,
	ITEM_SHOTGUN,
	ITEM_MINIGUN,
	ITEM_PLASMA_LAUNCHER,
	ITEM_PLASMA_PISTOL,
	ITEM_RED_PISTOLS,
	ITEM_RED_SHOTGUN,
	ITEM_GREEN_GUN,
	ITEM_ROCKET_LAUNCHER,
	ITEM_ROCKET_SHOTGUN,
	ITEM_RAINBOW_PISTOLS,
	ITEM_LASER_GUN,
	ITEM_JUNK_CANNON,
];
ITEMS_MELEE = [
	ITEM_STICK,
	ITEM_SWORD,
	ITEM_HORN
];
ITEMS_FOODS = [
	ITEM_CANNED_MEAT,
	ITEM_ORANGE,
	ITEM_APPLE,
	ITEM_CHICKEN_LEG,
	ITEM_CHOCOLATE
];
ITEMS_DRINKS = [
	ITEM_WATER,
	ITEM_COLA,
	ITEM_MILK
];
let ITEMS_DATA = {
	[ITEM_STONE]: {
		name: "Stone",
		desc: "A heavy stone. Can be thrown at enemies.",
		name_rus: "Камень",
		desc_rus: "Тяжелый камень. Можно запустить во врага.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#888888";
			ctx.beginPath();
			ctx.moveTo(x + 0.3 * w, y + 0.3 * h);
			ctx.lineTo(x + 0.7 * w, y + 0.2 * h);
			ctx.lineTo(x + 0.8 * w, y + 0.6 * h);
			ctx.lineTo(x + 0.5 * w, y + 0.8 * h);
			ctx.lineTo(x + 0.2 * w, y + 0.5 * h);
			ctx.closePath();
			ctx.fill();
			ctx.strokeStyle = "#666666";
			ctx.lineWidth = 2;
			ctx.stroke();
		}
	},
	[ITEM_STICK]: {
		name: "Stick",
		desc: "A simple wooden stick. Better than nothing.",
		name_rus: "Палка",
		desc_rus: "Простая деревянная палка. Лучше, чем ничего.",
		render: (ctx, x, y, w, h) => {
			ctx.save();
			ctx.translate(x + w * 0.5, y + h * 0.5);
			ctx.rotate(Math.PI / 4);
			ctx.fillStyle = "#8B4513";
			ctx.fillRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.8);
			ctx.strokeStyle = "#5D2E0C";
			ctx.lineWidth = 1;
			ctx.strokeRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.8);
			ctx.restore();
		}
	},
	[ITEM_GREEN_GUN]: {
		name: "Acid Leech",
		desc: "Infinite toxic payload fueled by your own energy reserves.",
		name_rus: "Кислотная пиявка",
		desc_rus: "Бесконечный запас токсинов, работающий напрямую от вашей энергии.",
		render: (ctx, x, y, w, h, animstate) => {
			const darkGreen = "#0a3311";
			const acidGreen = "#44ff00";
			const midGreen = "#117733";
			const tentacleColor = "#22aa44";
			const t_anim = 2 * (animstate || 0);
			ctx.fillStyle = darkGreen;
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.2, h * 0.15);
			ctx.fillRect(x + w * 0.15, y + h * 0.55, w * 0.08, h *
				0.15);
			ctx.fillStyle = midGreen;
			ctx.fillRect(x + w * 0.3, y + h * 0.42, w * 0.6, h * 0.12);
			ctx.strokeStyle = tentacleColor;
			ctx.lineWidth = w * 0.05 * 0.75;
			ctx.lineCap = "round";
			const drawLeech = (startX, startY, maxAmp, freq, phase,
				length) => {
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				const segments = 16;
				for (let i = 0; i <= segments; i++) {
					const t = i / segments;
					const segX = startX + (length * t);
					const damping = 1 - Math.exp(-6 * t * t);
					const wave = Math.sin(t_anim * freq + t * Math
						.PI * phase) * maxAmp * damping;
					const segY = startY + wave + (t * 5);
					ctx.lineTo(segX, segY);
				}
				ctx.stroke();
			};
			drawLeech(x + w * 0.5, y + h * 0.56, 3, 0.06, 2.0, w *
				0.25);
			drawLeech(x + w * 0.5, y + h * 0.65, 3.5, 0.07, 2.8, w *
				0.22);
			ctx.fillStyle = darkGreen;
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.15, h * 0.25);
			ctx.fillStyle = acidGreen;
			let slosh = Math.sin(t_anim * 0.01) * 1.5;
			ctx.fillRect(x + w * 0.42, y + h * 0.55 + slosh, w * 0.11,
				h * 0.15 - slosh);
			ctx.fillStyle = darkGreen;
			ctx.fillRect(x + w * 0.88, y + h * 0.4, w * 0.06, h * 0.16);
			ctx.lineCap = "butt";
		}
	},
	[ITEM_REVOLVER]: {
		name: "Revolver",
		desc: "Classic six-shooter. Reliable and hard-hitting.",
		name_rus: "Револьвер",
		desc_rus: "Классический шестизарядник. Надежный и убойный.",
		render: (ctx, x, y, w, h) => {
			const silver = "#A0A0A0";
			const lightSilver = "#D3D3D3";
			const gripRubber = "#2A2A2A";
			const gripWood = "#8B2323";
			const darkMetal = "#444";
			ctx.fillStyle = gripRubber;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.22, y + h * 0.55);
			ctx.quadraticCurveTo(x + w * 0.1, y + h * 0.65, x + w *
				0.12, y + h * 0.9);
			ctx.lineTo(x + w * 0.28, y + h * 0.9);
			ctx.lineTo(x + w * 0.32, y + h * 0.65);
			ctx.fill();
			ctx.fillStyle = gripWood;
			ctx.fillRect(x + w * 0.16, y + h * 0.68, w * 0.08, h *
				0.18);
			ctx.fillStyle = silver;
			ctx.fillRect(x + w * 0.2, y + h * 0.42, w * 0.35, h * 0.18);
			ctx.fillStyle = "#888";
			ctx.fillRect(x + w * 0.38, y + h * 0.43, w * 0.22, h *
				0.16);
			ctx.fillStyle = darkMetal;
			for (let i = 0; i < 3; i++) {
				ctx.fillRect(x + w * 0.4, y + h * (0.45 + i * 0.05), w *
					0.18, h * 0.02);
			}
			ctx.fillStyle = silver;
			ctx.fillRect(x + w * 0.6, y + h * 0.43, w * 0.32, h * 0.12);
			ctx.fillStyle = lightSilver;
			ctx.fillRect(x + w * 0.6, y + h * 0.43, w * 0.32, h * 0.03);
			ctx.fillStyle = "#222";
			ctx.fillRect(x + w * 0.22, y + h * 0.38, w * 0.06, h *
				0.04);
			ctx.fillStyle = "#00FF00";
			ctx.fillRect(x + w * 0.88, y + h * 0.38, w * 0.03, h *
				0.03);
			ctx.strokeStyle = silver;
			ctx.lineWidth = w * 0.025;
			ctx.strokeRect(x + w * 0.3, y + h * 0.6, w * 0.14, h * 0.1);
			ctx.fillStyle = darkMetal;
			ctx.fillRect(x + w * 0.18, y + h * 0.4, w * 0.04, h * 0.06);
		}
	},
	[ITEM_DESERT_EAGLE]: {
		name: "Desert Eagle",
		desc: "High-caliber hand cannon. Massive stopping power, heavy recoil.",
		name_rus: "Дезерт Игл",
		desc_rus: "Крупнокалиберная ручная пушка. Огромная убойная сила и сильная отдача.",
		render: (ctx, x, y, w, h) => {
			const silver = "#aaa";
			const darkSilver = "#777";
			const grip = "#222";
			ctx.strokeStyle = darkSilver;
			ctx.lineWidth = w * 0.03;
			ctx.strokeRect(x + w * 0.35, y + h * 0.55, w * 0.15, h *
				0.1);
			ctx.fillStyle = grip;
			ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.2, h * 0.35);
			ctx.fillStyle = silver;
			ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.22);
			ctx.fillStyle = "#ccc";
			ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.05);
			ctx.fillStyle = darkSilver;
			ctx.fillRect(x + w * 0.75, y + h * 0.3, w * 0.05, h * 0.05);
		}
	},
	[ITEM_SHIELD_GREEN]: {
		name: "Kinetic Barrier",
		desc: "Reinforced field that absorbs high-impact energy.",
		name_rus: "Кинетический барьер",
		desc_rus: "Усиленное поле, поглощающее энергию сильных ударов.",
		render: (ctx, x, y, w, h) => {
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "lime",
				"white", 0.05 * w);
		}
	},
	[ITEM_ROCKET_LAUNCHER]: {
		name: "Seeker Launcher",
		desc: "Fires high-velocity homing projectiles.",
		name_rus: "Установка «Ищейка»",
		desc_rus: "Выпускает высокоскоростные самонаводящиеся снаряды.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#111133";
			ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
			ctx.fillStyle = "#000";
			ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1);
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(x + w * 0.8, y + h * 0.52, w * 0.1, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	[ITEM_ROCKET_SHOTGUN]: {
		name: "Homing Flak",
		desc: "Spreads micro-missiles that lock onto nearby heat signatures.",
		name_rus: "Самонаводящаяся дробь",
		desc_rus: "Разбрасывает микро-ракеты, захватывающие тепловые сигнатуры.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#111133";
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
			ctx.fillStyle = "orange";
			ctx.fillRect(x + w * 0.7, y + h * 0.35, w * 0.1, h * 0.1);
		}
	},
	[ITEM_GUN]: {
		name: "Pistol",
		desc: "Standard 9mm handgun.",
		name_rus: "Пистолет",
		desc_rus: "Стандартный 9-мм пистолет.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#000";
			ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
			ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05);
		}
	},
	[ITEM_SHOTGUN]: {
		name: "Shotgun",
		desc: "Powerful close-range weapon.",
		name_rus: "Дробовик",
		desc_rus: "Мощное оружие для ближнего боя.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#773311";
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
		}
	},
	[ITEM_MINIGUN]: {
		name: "Minigun",
		desc: "Extremely high fire rate.",
		name_rus: "Миниган",
		desc_rus: "Экстремально высокая скорострельность.",
		render: (ctx, x, y, w, h) => {
			let mw = w * 0.9,
				mh = h * 0.25;
			let mx = x + w * 0.05,
				my = y + h * 0.45;
			ctx.fillStyle = "#113377";
			ctx.fillRect(mx, my, mw * 0.3, mh * 1.2);
			ctx.fillStyle = "#2255aa";
			ctx.fillRect(mx + mw * 0.3, my + mh * 0.1, mw * 0.7, mh *
				0.8);
			ctx.fillStyle = "#0a1f44";
			ctx.fillRect(mx + mw * 0.3, my + mh * 0.3, mw * 0.7, mh *
				0.1);
			ctx.fillRect(mx + mw * 0.3, my + mh * 0.6, mw * 0.7, mh *
				0.1);
			ctx.fillStyle = "#113377";
			ctx.fillRect(mx + mw * 0.6, my + mh * 0.1, mw * 0.06, mh *
				0.8);
			ctx.fillRect(mx + mw * 0.94, my + mh * 0.1, mw * 0.06, mh *
				0.8);
			ctx.strokeStyle = "#113377";
			ctx.lineWidth = h * 0.03;
			ctx.beginPath();
			ctx.moveTo(mx + mw * 0.1, my);
			ctx.lineTo(mx + mw * 0.1, my - mh * 0.4);
			ctx.lineTo(mx + mw * 0.1, my - mh * 0.4);
			ctx.lineTo(mx + mw * 0.5, my - mh * 0.4);
			ctx.lineTo(mx + mw * 0.5, my + mh * 0.1);
			ctx.stroke();
		}
	},
	[ITEM_PLASMA_LAUNCHER]: {
		name: "Plasma Launcher",
		desc: "Fires unstable plasma spheres.",
		name_rus: "Плазмомет",
		desc_rus: "Стреляет нестабильными сферами плазмы.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#331133";
			ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
			ctx.fillStyle = "#000";
			ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1);
			ctx.fillStyle = "cyan";
			ctx.beginPath();
			ctx.arc(x + w * 0.8, y + h * 0.52, w * 0.1, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	[ITEM_RED_PISTOLS]: {
		name: "Red Pistols",
		desc: "Dual pistols with increased damage.",
		name_rus: "Красные пистолеты",
		desc_rus: "Парные пистолеты с повышенным уроном.",
		render: (ctx, x, y, w, h) => {
			let drawSinglePistol = (px, py, scale, color) => {
				ctx.fillStyle = color;
				ctx.fillRect(px, py, w * 0.35 * scale, h * 0.12 *
					scale);
				ctx.fillRect(px, py + h * 0.05 * scale, w * 0.1 *
					scale, h * 0.18 * scale);
				ctx.fillStyle = "rgba(255,255,255,0.2)";
				ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
					scale, h * 0.04 * scale);
			};
			let mainColor = "#dd1111";
			drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2,
				mainColor);
			drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2,
				mainColor);
		}
	},
	[ITEM_RED_SHOTGUN]: {
		name: "Red Shotgun",
		desc: "Enhanced model with tighter spread.",
		name_rus: "Красный дробовик",
		desc_rus: "Улучшенная модель с кучной стрельбой.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#dd1111";
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
			ctx.fillStyle = "#333";
			ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
		}
	},
	[ITEM_RAINBOW_PISTOLS]: {
		name: "Rainbow Pistols",
		desc: "Chaos in every shot.",
		name_rus: "Радужные пистолеты",
		desc_rus: "Хаос в каждом выстреле.",
		render: (ctx, x, y, w, h, animstate) => {
			let drawSinglePistol = (px, py, scale, color) => {
				ctx.fillStyle = color;
				ctx.fillRect(px, py, w * 0.35 * scale, h * 0.12 *
					scale);
				ctx.fillRect(px, py + h * 0.05 * scale, w * 0.1 *
					scale, h * 0.18 * scale);
				ctx.fillStyle = "rgba(255,255,255,0.2)";
				ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
					scale, h * 0.04 * scale);
			};
			let mainColor = "purple";
			if (animstate != null) {
				let hue = (animstate * 10) % 360;
				mainColor = `hsl(${hue}, 70%, 50%)`;
			}
			drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2,
				mainColor);
			drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2,
				mainColor);
		}
	},
	[ITEM_LASER_GUN]: {
		name: "Laser Gun",
		desc: "High-precision energy beam.",
		name_rus: "Лазерная пушка",
		desc_rus: "Высокоточный энергетический луч.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "purple";
			ctx.fillRect(x + w * 0.1, y + h * 0.35, w * 0.7, h * 0.3);
			ctx.fillStyle = "#ff00ff";
			ctx.fillRect(x + w * 0.8, y + h * 0.35, w * 0.1, h * 0.3);
			ctx.fillStyle = "white";
			ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.5, h * 0.1);
		}
	},
	[ITEM_PLASMA_PISTOL]: {
		name: "Plasma Pistol",
		desc: "Compact plasma firing sidearm.",
		name_rus: "Плазменный пистолет",
		desc_rus: "Компактное плазменное оружие.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#331133";
			ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.25);
			ctx.fillStyle = "#ff00ff";
			ctx.fillRect(x + w * 0.4, y + h * 0.45, w * 0.3, h * 0.1);
		}
	},
	[ITEM_JUNK_CANNON]: {
		name: "Junk Cannon",
		desc: "Turns trash into lethal projectiles.",
		name_rus: "Хламотрон",
		desc_rus: "Превращает мусор в смертоносные снаряды.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#444";
			ctx.fillRect(x + 0.1 * w, y + 0.4 * h, 0.8 * w, 0.25 * h);
			ctx.fillStyle = "#222";
			ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.15 * w, 0.2 * h);
			ctx.fillStyle = "#556677";
			ctx.beginPath();
			ctx.arc(x + 0.5 * w, y + 0.35 * h, 0.2 * w, 0, Math.PI,
				true);
			ctx.fill();
			ctx.strokeStyle = "blue";
			ctx.lineWidth = 3;
			drawLine(ctx, x + 0.4 * w, y + 0.3 * h, x + 0.4 * w, y +
				0.65 * h, "blue");
		}
	},
	[ITEM_SWORD]: {
		name: "Sword",
		desc: "A blade for honorable combat.",
		name_rus: "Меч",
		desc_rus: "Лезвие для благородного боя.",
		render: (ctx, x, y, w, h) => {
			ctx.save();
			ctx.translate(x + w * 0.5, y + h * 0.5);
			ctx.rotate(Math.PI / 4);
			let bladeColor = "#55aa11";
			let strokeColor = "#bbaa11";
			let bW = 0.14 * w;
			let bH = 0.65 * h;
			let hW = 0.1 * w;
			let hH = 0.3 * h;
			let guardY = 0.2 * h;
			ctx.fillStyle = bladeColor;
			ctx.fillRect(-bW / 2, guardY - bH, bW, bH);
			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = 0.03 * w;
			ctx.strokeRect(-bW / 2, guardY - bH, bW, bH);
			ctx.strokeStyle = "rgba(0,0,0,0.25)";
			for (let i = 1; i < 4; i++) {
				let nodeY = (guardY - bH) + (i * bH * 0.25);
				drawLine(ctx, -bW / 2, nodeY, bW / 2, nodeY,
					"rgba(0,0,0,0.25)", 1.5);
			}
			ctx.fillStyle = "rgba(255,255,255,0.2)";
			ctx.fillRect(-bW * 0.2, guardY - bH * 0.9, bW * 0.25, bH *
				0.8);
			ctx.fillStyle = "#443311";
			ctx.fillRect(-hW / 2, guardY, hW, hH);
			ctx.strokeStyle = "rgba(0,0,0,0.4)";
			ctx.strokeRect(-hW / 2, guardY, hW, hH);
			drawCircle(ctx, 0, guardY, 0.12 * w, "#332211", strokeColor,
				0.02 * w);
			for (let i = 1; i < 4; i++) {
				let ry = guardY + (i * hH * 0.25);
				drawLine(ctx, -hW / 2, ry, hW / 2, ry,
					"rgba(0,0,0,0.3)", 1);
			}
			ctx.restore();
		}
	},
	[ITEM_HORN]: {
		name: "Horn",
		desc: "Sharp and sturdy. Don't ask where it's from.",
		name_rus: "Рог",
		desc_rus: "Острый и прочный. Не спрашивай, откуда он.",
		render: (ctx, x, y, w, h) => {
			ctx.save();
			ctx.translate(x + w / 2, y + h / 2);
			ctx.rotate(-45 * Math.PI / 180);
			ctx.fillStyle = "brown";
			ctx.fillRect(-w * 0.4, -h * 0.075, w * 0.8, h * 0.15);
			drawLine(ctx, 0, 0, w * 0.3, h * 0.3, "brown", w * 0.1);
			drawLine(ctx, -w * 0.1, 0, w * 0.2, -h * 0.3, "brown", w *
				0.1);
			ctx.restore();
		}
	},
	[ITEM_AMMO]: {
		name: "Ammo",
		desc: "Standard bullets.",
		name_rus: "Патроны",
		desc_rus: "Стандартные пули.",
		render: (ctx, x, y, w, h) => {
			let N = 4;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = "yellow";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = "orange";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "orange";
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_PLASMA]: {
		name: "Plasma Cells",
		desc: "Energy source for plasma weapons.",
		name_rus: "Плазменные ячейки",
		desc_rus: "Источник энергии для плазменного оружия.",
		render: (ctx, x, y, w, h) => {
			let N = 3;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = "cyan";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = "blue";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "white";
				ctx.lineWidth = 0.025 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_RED_PLASMA]: {
		name: "Red Plasma",
		desc: "Overcharged plasma energy.",
		name_rus: "Красная плазма",
		desc_rus: "Перегруженная плазменная энергия.",
		render: (ctx, x, y, w, h) => {
			let N = 4;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = "pink";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = "red";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "red";
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_GREEN_AMMO]: {
		name: "Corrosive Ammo",
		desc: "Bullets filled with acid.",
		name_rus: "Кислотные пули",
		desc_rus: "Пули, наполненные кислотой.",
		render: (ctx, x, y, w, h) => {
			let N = 4;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = "lime";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = "green";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "green";
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_ROCKET]: {
		name: "Rockets",
		desc: "Explosive projectiles.",
		name_rus: "Ракеты",
		desc_rus: "Взрывоопасные снаряды.",
		render: (ctx, x, y, w, h) => {
			let N = 3;
			for (let i = 0; i < N; i++) {
				ctx.fillStyle = "#666666";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = "#bb3311";
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "#111111";
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_RAINBOW_AMMO]: {
		name: "Rainbow Core",
		desc: "Shifts elements unpredictably.",
		name_rus: "Радужное ядро",
		desc_rus: "Непредсказуемо меняет стихии.",
		render: (ctx, x, y, w, h, animstate) => {
			if (animstate == null) return;
			let colors = ["pink", "yellow", "lime", "cyan"],
				colors1 = ["red", "orange", "green", "blue"];
			let N = 4;
			for (let i = 0; i < N; i++) {
				let idx = (i + Math.floor(animstate)) % 4;
				ctx.fillStyle = colors[idx];
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.5 * h);
				ctx.fillStyle = colors1[idx];
				ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
					0.5 * w / N, 0.125 * h);
				ctx.strokeStyle = "white";
				ctx.lineWidth = 0.01 * w;
				ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
					h, 0.5 * w / N, 0.5 * h);
			}
		}
	},
	[ITEM_HEALTH]: {
		name: "Health Kit",
		desc: "Restores a portion of HP.",
		name_rus: "Аптечка",
		desc_rus: "Восстанавливает часть здоровья.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "white";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillStyle = "#1177ff";
			ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
			ctx.strokeStyle = "#1177ff";
			ctx.lineWidth = h * 0.01;
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	[ITEM_HEALTH_GREEN]: {
		name: "Advanced Medkit",
		desc: "Powerful regenerative chemicals.",
		name_rus: "Улучшенная аптечка",
		desc_rus: "Мощные регенерирующие химикаты.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "white";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillStyle = "#11ff77";
			ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
			ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
			ctx.strokeStyle = "#11ff77";
			ctx.lineWidth = h * 0.01;
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	[ITEM_FUEL]: {
		name: "Gasoline",
		desc: "Used to refuel vehicles.",
		name_rus: "Бензин",
		desc_rus: "Используется для заправки машин.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#ff1111";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
			ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
			ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
			ctx.lineWidth = 0.01 * w;
			ctx.strokeStyle = "black";
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			ctx.fillStyle = "yellow";
			ctx.fillRect(x + w * 0.55, y + h * 0.15, w * 0.2, h * 0.05);
			drawLine(ctx, x + w * 0.3, y + h * 0.3, x + w * 0.7, y + h *
				0.7, "#cc1111", 0.05 * w);
			drawLine(ctx, x + w * 0.7, y + h * 0.3, x + w * 0.3, y + h *
				0.7, "#cc1111", 0.05 * w);
			ctx.fillStyle = "#dd1111";
			ctx.fillRect(x + w * 0.45, y + h * 0.45, w * 0.1, h * 0.1);
		}
	},
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
	[ITEM_SHIELD]: {
		name: "Energy Shield",
		desc: "Provides temporary protection.",
		name_rus: "Энергетический щит",
		desc_rus: "Дает временную защиту.",
		render: (ctx, x, y, w, h) => {
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, "cyan",
				"white", 0.05 * w);
		}
	},
	[ITEM_SHIELD_RAINBOW]: {
		name: "Prismatic Shield",
		desc: "Maximum protection against all types.",
		name_rus: "Призматический щит",
		desc_rus: "Максимальная защита от всех типов урона.",
		render: (ctx, x, y, w, h, animstate) => {
			if (animstate == null) return;
			let r = Math.floor(Math.pow(Math.cos(0.1 * animstate) * 15,
				2));
			let g = Math.floor(Math.pow(0.7 * (Math.cos(0.1 *
					animstate) + Math.sin(0.1 * animstate)) *
				15, 2));
			let b = Math.floor(Math.pow(Math.sin(0.1 * animstate) * 15,
				2));
			let color = "#" + r.toString(16).padStart(2, '0') + g
				.toString(16).padStart(2, '0') + b.toString(16)
				.padStart(2, '0');
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, color,
				"white", 0.05 * w);
		}
	},
	[ITEM_MONEY]: {
		name: "Money",
		desc: "Can be used for trading.",
		name_rus: "Деньги",
		desc_rus: "Можно использовать для торговли.",
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
	[ITEM_BOSSIFIER]: {
		name: "Ultimate Bossifier",
		desc: "Can bossify any living thing.",
		name_rus: "Абсолютный Боссификатор",
		desc_rus: "Может боссифицировать любое живое создание.",
		render: (ctx, x, y, w, h, animstate) => {
			if (animstate == null) return;
			let rate = 0.05;
			let r = Math.floor(Math.pow(Math.cos(rate * animstate) * 15,
				2));
			let g = Math.floor(Math.pow(0.7 * (Math.cos(rate *
					animstate) + Math.sin(rate * animstate)) *
				15, 2));
			let b = Math.floor(Math.pow(Math.sin(rate * animstate) * 15,
				2));
			let color = "#" + r.toString(16).padStart(2, '0') + g
				.toString(16).padStart(2, '0') + b.toString(16)
				.padStart(2, '0');
			ctx.fillStyle = "black";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
			drawLine(ctx, x + w * 0.5, y + h * 0.7, x + w * 0.5, y + h *
				0.28375, color, w * 0.05);
			drawLine(ctx, x + w * 0.5, y + h * 0.3, x + w * 0.65, y +
				h * 0.5, color, w * 0.05);
			drawLine(ctx, x + w * 0.5, y + h * 0.3, x + w * 0.35, y +
				h * 0.5, color, w * 0.05);
			ctx.strokeStyle = color;
			ctx.lineWidth = h * 0.025;
			ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	[ITEM_CANNED_MEAT]: {
		name: "Canned Meat",
		desc: "Nutritious and long-lasting.",
		name_rus: "Тушенка",
		desc_rus: "Питательно и долго хранится.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "gray";
			ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
			ctx.fillStyle = "#771111";
			ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
		}
	},
	[ITEM_ORANGE]: {
		name: "Orange",
		desc: "Rich in Vitamin C.",
		name_rus: "Апельсин",
		desc_rus: "Богат витамином C.",
		render: (ctx, x, y, w, h) => {
			drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w,
				"#ff8800", "#773311", 0.05 * w);
			drawCircle(ctx, x + 0.4 * w, y + 0.4 * h, 0.05 * w,
				"#ffaa44", "#ffaa44", 0);
			ctx.fillStyle = "#442200";
			ctx.fillRect(x + 0.48 * w, y + 0.25 * h, 0.04 * w, 0.04 *
				h);
		}
	},
	[ITEM_APPLE]: {
		name: "Apple",
		desc: "A fresh, crunchy snack.",
		name_rus: "Яблоко",
		desc_rus: "Свежий и хрустящий перекус.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#ff4422";
			ctx.beginPath();
			ctx.ellipse(x + 0.5 * w, y + 0.55 * h, 0.24 * w, 0.24 * h,
				0, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "#440000";
			ctx.lineWidth = 0.03 * w;
			ctx.stroke();
			drawLine(ctx, x + 0.5 * w, y + 0.35 * h, x + 0.5 * w, y +
				0.15 * h, "#442200", 0.04 * w);
			ctx.fillStyle = "#33aa11";
			ctx.beginPath();
			ctx.ellipse(x + 0.6 * w, y + 0.22 * h, 0.1 * w, 0.05 * w, -
				Math.PI / 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
			ctx.beginPath();
			ctx.ellipse(x + 0.4 * w, y + 0.45 * h, 0.07 * w, 0.07 * w,
				0, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	[ITEM_CHERRIES]: {
		name: "Cherries",
		desc: "Small but sweet.",
		name_rus: "Вишни",
		desc_rus: "Маленькие, но сладкие.",
		render: (ctx, x, y, w, h) => {
			drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.35 * w, y +
				0.65 * h, "#224400", 0.04 * w);
			drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.65 * w, y +
				0.65 * h, "#224400", 0.04 * w);
			drawCircle(ctx, x + 0.35 * w, y + 0.7 * h, 0.12 * w,
				"#cc0000", "#660000", 0.02 * w);
			drawCircle(ctx, x + 0.65 * w, y + 0.7 * h, 0.12 * w,
				"#ee0000", "#660000", 0.02 * w);
			drawCircle(ctx, x + 0.32 * w, y + 0.65 * h, 0.03 * w,
				"white", "none", 0);
			drawCircle(ctx, x + 0.62 * w, y + 0.65 * h, 0.03 * w,
				"white", "none", 0);
		}
	},
	[ITEM_CHICKEN_LEG]: {
		name: "Chicken Leg",
		desc: "Fried to perfection.",
		name_rus: "Куриная ножка",
		desc_rus: "Идеально прожарена.",
		render: (ctx, x, y, w, h) => {
			drawLine(ctx, x + 0.5 * w, y + 0.6 * h, x + 0.5 * w, y +
				0.85 * h, "#eeeeee", 0.08 * w);
			drawCircle(ctx, x + 0.45 * w, y + 0.85 * h, 0.05 * w,
				"#eeeeee", "#cccccc", 0.01 * w);
			drawCircle(ctx, x + 0.55 * w, y + 0.85 * h, 0.05 * w,
				"#eeeeee", "#cccccc", 0.01 * w);
			ctx.fillStyle = "#884411";
			ctx.beginPath();
			ctx.ellipse(x + 0.5 * w, y + 0.4 * h, 0.2 * w, 0.28 * h, 0,
				0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#aa6622";
			ctx.beginPath();
			ctx.ellipse(x + 0.45 * w, y + 0.35 * h, 0.12 * w, 0.18 * h,
				0, 0, Math.PI * 2);
			ctx.fill();
		}
	},
	[ITEM_CHOCOLATE]: {
		name: "Chocolate",
		desc: "Quick energy boost.",
		name_rus: "Шоколад",
		desc_rus: "Быстрый заряд энергии.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#331100";
			ctx.fillRect(x + w * 0.2, y + h * 0.15, w * 0.6, h * 0.7);
			ctx.fillStyle = "#aa0000";
			ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.6, h * 0.45);
			ctx.strokeStyle = "#220800";
			ctx.lineWidth = 1;
			ctx.strokeRect(x + w * 0.25, y + h * 0.2, w * 0.2, h * 0.2);
			ctx.strokeRect(x + w * 0.55, y + h * 0.2, w * 0.2, h * 0.2);
			ctx.fillStyle = "#d4af37";
			ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.6, h * 0.05);
		}
	},
	[ITEM_WATER]: {
		name: "Water",
		desc: "Essential for survival.",
		name_rus: "Вода",
		desc_rus: "Необходима для выживания.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#777777";
			ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
			ctx.fillStyle = "#1177dd";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	[ITEM_COLA]: {
		name: "Cola",
		desc: "Sugary and carbonated.",
		name_rus: "Кола",
		desc_rus: "Сладкая и газированная.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#777777";
			ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
			ctx.fillStyle = "#dd1111";
			ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		}
	},
	[ITEM_MILK]: {
		name: "Milk",
		desc: "Good for your bones.",
		name_rus: "Молоко",
		desc_rus: "Полезно для костей.",
		render: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#113377";
			ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.4);
			ctx.fillStyle = "#dddddd";
			ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.6, h * 0.4);
			ctx.lineWidth = 0.05 * w;
			ctx.strokeStyle = "black";
			ctx.strokeRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
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
		desc_rus: "Подошва вот-зат отвалится.",
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
	}
};
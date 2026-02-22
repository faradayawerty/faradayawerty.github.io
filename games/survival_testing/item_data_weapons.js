const CW = COLORS_DEFAULT.weapons;
ITEMS_DATA[ITEM_ROCKET_PISTOL] = {
	name: "Rocket Pistol",
	desc: "Pocket-sized explosive delivery system.",
	name_rus: "Ракетный пистолет",
	desc_rus: "Карманная система доставки взрывчатки.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.special.rocket_body;
		ctx.fillRect(x + w * 0.15, y + h * 0.4, w * 0.65, h * 0.25);
		ctx.fillStyle = CW.common.black;
		ctx.fillRect(x + w * 0.2, y + h * 0.6, w * 0.15, h * 0.25);
		ctx.fillStyle = CW.common.black;
		ctx.fillRect(x + w * 0.25, y + h * 0.35, w * 0.4, h * 0.08);
		ctx.fillStyle = CW.special.rocket_eye;
		ctx.beginPath();
		ctx.arc(x + w * 0.7, y + h * 0.52, w * 0.08, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.8, y + h * 0.42, w * 0.08, h * 0.2);
	}
};
ITEMS_DATA[ITEM_FREEZE_GUN] = {
	name: "Freeze Gun",
	desc: "Absolute zero in a portable package.",
	name_rus: "Замораживающая пушка",
	desc_rus: "Абсолютный ноль в портативном исполнении.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const glow = Math.sin(t * 0.2) * 0.5 + 0.5;
		ctx.fillStyle = "#d1d5db";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.7, h * 0.2);
		ctx.fillStyle = "#0099ff";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.25, h * 0.25);
		ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.25, h * 0.05);
		ctx.shadowBlur = 15 * glow;
		ctx.shadowColor = "cyan";
		ctx.fillStyle = "#e0ffff";
		ctx.fillRect(x + w * 0.8, y + h * 0.45, w * 0.1, h * 0.1);
		ctx.shadowBlur = 0;
		ctx.fillStyle = "white";
		for (let i = 0; i < 3; i++) {
			ctx.fillRect(x + w * (0.4 + i * 0.1), y + h * 0.4, w * 0.05,
				h * 0.02);
		}
	}
};
ITEMS_DATA[ITEM_TESLA_GUN] = {
	name: "Tesla Gun",
	desc: "High-voltage heavy discharge projector.",
	name_rus: "Тесла-пушка",
	desc_rus: "Тяжелый проектор высоковольтных разрядов.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = 1;
		const electricBlue = "#00ffff";
		const sciFiWhite = "#e5e7eb";
		const dark = CW.common.black_soft;
		ctx.save();
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.12, y + h * 0.53, w * 0.08, h * 0.22);
		ctx.fillRect(x + w * 0.45, y + h * 0.53, w * 0.07, h * 0.18);
		ctx.fillStyle = sciFiWhite;
		ctx.fillRect(x + w * 0.05, y + h * 0.43, w * 0.65, h * 0.14);
		ctx.fillStyle = "#9ca3af";
		ctx.fillRect(x + w * 0.1, y + h * 0.48, w * 0.55, h * 0.02);
		ctx.fillStyle = CW.common.metal || "#4b5563";
		ctx.fillRect(x + w * 0.7, y + h * 0.45, w * 0.25, h * 0.1);
		for (let i = 0; i < 3; i++) {
			let spark = Math.sin(t * 0.4 + i) * 3;
			ctx.fillStyle = electricBlue;
			ctx.globalAlpha = 0.7 + Math.random() * 0.3;
			ctx.fillRect(x + w * (0.75 + i * 0.06), y + h * 0.4 + 0.5 *
				spark, w * 0.04, h * 0.18);
			ctx.shadowBlur = 10 * pulse;
			ctx.shadowColor = electricBlue;
			ctx.strokeStyle = electricBlue;
			ctx.lineWidth = 1.5;
			if (Math.random() > 0.6) {
				ctx.beginPath();
				ctx.moveTo(x + w * (0.75 + i * 0.06), y + h * 0.4 +
					spark);
				ctx.lineTo(x + w * (0.78 + i * 0.06), y + h * 0.3 + Math
					.random() * 10);
				ctx.stroke();
			}
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1.0;
		}
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.2, y + h * 0.46, w * 0.35, h * 0.07);
		ctx.fillStyle = electricBlue;
		ctx.globalAlpha = 0.4 + pulse * 0.6;
		ctx.fillRect(x + w * 0.21, y + h * 0.48, w * 0.33 * (0.75 +
			0.25 * pulse), h * 0.03);
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_PRESENT_LAUNCHER] = {
	name: "Present Launcher",
	desc: "The gift that keeps on giving... damage.",
	name_rus: "Подаркомёт",
	desc_rus: "Подарок, который не перестает приносить... урон.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.15 * w, 0.2 * h);
		ctx.fillStyle = "#cc0000";
		ctx.fillRect(x + 0.1 * w, y + 0.4 * h, 0.8 * w, 0.25 * h);
		ctx.fillStyle = "#008800";
		ctx.beginPath();
		ctx.arc(x + 0.5 * w, y + 0.35 * h, 0.2 * w, 0, Math.PI, true);
		ctx.fill();
		ctx.strokeStyle = "#ffd700";
		ctx.lineWidth = 3;
		drawLine(ctx, x + 0.45 * w, y + 0.2 * h, x + 0.45 * w, y +
			0.65 * h, "#ffd700", 3);
		ctx.fillStyle = "#ffd700";
		ctx.fillRect(x + 0.1 * w, y + 0.48 * h, 0.8 * w, 0.04 * h);
	}
};
ITEMS_DATA[ITEM_KRAMPUS_CHAIN] = {
	name: "Krampus Chain",
	desc: "Ancient rusted chains that thirst for souls.",
	name_rus: "Цепь Крампуса",
	desc_rus: "Древние ржавые цепи, жаждущие душ.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.5 + 0.5;
		ctx.save();
		ctx.translate(x + w * 0.5, y + h * 0.5);
		ctx.rotate(-Math.PI * 0.15);
		const numElements = 5;
		const spacing = w * 0.16;
		for (let i = 0; i < numElements; i++) {
			const isLast = (i === numElements - 1);
			const ox = -w * 0.35 + (i * spacing);
			const oy = Math.sin(t * 0.05 + i) * 2;
			ctx.save();
			ctx.translate(ox, oy);
			ctx.rotate(i % 2 === 0 ? 0 : Math.PI * 0.5);
			const ringRadius = w * 0.07;
			ctx.lineWidth = w * 0.07;
			ctx.lineCap = "round";
			if (isLast) {
				ctx.shadowBlur = 15 * pulse;
				ctx.shadowColor = "#ff0000";
				ctx.strokeStyle = "#cc0000";
			}
			else {
				ctx.strokeStyle = "#1a1a1a";
			}
			ctx.beginPath();
			ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
			ctx.stroke();
			ctx.lineWidth = w * 0.02;
			ctx.strokeStyle = isLast ? "#ff6666" : "#444444";
			ctx.beginPath();
			ctx.arc(0, 0, ringRadius, -Math.PI * 0.5, 0);
			ctx.stroke();
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.arc(0, 0, ringRadius + ctx.lineWidth, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		}
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_SNOWBALL_GUN] = {
	name: "Snowball Cannon",
	desc: "Fun but surprisingly lethal in winter.",
	name_rus: "Снежкомёт",
	desc_rus: "Веселое, но удивительно смертоносное оружие зимой.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.2, y + h * 0.65, w * 0.1, h * 0.25);
		ctx.fillStyle = "rgba(224, 255, 255, 0.4)";
		ctx.strokeStyle = "cyan";
		ctx.lineWidth = 1;
		ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.65, h * 0.3);
		ctx.strokeRect(x + w * 0.15, y + h * 0.35, w * 0.65, h * 0.3);
		ctx.fillStyle = "white";
		for (let i = 0; i < 3; i++) {
			ctx.beginPath();
			ctx.arc(x + w * (0.3 + i * 0.2), y + h * 0.5, w * 0.07, 0,
				Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.8, y + h * 0.3, w * 0.06, h * 0.4);
	}
};
ITEMS_DATA[ITEM_PP_SH] = {
	name: "PPSh-41",
	desc: "Soviet classic. High fire rate with a drum magazine.",
	name_rus: "Пистолет-пулемёт Шпагина",
	desc_rus: "Советская классика. Высокий темп стрельбы и дисковый магазин.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.wood_dark;
		ctx.fillRect(x + w * 0.1, y + h * 0.5, w * 0.35, h * 0.15);
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.4, y + h * 0.45, w * 0.5, h * 0.12);
		ctx.fillStyle = CW.common.gray_dark;
		ctx.beginPath();
		ctx.arc(x + w * 0.55, y + h * 0.65, w * 0.14, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.7, y + h * 0.47, w * 0.15, h * 0.03);
	}
};
ITEMS_DATA[ITEM_MOSIN_RIFLE] = {
	name: "Mosin Rifle",
	desc: "Reliable bolt-action rifle from the past.",
	name_rus: "Винтовка Мосина",
	desc_rus: "Надежная винтовка из прошлого.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.wood_dark;
		ctx.fillRect(x + w * 0.1, y + h * 0.5, w * 0.8, h * 0.1);
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.3, y + h * 0.45, w * 0.65, h * 0.06);
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.45, y + h * 0.4, w * 0.05, h * 0.1);
	}
};
ITEMS_DATA[ITEM_FLAMETHROWER] = {
	name: "Flamethrower",
	desc: "Roasts enemies with a stream of liquid fire.",
	name_rus: "Огнемёт",
	desc_rus: "Поджаривает врагов струей жидкого пламени.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const glow = Math.sin(t * 0.2) * 0.5 + 0.5;
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.7, h * 0.2);
		ctx.fillStyle = "#ff4500";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.25, h * 0.25);
		ctx.shadowBlur = 10 * glow;
		ctx.shadowColor = "orange";
		ctx.fillStyle = "#ffd700";
		ctx.fillRect(x + w * 0.8, y + h * 0.45, w * 0.1, h * 0.1);
		ctx.shadowBlur = 0;
	}
};
ITEMS_DATA[ITEM_BLIZZARD_STAFF] = {
	name: "Blizzard Staff",
	desc: "Calls upon the power of the northern winds.",
	name_rus: "Посох снежной бури",
	desc_rus: "Призывает силу северных ветров.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.7);
		ctx.lineWidth = w * 0.02;
		ctx.strokeStyle = "cyan";
		ctx.strokeRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.7);
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.moveTo(x + w * 0.5, y + h * 0.05);
		ctx.lineTo(x + w * 0.65, y + h * 0.2);
		ctx.lineTo(x + w * 0.5, y + h * 0.35);
		ctx.lineTo(x + w * 0.35, y + h * 0.2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
};
ITEMS_DATA[ITEM_VENOM_SHOTGUN] = {
	name: "Venom Shotgun",
	desc: "Fires bursts of concentrated toxin.",
	name_rus: "Ядовитый обрез",
	desc_rus: "Стреляет сгустками концентрированного токсина.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.5 + 0.5;
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
		ctx.fillStyle = CW.common.wood_dark;
		ctx.fillRect(x + w * 0.1, y + h * 0.5, w * 0.2, h * 0.2);
		const c = CW.venom.liquid_base;
		ctx.fillStyle =
			`rgb(${c[0]}, ${c[1] + pulse * CW.venom.liquid_pulse}, ${c[2]})`;
		ctx.fillRect(x + w * 0.3, y + h * 0.38, w * 0.4, h * 0.05);
		ctx.beginPath();
		ctx.arc(x + w * 0.75, y + h * 0.4, 2, 0, Math.PI * 2);
		ctx.fill();
	}
};
ITEMS_DATA[ITEM_ACID_SMG] = {
	name: "Acid SMG",
	desc: "High rate of fire, uses venom to corrode targets.",
	name_rus: "Кислотный ПП",
	desc_rus: "Высокий темп стрельбы, использует яд для коррозии целей.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.2) * 0.5 + 0.5;
		ctx.fillStyle = CW.common.gray_dark;
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.5, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.6, w * 0.1, h * 0.2);
		const c = CW.venom.liquid_smg_base;
		ctx.fillStyle =
			`rgb(${c[0]}, ${c[1] + pulse * CW.venom.liquid_smg_pulse}, ${c[2]})`;
		ctx.fillRect(x + w * 0.45, y + h * 0.5, w * 0.12, h * 0.3);
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.7, y + h * 0.45, w * 0.1, h * 0.1);
	}
};
ITEMS_DATA[ITEM_VENOM_DUAL_SHOTGUNS] = {
	name: "Dual Acid Breakers",
	desc: "High-tech sawed-off shotguns with chemical vials.",
	name_rus: "Кислотные крушители",
	desc_rus: "Футуристичные обрезы с колбами яда.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.2) * 0.5 + 0.5;
		let drawHighTechShotgun = (px, py, scale) => {
			ctx.save();
			ctx.fillStyle = CW.common.black_soft;
			ctx.fillRect(px, py, w * 0.5 * scale, h * 0.12 * scale);
			ctx.fillRect(px - w * 0.05 * scale, py, w * 0.1 * scale,
				h * 0.25 * scale);
			ctx.fillStyle = CW.common.gray_dark;
			ctx.fillRect(px + w * 0.1 * scale, py - h * 0.02 *
				scale, w * 0.3 * scale, h * 0.05 * scale);
			ctx.fillStyle = CW.venom.vial_bg;
			ctx.fillRect(px + w * 0.15 * scale, py + h * 0.08 *
				scale, w * 0.3 * scale, h * 0.08 * scale);
			const c = CW.venom.liquid_base;
			ctx.fillStyle =
				`rgb(${c[0]}, ${c[1] + pulse * CW.venom.liquid_pulse}, ${c[2]})`;
			ctx.fillRect(px + w * 0.16 * scale, py + h * 0.1 *
				scale, w * 0.28 * scale, h * 0.05 * scale);
			ctx.fillStyle = CW.common.white_gloss;
			ctx.fillRect(px + w * 0.16 * scale, py + h * 0.09 *
				scale, w * 0.2 * scale, h * 0.02 * scale);
			ctx.restore();
		};
		drawHighTechShotgun(x + w * 0.1, y + h * 0.2, 1.1);
		drawHighTechShotgun(x + w * 0.4, y + h * 0.5, 1.1);
	}
};
ITEMS_DATA[ITEM_STONE] = {
	name: "Stone",
	desc: "A heavy stone. Can be thrown at enemies.",
	name_rus: "Камень",
	desc_rus: "Тяжелый камень. Можно запустить во врага.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.gray;
		ctx.beginPath();
		ctx.moveTo(x + 0.3 * w, y + 0.3 * h);
		ctx.lineTo(x + 0.7 * w, y + 0.2 * h);
		ctx.lineTo(x + 0.8 * w, y + 0.6 * h);
		ctx.lineTo(x + 0.5 * w, y + 0.8 * h);
		ctx.lineTo(x + 0.2 * w, y + 0.5 * h);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = CW.special.stone_stroke;
		ctx.lineWidth = 2;
		ctx.stroke();
	}
};
ITEMS_DATA[ITEM_STICK] = {
	name: "Stick",
	desc: "A simple wooden stick. Better than nothing.",
	name_rus: "Палка",
	desc_rus: "Простая деревянная палка. Лучше, чем ничего.",
	render: (ctx, x, y, w, h) => {
		ctx.save();
		ctx.translate(x + w * 0.5, y + h * 0.5);
		ctx.rotate(Math.PI / 4);
		ctx.fillStyle = CW.special.stick_main;
		ctx.fillRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.8);
		ctx.strokeStyle = CW.special.stick_stroke;
		ctx.lineWidth = 1;
		ctx.strokeRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.8);
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_KALASHNIKOV] = {
	name: "Kalashnikov rifle",
	desc: "Reliable desert classic. High fire rate, distinctive yellow muzzle flash.",
	name_rus: "Автомат Калашникова",
	desc_rus: "Надежная классика пустыни. Высокая скорострельность и узнаваемая вспышка.",
	render: (ctx, x, y, w, h) => {
		const wood = CW.common.wood;
		const metal = CW.common.metal;
		const lightMetal = CW.common.metal_light;
		ctx.fillStyle = wood;
		ctx.save();
		ctx.translate(x + w * 0.33, y + h * 0.5);
		ctx.rotate(0.15);
		ctx.fillRect(0, 0, w * 0.05, h * 0.14);
		ctx.restore();
		ctx.fillStyle = wood;
		ctx.beginPath();
		ctx.moveTo(x + w * 0.1, y + h * 0.46);
		ctx.lineTo(x + w * 0.3, y + h * 0.45);
		ctx.lineTo(x + w * 0.3, y + h * 0.52);
		ctx.lineTo(x + w * 0.1, y + h * 0.58);
		ctx.fill();
		ctx.fillStyle = metal;
		ctx.fillRect(x + w * 0.3, y + h * 0.43, w * 0.25, h * 0.1);
		ctx.strokeStyle = metal;
		ctx.lineWidth = w * 0.075;
		ctx.lineCap = "butt";
		ctx.beginPath();
		ctx.arc(x + w * 0.725, y + h * 0.55, w * 0.25, Math.PI *
			0.8, Math.PI * 1.05);
		ctx.stroke();
		ctx.fillStyle = wood;
		ctx.fillRect(x + w * 0.55, y + h * 0.48, w * 0.15, h *
			0.06);
		ctx.fillStyle = metal;
		ctx.fillRect(x + w * 0.55, y + h * 0.45, w * 0.35, h * 0.03);
		ctx.fillRect(x + w * 0.55, y + h * 0.42, w * 0.12, h * 0.03);
		ctx.fillRect(x + w * 0.88, y + h * 0.4, w * 0.02, h * 0.06);
		ctx.fillStyle = lightMetal;
		ctx.fillRect(x + w * 0.4, y + h * 0.46, w * 0.08, h * 0.02);
	}
};
ITEMS_DATA[ITEM_GREEN_GUN] = {
	name: "Acid Leech",
	desc: "Infinite toxic payload fueled by your own energy reserves. Can utilize Kinetic Barrier resources.",
	name_rus: "Кислотная пиявка",
	desc_rus: "Бесконечный запас токсинов, работающий напрямую от вашей энергии. Может задействовать ресурсы кинетического щита.",
	render: (ctx, x, y, w, h, animstate) => {
		const darkGreen = CW.venom.dark;
		const acidGreen = CW.venom.acid;
		const midGreen = CW.venom.mid;
		const tentacleColor = CW.venom.tentacle;
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
};
ITEMS_DATA[ITEM_REVOLVER] = {
	name: "Revolver",
	desc: "Classic six-shooter. Reliable and hard-hitting.",
	name_rus: "Револьвер",
	desc_rus: "Классический шестизарядник. Надежный и убойный.",
	render: (ctx, x, y, w, h) => {
		const silver = CW.common.silver;
		const lightSilver = CW.common.silver_light;
		const gripRubber = CW.common.metal_dark;
		const gripWood = CW.special.sword_handle;
		const darkMetal = CW.common.gray_dark;
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
		ctx.fillStyle = CW.common.gray;
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
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + w * 0.22, y + h * 0.38, w * 0.06, h *
			0.04);
		ctx.fillStyle = COLORS_DEFAULT.player.lime;
		ctx.fillRect(x + w * 0.88, y + h * 0.38, w * 0.03, h *
			0.03);
		ctx.strokeStyle = silver;
		ctx.lineWidth = w * 0.025;
		ctx.strokeRect(x + w * 0.3, y + h * 0.6, w * 0.14, h * 0.1);
		ctx.fillStyle = darkMetal;
		ctx.fillRect(x + w * 0.18, y + h * 0.4, w * 0.04, h * 0.06);
	}
};
ITEMS_DATA[ITEM_DESERT_EAGLE] = {
	name: "Desert Eagle",
	desc: "High-caliber hand cannon. Massive stopping power, heavy recoil.",
	name_rus: "Дезерт Игл",
	desc_rus: "Крупнокалиберная ручная пушка. Огромная убойная сила и сильная отдача.",
	render: (ctx, x, y, w, h) => {
		const silver = CW.common.silver_dark;
		const darkSilver = CW.common.metal_light;
		const grip = CW.common.metal_dark;
		ctx.strokeStyle = silver;
		ctx.lineWidth = w * 0.03;
		ctx.strokeRect(x + w * 0.35, y + h * 0.55, w * 0.15, h *
			0.1);
		ctx.fillStyle = grip;
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.2, h * 0.35);
		ctx.fillStyle = CW.common.silver_bright;
		ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.22);
		ctx.fillStyle = CW.common.silver_light;
		ctx.fillRect(x + w * 0.15, y + h * 0.35, w * 0.7, h * 0.05);
		ctx.fillStyle = silver;
		ctx.fillRect(x + w * 0.75, y + h * 0.3, w * 0.05, h * 0.05);
	}
};
ITEMS_DATA[ITEM_ROCKET_LAUNCHER] = {
	name: "Seeker Launcher",
	desc: "Fires high-velocity homing projectiles.",
	name_rus: "Установка «Ищейка»",
	desc_rus: "Выпускает высокоскоростные самонаводящиеся снаряды.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.special.rocket_body;
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
		ctx.fillStyle = CW.common.black;
		ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1);
		ctx.fillStyle = CW.special.rocket_eye;
		ctx.beginPath();
		ctx.arc(x + w * 0.8, y + h * 0.52, w * 0.1, 0, Math.PI * 2);
		ctx.fill();
	}
};
ITEMS_DATA[ITEM_ROCKET_SHOTGUN] = {
	name: "Homing Flak",
	desc: "Spreads micro-missiles that lock onto nearby heat signatures.",
	name_rus: "Самонаводящаяся дробь",
	desc_rus: "Разбрасывает микро-ракеты, захватывающие тепловые сигнатуры.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.special.rocket_body;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
		ctx.fillStyle = CW.special.rocket_alt;
		ctx.fillRect(x + w * 0.7, y + h * 0.35, w * 0.1, h * 0.1);
	}
};
ITEMS_DATA[ITEM_GUN] = {
	name: "Pistol",
	desc: "Standard 9mm handgun.",
	name_rus: "Пистолет",
	desc_rus: "Стандартный 9-мм пистолет.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.black;
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3);
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05);
	}
};
ITEMS_DATA[ITEM_SHOTGUN] = {
	name: "Shotgun",
	desc: "Powerful close-range weapon.",
	name_rus: "Дробовик",
	desc_rus: "Мощное оружие для ближнего боя.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.common.wood_alt;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
	}
};
ITEMS_DATA[ITEM_MINIGUN] = {
	name: "Minigun",
	desc: "Extremely high fire rate.",
	name_rus: "Миниган",
	desc_rus: "Экстремально высокая скорострельность.",
	render: (ctx, x, y, w, h) => {
		let mw = w * 0.9,
			mh = h * 0.25;
		let mx = x + w * 0.05,
			my = y + h * 0.45;
		ctx.fillStyle = CW.common.black;
		ctx.strokeStyle = CW.common.black;
		ctx.lineWidth = h * 0.06;
		ctx.lineJoin = "round";
		let padding = w * 0.015;
		ctx.fillRect(mx - padding, my - padding, mw * 0.3 + padding * 2,
			mh * 1.2 + padding * 2);
		ctx.fillRect(mx + mw * 0.3 - padding, my + mh * 0.1 - padding,
			mw * 0.7 + padding * 2, mh * 0.8 + padding * 2);
		ctx.beginPath();
		ctx.moveTo(mx + mw * 0.1, my);
		ctx.lineTo(mx + mw * 0.1, my - mh * 0.4);
		ctx.lineTo(mx + mw * 0.5, my - mh * 0.4);
		ctx.lineTo(mx + mw * 0.5, my + mh * 0.1);
		ctx.stroke();
		ctx.fillStyle = CW.special.minigun_blue;
		ctx.fillRect(mx, my, mw * 0.3, mh * 1.2);
		ctx.fillStyle = CW.special.minigun_blue_light;
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.1, mw * 0.7, mh * 0.8);
		ctx.fillStyle = CW.special.minigun_blue_dark;
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.3, mw * 0.7, mh * 0.1);
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.6, mw * 0.7, mh * 0.1);
		ctx.fillStyle = CW.special.minigun_blue;
		ctx.fillRect(mx + mw * 0.6, my + mh * 0.1, mw * 0.06, mh * 0.8);
		ctx.fillRect(mx + mw * 0.94, my + mh * 0.1, mw * 0.06, mh *
			0.8);
		ctx.strokeStyle = CW.special.minigun_blue;
		ctx.lineWidth = h * 0.03;
		ctx.lineJoin = "miter";
		ctx.beginPath();
		ctx.moveTo(mx + mw * 0.1, my);
		ctx.lineTo(mx + mw * 0.1, my - mh * 0.4);
		ctx.lineTo(mx + mw * 0.5, my - mh * 0.4);
		ctx.lineTo(mx + mw * 0.5, my + mh * 0.1);
		ctx.stroke();
	}
};
ITEMS_DATA[ITEM_PLASMA_LAUNCHER] = {
	name: "Plasma Launcher",
	desc: "Fires unstable plasma spheres.",
	name_rus: "Плазмомет",
	desc_rus: "Стреляет нестабильными сферами плазмы.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.energy.plasma_dark;
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
		ctx.fillStyle = CW.common.black;
		ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1);
		ctx.fillStyle = CW.energy.plasma;
		ctx.beginPath();
		ctx.arc(x + w * 0.8, y + h * 0.52, w * 0.1, 0, Math.PI * 2);
		ctx.fill();
	}
};
ITEMS_DATA[ITEM_RED_PISTOLS] = {
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
			ctx.fillStyle = CW.common.white_transp;
			ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
				scale, h * 0.04 * scale);
		};
		let mainColor = CW.special.red_main;
		drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2,
			mainColor);
		drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2,
			mainColor);
	}
};
ITEMS_DATA[ITEM_RED_SHOTGUN] = {
	name: "Red Shotgun",
	desc: "Enhanced model with tighter spread.",
	name_rus: "Красный дробовик",
	desc_rus: "Улучшенная модель с кучной стрельбой.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.special.red_main;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
		ctx.fillStyle = CW.common.metal;
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
	}
};
ITEMS_DATA[ITEM_RAINBOW_PISTOLS] = {
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
			ctx.fillStyle = CW.common.white_transp;
			ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
				scale, h * 0.04 * scale);
		};
		let mainColor = COLORS_DEFAULT.enemies.laser.rainbow[6];
		if (animstate != null) {
			let hue = (animstate * 4) % 360;
			mainColor = `hsl(${hue}, 70%, 50%)`;
		}
		drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2,
			mainColor);
		drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2,
			mainColor);
	}
};
ITEMS_DATA[ITEM_LASER_GUN] = {
	name: "Laser Gun",
	desc: "High-precision energy beam.",
	name_rus: "Лазерная пушка",
	desc_rus: "Высокоточный энергетический луч.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.energy.laser_main;
		ctx.fillRect(x + w * 0.1, y + h * 0.35, w * 0.7, h * 0.3);
		ctx.fillStyle = CW.energy.laser_accent;
		ctx.fillRect(x + w * 0.8, y + h * 0.35, w * 0.1, h * 0.3);
		ctx.fillStyle = CW.energy.laser_line;
		ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.5, h * 0.1);
	}
};
ITEMS_DATA[ITEM_PLASMA_PISTOL] = {
	name: "Plasma Pistol",
	desc: "Compact plasma firing sidearm.",
	name_rus: "Плазменный пистолет",
	desc_rus: "Компактное плазменное оружие.",
	render: (ctx, x, y, w, h) => {
		x = x + 0.05 * w;
		const bodyColor = CW.energy.plasma_dark;
		const energyColor = CW.energy.plasma;
		const darkDetail = CW.energy.plasma_vdark;
		ctx.fillStyle = bodyColor;
		ctx.beginPath();
		ctx.moveTo(x + w * 0.15, y + h * 0.5);
		ctx.lineTo(x + w * 0.1, y + h * 0.85);
		ctx.lineTo(x + w * 0.3, y + h * 0.85);
		ctx.lineTo(x + w * 0.35, y + h * 0.5);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(x + w * 0.1, y + h * 0.4);
		ctx.lineTo(x + w * 0.15, y + h * 0.35);
		ctx.lineTo(x + w * 0.6, y + h * 0.35);
		ctx.lineTo(x + w * 0.6, y + h * 0.55);
		ctx.lineTo(x + w * 0.1, y + h * 0.55);
		ctx.fill();
		ctx.fillStyle = darkDetail;
		ctx.fillRect(x + w * 0.6, y + h * 0.3, w * 0.15, h * 0.32);
		ctx.fillStyle = bodyColor;
		ctx.fillRect(x + w * 0.62, y + h * 0.32, w * 0.11, h * 0.28);
		ctx.fillStyle = darkDetail;
		ctx.fillRect(x + w * 0.2, y + h * 0.42, w * 0.35, h * 0.06);
		ctx.fillStyle = energyColor;
		for (let i = 0; i < 4; i++) {
			ctx.fillRect(x + w * (0.22 + i * 0.08), y + h * 0.44, w *
				0.05, h * 0.025);
		}
		ctx.fillStyle = darkDetail;
		ctx.fillRect(x + w * 0.18, y + h * 0.38, w * 0.02, h * 0.02);
		ctx.fillRect(x + w * 0.55, y + h * 0.38, w * 0.02, h * 0.02);
	}
};
ITEMS_DATA[ITEM_JUNK_CANNON] = {
	name: "Junk Cannon",
	desc: "Turns trash into lethal projectiles.",
	name_rus: "Хламотрон",
	desc_rus: "Превращает мусор в смертоносные снаряды.",
	render: (ctx, x, y, w, h) => {
		ctx.fillStyle = CW.special.junk_body;
		ctx.fillRect(x + 0.1 * w, y + 0.4 * h, 0.8 * w, 0.25 * h);
		ctx.fillStyle = CW.common.metal_dark;
		ctx.fillRect(x + 0.2 * w, y + 0.6 * h, 0.15 * w, 0.2 * h);
		ctx.fillStyle = CW.special.junk_alt;
		ctx.beginPath();
		ctx.arc(x + 0.5 * w, y + 0.35 * h, 0.2 * w, 0, Math.PI,
			true);
		ctx.fill();
		ctx.strokeStyle = CW.special.junk_stroke;
		ctx.lineWidth = 3;
		drawLine(ctx, x + 0.4 * w, y + 0.3 * h, x + 0.4 * w, y +
			0.65 * h, CW.special.junk_stroke);
	}
};
ITEMS_DATA[ITEM_SWORD] = {
	name: "Sword",
	desc: "A blade for honorable combat.",
	name_rus: "Меч",
	desc_rus: "Лезвие для благородного боя.",
	render: (ctx, x, y, w, h) => {
		ctx.save();
		ctx.translate(x + w * 0.5, y + h * 0.5);
		ctx.rotate(Math.PI / 4);
		let bladeColor = CW.special.sword_blade;
		let strokeColor = CW.special.sword_stroke;
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
		ctx.strokeStyle = CW.special.sword_lines;
		for (let i = 1; i < 4; i++) {
			let nodeY = (guardY - bH) + (i * bH * 0.25);
			drawLine(ctx, -bW / 2, nodeY, bW / 2, nodeY,
				CW.special.sword_lines, 1.5);
		}
		ctx.fillStyle = CW.common.white_transp;
		ctx.fillRect(-bW * 0.2, guardY - bH * 0.9, bW * 0.25, bH *
			0.8);
		ctx.fillStyle = CW.special.sword_handle;
		ctx.fillRect(-hW / 2, guardY, hW, hH);
		ctx.strokeStyle = "rgba(0,0,0,0.4)";
		ctx.strokeRect(-hW / 2, guardY, hW, hH);
		drawCircle(ctx, 0, guardY, 0.12 * w, CW.special.sword_guard,
			strokeColor,
			0.02 * w);
		for (let i = 1; i < 4; i++) {
			let ry = guardY + (i * hH * 0.25);
			drawLine(ctx, -hW / 2, ry, hW / 2, ry,
				"rgba(0,0,0,0.3)", 1);
		}
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_HORN] = {
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
};
ITEMS_DATA[ITEM_SNAKE_STAFF] = {
	name: "Serpent Staff",
	desc: "Unleashes a relentless torrent of concentrated venom. Feels alive.",
	name_rus: "Змеиный посох",
	desc_rus: "Выпускает непрерывный поток концентрированного яда. Кажется живым.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const snakeGreen = CW.venom.tentacle;
		const coreGreen = CW.venom.acid;
		const darkWood = COLORS_DEFAULT.entities.animals.deer.dark;
		ctx.save();
		ctx.fillStyle = darkWood;
		ctx.beginPath();
		ctx.moveTo(x + w * 0.47, y + h * 0.35);
		ctx.lineTo(x + w * 0.53, y + h * 0.35);
		ctx.lineTo(x + w * 0.52, y + h * 0.85);
		ctx.lineTo(x + w * 0.48, y + h * 0.85);
		ctx.fill();
		ctx.strokeStyle = darkWood;
		ctx.lineWidth = w * 0.04;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.arc(x + w * 0.4, y + h * 0.3, w * 0.1, 0, Math.PI * 0.8);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x + w * 0.6, y + h * 0.3, w * 0.1, Math.PI * 0.2, Math
			.PI);
		ctx.stroke();
		const pulse = Math.sin(t * 0.1) * 0.1 + 0.9;
		ctx.translate(x + w * 0.5, y + h * 0.22);
		ctx.shadowBlur = w * 0.1 * pulse;
		ctx.shadowColor = snakeGreen;
		ctx.fillStyle = snakeGreen;
		ctx.beginPath();
		ctx.arc(0, 0, w * 0.08 * pulse, 0, Math.PI * 2);
		ctx.fill();
		ctx.shadowBlur = 0;
		ctx.fillStyle = coreGreen;
		ctx.fillRect(-w * 0.01, -h * 0.04, w * 0.02, h * 0.08);
		for (let i = 0; i < 4; i++) {
			ctx.rotate((Math.PI * 2) / 4);
			let dist = w * 0.15 + Math.sin(t * 0.15 + i) * (w * 0.03);
			ctx.fillStyle = "rgba(68, 255, 0, 0.5)";
			ctx.beginPath();
			ctx.arc(dist, 0, w * 0.02, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_MUMMY_SHOTGUN] = {
	name: "Tomb Breaker",
	desc: "Rapid-fire ancient shotgun. Powered by blue soul energy but can utilize plasma.",
	name_rus: "Разрушитель гробниц",
	desc_rus: "Скорострельный древний дробовик. Питается синей энергией душ, но может задействовать плазму.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const glow = Math.sin(t * 0.15) * 0.5 + 0.5;
		ctx.save();
		ctx.fillStyle = CW.energy.soul_bg;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
		ctx.fillStyle = CW.energy.soul_outline;
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
		ctx.shadowBlur = w * 0.12 * glow;
		ctx.shadowColor = CW.energy.soul_glow;
		ctx.fillStyle = `rgb(0, ${180 + glow * 75}, 255)`;
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.5, h * 0.07);
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_MUMMY_PISTOLS] = {
	name: "Dual Soul Pistols",
	desc: "Pair of handguns that fire ghostly blue energy. Can utilize plasma.",
	name_rus: "Парные призрачные пистолеты",
	desc_rus: "Пара пистолетов, стреляющих призрачной синей энергией. Может задействовать плазму.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const glow = Math.sin(t * 0.15) * 0.5 + 0.5;
		let drawSinglePistol = (px, py, scale, color) => {
			ctx.save();
			ctx.fillStyle = color;
			ctx.fillRect(px, py, w * 0.35 * scale, h * 0.12 *
				scale);
			ctx.fillRect(px, py + h * 0.05 * scale, w * 0.1 * scale,
				h * 0.18 * scale);
			ctx.shadowBlur = w * 0.1 * glow;
			ctx.shadowColor = CW.energy.soul_glow;
			ctx.fillStyle = `rgb(0, ${150 + glow * 105}, 255)`;
			ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
				scale, h * 0.04 * scale);
			ctx.restore();
		};
		let mainColor = CW.energy.soul_bg;
		drawSinglePistol(x + w * 0.15, y + h * 0.25, 1.2, mainColor);
		drawSinglePistol(x + w * 0.45, y + h * 0.55, 1.2, mainColor);
	}
};
ITEMS_DATA[ITEM_SHADOW_STAFF] = {
	name: "Void Spinner",
	desc: "Unleashes shadow bolts in all directions. Requires plasma energy.",
	name_rus: "Теневой посох",
	desc_rus: "Выпускает теневые заряды во все стороны. Требует плазменной энергии.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		ctx.save();
		ctx.fillStyle = CW.energy.void_body;
		ctx.beginPath();
		ctx.moveTo(x + w * 0.48, y + h * 0.35);
		ctx.lineTo(x + w * 0.52, y + h * 0.35);
		ctx.lineTo(x + w * 0.51, y + h * 0.85);
		ctx.lineTo(x + w * 0.49, y + h * 0.85);
		ctx.fill();
		ctx.strokeStyle = CW.energy.void_body;
		ctx.lineWidth = w * 0.035;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.arc(x + w * 0.42, y + h * 0.3, w * 0.08, 0, Math.PI, true);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x + w * 0.58, y + h * 0.3, w * 0.08, 0, Math.PI, true);
		ctx.stroke();
		ctx.translate(x + w * 0.5, y + h * 0.22);
		ctx.rotate(t * 0.08);
		const radius = w * 0.15;
		const circumference = 2 * Math.PI * radius;
		const dashLen = circumference / 8;
		ctx.save();
		ctx.shadowBlur = w * 0.15;
		ctx.shadowColor = CW.energy.void_glow;
		ctx.strokeStyle = CW.energy.void_core;
		ctx.lineWidth = w * 0.02;
		ctx.setLineDash([dashLen, dashLen]);
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();
		const pulse = Math.sin(t * 0.1) * 0.05 + 0.95;
		ctx.shadowBlur = w * 0.08;
		ctx.shadowColor = COLORS_DEFAULT.ui.achievements.palette.purple;
		ctx.fillStyle = CW.common.black;
		ctx.beginPath();
		ctx.arc(0, 0, w * 0.07 * pulse, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = CW.energy.void_accent;
		ctx.fillRect(-w * 0.015, -h * 0.015, w * 0.03, h * 0.03);
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_SHADOW_DUAL_SHOTGUNS] = {
	name: "Abyssal Twins",
	desc: "Heavy shadow-shot spread. Powered by plasma.",
	name_rus: "Бездонные близнецы",
	desc_rus: "Тяжелые теневые дробовики. Заряжаются плазмой.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.5 + 0.5;
		let drawVoidShotgun = (px, py, scale) => {
			ctx.save();
			ctx.fillStyle = CW.energy.void_vdark;
			ctx.fillRect(px, py, w * 0.5 * scale, h * 0.12 * scale);
			ctx.fillRect(px - w * 0.05 * scale, py, w * 0.1 * scale,
				h * 0.25 * scale);
			ctx.fillStyle = CW.energy.void_purple;
			ctx.fillRect(px + w * 0.1 * scale, py - h * 0.02 *
				scale, w * 0.3 * scale, h * 0.05 * scale);
			ctx.shadowBlur = w * 0.05 * pulse;
			ctx.shadowColor = COLORS_DEFAULT.ui.achievements.palette
				.purple;
			ctx.fillStyle =
				`rgb(${100 + pulse * 50}, 0, ${200 + pulse * 55})`;
			ctx.fillRect(px + w * 0.15 * scale, py + h * 0.08 *
				scale, w * 0.3 * scale, h * 0.06 * scale);
			ctx.fillStyle = CW.common.white_transp;
			ctx.fillRect(px + w * 0.2 * scale, py + h * 0.09 *
				scale, w * 0.05 * scale, h * 0.04 * scale);
			ctx.restore();
		};
		drawVoidShotgun(x + w * 0.1, y + h * 0.2, 1.1);
		drawVoidShotgun(x + w * 0.4, y + h * 0.5, 1.1);
	}
};
ITEMS_DATA[ITEM_ANUBIS_SANDSTORM_STAFF] = {
	name: "Sandstorm Staff",
	desc: "Summons a devastating golden vortex of sand. Requires red plasma.",
	name_rus: "Посох песчаной бури",
	desc_rus: "Призывает разрушительный золотой вихрь песка. Требует красную плазму.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		ctx.fillStyle = CW.special.anubis_gold;
		ctx.fillRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.7);
		ctx.fillStyle = CW.special.anubis_orange;
		ctx.beginPath();
		ctx.moveTo(x + w * 0.5, y + h * 0.1);
		ctx.lineTo(x + w * 0.65, y + h * 0.25);
		ctx.lineTo(x + w * 0.5, y + h * 0.4);
		ctx.lineTo(x + w * 0.35, y + h * 0.25);
		ctx.fill();
		for (let i = 0; i < 6; i++) {
			let s = w * 0.03;
			let px = x + w * 0.5 + Math.cos(t * 0.1 + i) * (w * 0.2);
			let py = y + h * 0.25 + Math.sin(t * 0.1 + i) * (h * 0.15);
			ctx.fillStyle = CW.special.anubis_orange_transp;
			ctx.fillRect(px, py, s, s);
		}
	}
};
ITEMS_DATA[ITEM_ANUBIS_PUNISHER_ROD] = {
	name: "The Punisher",
	desc: "A divine heavy firearm. Each shot carries the weight of eternal judgment. Powered by red plasma.",
	name_rus: "Каратель",
	desc_rus: "Тяжелое божественное орудие. Каждый выстрел несет в себе тяжесть вечного суда. Заряжается от красной плазмы.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.5 + 0.5;
		const gold = CW.special.anubis_gold;
		const dark = CW.common.black_soft;
		const red = CW.special.red_glow;
		const lightGold = CW.common.white_gloss;
		ctx.save();
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.14, y + h * 0.53, w * 0.08, h * 0.2);
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.05, y + h * 0.4, w * 0.05, h * 0.2);
		for (let i = 0; i < 4; i++) {
			ctx.fillRect(x + w * 0.035, y + h * (0.41 + i * 0.05), w *
				0.015, h * 0.03);
		}
		ctx.fillStyle = gold;
		ctx.fillRect(x + w * 0.1, y + h * 0.43, w * 0.75, h * 0.14);
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.25, y + h * 0.46, w * 0.45, h * 0.07);
		ctx.fillStyle = `rgb(${150 + pulse * 105}, 0, 0)`;
		ctx.shadowBlur = 5 * pulse;
		ctx.shadowColor = red;
		ctx.fillRect(x + w * 0.26, y + h * 0.485, w * 0.43, h * 0.02);
		ctx.shadowBlur = 0;
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.3, y + h * 0.57, w * 0.11, h * 0.22);
		ctx.fillStyle = gold;
		ctx.fillRect(x + w * 0.3, y + h * 0.65, w * 0.11, h * 0.02);
		ctx.fillRect(x + w * 0.3, y + h * 0.72, w * 0.11, h * 0.02);
		ctx.fillStyle = dark;
		ctx.beginPath();
		for (let i = 0; i < 2; i++) {
			let ox = x + w * (0.5 + i * 0.15);
			ctx.moveTo(ox, y + h * 0.43);
			ctx.lineTo(ox + w * 0.08, y + h * 0.35);
			ctx.lineTo(ox + w * 0.08, y + h * 0.43);
		}
		ctx.fill();
		const bx = x + w * 0.28;
		const by = y + h * 0.43;
		ctx.beginPath();
		ctx.moveTo(bx, by);
		ctx.lineTo(bx, by - h * 0.08);
		ctx.lineTo(bx + w * 0.02, by - h * 0.16);
		ctx.lineTo(bx + w * 0.04, by - h * 0.08);
		ctx.lineTo(bx + w * 0.06, by - h * 0.16);
		ctx.lineTo(bx + w * 0.08, by - h * 0.07);
		ctx.lineTo(bx + w * 0.16, by - h * 0.07);
		ctx.lineTo(bx + w * 0.16, by - h * 0.04);
		ctx.lineTo(bx + w * 0.11, by);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = red;
		ctx.fillRect(bx + w * 0.08, by - h * 0.055, w * 0.015, h *
			0.01);
		ctx.fillStyle = dark;
		ctx.fillRect(x + w * 0.85, y + h * 0.46, w * 0.1, h * 0.08);
		ctx.fillStyle = gold;
		ctx.fillRect(x + w * 0.93, y + h * 0.45, w * 0.02, h * 0.1);
		ctx.fillStyle = lightGold;
		ctx.fillRect(x + w * 0.1, y + h * 0.43, w * 0.75, h * 0.015);
		ctx.restore();
	}
};
ITEMS_DATA[ITEM_BLOOD_PISTOL] = {
	name: "Blood Pistol",
	name_rus: "Кровавый пистолет",
	desc: "High-energy molecular synthesizer. Condenses red plasma into rapid-fire biological mass.",
	desc_rus: "Высокоэнергетический молекулярный синтезатор. Конденсирует красную плазму в скорострельную биологическую массу.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const darkBlood = "#4a0000";
		const brightRed = "#ff0000";
		ctx.fillStyle = darkBlood;
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.15, h * 0.3);
		ctx.fillStyle = "#660000";
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.05);
		ctx.fillStyle = brightRed;
		for (let i = 0; i < 3; i++) {
			let sx = x + w * (0.35 + i * 0.15);
			let sy = y + h * 0.4;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(sx + w * 0.04, sy - h * 0.1);
			ctx.lineTo(sx + w * 0.08, sy);
			ctx.fill();
		}
		const dropCycle = (t * 4) % 100;
		if (dropCycle < 70) {
			const dropY = (dropCycle / 70) * (h * 0.4);
			ctx.globalAlpha = 1 - (dropCycle / 70);
			ctx.beginPath();
			ctx.arc(x + w * 0.7, y + h * 0.55 + dropY, w * 0.02, 0, Math
				.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1.0;
		}
	}
};
ITEMS_DATA[ITEM_BLOOD_DUAL_SHOTGUNS] = {
	name: "Crimson Twins",
	desc: "Vampiric dual barrels. High spread, lethal impact.",
	name_rus: "Багровые близнецы",
	desc_rus: "Вампирические спаренные стволы. Большой разброс, смертоносная мощь.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.15) * 0.5 + 0.5;
		let drawBloodShotgun = (px, py, scale) => {
			ctx.save();
			ctx.fillStyle = "#2a0000";
			ctx.fillRect(px, py, w * 0.55 * scale, h * 0.14 *
				scale);
			ctx.fillRect(px - w * 0.05 * scale, py, w * 0.12 *
				scale, h * 0.28 * scale);
			ctx.fillStyle = "#880000";
			ctx.fillRect(px + w * 0.1 * scale, py - h * 0.02 *
				scale, w * 0.35 * scale, h * 0.04 * scale);
			ctx.shadowBlur = w * 0.08 * pulse;
			ctx.shadowColor = "#ff0000";
			ctx.fillStyle = `rgb(${150 + pulse * 105}, 0, 0)`;
			ctx.fillRect(px + w * 0.15 * scale, py + h * 0.08 *
				scale, w * 0.35 * scale, h * 0.07 * scale);
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect(px + w * 0.2 * scale, py + h * 0.1 * scale,
				w * 0.06 * scale, h * 0.03 * scale);
			ctx.restore();
		};
		drawBloodShotgun(x + w * 0.1, y + h * 0.15, 1.05);
		drawBloodShotgun(x + w * 0.35, y + h * 0.55, 1.05);
	}
};
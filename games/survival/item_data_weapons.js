ITEMS_DATA[ITEM_VENOM_SHOTGUN] = {
	name: "Venom Shotgun",
	desc: "Fires bursts of concentrated toxin.",
	name_rus: "Ядовитый обрез",
	desc_rus: "Стреляет сгустками концентрированного токсина.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.5 + 0.5;
		ctx.fillStyle = "#333";
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.2);
		ctx.fillStyle = "#5d2e0c";
		ctx.fillRect(x + w * 0.1, y + h * 0.5, w * 0.2, h * 0.2);
		ctx.fillStyle = `rgb(0, ${150 + pulse * 105}, 0)`;
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
		ctx.fillStyle = "#444";
		ctx.fillRect(x + w * 0.2, y + h * 0.4, w * 0.5, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.6, w * 0.1, h * 0.2);
		ctx.fillStyle = `rgb(0, ${100 + pulse * 155}, 0)`;
		ctx.fillRect(x + w * 0.45, y + h * 0.5, w * 0.12, h * 0.3);
		ctx.fillStyle = "#222";
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
			ctx.fillStyle = "#1a1a1a";
			ctx.fillRect(px, py, w * 0.5 * scale, h * 0.12 * scale);
			ctx.fillRect(px - w * 0.05 * scale, py, w * 0.1 * scale,
				h * 0.25 * scale);
			ctx.fillStyle = "#444";
			ctx.fillRect(px + w * 0.1 * scale, py - h * 0.02 *
				scale, w * 0.3 * scale, h * 0.05 * scale);
			ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
			ctx.fillRect(px + w * 0.15 * scale, py + h * 0.08 *
				scale, w * 0.3 * scale, h * 0.08 * scale);
			ctx.fillStyle = `rgb(0, ${150 + pulse * 105}, 0)`;
			ctx.fillRect(px + w * 0.16 * scale, py + h * 0.1 *
				scale, w * 0.28 * scale, h * 0.05 * scale);
			ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
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
	ITEMS_DATA[ITEM_STICK] = {
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
	};
ITEMS_DATA[ITEM_KALASHNIKOV] = {
	name: "Kalashnikov rifle",
	desc: "Reliable desert classic. High fire rate, distinctive yellow muzzle flash.",
	name_rus: "Автомат Калашникова",
	desc_rus: "Надежная классика пустыни. Высокая скорострельность и узнаваемая вспышка.",
	render: (ctx, x, y, w, h) => {
		const wood = "#8B4513";
		const metal = "#333";
		const lightMetal = "#555";
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
		ctx.fillRect(x + w * 0.55, y + h * 0.45, w * 0.35, h *
			0.03);
		ctx.fillRect(x + w * 0.55, y + h * 0.42, w * 0.12, h *
			0.03);
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
};
ITEMS_DATA[ITEM_REVOLVER] = {
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
};
ITEMS_DATA[ITEM_DESERT_EAGLE] = {
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
};
ITEMS_DATA[ITEM_ROCKET_LAUNCHER] = {
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
};
ITEMS_DATA[ITEM_ROCKET_SHOTGUN] = {
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
};
ITEMS_DATA[ITEM_GUN] = {
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
};
ITEMS_DATA[ITEM_SHOTGUN] = {
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
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#000000";
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
		ctx.fillStyle = "#113377";
		ctx.fillRect(mx, my, mw * 0.3, mh * 1.2);
		ctx.fillStyle = "#2255aa";
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.1, mw * 0.7, mh * 0.8);
		ctx.fillStyle = "#0a1f44";
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.3, mw * 0.7, mh * 0.1);
		ctx.fillRect(mx + mw * 0.3, my + mh * 0.6, mw * 0.7, mh * 0.1);
		ctx.fillStyle = "#113377";
		ctx.fillRect(mx + mw * 0.6, my + mh * 0.1, mw * 0.06, mh * 0.8);
		ctx.fillRect(mx + mw * 0.94, my + mh * 0.1, mw * 0.06, mh *
			0.8);
		ctx.strokeStyle = "#113377";
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
		ctx.fillStyle = "#331133";
		ctx.fillRect(x + w * 0.05, y + h * 0.3, w * 0.9, h * 0.45);
		ctx.fillStyle = "#000";
		ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.1);
		ctx.fillStyle = "cyan";
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
};
ITEMS_DATA[ITEM_RED_SHOTGUN] = {
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
};
ITEMS_DATA[ITEM_LASER_GUN] = {
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
};
ITEMS_DATA[ITEM_PLASMA_PISTOL] = {
	name: "Plasma Pistol",
	desc: "Compact plasma firing sidearm.",
	name_rus: "Плазменный пистолет",
	desc_rus: "Компактное плазменное оружие.",
	render: (ctx, x, y, w, h) => {
		x = x + 0.05 * w;
		const bodyColor = "#331133";
		const energyColor = "cyan";
		const darkDetail = "#110011";
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
		const snakeGreen = "#22aa44";
		const coreGreen = "#44ff00";
		const darkWood = "#1a0f05";
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
		ctx.fillStyle = "#D2B48C";
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.25);
		ctx.fillStyle = "#8b7355";
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.4, h * 0.15);
		ctx.shadowBlur = w * 0.12 * glow;
		ctx.shadowColor = "#00ffff";
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
			ctx.shadowColor = "#00ffff";
			ctx.fillStyle = `rgb(0, ${150 + glow * 105}, 255)`;
			ctx.fillRect(px + w * 0.05 * scale, py, w * 0.25 *
				scale, h * 0.04 * scale);
			ctx.restore();
		};
		let mainColor = "#D2B48C";
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
		ctx.fillStyle = "#1a0a25";
		ctx.beginPath();
		ctx.moveTo(x + w * 0.48, y + h * 0.35);
		ctx.lineTo(x + w * 0.52, y + h * 0.35);
		ctx.lineTo(x + w * 0.51, y + h * 0.85);
		ctx.lineTo(x + w * 0.49, y + h * 0.85);
		ctx.fill();
		ctx.strokeStyle = "#1a0a25";
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
		ctx.shadowColor = "rgba(170, 0, 255, 0.6)";
		ctx.strokeStyle = "#4400ff";
		ctx.lineWidth = w * 0.02;
		ctx.setLineDash([dashLen, dashLen]);
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.restore();
		const pulse = Math.sin(t * 0.1) * 0.05 + 0.95;
		ctx.shadowBlur = w * 0.08;
		ctx.shadowColor = "#8800ff";
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.arc(0, 0, w * 0.07 * pulse, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#ff00ff";
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
			ctx.fillStyle = "#0a0a0f";
			ctx.fillRect(px, py, w * 0.5 * scale, h * 0.12 * scale);
			ctx.fillRect(px - w * 0.05 * scale, py, w * 0.1 * scale,
				h * 0.25 * scale);
			ctx.fillStyle = "#220044";
			ctx.fillRect(px + w * 0.1 * scale, py - h * 0.02 *
				scale, w * 0.3 * scale, h * 0.05 * scale);
			ctx.shadowBlur = w * 0.05 * pulse;
			ctx.shadowColor = "#8800ff";
			ctx.fillStyle =
				`rgb(${100 + pulse * 50}, 0, ${200 + pulse * 55})`;
			ctx.fillRect(px + w * 0.15 * scale, py + h * 0.08 *
				scale, w * 0.3 * scale, h * 0.06 * scale);
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
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
		ctx.fillStyle = "#FFD700";
		ctx.fillRect(x + w * 0.47, y + h * 0.2, w * 0.06, h * 0.7);
		ctx.fillStyle = "#FFA500";
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
			ctx.fillStyle = "rgba(255, 165, 0, 0.6)";
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
		const gold = "#FFD700";
		const dark = "#1A1A1A";
		const red = "#FF0000";
		const lightGold = "rgba(255, 255, 255, 0.3)";
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
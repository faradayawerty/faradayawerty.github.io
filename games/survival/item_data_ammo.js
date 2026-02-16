ITEMS_DATA[ITEM_VENOM] = {
	name: "Venom",
	desc: "Concentrated toxin.",
	name_rus: "Яд",
	desc_rus: "Концентрированный токсин.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		let c = COLORS_DEFAULT.items.venom_vial;
		ctx.fillStyle = c.cork;
		ctx.fillRect(x + w * 0.4, y + h * 0.15, w * 0.2, h * 0.1);
		ctx.fillStyle = c.glass;
		ctx.fillRect(x + w * 0.25, y + h * 0.25, w * 0.5, h * 0.6);
		ctx.strokeStyle = c.glass_outline;
		ctx.lineWidth = 1;
		ctx.strokeRect(x + w * 0.25, y + h * 0.25, w * 0.5, h * 0.6);
		let greenPulse = c.liquid_base[1] + Math.sin(t * 0.1) * c
			.liquid_pulse;
		ctx.fillStyle =
			`rgb(${c.liquid_base[0]}, ${greenPulse}, ${c.liquid_base[2]})`;
		ctx.fillRect(x + w * 0.28, y + h * 0.45, w * 0.44, h * 0.37);
		ctx.fillStyle = c.skull;
		ctx.fillRect(x + w * 0.4, y + h * 0.52, w * 0.2, h * 0.15);
		ctx.fillRect(x + w * 0.44, y + h * 0.67, w * 0.12, h * 0.05);
		ctx.fillStyle = c.eyes;
		ctx.fillRect(x + w * 0.42, y + h * 0.55, w * 0.05, h * 0.05);
		ctx.fillRect(x + w * 0.53, y + h * 0.55, w * 0.05, h * 0.05);
		ctx.fillStyle = c.reflection;
		ctx.fillRect(x + w * 0.3, y + h * 0.3, w * 0.05, h * 0.2);
	}
};
ITEMS_DATA[ITEM_AMMO] = {
	name: "Ammo",
	desc: "Standard bullets.",
	name_rus: "Патроны",
	desc_rus: "Стандартные пули.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.ammo_standard;
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = c.main;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
ITEMS_DATA[ITEM_PLASMA] = {
	name: "Plasma Cells",
	desc: "Energy source for plasma weapons.",
	name_rus: "Плазменные ячейки",
	desc_rus: "Источник энергии для плазменного оружия.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.ammo_plasma;
		let N = 3;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = c.main;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.025 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
ITEMS_DATA[ITEM_RED_PLASMA] = {
	name: "Red Plasma",
	desc: "Overcharged plasma energy.",
	name_rus: "Красная плазма",
	desc_rus: "Перегруженная плазменная энергия.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.ammo_red_plasma;
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = c.main;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
ITEMS_DATA[ITEM_GREEN_AMMO] = {
	name: "Corrosive Ammo",
	desc: "Bullets filled with acid.",
	name_rus: "Кислотные пули",
	desc_rus: "Пули, наполненные кислотой.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.ammo_corrosive;
		let N = 4;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = c.main;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
ITEMS_DATA[ITEM_ROCKET] = {
	name: "Rockets",
	desc: "Explosive projectiles.",
	name_rus: "Ракеты",
	desc_rus: "Взрывоопасные снаряды.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.ammo_rocket;
		let N = 3;
		for (let i = 0; i < N; i++) {
			ctx.fillStyle = c.main;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tip;
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
ITEMS_DATA[ITEM_RAINBOW_AMMO] = {
	name: "Rainbow Core",
	desc: "Shifts elements unpredictably.",
	name_rus: "Радужное ядро",
	desc_rus: "Непредсказуемо меняет стихии.",
	render: (ctx, x, y, w, h, animstate) => {
		if (animstate == null) return;
		let c = COLORS_DEFAULT.items.ammo_rainbow;
		let N = 4;
		for (let i = 0; i < N; i++) {
			let idx = (i + Math.floor(animstate)) % 4;
			ctx.fillStyle = c.mains[idx];
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.5 * h);
			ctx.fillStyle = c.tips[idx];
			ctx.fillRect(x + i * w / N + 0.25 * w / N, y + 0.25 * h,
				0.5 * w / N, 0.125 * h);
			ctx.strokeStyle = c.outline;
			ctx.lineWidth = 0.01 * w;
			ctx.strokeRect(x + i * w / N + 0.25 * w / N, y + 0.25 *
				h, 0.5 * w / N, 0.5 * h);
		}
	}
};
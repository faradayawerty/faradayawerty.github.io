ITEMS_DATA[ITEM_CACTUS_JUICE] = {
	name: "Cactus Juice",
	desc: "It's the quenchiest! May cause mild hallucinations.",
	name_rus: "Кактусовый сок",
	desc_rus: "Отлично утоляет жажду! Возможны легкие галлюцинации.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.cactus_juice;
		ctx.fillStyle = c.bottle;
		ctx.beginPath();
		ctx.roundRect(x + w * 0.25, y + h * 0.2, w * 0.5, h * 0.7, w *
			0.05);
		ctx.fill();
		ctx.fillStyle = c.liquid;
		ctx.fillRect(x + w * 0.3, y + h * 0.5, w * 0.4, h * 0.35);
		ctx.fillStyle = c.label;
		ctx.fillRect(x + w * 0.25, y + h * 0.45, w * 0.5, h * 0.2);
		ctx.fillStyle = c.spike;
		ctx.fillRect(x + w * 0.47, y + h * 0.48, w * 0.06, h * 0.14);
		ctx.fillRect(x + w * 0.42, y + h * 0.52, w * 0.16, h * 0.04);
		ctx.fillStyle = c.spike;
		ctx.fillRect(x + w * 0.4, y + h * 0.15, w * 0.2, h * 0.08);
		ctx.strokeStyle = c.spike;
		ctx.lineWidth = w * 0.03;
		ctx.strokeRect(x + w * 0.25, y + h * 0.2, w * 0.5, h * 0.7);
	}
};
ITEMS_DATA[ITEM_HEALTH] = {
	name: "Health Kit",
	desc: "Restores a portion of HP.",
	name_rus: "Аптечка",
	desc_rus: "Восстанавливает часть здоровья.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.health_kit;
		ctx.fillStyle = c.bg;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = c.icon;
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = c.stroke;
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	}
};
ITEMS_DATA[ITEM_HEALTH_GREEN] = {
	name: "Advanced Medkit",
	desc: "Powerful regenerative chemicals.",
	name_rus: "Улучшенная аптечка",
	desc_rus: "Мощные регенерирующие химикаты.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.health_kit_adv;
		ctx.fillStyle = c.bg;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = c.icon;
		ctx.fillRect(x + w * 0.4, y + h * 0.3, w * 0.2, h * 0.4);
		ctx.fillRect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2);
		ctx.strokeStyle = c.stroke;
		ctx.lineWidth = h * 0.01;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	}
};
ITEMS_DATA[ITEM_FUEL] = {
	name: "Gasoline",
	desc: "Used to refuel vehicles.",
	name_rus: "Бензин",
	desc_rus: "Используется для заправки машин.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.fuel;
		ctx.fillStyle = c.body;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.4, y + h * 0.1, w * 0.05, h * 0.2);
		ctx.fillRect(x + w * 0.25, y + h * 0.1, w * 0.2, h * 0.05);
		ctx.lineWidth = 0.01 * w;
		ctx.strokeStyle = c.outline;
		ctx.strokeRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
		ctx.fillStyle = c.cap;
		ctx.fillRect(x + w * 0.55, y + h * 0.15, w * 0.2, h * 0.05);
		drawLine(ctx, x + w * 0.3, y + h * 0.3, x + w * 0.7, y + h *
			0.7, c.shadow, 0.05 * w);
		drawLine(ctx, x + w * 0.7, y + h * 0.3, x + w * 0.3, y + h *
			0.7, c.shadow, 0.05 * w);
		ctx.fillStyle = c.accent;
		ctx.fillRect(x + w * 0.45, y + h * 0.45, w * 0.1, h * 0.1);
	}
};
ITEMS_DATA[ITEM_SHIELD] = {
	name: "Energy Shield",
	desc: "Provides temporary protection.",
	name_rus: "Энергетический щит",
	desc_rus: "Дает временную защиту.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.shield_energy;
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, c.fill,
			c.outline, 0.05 * w);
	}
};
ITEMS_DATA[ITEM_SHIELD_RAINBOW] = {
	name: "Prismatic Shield",
	desc: "Maximum protection against all types.",
	name_rus: "Призматический щит",
	desc_rus: "Максимальная защита от всех типов урона.",
	render: (ctx, x, y, w, h, animstate) => {
		if (animstate == null) return;
		let c = COLORS_DEFAULT.items.shield_energy;
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
			c.outline, 0.05 * w);
	}
};
ITEMS_DATA[ITEM_SHIELD_GREEN] = {
	name: "Kinetic Barrier",
	desc: "Reinforced field that absorbs high-impact energy.",
	name_rus: "Кинетический барьер",
	desc_rus: "Усиленное поле, поглощающее энергию сильных ударов.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.shield_kinetic;
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, c.fill,
			c.outline, 0.05 * w);
	}
};
ITEMS_DATA[ITEM_BOSSIFIER] = {
	name: "Ultimate Bossifier",
	desc: "Can bossify any living thing.",
	name_rus: "Абсолютный Боссификатор",
	desc_rus: "Может боссифицировать любое живое создание.",
	render: (ctx, x, y, w, h, animstate) => {
		if (animstate == null) return;
		let c = COLORS_DEFAULT.items.bossifier;
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
		ctx.fillStyle = c.bg;
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
};
ITEMS_DATA[ITEM_CANNED_MEAT] = {
	name: "Canned Meat",
	desc: "Nutritious and long-lasting.",
	name_rus: "Тушенка",
	desc_rus: "Питательно и долго хранится.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.canned_meat;
		ctx.fillStyle = c.body;
		ctx.fillRect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.4);
		ctx.fillStyle = c.label;
		ctx.fillRect(x + w * 0.1, y + h * 0.4, w * 0.8, h * 0.2);
	}
};
ITEMS_DATA[ITEM_ORANGE] = {
	name: "Orange",
	desc: "Rich in Vitamin C.",
	name_rus: "Апельсин",
	desc_rus: "Богат витамином C.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.orange;
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w,
			c.skin, c.shadow, 0.05 * w);
		drawCircle(ctx, x + 0.4 * w, y + 0.4 * h, 0.05 * w,
			c.light, c.light, 0);
		ctx.fillStyle = c.stem;
		ctx.fillRect(x + 0.48 * w, y + 0.25 * h, 0.04 * w, 0.04 *
			h);
	}
};
ITEMS_DATA[ITEM_APPLE] = {
	name: "Apple",
	desc: "A fresh, crunchy snack.",
	name_rus: "Яблоко",
	desc_rus: "Свежий и хрустящий перекус.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.apple;
		ctx.fillStyle = c.skin;
		ctx.beginPath();
		ctx.ellipse(x + 0.5 * w, y + 0.55 * h, 0.24 * w, 0.24 * h,
			0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = c.shadow;
		ctx.lineWidth = 0.03 * w;
		ctx.stroke();
		drawLine(ctx, x + 0.5 * w, y + 0.35 * h, x + 0.5 * w, y +
			0.15 * h, c.stem, 0.04 * w);
		ctx.fillStyle = c.leaf;
		ctx.beginPath();
		ctx.ellipse(x + 0.6 * w, y + 0.22 * h, 0.1 * w, 0.05 * w, -
			Math.PI / 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = c.light;
		ctx.beginPath();
		ctx.ellipse(x + 0.4 * w, y + 0.45 * h, 0.07 * w, 0.07 * w,
			0, 0, Math.PI * 2);
		ctx.fill();
	}
};
ITEMS_DATA[ITEM_CHERRIES] = {
	name: "Cherries",
	desc: "Small but sweet.",
	name_rus: "Вишни",
	desc_rus: "Маленькие, но сладкие.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.cherries;
		drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.35 * w, y +
			0.65 * h, c.stem, 0.04 * w);
		drawLine(ctx, x + 0.5 * w, y + 0.25 * h, x + 0.65 * w, y +
			0.65 * h, c.stem, 0.04 * w);
		drawCircle(ctx, x + 0.35 * w, y + 0.7 * h, 0.12 * w,
			c.fruit1, c.shadow, 0.02 * w);
		drawCircle(ctx, x + 0.65 * w, y + 0.7 * h, 0.12 * w,
			c.fruit2, c.shadow, 0.02 * w);
		drawCircle(ctx, x + 0.32 * w, y + 0.65 * h, 0.03 * w,
			c.light, "none", 0);
		drawCircle(ctx, x + 0.62 * w, y + 0.65 * h, 0.03 * w,
			c.light, "none", 0);
	}
};
ITEMS_DATA[ITEM_CHICKEN_LEG] = {
	name: "Chicken Leg",
	desc: "Fried to perfection.",
	name_rus: "Куриная ножка",
	desc_rus: "Идеально прожарена.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.chicken;
		drawLine(ctx, x + 0.5 * w, y + 0.6 * h, x + 0.5 * w, y +
			0.85 * h, c.bone, 0.08 * w);
		drawCircle(ctx, x + 0.45 * w, y + 0.85 * h, 0.05 * w,
			c.bone, c.bone_shadow, 0.01 * w);
		drawCircle(ctx, x + 0.55 * w, y + 0.85 * h, 0.05 * w,
			c.bone, c.bone_shadow, 0.01 * w);
		ctx.fillStyle = c.meat_dark;
		ctx.beginPath();
		ctx.ellipse(x + 0.5 * w, y + 0.4 * h, 0.2 * w, 0.28 * h, 0,
			0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = c.meat_light;
		ctx.beginPath();
		ctx.ellipse(x + 0.45 * w, y + 0.35 * h, 0.12 * w, 0.18 * h,
			0, 0, Math.PI * 2);
		ctx.fill();
	}
};
ITEMS_DATA[ITEM_CHOCOLATE] = {
	name: "Chocolate",
	desc: "Quick energy boost.",
	name_rus: "Шоколад",
	desc_rus: "Быстрый заряд энергии.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.chocolate;
		ctx.fillStyle = c.dark;
		ctx.fillRect(x + w * 0.2, y + h * 0.15, w * 0.6, h * 0.7);
		ctx.fillStyle = c.wrapper;
		ctx.fillRect(x + w * 0.2, y + h * 0.45, w * 0.6, h * 0.45);
		ctx.strokeStyle = c.border;
		ctx.lineWidth = 1;
		ctx.strokeRect(x + w * 0.25, y + h * 0.2, w * 0.2, h * 0.2);
		ctx.strokeRect(x + w * 0.55, y + h * 0.2, w * 0.2, h * 0.2);
		ctx.fillStyle = c.gold;
		ctx.fillRect(x + w * 0.2, y + h * 0.55, w * 0.6, h * 0.05);
	}
};
ITEMS_DATA[ITEM_WATER] = {
	name: "Water",
	desc: "Essential for survival.",
	name_rus: "Вода",
	desc_rus: "Необходима для выживания.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.water;
		ctx.fillStyle = c.bottle;
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = c.liquid;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	}
};
ITEMS_DATA[ITEM_COLA] = {
	name: "Cola",
	desc: "Sugary and carbonated.",
	name_rus: "Кола",
	desc_rus: "Сладкая и газированная.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.cola;
		ctx.fillStyle = c.bottle;
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
		ctx.fillStyle = c.liquid;
		ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
	}
};
ITEMS_DATA[ITEM_MILK] = {
	name: "Milk",
	desc: "Good for your bones.",
	name_rus: "Молоко",
	desc_rus: "Полезно для костей.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.milk;
		ctx.fillStyle = c.top;
		ctx.fillRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.4);
		ctx.fillStyle = c.bottom;
		ctx.fillRect(x + w * 0.2, y + h * 0.5, w * 0.6, h * 0.4);
		ctx.lineWidth = 0.05 * w;
		ctx.strokeStyle = c.outline;
		ctx.strokeRect(x + w * 0.2, y + h * 0.1, w * 0.6, h * 0.8);
	}
};
ITEMS_DATA[ITEM_SHADOW_SHIELD] = {
	name: "Shadow Carapace",
	desc: "A void shield that grants spectral dash and evasion.",
	name_rus: "Теневой панцирь",
	desc_rus: "Теневой щит, дарующий призрачный рывок и уклонение.",
	render: (ctx, x, y, w, h) => {
		let c = COLORS_DEFAULT.items.shield_shadow;
		drawCircle(ctx, x + 0.5 * w, y + 0.5 * h, 0.25 * w, c.fill,
			c.outline, 0.05 * w);
	}
};
ITEMS_DATA[ITEM_ANUBIS_REGEN_SHIELD] = {
	name: "Sun-God Aegis",
	desc: "A relic of the dawn. Its solar rays mend wounds and purge fatigue.",
	name_rus: "Эгида Бога Солнца",
	desc_rus: "Реликвия рассвета. Её солнечные лучи заживляют раны и прогоняют усталость.",
	render: (ctx, x, y, w, h, animstate) => {
		const t = animstate || 0;
		const pulse = Math.sin(t * 0.1) * 0.05;
		let c = COLORS_DEFAULT.items.aegis;
		ctx.save();
		ctx.translate(x + w * 0.5, y + h * 0.5);
		ctx.fillStyle = c.body;
		ctx.strokeStyle = c.gold;
		ctx.lineWidth = w * 0.025;
		ctx.lineJoin = "round";
		ctx.shadowBlur = w * 0.1 * (1 + pulse);
		ctx.shadowColor = c.gold;
		ctx.beginPath();
		ctx.arc(0, -h * 0.15, w * 0.12, 0.8 * Math.PI, 0.2 * Math.PI,
			false);
		ctx.bezierCurveTo(w * 0.15, -h * 0.1, w * 0.25, -h * 0.2, w *
			0.45, -h * 0.15);
		ctx.quadraticCurveTo(w * 0.35, h * 0.15, w * 0.1, h * 0.1);
		ctx.lineTo(w * 0.1, h * 0.35);
		ctx.lineTo(-w * 0.1, h * 0.35);
		ctx.lineTo(-w * 0.1, h * 0.1);
		ctx.quadraticCurveTo(-w * 0.35, h * 0.15, -w * 0.45, -h * 0.15);
		ctx.bezierCurveTo(-w * 0.25, -h * 0.2, -w * 0.15, -h * 0.1, -w *
			0.12, -h * 0.15);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.shadowBlur = 0;
		ctx.beginPath();
		for (let i = 1; i <= 3; i++) {
			ctx.moveTo(w * (0.1 + i * 0.05), h * 0.08);
			ctx.lineTo(w * (0.15 + i * 0.08), -h * 0.1);
			ctx.moveTo(-w * (0.1 + i * 0.05), h * 0.08);
			ctx.lineTo(-w * (0.15 + i * 0.08), -h * 0.1);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, w * 0.15, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.save();
		ctx.shadowBlur = w * 0.15 * (1 + pulse);
		ctx.shadowColor = c.gold;
		ctx.fillStyle = c.gold;
		ctx.globalAlpha = 0.6 + pulse * 4;
		ctx.beginPath();
		ctx.arc(0, 0, w * 0.08, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		ctx.fillStyle = c.gold;
		for (let i = 0; i < 4; i++) {
			let r = w * 0.04;
			let ang = t * 0.1 + (i * Math.PI / 2);
			ctx.beginPath();
			ctx.arc(Math.cos(ang) * r, Math.sin(ang) * r, w * 0.015, 0,
				Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
};
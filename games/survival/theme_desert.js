ENEMY_TYPES["desert"] = {
	name_eng: "desert dweller",
	name_rus: "пустынный заражённый",
	requires: "regular",
	weight: 2,
	health: enemy_health_from_tier(2.75),
	speed: 5.5,
	damage: enemy_damage_from_tier(3.25),
	w: 30,
	h: 30,
	eye_color: E_COLS.desert.eye,
	color: E_COLS.desert.body,
	outline: E_COLS.desert.outline,
	range: 450,
	delay: 400,
	bossifier_item: ITEM_BOSSIFIER_DESERT,
	theme: THEME_DESERT,
	max_minions: 2,
	visuals: {
		glowColor: "black",
		draw_gun: false,
		draw_gun_boss: true,
		gun_color: E_COLS.desert.gun,
		gun_width: 0.2,
		outline_width: 1
	},
	boss_behaviour: (obj, dt, target, vars) => {
		let e = obj.data;
		if (vars.v < e.shooting_range) {
			if (e.shooting_delay >= 400) {
				bullet_create(
					obj.game,
					e.body.position.x,
					e.body.position.y,
					vars.ndx,
					vars.ndy,
					18,
					e.damage,
					true,
					e.w * 0.15,
					1500,
					E_COLS.desert.bullet_fill,
					E_COLS.desert.bullet_outline,
				);
				e.shooting_delay = 0;
			}
			vars.dx *= 0.5;
			vars.dy *= 0.5;
		}
	},
	on_death: (obj, target) => {
		if (target?.name == "player") achievement_do(target.data
			.achievements_element.data.achievements,
			"desert heat", target.data
			.achievements_shower_element);
	},
	on_boss_death: (obj, target) => {
		if (8 * Math.random() < 1)
			item_create(obj.game, ITEM_REVOLVER, obj.data.body
				.position.x, obj
				.data.body.position.y, false, false);
		else
			item_create(obj.game, ITEM_KALASHNIKOV, obj.data.body
				.position.x, obj
				.data.body.position.y, false, false);
		if (target?.name == "player") achievement_do(target.data
			.achievements_element.data.achievements,
			"sand lord", target.data
			.achievements_shower_element);
	},
	render_icon: (ctx, x, y, w, h) => {
		ctx.fillStyle = E_COLS.desert.gun;
		ctx.fillRect(x + w * 0.56, y + h * 0.53, w * 0.15, h *
			0.08);
		ctx.fillStyle = E_COLS.desert.body;
		ctx.fillRect(x + w * 0.38, y + h * 0.5, w * 0.18, h * 0.18);
	},
};
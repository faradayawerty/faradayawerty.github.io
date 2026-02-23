const E_COLS = COLORS_DEFAULT.enemies;
let ENEMY_TIER_REGULAR = 1;
let ENEMY_TIER_SHOOTING = 3;
let ENEMY_TIER_SHOOTING_RED = 6;
let ENEMY_TIER_SWORD = 7;
let ENEMY_TIER_SHOOTING_ROCKET = 10;
let ENEMY_TIER_SHOOTING_LASER = 19;
let ENEMY_TIER_DESERT = 2;
let ENEMY_TIER_MUMMY = 4;
let ENEMY_TIER_SHADOW = 11;
let ENEMY_TIER_ANUBIS = 15;
let ENEMY_TIER_SNOW = 5;
let ENEMY_TIER_USHANKA = 8;
let ENEMY_TIER_SNOWMAN = 12;
let ENEMY_TIER_KRAMPUS = 16;
let ENEMY_TIER_BLOOD = 9;
let ENEMY_TIER_PUMPKIN_SKELETON = 13;
let ENEMY_TIER_VAMPIRE = 14;
let ENEMY_TIER_NECROMANCER = 17;
let ENEMY_TIER_DEVIL = 18;
let ENEMY_TIER_ANIMALS = ENEMY_TIER_SHOOTING_LASER + 1;

function enemy_health_from_tier(n) {
	return game_round(1000 * weapon_damage_from_tier(n - 1));
}

function enemy_damage_from_tier(n) {
	const points = [{
			tier: ENEMY_TIER_REGULAR,
			dmg: 100
		},
		{
			tier: ENEMY_TIER_SHOOTING,
			dmg: 200
		},
		{
			tier: ENEMY_TIER_SWORD,
			dmg: 600
		},
		{
			tier: ENEMY_TIER_SHADOW,
			dmg: 1100
		},
		{
			tier: ENEMY_TIER_PUMPKIN_SKELETON,
			dmg: 2100
		},
		{
			tier: ENEMY_TIER_ANUBIS,
			dmg: 3100
		},
		{
			tier: ENEMY_TIER_SHOOTING_LASER,
			dmg: 5100
		}
	];
	let low, high;
	if (n <= points[0].tier) {
		[low, high] = [points[0], points[1]];
	}
	else if (n >= points[points.length - 1].tier) {
		low = points[points.length - 2];
		high = points[points.length - 1];
	}
	else {
		for (let i = 0; i < points.length - 1; i++) {
			if (n >= points[i].tier && n <= points[i + 1].tier) {
				low = points[i];
				high = points[i + 1];
				break;
			}
		}
	}
	const tierDiff = high.tier - low.tier;
	const dmgDiff = high.dmg - low.dmg;
	const ratio = dmgDiff / tierDiff;
	const total_10s = low.dmg + (n - low.tier) * ratio;
	let seconds_to_kill = 20;
	return total_10s / 1000 * (10 / seconds_to_kill);
}
const ENEMY_TYPES = {
	"regular": {
		name_eng: "regular zombie",
		name_rus: "заражённый",
		requires: null,
		eye_color: E_COLS.regular.eye,
		weight: 1,
		health: enemy_health_from_tier(ENEMY_TIER_REGULAR),
		speed: 7,
		damage: 2 * enemy_damage_from_tier(ENEMY_TIER_REGULAR),
		w: 30,
		h: 30,
		color: E_COLS.regular.body,
		outline: E_COLS.regular.outline,
		range: 400,
		delay: 1000,
		bossifier_item: ITEM_BOSSIFIER_REGULAR,
		max_minions: 2,
		visuals: {
			draw_gun: false,
			outline_width: 1
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"shoot 'em up", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.33 ? ITEM_MINIGUN :
				ITEM_SHOTGUN, obj.data.body.position.x, obj.data
				.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements, "big guy",
				target.data.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.regular.body;
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
		},
	},
	"shooting": {
		name_eng: "shooting zombie",
		name_rus: "заражённый военный",
		requires: "regular",
		weight: 2,
		eye_color: E_COLS.shooting.eye,
		health: enemy_health_from_tier(ENEMY_TIER_SHOOTING),
		speed: 5,
		damage: 100 / 17 * enemy_damage_from_tier(ENEMY_TIER_SHOOTING),
		w: 30,
		h: 30,
		color: E_COLS.shooting.body,
		outline: E_COLS.shooting.outline,
		range: 400,
		delay: 1000,
		bossifier_item: ITEM_BOSSIFIER_SHOOTING,
		max_minions: 4,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: E_COLS.shooting.gun,
			gun_width: 0.25,
			outline_width: 1
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 1000) {
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 10, e.damage,
						true, e.w * 0.2, 2000, COLORS_DEFAULT
						.enemies.shooting.bullet_fill,
						COLORS_DEFAULT.enemies.shooting
						.bullet_outline);
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"they can shoot?", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_PLASMA_PISTOL :
				ITEM_PLASMA_LAUNCHER;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big shooting guy", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.shooting.body;
			ctx.fillRect(x + w * 0.38, y + h * 0.5, w * 0.18, h * 0.18);
			ctx.fillStyle = E_COLS.shooting.gun;
			ctx.fillRect(x + w * 0.56, y + h * 0.53, w * 0.15, h *
				0.08);
		},
	},
	"desert": {
		name_eng: "desert dweller",
		name_rus: "пустынный заражённый",
		requires: "regular",
		weight: 2,
		health: enemy_health_from_tier(ENEMY_TIER_DESERT),
		speed: 5.5,
		damage: 1.9 * enemy_damage_from_tier(ENEMY_TIER_DESERT),
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
	},
	"shooting red": {
		name_eng: "shooting red zombie",
		name_rus: "заражённый биоробот",
		requires: "shooting",
		weight: 3,
		health: enemy_health_from_tier(ENEMY_TIER_SHOOTING_RED),
		speed: 8,
		damage: 100 / 110 * 100 / 80 * 100 / 110 * enemy_damage_from_tier(
			ENEMY_TIER_SHOOTING_RED),
		w: 30,
		h: 30,
		eye_color: E_COLS.shooting_red.eye,
		color: E_COLS.shooting_red.body,
		outline: E_COLS.shooting_red.outline,
		range: 400,
		delay: 200,
		bossifier_item: ITEM_BOSSIFIER_RED,
		max_minions: 3,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: E_COLS.shooting_red.gun,
			gun_width: 0.21,
			double_gun: true,
			double_gun_minion: true,
			double_gun_boss: false,
			outline_is_relative: true,
			outline_width: 0.05
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (!e.boss && e.shooting_delay >= 200) {
					bullet_create(obj.game, e.body.position.x + e.w, e
						.body.position.y, vars.dx, vars.dy, 15, e
						.damage, true, Math.max(0.09 * e.w, 4),
						2000, E_COLS.shooting_red.bullet_main,
						"white");
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 15, e.damage,
						true, Math.max(0.09 * e.w, 4), 2000, E_COLS
						.shooting_red.bullet_main,
						"white");
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				for (let i = -3; i <= 3; i++) {
					let theta = Math.PI * i / 14;
					let rotatedX = vars.ndx * Math.cos(theta) - vars
						.ndy * Math.sin(theta);
					let rotatedY = vars.ndx * Math.sin(theta) + vars
						.ndy * Math.cos(theta);
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, rotatedX, rotatedY, 25, e
						.damage, true, e.w * 0.1, 2000, E_COLS
						.shooting_red.bullet_main,
						E_COLS.shooting_red.bullet_alt);
				}
				e.shooting_delay = 0;
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"red shooter", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_RED_SHOTGUN :
				ITEM_RED_PISTOLS;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big red guy", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.shooting_red.body;
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = E_COLS.shooting_red.gun;
			ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.15, h * 0.06);
			ctx.fillRect(x + w * 0.55, y + h * 0.62, w * 0.15, h *
				0.06);
		},
	},
	"sword": {
		name_eng: "zombie with a sword",
		name_rus: "бамбуковый заражённый",
		requires: "shooting red",
		eye_color: E_COLS.sword.eye,
		weight: 4,
		health: enemy_health_from_tier(ENEMY_TIER_SWORD),
		speed: 9.75,
		boss_speed_mult: 1.925,
		boss_max_health_mult: 0.95,
		minion_speed_mult: 0,
		minion_max_health_mult: 0.25,
		damage: 2 * 100 / 130 * enemy_damage_from_tier(ENEMY_TIER_SWORD),
		w: 30,
		h: 30,
		color: E_COLS.sword.body,
		outline: E_COLS.sword.outline,
		range: 400,
		delay: 500,
		max_minions: 25,
		minion_dist_mult: 5.25,
		bossifier_item: ITEM_BOSSIFIER_SWORD,
		visuals: {
			draw_gun: false,
			draw_gun_boss: false,
			draw_sword: true,
			sword_color: E_COLS.sword.sword,
			outline_width: 1
		},
		minion_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.tx, vars.ty, 7, e.damage,
					true, 0.33 * e.w, 2000, E_COLS.sword
					.bullet_fill, E_COLS.sword.bullet_outline);
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.ty, -vars.tx, 7, e.damage,
					true, 0.33 * e.w, 2000, E_COLS.sword
					.bullet_fill, E_COLS.sword.bullet_outline);
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, -vars.tx, -vars.ty, 7, e.damage,
					true, 0.33 * e.w, 2000, E_COLS.sword
					.bullet_fill, E_COLS.sword.bullet_outline);
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, -vars.ty, vars.tx, 7, e.damage,
					true, 0.33 * e.w, 2000, E_COLS.sword
					.bullet_fill, E_COLS.sword.bullet_outline);
				e.shooting_delay = 0;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.jump_delay >= 1000 && vars.v > 500) {
				e.jump_delay = 0;
				Matter.Body.setPosition(e.body, Matter.Vector.create(-e
					.body.position.x + 2 * target.data.body
					.position.x, -e.body.position.y + 2 * target
					.data.body.position.y));
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"he has a sword?", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_GREEN_GUN :
				ITEM_SWORD;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big guy with a sword", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.sword.body;
			ctx.fillRect(x + w * 0.38, y + h * 0.55, w * 0.18, h *
				0.18);
			ctx.strokeStyle = E_COLS.sword.sword;
			ctx.lineWidth = h * 0.045;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.5, y + h * 0.7);
			ctx.lineTo(x + w * 0.65, y + h * 0.45);
			ctx.stroke();
		},
	},
	"mummy": {
		name_eng: "ancient mummy",
		eye_color: E_COLS.mummy.eye,
		name_rus: "древняя мумия",
		requires: "desert",
		weight: 3,
		health: enemy_health_from_tier(ENEMY_TIER_MUMMY),
		speed: 4.2,
		damage: enemy_damage_from_tier(ENEMY_TIER_MUMMY),
		w: 30,
		h: 30,
		color: E_COLS.mummy.body,
		outline: E_COLS.mummy.outline,
		range: 450,
		delay: 1000,
		theme: THEME_DESERT,
		bossifier_item: ITEM_BOSSIFIER_MUMMY,
		max_minions: 3,
		visuals: {
			glowColor: "black",
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: E_COLS.mummy.gun,
			gun_width: 0.22,
			double_gun: true,
			double_gun_minion: true,
			double_gun_boss: false,
			custom_draw_above: true,
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				let speed = Math.sqrt(e.body.velocity.x ** 2 + e.body
					.velocity.y ** 2);
				let bob = (speed > 0.5) ? Math.abs(Math.cos(Date.now() *
					0.008)) * (h * 0.08) : Math.sin(Date.now() *
					0.002) * (h * 0.03);
				ctx.save();
				ctx.strokeStyle = E_COLS.mummy.bandage_shadow;
				ctx.lineWidth = 1.5;
				let bodyY = y - h * 0.3 + bob;
				for (let i = 0; i < h * 0.7; i += 6) {
					ctx.beginPath();
					ctx.moveTo(x - w * 0.35, bodyY + i);
					ctx.lineTo(x + w * 0.35, bodyY + i);
					ctx.stroke();
				}
				let headY = y - h * 0.5 + bob;
				for (let i = -h * 0.2; i < h * 0.15; i += 5) {
					ctx.beginPath();
					ctx.moveTo(x - w * 0.2, headY + i);
					ctx.lineTo(x + w * 0.2, headY + i);
					ctx.stroke();
				}
				ctx.shadowBlur = 10;
				ctx.shadowColor = E_COLS.mummy.glow;
				ctx.restore();
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 200 && !e.boss) {
					bullet_create(obj.game, e.body.position.x + e.w, e
						.body.position.y, vars.dx, vars.dy, 15, e
						.damage, true, Math.max(0.09 * e.w, 4),
						2000, E_COLS.mummy.glow, "white",
						false, false, null
					);
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 15, e.damage,
						true, Math.max(0.09 * e.w, 4), 2000,
						E_COLS.mummy.glow,
						"white",
						false, false, null
					);
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				for (let i = -3; i <= 3; i++) {
					let theta = Math.PI * i / 14;
					let rx = vars.ndx * Math.cos(theta) - vars.ndy *
						Math.sin(theta);
					let ry = vars.ndx * Math.sin(theta) + vars.ndy *
						Math.cos(theta);
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, rx, ry, 25, e.damage, true, e
						.w * 0.1, 2000,
						E_COLS.mummy.glow,
						"white",
						false, false, null
					);
				}
				e.shooting_delay = 0;
			}
		},
		render_icon: (ctx, x, y, w, h) => {
			y = y - h * 0.1;
			ctx.fillStyle = "#222222";
			ctx.strokeStyle = E_COLS.mummy.outline;
			ctx.lineWidth = w * 0.02;
			ctx.fillRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.strokeRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.strokeStyle = E_COLS.mummy.body;
			ctx.lineWidth = w * 0.02;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.4, y + h * 0.62);
			ctx.lineTo(x + w * 0.6, y + h * 0.62);
			ctx.moveTo(x + w * 0.4, y + h * 0.68);
			ctx.lineTo(x + w * 0.6, y + h * 0.73);
			ctx.moveTo(x + w * 0.4, y + h * 0.75);
			ctx.lineTo(x + w * 0.6, y + h * 0.70);
			ctx.stroke();
			ctx.fillStyle = E_COLS.mummy.glow;
			ctx.shadowBlur = 4;
			ctx.shadowColor = E_COLS.mummy.glow;
			ctx.fillRect(x + w * 0.43, y + h * 0.64, w * 0.04, h *
				0.04);
			ctx.fillRect(x + w * 0.53, y + h * 0.64, w * 0.04, h *
				0.04);
			ctx.shadowBlur = 0;
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"ancient mummy", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_MUMMY_SHOTGUN :
				ITEM_MUMMY_PISTOLS;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big mummy guy", target.data
				.achievements_shower_element);
		},
	},
	"shooting rocket": {
		name_eng: "zombie with a rocket launcher",
		name_rus: "заражённый военный биоробот",
		requires: "sword",
		weight: 5,
		health: enemy_health_from_tier(ENEMY_TIER_SHOOTING_ROCKET),
		speed: 4.75,
		damage: 5 * 100 / 83 * enemy_damage_from_tier(
			ENEMY_TIER_SHOOTING_ROCKET),
		w: 30,
		h: 30,
		color: E_COLS.rocket.body,
		outline: E_COLS.rocket.outline,
		eye_color: E_COLS.rocket.eye,
		range: 400,
		delay: 2500,
		bossifier_item: ITEM_BOSSIFIER_ROCKET,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: E_COLS.rocket.gun,
			gun_width: 0.25,
			outline_width: 1
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 2500) {
					rocket_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, Math.min(
							0.25 * e.w, 10), target, e.damage, e
						.max_health * 0.025);
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"rocket shooter", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_ROCKET_SHOTGUN :
				ITEM_ROCKET_LAUNCHER;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (Math.random() < 0.5) {
				let tank_colors = ["green", "#005533", "#003355",
					"#aaaa11"
				];
				car_create(obj.game, obj.data.body.position.x, obj.data
					.body.position.y, tank_colors[Math.floor(Math
						.random() * tank_colors.length)], true, true
				);
			}
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big military guy", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.rocket.body;
			ctx.fillRect(x + w * 0.38, y + h * 0.5, w * 0.18, h * 0.18);
			ctx.fillStyle = E_COLS.rocket.gun;
			ctx.fillRect(x + w * 0.56, y + h * 0.53, w * 0.15, h *
				0.08);
		},
	},
	"shadow": {
		name_eng: "desert shadow",
		name_rus: "пустынная тень",
		requires: "mummy",
		weight: 4,
		health: enemy_health_from_tier(ENEMY_TIER_SHADOW),
		speed: 6.5,
		damage: 1.9 * enemy_damage_from_tier(ENEMY_TIER_SHADOW),
		w: 30,
		h: 30,
		color: E_COLS.shadow.body,
		outline: E_COLS.shadow.outline,
		range: 500,
		delay: 1000,
		theme: THEME_DESERT,
		eye_color: E_COLS.shadow.eye,
		bossifier_item: ITEM_BOSSIFIER_SHADOW,
		max_minions: 3,
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.boss) return;
			if (e.jump_delay >= 2200) e.jump_delay = 0;
			else if (e.jump_delay >= 1600) {
				vars.dx = 0;
				vars.dy = 0;
			}
			else if (e.jump_delay >= 1500) {
				vars.dx *= 3;
				vars.dy *= 3;
				e.jump_delay = 1600;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.shooting_delay >= 800) {
				for (let i = 0; i < 16; i++) {
					let angle = (Math.PI * 2 / 16) * i;
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, Math.cos(angle), Math.sin(
							angle), 10, e.damage, true, e.w * 0.1,
						2000, E_COLS.shadow.bullet_fill, E_COLS
						.shadow.bullet_outline);
				}
				e.shooting_delay = 0;
			}
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.shadow.body_icon;
			ctx.strokeStyle = E_COLS.shadow.outline;
			ctx.lineWidth = 0.01 * w;
			y = y - 0.1 * h;
			ctx.fillRect(x + w * 0.4, y + h * 0.6, w * 0.2, h * 0.2);
			ctx.strokeRect(x + w * 0.4, y + h * 0.6, w * 0.2, h * 0.2);
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"desert shadow", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ?
				ITEM_SHADOW_DUAL_SHOTGUNS : ITEM_SHADOW_STAFF;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big shadow guy", target.data
				.achievements_shower_element);
		},
	},
	"anubis": {
		name_eng: "Anubis",
		name_rus: "Анубис",
		eye_color: E_COLS.anubis.eye,
		requires: "shadow",
		weight: 4,
		health: enemy_health_from_tier(ENEMY_TIER_ANUBIS),
		speed: 5.5,
		damage: 2.1 * 100 / 97.5 * enemy_damage_from_tier(
			ENEMY_TIER_ANUBIS),
		w: 50,
		h: 50,
		color: E_COLS.anubis.body,
		outline: E_COLS.anubis.outline,
		range: 700,
		delay: 400,
		theme: THEME_DESERT,
		max_minions: 4,
		bossifier_item: ITEM_BOSSIFIER_ANUBIS,
		visuals: {
			draw_gun: true,
			draw_gun_boss: false,
			gun_color: E_COLS.anubis.gun,
			gun_width: 0.3,
			double_gun: false,
			custom_draw: (e, ctx) => {
				const x = e.body.position.x;
				const y = e.body.position.y;
				const w = e.w;
				const h = e.h;
				let speed = Math.sqrt(e.body.velocity.x ** 2 + e.body
					.velocity.y ** 2);
				let bob = (speed > 0.5) ? Math.abs(Math.cos(Date.now() *
					0.008)) * (h * 0.08) : Math.sin(Date.now() *
					0.002) * (h * 0.03);
				const headCenterY = y - h * 0.5 + bob;
				ctx.save();
				ctx.fillStyle = E_COLS.anubis.outline;
				ctx.strokeStyle = E_COLS.anubis.body;
				ctx.lineWidth = 1;
				[-1, 1].forEach(side => {
					let sideX = x + (side * w * 0.32);
					ctx.fillRect(sideX - w * 0.125,
						headCenterY - h * 0.2, w * 0.25, h *
						0.5);
					ctx.fillStyle = E_COLS.anubis.cloth_alt;
					for (let i = -0.1; i < 0.3; i += 0.15) {
						ctx.fillRect(sideX - w * 0.125,
							headCenterY + i * h, w * 0.25,
							h * 0.04);
					}
					ctx.fillStyle = E_COLS.anubis.outline;
				});
				ctx.fillStyle = E_COLS.anubis.body;
				ctx.strokeStyle = E_COLS.anubis.outline;
				ctx.lineWidth = 2;
				[-1, 1].forEach(side => {
					ctx.beginPath();
					ctx.moveTo(x + side * w * 0.12,
						headCenterY - h * 0.2);
					ctx.lineTo(x + side * w * 0.28,
						headCenterY - h * 0.6);
					ctx.lineTo(x + side * w * 0.2, headCenterY -
						h * 0.15);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
				});
				ctx.restore();
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 400 && !e.boss) {
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.ndx, vars.ndy, 18, e
						.damage, true, 12, 3000, E_COLS.anubis
						.bullet_fill,
						E_COLS.anubis.bullet_outline);
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 50) {
				let angle = Math.atan2(vars.ndy, vars.ndx);
				for (let i = 0; i < 4; i++) {
					let offsetForward = e.w * 0.5;
					let offsetSide = (Math.random() - 0.5) * (e.h *
						2.5);
					let startX = e.body.position.x + Math.cos(angle) *
						offsetForward - Math.sin(angle) * offsetSide;
					let startY = e.body.position.y + Math.sin(angle) *
						offsetForward + Math.cos(angle) * offsetSide;
					let randomSpeed = 15 + Math.random() * 12;
					let streamAngle = angle + (Math.random() - 0.5) *
						0.12;
					bullet_create(obj.game, startX, startY, Math.cos(
							streamAngle), Math.sin(streamAngle),
						randomSpeed, e.damage * 0.1, true, Math
						.random() * 5 + 3, 800 + Math.random() *
						500, E_COLS.anubis.stream_fill, E_COLS
						.anubis.stream_outline);
				}
				e.shooting_delay = 0;
			}
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#333333";
			ctx.strokeStyle = "#ffd700";
			y = y - w * 0.05;
			ctx.fillRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.strokeRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.fillStyle = "#ffd700";
			ctx.fillRect(x + w * 0.4, y + h * 0.48, w * 0.05, h * 0.1);
			ctx.fillRect(x + w * 0.55, y + h * 0.48, w * 0.05, h * 0.1);
			ctx.fillStyle = "#ffff00";
			ctx.fillRect(x + w * 0.43, y + h * 0.63, w * 0.04, h *
				0.04);
			ctx.fillRect(x + w * 0.53, y + h * 0.63, w * 0.04, h *
				0.04);
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"anubis kill", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ?
				ITEM_ANUBIS_SANDSTORM_STAFF : ITEM_ANUBIS_PUNISHER_ROD;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big anubis guy", target.data
				.achievements_shower_element);
		},
	},
	"shooting laser": {
		name_eng: "rainbow alien",
		name_rus: "радужный пришелец",
		requires: "shooting rocket",
		weight: 4,
		health: enemy_health_from_tier(ENEMY_TIER_SHOOTING_LASER),
		speed: 8.25,
		damage: 1 / 25 * 100 / 87.5 * 100 / 110 * enemy_damage_from_tier(
			ENEMY_TIER_SHOOTING_LASER),
		boss_shooting_range_mult: 1.5,
		boss_speed_mult: 1.75,
		boss_max_health_mult: 1.05,
		w: 50,
		eye_color: E_COLS.laser.eye,
		h: 50,
		color: E_COLS.laser.body_fallback,
		use_rainbow_color_gradient: true,
		outline: E_COLS.laser.outline,
		range: 600,
		delay: 150,
		max_minions: 5,
		minion_dist_mult: 7.5,
		bossifier_item: ITEM_BOSSIFIER_LASER,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: E_COLS.laser.gun,
			gun_width: 0.175,
			center_gun: false,
			center_gun_minion: false,
			center_gun_boss: true,
			laser_beam: true,
			double_gun: true,
			double_gun_boss: false,
			double_gun_minion: false,
			outline_width: 1
		},
		behaviour_no_target: (obj, dt) => {
			let e = obj.data;
			let r = Math.pow(Math.cos(0.03 * e.color_gradient) * 15, 2);
			let g = Math.pow(0.7 * (Math.cos(0.03 * e.color_gradient) +
				Math
				.sin(0.03 * e.color_gradient)) * 15, 2);
			let b = Math.pow(Math.sin(0.03 * e.color_gradient) * 15, 2);
			e.color = "#" + Math.floor(r).toString(16).padStart(2,
					'0') + Math
				.floor(g).toString(16).padStart(2, '0') + Math.floor(b)
				.toString(16).padStart(2, '0');
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (!e.boss && !e.is_minion) {
					if (e.shooting_delay >= 150) {
						let colors = E_COLS.laser.rainbow;
						let angle = Math.atan2(vars.dy, vars.dx);
						[Math.PI / 4, -Math.PI / 4].forEach(off => {
							bullet_create(obj.game, e.body
								.position.x + 50 * Math.cos(
									angle + off), e.body
								.position.y + 50 * Math.sin(
									angle + off), vars.dx,
								vars.dy, 25, e.damage * 10,
								true, e.w * 0.125, 2000,
								colors[Math.floor(e
										.color_gradient) %
									7], "white");
						});
						e.shooting_delay = 0;
					}
					vars.dx = 0;
					vars.dy = 0;
				}
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.jump_delay >= 1000) {
				let d = vars.v;
				if (d < 250) {
					e.jump_delay = 0;
					Matter.Body.setPosition(e.body, {
						x: target.data.body.position.x + 2.05 *
							(target.data.body.position.x - e
								.body.position.x),
						y: target.data.body.position.y + 2.05 *
							(target.data.body.position.y - e
								.body.position.y)
					});
				}
				else if (d > 750) {
					e.jump_delay = 0;
					Matter.Body.setPosition(e.body, {
						x: target.data.body.position.x + 0.75 *
							(target.data.body.position.x - e
								.body.position.x),
						y: target.data.body.position.y + 0.75 *
							(target.data.body.position.y - e
								.body.position.y)
					});
				}
			}
			if (vars.v < 1.25 * e.shooting_range && e.shooting_delay < -
				4500) {
				let t = target.data;
				if (target.name != "player" || t.immunity <= 0) {
					let rate = (target.name == "car" && t.is_tank) ?
						0.975 : 0.75;
					if (target.name == "player" && t
						.shield_blue_health > 0) t.shield_blue_health *=
						Math.pow(0.75, dt / 1000);
					else if (target.name == "player" && t
						.shield_green_health > 0) t
						.shield_green_health *= Math.pow(0.95, dt /
							1000);
					else if (target.name == "player" && t
						.shield_shadow_health > 0) t
						.shield_shadow_health *= Math.pow(0.95, dt /
							1000);
					else if (target.name == "player" && t
						.shield_anubis_health > 0) t
						.shield_anubis_health *= Math.pow(0.95, dt /
							1000);
					else if (target.name != "player" || t
						.shield_rainbow_health <= 0) t.health *= Math
						.pow(rate, dt / 1000);
				}
			}
			if (e.shooting_delay >= 1000) e.shooting_delay = -7500;
		},
		minion_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 300) {
					let colors = E_COLS.laser.rainbow;
					for (let i = 0; i < 7; i++) {
						let theta = Math.PI * (i - 3) / 14;
						let rotatedX = vars.ndx * Math.cos(theta) - vars
							.ndy * Math.sin(theta);
						let rotatedY = vars.ndx * Math.sin(theta) + vars
							.ndy * Math.cos(theta);
						bullet_create(obj.game, e.body.position.x, e
							.body.position.y, rotatedX, rotatedY,
							25, e.damage, true, e.w * 0.15, 2000,
							colors[i], "white");
					}
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements, "rainbow",
				target.data.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			let item = Math.random() < 0.33 ? ITEM_LASER_GUN :
				ITEM_RAINBOW_PISTOLS;
			item_create(obj.game, item, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
			for (let j = 0; j < Math.random() * 11 - 4; j++)
				item_create(obj.game, ITEM_BOSSIFIER, obj.data.body
					.position.x, obj.data.body.position.y, false, false
				);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"huge rainbow guy", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = E_COLS.laser.rainbow[0];
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = E_COLS.laser.gun;
			ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.15, h * 0.06);
			ctx.fillRect(x + w * 0.55, y + h * 0.62, w * 0.15, h *
				0.06);
		}
	},
	"deer": {
		only_draw_custom: true,
		name_eng: "deer",
		name_rus: "олень",
		eye_color: E_COLS.deer_boss.eye,
		requires: null,
		weight: 0,
		health: enemy_health_from_tier(ENEMY_TIER_ANIMALS),
		speed: 7.875,
		damage: enemy_damage_from_tier(ENEMY_TIER_ANIMALS),
		w: 50,
		h: 50,
		color: E_COLS.deer_boss.body,
		outline: E_COLS.deer_boss.outline,
		range: 400,
		delay: 1000,
		visuals: {
			draw_gun: false,
			draw_gun_boss: false,
			outline_width: 2,
			custom_draw: (e, ctx) => {
				let jump_offset = 0;
				if (e.jump_delay >= 1500 && e.jump_delay < 1700) {
					jump_offset = Math.sin((e.jump_delay - 1500) / 200 *
						Math.PI) * 20;
				}
				animal_deer_boss_render(ctx, e.body.position.x, e.body
					.position.y - jump_offset, e.w, e.h, e);
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.jump_delay === undefined) e.jump_delay = 0;
			e.jump_delay += dt;
			let k = e.boss ? 6.25 : 1.75;
			if (e.jump_delay >= 2200) {
				e.jump_delay = 0;
			}
			else if (e.jump_delay >= 1600) {
				vars.dx = 0;
				vars.dy = 0;
			}
			else if (e.jump_delay >= 1500) {
				vars.dx *= k;
				vars.dy *= k;
			}
		},
		on_boss_death: (obj, target, drop) => {
			item_create(obj.game, ITEM_HORN, obj.data.body.position.x,
				obj.data.body.position.y, false, false);
			if (drop) drop.N++;
		}
	},
	"raccoon": {
		name_eng: "raccoon",
		name_rus: "енот",
		requires: null,
		weight: 0,
		health: enemy_health_from_tier(ENEMY_TIER_ANIMALS),
		speed: 8.125,
		damage: enemy_damage_from_tier(ENEMY_TIER_ANIMALS),
		w: 30,
		h: 30,
		color: E_COLS.raccoon_boss.body,
		outline: E_COLS.raccoon_boss.outline,
		range: 600,
		delay: 500,
		only_draw_custom: true,
		visuals: {
			draw_gun: false,
			draw_gun_boss: false,
			outline_width: 2,
			custom_draw: (e, ctx) => {
				enemy_raccoon_boss_draw(ctx, e.body.position.x, e.body
					.position.y, e.w, e.h, e);
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				let cosA = 0.9238,
					sinA = 0.3826;
				[0, 1, -1].forEach(dir => {
					let finalX = dir === 0 ? vars.ndx : (dir ===
						1 ? vars.ndx * cosA - vars.ndy * (-
							sinA) : vars.ndx * cosA - vars
						.ndy * sinA);
					let finalY = dir === 0 ? vars.ndy : (dir ===
						1 ? vars.ndx * (-sinA) + vars.ndy *
						cosA : vars.ndx * sinA + vars.ndy *
						cosA);
					trash_bullet_create(obj.game, e.body
						.position.x, e.body.position.y,
						finalX, finalY, 24, e.damage, true,
						e.w * 0.5, E_COLS.raccoon_boss
						.trash_bullet);
				});
				e.shooting_delay = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_JUNK_CANNON, obj.data.body
				.position.x, obj.data.body.position.y);
		}
	},
	"scorpion": {
		name_eng: "scorpion",
		name_rus: "скорпион",
		requires: null,
		weight: 0,
		health: enemy_health_from_tier(ENEMY_TIER_ANIMALS),
		speed: 5.0,
		w: 56,
		h: 10,
		damage: enemy_damage_from_tier(ENEMY_TIER_ANIMALS),
		only_draw_custom: true,
		visuals: {
			draw_gun: false,
			outline_width: 0,
			custom_draw: (e, ctx) => {
				animal_scorpion_draw(ctx, e.body.position.x, e.body
					.position.y, e.w, e.h, e.body.angle);
			}
		},
		behaviour: (obj, dt, target, vars) => {
			if (Math.abs(vars.dx) > 0.1 || Math.abs(vars.dy) > 0.1) {
				Matter.Body.setAngle(obj.data.body, Math.atan2(vars.dy,
					vars.dx));
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			Matter.Body.setAngle(e.body, Math.atan2(vars.ndy, vars
				.ndx));
			if (vars.v < 500 && e.shooting_delay >= 1200) {
				let bullet = trash_bullet_create(obj.game, e.body
					.position.x, e.body.position.y, vars.ndx, vars
					.ndy, 16, e.damage, true, 12);
				if (bullet) bullet.color = E_COLS.scorpion_boss
					.venom_bullet;
				e.shooting_delay = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_VENOM_DUAL_SHOTGUNS, obj.data
				.body.position.x,
				obj.data.body.position.y);
		}
	},
	"snake": {
		name_eng: "giant serpent",
		name_rus: "гигантский змей",
		requires: null,
		weight: 0,
		health: enemy_health_from_tier(ENEMY_TIER_ANIMALS),
		speed: 6.5,
		damage: enemy_damage_from_tier(ENEMY_TIER_ANIMALS),
		w: 120,
		h: 15,
		color: E_COLS.snake_boss.body,
		outline: E_COLS.snake_boss.outline,
		range: 500,
		delay: 800,
		is_snake: false,
		only_draw_custom: true,
		max_minions: 0,
		visuals: {
			draw_gun: false,
			outline_width: 0,
			custom_draw: (e, ctx) => {
				animal_snake_draw(ctx, e.body.position.x, e.body
					.position.y, e.w, e.h, e.body.angle);
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (Math.abs(vars.dx) > 0.1 || Math.abs(vars.dy) > 0.1) {
				let targetAngle = Math.atan2(vars.dy, vars.dx);
				let currentAngle = e.body.angle;
				let nextAngle = currentAngle + (targetAngle -
					currentAngle) * 0.05;
				Matter.Body.setAngle(e.body, nextAngle);
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 50) {
				for (let i = 0; i < 4; i++) {
					let offsetForward = e.w * 0.45;
					let offsetSide = (Math.random() - 0.5) * (e.h * 3);
					let startX = e.body.position.x + Math.cos(e.body
						.angle) * offsetForward - Math.sin(e.body
						.angle) * offsetSide;
					let startY = e.body.position.y + Math.sin(e.body
						.angle) * offsetForward + Math.cos(e.body
						.angle) * offsetSide;
					let randomSpeed = 16 + Math.random() * 22;
					let streamAngle = e.body.angle + (Math.random() -
						0.5) * 0.08;
					bullet_create(
						obj.game,
						startX,
						startY,
						Math.cos(streamAngle),
						Math.sin(streamAngle),
						randomSpeed,
						e.damage * 0.08,
						true,
						Math.random() * 4 + 2,
						700 + Math.random() * 400,
						E_COLS.snake_boss.venom_stream,
						E_COLS.snake_boss.venom_outline,
					);
				}
				e.shooting_delay = 0;
			}
			if (vars.v > 400 && e.jump_delay >= 3000) {
				e.jump_delay = 0;
				Matter.Body.setVelocity(e.body, {
					x: vars.ndx * 15,
					y: vars.ndy * 15
				});
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_SNAKE_STAFF, obj.data.body
				.position.x, obj.data.body.position.y);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.strokeStyle = E_COLS.snake_boss.outline;
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.2, y + h * 0.5);
			ctx.bezierCurveTo(x + w * 0.4, y + h * 0.2, x + w * 0.6, y +
				h * 0.8, x + w * 0.8, y + h * 0.5);
			ctx.stroke();
		}
	},
	"snow regular": {
		name_eng: "snow infected",
		name_rus: "снежный заражённый",
		requires: "desert",
		eye_color: E_COLS.regular.eye,
		theme: THEME_TAIGA,
		weight: 2,
		health: enemy_health_from_tier(ENEMY_TIER_SNOW),
		speed: 6.5,
		damage: 100 / 40 * 100 / 125 * enemy_damage_from_tier(
			ENEMY_TIER_SNOW),
		w: 30,
		h: 30,
		color: "#d0e8e0",
		outline: "#94b0a8",
		range: 500,
		delay: 1500,
		bossifier_item: ITEM_BOSSIFIER_SNOW,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: "#3e2723",
			gun_width: 0.25,
			outline_width: 1,
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			let isBoss = e.boss;
			let fireDelay = isBoss ? 200 : 1500;
			if (vars.v < e.shooting_range && e.shooting_delay >=
				fireDelay) {
				let spawnX = e.body.position.x + vars.ndx * (e.w * 0.6);
				let spawnY = e.body.position.y + vars.ndy * (e.h * 0.6);
				let dx = vars.dx;
				let dy = vars.dy;
				if (isBoss) {
					let spread = 0.12;
					dx += (Math.random() - 0.5) * spread;
					dy += (Math.random() - 0.5) * spread;
					bullet_create(obj.game, spawnX, spawnY, dx, dy, 20,
						e.damage, true, e.w * 0.15, 1500, "#ffb300",
						"#bf360c");
				}
				else {
					bullet_create(obj.game, spawnX, spawnY, dx, dy, 24,
						e.damage * 1.5, true, e.w * 0.15, 2000,
						"#ffb300", "#bf360c");
				}
				e.shooting_delay = 0;
			}
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"cold welcome", target.data
				.achievements_shower_element);
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.33 ?
				ITEM_MOSIN_RIFLE : ITEM_PP_SH, obj.data.body
				.position.x, obj.data.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"big snow guy", target.data
				.achievements_shower_element);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#d0e8e0";
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = "#3e2723";
			ctx.fillRect(x + w * 0.55, y + h * 0.53, w * 0.15, h *
				0.08);
		},
	},
	"ushanka": {
		name_eng: "infected in ushanka",
		name_rus: "заражённый в ушанке",
		requires: "snow regular",
		theme: THEME_TAIGA,
		weight: 3,
		eye_color: "#ff0000",
		health: enemy_health_from_tier(ENEMY_TIER_USHANKA),
		speed: 5.5,
		damage: 100 / 136 * enemy_damage_from_tier(ENEMY_TIER_USHANKA),
		w: 30,
		h: 30,
		color: "#d0e8e0",
		outline: "#94b0a8",
		range: 450,
		delay: 50,
		bossifier_item: ITEM_BOSSIFIER_USHANKA,
		indeicators_offset: 10,
		max_minions: 2,
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#d0e8e0";
			ctx.fillRect(x + w * 0.4, y + h * 0.55, w * 0.2, h * 0.15);
			ctx.fillStyle = "#455a64";
			ctx.fillRect(x + w * 0.35, y + h * 0.45, w * 0.3, h * 0.12);
			ctx.fillRect(x + w * 0.32, y + h * 0.45, w * 0.06, h * 0.2);
			ctx.fillRect(x + w * 0.62, y + h * 0.45, w * 0.06, h * 0.2);
			ctx.fillStyle = "#d32f2f";
			ctx.fillRect(x + w * 0.48, y + h * 0.48, w * 0.04, h *
				0.04);
		},
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: "#2c3e50",
			gun_width: 0.25,
			custom_draw_above: true,
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				let headTop = y - h * 0.8;
				let hatW = w * 0.8;
				let hatH = h * 0.45;
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = "#1d272b";
				ctx.fillStyle = "#455a64";
				ctx.fillRect(x - hatW * 0.6, headTop - hatH * 0.2,
					hatW * 0.22, h * 0.5);
				ctx.fillRect(x + hatW * 0.38, headTop - hatH * 0.2,
					hatW * 0.22, h * 0.5);
				ctx.strokeRect(x - hatW * 0.6, headTop - hatH * 0.2,
					hatW * 0.22, h * 0.5);
				ctx.strokeRect(x + hatW * 0.38, headTop - hatH * 0.2,
					hatW * 0.22, h * 0.5);
				ctx.fillStyle = "#455a64";
				ctx.fillRect(x - hatW * 0.5, headTop - hatH * 0.5, hatW,
					hatH);
				ctx.strokeRect(x - hatW * 0.5, headTop - hatH * 0.5,
					hatW, hatH);
				ctx.fillStyle = "#37474f";
				let flapH = hatH * 0.45;
				ctx.fillRect(x - hatW * 0.45, (headTop + hatH * 0.5) -
					flapH - 2, hatW * 0.9, flapH);
				ctx.strokeRect(x - hatW * 0.45, (headTop + hatH * 0.5) -
					flapH - 2, hatW * 0.9, flapH);
				ctx.save();
				ctx.translate(x, (headTop + hatH * 0.5) - flapH / 2 -
					2);
				ctx.fillStyle = "#d32f2f";
				ctx.beginPath();
				let points = 5;
				let outerRadius = hatW * 0.1;
				let innerRadius = hatW * 0.04;
				let step = Math.PI / points;
				for (let i = 0; i < 2 * points; i++) {
					let r = (i % 2 === 0) ? outerRadius : innerRadius;
					let currAngle = (i * step) - Math.PI / 2;
					ctx.lineTo(Math.cos(currAngle) * r, Math.sin(
						currAngle) * r);
				}
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				let spawnX = e.body.position.x + vars.ndx * (e.w * 0.5);
				let spawnY = e.body.position.y + vars.ndy * (e.h * 0.5);
				if (!e.boss && e.shooting_delay >= 120) {
					bullet_create(obj.game, spawnX, spawnY, vars.dx,
						vars.dy, 18, e.damage, true, e.w * 0.18,
						1000, "#00fbff", "#0077ff", false, false);
					e.shooting_delay = 0;
				}
				else if (e.boss && e.shooting_delay >= 30) {
					let colors = ["#ff4500", "#ff8c00", "#ffd700"];
					let s = (Math.random() - 0.5) * 1.8;
					bullet_create(obj.game, spawnX, spawnY, vars.dx + s,
						vars.dy + s, 7, e.damage * 0.1, true, e.w *
						0.1, 700, colors[Math.floor(Math.random() *
							colors.length)], "orange");
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.5 ? ITEM_TESLA_GUN :
				ITEM_FLAMETHROWER, obj.data.body.position.x, obj
				.data
				.body.position.y, false, false);
			if (Math.random() < 0.75)
				item_create(obj.game, ITEM_ROCKET_PISTOL, obj.data.body
					.position.x, obj.data.body.position.y, false, false
				);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"general ushanka", target.data
				.achievements_shower_element);
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"ear protection", target.data
				.achievements_shower_element);
		},
	},
	"snowman": {
		name_eng: "evil snowman",
		name_rus: "проклятый снеговик",
		requires: "ushanka",
		weight: 4,
		theme: THEME_TAIGA,
		health: enemy_health_from_tier(ENEMY_TIER_SNOWMAN),
		speed: 4,
		damage: 100 / 60 * enemy_damage_from_tier(ENEMY_TIER_SNOWMAN),
		w: 42,
		h: 42,
		only_draw_custom: true,
		color: "transparent",
		range: 500,
		delay: 1500,
		bossifier_item: ITEM_BOSSIFIER_SNOWMAN,
		render_icon: (ctx, x, y, w, h) => {
			y = y - 0.05 * h;
			ctx.fillStyle = "#f0fdfa";
			ctx.strokeStyle = "#94b0a8";
			ctx.lineWidth = 0.01 * w;
			ctx.fillRect(x + w * 0.4, y + h * 0.62, w * 0.2, h * 0.18);
			ctx.strokeRect(x + w * 0.4, y + h * 0.62, w * 0.2, h *
				0.18);
			ctx.fillRect(x + w * 0.42, y + h * 0.48, w * 0.16, h *
				0.14);
			ctx.strokeRect(x + w * 0.42, y + h * 0.48, w * 0.16, h *
				0.14);
			ctx.fillStyle = "#aa3d00";
			ctx.fillRect(x + w * 0.58, y + h * 0.53, w * 0.1, h * 0.04);
		},
		visuals: {
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				let t = Date.now() * 0.005;
				let headX = x + Math.sin(t) * 2;
				let headY = y - h * 0.3;
				ctx.strokeStyle = "#3e2723";
				ctx.lineWidth = w * 0.04;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				[-1, 1].forEach(side => {
					ctx.save();
					ctx.translate(x + side * w * 0.2, y);
					ctx.rotate(side * Math.sin(t * 0.5) * 0.2);
					ctx.beginPath();
					ctx.moveTo(0, 0);
					let armLen = w * 0.5;
					ctx.lineTo(side * armLen, -h * 0.2);
					ctx.moveTo(side * armLen * 0.6, -h * 0.12);
					ctx.lineTo(side * armLen * 0.8, -h * 0.3);
					ctx.moveTo(side * armLen * 0.8, -h * 0.16);
					ctx.lineTo(side * armLen * 1.1, -h * 0.1);
					ctx.stroke();
					ctx.restore();
				});
				ctx.fillStyle = "#f0fdfa";
				ctx.strokeStyle = "#94b0a8";
				ctx.lineWidth = w * 0.03;
				ctx.beginPath();
				for (let i = 0; i < Math.PI * 2; i += 0.5) {
					let r = w * (0.4 + Math.sin(t + i * 2) * 0.03);
					ctx.lineTo(x + Math.cos(i) * r, y + h * 0.2 + Math
						.sin(i) * r);
				}
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(headX, headY, w * 0.3, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = "#1a1a1a";
				ctx.beginPath();
				ctx.arc(headX - w * 0.12, headY - h * 0.05, w * 0.07, 0,
					Math.PI * 2);
				ctx.arc(headX + w * 0.12, headY - h * 0.05, w * 0.07, 0,
					Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.ellipse(headX, headY + h * 0.12, w * 0.15, h * 0.05,
					0, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#aa3d00";
				ctx.beginPath();
				ctx.moveTo(headX - w * 0.03, headY + h * 0.02);
				ctx.lineTo(headX + w * 0.4, headY + h * 0.07);
				ctx.lineTo(headX + w * 0.03, headY + h * 0.08);
				ctx.closePath();
				ctx.fill();
				ctx.strokeStyle = "#e65100";
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= (e
					.boss ? 1200 : 1500)) {
				if (e.boss) {
					for (let i = -2; i <= 2; i++) {
						let angle = Math.atan2(vars.dy, vars.dx) + (i *
							0.2);
						bullet_create(obj.game, e.body.position.x, e
							.body.position.y, Math.cos(angle), Math
							.sin(angle), 10, e.damage, true, e.w *
							0.2, 1000, "white", "cyan");
					}
				}
				else {
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 8, e.damage,
						true, e.w * 0.25, 1500, "white", "cyan");
				}
				e.shooting_delay = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.33 ? (Math
					.random() < 0.33 ? ITEM_BLIZZARD_STAFF :
					ITEM_SNOWBALL_GUN) :
				ITEM_FREEZE_GUN, obj.data.body.position.x, obj.data
				.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"true winter", target.data
				.achievements_shower_element);
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"meltdown", target.data.achievements_shower_element);
		},
	},
	"krampus": {
		name_eng: "Krampus",
		name_rus: "Крампус",
		requires: "snowman",
		weight: 4,
		health: enemy_health_from_tier(ENEMY_TIER_KRAMPUS),
		speed: 7.2,
		damage: 3 / 16 * enemy_damage_from_tier(ENEMY_TIER_KRAMPUS),
		w: 55,
		h: 55,
		only_draw_custom: false,
		color: "black",
		range: 400,
		delay: 500,
		bossifier_item: ITEM_BOSSIFIER_KRAMPUS,
		theme: THEME_TAIGA,
		max_minions: 0,
		render_icon: (ctx, x, y, w, h) => {
			y = y + 0.05 * h;
			const s = 0.6;
			const ox = x + w * (1 - s) / 2;
			const oy = y + h * (1 - s) / 2;
			ctx.fillStyle = "#8b0000";
			ctx.fillRect(ox + w * s * 0.35, oy + h * s * 0.55, w * s *
				0.3, h * s * 0.25);
			ctx.fillStyle = "#1a0f0a";
			ctx.fillRect(ox + w * s * 0.4, oy + h * s * 0.45, w * s *
				0.2, h * s * 0.15);
			ctx.strokeStyle = "#1a0f0a";
			ctx.lineWidth = w * s * 0.05;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(ox + w * s * 0.42, oy + h * s * 0.45);
			ctx.lineTo(ox + w * s * 0.35, oy + h * s * 0.35);
			ctx.lineTo(ox + w * s * 0.45, oy + h * s * 0.32);
			ctx.moveTo(ox + w * s * 0.58, oy + h * s * 0.45);
			ctx.lineTo(ox + w * s * 0.65, oy + h * s * 0.35);
			ctx.lineTo(ox + w * s * 0.55, oy + h * s * 0.32);
			ctx.stroke();
			ctx.fillStyle = "#ff0000";
			const eyeSize = w * s * 0.05;
			ctx.fillRect(ox + w * s * 0.43, oy + h * s * 0.5, eyeSize,
				eyeSize);
			ctx.fillRect(ox + w * s * 0.53, oy + h * s * 0.5, eyeSize,
				eyeSize);
		},
		visuals: {
			draw_chain: true,
			chain_color: "black",
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				ctx.fillStyle = "#8b0000";
				ctx.beginPath();
				ctx.moveTo(x - w * 0.4, y - h * 0.4);
				ctx.lineTo(x + w * 0.4, y - h * 0.4);
				ctx.lineTo(x + w * 0.6, y + h * 0.5);
				ctx.lineTo(x - w * 0.6, y + h * 0.5);
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle = "#e0e0e0";
				ctx.fillRect(x - w * 0.45, y - h * 0.4, w * 0.9, h *
					0.15);
				ctx.fillRect(x - w * 0.6, y + h * 0.4, w * 1.2, h *
					0.15);
				ctx.fillStyle = "#dcdcdc";
				ctx.beginPath();
				ctx.moveTo(x - w * 0.15, y - h * 0.15);
				ctx.lineTo(x + w * 0.15, y - h * 0.15);
				ctx.lineTo(x, y + h * 0.3);
				ctx.fill();
				ctx.strokeStyle = "#1a0f0a";
				ctx.lineWidth = w * 0.08;
				[-1, 1].forEach(side => {
					ctx.beginPath();
					ctx.moveTo(x + side * w * 0.15, y - h *
						0.45);
					ctx.quadraticCurveTo(x + side * w * 0.8, y -
						h * 1.0, x + side * w * 0.3, y - h *
						1.3);
					ctx.stroke();
				});
				ctx.strokeStyle = "#757575";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(x - w * 0.4, y - h * 0.1);
				ctx.bezierCurveTo(x - w * 0.2, y + h * 0.2, x + w * 0.2,
					y + h * 0.2, x + w * 0.4, y - h * 0.1);
				ctx.stroke();
				ctx.fillStyle = "#ff0000";
				ctx.shadowBlur = 10;
				ctx.shadowColor = "red";
				ctx.fillRect(x - w * 0.12, y - h * 0.25, 4, 4);
				ctx.fillRect(x + w * 0.06, y - h * 0.25, 4, 4);
				ctx.shadowBlur = 0;
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.jump_delay >= 2000) {
				e.jump_delay = 0;
				Matter.Body.applyForce(e.body, e.body.position, {
					x: vars.dx * 0.06,
					y: vars.dy * 0.06
				});
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.33 ?
				ITEM_PRESENT_LAUNCHER :
				ITEM_KRAMPUS_CHAIN, obj.data.body.position.x, obj
				.data
				.body.position.y, false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"christmas is cancelled", target.data
				.achievements_shower_element);
		},
		on_death: (obj, target) => {
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"naughty list", target.data
				.achievements_shower_element);
		},
	},
	"blood": {
		name_eng: "blood zombie",
		name_rus: "кровавый",
		requires: "snow regular",
		eye_color: "white",
		weight: 2,
		health: enemy_health_from_tier(ENEMY_TIER_BLOOD),
		speed: 7,
		damage: 4 * enemy_damage_from_tier(ENEMY_TIER_BLOOD),
		w: 30,
		h: 30,
		color: "#BB1111",
		outline: "#4A0000",
		range: 400,
		delay: 1000,
		theme: THEME_BLOOD_FOREST,
		bossifier_item: ITEM_BOSSIFIER_BLOOD,
		max_minions: 2,
		visuals: {
			draw_gun: true,
			draw_gun_boss: true,
			gun_color: "#4A0000",
			gun_width: 0.25,
			double_gun_boss: true,
			outline_width: 1
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && !e.boss) {
				if (e.shooting_delay >= 800) {
					bullet_create(
						obj.game, e.body.position.x, e.body.position
						.y,
						vars.dx, vars.dy,
						25, e.damage,
						true, 7, 1200, "#ff0000", "#4a0404"
					);
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (e.blood_alt === undefined) e.blood_alt = false;
			if (vars.v < e.shooting_range) {
				let current_limit = e.blood_alt ? 120 : 600;
				if (e.shooting_delay >= current_limit) {
					let baseTheta = Math.atan2(vars.dy, vars.dx);
					let handOff = e.blood_alt ? Math.PI / 5 : -Math.PI /
						5;
					let sx = e.body.position.x + e.w * Math.cos(
						baseTheta + handOff);
					let sy = e.body.position.y + e.h * Math.sin(
						baseTheta + handOff);
					for (let i = 0; i < 6; i++) {
						let spread = (Math.random() - 0.5) * 0.4;
						let finalTheta = baseTheta + spread;
						let rx = Math.cos(finalTheta);
						let ry = Math.sin(finalTheta);
						bullet_create(
							obj.game, sx, sy,
							rx, ry,
							18 + 7 * Math.random(),
							e.damage * 0.45,
							true, 6 + Math.random() * 4, 800,
							"#ff0000", "#2a0000",
							false, false
						);
					}
					e.blood_alt = !e.blood_alt;
					e.shooting_delay = 0;
				}
				vars.dx = 0;
				vars.dy = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.25 ?
				ITEM_BLOOD_DUAL_SHOTGUNS :
				ITEM_BLOOD_PISTOL, obj.data.body.position.x, obj
				.data.body.position.y, false, false);
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#BB1111";
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = "#4A0000";
			ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.15, h * 0.06);
			ctx.fillRect(x + w * 0.55, y + h * 0.62, w * 0.15, h *
				0.08);
		},
	},
	"pumpkin skeleton": {
		name_eng: "pumpkin skeleton",
		name_rus: "тыквенный скелет",
		requires: "blood",
		weight: 3,
		theme: THEME_BLOOD_FOREST,
		health: enemy_health_from_tier(ENEMY_TIER_PUMPKIN_SKELETON),
		speed: 5.5,
		damage: enemy_damage_from_tier(ENEMY_TIER_PUMPKIN_SKELETON),
		w: 38,
		h: 38,
		only_draw_custom: true,
		color: "transparent",
		range: 450,
		delay: 1200,
		bossifier_item: ITEM_BOSSIFIER_PUMPKIN_SKELETON,
		max_minions: 1,
		render_icon: (ctx, x, y, w, h) => {
			let sizeW = w * 0.25;
			let sizeH = h * 0.25;
			let cx = x + (w - sizeW) * 0.5;
			let cy = y + (h - sizeH) * 0.625;
			ctx.fillStyle = "#d35400";
			ctx.strokeStyle = "#4a0404";
			ctx.lineWidth = 1.5;
			ctx.fillRect(cx, cy, sizeW, sizeH);
			ctx.strokeRect(cx, cy, sizeW, sizeH);
			ctx.fillStyle = "#27ae60";
			ctx.fillRect(cx + sizeW * 0.4, cy - sizeH * 0.2, sizeW *
				0.2, sizeH * 0.2);
			ctx.fillStyle = "#1a0f0a";
			ctx.fillRect(cx + sizeW * 0.15, cy + sizeH * 0.2, sizeW *
				0.2, sizeH * 0.2);
			ctx.fillRect(cx + sizeW * 0.65, cy + sizeH * 0.2, sizeW *
				0.2, sizeH * 0.2);
			ctx.fillRect(cx + sizeW * 0.25, cy + sizeH * 0.65, sizeW *
				0.5, sizeH * 0.15);
		},
		visuals: {
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				let t = Date.now() * 0.005;
				let hover = Math.sin(t * 0.5) * 8 - 10;
				let curY = y + hover;
				let headY = curY - h * 0.45;
				ctx.strokeStyle = "#e0e0e0";
				ctx.lineCap = "round";
				ctx.lineWidth = w * 0.08;
				ctx.beginPath();
				ctx.moveTo(x, curY - h * 0.1);
				ctx.lineTo(x, curY + h * 0.3);
				ctx.stroke();
				ctx.lineWidth = w * 0.04;
				for (let i = 0; i < 5; i++) {
					ctx.beginPath();
					let ry = curY - h * 0.05 + (i * h * 0.08);
					let rw = w * (0.22 - i * 0.02);
					ctx.moveTo(x - rw, ry);
					ctx.quadraticCurveTo(x, ry + 4, x + rw, ry);
					ctx.stroke();
				}
				ctx.lineWidth = w * 0.07;
				ctx.beginPath();
				ctx.moveTo(x - w * 0.15, curY + h * 0.3);
				ctx.lineTo(x + w * 0.15, curY + h * 0.3);
				ctx.stroke();
				[-1, 1].forEach(side => {
					let shoulderX = x + side * w * 0.2;
					let shoulderY = curY;
					let armSwing = Math.sin(t) * 0.3 * side;
					let elbowX = shoulderX + side * w * 0.25 +
						armSwing * 5;
					let elbowY = shoulderY + h * 0.2 + Math.cos(
						t) * 3;
					let handX = elbowX + side * w * 0.15;
					let handY = elbowY + h * 0.15 + armSwing *
						5;
					ctx.lineWidth = w * 0.05;
					ctx.beginPath();
					ctx.moveTo(shoulderX, shoulderY);
					ctx.lineTo(elbowX, elbowY);
					ctx.lineTo(handX, handY);
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(handX, handY, w * 0.03, 0, Math.PI *
						2);
					ctx.fillStyle = "#e0e0e0";
					ctx.fill();
				});
				ctx.fillStyle = "#d35400";
				ctx.strokeStyle = "#4a0404";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.ellipse(x, headY, w * 0.35, h * 0.32, 0, 0, Math
					.PI * 2);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = "#27ae60";
				ctx.fillRect(x - 2, headY - h * 0.42, 4, 8);
				ctx.fillStyle = "#1a0f0a";
				let fx = x - w * 0.5;
				let fy = headY - h * 0.55;
				ctx.beginPath();
				ctx.moveTo(fx + w * 0.3, fy + h * 0.35);
				ctx.lineTo(fx + w * 0.48, fy + h * 0.45);
				ctx.lineTo(fx + w * 0.32, fy + h * 0.5);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(fx + w * 0.7, fy + h * 0.35);
				ctx.lineTo(fx + w * 0.52, fy + h * 0.45);
				ctx.lineTo(fx + w * 0.68, fy + h * 0.5);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(fx + w * 0.5, fy + h * 0.48);
				ctx.lineTo(fx + w * 0.46, fy + h * 0.55);
				ctx.lineTo(fx + w * 0.54, fy + h * 0.55);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(fx + w * 0.28, fy + h * 0.6);
				ctx.lineTo(fx + w * 0.35, fy + h * 0.7);
				ctx.lineTo(fx + w * 0.42, fy + h * 0.62);
				ctx.lineTo(fx + w * 0.5, fy + h * 0.72);
				ctx.lineTo(fx + w * 0.58, fy + h * 0.62);
				ctx.lineTo(fx + w * 0.65, fy + h * 0.7);
				ctx.lineTo(fx + w * 0.72, fy + h * 0.6);
				ctx.lineTo(fx + w * 0.65, fy + h * 0.78);
				ctx.lineTo(fx + w * 0.58, fy + h * 0.68);
				ctx.lineTo(fx + w * 0.5, fy + h * 0.85);
				ctx.lineTo(fx + w * 0.42, fy + h * 0.68);
				ctx.lineTo(fx + w * 0.35, fy + h * 0.78);
				ctx.fill();
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			let t = Date.now() * 0.005;
			let hover = Math.sin(t * 0.5) * 8 - 10;
			if (Math.random() < 0.25 * (dt / 16.6)) {
				smoke_create(obj.game, e.body.position.x + (Math
						.random() * 10 - 5),
					e.body.position.y + hover + 15, 1, "orange", 0.5
				);
			}
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 1200) {
					let baseAngle = Math.atan2(vars.dy, vars.dx);
					let isBoss = !!e.boss;
					let bulletItems = isBoss ? [ITEM_PUMPKIN] :
						ITEMS_CANDIES;
					let bulletSize = isBoss ? 55 : 35;
					let bulletDamage = e.damage;
					for (let i = -1; i <= 1; i++) {
						let angle = baseAngle + (i * 0.2);
						let nx = Math.cos(angle);
						let ny = Math.sin(angle);
						trash_bullet_create(
							obj.game,
							e.body.position.x + nx * e.w * 0.5,
							e.body.position.y + ny * e.h * 0.5,
							nx,
							ny,
							16,
							bulletDamage,
							true,
							bulletSize,
							bulletItems
						);
					}
					e.shooting_delay = 0;
				}
				vars.dx *= 0.3;
				vars.dy *= 0.3;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.5 ?
				ITEM_PUMPKIN_GUN :
				ITEM_CANDY_GUN,
				obj.data.body.position.x, obj.data.body.position.y,
				false, false);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"king of the patch", target.data
				.achievements_shower_element);
		},
		on_death: (obj, target) => {
			smoke_create(obj.game, obj.data.body.position.x, obj.data
				.body.position.y, 40, "orange", 1.8);
			if (target?.name == "player") achievement_do(target.data
				.achievements_element.data.achievements,
				"spooky scary", target.data
				.achievements_shower_element);
		}
	},
	"vampire": {
		name_eng: "vampire",
		name_rus: "вампир",
		requires: "pumpkin skeleton",
		weight: 3,
		theme: THEME_BLOOD_FOREST,
		health: enemy_health_from_tier(ENEMY_TIER_VAMPIRE),
		speed: 6.5,
		damage: enemy_damage_from_tier(ENEMY_TIER_VAMPIRE),
		w: 38,
		h: 52,
		only_draw_custom: true,
		color: "transparent",
		range: 450,
		delay: 1000,
		bossifier_item: ITEM_BOSSIFIER_VAMPIRE,
		max_minions: 2,
		render_icon: (ctx, x, y, w, h) => {
			let size = w * 0.22;
			let cx = x + (w - size) * 0.5;
			let cy = y + (h - size) * 0.6;
			ctx.fillStyle = "#f8f8f8";
			ctx.fillRect(cx, cy, size, size);
			ctx.fillStyle = "#ff0000";
			ctx.beginPath();
			ctx.moveTo(cx + size * 0.15, cy + size * 0.5);
			ctx.lineTo(cx + size * 0.35, cy + size * 0.5);
			ctx.beginPath();
			ctx.moveTo(cx + size * 0.1, cy + size * 0.5);
			ctx.lineTo(cx + size * 0.4, cy + size * 0.5);
			ctx.lineTo(cx + size * 0.25, cy + size * 0.9);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(cx + size * 0.6, cy + size * 0.5);
			ctx.lineTo(cx + size * 0.9, cy + size * 0.5);
			ctx.lineTo(cx + size * 0.75, cy + size * 0.9);
			ctx.fill();
		},
		visuals: {
			custom_draw: (e, ctx) => {
				let x = e.body.position.x,
					y = e.body.position.y,
					w = e.w,
					h = e.h;
				let t = Date.now() * 0.004;
				let hover = Math.sin(t) * 8;
				let curY = y + hover;
				let target_object = enemy_get_target_object({
					data: e,
					game: e.body.gameObject?.game
				}, -1);
				let angle = 0;
				if (target_object) {
					angle = Math.atan2(target_object.data.body.position
						.y - y, target_object.data.body.position.x -
						x);
				}
				else {
					angle = Math.atan2(e.body.velocity.y, e.body
						.velocity.x);
					if (Math.abs(e.body.velocity.x) < 0.1 && Math.abs(e
							.body.velocity.y) < 0.1) angle = Math.PI /
						2;
				}
				ctx.fillStyle = "#0a0a0a";
				[-1, 1].forEach(side => {
					let legX = x + side * w * 0.12;
					let legY = curY + h * 0.4;
					let legSwing = Math.sin(t * 0.5 + side) * 2;
					ctx.fillRect(legX - w * 0.07, legY +
						legSwing, w * 0.14, h * 0.35);
					ctx.fillStyle = "#000000";
					ctx.fillRect(legX - w * 0.09, legY + h *
						0.35 + legSwing, w * 0.2, h * 0.07);
					ctx.fillStyle = "#0a0a0a";
				});
				ctx.fillStyle = "#3a0000";
				ctx.beginPath();
				ctx.moveTo(x - w * 0.35, curY - h * 0.1);
				ctx.lineTo(x - w * 0.65, curY - h * 0.7);
				ctx.lineTo(x, curY - h * 0.35);
				ctx.lineTo(x + w * 0.65, curY - h * 0.7);
				ctx.lineTo(x + w * 0.35, curY - h * 0.1);
				ctx.fill();
				ctx.fillStyle = "#000000";
				ctx.beginPath();
				ctx.roundRect(x - w * 0.3, curY - h * 0.1, w * 0.6, h *
					0.6, 5);
				ctx.fill();
				ctx.fillStyle = "#f8f8f8";
				ctx.beginPath();
				ctx.moveTo(x - w * 0.12, curY - h * 0.1);
				ctx.lineTo(x + w * 0.12, curY - h * 0.1);
				ctx.lineTo(x, curY + h * 0.25);
				ctx.fill();
				ctx.fillStyle = "#a00000";
				let tieY = curY + 2;
				ctx.beginPath();
				ctx.moveTo(x, tieY);
				ctx.lineTo(x - 8, tieY - 4);
				ctx.lineTo(x - 8, tieY + 4);
				ctx.moveTo(x, tieY);
				ctx.lineTo(x + 8, tieY - 4);
				ctx.lineTo(x + 8, tieY + 4);
				ctx.fill();
				ctx.save();
				ctx.fillStyle = "#000000";
				[-1, 1].forEach(side => {
					ctx.save();
					let armStartX = x + side * w * 0.25;
					let armStartY = curY + h * 0.1;
					ctx.translate(armStartX, armStartY);
					let armAngle = angle;
					if (Math.cos(angle) < 0) armAngle = angle;
					ctx.rotate(armAngle - Math.PI / 2 + (Math
						.sin(t * 2 + side) * 0.05));
					ctx.fillRect(-w * 0.06, 0, w * 0.12, h *
						0.45);
					ctx.fillStyle = "#dcdcdc";
					ctx.beginPath();
					ctx.arc(0, h * 0.45, 4, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillStyle = "#000000";
					ctx.restore();
				});
				ctx.restore();
				ctx.fillStyle = "#dcdcdc";
				ctx.beginPath();
				ctx.roundRect(x - w * 0.22, curY - h * 0.6, w * 0.44,
					h * 0.45, 12);
				ctx.fill();
				ctx.save();
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = w * 0.02;
				ctx.lineCap = "round";
				let headTopY = curY - h * 0.58;
				ctx.beginPath();
				for (let i = 0; i < 40; i++) {
					let hX = x - w * 0.22 + (i * w * 0.44 / 40);
					let seed = i * 123.45;
					let hLen = h * 0.12 + Math.abs(Math.sin(seed)) * h *
						0.1;
					let hAngle = (i / 40) * Math.PI + Math.PI;
					ctx.moveTo(hX, headTopY + h * 0.1);
					ctx.lineTo(hX + Math.cos(hAngle) * (w * 0.15),
						headTopY - hLen);
				}
				ctx.stroke();
				ctx.fillStyle = "#000000";
				ctx.beginPath();
				ctx.moveTo(x - w * 0.1, headTopY + h * 0.05);
				ctx.lineTo(x, headTopY + h * 0.2);
				ctx.lineTo(x + w * 0.1, headTopY + h * 0.05);
				ctx.fill();
				ctx.restore();
				ctx.shadowBlur = 15;
				ctx.shadowColor = "red";
				ctx.fillStyle = "#ff0000";
				[-1, 1].forEach(side => {
					ctx.beginPath();
					ctx.moveTo(x + side * w * 0.05, curY - h *
						0.38);
					ctx.lineTo(x + side * w * 0.22, curY - h *
						0.46);
					ctx.lineTo(x + side * w * 0.18, curY - h *
						0.34);
					ctx.fill();
				});
				ctx.shadowBlur = 0;
				ctx.fillStyle = "#000000";
				ctx.fillRect(x - w * 0.12, curY - h * 0.28, w * 0.24,
					1.5);
				ctx.fillStyle = "#ff0000";
				[-1, 1].forEach(side => {
					ctx.beginPath();
					ctx.moveTo(x + side * w * 0.06, curY - h *
						0.28);
					ctx.lineTo(x + side * w * 0.09, curY - h *
						0.1);
					ctx.lineTo(x + side * w * 0.12, curY - h *
						0.28);
					ctx.fill();
				});
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 1000) {
					let spawnDist = e.w * 1.8;
					let count = Math.random() < 0.25 || !e.boss ? 1 : 0;
					let spreadStep = 1.4;
					for (let i = 0; i < count; i++) {
						let angleOffset = (i - (count - 1) / 2) *
							spreadStep;
						let cos = Math.cos(angleOffset);
						let sin = Math.sin(angleOffset);
						let rdx = vars.ndx * cos - vars.ndy * sin;
						let rdy = vars.ndx * sin + vars.ndy * cos;
						let spawnX = e.boss ? e.body.position.x : e.body
							.position.x + rdx * spawnDist;
						let spawnY = e.boss ? e.body.position.y : e.body
							.position.y + rdy * spawnDist;
						rocket_create(
							obj.game,
							spawnX,
							spawnY,
							rdx,
							rdy,
							e.w * 0.15,
							target,
							e.damage * 0.5,
							e.max_health * 0.025,
							true,
							8,
							3000,
							"bat"
						);
					}
					e.shooting_delay = 0;
				}
				vars.dx *= 0.1;
				vars.dy *= 0.1;
			}
		},
		on_death: (obj, target) => {
			smoke_create(obj.game, obj.data.body.position.x, obj.data
				.body.position.y, 30, "red", 2.5);
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, Math.random() < 0.5 ?
				ITEM_BAT_BLASTER :
				ITEM_LIFESTEAL_STAFF, obj.data.body.position.x, obj
				.data
				.body.position.y, false, false);
		}
	},
	"necromancer": {
		name_eng: "necromancer",
		name_rus: "некромант",
		requires: "vampire",
		weight: 4,
		theme: THEME_BLOOD_FOREST,
		health: enemy_health_from_tier(ENEMY_TIER_NECROMANCER),
		speed: 4.2,
		damage: enemy_damage_from_tier(ENEMY_TIER_NECROMANCER),
		w: 42,
		h: 58,
		only_draw_custom: true,
		color: "transparent",
		range: 500,
		delay: 2000,
		bossifier_item: ITEM_BOSSIFIER_NECROMANCER,
		max_minions: 2,
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#9b59b6";
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
		},
		visuals: {
			custom_draw: (e, ctx) => {
				const x = e.body.position.x,
					y = e.body.position.y,
					w = e.w * 0.85,
					h = e.h * 1.1;
				const t = Date.now() * 0.003;
				const bodyHover = Math.sin(t) * (h * 0.08);
				const curY = y + bodyHover;
				const sWidth = w * (0.4 + Math.sin(t) * 0.05);
				let sGrad = ctx.createRadialGradient(x, y + h * 0.5, 0,
					x, y + h * 0.5, sWidth);
				sGrad.addColorStop(0, "rgba(0, 0, 0, 0.4)");
				sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
				ctx.fillStyle = sGrad;
				ctx.beginPath();
				ctx.ellipse(x, y + h * 0.5, sWidth, h * 0.06, 0, 0, Math
					.PI * 2);
				ctx.fill();
				const sX = x + w * 0.6;
				const sY = curY - h * 0.1;
				ctx.lineCap = "round";
				ctx.lineWidth = Math.max(1, w * 0.08);
				ctx.strokeStyle = "#2d1b0d";
				ctx.beginPath();
				ctx.moveTo(sX, sY - h * 0.6);
				ctx.lineTo(sX, sY + h * 0.6);
				ctx.stroke();
				const cloakGrad = ctx.createLinearGradient(x - w, 0, x +
					w, 0);
				cloakGrad.addColorStop(0, "#2c3e50");
				cloakGrad.addColorStop(0.5, "#34495e");
				cloakGrad.addColorStop(1, "#1a2530");
				ctx.fillStyle = cloakGrad;
				ctx.strokeStyle = "#0f171e";
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(x - w * 0.35, curY - h * 0.2);
				ctx.quadraticCurveTo(x, curY - h * 0.25, x + w * 0.35,
					curY - h * 0.2);
				ctx.bezierCurveTo(x + w * 0.45, curY + h * 0.1, x + w *
					0.5, curY + h * 0.4, x + w * 0.45, curY + h *
					0.6);
				for (let i = 0; i <= 10; i++) {
					const pct = i / 10;
					const rx = (x + w * 0.45) - (w * 0.9) * pct;
					const ry = curY + h * 0.6 + Math.sin(t * 3 + pct *
						10) * (h * 0.03);
					ctx.lineTo(rx, ry);
				}
				ctx.bezierCurveTo(x - w * 0.5, curY + h * 0.4, x - w *
					0.45, curY + h * 0.1, x - w * 0.35, curY - h *
					0.2);
				ctx.fill();
				ctx.stroke();
				const headY = curY - h * 0.25 + Math.sin(t * 1.1) * 3;
				ctx.fillStyle = cloakGrad;
				ctx.beginPath();
				ctx.moveTo(x - w * 0.3, headY);
				ctx.bezierCurveTo(x - w * 0.3, headY - h * 0.45, x + w *
					0.3, headY - h * 0.45, x + w * 0.3, headY);
				ctx.quadraticCurveTo(x, headY + h * 0.1, x - w * 0.3,
					headY);
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = "#050505";
				ctx.beginPath();
				ctx.ellipse(x, headY - h * 0.12, w * 0.18, h * 0.18, 0,
					0, Math.PI * 2);
				ctx.fill();
				ctx.shadowBlur = w * 0.2;
				ctx.shadowColor = "#e066ff";
				ctx.fillStyle = "#fff";
				const eyeSize = Math.max(1, w * 0.04);
				ctx.beginPath();
				ctx.arc(x - w * 0.08, headY - h * 0.14, eyeSize, 0, Math
					.PI * 2);
				ctx.arc(x + w * 0.08, headY - h * 0.14, eyeSize, 0, Math
					.PI * 2);
				ctx.fill();
				ctx.shadowBlur = 0;
				const skullY = sY - h * 0.6;
				const sk = w * 0.13;
				ctx.save();
				ctx.translate(sX, skullY);
				ctx.fillStyle = "#e0e0e0";
				ctx.strokeStyle = "#1a1a1a";
				ctx.lineWidth = 1.2;
				ctx.beginPath();
				ctx.arc(0, -sk * 0.2, sk, Math.PI * 0.8, Math.PI * 2.2);
				ctx.lineTo(sk * 0.5, sk * 0.7);
				ctx.lineTo(-sk * 0.5, sk * 0.7);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				ctx.fillStyle = "#1a1a1a";
				ctx.beginPath();
				ctx.ellipse(-sk * 0.35, sk * 0.05, sk * 0.25, sk * 0.2,
					0.2, 0, Math.PI * 2);
				ctx.ellipse(sk * 0.35, sk * 0.05, sk * 0.25, sk * 0.2, -
					0.2, 0, Math.PI * 2);
				ctx.fill();
				ctx.beginPath();
				ctx.moveTo(0, sk * 0.2);
				ctx.lineTo(-sk * 0.1, sk * 0.35);
				ctx.lineTo(sk * 0.1, sk * 0.35);
				ctx.closePath();
				ctx.fill();
				ctx.beginPath();
				for (let i = -1; i <= 1; i++) {
					ctx.moveTo(i * sk * 0.25, sk * 0.55);
					ctx.lineTo(i * sk * 0.25, sk * 0.7);
				}
				ctx.stroke();
				ctx.restore();
				const spY = skullY - h * 0.2 + Math.sin(t * 4) * 5;
				const spRadius = w * 0.25;
				let sphereGrad = ctx.createRadialGradient(sX, spY, 0,
					sX, spY, spRadius);
				sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
				sphereGrad.addColorStop(0.4, "rgba(155, 89, 182, 0.4)");
				sphereGrad.addColorStop(1, "transparent");
				ctx.fillStyle = sphereGrad;
				ctx.beginPath();
				ctx.arc(sX, spY, spRadius * 1.2, 0, Math.PI * 2);
				ctx.fill();
				for (let i = 0; i < 3; i++) {
					const orbitSpeed = t * 2.5;
					const offset = i * (Math.PI * 2 / 3);
					const radius = spRadius * 0.6;
					const px = sX + Math.cos(orbitSpeed + offset) *
						radius;
					const py = spY + Math.sin(orbitSpeed + offset) *
						radius;
					ctx.fillStyle = "#ffffff";
					ctx.shadowBlur = 5;
					ctx.shadowColor = "#e066ff";
					ctx.fillRect(px - 1, py - 1, 2, 2);
					ctx.shadowBlur = 0;
				}
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				vars.dx *= 0.15;
				vars.dy *= 0.15;
				if (e.shooting_delay >= 2000) {
					smoke_create(obj.game, e.body.position.x, e.body
						.position.y, 15, "purple", 0.6);
					let baseAngle = Math.atan2(vars.dy, vars.dx);
					for (let i = -1; i <= 1; i++) {
						let theta = i * 0.25;
						let nx = Math.cos(baseAngle + theta);
						let ny = Math.sin(baseAngle + theta);
						bullet_create(
							obj.game,
							e.body.position.x,
							e.body.position.y,
							nx,
							ny,
							12,
							e.damage,
							true,
							e.w * 0.15,
							2500,
							"#3498db",
							"#2980b9"
						);
					}
					e.shooting_delay = 0;
				}
			}
		},
		on_death: (obj, target) => {
			smoke_create(obj.game, obj.data.body.position.x, obj.data
				.body.position.y, 40, "purple", 2.0);
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_NECROMANCER_STAFF, obj.data.body
				.position.x, obj.data.body.position.y, false, false);
		},
	},
	"devil": {
		name_eng: "devil",
		name_rus: "дьявол",
		requires: "necromancer",
		weight: 5,
		theme: THEME_BLOOD_FOREST,
		health: enemy_health_from_tier(ENEMY_TIER_DEVIL),
		speed: 6.0,
		damage: enemy_damage_from_tier(ENEMY_TIER_DEVIL),
		w: 45,
		h: 45,
		color: "#990000",
		outline: "#441111",
		range: 550,
		delay: 800,
		bossifier_item: ITEM_BOSSIFIER_DEVIL,
		max_minions: 3,
		visuals: {
			draw_gun: false,
			custom_draw: (e, ctx) => {
				const x = e.body.position.x;
				const y = e.body.position.y;
				const w = e.w;
				const h = e.h;
				if (e.age === undefined) e.age = 0;
				e.age += 1;
				const headY = y - h * 0.4;
				ctx.save();
				ctx.fillStyle = "#1a0000";
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(x, headY - h * 0.7, w * 0.7, 0, Math.PI, false);
				ctx.arc(x, headY - h * 0.9, w * 0.7, Math.PI, 0, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				ctx.restore();
				if (!e.tail_segments) {
					e.tail_segments = Array.from({
						length: 8
					}, () => ({
						x: x,
						y: y
					}));
				}
				const spawnRatio = Math.min(1, e.age / 35);
				const burstEffect = Math.max(0, 1 - e.age / 15);
				ctx.save();
				ctx.strokeStyle = "#4a0000";
				ctx.lineWidth = w * 0.08;
				ctx.lineCap = "round";
				let prevX = x;
				let prevY = y + h * 0.25;
				const segmentLen = w * 0.18;
				const vel = e.body.velocity;
				const isMoving = Math.hypot(vel.x, vel.y) > 0.2;
				const targetBaseAngle = isMoving ? Math.atan2(vel.y, vel
					.x) + Math.PI : 0;
				e.tail_segments.forEach((seg, i) => {
					const shootLeft = burstEffect * (-w * 12) *
						(i / 7);
					const targetAngle = i === 0 ?
						targetBaseAngle : Math.atan2(seg.y -
							prevY, seg.x - prevX);
					const targetX = prevX + Math.cos(
							targetAngle) * segmentLen +
						shootLeft;
					const targetY = prevY + Math.sin(
						targetAngle) * segmentLen;
					const followSpeed = 0.5 + (spawnRatio *
						0.3);
					seg.x += (targetX - seg.x) * followSpeed;
					seg.y += (targetY - seg.y) * followSpeed;
					const dx = seg.x - prevX;
					const dy = seg.y - prevY;
					const dist = Math.hypot(dx, dy);
					if (dist > 0) {
						seg.x = prevX + (dx / dist) *
							segmentLen;
						seg.y = prevY + (dy / dist) *
							segmentLen;
					}
					ctx.beginPath();
					ctx.moveTo(prevX, prevY);
					ctx.lineTo(seg.x, seg.y);
					ctx.stroke();
					if (i === e.tail_segments.length - 1) {
						ctx.save();
						ctx.translate(seg.x, seg.y);
						ctx.rotate(Math.atan2(seg.y - prevY, seg
							.x - prevX));
						ctx.fillStyle = "#2a0000";
						ctx.beginPath();
						ctx.moveTo(w * 0.12, 0);
						ctx.lineTo(0, -w * 0.08);
						ctx.lineTo(-w * 0.08, 0);
						ctx.lineTo(0, w * 0.08);
						ctx.closePath();
						ctx.fill();
						ctx.restore();
					}
					prevX = seg.x;
					prevY = seg.y;
				});
				ctx.restore();
			}
		},
		behaviour: (obj, dt, target, vars) => {},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 50) {
					let colors = ["#ff4500", "#ff8c00", "#ffd700"];
					let angle = Math.atan2(vars.ndy, vars.ndx);
					let spawnDist = e.w * 0.5;
					for (let i = 0; i < 2; i++) {
						let spread = (Math.random() - 0.5) * 0.4;
						let pSpeed = 10 + Math.random() * 6;
						let finalAngle = angle + spread;
						bullet_create(
							obj.game,
							e.body.position.x + Math.cos(
								finalAngle) * spawnDist,
							e.body.position.y + Math.sin(
								finalAngle) * spawnDist,
							Math.cos(finalAngle), Math.sin(
								finalAngle),
							pSpeed, e.damage * 0.15,
							true, 8 + Math.random() * 8, 800,
							colors[Math.floor(Math.random() * colors
								.length)],
							"orange", false, false, "red", true,
							false
						);
					}
					e.shooting_delay = 0;
				}
				vars.dx *= 0.1;
				vars.dy *= 0.1;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_FIRE_STAFF, obj.data.body
				.position.x, obj.data.body.position.y, false, false);
			if (target?.name == "player") {
				achievement_do(target.data.achievements_element.data
					.achievements, "prince of darkness", target.data
					.achievements_shower_element);
			}
		},
		render_icon: (ctx, x, y, w, h) => {
			ctx.fillStyle = "#990000";
			ctx.strokeStyle = "#fa1a1a";
			y = y - w * 0.05;
			ctx.fillRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.strokeRect(x + w * 0.4, y + h * 0.58, w * 0.2, h * 0.2);
			ctx.fillStyle = "#fa1a1a";
			ctx.beginPath();
			ctx.moveTo(x + w * 0.4, y + h * 0.58);
			ctx.lineTo(x + w * 0.35, y + h * 0.48);
			ctx.lineTo(x + w * 0.44, y + h * 0.58);
			ctx.moveTo(x + w * 0.6, y + h * 0.58);
			ctx.lineTo(x + w * 0.65, y + h * 0.48);
			ctx.lineTo(x + w * 0.56, y + h * 0.58);
			ctx.fill();
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(x + w * 0.43, y + h * 0.63, w * 0.04, h *
				0.04);
			ctx.fillRect(x + w * 0.53, y + h * 0.63, w * 0.04, h *
				0.04);
		},
	},
};
ENEMY_TYPES["fat guy"] = {
	name_eng: "fat guy",
	name_rus: "толстый парень",
	requires: null,
	weight: 1,
	health: 1000000000000000,
	speed: 7,
	damage: 0.05,
	w: 30,
	h: 30,
	color: "green",
	outline: "white",
	range: 400,
	delay: 1000,
	bossifier_item: null,
	max_minions: 0,
	visuals: {
		draw_gun: false,
		outline_width: 1
	},
	on_death: (obj, target) => {
		if (target?.name == "player") achievement_do(target.data
			.achievements_element.data.achievements,
			"shoot 'em up", target.data
			.achievements_shower_element);
	},
	on_boss_death: (obj, target) => {
		item_create(obj.game, Math.random() < 0.33 ? ITEM_MINIGUN :
			ITEM_SHOTGUN, obj.data.body.position.x, obj.data
			.body.position.y, false, false);
		if (target?.name == "player") achievement_do(target.data
			.achievements_element.data.achievements, "big guy",
			target.data.achievements_shower_element);
	},
	render_icon: (ctx, x, y, w, h) => {
		ctx.fillStyle = "green";
		ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
	},
};
const E_COLS = COLORS_DEFAULT.enemies;
let ENEMY_TIER_REGULAR = 1;
let ENEMY_TIER_SHOOTING = 2;
let ENEMY_TIER_SHOOTING_RED = 6;
let ENEMY_TIER_SWORD = 7;
let ENEMY_TIER_SHOOTING_ROCKET = 10;
let ENEMY_TIER_SHOOTING_LASER = 19;
let ENEMY_TIER_DESERT = 3;
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
	return 1000 * weapon_damage_from_tier(n - 1);
}

function enemy_damage_from_tier(n) {
	return 0.5 * Math.tanh(0.1 * n);
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
		damage: enemy_damage_from_tier(ENEMY_TIER_REGULAR),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SHOOTING),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_DESERT),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SHOOTING_RED),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SWORD),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SHOOTING_ROCKET),
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
						.max_health * 0.005);
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SHADOW),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_ANUBIS),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SHOOTING_LASER),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SNOW),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_USHANKA),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_SNOWMAN),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_KRAMPUS),
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
		damage: enemy_damage_from_tier(ENEMY_TIER_BLOOD),
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
};
ENEMY_TYPES["fat guy"] = {
	name_eng: "fat guy",
	name_rus: "толстый парень",
	requires: null,
	weight: 1,
	health: 1000000000000000000000000000000000000000000,
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
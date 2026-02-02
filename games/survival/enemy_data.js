let ENEMY_TYPES = {
	"regular": {
		name_eng: "regular zombie",
		name_rus: "обыкновенный зомби",
		requires: null,
		weight: 1,
		health: 100,
		speed: 7,
		damage: 0.05,
		w: 30,
		h: 30,
		color: "green",
		outline: "white",
		range: 400,
		delay: 1000,
		bossifier_item: ITEM_BOSSIFIER_REGULAR,
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
	},
	"shooting": {
		name_eng: "shooting zombie",
		name_rus: "стреляющий зомби",
		requires: "regular",
		weight: 2,
		health: 100,
		speed: 5,
		damage: 0.25,
		w: 30,
		h: 30,
		color: "#335544",
		outline: "white",
		range: 400,
		delay: 1000,
		bossifier_item: ITEM_BOSSIFIER_SHOOTING,
		visuals: {
			draw_gun: true,
			gun_color: "#331133",
			gun_width: 0.25,
			outline_width: 1
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range) {
				if (e.shooting_delay >= 1000) {
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 10, e.damage,
						true, e.w * 0.2, 2000, "blue", "white");
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
			ctx.fillStyle = "#335544";
			ctx.fillRect(x + w * 0.38, y + h * 0.5, w * 0.18, h * 0.18);
			ctx.fillStyle = "#331133";
			ctx.fillRect(x + w * 0.56, y + h * 0.53, w * 0.15, h *
				0.08);
		},
	},
	"shooting red": {
		name_eng: "shooting red zombie",
		name_rus: "стреляющий красный зомби",
		requires: "shooting",
		weight: 3,
		health: 200,
		speed: 8,
		damage: 0.03125,
		w: 30,
		h: 30,
		color: "#999999",
		outline: "#aa3333",
		range: 400,
		delay: 200,
		bossifier_item: ITEM_BOSSIFIER_RED,
		visuals: {
			draw_gun: true,
			gun_color: "#551111",
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
						2000, "red", "white");
					bullet_create(obj.game, e.body.position.x, e.body
						.position.y, vars.dx, vars.dy, 15, e.damage,
						true, Math.max(0.09 * e.w, 4), 2000, "red",
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
						.damage, true, e.w * 0.1, 2000, "red",
						"pink");
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
			ctx.fillStyle = "#999999";
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = "#551111";
			ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.15, h * 0.06);
			ctx.fillRect(x + w * 0.55, y + h * 0.62, w * 0.15, h *
				0.06);
		},
	},
	"sword": {
		name_eng: "zombie with a sword",
		name_rus: "зомби с мечом",
		requires: "shooting red",
		weight: 4,
		health: 300,
		speed: 9.75,
		boss_speed_mult: 1.925,
		boss_max_health_mult: 0.95,
		minion_speed_mult: 0,
		minion_max_health_mult: 0.25,
		damage: 0.021875,
		w: 30,
		h: 30,
		color: "#bbaa11",
		outline: "lime",
		range: 400,
		delay: 500,
		max_minions: 25,
		minion_dist_mult: 5.25,
		bossifier_item: ITEM_BOSSIFIER_SWORD,
		visuals: {
			draw_gun: false,
			draw_sword: true,
			sword_color: "#55aa11",
			outline_width: 1
		},
		minion_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.tx, vars.ty, 7, e.damage,
					true, 0.33 * e.w, 2000, "gray", "lime");
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.ty, -vars.tx, 7, e.damage,
					true, 0.33 * e.w, 2000, "gray", "lime");
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, -vars.tx, -vars.ty, 7, e.damage,
					true, 0.33 * e.w, 2000, "gray", "lime");
				bullet_create(obj.game, e.body.position.x, e.body
					.position.y, -vars.ty, vars.tx, 7, e.damage,
					true, 0.33 * e.w, 2000, "gray", "lime");
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
			ctx.fillStyle = "#bbaa11";
			ctx.fillRect(x + w * 0.38, y + h * 0.55, w * 0.18, h *
				0.18);
			ctx.strokeStyle = "#55aa11";
			ctx.lineWidth = h * 0.045;
			ctx.beginPath();
			ctx.moveTo(x + w * 0.5, y + h * 0.7);
			ctx.lineTo(x + w * 0.65, y + h * 0.45);
			ctx.stroke();
		},
	},
	"shooting rocket": {
		name_eng: "zombie with a rocket launcher",
		name_rus: "зомби с ракетницей",
		requires: "sword",
		weight: 5,
		health: 500,
		speed: 4.75,
		damage: 0.75,
		w: 30,
		h: 30,
		color: "gray",
		outline: "black",
		range: 400,
		delay: 2500,
		bossifier_item: ITEM_BOSSIFIER_ROCKET,
		visuals: {
			draw_gun: true,
			gun_color: "#113355",
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
			ctx.fillStyle = "gray";
			ctx.fillRect(x + w * 0.38, y + h * 0.5, w * 0.18, h * 0.18);
			ctx.fillStyle = "#113355";
			ctx.fillRect(x + w * 0.56, y + h * 0.53, w * 0.15, h *
				0.08);
		},
	},
	"shooting laser": {
		name_eng: "rainbow alien",
		name_rus: "радужный пришелец",
		requires: "shooting rocket",
		weight: 6,
		health: 800,
		speed: 8.25,
		damage: 0.05,
		boss_shooting_range_mult: 1.5,
		boss_speed_mult: 1.75,
		boss_max_health_mult: 1.05,
		w: 50,
		h: 50,
		color: "#000000",
		use_rainbow_color_gradient: true,
		outline: "white",
		range: 600,
		delay: 150,
		max_minions: 5,
		minion_dist_mult: 7.5,
		bossifier_item: ITEM_BOSSIFIER_LASER,
		visuals: {
			draw_gun: true,
			gun_color: "#331133",
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
						let colors = ["red", "orange", "yellow", "lime",
							"cyan", "blue", "purple"
						];
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
					let colors = ["red", "orange", "yellow", "lime",
						"cyan", "blue", "purple"
					];
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
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(x + w * 0.4, y + h * 0.5, w * 0.2, h * 0.2);
			ctx.fillStyle = "#331133";
			ctx.fillRect(x + w * 0.55, y + h * 0.5, w * 0.15, h * 0.06);
			ctx.fillRect(x + w * 0.55, y + h * 0.62, w * 0.15, h *
				0.06);
		}
	},
	"deer": {
		name_eng: "deer",
		name_rus: "олень",
		requires: null,
		weight: 0,
		health: 2100,
		speed: 7.875,
		damage: 0.35,
		w: 30,
		h: 30,
		color: "#aa8844",
		outline: "white",
		range: 400,
		delay: 1000,
		visuals: {
			draw_gun: false,
			outline_width: 1,
			custom_draw: (e, ctx) => {
				animal_deer_draw_horns(ctx, e.body.position.x, e.body
					.position.y, e.w, e.h);
			}
		},
		behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			let k = e.boss ? 6.25 : 1.75;
			if (e.jump_delay >= 2200) e.jump_delay = 0;
			else if (e.jump_delay >= 1600) {
				vars.dx = 0;
				vars.dy = 0;
			}
			else if (e.jump_delay >= 1500) {
				vars.dx *= k;
				vars.dy *= k;
				e.jump_delay = 1600;
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
		health: 1300,
		speed: 8.125,
		damage: 0.35,
		w: 30,
		h: 30,
		color: "#444444",
		outline: "#ff0000",
		range: 600,
		delay: 500,
		visuals: {
			draw_gun: false,
			custom_draw: (e, ctx) => {
				enemy_raccoon_boss_draw(ctx, e.body.position.x, e.body
					.position.y, e.w, e.h, e);
			},
			outline_width: 2
		},
		boss_behaviour: (obj, dt, target, vars) => {
			let e = obj.data;
			if (vars.v < e.shooting_range && e.shooting_delay >= 500) {
				let cosA = 0.9238,
					sinA = 0.3826;
				trash_bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.ndx, vars.ndy, 24, e.damage,
					true, e.w * 0.5);
				trash_bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.ndx * cosA - vars.ndy * (-
						sinA), vars.ndx * (-sinA) + vars.ndy * cosA,
					24, e.damage, true, e.w * 0.5);
				trash_bullet_create(obj.game, e.body.position.x, e.body
					.position.y, vars.ndx * cosA - vars.ndy * sinA,
					vars.ndx * sinA + vars.ndy * cosA, 24, e.damage,
					true, e.w * 0.5);
				e.shooting_delay = 0;
			}
		},
		on_boss_death: (obj, target) => {
			item_create(obj.game, ITEM_JUNK_CANNON, obj.data.body
				.position.x, obj.data.body.position.y);
		}
	}
};
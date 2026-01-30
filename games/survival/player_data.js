const WEAPON_DEFS = {
	[ITEM_STONE]: {
		cooldown: 600,
		ammo: ITEM_STONE,
		chance: 1.0,
		sound: "data/sfx/sword_1.mp3",
		vol: 0.25,
		color: "black",
		length: 0.8,
		width: 1.0,
		doNotDrawGun: true,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 7.5 + 7.5 * Math
			.random(), 2 * Math.random(), false, 12, 1500, "gray",
			"#333")
	},
	[ITEM_STICK]: {
		isMelee: true,
		color: "#8B4513",
		swordLength: 70,
		action: (g, p, v, dt) => {
			if (Math.cos(p.sword_direction) < -0.97) {
				audio_play("data/sfx/sword_1.mp3", 0.15);
			}
			player_handle_melee(
				g,
				p,
				v,
				dt,
				0.015,
				0.05,
				0.25,
				Math.PI / 6,
				1000,
				300
			);
		}
	},
	[ITEM_GUN]: {
		cooldown: 200,
		ammo: ITEM_AMMO,
		chance: 0.01,
		sound: "data/sfx/gunshot_1.mp3",
		vol: 0.25,
		color: "black",
		length: 0.8,
		width: 1.0,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 20, 0.5)
	},
	[ITEM_DESERT_EAGLE]: {
		cooldown: 600,
		ammo: ITEM_AMMO,
		chance: 0.01,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.35,
		color: "#888888",
		length: 0.8,
		width: 1.0,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 32, Math.random() *
			2 + 1)
	},
	[ITEM_REVOLVER]: {
		cooldown: 800,
		ammo: ITEM_AMMO,
		chance: 0.01,
		sound: "data/sfx/revolver_1.mp3",
		vol: 0.4,
		color: "#555555",
		length: 0.9,
		width: 1.1,
		action: (g, p, v) => bullet_create(
			g,
			p.body.position.x,
			p.body.position.y,
			v.tx - v.sx,
			v.ty - v.sy,
			25,
			Math.random() * 2.5 + 1.5
		)
	},
	[ITEM_PLASMA_PISTOL]: {
		cooldown: 200,
		ammo: ITEM_PLASMA,
		chance: 0.005,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.25,
		color: "#331133",
		length: 0.8,
		width: 1.0,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 20, (25 + 25 * Math
				.random()) * 0.5, false, 6, 1500, "cyan", "blue")
	},
	[ITEM_SHOTGUN]: {
		cd_prop: 'shotgun_cooldown',
		cooldown: 750,
		ammo: ITEM_AMMO,
		chance: 0.015,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.25,
		color: "#773311",
		length: 1.3,
		width: 1.25,
		action: (g, p, v) => {
			for (let i = 0; i < Math.random() * 7 + 7; i++)
				bullet_create(g, p.body.position.x, p.body.position.y, (
						0.95 + 0.1 * Math.random()) * v.tx - v.sx, (
						0.95 + 0.1 * Math.random()) * v.ty - v.sy, Math
					.random() * 10 + 10, 5 * 0.5 * (0.5 + 1.0 * Math
						.random()));
		}
	},
	[ITEM_MINIGUN]: {
		cd_prop: 'minigun_cooldown',
		cooldown: 60,
		ammo: ITEM_AMMO,
		chance: 0.005,
		sound: "data/sfx/gunshot_1.mp3",
		vol: 0.25,
		color: "#113377",
		length: 1.5,
		width: 1.4,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, (0.95 + 0.1 * Math.random()) * v.tx - v.sx, (
				0.95 + 0.1 * Math.random()) * v.ty - v.sy, Math
			.random() * 10 + 10, 0.66 * 10 * 0.5 * Math.random())
	},
	[ITEM_JUNK_CANNON]: {
		cooldown: 250,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.5,
		ammo: ITEMS_JUNK,
		color: "#444444",
		length: 1.6,
		width: 2.8,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			[0, Math.PI / 8, -Math.PI / 8].forEach(angleOffset => {
				let finalAngle = theta + angleOffset;
				trash_bullet_create(g, p.body.position.x + Math
					.cos(theta) * p.w * 1.5,
					p.body.position.y + Math.sin(theta) * p
					.w * 1.5,
					Math.cos(finalAngle), Math.sin(
						finalAngle), 25,
					150 * 15625 * 0.5 * (1 + Math.random()),
					false, 45);
			});
			return true;
		},
		chance: 0.25
	},
	[ITEM_PLASMA_LAUNCHER]: {
		cooldown: 400,
		ammo: ITEM_PLASMA,
		chance: 0.01,
		sound: "data/sfx/plasmagun_1.mp3",
		vol: 0.125,
		color: "#331133",
		length: 1.3,
		width: 2.25,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 17.5, 4.25 * 25 *
			0.5 * (0.25 + 1.5 * Math.random()), false, 12.5, 1500,
			"cyan", "blue")
	},
	[ITEM_ROCKET_LAUNCHER]: {
		cooldown: 400,
		ammo: ITEM_ROCKET,
		chance: 0.01,
		sound: "data/sfx/rocketlauncher_1.mp3",
		vol: 0.125,
		color: "#111133",
		length: 1.3,
		width: 2.25,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			rocket_create(g, p.body.position.x + Math.cos(theta) * p.w *
				1.75, p.body.position.y + Math.sin(theta) * p.h *
				1.75, v.tx - v.sx, v.ty - v.sy, Math.min(0.25 * p.w,
					10), null, 0.33 * 3125 * 0.5 * (0.75 + 0.5 *
					Math.random()), p.max_health, false, 20);
		}
	},
	[ITEM_RED_PISTOLS]: {
		cooldown: 100,
		ammo: ITEM_RED_PLASMA,
		chance: 0.001,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#551111",
		length: 0.8,
		width: 1.0,
		hasSecondary: true,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			[-Math.PI / 4, Math.PI / 4].forEach(off => {
				bullet_create(g, p.body.position.x + p.w * Math
					.cos(theta + off), p.body.position.y + p
					.w * Math.sin(theta + off), v.tx - v.sx,
					v.ty - v.sy, 30, 1.5 * 125 * 0.5 * 2.5 *
					Math.random(), false, 6, 1500, "pink",
					"red");
			});
		}
	},
	[ITEM_ROCKET_SHOTGUN]: {
		cooldown: 500,
		ammo: ITEM_ROCKET,
		chance: 0.01,
		sound: "data/sfx/rocketlauncher_1.mp3",
		vol: 0.125,
		color: "#111133",
		length: 1.3,
		width: 1.25,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			let N = Math.floor(Math.random() * 4 + 3);
			for (let i = 0; i <= N; i++)
				rocket_create(g, p.body.position.x + 2 * p.w * Math.cos(
						theta - (0.5 * N - i) * Math.PI / N), p.body
					.position.y + 2 * p.w * Math.sin(theta - (0.5 * N -
						i) * Math.PI / N), v.tx - v.sx, v.ty - v.sy, 6,
					null, 0.11 * 3125 * 0.5 * (0.1 + 0.9 * Math
						.random()), p.max_health, false, 20, 1500);
		}
	},
	[ITEM_RED_SHOTGUN]: {
		cooldown: 500,
		ammo: ITEM_RED_PLASMA,
		chance: 0.01,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#551111",
		length: 1.3,
		width: 1.25,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			let N = Math.floor(Math.random() * 7 + 5);
			for (let i = 0; i <= N; i++)
				bullet_create(g, p.body.position.x + 2 * p.w * Math.cos(
						theta - (0.5 * N - i) * Math.PI / N), p.body
					.position.y + 2 * p.w * Math.sin(theta - (0.5 * N -
						i) * Math.PI / N), v.tx - v.sx, v.ty - v.sy, 30,
					4.0 * 125 * 0.5 * (0.75 + 0.25 * Math.random()),
					false, 6, 1500, "pink", "red");
		}
	},
	[ITEM_LASER_GUN]: {
		isContinuous: true,
		color: "purple",
		length: 1.8,
		width: 2.0,
		centerFire: true,
		action: (g, p, v, dt) => {
			if (!inventory_has_item(p.inventory_element,
					ITEM_RAINBOW_AMMO)) return;
			if (!p.laser_sound_has_played) {
				audio_play("data/sfx/beam_of_laser_fires_1.mp3", 0.25);
				p.laser_sound_has_played = true;
			}
			p.laser_direction = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			p.shooting_laser = true;
			g.objects.forEach(obj => {
				if (!obj.destroyed && ["animal", "enemy",
						"trashcan", "car", "rocket"
					].includes(obj.name)) {
					if (obj.name === "car" && obj.data.is_tank)
						return;
					if (player_laser_hits_point(p.body.position
							.x, p.body.position.y, obj.data.body
							.position.x, obj.data.body.position
							.y, 1.5 * p.w, 60 * p.w, p
							.laser_direction)) {
						obj.data.health -= 15625 * dt;
						obj.data.hit_by_player = true;
					}
				}
			});
			if (Math.random() < 0.00005 * dt) inventory_clear_item(p
				.inventory_element, ITEM_RAINBOW_AMMO, 1);
		}
	},
	[ITEM_SWORD]: {
		isMelee: true,
		color: "#55aa11",
		swordLength: 100,
		action: (g, p, v, dt) => {
			if (Math.cos(p.sword_direction) < -0.985) audio_play(
				"data/sfx/sword_1.mp3");
			player_handle_melee(g, p, v, dt, 0.02, 3000, 2000, Math.PI /
				8, 1500, 500);
		}
	},
	[ITEM_HORN]: {
		isMelee: true,
		color: "brown",
		isHorn: true,
		swordLength: 100,
		action: (g, p, v, dt) => {
			if (Math.cos(p.sword_direction) < -0.955) audio_play(
				"data/sfx/sword_1.mp3");
			player_handle_melee(g, p, v, dt, 0.04, 300000, 200000, Math
				.PI / 4, 15000, 5000);
		}
	},
	[ITEM_GREEN_GUN]: {
		cd_prop: 'minigun_cooldown',
		cooldown: 90,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#117733",
		length: 1.6,
		width: 1.0,
		action: (g, p, v, dt) => {
			bullet_create(g, p.body.position.x, p.body.position.y, (
					0.975 + 0.05 * Math.random()) * v.tx - v.sx, (
					0.975 + 0.05 * Math.random()) * v.ty - v.sy,
				Math.random() * 10 + 20, 1000 * Math.random(),
				false, 6, 1500, "lime", "green");
			p.health -= 0.0255 * dt;
			p.hunger -= 0.0125 * dt;
			p.thirst -= 0.0125 * dt;
		}
	},
	[ITEM_RAINBOW_PISTOLS]: {
		cooldown: 100,
		hasSecondary: true,
		length: 0.8,
		width: 1.0,
		dynamicColor: (p) =>
			`hsl(${(p.item_animstate * 24) % 360}, 80%, 50%)`,
		action: (g, p, v, dt) => {
			const ammoList = [ITEM_RAINBOW_AMMO, ITEM_RED_PLASMA,
				ITEM_PLASMA, ITEM_AMMO, ITEM_ROCKET
			];
			let ammoType = ammoList.find(id => inventory_has_item(p
				.inventory_element, id));
			if (!ammoType) return false;
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			let colors = ["red", "orange", "yellow", "lime", "cyan",
				"blue", "purple"
			];
			p.gradient += 0.01 * dt;
			let c1 = "yellow",
				c2 = "orange",
				sfx = "gunshot_1",
				chance = 0.01;
			if (ammoType === ITEM_RAINBOW_AMMO) {
				c1 = colors[Math.floor(p.gradient) % 7];
				c2 = "white";
				sfx = "red_pistols_1";
				chance = 0.001;
			}
			else if (ammoType === ITEM_RED_PLASMA) {
				c1 = "red";
				c2 = "pink";
				sfx = "red_pistols_1";
			}
			else if (ammoType === ITEM_PLASMA) {
				c1 = "cyan";
				c2 = "blue";
				sfx = "red_pistols_1";
			}
			if (ammoType !== ITEM_ROCKET || ammoType ===
				ITEM_RAINBOW_AMMO) {
				[-Math.PI / 4, Math.PI / 4].forEach(off => {
					bullet_create(g, p.body.position.x + p.w *
						Math.cos(theta + off), p.body
						.position.y + p.w * Math.sin(theta +
							off), v.tx - v.sx, v.ty - v.sy,
						30, 3 * 15625 * 0.5 * (0.25 + 1.5 *
							Math.random()), false, 6, 1500,
						c1, c2);
				});
				audio_play("data/sfx/" + sfx + ".mp3", 0.25);
			}
			else {
				[-Math.PI / 4, Math.PI / 4].forEach(off => {
					rocket_create(g, p.body.position.x + Math
						.cos(theta + off) * p.w * 1.75, p
						.body.position.y + Math.sin(theta +
							off) * p.h * 1.75, v.tx - v.sx,
						v.ty - v.sy, 0.15 * p.w, null, 0.5 *
						15625 * 0.5 * (0.25 + 1.5 * Math
							.random()), p.max_health, false,
						20);
				});
				audio_play("data/sfx/rocketlauncher_1.mp3", 0.125);
			}
			if (Math.random() < chance) inventory_clear_item(p
				.inventory_element, ammoType, 1);
			return true;
		}
	}
};
const ITEM_BEHAVIORS = {
	[ITEM_FUEL]: {
		achievement: "fuel up",
		action: (p, player_obj) => {
			const c = game_object_find_closest(player_obj.game, p.body
				.position.x, p.body.position.y, "car", 200);
			if (!c) return false;
			const ratio = Math.random() * 0.1 + 0.1;
			c.data.fuel += Math.min(c.data.max_fuel - c.data.fuel, c
				.data.max_fuel * ratio);
			c.data.health += Math.min(c.data.max_health - c.data.health,
				c.data.max_health * ratio);
			return true;
		}
	},
	[ITEM_BOSSIFIER]: {
		action: (p, player_obj) => {
			let target = game_object_find_closest(player_obj.game, p
				.body.position.x, p.body.position.y, "animal", 500);
			let isAnimal = true;
			if (!target) {
				target = game_object_find_closest(player_obj.game, p
					.body.position.x, p.body.position.y, "enemy",
					500);
				isAnimal = false;
			}
			if (!target) return false;
			enemy_create(target.game, target.data.body.position.x,
				target.data.body.position.y, true, false, target
				.data.type);
			if (isAnimal) animal_destroy(target, false);
			else enemy_destroy(target);
			return true;
		}
	},
	[ITEM_SHIELD]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = p.shield_blue_health_max;
			p.shield_green_health = 0;
			p.shield_rainbow_health = 0;
			return true;
		}
	},
	[ITEM_SHIELD_GREEN]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = p.shield_green_health_max;
			p.shield_rainbow_health = 0;
			return true;
		}
	},
	[ITEM_SHIELD_RAINBOW]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = 0;
			p.shield_rainbow_health = p.shield_rainbow_health_max;
			return true;
		}
	},
	[ITEM_HEALTH]: {
		sfx: "data/sfx/healing_1.mp3",
		achievement: "healthy lifestyle",
		action: (p) => {
			p.health += Math.min(p.max_health - p.health, (Math
				.random() * 0.125 + 0.125) * p.max_health);
			return true;
		}
	},
	[ITEM_HEALTH_GREEN]: {
		sfx: "data/sfx/healing_1.mp3",
		action: (p) => {
			const ratio = Math.random() * 0.125 + 0.375;
			p.health = Math.min(p.max_health, p.health + p.max_health *
				ratio);
			p.hunger = Math.min(p.max_hunger, p.hunger + p.max_hunger *
				ratio);
			p.thirst = Math.min(p.max_thirst, p.thirst + p.max_thirst *
				ratio);
			return true;
		}
	},
	[ITEM_BOSSIFIER]: {
		action: (p, player_obj) => {
			let target = game_object_find_closest(player_obj.game, p
				.body.position.x, p.body.position.y, "animal", 500);
			let isAnimal = true;
			if (!target) {
				target = game_object_find_closest(player_obj.game, p
					.body.position.x, p.body.position.y, "enemy",
					500);
				isAnimal = false;
			}
			if (!target) return false;
			enemy_create(target.game, target.data.body.position.x,
				target.data.body.position.y, true, false, target
				.data.type);
			if (isAnimal) animal_destroy(target, false);
			else enemy_destroy(target);
			return true;
		}
	},
};
ITEMS_DRINKS.forEach(id => {
	ITEM_BEHAVIORS[id] = {
		sfx: "data/sfx/water_1.mp3",
		achievement: "stay hydrated",
		action: (p) => {
			p.thirst += Math.min(p.max_thirst - p.thirst, (Math
					.random() * 0.125 + 0.125) * p
				.max_thirst);
			return true;
		}
	};
});
ITEMS_FOODS.forEach(id => {
	ITEM_BEHAVIORS[id] = {
		sfx: "data/sfx/eating_1.mp3",
		achievement: "yummy",
		action: (p) => {
			p.hunger += Math.min(p.max_hunger - p.hunger, (Math
					.random() * 0.125 + 0.125) * p
				.max_hunger);
			p.thirst += Math.min(p.max_thirst - p.thirst, (Math
					.random() * 0.03125 + 0.03125) * p
				.max_thirst);
			return true;
		}
	};
});
Object.keys(ENEMY_TYPES).forEach(type => {
	const cfg = ENEMY_TYPES[type];
	if (cfg.bossifier_item) {
		const itemId = cfg.bossifier_item;
		let enemyTypeEng = ENEMY_TYPES[type].name_eng;
		let enemyTypeRus = ENEMY_TYPES[type].name_rus;
		let salt = "";
		let saltRus = "";
		if (type === "regular") {
			salt =
				" To make a boss, stand close to an enemy while holding bossifier and use the item."
			saltRus =
				" Чтобы превратить противника в босса, подойдите к нему и воспользуйтесь боссификатором в руках."
		}
		ITEMS_DATA[itemId] = {
			name: `Bossifier: ${enemyTypeEng}`,
			desc: `Forces a ${enemyTypeEng} enemy into its boss form.` +
				salt,
			name_rus: `Боссификатор: ${enemyTypeRus}`,
			desc_rus: `Превращает противника типа ${enemyTypeRus} в босса.` +
				saltRus,
			render: (ctx, x, y, w, h, animstate) =>
				item_draw_bossifier_icon(ctx, x, y, w, h, animstate,
					type)
		};
		ITEM_BEHAVIORS[itemId] = {
			action: (p, player_obj) => {
				let t = game_object_find_closest(
					player_obj.game,
					player_obj.data.body.position.x,
					player_obj.data.body.position.y,
					"enemy",
					600,
					(obj) => obj.data.type === type && !obj
					.data.boss
				);
				if (t && t.data.type === type && !t.data.boss) {
					enemy_create(t.game, t.data.body.position.x,
						t.data.body.position.y, true, false,
						type);
					enemy_destroy(t);
					return true;
				}
				return false;
			}
		};
	}
});
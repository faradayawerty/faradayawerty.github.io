const BALANCE_FACTOR = 1.0;

function weapon_damage_from_tier(n) {
	return Math.pow(1.5, n + 0.5 / n);
}
const WEAPON_DEFS = {
	[ITEM_MUMMY_PISTOLS]: {
		cooldown: 100,
		ammo: ITEM_PLASMA,
		chance: 0.001,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#D2B48C",
		length: 0.8,
		width: 1.0,
		hasSecondary: true,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			[-Math.PI / 4, Math.PI / 4].forEach(off => {
				bullet_create(g, p.body.position.x + p.w * Math
					.cos(theta + off), p.body.position.y + p
					.w * Math.sin(theta + off), v.tx - v.sx,
					v.ty - v.sy, 30, (0.4 + 0.8 * Math
						.random()) * 1.84 * BALANCE_FACTOR *
					weapon_damage_from_tier(5.75),
					false, 6, 1500,
					"#44bbff", "white",
					false, false, null
				);
			});
		}
	},
	[ITEM_MUMMY_SHOTGUN]: {
		cooldown: 200,
		ammo: ITEM_PLASMA,
		chance: 0.001,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#D2B48C",
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
					(2.5 + 0.5 * Math.random()) * 3.52 *
					BALANCE_FACTOR * (1000 / 6500) *
					weapon_damage_from_tier(5.75),
					false, 6, 1500, "#44bbff", "white",
					false, false, null
				);
		}
	},
	[ITEM_SHADOW_STAFF]: {
		cooldown: 400,
		ammo: ITEM_PLASMA,
		chance: 0.0025,
		sound: "data/sfx/plasmagun_1.mp3",
		vol: 0.3,
		color: "#1a0a25",
		length: 1.8,
		width: 0.8,
		action: (g, p, v) => {
			let N = 12;
			for (let i = 0; i < N; i++) {
				let angle = (i / N) * Math.PI * 2;
				bullet_create(
					g, p.body.position.x, p.body.position.y,
					Math.cos(angle), Math.sin(angle),
					10, 2.0 * 166.6 * BALANCE_FACTOR * (1000 /
						150000) * weapon_damage_from_tier(7), false,
					12, 1200, "#4400ff", "black"
				);
			}
			return true;
		}
	},
	[ITEM_SHADOW_DUAL_SHOTGUNS]: {
		cooldown: 150,
		ammo: ITEM_PLASMA,
		chance: 0.0025,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.3,
		color: "#0a0a0f",
		length: 1.1,
		width: 1.2,
		hasSecondary: true,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			if (p.shadow_alt === undefined) p.shadow_alt = false;
			let off = p.shadow_alt ? Math.PI / 4 : -Math.PI / 4;
			let sx = p.body.position.x + p.w * Math.cos(theta + off);
			let sy = p.body.position.y + p.w * Math.sin(theta + off);
			for (let i = 0; i < 7; i++) {
				bullet_create(
					g, sx, sy,
					(0.92 + 0.16 * Math.random()) * v.tx - v.sx,
					(0.92 + 0.16 * Math.random()) * v.ty - v.sy,
					14 + 6 * Math.random(),
					(5 + 10 * Math.random()) * 4.85 *
					BALANCE_FACTOR * (1000 / 85000) *
					weapon_damage_from_tier(7),
					false, 8, 900, "#8800ff", "black", false, true
				);
			}
			p.shadow_alt = !p.shadow_alt;
			p.shot_cooldown = p.shadow_alt ? 150 : 800;
			return true;
		}
	},
	[ITEM_ANUBIS_SANDSTORM_STAFF]: {
		cooldown: 60,
		ammo: ITEM_RED_PLASMA,
		chance: 0.001,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.1,
		color: "#FFD700",
		length: 1.8,
		width: 0.8,
		action: (g, p, v, dt) => {
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "orange";
				secondaryColor = "black";
			}
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			for (let i = 0; i < 4; i++) {
				let offsetSide = (Math.random() - 0.5) * (p.w * 2.25);
				let startX = p.body.position.x + Math.cos(theta) * p.w -
					Math.sin(theta) * offsetSide;
				let startY = p.body.position.y + Math.sin(theta) * p.w +
					Math.cos(theta) * offsetSide;
				let speed = 16 + Math.random() * 18;
				let streamAngle = theta + (Math.random() - 0.5) * 0.08;
				bullet_create(
					g, startX, startY, Math.cos(streamAngle), Math
					.sin(streamAngle),
					speed, (10 + 15 * Math.random()) * 4.52 *
					BALANCE_FACTOR * (1000 / 150000) *
					weapon_damage_from_tier(8),
					false, Math.random() * 3 + 4, 700 + Math
					.random() * 300, mainColor, secondaryColor,
					false, true
				);
			}
			return true;
		}
	},
	[ITEM_ANUBIS_PUNISHER_ROD]: {
		cooldown: 400,
		ammo: ITEM_RED_PLASMA,
		chance: 0.0025,
		sound: "data/sfx/plasmagun_1.mp3",
		vol: 0.125,
		color: "#ffd700",
		length: 1.8,
		width: 2.25,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			let angles = [-0.2, 0, 0.2];
			angles.forEach(offset => {
				let finalAngle = theta + offset;
				bullet_create(
					g, p.body.position.x, p.body.position.y,
					Math.cos(finalAngle), Math.sin(
						finalAngle),
					17.5, (0.75 + 0.5 * Math.random()) *
					29.4 * BALANCE_FACTOR * (1000 / 10000) *
					weapon_damage_from_tier(8),
					false, 12.5, 1500, "red", "gold"
				);
			});
			return true;
		}
	},
	[ITEM_SNAKE_STAFF]: {
		cooldown: 60,
		ammo: ITEM_VENOM,
		chance: 0.005,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.1,
		color: "#1a0f05",
		length: 1.8,
		width: 0.8,
		action: (g, p, v, dt) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			for (let i = 0; i < 4; i++) {
				let offsetSide = (Math.random() - 0.5) * (p.w * 2.25);
				let startX = p.body.position.x + Math.cos(theta) * p.w -
					Math.sin(theta) * offsetSide;
				let startY = p.body.position.y + Math.sin(theta) * p.w +
					Math.cos(theta) * offsetSide;
				let speed = 16 + Math.random() * 18;
				let streamAngle = theta + (Math.random() - 0.5) * 0.08;
				bullet_create(
					g, startX, startY, Math.cos(streamAngle), Math
					.sin(streamAngle),
					speed, (10 + 15 * Math.random()) * 4.44 *
					BALANCE_FACTOR * 1.5 * (1000 / 200000) *
					weapon_damage_from_tier(11),
					false, Math.random() * 3 + 4, 700 + Math
					.random() * 300,
					"#00ff44", "#ccff00", false, true
				);
			}
			return true;
		}
	},
	[ITEM_VENOM_DUAL_SHOTGUNS]: {
		cooldown: 150,
		ammo: ITEM_VENOM,
		chance: 0.0025,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.3,
		color: "#224422",
		length: 1.1,
		width: 1.2,
		hasSecondary: true,
		action: (g, p, v) => {
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			if (p.venom_alt === undefined) p.venom_alt = false;
			let off = p.venom_alt ? Math.PI / 4 : -Math.PI / 4;
			let sx = p.body.position.x + p.w * Math.cos(theta + off);
			let sy = p.body.position.y + p.w * Math.sin(theta + off);
			for (let i = 0; i < 7; i++) {
				bullet_create(
					g, sx, sy,
					(0.92 + 0.16 * Math.random()) * v.tx - v.sx,
					(0.92 + 0.16 * Math.random()) * v.ty - v.sy,
					14 + 6 * Math.random(),
					(5 + 10 * Math.random()) * 0.24 *
					BALANCE_FACTOR * (1000 / 4000) *
					weapon_damage_from_tier(11) * 0.75,
					false, 8, 900, "lime", "green", false, true
				);
			}
			p.venom_alt = !p.venom_alt;
			p.shot_cooldown = p.venom_alt ? 150 : 800;
			return true;
		}
	},
	[ITEM_VENOM_SHOTGUN]: {
		cooldown: 800,
		ammo: ITEM_VENOM,
		chance: 0.012,
		sound: "data/sfx/shotgun_1.mp3",
		vol: 0.25,
		color: "#225522",
		length: 1.1,
		width: 1.3,
		action: (g, p, v) => {
			let count = Math.floor(Math.random() * 5 + 6);
			for (let i = 0; i < count; i++) {
				bullet_create(
					g, p.body.position.x, p.body.position.y,
					(0.9 + 0.2 * Math.random()) * v.tx - v.sx,
					(0.9 + 0.2 * Math.random()) * v.ty - v.sy,
					Math.random() * 8 + 12, (0.5 + 0.5 * Math
						.random()) * 0.62 * BALANCE_FACTOR,
					false, 10, 800, "lime", "green"
				);
			}
		}
	},
	[ITEM_ACID_SMG]: {
		cooldown: 90,
		ammo: ITEM_VENOM,
		chance: 0.009,
		sound: "data/sfx/gunshot_1.mp3",
		vol: 0.15,
		color: "#447744",
		length: 1.0,
		width: 0.9,
		action: (g, p, v) => {
			let spread = 12;
			let dx = (v.tx - v.sx) + (Math.random() - 0.5) * spread;
			let dy = (v.ty - v.sy) + (Math.random() - 0.5) * spread;
			bullet_create(
				g, p.body.position.x, p.body.position.y, dx, dy,
				24, 1.2 * 1.04 * BALANCE_FACTOR, false, 6, 1500,
				"#00ff00", "#008800"
			);
		}
	},
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
			.random(), (0.3 + 0.2 * Math.random()) * 4.93 *
			BALANCE_FACTOR, false, 12, 1500,
			"gray", "#333")
	},
	[ITEM_STICK]: {
		isMelee: true,
		color: "#8B4513",
		swordLength: 70,
		action: (g, p, v, dt) => {
			player_handle_melee(g, p, v, dt, 0.015, 4.93 *
				BALANCE_FACTOR, 0.5, Math.PI / 6, 1000, 300);
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
		action: (g, p, v) => {
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "yellow";
				secondaryColor = "black";
			}
			bullet_create(g, p.body.position.x, p.body
				.position.y, v.tx - v.sx, v.ty - v.sy, 20, 0.25 *
				5.49 *
				BALANCE_FACTOR * weapon_damage_from_tier(1),
				false, 6, 1500, mainColor, secondaryColor)
		}
	},
	[ITEM_KALASHNIKOV]: {
		cooldown: 130,
		ammo: ITEM_AMMO,
		chance: 0.0025,
		sound: "data/sfx/gunshot_1.mp3",
		vol: 0.2,
		color: "#333333",
		length: 1.4,
		width: 1.1,
		action: (g, p, v) => {
			let mainColor = "#ffcc00";
			let secondaryColor = "black";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "#ffcc00";
			}
			let spread = 25;
			let dx = (v.tx - v.sx) + (Math.random() - 0.5) * spread;
			let dy = (v.ty - v.sy) + (Math.random() - 0.5) * spread;
			bullet_create(
				g, p.body.position.x, p.body.position.y, dx, dy,
				22, (0.5 + 0.5 * Math.random()) * 2.14 *
				BALANCE_FACTOR * weapon_damage_from_tier(5), false,
				7, 1500, mainColor, secondaryColor
			);
		}
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
		action: (g, p, v) => {
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "yellow";
			}
			bullet_create(g, p.body.position.x, p.body
				.position.y, v.tx - v.sx, v.ty - v.sy, 32, 1.2 *
				5.68 *
				BALANCE_FACTOR * weapon_damage_from_tier(1),
				false, 6, 1500, mainColor, secondaryColor)
		}
	},
	[ITEM_REVOLVER]: {
		cooldown: 800,
		ammo: ITEM_AMMO,
		chance: 0.05,
		sound: "data/sfx/revolver_1.mp3",
		vol: 0.1,
		color: "#555555",
		length: 0.9,
		width: 1.1,
		action: (g, p, v) => {
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "orange";
			}
			bullet_create(
				g, p.body.position.x, p.body.position.y, v.tx - v
				.sx, v.ty -
				v.sy,
				25, (3 + 2 * Math.random()) * 4.93 *
				BALANCE_FACTOR * (
					1000 / 9000) * 2 * weapon_damage_from_tier(
				5.25),
				false, 6, 1500, mainColor, secondaryColor)
		}
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
		action: (g, p, v) => {
			let mainColor = "cyan";
			let secondaryColor = "blue";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "blue";
				secondaryColor = "black";
			}
			bullet_create(g, p.body.position.x, p.body
				.position.y, v.tx - v.sx, v.ty - v.sy, 20, (0.25 +
					0.5 *
					Math
					.random()) * 1.91 * BALANCE_FACTOR *
				weapon_damage_from_tier(3.25), false, 6, 1500,
				mainColor, secondaryColor)
		}
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
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "yellow";
			}
			for (let i = 0; i < Math.random() * 7 + 7; i++)
				bullet_create(g, p.body.position.x, p.body.position.y, (
						0.95 + 0.1 * Math.random()) * v.tx - v.sx, (
						0.95 + 0.1 * Math.random()) * v.ty - v.sy, Math
					.random() * 10 + 10, (0.06 + 0.16 * Math.random()) *
					4.74 * BALANCE_FACTOR * weapon_damage_from_tier(2),
					false, 6, 1500, mainColor, secondaryColor);
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
		action: (g, p, v) => {
			let mainColor = "yellow";
			let secondaryColor = "orange";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "yellow";
			}
			bullet_create(g, p.body.position.x, p.body
				.position.y, (0.95 + 0.1 * Math.random()) * v.tx - v
				.sx, (
					0.95 + 0.1 * Math.random()) * v.ty - v.sy, Math
				.random() * 10 + 10, (0.1 + 0.1 * Math.random()) *
				5.15 *
				BALANCE_FACTOR * weapon_damage_from_tier(2),
				false, 6, 1500, mainColor, secondaryColor);
		}
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
					(15 + 15 * Math.random()) * 0.01 *
					BALANCE_FACTOR * 10 *
					weapon_damage_from_tier(10),
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
			.position.y, v.tx - v.sx, v.ty - v.sy, 17.5, (0.75 + 0.5 *
				Math.random()) * 4.15 * BALANCE_FACTOR * (1000 / 2500) *
			weapon_damage_from_tier(3.25),
			false, 12.5, 1500,
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
					10), null, (9 + 18 * Math.random()) * 0.2 *
				BALANCE_FACTOR * 7.5 * weapon_damage_from_tier(7), p
				.max_health,
				false, 20);
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
			let mainColor = "pink";
			let secondaryColor = "red";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "#ff0000";
				secondaryColor = "black";
			}
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			[-Math.PI / 4, Math.PI / 4].forEach(off => {
				bullet_create(g, p.body.position.x + p.w * Math
					.cos(theta + off), p.body.position.y + p
					.w * Math.sin(theta + off), v.tx - v.sx,
					v.ty - v.sy, 30, (0.4 + 0.8 * Math
						.random()) * 2.04 * BALANCE_FACTOR *
					weapon_damage_from_tier(5),
					false, 6, 1500, mainColor,
					secondaryColor);
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
					null, (3 + 6 * Math.random()) * 0.62 *
					BALANCE_FACTOR * 1.5 * weapon_damage_from_tier(7), p
					.max_health, false,
					20, 1500);
		}
	},
	[ITEM_RED_SHOTGUN]: {
		cooldown: 500,
		ammo: ITEM_RED_PLASMA,
		chance: 0.005,
		sound: "data/sfx/red_pistols_1.mp3",
		vol: 0.125,
		color: "#551111",
		length: 1.3,
		width: 1.25,
		action: (g, p, v) => {
			let mainColor = "pink";
			let secondaryColor = "red";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "#ff0000";
				secondaryColor = "black";
			}
			let theta = Math.atan2(v.ty - v.sy, v.tx - v.sx);
			let N = Math.floor(Math.random() * 7 + 5);
			for (let i = 0; i <= N; i++)
				bullet_create(g, p.body.position.x + 2 * p.w * Math.cos(
						theta - (0.5 * N - i) * Math.PI / N), p.body
					.position.y + 2 * p.w * Math.sin(theta - (0.5 * N -
						i) * Math.PI / N), v.tx - v.sx, v.ty - v.sy, 30,
					(2.5 + 0.5 * Math.random()) * 0.62 *
					BALANCE_FACTOR * (1000 / 400) *
					weapon_damage_from_tier(5),
					false, 6, 1500, mainColor, secondaryColor);
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
						let damage_dealt = 0.33 * dt * 0.2 *
							BALANCE_FACTOR * 20 *
							weapon_damage_from_tier(9);
						obj.data.health -= damage_dealt;
						obj.data.hit_by_player = true;
						let w = ITEM_LASER_GUN;
						if (!g.dps_history[w]) g.dps_history[
							w] = [];
						g.dps_history[w].push({
							dmg: damage_dealt,
							time: Date.now()
						});
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
			player_handle_melee(g, p, v, dt, 0.02, 10.0 * 1.04 *
				BALANCE_FACTOR * 2 * weapon_damage_from_tier(6),
				7.0, Math.PI / 8, 1500, 500);
		}
	},
	[ITEM_HORN]: {
		isMelee: true,
		color: "brown",
		isHorn: true,
		swordLength: 100,
		action: (g, p, v, dt) => {
			player_handle_melee(g, p, v, dt, 0.04, 80.0 *
				BALANCE_FACTOR * (1000 / 25000) *
				weapon_damage_from_tier(10), 60.0, Math.PI / 4,
				15000, 5000);
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
			let mainColor = "lime";
			let secondaryColor = "green";
			let tile = g.assigned_tiles[g.visited_levels.indexOf(p
				.want_level)];
			if (Math.floor(tile / 200) === 1) {
				mainColor = "black";
				secondaryColor = "lime";
			}
			bullet_create(g, p.body.position.x, p.body.position.y, (
					0.975 + 0.05 * Math.random()) * v.tx - v.sx, (
					0.975 + 0.05 * Math.random()) * v.ty - v.sy,
				Math.random() * 10 + 20, (1.5 + 0.375 * Math
					.random()) * 1.04 * BALANCE_FACTOR *
				weapon_damage_from_tier(6),
				false, 6, 1500, mainColor, secondaryColor);
			if (p.shield_green_health > 0) {
				p.shield_green_health -= 0.05 * dt;
			}
			else if (p.shield_rainbow_health <= 0) {
				p.health -= 0.0255 * dt;
				p.hunger -= 0.0125 * dt;
				p.thirst -= 0.0125 * dt;
			}
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
				chance = 0.01,
				dmgBase = 0.2;
			if (ammoType === ITEM_RAINBOW_AMMO) {
				c1 = colors[Math.floor(p.gradient) % 7];
				c2 = "white";
				sfx = "red_pistols_1";
				chance = 0.001;
				dmgBase = 2.0 * 0.2 * BALANCE_FACTOR *
					weapon_damage_from_tier(9);
			}
			else if (ammoType === ITEM_RED_PLASMA) {
				c1 = "red";
				c2 = "pink";
				sfx = "red_pistols_1";
				dmgBase = 1.75 * 0.2 * BALANCE_FACTOR *
					weapon_damage_from_tier(9);
			}
			else if (ammoType === ITEM_PLASMA) {
				c1 = "cyan";
				c2 = "blue";
				sfx = "red_pistols_1";
				dmgBase = 1.5 * 0.2 * BALANCE_FACTOR *
					weapon_damage_from_tier(9);
			}
			if (ammoType !== ITEM_ROCKET || ammoType ===
				ITEM_RAINBOW_AMMO) {
				[-Math.PI / 4, Math.PI / 4].forEach(off => {
					bullet_create(g, p.body.position.x + p.w *
						Math.cos(theta + off), p.body
						.position.y + p.w * Math.sin(theta +
							off), v.tx - v.sx, v.ty - v.sy,
						30, dmgBase * (1.6 + 3.2 * Math
							.random()), false, 6, 1500, c1,
						c2);
				});
				audio_play("data/sfx/" + sfx + ".mp3", 0.25);
			}
			else {
				[-Math.PI / 4, Math.PI / 4].forEach(off => {
					rocket_create(g, p.body.position.x + Math
						.cos(theta + off) * p.w * 1.75, p
						.body.position.y + Math.sin(theta +
							off) * p.h * 1.75, v.tx - v.sx,
						v.ty - v.sy, 0.15 * p.w, null, (
							0.8 + 1.6 * Math.random()) *
						0.2 * BALANCE_FACTOR *
						weapon_damage_from_tier(9), p
						.max_health,
						false, 20);
				});
				audio_play("data/sfx/rocketlauncher_1.mp3", 0.125);
			}
			if (Math.random() < chance) inventory_clear_item(p
				.inventory_element, ammoType, 1);
			return true;
		}
	},
	default: {
		cooldown: 200,
		ammo: ITEM_AMMO,
		chance: 0.01,
		sound: "data/sfx/gunshot_1.mp3",
		vol: 0.25,
		color: "black",
		length: 0.8,
		width: 1.0,
		action: (g, p, v) => bullet_create(g, p.body.position.x, p.body
			.position.y, v.tx - v.sx, v.ty - v.sy, 20, 0.25 *
			BALANCE_FACTOR)
	},
};
let DEBUG_ENEMY = false;
let ENEMY_DAMAGE_COEFFICIENT = 1.0;
let ENEMY_HEALTH_COEFFICIENT = 1.0;
const _ENEMY_VARS = {
	tx: 0,
	ty: 0,
	v: 0,
	dx: 0,
	dy: 0,
	ndx: 0,
	ndy: 0
};
const _ENEMY_VEC = {
	x: 0,
	y: 0
};
const _ENEMY_DROP_DATA = {
	N: 1
};
const MAX_FIRE_PARTICLES = 100;
const _FIRE_POOL = Array.from({
	length: MAX_FIRE_PARTICLES
}, () => ({
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	life: 0,
	maxLife: 0,
	size: 0
}));
let _fire_idx = 0;

function enemy_create(g, x, y, make_boss = false, make_minion = false, type =
	"random", tile = LEVEL_TILE_VOID) {
	if (type === "random") {
		let currentTileTheme = undefined;
		if (tile >= THEME_BLOOD_FOREST) {
			currentTileTheme = THEME_BLOOD_FOREST;
		}
		else if (tile >= THEME_TAIGA) {
			currentTileTheme = THEME_TAIGA;
		}
		else if (tile >= THEME_DESERT) {
			currentTileTheme = THEME_DESERT;
		}
		const availableKeys = [];
		const allEnemyKeys = Object.keys(ENEMY_TYPES);
		for (let i = 0; i < allEnemyKeys.length; i++) {
			const k = allEnemyKeys[i];
			const isUnlocked = (k === "regular") || g.available_enemies
				.includes(k);
			const isCorrectTheme = (ENEMY_TYPES[k].theme === currentTileTheme);
			if (isUnlocked && isCorrectTheme) {
				availableKeys.push(k);
			}
		}
		if (availableKeys.length === 0) {
			type = "regular";
		}
		else {
			let totalWeight = 0;
			for (let i = 0; i < availableKeys.length; i++) {
				totalWeight += (ENEMY_TYPES[availableKeys[i]].weight || 0);
			}
			let randomNum = Math.random() * totalWeight;
			for (let i = 0; i < availableKeys.length; i++) {
				const key = availableKeys[i];
				const weight = ENEMY_TYPES[key].weight || 0;
				if (randomNum < weight || i === availableKeys.length - 1) {
					type = key;
					break;
				}
				randomNum -= weight;
			}
		}
	}
	const config = ENEMY_TYPES[type] || ENEMY_TYPES["regular"];
	let width = config.w * 1.65;
	let height = config.h * 1.65;
	let boss = make_boss || g.all_enemies_are_bosses;
	let player_object = game_object_find_closest(g, x, y, "player", 4000);
	if (player_object) {
		let m = 0.33 * (
			player_object.data.health / player_object.data.max_health +
			player_object.data.thirst / player_object.data.max_thirst +
			player_object.data.hunger / player_object.data.max_hunger
		);
		let checkType = (type == "random") ? "regular" : type;
		if (g.kills_for_boss > 0 || (g.enemy_kills[checkType] || 0) < 16)
			m *= 0;
		let bd = enemy_boss_distance_to_player(g, x, y);
		if (-1 < bd && bd < 15000) {
			m *= 0.01;
		}
		if (Math.random() > 1 - 0.003125 * m) {
			boss = true;
		}
	}
	if (make_minion) boss = false;
	if (boss || config.is_snake) {
		width = width * 2.67;
		height = height * 2.67;
	}
	if (make_minion && !config.is_snake) {
		width = width * 0.67;
		height = height * 0.67;
	}
	let max_health_random = config.health;
	let e = {
		health: max_health_random * ENEMY_HEALTH_COEFFICIENT,
		max_health: max_health_random * ENEMY_HEALTH_COEFFICIENT,
		hunger: 300,
		max_hunger: 300,
		damage: config.damage * ENEMY_DAMAGE_COEFFICIENT,
		speed: config.speed,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x, y, width, height),
		hit_by_player: false,
		boss: false,
		follow_range: 1000,
		spawn_minion_delay: 4000,
		color: config.color,
		color_outline: config.outline,
		type: (type == "random") ? "regular" : type,
		shooting_delay: config.delay,
		shooting_range: config.range,
		is_minion: false,
		jump_delay: 4000,
		sword_rotation: 0,
		color_gradient: 0,
		laser_angle: 0,
		hunt_delay: 1000,
		hunt_delay_max: 1000,
		poisoned_time: 0,
		burning_time: 0,
		frozen_time: 0,
		electrified_time: 0,
		dot_timers: {
			poison: 0,
			burn: 0,
			electric: 0,
			freeze: 0
		},
		dot_accumulators: {
			poison: 0,
			burn: 0,
			electric: 0,
			freeze: 0
		},
		is_snake: config.is_snake,
		chain_segments: [],
		whip_timer: 0,
		whip_angle: 0
	};
	if (config.use_rainbow_color_gradient) {
		e.color_gradient = Math.random() * 2 * Math.PI / 0.03;
		let r = Math.pow(Math.cos(0.02 * e.color_gradient) * 15, 2);
		let gr = Math.pow(0.7 * (Math.cos(0.02 * e.color_gradient) + Math.sin(
			0.02 * e.color_gradient)) * 15, 2);
		let bl = Math.pow(Math.sin(0.02 * e.color_gradient) * 15, 2);
		e.color = "#" + Math.floor(r).toString(16).padStart(2, '0') + Math
			.floor(gr).toString(16).padStart(2, '0') + Math.floor(bl).toString(
				16).padStart(2, '0');
	}
	if (config.mask) {
		e.body.collisionFilter.mask = config.mask;
	}
	if (boss) {
		e.damage = 3.05 * e.damage;
		e.health = (25 * e.max_health);
		e.max_health = (25 * e.max_health);
		e.hunger = (1.75 * e.max_hunger);
		e.max_hunger = (1.75 * e.max_hunger);
		e.speed = 0.5 * e.speed;
		if (config.boss_shooting_range_mult !== undefined)
			e.shooting_range *= config.boss_shooting_range_mult;
		if (config.boss_speed_mult !== undefined)
			e.speed *= config.boss_speed_mult;
		if (config.boss_max_health_mult !== undefined) {
			e.health = config.boss_max_health_mult * e.max_health;
			e.max_health = config.boss_max_health_mult * e.max_health;
		}
		e.boss = true;
		e.follow_range = 10 * e.follow_range;
		e.shooting_range = 1.25 * e.shooting_range;
	}
	if (make_minion) {
		e.damage = 0.5 * e.damage;
		e.health = (0.5 * e.max_health);
		e.max_health = (0.5 * e.max_health);
		e.hunger = (0.05 * e.max_hunger);
		e.max_hunger = (0.05 * e.max_hunger);
		if (config.is_snake) {
			e.hunger = 1.75 * e.max_hunger;
			e.max_hunger = 1.75 * e.max_hunger;
		}
		e.speed = 1.25 * e.speed;
		if (config.minion_speed_mult !== undefined) {
			e.speed *= config.minion_speed_mult;
		}
		if (config.minion_max_health_mult !== undefined) {
			e.health *= config.minion_max_health_mult;
			e.max_health *= config.minion_max_health_mult;
		}
		e.boss = false;
		e.follow_range = 1.75 * e.follow_range;
		e.shooting_range = 2.25 * e.shooting_range;
		e.is_minion = true;
	}
	Matter.Composite.add(g.engine.world, e.body);
	e.health = game_round(e.health);
	e.max_health = game_round(e.max_health);
	e.hunger = game_round(e.hunger);
	e.max_hunger = game_round(e.max_hunger);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw,
		enemy_destroy);
}

function enemy_destroy(enemy_object, death = true) {
	if (enemy_object.destroyed)
		return;
	let g = enemy_object.game;
	let e = enemy_object.data;
	if (e.hit_by_player && e.hunger > 0 && death) {
		if (g.enemy_kills[e.type] === undefined)
			g.enemy_kills[e.type] = 0;
		g.enemy_kills[e.type] += 1;
		if (DEBUG_ENEMY)
			g.debug_console.unshift("killed " + e.type + ": " + g.enemy_kills[e
				.type]);
		if (e.boss) {
			g.boss_kills += 1;
			for (let nextType in ENEMY_TYPES) {
				if (ENEMY_TYPES[nextType].requires === e.type) {
					if (!g.available_enemies.includes(nextType)) {
						g.kills_for_boss = Math.max(16, g.kills_for_boss);
					}
					g.available_enemies.push(nextType);
				}
			}
		}
		else {
			g.kills += 1;
			g.kills_for_boss -= 1;
		}
	}
	if (e.boss && e.hit_by_player && e.hunger <= 0 && death) {
		g.kills_for_boss = Math.max(32, g.kills_for_boss);
	}
	Matter.Composite.remove(g.engine.world, e.body);
	e.body = null;
	enemy_object.destroyed = true;
}

function enemy_get_target_object(enemy_object, dt) {
	let e = enemy_object.data;
	let target_object = game_object_find_closest(enemy_object.game, e.body
		.position.x, e.body.position.y, "player", e.follow_range);
	if (target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body
			.position.x, e.body.position.y, "car", e.follow_range);
	if (target_object != null && target_object.data.car_object) {
		target_object = target_object.data.car_object;
	}
	if (dt > -1) {
		if (target_object)
			e.hunt_delay -= dt;
		else
			e.hunt_delay = e.hunt_delay_max;
	}
	return (e.hunt_delay > 0) ? null : target_object;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	let g = enemy_object.game;
	let typeData = ENEMY_TYPES[e.type] || ENEMY_TYPES["regular"];
	if (e.hunger > 0) e.hunger = Math.max(0, e.hunger - 0.001 * dt);
	if (e.hunger <= 0) {
		e.health *= Math.pow(0.5, dt / 1000);
		e.health -= 0.01 * e.max_health * dt / 1000;
	}
	const show_dot_damage = (type, damage, color) => {
		e.dot_accumulators[type] += damage;
		e.dot_timers[type] += dt;
		if (e.dot_timers[type] >= 500) {
			if (g.settings.indicators["show damage numbers"]) {
				damage_text_create(g, e.body.position.x, e.body.position.y -
					e.h * 0.5, Math.ceil(e.dot_accumulators[type]),
					color);
			}
			e.dot_timers[type] = 0;
			e.dot_accumulators[type] = 0;
		}
	};
	if (e.poisoned_time > 0) {
		let dmg = 2 * dt;
		e.health -= dmg;
		e.poisoned_time -= dt;
		show_dot_damage("poison", dmg, "#22ff00");
	}
	if (e.burning_time > 0) {
		let dmg = 0.5 * dt;
		e.health -= dmg;
		e.burning_time -= dt;
		show_dot_damage("burn", dmg, "#ffaa00");
	}
	if (e.electrified_time > 0) {
		let dmg = 0.8 * dt;
		e.health -= dmg;
		e.electrified_time -= dt;
		show_dot_damage("electric", dmg, "#00ffff");
	}
	let current_speed = e.speed;
	if (e.frozen_time > 0) {
		let dmg = 0.25 * dt;
		e.health -= dmg;
		current_speed *= 0.15;
		e.frozen_time -= dt;
		show_dot_damage("freeze", dmg, "#64dcff");
	}
	if (e.shooting_delay < 5000) e.shooting_delay += dt;
	if (e.jump_delay < 4000) e.jump_delay += Math.random() * dt;
	e.sword_rotation += 0.01 * dt;
	e.color_gradient += 0.01 * dt;
	if (typeData.visuals && typeData.visuals.draw_chain) {
		e.whip_timer += dt;
		const numWhips = e.boss ? 3 : 1;
		const numSegments = 12;
		const segmentLen = e.w * 0.45;
		if (e.chain_segments.length === 0) {
			for (let w = 0; w < numWhips; w++) {
				let whip = [];
				for (let i = 0; i < numSegments; i++) {
					whip.push({
						x: e.body.position.x,
						y: e.body.position.y
					});
				}
				e.chain_segments.push(whip);
			}
		}
		let target = enemy_get_target_object(enemy_object, -1);
		let strikeCycle = 1500;
		let strikeProgress = (e.whip_timer % strikeCycle) / strikeCycle;
		for (let w = 0; w < numWhips; w++) {
			let whip = e.chain_segments[w];
			whip[0].x = e.body.position.x;
			whip[0].y = e.body.position.y;
			if (target) {
				let dx = target.data.body.position.x - e.body.position.x;
				let dy = target.data.body.position.y - e.body.position.y;
				let baseAngle = Math.atan2(dy, dx);
				let angleOffset = 0;
				if (e.boss) {
					if (w === 1) angleOffset = Math.PI / 4;
					if (w === 2) angleOffset = -Math.PI / 4;
				}
				let targetAngle = baseAngle + angleOffset;
				for (let i = 1; i < numSegments; i++) {
					let p = i / numSegments;
					let wave = Math.sin(strikeProgress * Math.PI * 2 + w) * (1 -
						p) * (e.w * 2);
					let bend = Math.sin(p * Math.PI) * wave;
					let currentAngle = targetAngle + (bend / (e.w * 0.5));
					let targetX = whip[i - 1].x + Math.cos(currentAngle) *
						segmentLen;
					let targetY = whip[i - 1].y + Math.sin(currentAngle) *
						segmentLen;
					whip[i].x += (targetX - whip[i].x) * 0.4;
					whip[i].y += (targetY - whip[i].y) * 0.4;
					if (target.name === "player") {
						let t = target.data;
						if (t.immunity <= 0) {
							let px = t.body.position.x;
							let py = t.body.position.y;
							let x1 = whip[i - 1].x,
								y1 = whip[i - 1].y;
							let x2 = whip[i].x,
								y2 = whip[i].y;
							let l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1,
								2);
							let distToLine = 0;
							if (l2 === 0) {
								distToLine = Math.sqrt(Math.pow(px - x1, 2) +
									Math.pow(py - y1, 2));
							}
							else {
								let t_param = Math.max(0, Math.min(1, ((px -
									x1) * (x2 - x1) + (py -
									y1) * (
									y2 - y1)) / l2));
								distToLine = Math.sqrt(Math.pow(px - (x1 +
									t_param * (x2 - x1)), 2) + Math.pow(
									py - (y1 + t_param * (y2 - y1)), 2));
							}
							if (distToLine < (t.w * 0.6)) {
								let rate = e.boss ? 0.88 : 0.65;
								if (t.shield_blue_health > 0) t
									.shield_blue_health -= 0.8 * e.damage * dt;
								else if (t.shield_green_health > 0) t
									.shield_green_health -= 0.4 * e.damage * dt;
								else if (t.shield_shadow_health > 0) t
									.shield_shadow_health -= 0.2 * e.damage *
									dt;
								else if (t.shield_rainbow_health > 0) t
									.shield_rainbow_health -= 0.1 * e.damage *
									dt;
								else if (t.shield_anubis_health > 0) t
									.shield_anubis_health -= 0.05 * e.damage *
									dt;
								else t.health -= 1.6 * e.damage * dt;
							}
						}
					}
				}
			}
			else {
				for (let i = 1; i < numSegments; i++) {
					let targetX = whip[i - 1].x + (e.boss ? (w - 1) * e.w *
						0.3 : 0);
					let targetY = whip[i - 1].y + segmentLen * 0.5;
					whip[i].x += (targetX - whip[i].x) * 0.2;
					whip[i].y += (targetY - whip[i].y) * 0.2;
				}
			}
		}
	}
	if (typeData.behaviour_no_target)
		typeData.behaviour_no_target(enemy_object, dt);
	let target_object = enemy_get_target_object(enemy_object, dt);
	if (target_object != null) {
		let vrs = _ENEMY_VARS;
		vrs.tx = target_object.data.body.position.x - e.body.position.x;
		vrs.ty = target_object.data.body.position.y - e.body.position.y;
		vrs.v = Math.sqrt(vrs.tx * vrs.tx + vrs.ty * vrs.ty) || 0.001;
		vrs.dx = current_speed * vrs.tx / vrs.v;
		vrs.dy = current_speed * vrs.ty / vrs.v;
		vrs.ndx = vrs.tx / vrs.v;
		vrs.ndy = vrs.ty / vrs.v;
		if (typeData.behaviour) typeData.behaviour(enemy_object, dt,
			target_object, vrs);
		if (e.boss && typeData.boss_behaviour) typeData.boss_behaviour(
			enemy_object, dt, target_object, vrs);
		if (e.is_minion && typeData.minion_behaviour) typeData.minion_behaviour(
			enemy_object, dt, target_object, vrs);
		if (vrs.dx * vrs.dx + vrs.dy * vrs.dy > 0) {
			_ENEMY_VEC.x = vrs.dx;
			_ENEMY_VEC.y = vrs.dy;
			Matter.Body.setVelocity(e.body, _ENEMY_VEC);
		}
		if (e.boss && e.spawn_minion_delay >= 4000) {
			let max_minions = typeData.max_minions === 0 ? 0 : (typeData
				.max_minions || 10);
			if (enemy_count_minions(enemy_object) < max_minions) {
				let spawnCount = Math.floor(Math.random() * 4) + 1;
				for (let i = 0; i < spawnCount; i++) {
					let theta = 2 * Math.PI * Math.random();
					let sx, sy;
					if (typeData.minion_dist_mult) {
						let dist = typeData.minion_dist_mult * e.w;
						sx = target_object.data.body.position.x + dist * Math
							.cos(theta);
						sy = target_object.data.body.position.y + dist * Math
							.sin(theta);
					}
					else {
						sx = e.body.position.x + 200 * Math.cos(theta);
						sy = e.body.position.y + 200 * Math.sin(theta);
					}
					enemy_create(enemy_object.game, sx, sy, false, true, e
						.type);
				}
			}
			e.spawn_minion_delay = 0;
		}
		e.spawn_minion_delay += Math.random() * dt;
	}
	if (e.health <= 0) {
		if (e.hit_by_player) {
			if (target_object?.name == "player") achievement_do(target_object
				.data.achievements_element.data.achievements,
				"shoot 'em up", target_object.data
				.achievements_shower_element);
			if (typeData.on_death) typeData.on_death(enemy_object,
				target_object);
			if (typeData.bossifier_item) {
				let kills = enemy_object.game.enemy_kills[e.type] || 0;
				if (!e.boss && !e.is_minion && Math.random() < 0.25 * Math.tanh(
						0.015 * kills))
					item_create(enemy_object.game, typeData.bossifier_item, e
						.body.position.x, e.body.position.y);
			}
			let drp = _ENEMY_DROP_DATA;
			drp.N = 1;
			if (e.boss) {
				if (e.hunger > 0) {
					drp.N = 20 * Math.random() + 10;
					if (typeData.on_boss_death) typeData.on_boss_death(
						enemy_object, target_object, drp);
				}
				else drp.N = 5 * Math.random();
			}
			else if (Math.random() < 0.25) drp.N = 2;
			let sound = e.boss ? "data/sfx/zombie_boss_dies_1.mp3" :
				"data/sfx/zombie_dies_1.mp3";
			let p_close = game_object_find_closest(enemy_object.game, e.body
				.position.x, e.body.position.y, "player", 10000);
			if (p_close && !p_close.data.ai_controlled) audio_play(sound);
			for (let i = 0; i < drp.N; i++) {
				let theta = 2 * Math.PI * Math.random();
				if (((Math.random() < 0.5 && !e.boss) || (Math.random() <
						0.75 && e.boss)) && DROP_ITEMS)
					item_spawn(enemy_object.game, e.body.position.x + 50 * Math
						.cos(theta), e.body.position.y + 50 * Math.sin(theta), e
						.type);
			}
		}
		enemy_destroy(enemy_object);
	}
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	if (e.health <= 0) return;
	const typeData = ENEMY_TYPES[e.type] || ENEMY_TYPES["regular"];
	const vis = typeData.visuals || {};
	let now = Date.now();
	let t = now * 0.008;
	let speed = Math.sqrt(e.body.velocity.x * e.body.velocity.x + e.body
		.velocity.y * e.body.velocity.y);
	let bob = (speed > 0.5) ? Math.abs(Math.cos(t)) * (e.h * 0.08) : Math.sin(
		now * 0.002) * (e.h * 0.03);
	let walk = (speed > 0.5) ? Math.sin(t) * (e.h * 0.15) : 0;
	let target_object = enemy_get_target_object(enemy_object, -1);
	let angle = 0,
		gx = 0,
		gy = 0,
		g = 0.001;
	if (target_object) {
		gx = target_object.data.body.position.x - e.body.position.x;
		gy = target_object.data.body.position.y - e.body.position.y;
		g = Math.sqrt(gx * gx + gy * gy) || 0.001;
		angle = Math.atan2(gy, gx);
	}
	else if (speed > 0.1) {
		angle = Math.atan2(e.body.velocity.y, e.body.velocity.x);
	}
	ctx.save();
	ctx.translate(0, bob);
	if (vis.custom_draw && !vis.custom_draw_above) {
		vis.custom_draw(e, ctx);
	}
	if (vis.glowColor) {
		ctx.shadowBlur = vis.glowBlur || 15;
		ctx.shadowColor = vis.glowColor;
	}
	if (!typeData.only_draw_custom) {
		ctx.fillStyle = "rgba(0,0,0,0.4)";
		ctx.beginPath();
		ctx.roundRect(e.body.position.x - e.w * 0.25, e.body.position.y + e.h *
			0.25 + walk - bob, e.w * 0.18, e.h * 0.35, e.w * 0.05);
		ctx.roundRect(e.body.position.x + e.w * 0.07, e.body.position.y + e.h *
			0.25 - walk - bob, e.w * 0.18, e.h * 0.35, e.w * 0.05);
		ctx.fill();
		let outlineW = vis.outline_is_relative ? vis.outline_width * e.w : (vis
			.outline_width || 1);
		ctx.fillStyle = e.color;
		ctx.strokeStyle = e.color_outline || "white";
		ctx.lineWidth = outlineW;
		ctx.beginPath();
		ctx.roundRect(e.body.position.x - e.w * 0.35, e.body.position.y - e.h *
			0.3, e.w * 0.7, e.h * 0.7, e.w * 0.1);
		ctx.fill();
		ctx.stroke();
		ctx.save();
		ctx.translate(e.body.position.x, e.body.position.y - e.h * 0.5);
		ctx.fillStyle = e.color;
		ctx.beginPath();
		ctx.roundRect(-e.w * 0.25, -e.h * 0.25, e.w * 0.5, e.h * 0.4, e.w *
			0.1);
		ctx.fill();
		ctx.stroke();
		let ec = typeData.eye_color || "red";
		ctx.fillStyle = ec;
		ctx.shadowBlur = e.boss ? 15 : 8;
		ctx.shadowColor = ec;
		let lookX = Math.cos(angle) * (e.w * 0.05);
		let lookY = Math.sin(angle) * (e.h * 0.02);
		ctx.beginPath();
		ctx.arc(-e.w * 0.1 + lookX, -e.h * 0.05 + lookY, e.w * 0.04, 0, 6.28);
		ctx.arc(e.w * 0.1 + lookX, -e.h * 0.05 + lookY, e.w * 0.04, 0, 6.28);
		ctx.fill();
		ctx.restore();
	}
	ctx.restore();
	for (let i = 0; i < MAX_FIRE_PARTICLES; i++) {
		let p = _FIRE_POOL[i];
		if (p.life <= 0) continue;
		p.life -= 0.025;
		p.x += p.vx;
		p.y += p.vy;
		if (p.life > 0) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			let alpha = p.life;
			let s = p.size * (0.4 + p.life * 0.6);
			let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s);
			if (p.life > 0.5) {
				grad.addColorStop(0, `rgba(255, 180, 0, ${alpha})`);
				grad.addColorStop(0.5, `rgba(255, 60, 0, ${alpha * 0.8})`);
				grad.addColorStop(1, `rgba(150, 0, 0, 0)`);
			}
			else {
				grad.addColorStop(0, `rgba(200, 40, 0, ${alpha})`);
				grad.addColorStop(1, `rgba(50, 0, 0, 0)`);
			}
			ctx.fillStyle = grad;
			ctx.beginPath();
			ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}
	if (e.burning_time > 0) {
		if (Math.random() < 0.8) {
			let p = _FIRE_POOL[_fire_idx];
			p.life = 1.0;
			p.maxLife = 0.4 + Math.random() * 0.4;
			p.x = e.body.position.x + (Math.random() - 0.5) * e.w * 0.8;
			p.y = e.body.position.y + (Math.random() - 0.5) * e.h * 0.5;
			p.vx = (Math.random() - 0.5) * 1.2;
			p.vy = -Math.random() * 2 - 1;
			p.size = e.w * (0.15 + Math.random() * 0.15);
			_fire_idx = (_fire_idx + 1) % MAX_FIRE_PARTICLES;
		}
	}
	if (e.electrified_time > 0) {
		ctx.save();
		ctx.strokeStyle = "#44ffff";
		ctx.lineWidth = 2;
		ctx.shadowBlur = 10;
		ctx.shadowColor = "#00ffff";
		ctx.globalCompositeOperation = "lighter";
		for (let j = 0; j < 3; j++) {
			if (Math.random() > 0.7) {
				let x = e.body.position.x + (Math.random() - 0.5) * e.w * 1.2;
				let y = e.body.position.y + (Math.random() - 0.5) * e.h * 1.2;
				ctx.beginPath();
				ctx.moveTo(x, y);
				for (let k = 0; k < 4; k++) {
					x += (Math.random() - 0.5) * e.w * 0.4;
					y += (Math.random() - 0.5) * e.h * 0.4;
					ctx.lineTo(x, y);
				}
				ctx.stroke();
			}
		}
		ctx.restore();
	}
	if (e.frozen_time > 0) {
		ctx.save();
		ctx.fillStyle = "rgba(100, 220, 255, 0.35)";
		ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
		ctx.lineWidth = 3;
		ctx.lineJoin = "round";
		let pulse = 1;
		ctx.beginPath();
		ctx.roundRect(e.body.position.x - e.w * 0.45 * pulse, e.body.position
			.y - e.h * 0.65 * pulse, e.w * 0.9 * pulse, e.h * 1.15 * pulse,
			e.w * 0.15);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	if (e.poisoned_time > 0) {
		ctx.save();
		ctx.globalAlpha = 0.6;
		for (let i = 0; i < 6; i++) {
			let time = now * 0.002 + i * 1.2;
			let px = e.body.position.x + Math.sin(time) * e.w * 0.45;
			let py = e.body.position.y + Math.cos(time * 0.8) * e.h * 0.3;
			let bubbleSize = e.w * 0.1 * (1 + Math.sin(time * 3) * 0.5);
			ctx.fillStyle = "#22ff00";
			ctx.beginPath();
			ctx.arc(px, py, bubbleSize, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "#116600";
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.restore();
	}
	if (target_object != null) {
		let bCY = e.body.position.y + bob;
		let hOff = e.w * 0.35;
		if ((vis.draw_gun && !e.boss || vis.draw_gun_boss && e.boss) && g <
			1.25 * e.shooting_range) {
			ctx.strokeStyle = vis.gun_color || "#331133";
			ctx.lineWidth = (vis.gun_width || 0.25) * e.w;
			let useCenter = e.boss ? (vis.center_gun_boss ?? vis.center_gun) : (
				e.is_minion ? (vis.center_gun_minion ?? vis.center_gun) :
				vis.center_gun);
			let useDouble = e.boss ? (vis.double_gun_boss ?? vis.double_gun) : (
				e.is_minion ? (vis.double_gun_minion ?? vis.double_gun) :
				vis.double_gun);
			for (let i = 0; i < (useDouble ? 2 : 1); i++) {
				let px = useCenter ? e.body.position.x : (i === 0 ? e.body
					.position.x - hOff : e.body.position.x + hOff);
				ctx.save();
				ctx.strokeStyle = e.color;
				ctx.lineWidth = e.w * 0.12;
				ctx.lineCap = "round";
				ctx.beginPath();
				ctx.moveTo(px, bCY);
				let hX = px + (e.w * 0.15) * gx / g;
				let hY = bCY + (e.w * 0.15) * gy / g;
				ctx.lineTo(hX, hY);
				ctx.stroke();
				ctx.restore();
				ctx.beginPath();
				ctx.moveTo(hX, hY);
				let gunLen = (e.type.includes("rocket") || e.type.includes(
					"laser") ? e.h * 0.8 : e.w * 0.6);
				let tX = hX + gunLen * gx / g;
				let tY = hY + gunLen * gy / g;
				ctx.lineTo(tX, tY);
				ctx.stroke();
				if (vis.laser_beam && e.boss && e.shooting_delay < -4500) {
					ctx.save();
					ctx.beginPath();
					ctx.strokeStyle = e.color;
					ctx.lineWidth = 0.15 * e.w;
					ctx.moveTo(tX, tY);
					ctx.lineTo(px + 4 * gx, bCY + 4 * gy);
					ctx.stroke();
					ctx.beginPath();
					ctx.strokeStyle = "white";
					ctx.lineWidth = 0.1 * e.w;
					ctx.moveTo(tX, tY);
					ctx.lineTo(px + 4 * gx, bCY + 4 * gy);
					ctx.stroke();
					ctx.restore();
				}
			}
		}
		if (vis.draw_sword && g < 0.33 * e.shooting_range && !e.is_minion) {
			ctx.save();
			ctx.strokeStyle = vis.sword_color || "#55aa11";
			ctx.lineWidth = 0.25 * e.w;
			let sx = e.body.position.x - hOff;
			ctx.beginPath();
			ctx.moveTo(sx, bCY);
			ctx.lineTo(sx + Math.cos(e.sword_rotation) * 1.5 * e.w, bCY + Math
				.sin(e.sword_rotation) * 1.5 * e.w);
			ctx.stroke();
			ctx.restore();
		}
	}
	if (vis.custom_draw && vis.custom_draw_above) {
		ctx.save();
		ctx.translate(0, bob);
		vis.custom_draw(e, ctx);
		ctx.restore();
	}
	if (vis.draw_chain && e.chain_segments.length > 0) {
		ctx.save();
		const chainCol = vis.chain_color || "#444";
		const strikeProgress = (e.whip_timer % 1500) / 1500;
		for (let w = 0; w < e.chain_segments.length; w++) {
			let whip = e.chain_segments[w];
			for (let i = 0; i < whip.length; i++) {
				let s = whip[i];
				let next = whip[i + 1];
				let p = i / whip.length;
				ctx.save();
				ctx.translate(s.x, s.y);
				if (next) {
					ctx.rotate(Math.atan2(next.y - s.y, next.x - s.x));
				}
				else if (whip[i - 1]) {
					ctx.rotate(Math.atan2(s.y - whip[i - 1].y, s.x - whip[i - 1]
						.x));
				}
				if (i === whip.length - 1) {
					ctx.fillStyle = "#900";
					ctx.strokeStyle = "black";
					ctx.lineWidth = e.w * 0.02;
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(-e.w * 0.25, -e.w * 0.15);
					ctx.quadraticCurveTo(e.w * 0.15, 0, -e.w * 0.25, e.w *
						0.15);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(0, 0, e.w * 0.08, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
				}
				else {
					let linkW = e.w * (0.18 * (1 - p * 0.5));
					let linkH = e.w * (0.1 * (1 - p * 0.5));
					ctx.fillStyle = chainCol;
					ctx.strokeStyle = "black";
					ctx.lineWidth = e.w * 0.015;
					if (strikeProgress > 0.45 && strikeProgress < 0.55) {
						ctx.shadowBlur = 10;
						ctx.shadowColor = "red";
					}
					ctx.beginPath();
					ctx.roundRect(-linkW * 0.5, -linkH * 0.5, linkW, linkH,
						linkH * 0.4);
					ctx.fill();
					ctx.stroke();
					ctx.fillStyle = "rgba(255,255,255,0.15)";
					ctx.fillRect(-linkW * 0.3, -linkH * 0.3, linkW * 0.2,
						linkH * 0.2);
				}
				ctx.restore();
			}
		}
		ctx.restore();
	}
	const fontSize = e.w * 0.33;
	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = `bold ${fontSize}px Arial`;
	ctx.lineWidth = fontSize * 0.15;
	ctx.strokeStyle = "black";
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	if (enemy_object.game.settings.indicators["show enemy health"]) {
		const hPerc = Math.max(0, e.health / e.max_health);
		const yHealth = e.body.position.y - e.h * 1.25;
		const r = Math.floor(255 * (1 - hPerc));
		const g = Math.floor(255 * hPerc);
		const text =
			`${Math.ceil(e.health).toLocaleString()} / ${Math.ceil(e.max_health).toLocaleString()}`;
		ctx.strokeText(text, e.body.position.x, yHealth);
		ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
		ctx.fillText(text, e.body.position.x, yHealth);
	}
	if (enemy_object.game.settings.indicators["show enemy hunger"]) {
		const fPerc = Math.max(0, e.hunger / e.max_hunger);
		const offset = enemy_object.game.settings.indicators[
			"show enemy health"] ? 0.90 : 1.15;
		const yHunger = e.body.position.y - e.h * offset;
		const r = 255;
		const g = Math.floor(165 * fPerc);
		const text = `${Math.ceil(e.hunger)}/${Math.ceil(e.max_hunger)}`;
		ctx.strokeText(text, e.body.position.x, yHunger);
		ctx.fillStyle = `rgb(${r}, ${g}, 0)`;
		ctx.fillText(text, e.body.position.x, yHunger);
	}
	ctx.restore();
}

function enemy_boss_exists(g) {
	for (let i = 0; i < g.objects.length; i++) {
		if (g.objects[i].name === "enemy" && g.objects[i].data.boss)
			return true;
	}
	return false;
}

function enemy_boss_distance_to_player(g, x, y) {
	let player = game_object_find_closest(g, x, y, "player", 20000);
	if (!player) return -1;
	let enemies = g.collections["enemy"] || [];
	let minDist = -1;
	for (let i = 0; i < enemies.length; i++) {
		let obj = enemies[i];
		if (!obj.destroyed && obj.data.boss) {
			let d = dist(obj.data.body.position, player.data.body.position);
			if (minDist === -1 || d < minDist) minDist = d;
		}
	}
	return minDist;
}

function enemy_count_minions(enemy_object) {
	let enemies = enemy_object.game.collections["enemy"] || [];
	let count = 0;
	for (let i = 0; i < enemies.length; i++) {
		if (enemies[i].data.type === enemy_object.data.type && enemies[i].data
			.is_minion) {
			count++;
		}
	}
	return count;
}
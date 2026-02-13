let DEBUG_ENEMY = false;
let ENEMY_DAMAGE_COEFFICIENT = 1.0;
let ENEMY_HEALTH_COEFFICIENT = 1.0;

function enemy_create(g, x, y, make_boss = false, make_minion = false, type =
	"random", tile = LEVEL_TILE_VOID) {
	if (type === "random") {
		let currentTileTheme = undefined;
		if (tile >= THEME_TAIGA) {
			currentTileTheme = THEME_TAIGA;
		}
		else if (tile >= THEME_DESERT) {
			currentTileTheme = THEME_DESERT;
		}
		const availableKeys = Object.keys(ENEMY_TYPES).filter(k => {
			const isUnlocked = (k === "regular") || g.available_enemies
				.includes(k);
			const isCorrectTheme = (ENEMY_TYPES[k].theme ===
				currentTileTheme);
			return isUnlocked && isCorrectTheme;
		});
		if (availableKeys.length === 0) {
			type = "regular";
		}
		else {
			const totalWeight = availableKeys.reduce((sum, key) => sum + (
				ENEMY_TYPES[key].weight || 0), 0);
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
	let width = config.w;
	let height = config.h;
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
	let max_health_random = config.health * (1 + 0.5 * Math.random());
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
		is_snake: config.is_snake
	};
	if (config.use_rainbow_color_gradient) {
		e.color_gradient = Math.random() * 2 * Math.PI / 0.03;
		let r = Math.pow(Math.cos(0.02 * e.color_gradient) * 15, 2);
		let g = Math.pow(0.7 * (Math.cos(0.02 * e.color_gradient) + Math
			.sin(0.02 * e.color_gradient)) * 15, 2);
		let b = Math.pow(Math.sin(0.02 * e.color_gradient) * 15, 2);
		e.color = "#" + Math.floor(r).toString(16).padStart(2, '0') + Math
			.floor(g).toString(16).padStart(2, '0') + Math.floor(b)
			.toString(16).padStart(2, '0');
	}
	if (config.mask) {
		e.body.collisionFilter.mask = config.mask;
	}
	if (boss) {
		e.damage = 1.05 * e.damage;
		e.health = 25 * e.max_health;
		e.max_health = 25 * e.max_health;
		e.hunger = 1.75 * e.max_hunger;
		e.max_hunger = 1.75 * e.max_hunger;
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
		e.health = 0.25 * e.max_health;
		e.max_health = 0.25 * e.max_health;
		e.hunger = 0.05 * e.max_hunger;
		e.max_hunger = 0.05 * e.max_hunger;
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
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw,
		enemy_destroy);
}

function enemy_destroy(enemy_object, death = true) {
	if (enemy_object.destroyed)
		return;
	let g = enemy_object.game;
	if (enemy_object.data.hit_by_player && enemy_object.data.hunger > 0 &&
		death) {
		if (g.enemy_kills[enemy_object.data.type] === undefined)
			g.enemy_kills[enemy_object.data.type] = 0;
		g.enemy_kills[enemy_object.data.type] += 1;
		if (DEBUG_ENEMY)
			g.debug_console.unshift("killed " + enemy_object.data.type + ": " +
				g.enemy_kills[enemy_object.data.type]);
		if (enemy_object.data.boss) {
			g.boss_kills += 1;
			for (let nextType in ENEMY_TYPES) {
				if (ENEMY_TYPES[nextType].requires === enemy_object.data.type) {
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
		if (DEBUG_ENEMY)
			g.debug_console.unshift("need kills for boss: " + g.kills_for_boss +
				", kills: " + g.kills);
	}
	if (enemy_object.data.boss && enemy_object.data.hit_by_player &&
		enemy_object.data.hunger <= 0 && death) {
		g.kills_for_boss = Math.max(32, g.kills_for_boss);
		if (DEBUG_ENEMY)
			g.debug_console.unshift(
				"couldn't defeat boss, need kills for boss: " + g
				.kills_for_boss + ", kills: " + g.kills);
	}
	Matter.Composite.remove(g.engine.world, enemy_object.data.body);
	enemy_object.data.body = null;
	enemy_object.destroyed = true;
}

function enemy_get_target_object(enemy_object, dt) {
	let e = enemy_object.data;
	let target_object = game_object_find_closest(enemy_object.game, e.body
		.position.x, e.body.position.y, "player", e.follow_range);
	if (target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body
			.position.x, e.body.position.y, "car", e.follow_range);
	if (target_object != null) {
		if (target_object.data.car_object)
			target_object = target_object.data.car_object;
	}
	if (dt > -1) {
		if (target_object)
			e.hunt_delay -= dt;
		else
			e.hunt_delay = e.hunt_delay_max;
	}
	if (e.hunt_delay > 0)
		target_object = null;
	return target_object;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	let typeData = ENEMY_TYPES[e.type] || ENEMY_TYPES["regular"];
	if (e.hunger > 0) e.hunger = Math.max(0, e.hunger - 0.001 * dt);
	if (e.hunger <= 0) {
		e.health *= Math.pow(0.5, dt / 1000);
		e.health -= 0.01 * e.max_health * dt / 1000;
	}
	if (e.poisoned_time > 0) {
		e.health -= 2.75 * dt / 1000;
		e.poisoned_time -= dt;
	}
	if (e.shooting_delay < 5000) e.shooting_delay += dt;
	if (e.jump_delay < 4000) e.jump_delay += Math.random() * dt;
	e.sword_rotation += 0.01 * dt;
	e.color_gradient += 0.01 * dt;
	if (typeData.behaviour_no_target)
		typeData.behaviour_no_target(enemy_object, dt);
	let vars = {
		tx: 0,
		ty: 0,
		v: 0,
		dx: 0,
		dy: 0,
		ndx: 0,
		ndy: 0,
	};
	let target_object = enemy_get_target_object(enemy_object, dt);
	if (target_object != null) {
		let tx = target_object.data.body.position.x - e.body.position.x;
		let ty = target_object.data.body.position.y - e.body.position.y;
		let v = Math.sqrt(tx * tx + ty * ty) || 0.001;
		vars = {
			tx: tx,
			ty: ty,
			v: v,
			dx: e.speed * tx / v,
			dy: e.speed * ty / v,
			ndx: tx / v,
			ndy: ty / v
		};
		if (typeData.behaviour) typeData.behaviour(enemy_object, dt,
			target_object, vars);
		if (e.boss && typeData.boss_behaviour) typeData.boss_behaviour(
			enemy_object, dt, target_object, vars);
		if (e.is_minion && typeData.minion_behaviour) typeData.minion_behaviour(
			enemy_object, dt, target_object, vars);
		let v_sq = vars.dx * vars.dx + vars.dy * vars.dy;
		if (v_sq > 0) {
			Matter.Body.setVelocity(e.body, {
				x: vars.dx,
				y: vars.dy
			});
		}
		if (e.boss) {
			if (e.spawn_minion_delay >= 4000) {
				let max_minions = typeData.max_minions || 10;
				if (typeData.max_minions === 0)
					max_minions = 0;
				if (enemy_count_minions(enemy_object) < max_minions) {
					for (let i = 0; i < Math.random() * 4 + 1; i++) {
						let theta = 2 * Math.PI * Math.random();
						let sx = e.body.position.x + 200 * Math.cos(theta);
						let sy = e.body.position.y + 200 * Math.sin(theta);
						if (typeData.minion_dist_mult) {
							let dist = typeData.minion_dist_mult * e.w;
							sx = target_object.data.body.position.x + dist *
								Math.cos(theta);
							sy = target_object.data.body.position.y + dist *
								Math.sin(theta);
						}
						enemy_create(enemy_object.game, sx, sy, false, true, e
							.type);
					}
				}
				e.spawn_minion_delay = 0;
			}
			e.spawn_minion_delay += Math.random() * dt;
		}
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
				let killsOfThisType = enemy_object.game.enemy_kills[e.type] ||
					0;
				let finalChance = 0.25 * Math.tanh(0.015 * killsOfThisType);
				if (!e.boss && !e.is_minion && Math.random() < finalChance)
					item_create(enemy_object.game, typeData.bossifier_item, e
						.body.position.x, e.body.position.y);
			}
			let dropData = {
				N: 1
			};
			if (e.boss) {
				if (e.hunger > 0) {
					dropData.N = 20 * Math.random() + 10;
					if (typeData.on_boss_death) typeData.on_boss_death(
						enemy_object, target_object, dropData);
				}
				else dropData.N = 5 * Math.random();
			}
			if (!e.boss && Math.random() < 0.25)
				dropData.N = 2;
			let sound = e.boss ? "data/sfx/zombie_boss_dies_1.mp3" :
				"data/sfx/zombie_dies_1.mp3";
			let p_close = game_object_find_closest(enemy_object.game, e.body
				.position.x, e.body.position.y, "player", 10000);
			if (p_close && !p_close.data.ai_controlled) audio_play(sound);
			for (let i = 0; i < dropData.N; i++) {
				let theta = 2 * Math.PI * Math.random();
				if ((3 * Math.random() < 1 && !e.boss || Math.random() < 0.75 &&
						e.boss) && DROP_ITEMS)
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
	ctx.save();
	if (vis.glowColor) {
		ctx.shadowBlur = vis.glowBlur || 15;
		ctx.shadowColor = vis.glowColor;
	}
	if (!typeData.only_draw_custom) {
		fillMatterBody(ctx, e.body, e.color);
		let outlineW = vis.outline_is_relative ? vis.outline_width * e.w : (vis
			.outline_width || 1);
		drawMatterBody(ctx, e.body, e.color_outline, outlineW);
	}
	if (vis.custom_draw)
		vis.custom_draw(e, ctx);
	ctx.restore();
	let target_object = enemy_get_target_object(enemy_object, -1);
	if (target_object != null) {
		let gx = target_object.data.body.position.x - e.body.position.x;
		let gy = target_object.data.body.position.y - e.body.position.y;
		let g = Math.sqrt(gx * gx + gy * gy) || 0.001;
		let px = e.body.position.x - 0.45 * e.w;
		let py = e.body.position.y - 0.45 * e.h;
		if ((vis.draw_gun && !e.boss || vis.draw_gun_boss && e.boss) && g <
			1.25 * e.shooting_range) {
			ctx.strokeStyle = vis.gun_color || "#331133";
			ctx.lineWidth = (vis.gun_width || 0.25) * e.w;
			let gunPoints = [];
			let useCenter = vis.center_gun;
			if (e.boss && vis.center_gun_boss !== undefined) useCenter = vis
				.center_gun_boss;
			if (e.is_minion && vis.center_gun_minion !== undefined) useCenter =
				vis.center_gun_minion;
			let useDouble = vis.double_gun;
			if (e.boss && vis.double_gun_boss !== undefined) useDouble = vis
				.double_gun_boss;
			if (e.is_minion && vis.double_gun_minion !== undefined) useDouble =
				vis.double_gun_minion;
			if (useCenter) {
				gunPoints.push({
					x: e.body.position.x,
					y: e.body.position.y
				});
			}
			else if (useDouble) {
				gunPoints.push({
					x: px,
					y: py
				});
				gunPoints.push({
					x: px + e.w,
					y: py
				});
			}
			else {
				gunPoints.push({
					x: px,
					y: py
				});
			}
			let k = 1;
			gunPoints.forEach(p => {
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				let targetX = p.x + k * e.w * gx / g;
				let targetY = p.y + k * (e.type.includes("rocket") || e
					.type.includes("laser") ? e.h : e.w) * gy / g;
				ctx.lineTo(targetX, targetY);
				ctx.stroke();
				if (vis.laser_beam && e.boss && e.shooting_delay < -
					4500) {
					ctx.beginPath();
					ctx.strokeStyle = e.color;
					ctx.lineWidth = 2 * 0.075 * e.w;
					ctx.moveTo(targetX, targetY);
					ctx.lineTo(p.x + 4 * gx, p.y + 4 * gy);
					ctx.stroke();
					ctx.beginPath();
					ctx.strokeStyle = "white";
					ctx.lineWidth = 2 * 0.05 * e.w;
					ctx.moveTo(targetX, targetY);
					ctx.lineTo(p.x + 4 * gx, p.y + 4 * gy);
					ctx.stroke();
				}
			});
		}
		if (vis.draw_sword && g < 0.33 * e.shooting_range && !e.is_minion) {
			ctx.strokeStyle = vis.sword_color || "#55aa11";
			ctx.lineWidth = 0.25 * e.w;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.lineTo(px + Math.cos(e.sword_rotation) * 2 * e.w, py + Math.sin(
				e.sword_rotation) * 2 * e.w);
			ctx.stroke();
		}
	}
	if (enemy_object.game.settings.indicators["show enemy hunger"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h,
			e.w, e.h * 0.05);
		ctx.fillStyle = "orange";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h,
			e.w * e.hunger / e.max_hunger, e.h * 0.05);
	}
	if (enemy_object.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h,
			e.w, e.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h,
			e.w * e.health / e.max_health, e.h * 0.05);
	}
}

function enemy_boss_exists(g) {
	if (!g.objects.find((obj) => obj.name == "enemy" && obj.data.boss))
		return false;
	return true;
}

function enemy_boss_distance_to_player(g, x, y) {
	let player_object = game_object_find_closest(g, x, y, "player", 20000);
	let enemies = g.collections["enemy"] || [];
	let boss_objects = enemies.filter((obj) => !obj.destroyed && obj.data.boss);
	if (boss_objects.length < 1 || !player_object)
		return -1;
	let boss_closest = boss_objects[0];
	for (let i = 1; i < boss_objects.length; i++) {
		if (dist(boss_closest.data.body.position, player_object.data.body
				.position) > dist(boss_objects[i].data.body.position,
				player_object.data.body.position))
			boss_closest = boss_objects[i];
	}
	return dist(boss_closest.data.body.position, player_object.data.body
		.position);
}

function enemy_count_minions(enemy_object) {
	let enemies = enemy_object.game.collections["enemy"] || [];
	return enemies.filter(obj => obj.data.type == enemy_object.data.type && obj
		.data.is_minion).length;
}
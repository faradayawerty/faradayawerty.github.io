function collisions_init(g) {
	g.engine.constraintIterations = 2;
	g.engine.positionIterations = 8;
	g.engine.velocityIterations = 4;
	Matter.Events.on(g.engine, 'collisionStart', (event) => {
		processCollisionEvent(g, event.pairs);
	});
	Matter.Events.on(g.engine, 'collisionActive', (event) => {
		processCollisionEvent(g, event.pairs);
	});
}

function processCollisionEvent(g, pairs) {
	const dt = g.lastDt || 16.6667;
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];
		const objA = pair.bodyA.gameObject;
		const objB = pair.bodyB.gameObject;
		if (!objA || !objB || objA.destroyed || objB.destroyed) continue;
		collisions_handle_pair_unified(g, objA, objB, dt);
	}
}

function collisions_handle_pair_unified(g, objA, objB, dt) {
	const sName = objA.name;
	const oName = objB.name;
	const sData = objA.data;
	const oData = objB.data;
	if (sName === "bullet" || sName === "trashbullet" || oName === "bullet" ||
		oName === "trashbullet") {
		const bullet = (sName.includes("bullet")) ? objA : objB;
		const target = (bullet === objA) ? objB : objA;
		const bData = bullet.data;
		const tData = target.data;
		const tName = target.name;
		if (bData.damaged) return;
		if (bData.enemy) {
			if (tName === "player") {
				collisions_apply_damage_to_player(tData, bData.damage, dt,
					"bullet", g);
				bData.damaged = true;
			}
		}
		else {
			const validTargets = ["enemy", "car", "trashcan", "animal",
				"rocket"
			];
			if (validTargets.includes(tName)) {
				if (bullet.name === "trashbullet" && tName === "rocket") return;
				if (tName === "rocket" && !tData.enemy) return;
				collisions_apply_damage_to_object(g, target, bData.damage, dt,
					true);
				bData.damaged = true;
				if (tName === "rocket") {
					tData.health -= bData.damage * dt;
					tData.target_object = null;
					tData.bounce_ticks = 10;
				}
			}
		}
		return;
	}
	if (sName === "rocket" || oName === "rocket") {
		const rocket = (sName === "rocket") ? objA : objB;
		const target = (rocket === objA) ? objB : objA;
		const rData = rocket.data;
		const tData = target.data;
		const tName = target.name;
		if (rData.enemy && tName === "enemy") return;
		if (!rData.enemy && (tName === "player" || (tName === "car" && !tData
				.enemy))) return;
		const potentialTargets = ["player", "enemy", "car", "trashcan",
			"animal", "rocket"
		];
		if (potentialTargets.includes(tName)) {
			if (tName === "rocket" && rData.enemy === tData.enemy) return;
			if (tName === "player" && rData.enemy) {
				collisions_apply_damage_to_player(tData, rData.damage, dt,
					"rocket", g);
			}
			else {
				collisions_apply_damage_to_object(g, target, rData.damage, dt, !
					rData.enemy);
			}
			rData.health -= 10 * rData.damage * dt;
			rData.target_object = null;
			rData.bounce_ticks = 10;
		}
		return;
	}
	if (sName === "enemy" || oName === "enemy") {
		const enemy = (sName === "enemy") ? objA : objB;
		const target = (enemy === objA) ? objB : objA;
		const eData = enemy.data;
		const tData = target.data;
		const tName = target.name;
		if (tName === "player") {
			collisions_apply_damage_to_player(tData, eData.damage, dt, "enemy",
				g);
		}
		else if (tName === "car") {
			tData.health -= (tData.is_tank ? 0.0625 : 1) * eData.damage * dt;
			let vel = Matter.Body.getVelocity(tData.body);
			let speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
			if ((!eData.boss && speed > 0.9 * tData.max_speed) || (tData
					.is_tank && speed > 0.1 * tData.max_speed)) {
				eData.health -= 100 * eData.damage * dt;
				eData.hit_by_player = true;
			}
		}
		return;
	}
	if ((sName === "car" && oName === "animal") || (sName === "animal" &&
			oName === "car")) {
		const animal = (sName === "animal") ? objA : objB;
		animal.data.health -= 0.75 * dt;
	}
}

function collisions_apply_damage_to_player(p, damage, dt, source, g) {
	if (p.immunity > 0) return;
	let totalDmg = damage * dt;
	const shields = [{
			key: 'shield_blue_health',
			kE: 1.0,
			kO: 0.95
		},
		{
			key: 'shield_green_health',
			kE: 0.25,
			kO: 0.75
		},
		{
			key: 'shield_shadow_health',
			kE: 0.25,
			kO: 0.75
		},
		{
			key: 'shield_rainbow_health',
			kE: 0.10,
			kO: 0.55
		},
		{
			key: 'shield_anubis_health',
			kE: 0.10,
			kO: 0.55
		}
	];
	for (let s of shields) {
		if (p[s.key] > 0) {
			p[s.key] -= (source === "enemy" ? s.kE : s.kO) * totalDmg;
			return;
		}
	}
	let k = 1.0;
	if (source === "rocket") {
		k = (p.sword_protection || p.sword_visible) ? 0.25 : 1.0;
	}
	else if (p.sword_protection) {
		k = 0.05;
		if (typeof hotbar_get_selected_item === 'function' &&
			hotbar_get_selected_item(p.hotbar_element) == ITEM_HORN) k = 0.001;
	}
	p.health -= k * totalDmg;
	if (p.health <= 0) {
		const lang = g.settings.language;
		if (source === "enemy") {
			DEATH_MESSAGE = lang === "русский" ? "☠️ игрок был заражён" :
				"☠️ the player has been infected";
		}
		else if (source === "bullet") {
			DEATH_MESSAGE = lang === "русский" ? "☠️ игрок был подстрелен" :
				"☠️ the player was killed by a bullet";
		}
		else if (source === "rocket") {
			DEATH_MESSAGE = lang === "русский" ?
				"☠️ игрок был подстрелен самонаводящейся ракетой" :
				"☠️ the player was killed by a rocket";
		}
	}
}

function collisions_apply_damage_to_object(g, obj, damage, dt, isFromPlayer) {
	let d = obj.data;
	let finalDmg = damage * dt;
	if (obj.name === "car" && d.is_tank && !d.enemy) {
		finalDmg *= 0.0125;
	}
	d.health -= finalDmg;
	if (isFromPlayer && (obj.name === "enemy" || obj.name === "rocket")) {
		d.hit_by_player = true;
		let w = g.current_weapon;
		if (!g.dps_history[w]) g.dps_history[w] = [];
		g.dps_history[w].push({
			dmg: finalDmg,
			time: Date.now()
		});
		const now = Date.now();
		if (g.dps_history[w].length > 50) {
			g.dps_history[w] = g.dps_history[w].filter(h => now - h.time <
				5000);
		}
	}
}
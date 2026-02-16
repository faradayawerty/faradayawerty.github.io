const COLLISION_VALID_TARGETS = new Set(["enemy", "car", "trashcan", "animal",
	"rocket"
]);
const COLLISION_POTENTIAL_TARGETS = new Set(["player", "enemy", "car",
	"trashcan", "animal", "rocket"
]);
const PLAYER_SHIELDS = [{
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
	for (let i = 0, len = pairs.length; i < len; i++) {
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
	if (sName === "bullet" || sName === "trashbullet" || oName === "bullet" ||
		oName === "trashbullet") {
		const isA = sName.includes("bullet");
		const bullet = isA ? objA : objB;
		const target = isA ? objB : objA;
		const bData = bullet.data;
		const tName = target.name;
		if (bData.damaged) return;
		if (bData.enemy) {
			if (tName === "player") {
				collisions_apply_damage_to_player(target.data, bData.damage, dt,
					"bullet", g);
				bData.damaged = true;
			}
		}
		else if (COLLISION_VALID_TARGETS.has(tName)) {
			if (bullet.name === "trashbullet" && tName === "rocket") return;
			const tData = target.data;
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
		return;
	}
	if (sName === "rocket" || oName === "rocket") {
		const isA = sName === "rocket";
		const rocket = isA ? objA : objB;
		const target = isA ? objB : objA;
		const rData = rocket.data;
		const tName = target.name;
		const tData = target.data;
		if (rData.enemy) {
			if (tName === "enemy") return;
		}
		else {
			if (tName === "player" || (tName === "car" && !tData.enemy)) return;
		}
		if (COLLISION_POTENTIAL_TARGETS.has(tName)) {
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
		const isA = sName === "enemy";
		const enemy = isA ? objA : objB;
		const target = isA ? objB : objA;
		const eData = enemy.data;
		const tData = target.data;
		const tName = target.name;
		if (tName === "player") {
			collisions_apply_damage_to_player(tData, eData.damage, dt, "enemy",
				g);
		}
		else if (tName === "car") {
			tData.health -= (tData.is_tank ? 0.0625 : 1) * eData.damage * dt;
			const vel = tData.body.velocity;
			const speedSq = vel.x * vel.x + vel.y * vel.y;
			const maxSpeed = tData.max_speed;
			if ((!eData.boss && speedSq > 0.81 * maxSpeed * maxSpeed) || (tData
					.is_tank && speedSq > 0.01 * maxSpeed * maxSpeed)) {
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
	const totalDmg = damage * dt;
	for (let i = 0; i < PLAYER_SHIELDS.length; i++) {
		const s = PLAYER_SHIELDS[i];
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
			hotbar_get_selected_item(p.hotbar_element) === ITEM_HORN) {
			k = 0.001;
		}
	}
	p.health -= k * totalDmg;
	if (p.health <= 0) {
		const isRu = g.settings.language === "русский";
		if (source === "enemy") {
			DEATH_MESSAGE = isRu ? "☠️ игрок был заражён" :
				"☠️ the player has been infected";
		}
		else if (source === "bullet") {
			DEATH_MESSAGE = isRu ? "☠️ игрок был подстрелен" :
				"☠️ the player was killed by a bullet";
		}
		else if (source === "rocket") {
			DEATH_MESSAGE = isRu ?
				"☠️ игрок был подстрелен самонаводящейся ракетой" :
				"☠️ the player was killed by a rocket";
		}
	}
}

function collisions_apply_damage_to_object(g, obj, damage, dt, isFromPlayer) {
	const d = obj.data;
	let finalDmg = damage * dt;
	if (obj.name === "car" && d.is_tank && !d.enemy) {
		finalDmg *= 0.0125;
	}
	d.health -= finalDmg;
	if (isFromPlayer && (obj.name === "enemy" || obj.name === "rocket")) {
		d.hit_by_player = true;
		const w = g.current_weapon;
		if (!g.dps_history[w]) g.dps_history[w] = [];
		const history = g.dps_history[w];
		const now = Date.now();
		history.push({
			dmg: finalDmg,
			time: now
		});
		if (history.length > 50) {
			g.dps_history[w] = history.filter(h => now - h.time < 5000);
		}
	}
}
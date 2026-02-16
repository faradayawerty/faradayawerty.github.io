const COLLISION_TARGETS_BULLET = ["enemy", "car", "trashcan", "animal",
	"rocket"
];
const COLLISION_TARGETS_ROCKET = ["player", "enemy", "car", "trashcan",
	"animal", "rocket"
];

function collisions_init(g) {
	g.engine.constraintIterations = 4;
	g.engine.positionIterations = 10;
	Matter.Events.on(g.engine, 'collisionStart', (event) => {
		const dt = g.lastDt || 16.6667;
		const pairs = event.pairs;
		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i];
			const objA = pair.bodyA.gameObject;
			const objB = pair.bodyB.gameObject;
			if (!objA || !objB || objA.destroyed || objB.destroyed)
				continue;
			collisions_handle_pair(g, objA, objB, dt);
			collisions_handle_pair(g, objB, objA, dt);
		}
	});
}

function collisions_handle_pair(g, self, other, dt) {
	const sName = self.name;
	const oName = other.name;
	const sData = self.data;
	const oData = other.data;
	if (sName === "bullet" || sName === "trashbullet") {
		if (sData.damaged) return;
		if (sData.enemy) {
			if (oName === "player") {
				collisions_apply_damage_to_player(oData, sData.damage, dt,
					"bullet", g);
				sData.damaged = true;
			}
		}
		else {
			if (COLLISION_TARGETS_BULLET.includes(oName)) {
				if (sName === "trashbullet" && oName === "rocket") return;
				if (oName === "rocket" && !oData.enemy) return;
				collisions_apply_damage_to_object(g, other, sData.damage, dt,
					true);
				sData.damaged = true;
				if (oName === "rocket") {
					oData.health -= sData.damage * dt;
					oData.target_object = null;
					oData.bounce_ticks = 10;
				}
			}
		}
	}
	else if (sName === "rocket") {
		if (sData.enemy && oName === "enemy") return;
		if (!sData.enemy && (oName === "player" || (oName === "car" && !oData
				.enemy))) return;
		if (COLLISION_TARGETS_ROCKET.includes(oName)) {
			if (oName === "rocket" && sData.enemy === oData.enemy) return;
			if (oName === "player" && sData.enemy) {
				collisions_apply_damage_to_player(oData, sData.damage, dt,
					"rocket", g);
			}
			else {
				const isFromPlayer = !sData.enemy;
				collisions_apply_damage_to_object(g, other, sData.damage, dt,
					isFromPlayer);
			}
			sData.health -= 10 * sData.damage * dt;
			sData.target_object = null;
			sData.bounce_ticks = 10;
		}
	}
	else if (sName === "enemy") {
		if (oName === "player") {
			collisions_apply_damage_to_player(oData, sData.damage, dt, "enemy",
				g);
		}
		else if (oName === "car") {
			oData.health -= (oData.is_tank ? 0.0625 : 1) * sData.damage * dt;
			let vel = Matter.Body.getVelocity(oData.body);
			let speedSq = vel.x * vel.x + vel.y * vel.y;
			let maxSpeed = oData.max_speed || 1;
			if ((!sData.boss && speedSq > 0.81 * maxSpeed * maxSpeed) || (oData
					.is_tank && speedSq > 0.01 * maxSpeed * maxSpeed)) {
				sData.health -= 100 * sData.damage * dt;
				sData.hit_by_player = true;
			}
		}
	}
	else if (sName === "car" && oName === "animal") {
		oData.health -= 0.75 * dt;
	}
}

function collisions_apply_damage_to_player(p, damage, dt, source, g) {
	if (p.immunity > 0) return;
	let totalDmg = damage * dt;
	if (p.shield_blue_health > 0) {
		p.shield_blue_health -= (source === "enemy" ? 1.0 : 0.95) * totalDmg;
		return;
	}
	if (p.shield_green_health > 0) {
		p.shield_green_health -= (source === "enemy" ? 0.25 : 0.75) * totalDmg;
		return;
	}
	if (p.shield_shadow_health > 0) {
		p.shield_shadow_health -= (source === "enemy" ? 0.25 : 0.75) * totalDmg;
		return;
	}
	if (p.shield_rainbow_health > 0) {
		p.shield_rainbow_health -= (source === "enemy" ? 0.10 : 0.55) *
			totalDmg;
		return;
	}
	if (p.shield_anubis_health > 0) {
		p.shield_anubis_health -= (source === "enemy" ? 0.10 : 0.55) * totalDmg;
		return;
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
		if (source === "enemy") {
			DEATH_MESSAGE = g.settings.language === "русский" ?
				"☠️ игрок был заражён" : "☠️ the player has been infected";
		}
		else if (source === "bullet") {
			DEATH_MESSAGE = g.settings.language === "русский" ?
				"☠️ игрок был подстрелен" :
				"☠️ the player was killed by a bullet";
		}
		else if (source === "rocket") {
			DEATH_MESSAGE = g.settings.language === "русский" ?
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
	}
}
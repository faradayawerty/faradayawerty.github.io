const COLLISION_TARGETS_BULLET = new Set(["enemy", "car", "trashcan", "animal",
	"rocket"
]);
const COLLISION_TARGETS_ROCKET = new Set(["player", "enemy", "car", "trashcan",
	"animal", "rocket"
]);
const dpsEntryPool = [];
for (let i = 0; i < 1000; i++) {
	dpsEntryPool.push({
		dmg: 0,
		time: 0
	});
}
let dpsPoolIndex = 0;
const enemyDpsEntryPool = [];
for (let i = 0; i < 1000; i++) {
	enemyDpsEntryPool.push({
		dmg: 0,
		time: 0
	});
}
let enemyDpsPoolIndex = 0;

function collisions_init(g) {
	g.engine.constraintIterations = 4;
	g.engine.positionIterations = 10;
	const handleCollisions = (event) => {
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
	};
	Matter.Events.on(g.engine, 'collisionStart', handleCollisions);
	Matter.Events.on(g.engine, 'collisionActive', handleCollisions);
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
				if (oData.car_object) {
					collisions_apply_damage_to_object(g, oData.car_object, sData
						.damage, dt, false);
				}
				else {
					collisions_apply_damage_to_player(oData, sData.damage, dt,
						"bullet", g);
				}
				sData.damaged = true;
			}
		}
		else {
			if (COLLISION_TARGETS_BULLET.has(oName)) {
				if (sName === "trashbullet" && oName === "rocket") return;
				if (oName === "rocket" && !oData.enemy) return;
				if (oName === "enemy" || oName === "animal") {
					if (g.settings.indicators["show blood"]) {
						blood_splash_create(g, oData.body.position.x, oData.body
							.position.y, 6, 3, "#bc0000", 1.0);
					}
					if (oName === "enemy") {
						if (sData.fire) {
							oData.burning_time = 5000;
						}
						if (sData.ice) {
							oData.frozen_time = 5000;
						}
						if (sData.poisoned) {
							oData.poisoned_time = 5000;
						}
						if (sData.electric) {
							oData.electrified_time = 5000;
						}
					}
				}
				collisions_apply_damage_to_object(g, other, sData.damage, dt,
					true);
				sData.damaged = true;
				if (oName === "rocket") {
					if (oData.damaged) return;
					let rocketDmg = Math.round(sData.damage * dt);
					oData.health -= rocketDmg;
					if (oData.health < 0) oData.health = 0;
					oData.target_object = null;
					oData.bounce_ticks = 10;
					oData.damaged = true;
					oData.body.collisionFilter.mask = 0;
				}
			}
		}
	}
	else if (sName === "rocket") {
		if (sData.enemy && oName === "enemy") return;
		if (oName === "rocket" && sData.enemy === oData.enemy) return;
		if (!sData.enemy && (oName === "player" || (oName === "car" && !oData
				.enemy))) return;
		if (COLLISION_TARGETS_ROCKET.has(oName)) {
			if (sData.damaged) return;
			if (oName === "player" && sData.enemy) {
				if (oData.car_object) {
					collisions_apply_damage_to_object(g, oData.car_object, sData
						.damage, dt, false);
				}
				else {
					collisions_apply_damage_to_player(oData, sData.damage, dt,
						"rocket", g);
				}
			}
			else {
				const isFromPlayer = !sData.enemy;
				if (oName === "enemy" || oName === "animal") {
					if (g.settings.indicators["show blood"]) {
						blood_splash_create(g, oData.body.position.x, oData.body
							.position.y, 12, 5, "#bc0000", 1.2);
					}
				}
				collisions_apply_damage_to_object(g, other, sData.damage, dt,
					isFromPlayer);
			}
			let selfRocketDmg = Math.round(10 * sData.damage * dt);
			sData.health -= selfRocketDmg;
			if (sData.health < 0) sData.health = 0;
			sData.target_object = null;
			sData.bounce_ticks = 10;
			sData.damaged = true;
			sData.body.collisionFilter.mask = 0;
		}
	}
	else if (sName === "enemy") {
		if (oName === "player") {
			if (oData.car_object) {
				collisions_apply_damage_to_object(g, oData.car_object, sData
					.damage, dt, false);
			}
			else if (Math.random() < 0.0625) {
				collisions_apply_damage_to_player(oData, sData.damage, dt,
					"enemy", g);
			}
		}
		else if (oName === "car") {
			let carDamage = Math.round((oData.is_tank ? 0.0625 : 1) * sData
				.damage * dt);
			oData.health -= carDamage;
			if (oData.health < 0) oData.health = 0;
			if (carDamage >= 1 && g.settings.indicators[
					"show damage numbers"]) {
				damage_text_create(g, oData.body.position.x, oData.body.position
					.y - 20, carDamage, "#ff2222");
			}
			if (!oData.enemy) {
				let eDpsEntry = enemyDpsEntryPool[enemyDpsPoolIndex];
				eDpsEntry.dmg = carDamage;
				eDpsEntry.time = Date.now();
				g.enemy_dps_history.push(eDpsEntry);
				enemyDpsPoolIndex = (enemyDpsPoolIndex + 1) % enemyDpsEntryPool
					.length;
			}
			let vel = oData.body.velocity;
			let speedSq = vel.x * vel.x + vel.y * vel.y;
			let maxSpeed = oData.max_speed || 1;
			if ((!sData.boss && speedSq > 0.81 * maxSpeed * maxSpeed) || (oData
					.is_tank && speedSq > 0.01 * maxSpeed * maxSpeed)) {
				if (g.settings.indicators["show blood"]) {
					blood_splash_create(g, sData.body.position.x, sData.body
						.position.y, 10, 4, "#bc0000", 1.3);
				}
				let crushDamage = Math.round(100 * sData.damage * dt);
				sData.health -= crushDamage;
				if (sData.health < 0) sData.health = 0;
				sData.hit_by_player = true;
				if (crushDamage >= 1 && g.settings.indicators[
						"show damage numbers"]) {
					damage_text_create(g, sData.body.position.x, sData.body
						.position.y - 20, crushDamage, "#ff2222");
				}
			}
		}
	}
	else if (sName === "car" && oName === "animal") {
		if (g.settings.indicators["show blood"]) {
			blood_splash_create(g, oData.body.position.x, oData.body.position.y,
				12, 5, "#8a0303", 1.5);
		}
		let animalDamage = Math.round(0.75 * dt);
		oData.health -= animalDamage;
		if (oData.health < 0) oData.health = 0;
		if (animalDamage >= 1 && g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, oData.body.position.x, oData.body.position.y -
				20, animalDamage, "#ff2222");
		}
	}
}

function collisions_apply_damage_to_player(p, damage, dt, source, g) {
	if (p.immunity > 0 || p.car_object) return;
	let totalDmg = Math.round(damage * dt);
	if (totalDmg <= 0) return;
	let eDpsEntry = enemyDpsEntryPool[enemyDpsPoolIndex];
	eDpsEntry.dmg = totalDmg;
	eDpsEntry.time = Date.now();
	g.enemy_dps_history.push(eDpsEntry);
	enemyDpsPoolIndex = (enemyDpsPoolIndex + 1) % enemyDpsEntryPool.length;
	if (p.shield_blue_health > 0) {
		let finalShieldDmg = Math.round((source === "enemy" ? 1.0 : 0.95) *
			totalDmg);
		if (g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, p.body.position.x, p.body.position.y - 20,
				finalShieldDmg, "#00ccff");
		}
		p.shield_blue_health -= finalShieldDmg;
		if (p.shield_blue_health < 0) p.shield_blue_health = 0;
		return;
	}
	if (p.shield_green_health > 0) {
		let finalShieldDmg = Math.round((source === "enemy" ? 0.25 : 0.75) *
			totalDmg);
		if (g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, p.body.position.x, p.body.position.y - 20,
				finalShieldDmg, "#00ff00");
		}
		p.shield_green_health -= finalShieldDmg;
		if (p.shield_green_health < 0) p.shield_green_health = 0;
		return;
	}
	if (p.shield_shadow_health > 0) {
		let finalShieldDmg = Math.round((source === "enemy" ? 0.25 : 0.75) *
			totalDmg);
		if (g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, p.body.position.x, p.body.position.y - 20,
				finalShieldDmg, "#555555");
		}
		p.shield_shadow_health -= finalShieldDmg;
		if (p.shield_shadow_health < 0) p.shield_shadow_health = 0;
		return;
	}
	if (p.shield_rainbow_health > 0) {
		let finalShieldDmg = Math.round((source === "enemy" ? 0.10 : 0.55) *
			totalDmg);
		if (g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, p.body.position.x, p.body.position.y - 20,
				finalShieldDmg, "#ff00ff");
		}
		p.shield_rainbow_health -= finalShieldDmg;
		if (p.shield_rainbow_health < 0) p.shield_rainbow_health = 0;
		return;
	}
	if (p.shield_anubis_health > 0) {
		let finalShieldDmg = Math.round((source === "enemy" ? 0.10 : 0.55) *
			totalDmg);
		if (g.settings.indicators["show damage numbers"]) {
			damage_text_create(g, p.body.position.x, p.body.position.y - 20,
				finalShieldDmg, "#ffd700");
		}
		p.shield_anubis_health -= finalShieldDmg;
		if (p.shield_anubis_health < 0) p.shield_anubis_health = 0;
		return;
	}
	if (g.settings.indicators["show damage numbers"]) {
		damage_text_create(g, p.body.position.x, p.body.position.y - 20,
			totalDmg, "#ff0000");
	}
	if (g.settings.indicators["show blood"]) {
		blood_splash_create(g, p.body.position.x, p.body.position.y, 8, 4,
			"#bc0000", 1.0);
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
	p.health -= Math.round(k * totalDmg);
	if (p.health < 0) p.health = 0;
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
	let rawDmg = damage * dt;
	if (obj.name === "car" && d.is_tank && !d.enemy) {
		rawDmg *= 0.0125;
	}
	let finalDmg = Math.round(rawDmg);
	if (finalDmg >= 1 && g.settings.indicators["show damage numbers"]) {
		const textX = d.body ? d.body.position.x : (d.x || 0);
		const textY = d.body ? d.body.position.y : (d.y || 0);
		damage_text_create(g, textX, textY - 20, finalDmg, "#ff2222");
	}
	d.health -= finalDmg;
	if (d.health < 0) d.health = 0;
	if (!isFromPlayer && (obj.name === "car" && !d.enemy)) {
		let eDpsEntry = enemyDpsEntryPool[enemyDpsPoolIndex];
		eDpsEntry.dmg = finalDmg;
		eDpsEntry.time = Date.now();
		g.enemy_dps_history.push(eDpsEntry);
		enemyDpsPoolIndex = (enemyDpsPoolIndex + 1) % enemyDpsEntryPool.length;
	}
	if (isFromPlayer && (obj.name === "enemy" || obj.name === "rocket")) {
		d.hit_by_player = true;
		let w = g.current_weapon;
		if (!g.dps_history[w]) g.dps_history[w] = [];
		let dpsEntry = dpsEntryPool[dpsPoolIndex];
		dpsEntry.dmg = finalDmg;
		dpsEntry.time = Date.now();
		if (g.dps_history[w].length < 1000) {
			g.dps_history[w].push(dpsEntry);
		}
		else {
			g.dps_history[w][dpsPoolIndex % 1000] = dpsEntry;
		}
		dpsPoolIndex = (dpsPoolIndex + 1) % dpsEntryPool.length;
	}
}
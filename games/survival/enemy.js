
function enemy_create(g, x, y, make_boss=false, make_minion=false, type="random") {
	if(!g.settings.enemies_spawn)
		return;
	let enemies = g.objects.filter((obj) => obj.name == "enemy");
	if(enemies.length > 100) {
		for(let i = 0; i < enemies.length - 100; i++) {
			if(!enemies[i].data.boss)
				enemies[i].destroy(enemies[i]);
		}
	}
	if(type == "random" && Math.random() < 0.25 && g.enemies["shooting laser"])
		type = "shooting laser";
	else if(type == "random" && Math.random() < 0.35 && g.enemies["shooting rocket"])
		type = "shooting rocket";
	else if(type == "random" && Math.random() < 0.55 && g.enemies["sword"])
		type = "sword";
	else if(type == "random" && Math.random() < 0.65 && g.enemies["shooting red"])
		type = "shooting red";
	else if(type == "random" && Math.random() < 0.75 && g.enemies["shooting"])
		type = "shooting";
	let width = 30, height = 30;
	let boss = make_boss;
	let player_object = game_object_find_closest(g, x, y, "player", 4000);
	if(player_object) {
		let m = 0.33 * (
			player_object.data.health / player_object.data.max_health
			+ player_object.data.thirst / player_object.data.max_thirst
			+ player_object.data.hunger / player_object.data.max_hunger
		);
		if(g.kills_for_boss > 0 || g.enemy_kills[type == "random" ? "regular" : type] < 16)
			m *= 0;
		let bd = enemy_boss_distance_to_player(g, x, y);
		if(-1 < bd && bd < 15000) {
			m *= 0.01;
		}
		if(Math.random() > 1 - 0.25 * m) {
			boss = true;
			g.enemy_kills[type == "random" ? "regular" : type] = 0;
		}
	}
	if(type == "shooting laser") {
		width = 50;
		height = 50;
	}
	if(make_minion)
		boss = false;
	if(boss) {
		width = width * 2.67;
		height = height * 2.67;
	}
	if(make_minion) {
		width = width * 0.67;
		height = height * 0.67;;
	}
	let e = {
		health: 200,
		max_health: 200,
		hunger: 300,
		max_hunger: 300,
		damage: 0.1,
		speed: 7,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x, y, width, height),
		hit_by_player: false,
		boss: false,
		follow_range: 1000,
		spawn_minion_delay: 4000,
		color: "green",
		color_outline: "white",
		type: "regular",
		shooting_delay: 1000,
		shooting_range: 400,
		is_minion: false,
		jump_delay: 4000,
		sword_rotation: 0,
		color_gradient: Math.random() * 10000
	};
	if(type == "shooting") {
		e.type = "shooting";
		e.health = 1000;
		e.max_health = 1000;
		e.speed = 5;
		e.color = "#335544";
		e.damage = 5 * e.damage;
		e.body.collisionFilter.mask = -5;
	}
	if(type == "shooting red") {
		e.type = "shooting red";
		e.health = 5000;
		e.max_health = 5000;
		e.speed = 8;
		e.color = "#999999";
		e.color_outline = "#aa3333";
		e.damage = 11 * e.damage;
		e.body.collisionFilter.mask = -5;
	}
	if(type == "sword") {
		e.type = "sword";
		e.health = 25000;
		e.max_health = 25000;
		e.speed = 9.75;
		e.color = "#bbaa11";
		e.color_outline = "lime";
		e.damage = 23 * e.damage;
	}
	if(type == "shooting rocket") {
		e.type = "shooting rocket";
		e.health = 125000;
		e.max_health = 125000;
		e.speed = 4.75;
		e.color = "gray";
		e.color_outline = "black";
		e.damage = 41 * e.damage;
	}
	if(type == "shooting laser") {
		e.type = "shooting laser";
		e.health = 625000;
		e.max_health = 625000;
		e.speed = 8.25;
		e.color = "#ff0000";
		e.color_outline = "white";
		e.damage = 75370 * e.damage;
	}
	if(boss) {
		e.damage = 5 * e.damage;
		e.health = 25 * e.max_health;
		e.max_health = 25 * e.max_health;
		e.hunger = 4 * e.max_hunger;
		e.max_hunger = 4 * e.max_hunger;
		e.speed = 0.5 * e.speed;
		if(e.type == "sword")
			e.speed *= 2;
		if(e.type == "shooting laser") {
			e.shooting_range *= 1.5;
			e.speed *= 2.25;
		}
		e.boss = true;
		e.follow_range = 10 * e.follow_range;
		e.shooting_range = 1.25 * e.shooting_range;
	}
	if(make_minion) {
		e.damage = 0.5 * e.damage;
		e.health = 0.25 * e.max_health;
		e.max_health = 0.25 * e.max_health;
		e.hunger = 0.05 * e.max_hunger;
		e.max_hunger = 0.05 * e.max_hunger;
		e.speed = 1.15 * e.speed;
		if(e.type == "sword") {
			e.speed = 0;
			e.health *= 0.25;
			e.max_health *= 0.25;
		}
		e.boss = false;
		e.follow_range = 1.25 * e.follow_range;
		e.shooting_range = 25 * e.shooting_range;
		e.is_minion = true;
	}
	
	Matter.Composite.add(g.engine.world, e.body);
	return game_object_create(g, "enemy", e, enemy_update, enemy_draw, enemy_destroy);
}

function enemy_destroy(enemy_object) {
	if(enemy_object.destroyed)
		return;
	let g = enemy_object.game;
	g.debug_console.unshift("destroying enemy");
	if(enemy_object.data.hit_by_player) {
		g.enemy_kills[enemy_object.data.type] += 1;
		if(enemy_object.data.boss) {
			g.kills_for_boss = 16;
			g.boss_kills += 1;
			if(enemy_object.data.type == "regular")
				g.enemies["shooting"] = true;
			if(enemy_object.data.type == "shooting")
				g.enemies["shooting red"] = true;
			if(enemy_object.data.type == "shooting red")
				g.enemies["sword"] = true;
			if(enemy_object.data.type == "sword")
				g.enemies["shooting rocket"] = true;
			if(enemy_object.data.type == "shooting rocket")
				g.enemies["shooting laser"] = true;
		} else {
			g.kills += 1;
			g.kills_for_boss -= 1;
		}
	}
	Matter.Composite.remove(g.engine.world, enemy_object.data.body);
	enemy_object.data.body = null;
	enemy_object.destroyed = true;
}

function enemy_get_target_object(enemy_object) {
	let e = enemy_object.data;
	let target_object = game_object_find_closest(enemy_object.game, e.body.position.x,e.body.position.y, "player", e.follow_range);
	if(target_object == null)
		target_object = game_object_find_closest(enemy_object.game, e.body.position.x, e.body.position.y, "car", e.follow_range);
	if(target_object != null) {
		if(target_object.data.car_object)
			target_object = target_object.data.car_object;
	}
	return target_object;
}

function enemy_update(enemy_object, dt) {
	let e = enemy_object.data;
	if(e.hunger > 0)
		e.hunger = Math.max(0, e.hunger - 0.001 * dt)
	if(e.hunger <= 0) {
		e.health *= Math.pow(0.5, dt/1000);
		e.health -= dt
	}
	if(e.shooting_delay < 5000)
		e.shooting_delay += dt;
	if(e.jump_delay < 4000)
		e.jump_delay += Math.random() * dt;
	e.sword_rotation += 0.01 * dt;
	let target_object = enemy_get_target_object(enemy_object);
	if(target_object != null) {
		let tx = target_object.data.body.position.x - e.body.position.x;
		let ty = target_object.data.body.position.y - e.body.position.y;
		let v = Math.sqrt(tx*tx + ty*ty);
		dx = e.speed * tx / v;
		dy = e.speed * ty / v;
		if(e.type == "shooting") {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 1000) {
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, dx, dy, 10, e.damage, true, e.w * 0.2, 2000, "blue", "white");
					e.shooting_delay = 0;
				}
				dx = 0;
				dy = 0;
			}
		}
		e.color_gradient += 0.01 * dt;
		if(e.type == "shooting laser" && e.boss) {
			if(e.jump_delay >= 1000) {
				if(dist(e.body.position, target_object.data.body.position) < 250) {
					e.jump_delay = 0;
					Matter.Body.setPosition(e.body,
						Matter.Vector.create(
							2.05 * (target_object.data.body.position.x - e.body.position.x) + target_object.data.body.position.x,
							2.05 * (target_object.data.body.position.y - e.body.position.y) + target_object.data.body.position.y
						));
				}
				if(dist(e.body.position, target_object.data.body.position) > 750) {
					e.jump_delay = 0;
					Matter.Body.setPosition(e.body,
						Matter.Vector.create(
							0.75 * (target_object.data.body.position.x - e.body.position.x) + target_object.data.body.position.x,
							0.75 * (target_object.data.body.position.y - e.body.position.y) + target_object.data.body.position.y
						));
				}
			}
			if(v < 1.25 * e.shooting_range && e.shooting_delay < -4500) {
				if(target_object.name == "player" && target_object.data.immunity <= 0 || target_object.name != "player") {
					if(target_object.name == "player" && target_object.data.shield_blue_health > 0) {
						target_object.data.shield_blue_health = target_object.data.shield_blue_health * Math.pow(0.75, dt/1000);
					} else
						target_object.data.health = target_object.data.health * Math.pow(0.75, dt/1000);
				}
			}
			if(e.shooting_delay >= 1000) {
				e.shooting_delay = -7500;
			}
		}
		if(e.type == "shooting laser") {
			let r = Math.cos(0.01 * e.color_gradient) * 15;
			let g = 0.7 * (Math.cos(0.01 * e.color_gradient) + Math.sin(0.01 * e.color_gradient)) * 15;
			let b = Math.sin(0.01 * e.color_gradient) * 15;
			r = Math.floor(r*r);
			g = Math.floor(g*g);
			b = Math.floor(b*b);
			e.color = "#"+(r).toString(16).padStart(2,'0') + (g).toString(16).padStart(2,'0') + (b).toString(16).padStart(2,'0');
		}
		if(e.type == "shooting laser" && e.is_minion) {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 300) {
					//let colors = ["blue", "red", "yellow", "lime", "purple", "cyan"];
					let colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "purple"];
					N = 7;
					for(let i = 0; i < N; i++) {
						let theta =  Math.PI * (i/N - 1/2);
						bullet_create(enemy_object.game, e.body.position.x, e.body.position.y,
							dx + Math.cos(theta), dy + Math.sin(theta), 25, e.damage * 10, true, e.w * 0.2, 2000,
							colors[i], "white");
					}
					e.shooting_delay = 0;
				}
				dx = 0;
				dy = 0;
			}
		}
		if(e.type == "shooting laser" && !e.is_minion && !e.boss) {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 150) {
					let colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "purple"];
					N = 1;
					for(let i = 0; i < N; i++) {
						let theta = Math.PI / 4 + Math.atan2(dy, dx);
						bullet_create(enemy_object.game, e.body.position.x + 50 * Math.cos(theta), e.body.position.y + 50 * Math.sin(theta),
							dx, dy, 25, e.damage * 10, true, e.w * 0.095, 2000,
							colors[Math.floor(e.color_gradient) % 7], "white");
						theta = -Math.PI / 4 + Math.atan2(dy, dx);
						bullet_create(enemy_object.game, e.body.position.x + 50 * Math.cos(theta), e.body.position.y + 50 * Math.sin(theta),
							dx, dy, 25, e.damage * 10, true, e.w * 0.095, 2000,
							colors[Math.floor(e.color_gradient) % 7], "white");
					}
					e.shooting_delay = 0;
				}
				dx = 0;
				dy = 0;
			}
		}
		if(e.type == "shooting rocket") {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 2500) {
					rocket_create(
						enemy_object.game,
						e.body.position.x,
						e.body.position.y,
						dx,
						dy,
						Math.min(0.25 * e.w, 10),
						target_object,
						0.25 * e.damage,
						e.max_health * 0.005
					);
					e.shooting_delay = 0;
				}
				dx = 0;
				dy = 0;
			}
		}
		if(e.type == "shooting red") {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 200) {
					bullet_create(enemy_object.game, e.body.position.x + e.w, e.body.position.y, dx, dy, 15, e.damage, true, Math.max(0.09 * e.w, 4), 2000, "red", "white");
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, dx, dy, 15, e.damage, true, Math.max(0.09 * e.w, 4), 2000, "red", "white");
					e.shooting_delay = 0;
				}
				dx = 0;
				dy = 0;
			}
		}
		if(e.type == "sword" && e.boss) {
			if(e.jump_delay >= 1000 && dist(e.body.position, target_object.data.body.position) > 500) {
				e.jump_delay = 0;
				Matter.Body.setPosition(e.body,
					Matter.Vector.create(
						-e.body.position.x + 2 * target_object.data.body.position.x,
						-e.body.position.y + 2 * target_object.data.body.position.y
					));
			}
		}
		if(e.type == "sword" && e.is_minion) {
			if(v < e.shooting_range) {
				if(e.shooting_delay >= 500) {
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, tx, ty, 7, e.damage, true, 0.33 * e.w, 2000, "gray", "lime");
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, ty, -tx, 7, e.damage, true, 0.33 * e.w, 2000, "gray", "lime");
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, -tx, -ty, 7, e.damage, true, 0.33 * e.w, 2000, "gray", "lime");
					bullet_create(enemy_object.game, e.body.position.x, e.body.position.y, -ty, tx, 7, e.damage, true, 0.33 * e.w, 2000, "gray", "lime");
					e.shooting_delay = 0;
				}
			}
		}
		let vel = Matter.Vector.create(dx, dy);
		Matter.Body.setVelocity(e.body, vel);
		if(target_object.data.health && Matter.Collision.collides(e.body, target_object.data.body) != null) {
			if(target_object.name == "player") {
				if(target_object.data.shield_blue_health > 0)
					target_object.data.shield_blue_health -= e.damage * dt;
				else if(target_object.data.immunity <= 0)
					target_object.data.health -= e.damage * dt;
			}
			if(target_object.name == "car")
				target_object.data.health -= e.damage * dt;
			if(target_object.name == "car"
				&& (!e.boss && Matter.Vector.magnitude(Matter.Body.getVelocity(target_object.data.body)) > 0.9 * target_object.data.max_speed
					|| target_object.data.is_tank && Matter.Vector.magnitude(Matter.Body.getVelocity(target_object.data.body)) > 0.1 * target_object.data.max_speed)) {
				enemy_object.data.health -= 10 * e.damage * dt;
				enemy_object.data.hit_by_player = true;
			} else
				e.hunger = Math.min(e.max_hunger, e.hunger + 0.05 * dt)
		}
		if(e.spawn_minion_delay >= 4000 && e.boss) {
			let max_minions = 5;
			if(enemy_object.data.type == "sword")
				max_minions = 25;
			if(enemy_object.data.type == "shooting laser")
				max_minions = 15;
			if(enemy_count_minions(enemy_object) < max_minions) {
				for(let i = 0; i < Math.random() * 4 + 1; i++) {
					let theta = 2 * Math.PI * Math.random();
					let x = e.body.position.x + 300 * Math.cos(theta);
					let y = e.body.position.y + 300 * Math.sin(theta);
					if(e.type == "sword") {
						x = target_object.data.body.position.x + 500 * Math.cos(theta);
						y = target_object.data.body.position.y + 500 * Math.sin(theta);
					}
					enemy_create(enemy_object.game, x, y, false, true, e.type);
				}
			}
			e.spawn_minion_delay = 0;
		}
		if(e.spawn_minion_delay < 4000)
			e.spawn_minion_delay += Math.random() * dt;
	}
	if(enemy_object.data.health <= 0) {
		if(enemy_object.data.hit_by_player) {
			let N = 1;
			if(enemy_object.data.boss) {
				if(enemy_object.data.hunger > 0) {
					N = 20 * Math.random() + 10;
					if(e.type == "shooting") {
						item_create(enemy_object.game, ITEM_PLASMA_LAUNCHER, e.body.position.x, e.body.position.y);
						if(Math.random() < 0.33)
							item_create(enemy_object.game, ITEM_SHIELD, e.body.position.x, e.body.position.y);
					} else if(e.type == "shooting red") {
						if(Math.random() > 0.33)
							item_create(enemy_object.game, ITEM_RED_PISTOLS, e.body.position.x, e.body.position.y);
						else
							item_create(enemy_object.game, ITEM_RED_SHOTGUN, e.body.position.x, e.body.position.y);
					} else if(e.type == "sword") {
						if(Math.random() > 0.33)
							item_create(enemy_object.game, ITEM_SWORD, e.body.position.x, e.body.position.y);
						else
							item_create(enemy_object.game, ITEM_GREEN_GUN, e.body.position.x, e.body.position.y);
					} else if(e.type == "shooting rocket") {
						if(Math.random() > 0.33)
							item_create(enemy_object.game, ITEM_ROCKET_LAUNCHER, e.body.position.x, e.body.position.y);
						else {
							let tank_colors = ["green", "blue", "#005533", "#003355", "#aaaa11"];
							car_create(enemy_object.game, e.body.position.x, e.body.position.y, tank_colors[Math.floor(Math.random() * tank_colors.length)], true, true);
						}
					} else if(e.type == "shooting laser") {
						item_create(enemy_object.game, ITEM_RAINBOW_PISTOLS, e.body.position.x, e.body.position.y);
					} else {
						if(Math.random() > 0.33)
							item_create(enemy_object.game, ITEM_SHOTGUN, e.body.position.x, e.body.position.y);
						else
							item_create(enemy_object.game, ITEM_MINIGUN, e.body.position.x, e.body.position.y);
					}
				} else
					N = 10 * Math.random() + 5;
			}
			for(let i = 0; i < N; i++) {
				let theta = 2 * Math.PI * Math.random();
				let x = e.body.position.x + 50 * Math.cos(theta);
				let y = e.body.position.y + 50 * Math.sin(theta);
				if(Math.random() < 0.75)
					item_spawn(enemy_object.game, x, y, e.type);
			}
		}
		enemy_destroy(enemy_object);
	}
}

function enemy_draw(enemy_object, ctx) {
	let e = enemy_object.data;
	if(e.health <= 0)
		return;
	fillMatterBody(ctx, e.body, e.color);
	if(enemy_object.data.type == "shooting red")
		drawMatterBody(ctx, e.body, e.color_outline, 0.05 * e.w);
	else
		drawMatterBody(ctx, e.body, e.color_outline, 1);
	if(enemy_object.game.settings.indicators["show enemy hunger"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w, e.h * 0.05);
		ctx.fillStyle = "orange";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.7 * e.h, e.w * e.hunger / e.max_hunger, e.h * 0.05);
	}
	if(enemy_object.game.settings.indicators["show enemy health"]) {
		ctx.fillStyle = "red";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w, e.h * 0.05);
		ctx.fillStyle = "lime";
		ctx.fillRect(e.body.position.x - e.w / 2, e.body.position.y - 0.8 * e.h, e.w * e.health / e.max_health, e.h * 0.05);
	}
	let target_object = enemy_get_target_object(enemy_object);
	if(target_object != null) {
		let px = e.body.position.x - 0.45 * e.w;
		let py = e.body.position.y - 0.45 * e.h;
		let gx = target_object.data.body.position.x - e.body.position.x;
		let gy = target_object.data.body.position.y - e.body.position.y;
		let g = Math.sqrt(gx*gx + gy*gy);
		if(e.type == "shooting" && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + e.w * gx / g, py + e.w * gy / g);
			ctx.lineWidth = 0.25 * e.w;
			ctx.stroke();
		}
		if(e.type == "shooting laser" && e.is_minion && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + e.w * gx / g, py + e.h * gy / g);
			ctx.lineWidth = 0.175 * e.w;
			ctx.stroke();
		}
		if(e.type == "shooting laser" && e.boss && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px + 0.45 * e.w, py + 0.45 * e.h);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + 0.45 * e.w + e.w * gx / g, py + 0.45 * e.h + e.h * gy / g);
			ctx.lineWidth = 0.175 * e.w;
			ctx.stroke();
			if(e.shooting_delay < -4500) {
				ctx.beginPath();
				ctx.moveTo(px + 0.45 * e.w + e.w * gx / g, py + 0.45 * e.h + e.w * gy / g);
				ctx.strokeStyle = e.color;
				ctx.lineTo(px + 0.45 * e.w + 4 * gx, py + 0.45 * e.h + 4 * gy);
				ctx.lineWidth = 0.075 * e.w;
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(px + 0.45 * e.w + e.w * gx / g, py + 0.45 * e.h + e.w * gy / g);
				ctx.strokeStyle = "white";
				ctx.lineTo(px + 0.45 * e.w + 4 * gx, py + 0.45 * e.h + 4 * gy);
				ctx.lineWidth = 0.05 * e.w;
				ctx.stroke();
			}
		}
		if(e.type == "shooting laser" && !e.is_minion && !e.boss && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + 0.75 * e.w * gx / g, py + 0.75 * e.w * gy / g);
			ctx.lineWidth = 0.21 * e.w;
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(px + e.w, py);
			ctx.strokeStyle = "#331133";
			ctx.lineTo(px + e.w + 0.75 * e.w * gx / g, py + 0.75 * e.w * gy / g);
			ctx.lineWidth = 0.21 * e.w;
			ctx.stroke();
		}
		if(e.type == "shooting rocket" && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#113355";
			ctx.lineTo(px + e.w * gx / g, py + e.h * gy / g);
			ctx.lineWidth = 0.25 * e.w;
			ctx.stroke();
		}
		if(e.type == "sword" && g < 0.33 * e.shooting_range && !e.is_minion) {
			let sword_length = 2 * e.w;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#55aa11";
			ctx.lineTo(px + Math.cos(e.sword_rotation) * sword_length, py + Math.sin(e.sword_rotation) * sword_length);
			ctx.lineWidth = 0.25 * e.w;
			ctx.stroke();
		}
		if(e.type == "shooting red" && g < 1.25 * e.shooting_range) {
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.strokeStyle = "#551111";
			ctx.lineTo(px + 0.75 * e.w * gx / g, py + 0.75 * e.w * gy / g);
			ctx.lineWidth = 0.21 * e.w;
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(px + e.w, py);
			ctx.strokeStyle = "#551111";
			ctx.lineTo(px + e.w + 0.75 * e.w * gx / g, py + 0.75 * e.w * gy / g);
			ctx.lineWidth = 0.21 * e.w;
			ctx.stroke();
		}
	}
}

function enemy_boss_exists(g) {
	if(!g.objects.find((obj) => obj.name == "enemy" && obj.data.boss))
		return false;
	return true;
}

function enemy_boss_distance_to_player(g, x, y) {
	let player_object = game_object_find_closest(g, x, y, "player", 20000);
	let boss_objects = g.objects.filter((obj) => obj.name == "enemy" && obj.data.boss);
	if(boss_objects.length < 1 || !player_object)
		return -1;
	let boss_closest = boss_objects[0];
	for(let i = 1; i < boss_objects.length; i++)
		if(dist(boss_closest.data.body.position, player_object.data.body.position) > dist(boss_objects[i].data.body.position, player_object.data.body.position))
			boss_closest = boss_objects[i];
	return dist(boss_closest.data.body.position, player_object.data.body.position);
}

function enemy_count_minions(enemy_object) {
	let l = (enemy_object.game.objects.filter((obj) => obj.name == "enemy"
		&& obj.data.type == enemy_object.data.type
		&& obj.data.is_minion));
	return l.length;
}


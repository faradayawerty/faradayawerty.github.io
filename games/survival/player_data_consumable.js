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
	[ITEM_SHIELD]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = p.shield_blue_health_max;
			p.shield_green_health = 0;
			p.shield_rainbow_health = 0;
			p.shield_shadow_health = 0;
			p.shield_anubis_health = 0;
			return true;
		}
	},
	[ITEM_SHIELD_GREEN]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = p.shield_green_health_max;
			p.shield_rainbow_health = 0;
			p.shield_shadow_health = 0;
			p.shield_anubis_health = 0;
			return true;
		}
	},
	[ITEM_SHADOW_SHIELD]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = 0;
			p.shield_shadow_health = p.shield_shadow_health_max;
			p.shield_rainbow_health = 0;
			p.shield_anubis_health = 0;
			return true;
		}
	},
	[ITEM_SHIELD_RAINBOW]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = 0;
			p.shield_rainbow_health = p.shield_rainbow_health_max;
			p.shield_shadow_health = 0;
			p.shield_anubis_health = 0;
			return true;
		}
	},
	[ITEM_ANUBIS_REGEN_SHIELD]: {
		sfx: "data/sfx/shield_1.mp3",
		action: (p) => {
			p.shield_blue_health = 0;
			p.shield_green_health = 0;
			p.shield_rainbow_health = 0;
			p.shield_shadow_health = 0;
			p.shield_anubis_health = p.shield_anubis_health_max;
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
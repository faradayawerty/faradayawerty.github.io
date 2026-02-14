const ITEM_BEHAVIORS = {
	[ITEM_DIARY]: {
		action: (p, player_obj) => {
			const title = "Дневник выжившего";
			const text = [
				"Запись первая. Говорят, человек привыкает ко всему. Врут. Нельзя привыкнуть ",
				"к тому, что по утрам ты больше не слышишь шума машин или криков детей во ",
				"дворе. Теперь утро пахнет гарью и мокрым бетоном. Город не умер — его ",
				"выпотрошили, оставив гнить под серым небом. Мы стали тенями в мире, ",
				"который когда-то строили для жизни, а не для пряток.\n\n",
				"Запись пятая. Я видел сегодня женщину в витрине дорогого бутика. Она ",
				"просто стояла там, среди манекенов, в разорванном шелковом платье. Её ",
				"лицо... точнее, то, что от него осталось, было повернуто к солнцу. Она ",
				"не рычала. Она просто замерла, будто пыталась вспомнить, каково это — ",
				"быть красивой. Я прошел мимо, сжимая в руке ржавую арматуру. Мое ",
				"сострадание сгорело вместе с последней работающей электростанцией.\n\n",
				"Запись одиннадцатая. Мой кошелек все еще в кармане. В нем лежат фото ",
				"семьи и пачка купюр, за которые месяц назад можно было купить машину. ",
				"Сейчас за них не дадут даже засохшую корку хлеба. Странно, как быстро ",
				"цивилизация осыпалась, словно дешевая штукатурка. Мы копили деньги, ",
				"строили планы, переживали из-за пробок... Какими же идиотами мы были.\n\n",
				"Запись четырнадцатая. Ночи стали холоднее. В темноте они активнее. ",
				"Я сижу в подвале, слушаю, как за дверью капает вода, и молюсь всем ",
				"богам, которых раньше высмеивал. Самое страшное — это не мертвецы. ",
				"Самое страшное — это когда ты ловишь свое отражение в луже и понимаешь, ",
				"что в твоих глазах осталось столько же жизни, сколько и в их. Мы ",
				"просто еще не упали.\n\n",
				"Если кто-то найдет эту тетрадь — значит, я все-таки нашел свою тишину. ",
				"Не ищите героев. Их здесь нет. Здесь остались только те, кто умеет ",
				"быстро бегать и вовремя закрывать рот. Не верьте огням на горизонте. ",
				"Огни привлекают не только людей.\n\n",
				"Прощайте. И, если сможете, не забывайте вкус горячего хлеба."
			].join('');
			player_show_note(p, title, text);
			return false;
		}
	},
	[ITEM_SURVIVOR_NOTE]: {
		action: (p, player_obj) => {
			const title = "Помятая записка";
			const text = [
				"Сегодня я нашел в куче мусора старый ботинок. Один. Второй, наверное, ",
				"так и остался гнить где-то на другом конце города вместе с владельцем. ",
				"Раньше я бы просто прошел мимо, но сейчас... я смотрел на подошву и ",
				"думал о том, что этот человек куда-то шел. Может, на свидание? Или на ",
				"работу, которую ненавидел?\n\n",
				"Удивительно, как быстро мир превратился в свалку воспоминаний. Мы ",
				"собираем консервные банки и радуемся глотку чистой воды, будто это ",
				"сокровище. А ведь когда-то самым страшным в жизни было забыть зарядить ",
				"телефон или потерять кошелек.\n\n",
				"Теперь мой кошелек полон бумаги, которая не стоит даже ",
				"патрона. Самое тяжелое — это не голод и не мертвецы за стеной. Самое ",
				"тяжелое — это когда наступает ночь, и в этой проклятой тишине ты ",
				"начинаешь вспоминать вкус горячего хлеба и голос мамы.\n\nНадеюсь, эту ",
				"записку кто-нибудь найдет. Просто чтобы знать — мы здесь были. ",
				"Мы были живыми."
			].join('');
			player_show_note(p, title, text);
			return false;
		}
	},
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
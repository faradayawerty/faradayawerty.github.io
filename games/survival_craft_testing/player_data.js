Object.keys(ENEMY_TYPES).forEach(type => {
	const cfg = ENEMY_TYPES[type];
	if (cfg.bossifier_item) {
		const itemId = cfg.bossifier_item;
		let enemyTypeEng = ENEMY_TYPES[type].name_eng;
		let enemyTypeRus = ENEMY_TYPES[type].name_rus;
		let salt = "";
		let saltRus = "";
		if (type === "regular") {
			salt =
				" To make a boss, stand close to an enemy while holding bossifier and use the item."
			saltRus =
				" Чтобы превратить противника в босса, подойдите к нему и воспользуйтесь боссификатором в руках."
		}
		ITEMS_DATA[itemId] = {
			name: `Bossifier: ${enemyTypeEng}`,
			desc: `Forces a ${enemyTypeEng} enemy into its boss form.` +
				salt,
			name_rus: `Боссификатор: ${enemyTypeRus}`,
			desc_rus: `Превращает противника типа «${enemyTypeRus}» в босса.` +
				saltRus,
			render: (ctx, x, y, w, h, animstate) =>
				item_draw_bossifier_icon(ctx, x, y, w, h, animstate,
					type)
		};
		ITEM_BEHAVIORS[itemId] = {
			action: (p, player_obj) => {
				let t = game_object_find_closest(
					player_obj.game,
					player_obj.data.body.position.x,
					player_obj.data.body.position.y,
					"enemy",
					600,
					(obj) => obj.data.type === type && !obj
					.data.boss
				);
				if (t && t.data.type === type && !t.data.boss) {
					enemy_create(t.game, t.data.body.position.x,
						t.data.body.position.y, true, false,
						type);
					enemy_destroy(t);
					return true;
				}
				return false;
			}
		};
	}
});
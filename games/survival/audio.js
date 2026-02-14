var GLOBAL_VOLUME = 80;
const AUDIO_CACHE = {};
async function audio_init() {
		console.log("Загрузка через гибридный метод (совместимость с file:
			const soundList = [{
					name: "achievement_get_1",
					vol: 0.8
				},
				{
					name: "achievement_get_2",
					vol: 0.8
				},
				{
					name: "car_1",
					vol: 0.75
				},
				{
					name: "gunshot_1",
					vol: 0.25
				},
				{
					name: "raccoon_dies",
					vol: 0.75
				},
				{
					name: "shield_1",
					vol: 0.75
				},
				{
					name: "water_1",
					vol: 1.0
				},
				{
					name: "deer_dies_1",
					vol: 0.75
				},
				{
					name: "healing_1",
					vol: 0.75
				},
				{
					name: "red_pistols_1",
					vol: 0.15
				},
				{
					name: "shotgun_1",
					vol: 0.25
				},
				{
					name: "zombie_boss_dies_1",
					vol: 0.8
				},
				{
					name: "beam_of_laser_fires_1",
					vol: 0.25
				},
				{
					name: "eating_1",
					vol: 1.0
				},
				{
					name: "plasmagun_1",
					vol: 0.15
				},
				{
					name: "rocketlauncher_1",
					vol: 0.15
				},
				{
					name: "sword_1",
					vol: 0.75
				},
				{
					name: "zombie_dies_1",
					vol: 0.7
				},
				{
					name: "revolver_1",
					vol: 0.7
				},
			];
			const promises = soundList.map(s => {
				return new Promise((resolve) => {
					const path = `data/sfx/${s.name}.mp3`;
					const pool = [];
					const poolSize = 10;
					for (let i = 0; i < poolSize; i++) {
						const a = new Audio();
						a.src = path;
						a.preload = 'auto';
						pool.push(a);
					}
					AUDIO_CACHE[path] = {
						nodes: pool,
						index: 0,
						baseVolume: s.vol
					};
					resolve();
				});
			}); await Promise.all(promises); console.log(
				"Аудио готово к работе.");
		}

		function audio_play(path, volume = null) {
			const entry = AUDIO_CACHE[path];
			if (!entry) return;
			const channel = entry.nodes[entry.index];
			channel.currentTime = 0;
			let bVol = volume !== null ? volume : entry.baseVolume;
			channel.volume = bVol * (GLOBAL_VOLUME / 100);
			const playPromise = channel.play();
			if (playPromise !== undefined) {
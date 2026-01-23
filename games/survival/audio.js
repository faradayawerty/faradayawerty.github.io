var GLOBAL_VOLUME = 80;
const AUDIO_CACHE = {};

function audio_create(path, volume = 0.75) {
	return new Promise((resolve) => {
		const a = new Audio();
		a.oncanplaythrough = () => resolve(a);
		a.onerror = () => {
			console.error(
				`[Audio Error]: Не удалось загрузить файл: ${path}`
			);
			resolve(null);
		};
		a.src = path;
		a.preload = 'auto';
		a.dataset.baseVolume = volume;
		a.load();
	});
}
async function audio_init() {
	console.log("Начало загрузки аудио...");
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
		}
	];
	const promises = soundList.map(s => {
		const path = `data/sfx/${s.name}.mp3`;
		return audio_create(path, s.vol).then(audioObj => {
			if (audioObj) {
				AUDIO_CACHE[path] = audioObj;
			}
		});
	});
	await Promise.all(promises);
	console.log("Загрузка аудио завершена. Кэш готов.");
}

function audio_play(path, volume = null) {
	const master = AUDIO_CACHE[path];
	if (master) {
		try {
			let clone = master.cloneNode();
			let v = (volume !== null) ? volume : parseFloat(master.dataset
				.baseVolume);
			clone.volume = v * (GLOBAL_VOLUME / 100);
			const playPromise = clone.play();
			if (playPromise !== undefined) {
				playPromise.catch(() => {});
			}
		} catch (err) {
			console.error(`[Audio Runtime Error]: ${path}`, err);
		}
	} else {
		console.warn(`[Audio Missing]: ${path}. Загружаю экстренно...`);
		audio_create(path, volume || 0.75).then(audioObj => {
			if (audioObj) {
				AUDIO_CACHE[path] = audioObj;
				let v = (volume !== null) ? volume : 0.75;
				audioObj.volume = v * (GLOBAL_VOLUME / 100);
				audioObj.play().catch(() => {});
			}
		});
	}
}
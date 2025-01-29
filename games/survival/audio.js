
function audios_get() {
	let as = {
		deer_dies_1: audio_create("data/sfx/deer_dies_1.mp3"),
		car_1: audio_create("data/sfx/car_1.mp3"),
		beam_of_laser_fires_1: audio_create("data/sfx/beam_of_laser_fires_1.mp3", 0.25),
		shotgun_1: audio_create("data/sfx/shotgun_1.mp3", 0.25),
		gunshot_1: audio_create("data/sfx/gunshot_1.mp3", 0.25),
		plasmagun_1: audio_create("data/sfx/plasmagun_1.mp3", 0.125),
		sword_1: audio_create("data/sfx/sword_1.mp3"),
		red_pistols_1: audio_create("data/sfx/red_pistols_1.mp3", 0.125),
		rocketlauncher_1: audio_create("data/sfx/rocketlauncher_1.mp3", 0.125),
		shield_1: audio_create("data/sfx/shield_1.mp3"),
		healing_1: audio_create("data/sfx/healing_1.mp3"),
		water_1: audio_create("data/sfx/water_1.mp3", 1.0),
		eating_1: audio_create("data/sfx/eating_1.mp3", 1.0),
		minigun_last_played: Date.now()
	};
	return as;
}

function audio_create(path, volume=0.75) {
	let a = new Audio(path);
	a.volume = volume;
	a.preload = 'auto';
	a.loop = false;
	return a;
}

function audio_play(path, volume=0.75) {
	let a = new Audio(path);
	a.volume = volume;
	a.preload = 'auto';
	a.play();
}


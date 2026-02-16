var GLOBAL_VOLUME = 80;

function audio_play(path, volume = 0.75) {
	try {
		let a = new Audio(path);
		a.volume = volume * GLOBAL_VOLUME * 0.01;
		a.preload = 'auto';
		a.play();
	}
	catch (e) {
		console.error(e);
	}
}
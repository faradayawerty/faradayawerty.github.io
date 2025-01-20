
function audio_play(path, volume=0.75) {
	let a = new Audio(path);
	a.volume = volume;
	a.play();
}


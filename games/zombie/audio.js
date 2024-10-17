
function audio_get() {
	let a = {
		gunshot: 'data/sfx/gunshot.ogg'
	};
	return a;
}

function audio_play(path) {
	let a = new Audio(path);
	a.play();
}

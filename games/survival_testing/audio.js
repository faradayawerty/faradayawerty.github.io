var GLOBAL_VOLUME = 80;
const MIN_INTERVAL = 100;
const SOUND_EXPIRATION_MS = 150;
const audioCache = {};
const audioQueues = {};
const activeWorkers = {};

function audio_play(path, volume = 0.75) {
	if (!audioQueues[path]) {
		audioQueues[path] = [];
	}
	audioQueues[path].push({
		volume: volume,
		timestamp: Date.now()
	});
	if (!activeWorkers[path]) {
		processSpecificQueue(path);
	}
}

function processSpecificQueue(path) {
	const queue = audioQueues[path];
	if (!queue || queue.length === 0) {
		activeWorkers[path] = false;
		return;
	}
	activeWorkers[path] = true;
	let task = queue.shift();
	const now = Date.now();
	if (now - task.timestamp > SOUND_EXPIRATION_MS) {
		audioQueues[path] = [];
		activeWorkers[path] = false;
		return;
	}
	let player = getAvailablePlayer(path);
	player.volume = task.volume * GLOBAL_VOLUME * 0.01;
	if (player.currentTime > 0) {
		player.currentTime = 0;
	}
	player.play().catch(e => {
		if (e.name !== "NotAllowedError") console.warn(`Audio error:`,
			e);
	});
	setTimeout(() => processSpecificQueue(path), MIN_INTERVAL);
}

function getAvailablePlayer(path) {
	if (!audioCache[path]) audioCache[path] = [];
	let player = audioCache[path].find(p => p.paused || p.ended);
	if (!player) {
		if (audioCache[path].length < 10) {
			player = new Audio(path);
			player.preload = 'auto';
			audioCache[path].push(player);
		}
		else {
			player = audioCache[path][0];
			audioCache[path].push(audioCache[path].shift());
		}
	}
	return player;
}
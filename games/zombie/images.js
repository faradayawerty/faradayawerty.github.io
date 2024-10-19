
function images_get() {
	let im = {
		player: new Image(),
		enemy: new Image()
	};
	im.player.src = 'data/img/player.png';
	im.enemy.src = 'data/img/zombie.png';
	return im;
}


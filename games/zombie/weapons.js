
function weapons_get() {
	let w = {
		assault_rifle: function(g, x, y, dx, dy) {
			bullet_create(g, x, y, dx + 0.1 * (Math.random() - 0.5), dy + 0.1 * (Math.random() - 0.5), 2.5);
			return 20; // cooldown millis
		},
		shotgun: function(g, x, y, dx, dy) {
			audio_play(g.audio.gunshot);
			for(let i = 0; i < 10 + 10 * Math.random(); i++)
				bullet_create(g, x, y, dx + 0.5 * (Math.random() - 0.5), dy + 0.5 * (Math.random() - 0.5), 2.5 + Math.random());
			return 750; // cooldown millis
		}
	};
	return w;
}

function weapons_shoot(g, w, x, y, dx, dy, cd) {
	if(cd > 0)
		return cd;
	if(cd < 0)
		cd = 0;
	let r = Math.sqrt(dx*dx + dy*dy);
	return cd + w(g, x, y, dx/r, dy/r);
}


function weapons_get() {
	let w = {
		assault_rifle: function(g, x, y, dx, dy) {
			bullet_create(g, x + dx, y + dy, dx + 0.2 * (Math.random() - 0.5), dy + 0.2 * (Math.random() - 0.5), 0.5 + 2 * Math.random(), 1.5 * Math.random());
			return 50; // cooldown millis
		},
		shotgun: function(g, x, y, dx, dy) {
			audio_play(g.audio.gunshot);
			for (let i = 0; i < 10 + 10 * Math.random(); i++)
				bullet_create(g, x + dx, y + dy, dx + 0.6 * (Math.random() - 0.5), dy + 0.6 * (Math.random() - 0.5), 1 + 0.5 * Math.random(), 0.5 + 0.5 * Math.random());
			return 750; // cooldown millis
		},
		pistol: function(g, x, y, dx, dy) {
			audio_play(g.audio.gunshot);
			bullet_create(g, x + dx, y + dy, dx + 0.1 * (Math.random() - 0.5), dy + 0.1 * (Math.random() - 0.5), 0.5 + 0.5 * Math.random(), 2 + 0.5 * Math.random());
			return 500; // cooldown millis
		}
	};
	return w;
}

function weapons_shoot(g, w, x, y, dx, dy, cd) {
	if (cd > 0)
		return cd;
	if (cd < 0)
		cd = 0;
	let r = Math.sqrt(dx * dx + dy * dy);
	return cd + w(g, x, y, dx / r, dy / r);
}

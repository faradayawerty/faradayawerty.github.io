
europe_tilegrid = generatePerlinNoise(256, 256);

function generatePerlinNoise(width, height, scale = 100) {
	// Вспомогательные функции
	function fade(t) {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	function lerp(a, b, t) {
		return a + t * (b - a);
	}

	function grad(hash, x, y) {
		const h = hash & 3;
		const u = h < 2 ? x : y;
		const v = h < 2 ? y : x;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
	}

	// Пермутейшн таблица
	const p = new Uint8Array(512);
	const permutation = Array.from({ length: 256 }, (_, i) => i);
	for (let i = 0; i < 256; i++) {
		const j = Math.floor(Math.random() * 256);
		[permutation[i], permutation[j]] = [permutation[j], permutation[i]];
	}
	for (let i = 0; i < 512; i++) {
		p[i] = permutation[i % 256];
	}

	function perlin(x, y) {
		const xi = Math.floor(x) & 255;
		const yi = Math.floor(y) & 255;

		const xf = x - Math.floor(x);
		const yf = y - Math.floor(y);

		const u = fade(xf);
		const v = fade(yf);

		const aa = p[p[xi] + yi];
		const ab = p[p[xi] + yi + 1];
		const ba = p[p[xi + 1] + yi];
		const bb = p[p[xi + 1] + yi + 1];

		const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
		const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);

		return (lerp(x1, x2, v) + 1) / 2; // нормализуем в [0, 1]
	}

	// Генерация tilegrid
	const tilegrid = [];

	for (let y = 0; y < height; y++) {
		let row = '';
		for (let x = 0; x < width; x++) {
			const noise = perlin(x / scale, y / scale);

			let tile = 'g'; // трава по умолчанию

			if (noise < 0.35) tile = 'w';       // вода
			else if (noise < 0.45) tile = 's';  // пляж
			else if (noise > 0.75) tile = 't';  // скалы
			// остальное — трава

			row += tile;
		}
		tilegrid.push(row);
	}

	return tilegrid;
}



function decorative_get() {
	let d = {
		trees: [] // [{x, y}, {x, y}, ...]
	};
	return d;
}

function decorative_draw_grass(ctx, g, follow_object_x, follow_object_y) {
	for (let i = -window.innerWidth / g.unit / 1.5; i < window.innerWidth / g.unit / 1.5; i++)
		for (let j = -window.innerHeight / g.unit / 1.5; j < window.innerHeight / g.unit / 1.5; j++) {
			colors = [ '#010', '#020', '#021', '#030', '#031', '#032', '#121', '#130', '#131', '#132', '#140', '#141', '#142' ];
			let x = Math.floor(follow_object_x + i), y = Math.floor(follow_object_y + j);
			ctx.fillStyle = colors[Math.abs((2 * x + 3 * y) % colors.length)];
			ctx.fillRect(Math.floor(follow_object_x + i), Math.floor(follow_object_y + j), 1, 1);
		}
}

function decorative_draw_trees(ctx, g, follow_object_x, follow_object_y) {
	for(let i = 0; i < g.decorative.trees.length; i++) {
		ctx.fillStyle = 'green';
		ctx.fillRect(g.decorative.trees[i].x - 1.5, g.decorative.trees[i].y - 1.5, 3, 2);
		ctx.fillStyle = 'brown';
		ctx.fillRect(g.decorative.trees[i].x - 0.5, g.decorative.trees[i].y - 0.5, 1, 2);
	}
}


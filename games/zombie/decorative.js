
function decorative_draw_grass(ctx, follow_object_x, follow_object_y) {
	for(let i = -32; i < 32; i++)
		for(let j = -32; j < 32; j++) {
			colors = [
				'#010',
				'#011',
				'#021',
				'#032',
				'#142',
				'#153',
				'#163'
			];
			ctx.fillStyle = colors[(137 + Math.floor(follow_object_x + i) * 71 % 13 + Math.floor(follow_object_y + j) * 11 % 8) % colors.length];
			ctx.fillRect(Math.floor(follow_object_x + i), Math.floor(follow_object_y + j), 1, 1);
		}
}


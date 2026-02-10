function trashcan_create(g, x, y) {
	let trashcans = g.objects.filter((obj) => obj.name == "trashcan" && !obj
		.destroyed);
	if (trashcans.length > 30) {
		for (let i = 0; i < trashcans.length - 30; i++) {
			trashcan_destroy(trashcans[i]);
		}
	}
	let width = 40;
	let height = 60;
	let t = {
		health: 100,
		max_health: 100,
		w: width,
		h: height,
		body: Matter.Bodies.rectangle(x, y, width, height, {
			inertia: Infinity,
			mass: 1000.5,
			friction: 0.5,
			restitution: 0.1,
			collisionFilter: {
				"category": 2
			}
		})
	};
	let itrash = game_object_create(g, "trashcan", t, trashcan_update,
		trashcan_draw, trashcan_destroy);
	if (itrash > -1) {
		g.objects[itrash].persistent = true;
		Matter.Composite.add(g.engine.world, t.body);
	}
	return itrash;
}

function trashcan_update(self, dt) {
	let p = self.data;
	if (p.health <= 0) {
		let count = Math.floor(Math.random() * 4);
		for (let i = 0; i < count; i++) {
			if (Math.random() < 0.75) {
				let junk_id = ITEMS_JUNK[Math.floor(Math.random() * ITEMS_JUNK
					.length)];
				let offsetX = (Math.random() - 0.5) * 20;
				let offsetY = (Math.random() - 0.5) * 20;
				item_create(self.game, junk_id, p.body.position.x + offsetX, p
					.body.position.y + offsetY);
			}
		}
		if (Math.random() < 0.25)
			item_spawn(self.game, p.body.position.x, p.body.position.y, null,
				LEVEL_TILE_RESIDENTIAL_T_SOUTH, null);
		trashcan_destroy(self);
	}
}

function trashcan_draw(self, ctx) {
	let p = self.data;
	ctx.save();
	ctx.translate(p.body.position.x, p.body.position.y);
	ctx.rotate(p.body.angle);
	ctx.fillStyle = "#555555";
	ctx.strokeStyle = "#333333";
	ctx.lineWidth = 2;
	roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 5, true, true);
	ctx.beginPath();
	for (let i = -15; i <= 15; i += 10) {
		ctx.moveTo(i, -p.h / 2 + 10);
		ctx.lineTo(i, p.h / 2 - 10);
	}
	ctx.stroke();
	ctx.restore();
}

function trashcan_destroy(self) {
	if (self.destroyed) return;
	if (self.data.body) {
		Matter.Composite.remove(self.game.engine.world, self.data.body);
		self.data.body = null;
	}
	self.destroyed = true;
}
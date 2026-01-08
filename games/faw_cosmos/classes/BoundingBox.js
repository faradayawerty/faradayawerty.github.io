
class BoundingBox {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw(ctx) {
		ctx.strokeStyle = "white";
		ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}

	isInside(target) {
		Validate.assert(target.x !== undefined && target.y !== undefined && target.w !== undefined && target.h !== undefined, "target has to have x,y,w,h");
		return target.x - target.w / 2 >= this.x - this.w / 2 && target.x + target.w / 2 <= this.x + this.w / 2 && target.y - target.h / 2 >= this.y - this.h / 2 && target.y + target.h / 2 <= this.y + this.h / 2;
	}

	correctPosition(target) {
		Validate.assert(target.x !== undefined && target.y !== undefined && target.w !== undefined && target.h !== undefined, "target has to have x,y,w,h");
		if (target.x - target.w / 2 < this.x - this.w / 2)
			target.x = (this.x - this.w / 2) + target.w / 2;
		if (target.x + target.w / 2 > this.x + this.w / 2)
			target.x = (this.x + this.w / 2) - target.w / 2;
		if (target.y - target.h / 2 < this.y - this.h / 2)
			target.y = (this.y - this.h / 2) + target.h / 2;
		if (target.y + target.h / 2 > this.y + this.h / 2)
			target.y = (this.y + this.h / 2) - target.h / 2;
	}

}

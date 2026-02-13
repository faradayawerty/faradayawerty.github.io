function story_note_create(g) {
	let note = {
		title: "",
		content: "",
		date: "",
		pages: [],
		current_page: 0,
		base_width: 700,
		base_height: 850,
		_was_pressed: true,
		active_touch_id: null
	};
	return game_gui_element_create(g, "story_note", note, story_note_update,
		story_note_draw, story_note_destroy);
}

function story_note_destroy(ne) {
	ne.destroyed = true;
}

function get_note_rect(ne) {
	let data = ne.data;
	let scale = get_scale();
	let screenW = window.innerWidth / scale;
	let screenH = window.innerHeight / scale;
	let w = Math.min(data.base_width, screenW * 0.8);
	let h = Math.min(data.base_height, screenH * 0.85);
	let x = (screenW - w) / 2;
	let y = (screenH - h) / 2;
	if (ne.game.mobile && y < 60) y = 60;
	return {
		x,
		y,
		w,
		h
	};
}

function story_note_update(ne, dt) {
	if (!ne.shown) {
		ne.data._was_pressed = ne.game.input.mouse.leftButtonPressed;
		return;
	}
	let data = ne.data;
	let game = ne.game;
	let input = game.input;
	let scale = get_scale();
	let mx = input.mouse.x / scale;
	let my = input.mouse.y / scale;
	let is_clicked = false;
	if (game.mobile) {
		let freeTouch = input.touch.find(t => t.id !== input.joystick.left.id &&
			t.id !== input.joystick.right.id);
		if (freeTouch) {
			mx = freeTouch.x / scale;
			my = freeTouch.y / scale;
			if (data.active_touch_id !== freeTouch.id) {
				data.active_touch_id = freeTouch.id;
			}
			data._was_pressed = true;
		}
		else {
			if (data._was_pressed) {
				is_clicked = true;
				data._was_pressed = false;
				data.active_touch_id = null;
			}
		}
	}
	else {
		let current_left = input.mouse.leftButtonPressed;
		if (data._was_pressed && !current_left) is_clicked = true;
		data._was_pressed = current_left;
	}
	if (is_clicked) {
		let rect = get_note_rect(ne);
		let closeX = rect.x + rect.w - 40;
		let closeY = rect.y + 40;
		let arrowY = rect.y + rect.h - 50;
		let nextArrowX = rect.x + rect.w - 70;
		let prevArrowX = rect.x + 70;
		if (doRectsCollide(mx, my, 0, 0, closeX - 30, closeY - 30, 60, 60)) {
			ne.shown = false;
		}
		else if (doRectsCollide(mx, my, 0, 0, nextArrowX - 50, arrowY - 40, 100,
				80)) {
			if (data.current_page < data.pages.length - 1) data.current_page++;
		}
		else if (doRectsCollide(mx, my, 0, 0, prevArrowX - 50, arrowY - 40, 100,
				80)) {
			if (data.current_page > 0) data.current_page--;
		}
	}
}

function story_note_draw(ne, ctx) {
	if (!ne.shown) return;
	let data = ne.data;
	let game = ne.game;
	let scale = get_scale();
	let mx, my;
	if (game.mobile) {
		let freeTouch = game.input.touch.find(t => t.id !== game.input.joystick
			.left.id && t.id !== game.input.joystick.right.id);
		mx = freeTouch ? freeTouch.x / scale : -1000;
		my = freeTouch ? freeTouch.y / scale : -1000;
	}
	else {
		mx = game.input.mouse.x / scale;
		my = game.input.mouse.y / scale;
	}
	let rect = get_note_rect(ne);
	let padding = 60;
	let textAreaWidth = rect.w - (padding * 2);
	let textAreaHeight = rect.h - 180;
	if (data.pages.length === 0 && data.content.length > 0) {
		ctx.font = game.mobile ? "26px serif" : "24px serif";
		data.pages = wrapStoryTextPaginated(ctx, data.content, textAreaWidth,
			textAreaHeight, 32);
	}
	ctx.save();
	ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	ctx.fillRect(0, 0, window.innerWidth / scale, window.innerHeight / scale);
	ctx.globalAlpha = 0.98;
	ctx.shadowColor = "rgba(0,0,0,0.5)";
	ctx.shadowBlur = 20;
	ctx.fillStyle = "#f4e4bc";
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	ctx.shadowBlur = 0;
	ctx.strokeStyle = "#d2b48c";
	ctx.lineWidth = 6;
	ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
	let closeX = rect.x + rect.w - 40;
	let closeY = rect.y + 40;
	let isHoverClose = doRectsCollide(mx, my, 0, 0, closeX - 25, closeY - 25,
		50, 50);
	ctx.strokeStyle = isHoverClose ? "#a03010" : "#8b4513";
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(closeX - 12, closeY - 12);
	ctx.lineTo(closeX + 12, closeY + 12);
	ctx.moveTo(closeX + 12, closeY - 12);
	ctx.lineTo(closeX - 12, closeY + 12);
	ctx.stroke();
	ctx.fillStyle = "#2c241a";
	ctx.textAlign = "center";
	ctx.font = "bold 38px serif";
	ctx.fillText(data.title, rect.x + rect.w / 2, rect.y + 75);
	let fontSize = game.mobile ? 26 : 24;
	let lineHeight = 32;
	ctx.font = fontSize + "px serif";
	ctx.fillStyle = "#332211";
	ctx.textAlign = "left";
	let lines = data.pages[data.current_page] || [];
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trim();
		let lineY = rect.y + 140 + (i * lineHeight);
		let words = line.split(' ');
		let isLastLine = (i === lines.length - 1);
		if (isLastLine || words.length === 1) {
			ctx.fillText(line, rect.x + padding, lineY);
		}
		else {
			let totalWordsWidth = 0;
			for (let word of words) {
				totalWordsWidth += ctx.measureText(word).width;
			}
			let spaceCount = words.length - 1;
			let totalSpaceWidth = textAreaWidth - totalWordsWidth;
			let spaceWidth = totalSpaceWidth / spaceCount;
			let currentX = rect.x + padding;
			for (let j = 0; j < words.length; j++) {
				ctx.fillText(words[j], currentX, lineY);
				currentX += ctx.measureText(words[j]).width + spaceWidth;
			}
		}
	}
	if (data.pages.length > 1) {
		let arrowY = rect.y + rect.h - 50;
		let nextArrowX = rect.x + rect.w - 70;
		let prevArrowX = rect.x + 70;
		ctx.fillStyle = "#8b4513";
		ctx.font = "italic 22px serif";
		ctx.textAlign = "center";
		ctx.fillText((data.current_page + 1) + " / " + data.pages.length, rect
			.x + rect.w / 2, arrowY + 10);
		let isHoverNext = doRectsCollide(mx, my, 0, 0, nextArrowX - 50, arrowY -
			40, 100, 80);
		let canGoNext = data.current_page < data.pages.length - 1;
		drawStyledArrow(ctx, nextArrowX, arrowY, 35, "right", isHoverNext &&
			canGoNext, canGoNext ? 1.0 : 0.2);
		let isHoverPrev = doRectsCollide(mx, my, 0, 0, prevArrowX - 50, arrowY -
			40, 100, 80);
		let canGoPrev = data.current_page > 0;
		drawStyledArrow(ctx, prevArrowX, arrowY, 35, "left", isHoverPrev &&
			canGoPrev, canGoPrev ? 1.0 : 0.2);
	}
	ctx.restore();
}

function drawStyledArrow(ctx, x, y, size, direction, isHovered, alpha) {
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.strokeStyle = isHovered ? "#a03010" : "#8b4513";
	ctx.lineWidth = 6;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	if (direction === "right") {
		ctx.moveTo(x - size / 2, y - size / 2);
		ctx.lineTo(x + size / 2, y);
		ctx.lineTo(x - size / 2, y + size / 2);
	}
	else {
		ctx.moveTo(x + size / 2, y - size / 2);
		ctx.lineTo(x - size / 2, y);
		ctx.lineTo(x + size / 2, y + size / 2);
	}
	ctx.stroke();
	ctx.restore();
}

function wrapStoryTextPaginated(ctx, text, maxWidth, maxHeight, lineHeight) {
	let words = text.split(' ');
	let pages = [];
	let lines = [];
	let line = '';
	let maxLinesPerPage = Math.floor(maxHeight / lineHeight);
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + ' ';
		if (ctx.measureText(testLine).width > maxWidth && n > 0) {
			lines.push(line);
			line = words[n] + ' ';
			if (lines.length >= maxLinesPerPage) {
				pages.push(lines);
				lines = [];
			}
		}
		else line = testLine;
	}
	lines.push(line);
	pages.push(lines);
	return pages;
}

function wrapStoryText(ctx, text, x, y, maxWidth, lineHeight) {
	let words = text.split(' ');
	let line = '';
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + ' ';
		if (ctx.measureText(testLine).width > maxWidth && n > 0) {
			ctx.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, y);
}
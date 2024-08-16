
function getInputHandler() {
  return {
    keys: {},
    mouse: {}
  };
}

function keyHandler(keys, e) {
	keys[e.key] = e.type === 'keyup' ? false : true;
}

function mouseHandler(mouse, ctx, e) {
	mouse.x = (e.clientX - ctx.canvas.offsetLeft) * ctx.canvas.width / ctx.canvas.clientWidth;
  mouse.y = (e.clientY - ctx.canvas.offsetTop) * ctx.canvas.height / ctx.canvas.clientHeight;
  mouse.leftButtonPressed = e.buttons === 1 ? true : false;
}

function initializeKeyboardInput(keys) {
  window.addEventListener('keydown', function(e) {
    keyHandler(keys, e);
    });
  window.addEventListener('keyup', function(e) {
    keyHandler(keys, e);
    });
}

function initializeMouseInput(mouse, ctx) {
  window.addEventListener('mousemove', function(e) {
    mouseHandler(mouse, ctx, e);
    });
  window.addEventListener('mousedown', function(e) {
    mouseHandler(mouse, ctx, e);
    });
  window.addEventListener('mouseup', function(e) {
    mouseHandler(mouse, ctx, e);
    });
}


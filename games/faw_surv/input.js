
function get_Input() {
	return {
		walk_up: false,
		walk_down: false,
		walk_left: false,
		walk_right: false,

		shoot_x: -1,
		shoot_y: -1,

		action: false,
		inventory: false,

		pause: false
	};
}

function setupInputListeners(input) {
  document.addEventListener('keydown', (e) => {
	switch(e.key.toLowerCase()) {
		case 'w':
		  input.walk_up = true;
		  break;
		case 's':
		  input.walk_down = true;
		  break;
		case 'a':
		  input.walk_left = true;
		  break;
		case 'd':
		  input.walk_right = true;
		  break;
		case 'e':
		  input.action = true;
		  break;
		case 'i':
		  input.inventory = true;
		  break;
		case 'p':
		  input.pause = true;
		  break;
	}
  });

  document.addEventListener('keyup', (e) => {
	switch(e.key.toLowerCase()) {
		case 'w':
		  input.walk_up = false;
		  break;
		case 's':
		  input.walk_down = false;
		  break;
		case 'a':
		  input.walk_left = false;
		  break;
		case 'd':
		  input.walk_right = false;
		  break;
		case 'e':
		  input.action = false;
		  break;
		case 'i':
		  input.inventory = false;
		  break;
		case 'p':
		  input.pause = false;
		  break;
	}
  });

  document.addEventListener('click', (e) => {
	input.shoot_x = e.clientX;
	input.shoot_y = e.clientY;
  });
}

function resetInput(input) {
  input.walk_up = false;
  input.walk_down = false;
  input.walk_left = false;
  input.walk_right = false;
  input.shoot_x = -1;
  input.shoot_y = -1;
  input.action = false;
  input.inventory = false;
  input.pause = false;
}


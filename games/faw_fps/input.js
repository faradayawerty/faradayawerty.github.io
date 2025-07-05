
// Основной объект input, который будет содержать состояния для клавиатуры, мыши и касаний.
let input = {
   keys: {},        // Объект для отслеживания нажатых клавиш.
   mouse: {         // Информация о мыши: текущая позиция, смещения и состояния кнопок.
	  x: 0,
	  y: 0,
	  dx: 0,
	  dy: 0,
	  pressed: {}  // pressed[button] = true, если кнопка нажата
   },
   touches: {}      // Объект для отслеживания тач-событий. Ключ – identifier касания.
};

// --- Обработчики событий клавиатуры ---
window.addEventListener('keydown', function(e) {
   input.keys[e.key] = true;
});

window.addEventListener('keyup', function(e) {
   input.keys[e.key] = false;
});

// --- Обработчики событий мыши ---
window.addEventListener('mousemove', function(e) {
   // Можно использовать e.movementX и e.movementY для смещения
   input.mouse.dx = e.movementX;
   input.mouse.dy = e.movementY;
   input.mouse.x = e.clientX;
   input.mouse.y = e.clientY;
});

window.addEventListener('mousedown', function(e) {
   input.mouse.pressed[e.button] = true;
});

window.addEventListener('mouseup', function(e) {
   input.mouse.pressed[e.button] = false;
});

// --- Обработчики событий для касаний (touch) ---
// При старте касания создаём запись для каждого касания с уникальным identifier
window.addEventListener('touchstart', function(e) {
   // preventDefault() предотвращает нежелательные эффекты, например, скроллинг
   e.preventDefault();
   for (let i = 0; i < e.changedTouches.length; i++) {
	  const touch = e.changedTouches[i];
	  input.touches[touch.identifier] = {
		 x: touch.clientX,
		 y: touch.clientY,
		 dx: 0,
		 dy: 0,
		 startX: touch.clientX,
		 startY: touch.clientY
	  };
   }
}, { passive: false });

// При движении касания обновляем координаты и высчитываем смещение
window.addEventListener('touchmove', function(e) {
   e.preventDefault();
   for (let i = 0; i < e.changedTouches.length; i++) {
	  const touch = e.changedTouches[i];
	  const id = touch.identifier;
	  if (input.touches[id]) {
		 let touchObj = input.touches[id];
		 touchObj.dx = touch.clientX - touchObj.x;
		 touchObj.dy = touch.clientY - touchObj.y;
		 touchObj.x = touch.clientX;
		 touchObj.y = touch.clientY;
	  }
   }
}, { passive: false });

// При окончании касания удаляем соответствующую запись
window.addEventListener('touchend', function(e) {
   e.preventDefault();
   for (let i = 0; i < e.changedTouches.length; i++) {
	  const touch = e.changedTouches[i];
	  delete input.touches[touch.identifier];
   }
}, { passive: false });

// Если касание было прервано системой (например, звонок)
window.addEventListener('touchcancel', function(e) {
   e.preventDefault();
   for (let i = 0; i < e.changedTouches.length; i++) {
	  const touch = e.changedTouches[i];
	  delete input.touches[touch.identifier];
   }
}, { passive: false });


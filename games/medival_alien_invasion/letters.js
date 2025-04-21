

// had to write my own fonts cause the default ones wouldn't play
// nice with menu buttons

function drawLetter(ctx, letterArray, x, y, pixelSize) {
	if (letterArray === letter_Ё) {
		ctx.fillRect(x + 1 * pixelSize, y - 2 * pixelSize, pixelSize, pixelSize);
		ctx.fillRect(x + 3 * pixelSize, y - 2 * pixelSize, pixelSize, pixelSize);
	}
	if (letterArray === letter_Й) {
		ctx.fillRect(x + 1 * pixelSize, y - 2 * pixelSize, pixelSize, pixelSize);
		ctx.fillRect(x + 2 * pixelSize, y - 2 * pixelSize, pixelSize, pixelSize);
		ctx.fillRect(x + 3 * pixelSize, y - 2 * pixelSize, pixelSize, pixelSize);
	}
	for (let row = 0; row < letterArray.length; row++) {
		for (let col = 0; col < letterArray[row].length; col++)
			if (letterArray[row][col] === "1")
				ctx.fillRect(x + col * pixelSize, y + row * pixelSize,
					pixelSize, pixelSize);
	}
}

// so bad but works
function drawStr(ctx, text, x, y, pixelSize, spacing = 3, spaceWidth = 5) {
	let cursorX = x;

	for (let char of text.toUpperCase()) {
		let letterArray = null;

		switch (char) {
			case 'A': letterArray = letter_A; break;
			case 'B': letterArray = letter_B; break;
			case 'C': letterArray = letter_C; break;
			case 'D': letterArray = letter_D; break;
			case 'E': letterArray = letter_E; break;
			case 'F': letterArray = letter_F; break;
			case 'G': letterArray = letter_G; break;
			case 'H': letterArray = letter_H; break;
			case 'I': letterArray = letter_I; break;
			case 'J': letterArray = letter_J; break;
			case 'K': letterArray = letter_K; break;
			case 'L': letterArray = letter_L; break;
			case 'M': letterArray = letter_M; break;
			case 'N': letterArray = letter_N; break;
			case 'O': letterArray = letter_O; break;
			case 'P': letterArray = letter_P; break;
			case 'Q': letterArray = letter_Q; break;
			case 'R': letterArray = letter_R; break;
			case 'S': letterArray = letter_S; break;
			case 'T': letterArray = letter_T; break;
			case 'U': letterArray = letter_U; break;
			case 'V': letterArray = letter_V; break;
			case 'W': letterArray = letter_W; break;
			case 'X': letterArray = letter_X; break;
			case 'Y': letterArray = letter_Y; break;
			case 'Z': letterArray = letter_Z; break;
			case 'А': letterArray = letter_А; break;
			case 'Б': letterArray = letter_Б; break;
			case 'В': letterArray = letter_В; break;
			case 'Г': letterArray = letter_Г; break;
			case 'Д': letterArray = letter_Д; break;
			case 'Е': letterArray = letter_Е; break;
			case 'Ё': letterArray = letter_Ё; break;
			case 'Ж': letterArray = letter_Ж; break;
			case 'З': letterArray = letter_З; break;
			case 'И': letterArray = letter_И; break;
			case 'Й': letterArray = letter_Й; break;
			case 'К': letterArray = letter_К; break;
			case 'Л': letterArray = letter_Л; break;
			case 'М': letterArray = letter_М; break;
			case 'Н': letterArray = letter_Н; break;
			case 'О': letterArray = letter_О; break;
			case 'П': letterArray = letter_П; break;
			case 'Р': letterArray = letter_Р; break;
			case 'С': letterArray = letter_С; break;
			case 'Т': letterArray = letter_Т; break;
			case 'У': letterArray = letter_У; break;
			case 'Ф': letterArray = letter_Ф; break;
			case 'Х': letterArray = letter_Х; break;
			case 'Ц': letterArray = letter_Ц; break;
			case 'Ч': letterArray = letter_Ч; break;
			case 'Ш': letterArray = letter_Ш; break;
			case 'Щ': letterArray = letter_Щ; break;
			case 'Ъ': letterArray = letter_Ъ; break;
			case 'Ы': letterArray = letter_Ы; break;
			case 'Ь': letterArray = letter_Ь; break;
			case 'Э': letterArray = letter_Э; break;
			case 'Ю': letterArray = letter_Ю; break;
			case 'Я': letterArray = letter_Я; break;
			case ':': letterArray = letter_colon; break;
			case ' ': cursorX += spaceWidth * pixelSize; continue;
			default: continue; // неизвестный символ — пропустить
		}

		if (letterArray)
			drawLetter(ctx, letterArray, cursorX, y, pixelSize);

		cursorX += (5 * pixelSize) + spacing;
	}
}

const letter_A = [
	"01110",
	"10001",
	"11111",
	"10001",
	"10001",
];

const letter_B = [
	"11110",
	"10001",
	"11110",
	"10001",
	"11110",
];

const letter_C = [
	"01111",
	"10000",
	"10000",
	"10000",
	"01111",
];

const letter_D = [
	"11110",
	"10001",
	"10001",
	"10001",
	"11110",
];

const letter_E = [
	"11111",
	"10000",
	"11110",
	"10000",
	"11111",
];

const letter_F = [
	"11111",
	"10000",
	"11110",
	"10000",
	"10000",
];

const letter_G = [
	"01111",
	"10000",
	"10011",
	"10001",
	"01110",
];

const letter_H = [
	"10001",
	"10001",
	"11111",
	"10001",
	"10001",
];

const letter_I = [
	"01110",
	"00100",
	"00100",
	"00100",
	"01110",
];

const letter_J = [
	"00001",
	"00001",
	"00001",
	"10001",
	"01110",
];

const letter_K = [
	"10001",
	"10010",
	"11100",
	"10010",
	"10001",
];

const letter_L = [
	"10000",
	"10000",
	"10000",
	"10000",
	"11111",
];

const letter_M = [
	"10001",
	"11011",
	"10101",
	"10001",
	"10001",
];

const letter_N = [
	"10001",
	"11001",
	"10101",
	"10011",
	"10001",
];

const letter_O = [
	"01110",
	"10001",
	"10001",
	"10001",
	"01110",
];

const letter_P = [
	"11110",
	"10001",
	"11110",
	"10000",
	"10000",
];

const letter_Q = [
	"01110",
	"10001",
	"10001",
	"10011",
	"01111",
];

const letter_R = [
	"11110",
	"10001",
	"11110",
	"10010",
	"10001",
];

const letter_S = [
	"01111",
	"10000",
	"01110",
	"00001",
	"11110",
];

const letter_T = [
	"11111",
	"00100",
	"00100",
	"00100",
	"00100",
];

const letter_U = [
	"10001",
	"10001",
	"10001",
	"10001",
	"01110",
];

const letter_V = [
	"10001",
	"10001",
	"10001",
	"01010",
	"00100",
];

const letter_W = [
	"10001",
	"10001",
	"10101",
	"11011",
	"10001",
];

const letter_X = [
	"10001",
	"01010",
	"00100",
	"01010",
	"10001",
];

const letter_Y = [
	"10001",
	"01010",
	"00100",
	"00100",
	"00100",
];

const letter_Z = [
	"11111",
	"00010",
	"00100",
	"01000",
	"11111",
];

const letter_А = [
	"01110",
	"10001",
	"11111",
	"10001",
	"10001",
];

const letter_Б = [
	"11111",
	"10000",
	"11110",
	"10001",
	"11110",
];

const letter_В = [
	"11110",
	"10001",
	"11110",
	"10001",
	"11110",
];

const letter_Г = [
	"11111",
	"10000",
	"10000",
	"10000",
	"10000",
];

const letter_Д = [
	"00111",
	"01001",
	"01001",
	"11111",
	"10001",
];

const letter_Е = [
	"11111",
	"10000",
	"11110",
	"10000",
	"11111",
];

const letter_Ё = [
	"11111",
	"10000",
	"11100",
	"10000",
	"11111",
];

const letter_Ж = [
	"10101",
	"01110",
	"11111",
	"01110",
	"10101",
];

const letter_З = [
	"11110",
	"00001",
	"00110",
	"00001",
	"11110",
];

const letter_И = [
	"10001",
	"10011",
	"10101",
	"11001",
	"10001",
];

const letter_Й = [
	"10001",
	"10011",
	"10101",
	"11001",
	"10001",
];

const letter_К = [
	"10001",
	"10010",
	"11100",
	"10010",
	"10001",
];

const letter_Л = [
	"00111",
	"01001",
	"10001",
	"10001",
	"10001",
];

const letter_М = [
	"10001",
	"11011",
	"10101",
	"10001",
	"10001",
];

const letter_Н = [
	"10001",
	"10001",
	"11111",
	"10001",
	"10001",
];

const letter_О = [
	"01110",
	"10001",
	"10001",
	"10001",
	"01110",
];

const letter_П = [
	"11111",
	"10001",
	"10001",
	"10001",
	"10001",
];

const letter_Р = [
	"11110",
	"10001",
	"11110",
	"10000",
	"10000",
];

const letter_С = [
	"01110",
	"10001",
	"10000",
	"10001",
	"01110",
];

const letter_Т = [
	"11111",
	"00100",
	"00100",
	"00100",
	"00100",
];

const letter_У = [
	"10001",
	"10001",
	"01111",
	"00001",
	"11110",
];

const letter_Ф = [
	"01110",
	"10101",
	"01110",
	"00100",
	"00100",
];

const letter_Х = [
	"10001",
	"01010",
	"00100",
	"01010",
	"10001",
];

const letter_Ц = [
	"10010",
	"10010",
	"10010",
	"10010",
	"11111",
];

const letter_Ч = [
	"10001",
	"10001",
	"01111",
	"00001",
	"00001",
];

const letter_Ш = [
	"10101",
	"10101",
	"10101",
	"10101",
	"11111",
];

const letter_Щ = [
	"10101",
	"10101",
	"10101",
	"11111",
	"00001",
];

const letter_Ъ = [
	"11000",
	"01000",
	"01110",
	"01001",
	"01110",
];

const letter_Ы = [
	"10001",
	"10001",
	"11101",
	"10101",
	"11101",
];

const letter_Ь = [
	"10000",
	"10000",
	"11110",
	"10001",
	"11110",
];

const letter_Э = [
	"01110",
	"00001",
	"01111",
	"00001",
	"01110",
];

const letter_Ю = [
	"10010",
	"10101",
	"11101",
	"10101",
	"10010",
];

const letter_Я = [
	"01110",
	"10001",
	"01111",
	"00101",
	"01001",
];

const letter_colon = [
	"00000",
	"00100",
	"00000",
	"00100",
	"00000",
];

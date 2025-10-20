
function main() {
	document.title = "Guess Who!";
	document.head.appendChild(Object.assign(document.createElement('link'), {rel:'icon', href:'icon.png'}));
	document.body.style.backgroundColor = "#aabbcc";
	document.body.style.fontFamily = "Arial, sans-serif";
	document.body.style.margin = "0";
	document.body.style.padding = "0";
}

window.addEventListener("DOMContentLoaded", main);


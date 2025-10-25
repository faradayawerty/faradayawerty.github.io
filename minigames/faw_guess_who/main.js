
function updateLayout(layoutElements) {
	if(window.innerWidth > window.innerHeight)
		document.body.style.flexDirection = "row";
	else
		document.body.style.flexDirection = "column";
	for(let i = 0; i < layoutElements.length; i++)
		layoutElements[i].updateLayout(layoutElements[i].htmlContainer);
}

function main() {
	document.title = "Guess Who!";
	document.body.style.backgroundColor = "#aabbcc";
	document.body.style.fontFamily = "Arial, sans-serif";
	document.body.style.margin = "0";
	document.body.style.padding = "0";
	document.body.style.display = 'flex';

	// somehow setting an icon without html is that difficult in js
	// hate the language but have no other options
	document.head.appendChild(Object.assign(
		document.createElement('link'), {rel:'icon', href:'icon.png'}));

	let pc = new PictureContainer();
	let cc = new ChatContainer();

	updateLayout([pc, cc]);
	window.addEventListener('resize', function() { updateLayout([pc, cc]); });
}

window.addEventListener("DOMContentLoaded", main);


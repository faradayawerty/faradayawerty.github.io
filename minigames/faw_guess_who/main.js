
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

	let existingMeta = document.querySelector('meta[name="viewport"]');
	if (!existingMeta) {
	    let meta = document.createElement('meta');
	    meta.name = 'viewport';
	    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
	    document.head.appendChild(meta);
	} else {
	    existingMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
	}

	let pc = new PictureContainer();
	let cc = new ChatContainer();

	updateLayout([pc, cc]);
	window.addEventListener('resize', function() { updateLayout([pc, cc]); });

	pc.addButton("connect", null);
	pc.addButton("host", null);
	pc.addButton("set pictures", null);
}

window.addEventListener("DOMContentLoaded", main);


export var isKeyPressed = { 
	'd': false, // Dev toools (Alt Shift D)
	'i': false, // Was planned to be dev tools (Alt Shift I)
	's': false, // Planned to be in a shortcut for settings
 }

window.onkeydown = function (e) {
	if (!e) e = window.event;
	isKeyPressed[e.key] = true;
	shiftHeld = e.shiftKey;
	altHeld = e.altKey
};

window.onkeyup = function (e) {
	if (!e) e = window.event;
	isKeyPressed[e.key] = false;
	shiftHeld = e.shiftKey;
	altHeld = e.altKey
};

window.onmousemove = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
	altHeld = e.altKey
};

export let shiftHeld, altHeld;
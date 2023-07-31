import {modalShown, modalPage} from "./stores.js"
var isKeyPressed = { 
   'd': false, // Dev toools (Alt Shift D)
   'i': false, // Was planned to be dev tools (Alt Shift I)
   's': false, // Planned to be in a shortcut for settings
}
window.onkeydown = function (e) {
	isKeyPressed[e.key] = true;
	if (isKeyPressed["d"] && keydownEvent.altKey && keydownEvent.shiftKey) {
		$modalShown = true
		$modalPage = "devTools"
	};
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

window.onkeyup = function (e) {
	isKeyPressed[e.key] = false;
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

window.onmousemove = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

export let shiftHeld;

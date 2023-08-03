
window.onkeydown = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
	if (e.shiftKey) console.log("shift down")
};

window.onkeyup = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
	if (e.shiftKey) console.log("shift up")
};

window.onmousemove = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

export let shiftHeld;

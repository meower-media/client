window.onkeydown = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

window.onkeyup = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

window.onmousemove = function (e) {
	if (!e) e = window.event;
	shiftHeld = e.shiftKey;
};

export let shiftHeld;

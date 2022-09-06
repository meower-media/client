window.onkeydown = function (e) {
    if (!e) e = window.event;
    shiftHeld = e.keyCode === 16;
}

window.onmousemove = function (e) {
    if (!e) e = window.event;
    shiftHeld = e.shiftKey;
}

export let shiftHeld;
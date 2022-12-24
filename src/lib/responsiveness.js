import {writable} from "svelte/store";

export const width = writable(0);
export const height = writable(0);
export const mobile = writable(false);

export function updateSize() {
	width.set(window.innerWidth);
	height.set(window.innerHeight);
	mobile.set(
		window.innerWidth < window.innerHeight ||
			window.innerWidth < 500 ||
			window.innerHeight < 400
	);
}

updateSize();
window.addEventListener("resize", updateSize);

export const touch = writable(false);

export function updateTouch(e) {
	touch.set(e.pointerType !== "mouse");
}
if (PointerEvent) {
	window.addEventListener("pointerdown", updateTouch);
}

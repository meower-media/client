import {writable} from "svelte/store";;

export const width = writable(0);
export const height = writable(0);
export const mobile = writable(false);

export function update() {
	width.set(window.innerWidth);
	height.set(window.innerHeight);
	mobile.set(
		window.innerWidth < 250 ||
		window.innerHeight < 360
	);
}

update();
window.addEventListener("resize", update);
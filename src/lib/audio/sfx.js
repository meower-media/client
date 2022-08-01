import {user} from "../stores.js";

import deny from "../../assets/sfx/deny.wav";
import menu from "../../assets/sfx/menu.wav";
import select from "../../assets/sfx/select.wav";
import start from "../../assets/sfx/start.wav";

let $user = null;
user.subscribe(v => $user = v);

export const soundEls = {
	deny: new Audio(deny),
	menu: new Audio(menu),
	select: new Audio(select),
	start: new Audio(start),
};

// Preload sounds
for (const el of Object.values(soundEls)) {
	el.preload = "auto";
}

export function play(sound) {
	if (!soundEls[sound]) return;
	if (!$user.sfx) return;

	try {
		soundEls[sound].cloneNode().play();
	} catch (e) {}
}
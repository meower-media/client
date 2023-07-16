import {audioData} from "./BGMdata.js";
import {user} from "./stores.js";

// Music that runs in the background

let _user = null;
user.subscribe(v => {
	_user = v;
	if (_user.name)
		localStorage.setItem(
			"meower_savedconfig",
			JSON.stringify({theme: _user.theme, mode: _user.mode})
		);
});

let audio;
// @ts-ignore
if (window.meower_audio) {
	// @ts-ignore
	window.meower_audio.pause();
	// @ts-ignore
	window.meower_audio = null;
}

let playingBGM = null;
let hasPlayedNow = false;

export async function playBGM(id) {
	try {
		playingBGM = id;
		if (!_user.bgm) {
			stopBGM();
			return;
		}
		if (audio) {
			audio.pause();
		}
		audio = new Audio(
			new URL(
				`../assets/bgm/${audioData[id - 1].file}`,
				import.meta.url
			).href
		);
		// @ts-ignore
		window.meower_audio = audio;
		audio.loop = true;
		await audio.play();
	} catch (e) {
		// The user likely hasn't clicked yet, ignore
	}
}

export function stopBGM() {
	playingBGM = null;
	if (audio) {
		audio.pause();
	} else {
		console.log("No audio to stop, skipping.");
	}
}

export function canPlayNow() {
	if (playingBGM && !hasPlayedNow) {
		playBGM(playingBGM);
		hasPlayedNow = true;
	}
}

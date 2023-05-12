import {apiUrl} from "./urls.js";
import {AudioJSON} from "./BGM_Json.js"
import {user} from "./stores.js"

let _user = null;
user.subscribe(v => {
	_user = v;
	if (_user.name)
		localStorage.setItem(
			"meower_savedconfig",
			JSON.stringify({theme: _user.theme, mode: _user.mode})
		);
});

const AudioPath = "../src/assets/bgm/"

let audio;

export function PlayBGM(id) {
    if (!_user.bgm) {StopBGM(); return;}
    if (audio) {audio.pause();}
    audio = new Audio(AudioPath+AudioJSON[id-1].file);
    audio.loop = true;
	audio.play();
}

export function StopBGM() {
    if (audio) {
        audio.pause();
    } else {
        console.log("No audio to stop, skipping.")
    }
}
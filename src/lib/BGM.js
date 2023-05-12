let audio;

import {apiUrl} from "./urls.js";
import {AudioJSON} from "./BGM_Json.js"

const AudioPath = "../src/assets/bgm/"

export function PlayBGM(id) {
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
let audio;

import {apiUrl} from "./urls.js";

const AudioPath = "../src/assets/bgm"

const AudioJSON = [
    {"name":"night sky","assetId":"0c38836da69714eae0f2a6662f9cbc58.wav"},
    {"name":"percussion bass loop","assetId":"6e1576462ac271ca5847a68dca722265.wav"},
    {"name":"piano ear grapes","assetId":"2885eb62f10a5a18368d5481e1ac9f97.mp3"},
    {"name":"p.b.loop remix","assetId":"8fdc80585a238ea7a82adff23a274fb5.wav"},
    {"name":"untitled","assetId":"c778052bfee4d6255c08411f60747bee.wav"},
    {"name":"meower.","assetId":"e5bf32d41ea8c9dc1b2546fa7c7780bb.mp3"},
    {"name":"untitled2","assetId":"2c0293c58590d4d0ff3a0636f197d9ca.mp3"},
    {"name":"meower is (not) dead","assetId":"c25441be9d4f5547baf85cc444253259.mp3"},
    {"name":"the elevator of time","assetId":"d56dc789ac58918b555c666935e56392.wav"},
    {"name":"meower is (not) dead instrumental","assetId":"8437988a9f23bb09fd6a50b280e5bed9.wav"}]

export function PlayBGM(id) {
    if (audio) {audio.pause();}
    audio = new Audio(AudioPath);
	audio.play();
}

export function StopBGM() {
    if (audio) {
        audio.pause();
    } else {
        console.log("No audio to stop, skipping.")
    }
}
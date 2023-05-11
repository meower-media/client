let music = [""]

let audio;

function PlayBGM(id) {
    if (audio) {audio.pause();}
    audio = new Audio(music[id]);
	audio.play();
}
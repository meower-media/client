function notification() {
    var audio = new Audio('../src/assets/menu_notify.wav');
    audio.play();
}

export function playNotification() {
    notification();
}
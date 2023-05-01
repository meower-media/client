export function emojify(text) {
    const split = text.split("");
    const tmp = new Array(split.length);

    for (const i in split) {
        if (/\p{Emoji}/u.test(split[i]) && isNaN(parseInt(split[i])) && split[i] != "*" && split[i] != "#") {
            tmp[i] = `<img src="https://static.revolt.chat/emoji/mutant/${split[i].codePointAt(0).toString(16)}.svg" class="emoji">`;
        } else {
            tmp[i] = split[i];
        }
    }

    return tmp.join("");
}
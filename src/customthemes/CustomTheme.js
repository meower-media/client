// Save layout
// custom:mainhex;backgroundhex;foregroundhex;foreground2hex;pfphex

//Ex. custom:f9a636;ffffff;000000;ffffff;ffffff

let Fallback = {"orange": "f9a636","orangeButton": "f9a636","orangeLight": "ffce8c","orangeDark": "b46d34","background": "ffffff","foreground": "000000","foregroundOrange": "ffffff"}

import {
	user
} from "./stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export function SaveTheme(Main, Background, Foreground, Foreground2, Pfp) {

}

export function LoadTheme() {
    var theme = _user.theme
    alert(theme.slice(0,6))
}
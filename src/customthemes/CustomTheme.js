// Save layout
// custom:mainhex;backgroundhex;foregroundhex;foreground2hex;pfphex
// Ex. custom:f9a636;ffffff;000000;ffffff;ffffff

// CST: maybe it should be JSON

let fallback = {
	orange: "f9a636",
	orangeButton: "f9a636",
	orangeLight: "ffce8c",
	orangeDark: "b46d34",
	background: "ffffff",
	foreground: "000000",
	foregroundOrange: "ffffff"
};

import {
	user
} from "../lib/stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export function themeToString(theme) {
	return "custom:" + JSON.stringify(theme);
}

export function stringToTheme(string) {
	if (!string.startsWith("custom:")) return fallback;
	try {
		const json = JSON.parse(string.substring(7));
		return Object.assign(fallback, {
			orange: json.orange,
			orangeButton: json.orangeButton,
			orangeLight: json.orangeLight,
			orangeDark: json.orangeDark,
			background: json.background,
			foreground: json.foreground,
			foregroundOrange: json.foregroundOrange
		});
	} catch (e) {
		return fallback;
	}
}

export function saveTheme(theme) {

}

export function loadTheme() {
	// store in stores
	// will test custm them e
}

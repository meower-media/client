// Custom themes. Unused

// Save layout
// custom:mainhex;backgroundhex;foregroundhex;foreground2hex;pfphex
// Ex. custom:f9a636;ffffff;000000;ffffff;ffffff

// CST: maybe it should be JSON

export let fallback = {
	orange: "#f9a636",
	orangeLight: "#ffce8c",
	orangeDark: "#b46d34",
	background: "#ffffff",
	foreground: "#000000",
	foregroundOrange: "#ffffff",
	tinting: "#252525"
};

import {
	user,
	useCustomTheme,
	customTheme
} from "./stores.js";

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
		return {
			orange: json.orange,
			orangeLight: json.orangeLight,
			orangeDark: json.orangeDark,
			background: json.background,
			foreground: json.foreground,
			foregroundOrange: json.foregroundOrange,
			tinting: json.tinting
		};
	} catch (e) {
		return fallback;
	}
}

function addHexColor(c1, c2) {
	const octetsRegex = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
	const m1 = c1.match(octetsRegex)
	const m2 = c2.match(octetsRegex)
	if (!m1 || !m2) {
	  throw new Error(`invalid hex color triplet(s): ${c1} / ${c2}`)
	}
	return [1, 2, 3].map(i => {
	  var sum = parseInt(m1[i], 16) + parseInt(m2[i], 16)
	  if (sum > 0xff) {
		sum = 0xff
	  }
	  return sum.toString(16).padStart(2, '0')
	}).join('')
}
  
function removeHexColor(c1, c2) {
	const octetsRegex = /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
	const m1 = c1.match(octetsRegex)
	const m2 = c2.match(octetsRegex)
	if (!m1 || !m2) {
	  throw new Error(`invalid hex color triplet(s): ${c1} / ${c2}`)
	}
	return [1, 2, 3].map(i => {
	  var sum = parseInt(m1[i], 16) - parseInt(m2[i], 16)
	  if (sum < 0x00) {
		sum = 0x00
	  }
	  return sum.toString(16).padStart(2, '0')
	}).join('')
}

export function saveTheme(theme) {
	// theme json: {"Orange":"hex","Add": "10","background":"hex","foreground":hex, "foregroundOrange": "hex"}
	var orangeLight = "#"+addHexColor(theme.Orange.slice(1),theme.Add.slice(1))
	var orangeDark = "#"+removeHexColor(theme.Orange.slice(1),theme.Add.slice(1))

	var themejson = Object.assign({}, fallback);

	themejson.orange = theme.Orange
	themejson.orangeDark = orangeDark
	themejson.orangeLight = orangeLight
	themejson.tinting = theme.Add
	themejson.background = theme.Bg
	themejson.foreground = theme.Fg
	themejson.foregroundOrange = theme.Fg2
	
	_user.theme = themeToString(themejson);
	user.set(_user);
	useCustomTheme.set(true)
	customTheme.set(stringToTheme(_user.theme))
}

export function loadTheme() {
	if (_user.theme.startsWith("custom:")) {
		useCustomTheme.set(true)
		customTheme.set(stringToTheme(_user.theme))
	}
}
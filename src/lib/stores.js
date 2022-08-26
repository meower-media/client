/**
 * @file Stores, not to be confused with shops or those other stores.
 */
import {writable, readable, get} from "svelte/store";
export const screen = writable("setup");
export const mainPage = writable("home");
export const setupPage = writable("logo");
export const pageParam = writable("");

// Used for the disconnected screen
export const disconnected = writable(false);
export const disconnectReason = writable("");

// Cached profiles
export const profileData = writable({});

// User list
export const ulist = writable([]);

// The current user profile
export const user = writable({
	name: null,
	theme: "orange",
	mode: true,
	sfx: true,
	bgm: true,
	bgm_song: 10,
	layout: "new",
	pfp_data: 1,
	quote: "",
});

export const spinner = writable(false);

export const useCustomTheme = writable(false);
export const defaultCustomTheme = readable({
	orange: "#f9a636",
	orangeButton: "#f9a636",
	orangeLight: "#ffce8c",
	orangeDark: "#b46d34",
	background: "#ffffff",
	foreground: "#000000",
	foregroundOrange: "#ffffff",
});
export const customTheme = writable(get(defaultCustomTheme));

try {
	const loadedThemeRaw = localStorage.getItem("meower_customtheme");
	if (loadedThemeRaw) {
		customTheme.set(JSON.parse(loadedThemeRaw));
	} else {
		localStorage.setItem("meower_customtheme", JSON.stringify(get(customTheme)));
	}
} catch(e) {
	localStorage.setItem("meower_customtheme", JSON.stringify(get(customTheme)));
}
const loadedUseTheme = localStorage.getItem("meower_usecustomtheme");
if (loadedUseTheme === null) {
	localStorage.setItem("meower_usecustomtheme", "false");
} else {
	useCustomTheme.set(!!Boolean(loadedUseTheme));
}
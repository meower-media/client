/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";

export const screen = writable("setup");
export const mainPage = writable("home");
export const setupPage = writable("start");

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
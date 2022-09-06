/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";

export const screen = writable("setup");
export const mainPage = writable("home");
export const setupPage = writable("logo");

// Used for the disconnected screen
export const disconnected = writable(false);
export const disconnectReason = writable("");

// Current chat ID
export const chatName = writable("");
export const chatid = writable("");

// Cached profiles
export const profileData = writable({});

// User list
export const ulist = writable([]);

// Last profile clicked
export const profileClicked = writable("");

// Whether the profile picture is being edited
export const pfpSwitcher = writable(false);

// Current auth header
export const auth_header = writable({});

// The current user profile
export const user = writable({
	name: null,
	lvl: 0,
	unread_inbox: false,
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
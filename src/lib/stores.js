/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";

export const screen = writable("setup");
export const mainPage = writable("home");
export const setupPage = writable("logo");

// Used for modal overlay
export const modalShown = writable(false);
export const modalPage = writable("");

// Used for the disconnected screen
export const disconnected = writable(false);
export const disconnectReason = writable("");

// Current chat ID
export const chatName = writable("");
export const chatid = writable("");
export const chatMembers = writable([]);
export const chatOwner = writable("");

// User list
export const ulist = writable([]);

// Last post clicked
export const postClicked = writable({});

// Last profile clicked
export const profileClicked = writable("");

// Last group chat profile clicked
export const profileClicked_GC = writable("");

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
	bgm_song: 2,
	layout: "new",
	pfp_data: 1,
	quote: "",
});

export const spinner = writable(false);

export const windowStyle = writable({});
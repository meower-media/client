/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";
import {systemDarkMode} from "./responsiveness.js";

// Used for setup screen
export const screen = writable("setup");
export const setupPage = writable("logo");

// Used for modal overlay
export const modalStack = writable([]);

// Used for basic modal
export const basicModalTitle = writable("");
export const basicModalDesc = writable("");

// Used for the disconnected screen
export const intentionalDisconnect = writable(false);
export const reconnecting = writable(false);
export const disconnected = writable(false);
export const disconnectReason = writable("");

// Last typed timestamp
export const lastTyped = writable(0);

// Relationships
export const relationships = writable({});

// Chats
export const chats = writable([]);
export const chat = writable({
	_id: "",
	type: 0,
	nickname: "",
	owner: "",
	members: [],
	created: 0,
	last_active: 0,
	deleted: false,
});

// User list
export const ulist = writable([]);

// Mod panel
export const userToMod = writable("");
export const ipToMod = writable("");

// Last (blank) clicked
export const postClicked = writable({
	id: 0,
	post_id: "",
	post_origin: "",
	user: "",
	content: "",
	date: 0,
	edited_at: 0,
	isDeleted: false,
	mod_deleted: false,
	deleted_at: 0,
});
export const profileClicked = writable("");
export const profileClicked_GC = writable("");
export const announcementToSend = writable("");
export const searchQuery = writable("");
export const searchType = writable("");

// OOBE
export const OOBERunning = writable(false);
export const OOBEPage = writable(0);

// Image adding stuff
export const postInput = writable();

// Current auth header
export const authHeader = writable({
	username: null,
	token: null,
});

// The current user profile
export const user = writable({
	name: null,
	permissions: 0,
	unread_inbox: false,
	theme: "orange",
	mode: !systemDarkMode(),
	sfx: true,
	bgm: false,
	bgm_song: 2,
	layout: "new",
	debug: false,
	hide_blocked_users: false,
	favorited_chats: [],
	pfp_data: 1,
	quote: "",
	ban: {
		state: "None",
		expires: 0,
		reason: "",
	},
});
export const userRestricted = writable(false);
export const userSuspended = writable(false);

// Spinner thing
export const spinner = writable(false);

// What is this
export const windowStyle = writable({});

// Custom theme
export const useCustomTheme = writable(false);
export const customTheme = writable({
	orange: "f9a636",
	orangeButton: "f9a636",
	orangeLight: "ffce8c",
	orangeDark: "b46d34",
	background: "ffffff",
	foreground: "000000",
	foregroundOrange: "ffffff",
});

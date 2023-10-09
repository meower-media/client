/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";
import unloadedprofile from "./unloadedprofile.js";

// Used for setup screen
export const screen = writable("setup");
export const setupPage = writable("logo");

// Used for modal overlay
export const modalStack = writable([]);

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
export const user = writable(unloadedprofile());

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

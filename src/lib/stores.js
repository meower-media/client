/**
 * @file Stores, not to be confused with shops or those other stores.
 */

import {writable} from "svelte/store";
import unloadedProfile from "./unloadedprofile.js";
import {fallback as customThemeFallback} from "../lib/customTheme.js";

// Used for setup screen
export const screen = writable("setup");
export const setupPage = writable("logo");

// Used for modal overlay
export const modalShown = writable(false);
export const modalPage = writable("");

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

// Current chat stuff
export const chatid = writable("");
export const chatName = writable("");
export const chatMembers = writable([]);
export const chatOwner = writable("");

// User list
export const ulist = writable([]);

// Mod panel
export const userToMod = writable("");
export const modPanelOpen = writable(false);

// Last _____ clicked
export const postClicked = writable({});
export const profileClicked = writable("");
export const profileClicked_GC = writable("");
export const announcementToSend = writable("");
export const searchQuery = writable("");
export const searchType = writable("");

// OOBE
export const OOBERunning = writable(false);
export const OOBEPage = writable(0);

// Image adding stuff
export const postInput = writable("");

// Current auth header
export const authHeader = writable({});

// The current user profile
export const user = writable(unloadedProfile());

// Spinner thing
export const spinner = writable(false);

// What is this
export const windowStyle = writable({});
export const GroupCats = writable(100);

// Custom theme
export const useCustomTheme = writable(false);
export const currentCustomTheme = writable(customThemeFallback);

/**
 * @file Server-related URL constants.
 */

// wss://server.meower.eu.org/
// The (cl3 rewrite) API URL is https://api.meower.eu.org/

export const debug = false;

export const linkUrl =
	localStorage.getItem("meower_linkurl") ||
	(debug ? "wss://server.meower.eu.org/" : "wss://api.meower.org/v0/cloudlink");
export const apiUrl =
	localStorage.getItem("meower_apiurl") ||
	(debug ? "https://api.meower.eu.org/" : "https://api.meower.org/");
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

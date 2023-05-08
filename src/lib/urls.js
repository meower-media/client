/**
 * @file Server-related URL constants.
 */

//wss://server.meower.eu.org/
//The API URL is https://api.meower.eu.org/

export const Debug = false

export const linkUrl =
	localStorage.getItem("meower_linkurl") || (Debug && "wss://server.meower.eu.org/" || "wss://api.meower.org/v0/cloudlink/");
export const apiUrl =
	localStorage.getItem("meower_apiurl") || (Debug && "https://api.meower.eu.org/" || "https://api.meower.org/");
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

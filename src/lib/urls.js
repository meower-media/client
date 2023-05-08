/**
 * @file Server-related URL constants.
 */

//https://server.meower.eu.org/
//The API URL is https://api.meower.eu.org/


export const linkUrl =
	localStorage.getItem("meower_linkurl") || "wss://api.meower.org/v0/cloudlink/";
export const apiUrl =
	localStorage.getItem("meower_apiurl") || "https://api.meower.org/";
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

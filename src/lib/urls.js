/**
 * @file Server-related URL constants.
 */

export const beta = true;

export const linkUrl =
	localStorage.getItem("meower_linkurl") ||
	(beta
		? "wss://beta.meower.org/api/v0/cloudlink"
		: "wss://api.meower.org/v0/cloudlink");
export const apiUrl =
	localStorage.getItem("meower_apiurl") ||
	(beta ? "https://beta.meower.org/api/" : "https://api.meower.org/");
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

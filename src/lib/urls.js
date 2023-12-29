/**
 * @file Server-related URL constants.
 */

export const beta = false;

export const linkUrl =
	localStorage.getItem("meower_linkurl") || "/api/v0/cloudlink"
export const apiUrl =
	localStorage.getItem("meower_apiurl") || "/api/"
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

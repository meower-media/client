/**
 * @file Server-related URL constants.
 */

export const beta = false;
// get the current domain
export const domain = window.location.host;
export const isSecure = window.location.protocol === "https:";

export const linkUrl =
	localStorage.getItem("meower_linkurl") || (
		window.location.hostname !== "localhost" ?
			`ws${isSecure ? 's' : '' }://${domain}/api/v0/cloudlink`
			: "ws://localhost:3001"
		);
		
export const apiUrl =
	localStorage.getItem("meower_apiurl") || `${window.location.protocol}//${domain}/api/`;
export const encodeApiURLParams =
	localStorage.getItem("meower_encodeapi") || false;

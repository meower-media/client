/**
 * @file Server-related URL constants.
 */

export const linkUrl = localStorage.getItem("meower_linkurl") || "wss://server.meower.org/";
export const apiUrl = localStorage.getItem("meower_apiurl") || "https://api.meower.org/";
export const encodeApiURLParams = localStorage.getItem("meower_encodeapi") || false;
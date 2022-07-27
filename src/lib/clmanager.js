/**
 * @file The "main" CloudLink instance provider, also providing some handy utility functions.
 */

import Cloudlink from "./cloudlink.js";
import {ulist, user, spinner, disconnected, disconnectReason} from "./stores.js";
import unloadedProfile from "./unloadedprofile.js";
import {linkUrl} from "./urls.js";

let _user = null;
user.subscribe(v => _user = v);

/**
 * The single CloudLink instance used by the manager.
 */
export const link = new Cloudlink();
// @ts-ignore
window.cljs = link;

link.log("manager", "started");

/**
 * A variable used to keep track of the manager's main connect event.
 * @type any
 */
let connectEvent = null;
/**
 * A variable used to keep track of the manager's main disconnect event.
 * @type any
 */
let disconnectEvent = null;
/**
 * A variable used to keep track of the manager's main ulist event.
 * @type any
 */
let ulistEvent = null;
/**
 * A variable used to keep track of the manager's pinger interval.
 * @type any
 */
let pingInterval = null;

/**
 * Connect to the server, initializing some other things such as pinging.
 * 
 * @returns {Promise<string>} statusCode A status code.
 */
export async function connect() {
	if (connectEvent) {
		link.off(connectEvent);
		disconnectEvent = null;
	}
	if (disconnectEvent) {
		link.off(disconnectEvent);
		disconnectEvent = null;
	}
	if (ulistEvent) {
		link.off(ulistEvent);
		ulistEvent = null;
	}
	if (pingInterval) {
		clearInterval(pingInterval);
		pingInterval = null;
	}

	disconnectReason.set("");

	link.once("connectionstart", () => {
		connectEvent = link.on("connected", () => {
			disconnected.set(false);
            pingInterval = setInterval(() => {
                link.send({ cmd: "ping", val: "" });
            }, 10000);
		});
		disconnectEvent = link.on("disconnected", (e) => {
			ulist.set([]);
			if (e.reason !== "Intentional disconnect") disconnected.set(true);
			user.set(unloadedProfile());
			if (pingInterval) {
				clearInterval(pingInterval);
				pingInterval = null;
			}
		});
		ulistEvent = link.on("ulist", cmd => {
			const _ulist = cmd.val.split(";");
			if (_ulist[_ulist.length - 1] === "") {
				_ulist.pop();
			}
			ulist.set(_ulist);
		});
	});
	
	disconnected.set(false);
	try {
		return await link.connect(linkUrl);
	} catch(e) {
		link.disconnect();
		disconnectReason.set(e);
		disconnected.set(true);
		link.error("manager", "conenction error:", e);
		return e;
	}
}

/**
 * Safely disconnect from the server.
 */
export async function disconnect() {
	if (!link.ws) {
		link.log("manager", "websocket not present, cancelling safe disconnect");
		return new Promise(r => r());
	}
	if (link.ws.readyState !== 1) {
		link.log("manager", "already disconnected or disconnecting, cancelling safe disconnect");
		return new Promise(r => r());
	}
	link.log("manager", "safely disconnecting");
	return new Promise(resolve => {
		ulist.set([]);
		user.set(unloadedProfile());
		if (disconnectEvent) {
			link.off(disconnectEvent);
			disconnectEvent = null;
		}
		if (pingInterval) {
			clearInterval(pingInterval);
			pingInterval = null;
		}
		link.once("disconnected", resolve);
		link.disconnect(1000, "Intentional disconnect");
	});
}

/**
 * Send a "Meower request" - a packet that makes the server respond with a direct and a statuscode packet.
 * 
 * @param {object} data
 * @returns {Promise<object | string>} Either an object representing the direct command's val parameter (if it resolves), or an error code as a string (if it rejects).
 */
export async function meowerRequest(data) {
	link.log("manager", "meower request", data);
	spinner.set(true);
	return new Promise((resolve, reject) => {
		let returnData = null;
		const timer = setTimeout(() => {
			reject("Timed out");
			spinner.set(false);
		}, 10000);
		const ev = link.sendListener({
			...data,
			listener: "listener_" + Math.floor(Math.random()*10000000),
		}, cmd => {
			if (cmd.cmd === "statuscode") {
				link.off(ev);
				spinner.set(false);

				clearTimeout(timer);

				if (cmd.val === "I:100 | OK") {
					resolve(returnData);
				} else {
					reject(cmd.val);
				}
			} else if (cmd.cmd === "direct") {
				returnData = cmd.val;
			}
		});
	});
}

/**
 * Sends a request to update the user's settings.
 * 
 * @returns {Promise<object | string>} Either an object or an error code; see meowerRequest.
 */
export async function updateProfile() {
	const profile = _user;
	return meowerRequest({
		cmd: "direct",
		val: {
			cmd: "update_config",
			val: {
				theme: profile.theme,
				mode: profile.mode,
				sfx: profile.sfx,
				bgm: profile.bgm,
				bgm_song: profile.bgm_song,
				layout: profile.layout,
				pfp_data: profile.pfp_data,
				quote: profile.quote,
			},
		},
	});
}
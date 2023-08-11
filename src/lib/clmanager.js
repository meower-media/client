/**
 * @file The "main" CloudLink instance provider, also providing some handy utility functions.
 */

import Cloudlink from "./cloudlink.js";
import {
	screen,
	setupPage,
	ulist,
	user,
	authHeader,
	spinner,
	reconnecting,
	disconnected,
	disconnectReason,
} from "./stores.js";
import unloadedProfile from "./unloadedprofile.js";
import {linkUrl} from "./urls.js";
import {tick} from "svelte";

/**
 * A list of status codes that indicate the client will be disconnected.
 */
const disconnectCodes = [
	"E:018 | Account Banned",
	"E:020 | Kicked",
	"E:110 | ID conflict",
	"E:119 | IP Blocked",
];

let _user = null;
user.subscribe(v => {
	_user = v;
	if (_user.name)
		localStorage.setItem(
			"meower_savedconfig",
			JSON.stringify({theme: _user.theme, mode: _user.mode})
		);
});

// Load saved config from local storage
if (localStorage.getItem("meower_savedconfig")) {
	const profile = _user;
	const savedConfig = JSON.parse(localStorage.getItem("meower_savedconfig"));

	profile.theme = savedConfig.theme;
	profile.mode = savedConfig.mode;
	user.set(profile);
}

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
 * A variable used to keep track of the manager's main auth event.
 * @type any
 */
let authEvent = null;
/**
 * A variable used to keep track of new inbox messages.
 * @type any
 */
let inboxMessageEvent = null;
/**
 * A variable used to keep track of any disconnection requests.
 * @type any
 */
let disconnectRequest = null;
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
	if (authEvent) {
		link.off(authEvent);
		authEvent = null;
	}
	if (inboxMessageEvent) {
		link.off(inboxMessageEvent);
		inboxMessageEvent = null;
	}
	if (disconnectRequest) {
		link.off(disconnectRequest);
		disconnectRequest = null;
	}
	if (pingInterval) {
		clearInterval(pingInterval);
		pingInterval = null;
	}

	disconnected.set(false);
	disconnectReason.set("");

	link.once("connectionstart", () => {
		connectEvent = link.on("connected", () => {
			disconnected.set(false);
			pingInterval = setInterval(() => {
				link.send({cmd: "ping", val: ""});
			}, 10000);
		});
		disconnectEvent = link.on("disconnected", async e => {
			// make sure connection was started (we can know by checking if pingInterval is set)
			if (!pingInterval) return;

			// clear ping interval
			clearInterval(pingInterval);
			pingInterval = null;

			// show disconnected modal if disconnect reason is set
			let _disconnectedReason; 
			disconnectReason.subscribe(v => {
				if (v) {
					disconnected.set(true);
					return;
				}
			});

			if (e.code === 1000 || e.code === 1001) {
				ulist.set([]);
				user.set(unloadedProfile());
				return;
			}

			const onErrorEv = link.on("error", async (e) => {
				link.error("manager", "auto-reconnection failed:", e);
				reconnecting.set(true);
				try {
					await link.connect(linkUrl);
				} catch (e) {
					link.error("manager", "connection error:", e);
					link.off(onErrorEv);
					reconnecting.set(false);
					disconnectReason.set(e.reason);
					disconnected.set(true);
				}
			});
			link.once("connected", async () => {
				link.log("manager", "connection restored");
				link.off(onErrorEv);

				// re-authenticate
				let _authHeader = {};
				authHeader.subscribe(v => (_authHeader = v));
				if (_authHeader.username && _authHeader.token) {
					try {
						const authVal = await meowerRequest({
							cmd: "direct",
							val: {
								cmd: "authpswd",
								val: {
									username: _authHeader.username,
									pswd: _authHeader.token,
								},
							},
						});
						const profileVal = await meowerRequest({
							cmd: "direct",
							val: {
								cmd: "get_profile",
								val: authVal.payload.username,
							},
						});
						user.update(v =>
							Object.assign(v, {
								...profileVal.payload,
								name: authVal.payload.username,
							})
						);
					} catch (e) {
						reconnecting.set(false);
						screen.set("blank");
						await tick();
						setupPage.set("reconnect");
						screen.set("setup");
						return;
					}

					// refresh screen
					screen.set("blank");
					await tick();
					screen.set("main");

					// hide modal
					reconnecting.set(false);
				}
			});
			try {
				link.warn("manager", "connection lost with error:", e.code);
				await link.connect(linkUrl);
			} catch (e) {
				link.error("manager", "connection error:", e);
				link.off(onErrorEv);
				disconnectReason.set(e.reason);
				disconnected.set(true);
			}
		});
		ulistEvent = link.on("ulist", cmd => {
			const _ulist = cmd.val.split(";");
			if (_ulist[_ulist.length - 1] === "") {
				_ulist.pop();
			}
			ulist.set(_ulist);
		});
		authEvent = link.on("direct", async cmd => {
			if (cmd.val.mode == "auth") {
				authHeader.set({
					username: cmd.val.payload.username,
					token: cmd.val.payload.token,
				});
				localStorage.setItem(
					"meower_savedusername",
					cmd.val.payload.username
				);
				localStorage.setItem(
					"meower_savedpassword",
					cmd.val.payload.token
				);
			}
		});
		inboxMessageEvent = link.on("direct", cmd => {
			if (cmd.val.mode == "inbox_message") {
				_user.unread_inbox = true;
				user.set(_user);
			}
		});
		disconnectRequest = link.on("direct", cmd => {
			if (disconnectCodes.includes(cmd.val)) {
				disconnectReason.set(cmd.val);
				link.disconnect(1000, "Requested disconnect");
				link.log("manager", "requested disconnect:", cmd.val);
			}
		});
	});

	disconnected.set(false);
	try {
		return await link.connect(linkUrl);
	} catch (e) {
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
		link.log(
			"manager",
			"websocket not present, cancelling safe disconnect"
		);
		return new Promise(r => r());
	}
	if (link.ws.readyState !== 1) {
		link.log(
			"manager",
			"already disconnected or disconnecting, cancelling safe disconnect"
		);
		return new Promise(r => r());
	}
	link.log("manager", "safely disconnecting");
	return new Promise(resolve => {
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
		const ev = link.sendListener(
			{
				...data,
				listener: "listener_" + Math.floor(Math.random() * 10000000),
			},
			cmd => {
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
			}
		);
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
				unread_inbox: profile.unread_inbox,
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

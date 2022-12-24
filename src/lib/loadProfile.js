import {writable} from "svelte/store";
import {apiUrl} from "./urls.js";

export const profileCache = writable({});

let _profileCache;
profileCache.subscribe(v => (_profileCache = v));

export default async function loadProfile(username) {
	if (_profileCache[username] && !_profileCache[username].temporary) {
		return _profileCache[username];
	}

	if (username === "Notification") {
		_profileCache[username] = {
			pfp_data: 101,
		};
		profileCache.set(_profileCache);
		return _profileCache[username];
	} else if (username === "Announcement") {
		_profileCache[username] = {
			pfp_data: 102,
		};
		profileCache.set(_profileCache);
		return _profileCache[username];
	} else if (username === "Server") {
		_profileCache[username] = {
			pfp_data: 102,
		};
		profileCache.set(_profileCache);
		return _profileCache[username];
	}

	_profileCache[username] = {
		pfp_data: -1,
	};
	profileCache.set(_profileCache);

	try {
		const resp = await fetch(`${apiUrl}/users/${username}`);

		if (!resp.ok) {
			throw new Error("response code not OK; code " + resp.status);
		}

		const json = await resp.json();
		_profileCache[username] = json;
		profileCache.set(_profileCache);
	} catch (e) {
		console.log(e);
		_profileCache[username] = {
			error: true,
			pfp_data: -2,
			temporary: true,
		};
		profileCache.set(_profileCache);
		throw e;
	}
	return _profileCache[username];
}

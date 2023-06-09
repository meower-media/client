import {writable} from "svelte/store";
import {apiUrl} from "./urls.js";

export const profileCache = writable({});

let _profileCache;
profileCache.subscribe(v => (_profileCache = v));

const SPECIAL_USERS = {
	Notification: 101,
	Announcement: 102,
	Server: 102,
};

function getCache(username, ignoreSpecialUsers) {
	if (!_profileCache[username]) return undefined;
	if (!ignoreSpecialUsers && username in SPECIAL_USERS) {
		return {
			..._profileCache[username],
			pfp_data: SPECIAL_USERS[username],
		};
	}
	return _profileCache[username];
}

export default async function loadProfile(username, ignoreSpecialUsers) {
	if (_profileCache[username] && !_profileCache[username].temporary) {
		return getCache(username, ignoreSpecialUsers);
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
	return getCache(username, ignoreSpecialUsers);
}

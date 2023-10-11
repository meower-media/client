import {user} from "./stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export const userFlags = {
	SYSTEM: 1,
	DELETED: 2,
	PROTECTED: 4,
	/* potential user flags
	BOT: 8,
	VERIFIED_BOT: 16,
	CAN_UPLOAD_FILES: 32,
	VERIFIED: 64
	*/
};

export const adminPermissions = {
	SYSADMIN: 1,

	VIEW_REPORTS: 2,
	EDIT_REPORTS: 4,

	VIEW_NOTES: 8,
	EDIT_NOTES: 16,

	VIEW_POSTS: 32,
	DELETE_POSTS: 64,

	VIEW_ALTS: 128,
	SEND_ALERTS: 256,
	KICK_USERS: 512,
	CLEAR_USER_QUOTES: 1024,
	VIEW_BAN_STATES: 2048,
	EDIT_BAN_STATES: 4096,
	DELETE_USERS: 8192,

	VIEW_IPS: 16384,
	BLOCK_IPS: 32768,

	VIEW_CHATS: 65536,
	EDIT_CHATS: 131072,

	SEND_ANNOUNCEMENTS: 262144,
};

export const userRestrictions = {
	HOME_POSTS: 1,
	CHAT_POSTS: 2,
	NEW_CHATS: 4,
	EDITING_CHAT_NICKNAMES: 8,
	EDITING_QUOTE: 16,
};

export function hasPermission(permission) {
	if (
		(_user.permissions & adminPermissions.SYSADMIN) ===
		adminPermissions.SYSADMIN
	) {
		return true;
	} else {
		return (_user.permissions & permission) === permission;
	}
}

export function isRestricted(restriction) {
	if (
		_user.ban.state.includes("restriction") &&
		(_user.ban.restrictions & restriction) === restriction
	) {
		if (
			_user.ban.state.includes("perm") ||
			_user.ban.expires > Date.now() / 1000
		) {
			return true;
		} else {
			return false;
		}
	} else if (_user.ban.state.includes("ban")) {
		if (
			_user.ban.state.includes("perm") ||
			_user.ban.expires > Date.now() / 1000
		) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

import {user} from "./stores.js";

let _user = null;
user.subscribe(v => {
	_user = v;
});

export const userFlags = {
	SYSTEM: 1,
	DELETED: 2,
	PROTECTED: 4,
	BOT: 8,
	VERIFIED_BOT: 16,
	CAN_UPLOAD_FILES: 32,
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
	VIEW_INBOXES: 256,
	CLEAR_USER_QUOTES: 512,
	CLEAR_USER_POSTS: 1024,
	SEND_ALERTS: 2048,
	KICK_USERS: 4096,
	VIEW_BAN_STATES: 8192,
	EDIT_BAN_STATES: 16384,
	DELETE_ACCOUNTS: 32768,

	VIEW_IPS: 65536,
	BLOCK_IPS: 131072,

	VIEW_CHATS: 262144,
	EDIT_CHATS: 524288,

	CREATE_ANNOUNCEMENTS: 1048576,

	VIEW_AUDIT_LOG: 2097152,
};

export const restrictions = {
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
		return true;
	} else {
		return false;
	}
}
